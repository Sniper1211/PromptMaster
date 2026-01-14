import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixData() {
  const client = await pool.connect();
  try {
    console.log('Fetching prompts...');
    const res = await client.query('SELECT * FROM prompts ORDER BY id ASC');
    const prompts = res.rows;

    for (const p of prompts) {
      let needsUpdate = false;
      let newTitleZh = p.title_zh;
      let newTitleEn = p.title_en;
      let newDescZh = p.description_zh;
      let newDescEn = p.description_en;

      // Logic to fix data:
      // If title_en is empty but title_zh has content, copy zh to en (better than empty)
      // If title_zh is likely English (ASCII only) and title_en is empty, move it to title_en? 
      // User said: "title_zh and description_zh data is English... should be Chinese"
      // This implies we need to SWAP them or copy them if one is missing.
      
      // Let's ensure no field is empty first by copying from the other language
      if (!newTitleEn && newTitleZh) {
        newTitleEn = newTitleZh;
        needsUpdate = true;
      }
      if (!newTitleZh && newTitleEn) {
        newTitleZh = newTitleEn;
        needsUpdate = true;
      }
      
      if (!newDescEn && newDescZh) {
        newDescEn = newDescZh;
        needsUpdate = true;
      }
      if (!newDescZh && newDescEn) {
        newDescZh = newDescEn;
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`Fixing ID ${p.id}: TitleZH=${newTitleZh}, TitleEN=${newTitleEn}`);
        await client.query(
          `UPDATE prompts SET 
            title_zh = $1, title_en = $2, 
            description_zh = $3, description_en = $4 
           WHERE id = $5`,
          [newTitleZh, newTitleEn, newDescZh, newDescEn, p.id]
        );
      }
    }
    console.log('Data fix complete.');
  } catch (err) {
    console.error('Error fixing data:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

fixData();
