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

const generateSitemap = async () => {
    console.log('Generating sitemap...');

    // 1. Static routes
    const staticRoutes = [
        '/',
        '/discover',
        '/guides',
        '/about',
        '/contact',
        '/privacy',
        '/terms'
    ];

    // 2. Dynamic routes (prompts from DB) — fail loudly if the DB is unreachable,
    //    so we never deploy a sitemap that silently lost all prompt URLs.
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

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    const addUrl = (loc, lastmod, changefreq, priority) => {
        xml += `
  <url>
    <loc>${BASE_URL}${loc}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    };

    staticRoutes.forEach((route) => addUrl(route, null, 'weekly', '0.8'));
    COLLECTION_SLUGS.forEach((slug) => addUrl(`/collections/${slug}`, null, 'weekly', '0.7'));
    guideArticles.forEach((guide) => addUrl(`/guides/${guide.slug}`, null, 'monthly', '0.7'));
    promptRows.forEach((row) => {
        const lastmod = row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : null;
        addUrl(`/prompt/${row.id}`, lastmod, 'monthly', '0.6');
    });

    xml += `
</urlset>`;

    const publicPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(publicPath, xml);
    console.log(`Sitemap written to ${publicPath} (${staticRoutes.length + COLLECTION_SLUGS.length + guideArticles.length + promptRows.length} URLs)`);
};

generateSitemap();
