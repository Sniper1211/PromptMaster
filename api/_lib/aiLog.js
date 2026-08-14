// Shared helpers for AI endpoints: auth check, IP rate limiting, and logging.
// Vercel treats directories starting with `_` as libraries, not as API routes.
import crypto from 'crypto';
import pg from 'pg';

let pool;
function getPool() {
  if (!pool) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 2
    });
  }
  return pool;
}

// --- Request context helpers ---

export function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.trim()) {
    return fwd.split(',')[0].trim();
  }
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string' && real.trim()) return real.trim();
  if (req.socket && req.socket.remoteAddress) return req.socket.remoteAddress;
  return 'unknown';
}

export function makeRequestId() {
  return crypto.randomUUID();
}

export function makeInputHash(input) {
  return crypto.createHash('sha256').update(String(input || '')).digest('hex');
}

export function makeInputPreview(input, max = 200) {
  const s = String(input || '').replace(/\s+/g, ' ').trim();
  return s.length > max ? s.slice(0, max) : s;
}

// Strict auth: without ADMIN_PASSWORD configured, AI endpoints fail closed.
export function isAuthorized(req) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const auth = req.headers.authorization || '';
  return auth === `Bearer ${adminPassword}`;
}

// --- Rate limiting (counts recent requests from the same IP) ---

export async function countRecentRequests(ip, windowMinutes = 10) {
  try {
    const { rows } = await getPool().query(
      `SELECT COUNT(*)::int AS cnt FROM ai_request_logs
       WHERE ip = $1 AND created_at > now() - ($2 || ' minutes')::interval`,
      [ip, windowMinutes]
    );
    return rows[0]?.cnt ?? 0;
  } catch (err) {
    console.error('[aiLog] countRecentRequests error:', err.message);
    return 0; // DB unavailable: fail open so the site keeps working
  }
}

// --- Logging (fail silently, never block the main flow) ---

export async function logRequest(entry) {
  const {
    requestId, endpoint, ip, userAgent, isAdmin,
    inputPreview, inputHash, inputLength, model,
    statusCode, latencyMs, success
  } = entry;
  try {
    await getPool().query(
      `INSERT INTO ai_request_logs
        (request_id, endpoint, ip, user_agent, is_admin, input_preview, input_hash, input_length, model, status_code, latency_ms, success)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [requestId, endpoint, ip, userAgent, isAdmin, inputPreview, inputHash, inputLength, model, statusCode, latencyMs, success]
    );
  } catch (err) {
    console.error('[aiLog] logRequest error:', err.message);
  }
}

export async function logError(entry) {
  const { requestId, endpoint, ip, userAgent, statusCode, errorMessage, errorDetail } = entry;
  try {
    await getPool().query(
      `INSERT INTO ai_error_logs
        (request_id, endpoint, ip, user_agent, status_code, error_message, error_detail)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [requestId, endpoint, ip, userAgent, statusCode, errorMessage, errorDetail]
    );
  } catch (err) {
    console.error('[aiLog] logError error:', err.message);
  }
}
