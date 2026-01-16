import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 Client (R2)
const S3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT, // e.g. https://<accountid>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  // 1. Auth Check
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.authorization;

  if (adminPassword && (!authHeader || authHeader !== `Bearer ${adminPassword}`)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filename = req.query.filename;
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    // Generate unique key with folder prefix
    const uniqueKey = `pentaprompt/${Date.now()}-${filename}`;

    // 3. Upload to R2
    // req is a stream. We need to buffer it or stream it.
    // Vercel Serverless 'req' is a Node.js IncomingMessage stream.
    // @aws-sdk/client-s3 supports streaming bodies in Node.js.
    
    // We need to read the stream into a buffer because R2/S3 sometimes needs Content-Length
    // or we can just pass the stream if Content-Length is unknown but chunked encoding is supported.
    // However, for simplicity and reliability with images, let's buffer it.
    
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueKey,
      Body: buffer,
      ContentType: req.headers['content-type'] || 'application/octet-stream', // Try to get content type from header
    };

    await S3.send(new PutObjectCommand(uploadParams));

    // 4. Construct Public URL
    // R2 Public URL logic: https://<custom-domain>/<key> or https://pub-<id>.r2.dev/<key>
    const publicUrlBase = process.env.R2_PUBLIC_URL; // e.g. https://images.pentaprompt.com
    
    if (!publicUrlBase) {
      throw new Error('R2_PUBLIC_URL env var is not set');
    }

    // Ensure no double slashes
    const finalUrl = `${publicUrlBase.replace(/\/$/, '')}/${uniqueKey}`;

    return res.status(200).json({ 
      url: finalUrl,
      pathname: uniqueKey,
      contentType: uploadParams.ContentType
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false, // We handle the stream manually
  },
};
