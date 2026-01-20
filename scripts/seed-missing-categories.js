import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedMissingCategories() {
  try {
    console.log('🔌 Connecting to database...');
    
    // Read JSON data
    const jsonPath = path.resolve(__dirname, 'data/missing-prompts.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const promptsToInsert = JSON.parse(rawData);
    
    console.log(`📂 Loaded ${promptsToInsert.length} prompts from JSON.`);

    // Get current Max ID to determine start ID
    // Note: We have mixed string IDs (some are timestamps, some are integers).
    // Let's find the max *integer-like* ID to continue the sequence if possible, 
    // OR just use timestamps to be safe and avoid collision.
    // Given the previous IDs were 1-43 and then some timestamps, let's use timestamps for safety.
    // Actually, user prefers readable IDs if possible. Let's try to find max int ID < 1000000.
    
    const idRes = await pool.query("SELECT id FROM prompts WHERE length(id) < 10");
    const existingIds = idRes.rows.map(row => parseInt(row.id)).filter(n => !isNaN(n));
    let nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1000;

    console.log(`🔢 Starting ID sequence from: ${nextId}`);

    for (const p of promptsToInsert) {
      const currentId = nextId.toString();
      const now = new Date().toISOString();
      
      const query = `
        INSERT INTO prompts (
          id, created_at, title_zh, title_en, description_zh, description_en, 
          category, tags, content, chinese_content, expected_output, usage, preview_image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `;

      const values = [
        currentId,
        now,
        p.titleZh,
        p.title,
        p.descriptionZh,
        p.description,
        p.category, // Enum Key (e.g., CODING)
        JSON.stringify(p.tags),
        p.content,
        p.chineseContent,
        p.expectedOutput,
        p.usage,
        '' // previewImageUrl (empty for now)
      ];

      await pool.query(query, values);
      console.log(`✅ Inserted [${p.category}] ${p.title} (ID: ${currentId})`);
      
      nextId++;
    }

    console.log('\n🎉 All done! Missing categories populated.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

seedMissingCategories();
