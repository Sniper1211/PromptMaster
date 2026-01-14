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

async function updatePrompt13Image() {
  const client = await pool.connect();
  try {
    const id = '13';
    const newImageUrl = '/previews/90s-film-portrait-new.webp';
    
    console.log(`Updating Prompt ID ${id} preview image...`);
    
    await client.query(
      `UPDATE prompts SET preview_image_url = $1 WHERE id = $2`,
      [newImageUrl, id]
    );

    console.log(`Success! Updated ID ${id} to use image: ${newImageUrl}`);

  } catch (err) {
    console.error('Error updating prompt:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

updatePrompt13Image();
