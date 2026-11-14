import crypto from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const MAX_BYTES = 4 * 1024 * 1024; // Vercel serverless request body limit on Hobby

const S3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
});

/**
 * Admin image upload -> Cloudflare R2.
 *
 * POST /api/upload?promptId=<id>&filename=<name>
 *   Authorization: Bearer <ADMIN_PASSWORD>
 *   Content-Type: image/jpeg|png|webp|avif
 *   Body: raw image bytes
 *
 * Returns the public URL + object key. It does NOT update the database:
 * set prompts.preview_image_url yourself (or use scripts/import-generated-images.mjs,
 * which converts to WebP, uploads and updates the DB in one step).
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
        return res.status(503).json({ error: 'Admin auth is not configured' });
    }
    if (req.headers.authorization !== `Bearer ${adminPassword}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const promptId = String(req.query.promptId || '').trim();
    if (!/^[0-9]{1,32}$/.test(promptId)) {
        return res.status(400).json({ error: 'promptId is required and must be numeric' });
    }

    const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (!ALLOWED_TYPES.has(contentType)) {
        return res.status(415).json({ error: 'Unsupported image type' });
    }

    const bucket = process.env.R2_BUCKET_NAME;
    const publicBase = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
    if (!bucket || !publicBase) {
        return res.status(503).json({ error: 'R2 storage is not configured' });
    }

    const chunks = [];
    let total = 0;
    for await (const chunk of req) {
        total += chunk.length;
        if (total > MAX_BYTES) {
            return res.status(413).json({ error: 'Image is larger than 4MB' });
        }
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    if (buffer.length < 200) {
        return res.status(400).json({ error: 'Empty or invalid image body' });
    }

    try {
        const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 10);
        const ext = contentType.split('/')[1] === 'jpeg' ? 'jpg' : contentType.split('/')[1];
        const key = `pentaprompt/prompts/${promptId}-${hash}.${ext}`;

        await S3.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000, immutable'
        }));

        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json({ url: `${publicBase}/${key}`, key, bytes: buffer.length });
    } catch (error) {
        console.error('[Upload Error]', error?.name, error?.message);
        return res.status(500).json({ error: 'Upload failed' });
    }
}

export const config = {
    api: {
        bodyParser: false
    }
};
