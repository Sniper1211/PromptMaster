import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://promptmaster.com'; // Change this to your actual domain
const PROMPTS_DIR = path.join(__dirname, '../src/data');
const DIST_DIR = path.join(__dirname, '../dist');

// Helper to extract IDs from file content using Regex to avoid TS compilation issues
const extractIds = (content) => {
    const ids = [];
    const regex = /id:\s*['"](\d+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        ids.push(match[1]);
    }
    return ids;
};

const generateSitemap = () => {
    console.log('Generating sitemap...');

    // 1. Static Routes
    const staticRoutes = [
        '/',
        '/privacy',
        '/terms'
    ];

    // 2. Dynamic Routes (Prompts)
    let promptIds = new Set();

    try {
        const files = fs.readdirSync(PROMPTS_DIR);
        files.forEach(file => {
            if (file.endsWith('.ts')) {
                const content = fs.readFileSync(path.join(PROMPTS_DIR, file), 'utf-8');
                const ids = extractIds(content);
                ids.forEach(id => promptIds.add(id));
            }
        });
    } catch (e) {
        console.error("Error reading prompt data:", e);
    }

    console.log(`Found ${promptIds.size} prompts.`);

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

    // 4. Write to dist (if exists, or public)
    // We write to public so it's copied on build, OR write to dist after build.
    // Writing to public is safer for dev.
    const publicPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(publicPath, xml);
    console.log(`Sitemap written to ${publicPath}`);
};

generateSitemap();
