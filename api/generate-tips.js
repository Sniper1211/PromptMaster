import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Missing prompt content' });
  }

  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Deepseek API Key not configured' });
  }

  const openai = new OpenAI({
    baseURL: process.env.AI_BASE_URL || 'https://api.deepseek.com',
    apiKey: apiKey
  });

  try {
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
      response_format: { type: "json_object" }, // Force JSON mode if supported, otherwise prompt engineering handles it
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

    return res.status(200).json(parsedResult);

  } catch (error) {
    console.error('Deepseek API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
