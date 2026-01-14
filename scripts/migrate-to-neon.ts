import 'dotenv/config';
import pg from 'pg';
import { PROMPTS_ZH } from '../src/data/prompts-zh';
import { PROMPTS_EN } from '../src/data/prompts-en';

const { Pool } = pg;

// Get credentials from env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Please set DATABASE_URL in .env file');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Neon and many cloud providers
  }
});

async function main() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to Postgres/Neon...');
    console.log('Creating table...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS prompts (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ,
        title_zh TEXT,
        title_en TEXT,
        description_zh TEXT,
        description_en TEXT,
        category TEXT,
        tags JSONB,
        content TEXT,
        chinese_content TEXT,
        expected_output TEXT,
        usage TEXT,
        preview_image_url TEXT
      )
    `);

    console.log('Migrating data...');
    
    // Merge EN and ZH data based on ID
    const prompts = PROMPTS_ZH.map(zhItem => {
      const enItem = PROMPTS_EN.find(en => en.id === zhItem.id);
      return {
        id: zhItem.id,
        created_at: zhItem.createdAt || new Date().toISOString(),
        title_zh: zhItem.title,
        title_en: enItem?.title || '',
        description_zh: zhItem.description,
        description_en: enItem?.description || '',
        category: zhItem.category,
        tags: JSON.stringify(zhItem.tags),
        content: zhItem.content,
        chinese_content: zhItem.chineseContent || '',
        expected_output: zhItem.expectedOutput,
        usage: zhItem.usage || '',
        preview_image_url: zhItem.previewImageUrl || ''
      };
    });

    let count = 0;
    for (const p of prompts) {
      try {
        await client.query(`
          INSERT INTO prompts (
            id, created_at, title_zh, title_en, description_zh, description_en, 
            category, tags, content, chinese_content, expected_output, usage, preview_image_url
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO UPDATE SET
            title_zh = EXCLUDED.title_zh,
            title_en = EXCLUDED.title_en,
            description_zh = EXCLUDED.description_zh,
            description_en = EXCLUDED.description_en,
            category = EXCLUDED.category,
            tags = EXCLUDED.tags,
            content = EXCLUDED.content,
            chinese_content = EXCLUDED.chinese_content,
            expected_output = EXCLUDED.expected_output,
            usage = EXCLUDED.usage,
            preview_image_url = EXCLUDED.preview_image_url
        `, [
          p.id, p.created_at, p.title_zh, p.title_en, p.description_zh, p.description_en,
          p.category, p.tags, p.content, p.chinese_content, p.expected_output, p.usage, p.preview_image_url
        ]);
        count++;
        if (count % 5 === 0) console.log(`Migrated ${count} prompts...`);
      } catch (e) {
        console.error(`Failed to migrate prompt ${p.id}:`, e);
      }
    }

    console.log(`Migration complete! Successfully migrated ${count} prompts.`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
