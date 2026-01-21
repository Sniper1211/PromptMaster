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

const isBad = (text) => {
  if (!text) return true;
  if (text.trim() === 'null' || text.trim() === 'undefined') return true;
  if (text.includes('{') || text.includes('}')) return true; // JSON artifacts
  if (text.length < 15) return true; // Too short
  if (text.length > 600) return true; // Too long
  // Check if it's just a copy of the title (too simple)
  // if (title && text === title) return true; 
  return false;
};

async function generateDescription(title, content) {
  try {
    const prompt = `
    You are a professional editor. I have a Prompt for an AI model.
    Title: "${title}"
    Content: "${content.substring(0, 500)}..." (truncated)

    Task: Write a concise, engaging description (summary) for this prompt.
    Requirements:
    1. Output JSON only: {"en": "English description", "zh": "中文描述"}
    2. Length: 1-2 sentences (max 150 characters).
    3. No technical jargon, just what it does.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "deepseek-chat", // or gpt-3.5-turbo
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('AI Gen Error:', error.message);
    return null;
  }
}

async function refineDescriptions() {
  try {
    console.log('✨ Connecting to database...');
    
    const query = `
      SELECT id, title_en, content, description_en, description_zh 
      FROM prompts
    `;
    
    const res = await pool.query(query);
    console.log(`🔎 Checking ${res.rowCount} prompts for bad descriptions...`);

    const refinedPrompts = [];

    for (const row of res.rows) {
      const descEn = row.description_en;
      const descZh = row.description_zh;

      const enBad = isBad(descEn);
      const zhBad = isBad(descZh);

      if (enBad || zhBad) {
        console.log(`\n🔧 Refining ID ${row.id}: ${row.title_en}`);
        console.log(`   Bad reason: EN=${enBad}, ZH=${zhBad}`);
        
        const newDesc = await generateDescription(row.title_en, row.content);
        
        if (newDesc) {
          await pool.query(
            'UPDATE prompts SET description_en = $1, description_zh = $2 WHERE id = $3',
            [newDesc.en, newDesc.zh, row.id]
          );
          
          refinedPrompts.push({
            id: row.id,
            title: row.title_en,
            old_en: descEn ? descEn.substring(0, 30) + '...' : 'EMPTY',
            new_en: newDesc.en,
            new_zh: newDesc.zh
          });
          
          process.stdout.write('✅ Saved. ');
        }
      }
    }

    console.log(`\n\n🎉 Finished! Refined ${refinedPrompts.length} prompts.`);
    
    // Generate Markdown Table
    console.log('\n### 📝 Refinement Report');
    console.log('| ID | Title | Old Desc (Truncated) | New Desc (EN) | New Desc (ZH) |');
    console.log('|---|---|---|---|---|');
    refinedPrompts.forEach(p => {
        console.log(`| ${p.id} | ${p.title} | ${p.old_en} | ${p.new_en} | ${p.new_zh} |`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

refineDescriptions();
