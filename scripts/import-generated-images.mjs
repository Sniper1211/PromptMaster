/**
 * Import AI-generated prompt images: convert to WebP, upload to Cloudflare R2,
 * optionally update prompts.preview_image_url.
 *
 * Workflow:
 *   1. generate/label images as <promptId>.<png|jpg|jpeg|webp|avif> in one folder
 *      (worklist: PromptMaster-补图工作清单.csv)
 *   2. node scripts/import-generated-images.mjs --dir ~/pm-images --dry-run
 *   3. node scripts/import-generated-images.mjs --dir ~/pm-images --apply
 *
 * Options:
 *   --dir <path>         folder with <promptId>.<ext> files (required)
 *   --apply              write changes to the database (default is dry-run)
 *   --upload-only        upload to R2 but do not touch the database (for pipeline tests)
 *   --replace            also replace prompts that already have an image (default: only fill empty)
 *   --max-width <px>     resize width (default 1200, no upscaling)
 *   --quality <1-100>    WebP quality (default 82)
 *   --prefix <key>       R2 key prefix (default pentaprompt/prompts)
 *   --concurrency <n>    parallel uploads (default 3)
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pg from 'pg';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const ROOT = path.resolve(process.cwd());
dotenv.config({ path: path.join(ROOT, '.env') });

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : fallback;
};
const DIR = getArg('--dir', '');
const APPLY = args.includes('--apply');
const UPLOAD_ONLY = args.includes('--upload-only');
const REPLACE = args.includes('--replace');
const MAX_WIDTH = parseInt(getArg('--max-width', '1200'), 10);
const QUALITY = parseInt(getArg('--quality', '82'), 10);
const PREFIX = getArg('--prefix', 'pentaprompt/prompts').replace(/\/$/, '');
const CONCURRENCY = parseInt(getArg('--concurrency', '3'), 10);
const SUPPORTED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

if (!DIR) {
    console.error('Usage: node scripts/import-generated-images.mjs --dir <folder> [--apply|--upload-only]');
    process.exit(1);
}
if (!fs.existsSync(DIR)) {
    console.error('Folder not found:', DIR);
    process.exit(1);
}

const env = (key) => process.env[key] || '';
const cfg = {
    accessKeyId: env('R2_ACCESS_KEY_ID'),
    secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
    bucket: env('R2_BUCKET_NAME'),
    endpoint: (env('R2_ENDPOINT') || '').replace(/\/$/, ''),
    publicUrl: (env('R2_PUBLIC_URL') || '').replace(/\/$/, ''),
    databaseUrl: env('DATABASE_URL')
};
const missing = Object.entries(cfg).filter(([, value]) => !value).map(([key]) => key);
if (missing.length) {
    console.error('Missing env vars:', missing.join(', '));
    process.exit(1);
}

const s3 = new S3Client({
    region: 'auto',
    endpoint: cfg.endpoint,
    credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey }
});

const files = fs.readdirSync(DIR).filter((file) => SUPPORTED.has(path.extname(file).toLowerCase()));
const jobs = [];
for (const file of files) {
    const id = path.basename(file, path.extname(file)).trim();
    if (!/^[0-9]{1,32}$/.test(id)) {
        console.log('skip (filename is not <promptId>.<ext>):', file);
        continue;
    }
    jobs.push({ id, file });
}

if (!jobs.length) {
    console.error('No <promptId>.<ext> image files found in', DIR);
    process.exit(1);
}

const pool = new pg.Pool({ connectionString: cfg.databaseUrl, ssl: { rejectUnauthorized: false } });
const rows = (await pool.query('SELECT id, preview_image_url FROM prompts WHERE id = ANY($1::text[])', [jobs.map((j) => j.id)])).rows;
const current = new Map(rows.map((row) => [String(row.id), row.preview_image_url || '']));
const unknown = jobs.filter((job) => !current.has(job.id));
if (unknown.length) {
    console.log('skip (prompt id not found):', unknown.map((j) => j.id).join(', '));
}
const work = jobs.filter((job) => current.has(job.id) && (REPLACE || !current.get(job.id)));

const results = [];
let cursor = 0;
const worker = async () => {
    while (cursor < work.length) {
        const job = work[cursor++];
        const sourcePath = path.join(DIR, job.file);
        try {
            const converted = await sharp(sourcePath, { failOn: 'none' })
                .rotate()
                .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                .webp({ quality: QUALITY, effort: 4 })
                .toBuffer();
            const hash = crypto.createHash('sha256').update(converted).digest('hex').slice(0, 8);
            const key = `${PREFIX}/${job.id}-${hash}.webp`;
            const url = `${cfg.publicUrl}/${key}`;

            let alreadyUploaded = false;
            try {
                await s3.send(new HeadObjectCommand({ Bucket: cfg.bucket, Key: key }));
                alreadyUploaded = true;
            } catch {
                alreadyUploaded = false;
            }
            if (!alreadyUploaded) {
                await s3.send(new PutObjectCommand({
                    Bucket: cfg.bucket,
                    Key: key,
                    Body: converted,
                    ContentType: 'image/webp',
                    CacheControl: 'public, max-age=31536000, immutable'
                }));
            }
            results.push({ id: job.id, file: job.file, key, url, bytes: converted.length, status: 'ok' });
            console.log(`  ${job.id}: ${(converted.length / 1024).toFixed(0)}KB -> ${url}`);
        } catch (error) {
            results.push({ id: job.id, file: job.file, status: 'failed', error: error.message });
            console.log(`  ${job.id}: FAILED - ${error.message}`);
        }
    }
};
await Promise.all(Array.from({ length: Math.max(1, CONCURRENCY) }, worker));

const ok = results.filter((r) => r.status === 'ok');
const failed = results.filter((r) => r.status === 'failed');
console.log(`\nuploaded: ${ok.length} | failed: ${failed.length} | skipped: ${jobs.length - work.length}`);
if (failed.length) console.log('failed ids:', failed.map((f) => f.id).join(', '));

if (UPLOAD_ONLY || !APPLY) {
    await pool.end();
    if (!UPLOAD_ONLY) console.log('dry run: R2 uploads done, database NOT changed. Pass --apply to update preview_image_url.');
    process.exit(0);
}

const backupPath = `/tmp/prompt-image-urls-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
const backupRows = (await pool.query('SELECT id, preview_image_url FROM prompts WHERE id = ANY($1::text[])', [ok.map((r) => r.id)])).rows;
fs.writeFileSync(backupPath, JSON.stringify(backupRows, null, 1));
console.log('url backup:', backupPath);

const client = await pool.connect();
let updated = 0;
try {
    await client.query('BEGIN');
    for (const item of ok) {
        const res = await client.query('UPDATE prompts SET preview_image_url = $1 WHERE id = $2', [item.url, item.id]);
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
console.log('Next: rebuild/redeploy so prerendered pages and OG images refresh.');
