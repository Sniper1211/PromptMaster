import OpenAI from 'openai';
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
  const endpoint = '/api/generate-tips';
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'] || null;
  const content = req.body?.content;

  const base = {
    requestId,
    endpoint,
    ip,
    userAgent,
    inputPreview: makeInputPreview(content),
    inputHash: makeInputHash(content),
    inputLength: content ? String(content).length : 0,
    model: 'deepseek-chat'
  };
  const finish = (statusCode, success, extra = {}) =>
    logRequest({ ...base, ...extra, statusCode, success, latencyMs: Date.now() - startAt });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!content) {
    return res.status(400).json({ error: 'Missing prompt content' });
  }

  // 1) Auth check
  if (!isAuthorized(req)) {
    await finish(401, false, { isAdmin: false });
    await logError({
      requestId, endpoint, ip, userAgent, statusCode: 401,
      errorMessage: 'Unauthorized', errorDetail: 'Missing or invalid admin token'
    });
    return res.status(401).json({ error: 'Unauthorized' });
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

  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    await finish(500, false, { isAdmin: true });
    await logError({
      requestId, endpoint, ip, userAgent, statusCode: 500,
      errorMessage: 'AI_API_KEY not configured'
    });
    return res.status(500).json({ error: 'Deepseek API Key not configured' });
  }

  try {
    const openai = new OpenAI({
      baseURL: process.env.AI_BASE_URL || 'https://api.deepseek.com',
      apiKey: apiKey
    });

    const systemPrompt = `You are an expert AI Art Prompt Engineer (specializing in Midjourney v6).
Your task is to analyze the user's prompt and generate concise "Usage Tips" in both English and Chinese.
The tips should include recommended parameters (like --ar, --v 6.0, --stylize) and short advice on how to use it best.

Output MUST be a valid JSON object with keys: "usage_en" and "usage_zh".
Do not output markdown code blocks, just the raw JSON string.

Example Output:
{
  "usage_en": "Recommended: --v 6.0 --ar 16:9. Use --style raw for more photorealism.",
  "usage_zh": "建议参数：--v 6.0 --ar 16:9。如果需要更写实的效果，可以添加 --style raw。"
}`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this prompt and give tips:\n\n${content}` }
      ],
      model: "deepseek-chat",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;

    // Parse JSON safely
    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      // Fallback if AI returns markdown wrapper
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    await finish(200, true, { isAdmin: true });
    return res.status(200).json(parsedResult);

  } catch (error) {
    console.error('Deepseek API Error:', error);
    await finish(500, false, { isAdmin: true });
    await logError({
      requestId, endpoint, ip, userAgent, statusCode: 500,
      errorMessage: 'DeepSeek call failed',
      errorDetail: error.message || String(error)
    });
    return res.status(500).json({ error: error.message });
  }
}
