/**
 * Localize prompt preview images.
 *
 * Downloads hotlinked preview images (pbs.twimg.com / img.ok9981.com) and the legacy
 * local /previews/* files, converts them to WebP (max width 900, quality 80) and stores
 * them under public/images/prompts/<id>.webp so the site no longer depends on third-party
 * hosts and serves smaller, cacheable assets.
 *
 * Usage:
 *   node scripts/localize-images.mjs                    # process + write files, don't touch DB
 *   node scripts/localize-images.mjs --apply            # also update preview_image_url in DB
 *   node scripts/localize-images.mjs --limit 5          # smoke test
 *   node scripts/localize-images.mjs --force            # reconvert existing files
 *
 * Results are written to /tmp/image-localization-report.json.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(ROOT, '.env') });

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : fallback;
};
const APPLY = args.includes('--apply');
const FORCE = args.includes('--force');
const LIMIT = parseInt(getArg('--limit', '0'), 10) || 0;
const WIDTH = parseInt(getArg('--width', '900'), 10);
const QUALITY = parseInt(getArg('--quality', '80'), 10);
const CONCURRENCY = parseInt(getArg('--concurrency', '4'), 10);

const OUT_DIR = path.join(ROOT, 'public/images/prompts');
const REPORT_PATH = '/tmp/image-localization-report.json';
fs.mkdirSync(OUT_DIR, { recursive: true });

const isExternal = (url) => /^https?:\/\//i.test(url);
const isLocalLegacy = (url) => url.startsWith('/previews/');
const isLocalized = (url) => url.startsWith('/images/prompts/');

const fetchImage = async (url) => {
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 30000);
            const res = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    Accept: 'image/avif,image/webp,image/png,image/jpeg,*/*'
                }
            });
            clearTimeout(timer);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const type = res.headers.get('content-type') || '';
            if (!type.startsWith('image/')) throw new Error(`unexpected content-type ${type}`);
            const buffer = Buffer.from(await res.arrayBuffer());
            if (buffer.length < 500) throw new Error(`suspiciously small image (${buffer.length}B)`);
            if (buffer.length > 20 * 1024 * 1024) throw new Error('image too large');
            return buffer;
        } catch (error) {
            lastError = error;
            await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
        }
    }
    throw lastError;
};

const convert = async (buffer, id) => {
    const pipeline = sharp(buffer, { failOn: 'none' })
        .rotate()
        .resize({ width: WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 4 });
    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
    if (!info.width || info.width < 50) throw new Error('decoded image too small');
    const target = path.join(OUT_DIR, `${id}.webp`);
    fs.writeFileSync(target, data);
    return { bytes: data.length, width: info.width, height: info.height };
};

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const main = async () => {
    const { rows } = await pool.query(
        'SELECT id, preview_image_url FROM prompts WHERE preview_image_url IS NOT NULL AND preview_image_url <> \'\' ORDER BY id ASC'
    );
    let work = rows.filter((row) => {
        if (isLocalized(row.preview_image_url) && !FORCE) return false;
        return isExternal(row.preview_image_url) || isLocalLegacy(row.preview_image_url);
    });
    if (LIMIT > 0) work = work.slice(0, LIMIT);

    console.log(`localizing ${work.length} images (width=${WIDTH}, quality=${QUALITY}, concurrency=${CONCURRENCY})`);
    const results = [];
    let cursor = 0;
    const worker = async () => {
        while (cursor < work.length) {
            const row = work[cursor++];
            const url = String(row.preview_image_url);
            const to = `/images/prompts/${row.id}.webp`;
            try {
                const targetPath = path.join(OUT_DIR, `${row.id}.webp`);
                if (!FORCE && fs.existsSync(targetPath)) {
                    const meta = await sharp(targetPath).metadata();
                    results.push({ id: row.id, from: url, to, status: 'exists', bytes: fs.statSync(targetPath).size, width: meta.width, height: meta.height });
                    continue;
                }
                const buffer = isExternal(url)
                    ? await fetchImage(url)
                    : fs.readFileSync(path.join(ROOT, 'public', url.replace(/^\//, '')));
                const meta = await convert(buffer, row.id);
                results.push({ id: row.id, from: url, to, status: 'ok', ...meta });
            } catch (error) {
                results.push({ id: row.id, from: url, to, status: 'failed', error: error.message });
            }
            if (results.length % 25 === 0) console.log(`  processed ${results.length}/${work.length}`);
        }
    };
    await Promise.all(Array.from({ length: Math.max(1, CONCURRENCY) }, worker));

    const ok = results.filter((r) => r.status === 'ok' || r.status === 'exists');
    const failed = results.filter((r) => r.status === 'failed');
    const totalBytes = ok.reduce((sum, r) => sum + (r.bytes || 0), 0);
    console.log(`\ndone: ${ok.length} localized (${(totalBytes / 1024 / 1024).toFixed(1)} MB), ${failed.length} failed`);
    if (failed.length) console.log('failures:', failed.slice(0, 10).map((f) => `${f.id}: ${f.error}`).join('\n'));

    const report = { generatedAt: new Date().toISOString(), width: WIDTH, quality: QUALITY, results };
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 1));
    console.log('report:', REPORT_PATH);

    if (!APPLY) {
        console.log('files written; pass --apply to update preview_image_url in the database');
        await pool.end();
        return;
    }

    const backupPath = `/tmp/prompt-image-urls-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(backupPath, JSON.stringify(rows, null, 1));
    console.log('url backup:', backupPath);

    const client = await pool.connect();
    let updated = 0;
    try {
        await client.query('BEGIN');
        for (const item of ok) {
            const res = await client.query(
                'UPDATE prompts SET preview_image_url = $1 WHERE id = $2 AND preview_image_url IS NOT NULL',
                [item.to, item.id]
            );
            updated += res.rowCount;
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
    console.log(`database updated: ${updated} rows`);
};

main().catch((error) => {
    console.error('localize images failed:', error.message);
    process.exit(1);
});
