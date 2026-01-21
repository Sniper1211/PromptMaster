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

async function fixNewlines() {
  try {
    console.log('🧹 Connecting to database...');
    
    // Fetch all prompts
    const query = `
      SELECT id, content, chinese_content, description_zh, description_en 
      FROM prompts
    `;
    
    const res = await pool.query(query);
    console.log(`🔎 Checking ${res.rowCount} prompts for broken newlines...`);

    let fixedCount = 0;

    for (const row of res.rows) {
      let needsUpdate = false;
      const updates = {};
      const fieldsToCheck = ['content', 'chinese_content', 'description_zh', 'description_en'];

      fieldsToCheck.forEach(field => {
        const original = row[field];
        if (original && typeof original === 'string' && original.includes('\\n')) {
          // Fix: Replace literal "\n" with real newline
          // Also handle "\r" just in case
          const fixed = original.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
          
          if (fixed !== original) {
            updates[field] = fixed;
            needsUpdate = true;
          }
        }
      });

      if (needsUpdate) {
        // Construct UPDATE query dynamically
        const setClauses = Object.keys(updates).map((key, idx) => `${key} = $${idx + 1}`);
        const values = Object.values(updates);
        const updateQuery = `UPDATE prompts SET ${setClauses.join(', ')} WHERE id = $${values.length + 1}`;
        
        await pool.query(updateQuery, [...values, row.id]);
        
        fixedCount++;
        if (fixedCount % 10 === 0) process.stdout.write('.');
      }
    }

    console.log(`\n✅ Finished! Fixed broken newlines in ${fixedCount} prompts.`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

fixNewlines();
