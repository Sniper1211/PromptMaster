import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkIds() {
  try {
    console.log('Checking ID range...');
    
    // Check count of IDs that look like small integers (length < 4)
    const countRes = await pool.query("SELECT COUNT(*) FROM prompts WHERE length(id) < 4");
    console.log('Count of IDs with length < 4 (Potential ID 1-999):', countRes.rows[0].count);

    // List IDs that are numeric and small
    const listRes = await pool.query("SELECT id, title_en, title_zh FROM prompts WHERE length(id) < 4 ORDER BY id ASC LIMIT 50");
    console.log('Small IDs found:', listRes.rows.map(r => r.id));
    
    if (listRes.rows.length === 0) {
        console.log('⚠️  NO small IDs found! Legacy data (ID 1-43) is missing from DB.');
    } else {
        console.log('✅  Small IDs found. First one:', listRes.rows[0]);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkIds();
