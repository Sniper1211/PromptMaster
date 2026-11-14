import fs from 'fs';
import { S3Client, ListObjectsV2Command, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
const env = fs.readFileSync('.env', 'utf8');
const get = (k) => (env.match(new RegExp('^' + k + '=(.*)$', 'm')) || [])[1]?.trim() || '';
const cfg = { accessKeyId: get('R2_ACCESS_KEY_ID'), secretAccessKey: get('R2_SECRET_ACCESS_KEY'), bucket: get('R2_BUCKET_NAME'), endpoint: get('R2_ENDPOINT'), publicUrl: get('R2_PUBLIC_URL') };
const client = new S3Client({ region: 'auto', endpoint: cfg.endpoint, credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey } });
try {
  const listed = await client.send(new ListObjectsV2Command({ Bucket: cfg.bucket, Prefix: 'pentaprompt/test/' }));
  const keys = (listed.Contents || []).map((o) => o.Key);
  console.log('leftover test objects:', JSON.stringify(keys));
  for (const key of keys) await client.send(new DeleteObjectCommand({ Bucket: cfg.bucket, Key: key }));
  if (keys.length) console.log('cleaned up', keys.length, 'test objects');
  // one more controlled test with printed public URL
  const key = `pentaprompt/test/probe-${Date.now()}.txt`;
  await client.send(new PutObjectCommand({ Bucket: cfg.bucket, Key: key, Body: Buffer.from('probe'), ContentType: 'text/plain', CacheControl: 'public, max-age=31536000, immutable' }));
  console.log('PUBLIC_URL_TO_TEST=' + cfg.publicUrl.replace(/\/$/, '') + '/' + key);
} catch (e) { console.log('ERR:', e.name, e.message); }
