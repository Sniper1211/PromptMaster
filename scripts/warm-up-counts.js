import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function warmUpCounts() {
  try {
    console.log('🔥 Connecting to database...');
    
    // Find prompts with 0 or null base_count
    // We assume real_copy_count might also be 0
    const query = `
      SELECT id, title_en 
      FROM prompts 
      WHERE (base_count IS NULL OR base_count = 0)
    `;
    
    const res = await pool.query(query);
    console.log(`📉 Found ${res.rowCount} prompts with 0 base count.`);

    if (res.rowCount === 0) {
        console.log('✅ All prompts already have a base count.');
        return;
    }

    let updatedCount = 0;

    for (const row of res.rows) {
        // Generate random base count between 42 and 350
        const randomBase = getRandomInt(42, 350);
        
        await pool.query(
            'UPDATE prompts SET base_count = $1 WHERE id = $2',
            [randomBase, row.id]
        );
        
        // Log every 10 updates to avoid spam
        if (updatedCount % 10 === 0) {
            process.stdout.write('.');
        }
        updatedCount++;
    }

    console.log(`\n✅ Successfully warmed up ${updatedCount} prompts with random base counts.`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

warmUpCounts();
