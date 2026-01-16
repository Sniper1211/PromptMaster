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

const updateImage = async () => {
  try {
    const id = '16';
    // Using the R2 URL as requested (Updated to .webp)
    const newImageUrl = 'https://img.ok9981.com/pentaprompt/professional-headshot.webp';
    
    console.log(`Updating Prompt ID ${id} preview image...`);
    const res = await pool.query(
      `UPDATE prompts SET preview_image_url = $1 WHERE id = $2`,
      [newImageUrl, id]
    );
    
    if (res.rowCount === 0) {
      console.log(`Prompt ID ${id} not found in database.`);
    } else {
      console.log(`Success! Updated ID ${id} to use image: ${newImageUrl}`);
    }
  } catch (err) {
    console.error('Error updating prompt:', err);
  } finally {
    await pool.end();
  }
};

updateImage();
