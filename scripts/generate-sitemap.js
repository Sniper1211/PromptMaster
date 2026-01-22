import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = 'https://pentaprompt.com'; // Updated domain
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const generateSitemap = async () => {
    console.log('Generating sitemap...');

    // 1. Static Routes
    const staticRoutes = [
        '/',
        '/privacy',
        '/terms'
    ];

    // 2. Dynamic Routes (Prompts from DB)
    let promptIds = [];

    try {
        console.log('Fetching prompt IDs from database...');
        const res = await pool.query('SELECT id FROM prompts ORDER BY id ASC');
        promptIds = res.rows.map(row => row.id);
        console.log(`Found ${promptIds.length} prompts in database.`);
    } catch (e) {
        console.error("Error fetching prompts from database:", e);
    } finally {
        await pool.end();
    }

    // 3. Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add Static
    staticRoutes.forEach(route => {
        xml += `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add Prompts
    promptIds.forEach(id => {
        xml += `
  <url>
    <loc>${BASE_URL}/prompt/${id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    // 4. Write to public
    const publicPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(publicPath, xml);
    console.log(`Sitemap written to ${publicPath}`);
};

generateSitemap();
