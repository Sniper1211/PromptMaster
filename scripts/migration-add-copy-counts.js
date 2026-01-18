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
    console.log('🚀 Starting migration: Add copy count fields...');

    // 1. Add columns if they don't exist
    await pool.query(`
      ALTER TABLE prompts 
      ADD COLUMN IF NOT EXISTS base_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS real_copy_count INTEGER DEFAULT 0;
    `);
    console.log('✅ Columns added (or already existed).');

    // 2. Fetch all prompts to update base_count
    const { rows: prompts } = await pool.query('SELECT id, base_count FROM prompts');
    
    console.log(`Found ${prompts.length} prompts. Checking for initialization...`);

    let updatedCount = 0;

    for (const prompt of prompts) {
      // Only update if base_count is 0 (assuming we want to init existing ones)
      // Or if it's NULL (though we set default 0, previous rows might be null if not default applied correctly on existing)
      if (!prompt.base_count || prompt.base_count === 0) {
        // Generate random number between 50 and 200
        const randomBase = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
        
        await pool.query(
          'UPDATE prompts SET base_count = $1 WHERE id = $2',
          [randomBase, prompt.id]
        );
        updatedCount++;
      }
    }

    console.log(`✅ Migration complete. Initialized base_count for ${updatedCount} prompts.`);

  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await pool.end();
  }
};

runMigration();
