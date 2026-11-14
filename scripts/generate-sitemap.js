import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import { guideArticles } from '../src/data/guides.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (Vercel: process.env is already populated; local: read .env)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = 'https://pentaprompt.com';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Public collection landing pages (must match the slugs routed in src/App.tsx)
const COLLECTION_SLUGS = [
    'writing-prompts',
    'seo-prompts',
    'marketing-prompts',
    'coding-prompts',
    'video-prompts'
];

const staticPaths = ['/', '/guides', '/about', '/contact', '/privacy', '/terms'];

const urlsFor = (routePath) => ({
    en: `${BASE_URL}${routePath === '/' ? '' : routePath}`,
    zh: `${BASE_URL}${routePath === '/' ? '/zh' : `/zh${routePath}`}`
});

const generateSitemap = async () => {
    console.log('Generating sitemap...');

    let promptRows = [];
    try {
        console.log('Fetching prompts from database...');
        const res = await pool.query('SELECT id, created_at FROM prompts ORDER BY id ASC');
        promptRows = res.rows;
        console.log(`Found ${promptRows.length} prompts in database.`);
    } catch (e) {
        console.error('FATAL: could not fetch prompts from database:', e.message);
        await pool.end();
        process.exit(1);
    }
    await pool.end();

    // Each entry is emitted once per language (English at the root, Chinese under /zh)
    // with xhtml:link alternates, which is what Google expects for localized sites.
    const entries = [];
    const addEntry = (routePath, lastmod) => entries.push({ routePath, lastmod });

    staticPaths.forEach((routePath) => addEntry(routePath, null));
    COLLECTION_SLUGS.forEach((slug) => addEntry(`/collections/${slug}`, null));
    guideArticles.forEach((guide) => addEntry(`/guides/${guide.slug}`, null));
    promptRows.forEach((row) => {
        const lastmod = row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : null;
        addEntry(`/prompt/${row.id}`, lastmod);
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    for (const entry of entries) {
        const { en, zh } = urlsFor(entry.routePath);
        for (const loc of [en, zh]) {
            xml += `
  <url>
    <loc>${loc}</loc>${entry.lastmod ? `
    <lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.routePath.startsWith('/prompt/') ? 'monthly' : 'weekly'}</changefreq>
    <priority>${entry.routePath === '/' ? '1.0' : entry.routePath.startsWith('/prompt/') ? '0.7' : '0.8'}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${zh}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
  </url>`;
        }
    }

    xml += `
</urlset>`;

    const publicPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(publicPath, xml);
    console.log(`Sitemap written to ${publicPath} (${entries.length * 2} localized URLs)`);
};

generateSitemap();
