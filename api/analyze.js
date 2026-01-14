import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { rawText, apiKey, baseUrl, model } = req.body;
    
    const FINAL_API_KEY = apiKey || process.env.AI_API_KEY;
    const FINAL_BASE_URL = baseUrl || process.env.AI_BASE_URL || 'https://api.openai.com/v1';
    const FINAL_MODEL = model || process.env.AI_MODEL || 'gpt-3.5-turbo';

    if (!FINAL_API_KEY) {
      return res.status(400).json({ error: 'Missing API Key' });
    }

    if (!rawText) {
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

    return res.status(200).json(result);

  } catch (error) {
    console.error('[Analyze Error]', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'AI Analysis Failed', 
      details: error.response?.data?.error?.message || error.message 
    });
  }
}
