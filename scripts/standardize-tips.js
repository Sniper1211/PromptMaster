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

async function standardizeUsage(title, currentUsage) {
  try {
    const systemPrompt = `You are an expert translator and AI Prompt Engineer.
The user has an existing "Usage Tip" for an AI prompt, but it might be only in English or only in Chinese, or mixed.
Your task is to convert it into a standard bilingual JSON format.

1. If the input is English, keep it as "usage_en" and translate it to "usage_zh".
2. If the input is Chinese, keep it as "usage_zh" and translate it to "usage_en".
3. If it's already mixed, split it correctly.
4. Improve the clarity if needed.

Output MUST be a valid JSON object with keys: "usage_en" and "usage_zh".`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Title: ${title}\nCurrent Usage: ${currentUsage}` }
      ],
      model: "deepseek-chat", 
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = completion.choices[0].message.content;
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
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

async function run() {
  try {
    console.log('✨ Connecting to database...');
    
    // Find prompts with non-standard usage
    const query = `
      SELECT id, title_en, usage 
      FROM prompts 
      WHERE usage IS NOT NULL 
      AND usage != '' 
      AND usage NOT LIKE '%### Chinese Tips%'
    `;
    
    const res = await pool.query(query);
    console.log(`🔎 Found ${res.rowCount} prompts with non-standard usage tips...`);

    const updatedPrompts = [];

    for (const row of res.rows) {
      console.log(`\n🔄 Standardizing ID ${row.id}: ${row.title_en}`);
      
      const tips = await standardizeUsage(row.title_en, row.usage);
      
      if (tips && tips.usage_zh && tips.usage_en) {
        const formattedUsage = `### Chinese Tips (中文建议)\n${tips.usage_zh}\n\n### English Tips\n${tips.usage_en}`;
        
        await pool.query(
          'UPDATE prompts SET usage = $1 WHERE id = $2',
          [formattedUsage, row.id]
        );
        
        updatedPrompts.push({
            id: row.id,
            title: row.title_en,
            old_usage: row.usage.substring(0, 30) + '...'
        });
        
        process.stdout.write('✅ Saved. ');
      } else {
        console.log('⚠️ Failed to standardize.');
      }
      
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n\n🎉 Finished! Standardized ${updatedPrompts.length} prompts.`);
    
    // Generate Markdown Table
    console.log('\n### 📝 Standardization Report');
    console.log('| ID | Title | Old Usage (Truncated) |');
    console.log('|---|---|---|');
    updatedPrompts.forEach(p => {
        console.log(`| ${p.id} | ${p.title} | ${p.old_usage.replace(/\n/g, ' ')} |`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

run();
