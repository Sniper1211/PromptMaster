#!/usr/bin/env node
/**
 * Export public prompt data as static JSON at build time.
 *
 *   node scripts/export-static-data.mjs
 *
 * Output (public/data/, gitignored build artifacts):
 *   index.json            list fields for all prompts (no full content)
 *   prompts/<id>.json     full detail for one prompt
 *   categories.json       category counts + video prompt count
 *   manifest.json         generatedAt + content hash (for cache-busting)
 *
 * The public site reads these files from the CDN instead of hitting the database,
 * so Neon can scale to zero. The DB is still used for admin writes and copy counters.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pg from 'pg';
import dotenv from 'dotenv';

const ROOT = path.resolve(process.cwd());
dotenv.config({ path: path.join(ROOT, '.env') });

const OUT_DIR = path.join(ROOT, 'public/data');
const PROMPTS_DIR = path.join(OUT_DIR, 'prompts');

const safeParseTags = (raw) => {
    if (Array.isArray(raw)) return raw.filter((tag) => typeof tag === 'string');
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.filter((tag) => typeof tag === 'string');
        } catch {
            return raw.split(',').map((tag) => tag.trim()).filter(Boolean);
        }
    }
    return [];
};

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const rows = (await pool.query(`
    SELECT id, created_at, title_zh, title_en, description_zh, description_en, category, tags,
           content, chinese_content, expected_output, usage, preview_image_url,
           base_count, real_copy_count, prompt_type, video_thumbnail_url, source_link, author_name
    FROM prompts
    ORDER BY id ASC
`)).rows;
const categoryRows = (await pool.query('SELECT category, COUNT(*)::int AS count FROM prompts GROUP BY category')).rows;
const videoCountRow = (await pool.query("SELECT COUNT(*)::int AS count FROM prompts WHERE prompt_type = 'video'")).rows[0];
await pool.end();

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(PROMPTS_DIR, { recursive: true });

const index = [];
const promptFiles = [];
for (const row of rows) {
    const copyCount = (row.base_count || 0) + (row.real_copy_count || 0);
    const listEntry = {
        id: String(row.id),
        createdAt: row.created_at,
        titleZh: row.title_zh || '',
        titleEn: row.title_en || '',
        descriptionZh: row.description_zh || '',
        descriptionEn: row.description_en || '',
        category: row.category,
        tags: safeParseTags(row.tags),
        previewImageUrl: row.preview_image_url || '',
        copyCount,
        promptType: row.prompt_type || 'text',
        sourceLink: row.source_link || '',
        authorName: row.author_name || '',
        videoThumbnailUrl: row.video_thumbnail_url || ''
    };
    index.push(listEntry);
    const detail = {
        ...listEntry,
        content: row.content || '',
        chineseContent: row.chinese_content || '',
        expectedOutput: row.expected_output || '',
        usage: row.usage || ''
    };
    const file = path.join(PROMPTS_DIR, `${row.id}.json`);
    fs.writeFileSync(file, JSON.stringify(detail));
    promptFiles.push(file);
}

const counts = categoryRows.reduce((acc, row) => {
    acc[row.category] = row.count;
    return acc;
}, {});
const categories = {
    counts,
    videoPromptCount: videoCountRow?.count ?? 0,
    total: rows.length,
    generatedAt: new Date().toISOString()
};

const indexJson = JSON.stringify(index);
const categoriesJson = JSON.stringify(categories);
fs.writeFileSync(path.join(OUT_DIR, 'index.json'), indexJson);
fs.writeFileSync(path.join(OUT_DIR, 'categories.json'), categoriesJson);

const version = crypto.createHash('sha256').update(indexJson + categoriesJson).digest('hex').slice(0, 12);
fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify({
    version,
    generatedAt: new Date().toISOString(),
    count: rows.length
}));

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;
console.log(`static data: ${rows.length} prompts, ${promptFiles.length} detail files`);
console.log(`  index.json      ${kb(Buffer.byteLength(indexJson))}`);
console.log(`  categories.json ${kb(Buffer.byteLength(categoriesJson))}`);
console.log(`  manifest version ${version}`);
