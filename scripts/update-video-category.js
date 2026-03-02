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

const updateCategory = async () => {
  console.log('🔄 Updating video prompts category from VIDEO_GENERATION to VIDEO...');
  
  try {
    // Count before update
    const beforeResult = await pool.query(
      "SELECT COUNT(*) as count FROM prompts WHERE category = 'VIDEO_GENERATION'"
    );
    const beforeCount = parseInt(beforeResult.rows[0].count);
    console.log(`📊 Video prompts before update: ${beforeCount}`);
    
    // Update category
    const updateResult = await pool.query(
      "UPDATE prompts SET category = 'VIDEO' WHERE category = 'VIDEO_GENERATION'"
    );
    console.log(`✅ Updated ${updateResult.rowCount} prompts`);
    
    // Count after update
    const afterResult = await pool.query(
      "SELECT COUNT(*) as count FROM prompts WHERE category = 'VIDEO'"
    );
    const afterCount = parseInt(afterResult.rows[0].count);
    console.log(`📊 Video prompts after update: ${afterCount}`);
    
    // Verify
    if (beforeCount === afterCount) {
      console.log('🎉 Category update successful!');
    } else {
      console.warn('⚠️ Count mismatch, please check manually');
    }
    
  } catch (err) {
    console.error('❌ Update failed:', err);
  } finally {
    await pool.end();
  }
};

updateCategory();