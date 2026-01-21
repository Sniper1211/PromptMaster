import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Setup AI
const apiKey = process.env.AI_API_KEY;
const baseURL = process.env.AI_BASE_URL || 'https://api.deepseek.com';

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL
});

async function generateTips(title, content) {
  try {
    const systemPrompt = `You are an expert AI Art Prompt Engineer (specializing in Midjourney v6).
Your task is to analyze the user's prompt and generate concise "Usage Tips" in both English and Chinese.
The tips should include recommended parameters (like --ar, --v 6.0, --stylize) and short advice on how to use it best.

Output MUST be a valid JSON object with keys: "usage_en" and "usage_zh".
Do not output markdown code blocks, just the raw JSON string.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Title: ${title}\nPrompt: ${content}` }
      ],
      model: "deepseek-chat", // or gpt-3.5-turbo
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
        return null;
      }
    }
    
    return parsedResult;

  } catch (error) {
    console.error('AI Gen Error:', error.message);
    return null;
  }
}

async function generateMissingTips() {
  try {
    console.log('✨ Connecting to database...');
    
    // Find prompts with missing usage
    const query = `
      SELECT id, title_en, content 
      FROM prompts 
      WHERE usage IS NULL OR usage = ''
    `;
    
    const res = await pool.query(query);
    console.log(`🔎 Found ${res.rowCount} prompts with missing usage tips...`);

    let updatedCount = 0;

    for (const row of res.rows) {
      console.log(`\n💡 Generating tips for ID ${row.id}: ${row.title_en}`);
      
      const tips = await generateTips(row.title_en, row.content);
      
      if (tips && tips.usage_zh && tips.usage_en) {
        const formattedUsage = `### Chinese Tips (中文建议)\n${tips.usage_zh}\n\n### English Tips\n${tips.usage_en}`;
        
        await pool.query(
          'UPDATE prompts SET usage = $1 WHERE id = $2',
          [formattedUsage, row.id]
        );
        
        updatedCount++;
        process.stdout.write('✅ Saved. ');
      } else {
        console.log('⚠️ Failed to generate valid tips.');
      }
      
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n\n🎉 Finished! Generated tips for ${updatedCount} prompts.`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

generateMissingTips();
