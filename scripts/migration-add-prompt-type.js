import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const runMigration = async () => {
  try {
    console.log('🚀 Starting migration: Add prompt_type field...');

    // 1. Add prompt_type column if it doesn't exist
    await pool.query(`
      ALTER TABLE prompts 
      ADD COLUMN IF NOT EXISTS prompt_type TEXT DEFAULT 'text';
    `);
    console.log('✅ prompt_type column added (or already existed).');

    // 2. Add video_thumbnail_url column if it doesn't exist
    await pool.query(`
      ALTER TABLE prompts 
      ADD COLUMN IF NOT EXISTS video_thumbnail_url TEXT;
    `);
    console.log('✅ video_thumbnail_url column added (or already existed).');

    // 3. Add source_link column if it doesn't exist (for storing Twitter/X source)
    await pool.query(`
      ALTER TABLE prompts 
      ADD COLUMN IF NOT EXISTS source_link TEXT;
    `);
    console.log('✅ source_link column added (or already existed).');

    // 4. Add author_name column if it doesn't exist
    await pool.query(`
      ALTER TABLE prompts 
      ADD COLUMN IF NOT EXISTS author_name TEXT;
    `);
    console.log('✅ author_name column added (or already existed).');

    console.log('✅ Migration complete. All columns added successfully.');

  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await pool.end();
  }
};

runMigration();