import axios from 'axios';
import {
  getClientIp,
  makeRequestId,
  makeInputHash,
  makeInputPreview,
  countRecentRequests,
  logRequest,
  logError,
  isAuthorized
} from './_lib/aiLog.js';

const RATE_WINDOW_MIN = 10;
const RATE_MAX = parseInt(process.env.AI_RATE_LIMIT_MAX || '20', 10);

export default async function handler(req, res) {
  const startAt = Date.now();
  const requestId = makeRequestId();
  const endpoint = '/api/analyze';
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'] || null;
  const rawText = req.body?.rawText;

  const base = {
    requestId,
    endpoint,
    ip,
    userAgent,
    inputPreview: makeInputPreview(rawText),
    inputHash: makeInputHash(rawText),
    inputLength: rawText ? String(rawText).length : 0
  };
  const finish = (statusCode, success, extra = {}) =>
    logRequest({ ...base, ...extra, statusCode, success, latencyMs: Date.now() - startAt });

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 1) Auth check
  if (!isAuthorized(req)) {
    await finish(401, false, { isAdmin: false });
    await logError({
      requestId, endpoint, ip, userAgent, statusCode: 401,
      errorMessage: 'Unauthorized', errorDetail: 'Missing or invalid admin token'
    });
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin Password' });
  }

  // 2) IP rate limiting
  const recent = await countRecentRequests(ip, RATE_WINDOW_MIN);
  if (recent >= RATE_MAX) {
    await finish(429, false, { isAdmin: true });
    await logError({
      requestId, endpoint, ip, userAgent, statusCode: 429,
      errorMessage: 'Rate limit exceeded',
      errorDetail: `ip=${ip} recent=${recent} max=${RATE_MAX}`
    });
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  try {
    const { apiKey, baseUrl, model } = req.body;

    // Use provided key or env key
    const FINAL_API_KEY = apiKey || process.env.AI_API_KEY;
    const FINAL_BASE_URL = baseUrl || process.env.AI_BASE_URL || 'https://api.openai.com/v1';
    const FINAL_MODEL = model || process.env.AI_MODEL || 'gpt-3.5-turbo';

    if (!FINAL_API_KEY) {
      await finish(400, false, { isAdmin: true });
      return res.status(400).json({ error: 'Missing API Key' });
    }

    if (!rawText) {
      await finish(400, false, { isAdmin: true });
      return res.status(400).json({ error: 'No text provided' });
    }

    const systemPrompt = `
    You are an expert prompt engineer and classifier.
    Your task is to analyze the user's input (which is a raw prompt or description) and extract structured data for a prompt library.
    
    Return ONLY a valid JSON object with no markdown formatting.
    Structure:
    {
      "title": "A short, catchy title in English",
      "titleZh": "A short, catchy title in Chinese (Simp. Chinese)",
      "description": "A 1-sentence summary in English",
      "descriptionZh": "A 1-sentence summary in Chinese (Simp. Chinese)",
      "category": "One of: CODING, WRITING, DESIGN, PRODUCTIVITY, MARKETING, FUN, SEO, LEARNING",
      "tags": ["tag1", "tag2", "tag3"],
      "content": "The actual prompt content in English. If the input is Chinese, translate it to high-quality English prompt.",
      "chineseContent": "The prompt content translated to Chinese. If the input is Chinese, keep it or refine it.",
      "expectedOutput": "What the user should expect (English)",
      "usage": "How to use this prompt (Chinese, short guide)"
    }
    `;

    const response = await axios.post(
      `${FINAL_BASE_URL}/chat/completions`,
      {
        model: FINAL_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: rawText }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${FINAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonString);

    await finish(200, true, { isAdmin: true, model: FINAL_MODEL });
    return res.status(200).json(result);

  } catch (error) {
    console.error('[Analyze Error]', error.response?.data || error.message);
    await finish(500, false, { isAdmin: true });
    await logError({
      requestId, endpoint, ip, userAgent, statusCode: 500,
      errorMessage: 'AI Analysis Failed',
      errorDetail: error.response?.data?.error?.message || error.message
    });
    return res.status(500).json({
      error: 'AI Analysis Failed',
      details: error.response?.data?.error?.message || error.message
    });
  }
}
