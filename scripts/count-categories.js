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
  ssl: {
    rejectUnauthorized: false
  }
});

async function countCategories() {
  try {
    console.log('Connecting to database...');
    const result = await pool.query(`
      SELECT category, COUNT(*) as count 
      FROM prompts 
      GROUP BY category 
      ORDER BY count DESC
    `);

    console.log('\n📊 Category Statistics:');
    console.log('--------------------------------');
    console.log('| Category           | Count |');
    console.log('|--------------------|-------|');
    
    result.rows.forEach(row => {
      console.log(`| ${row.category.padEnd(18)} | ${row.count.toString().padEnd(5)} |`);
    });
    console.log('--------------------------------');
    
    // Total
    const total = result.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
    console.log(`| TOTAL              | ${total.toString().padEnd(5)} |`);
    console.log('--------------------------------\n');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

countCategories();
