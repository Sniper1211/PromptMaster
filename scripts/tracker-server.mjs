#!/usr/bin/env node
/**
 * Local-only tracker server for the cover tracker.
 *
 *   npm run tracker            # or: node scripts/tracker-server.mjs
 *   (double-click start-cover-tracker.command on macOS)
 *
 * Serves local/cover-tracker.html at http://127.0.0.1:7788 and exposes a single action:
 * POST /api/publish -> runs `node scripts/publish-generated-images.mjs --apply --archive`.
 * The page has a "发布新图" button that calls it and shows the live log.
 *
 * Security:
 *   - binds to 127.0.0.1 only;
 *   - a random per-run token is injected into the served page and required on every API call
 *     (cross-origin pages cannot read the token nor send custom headers without CORS);
 *   - Origin, when present, must be http://127.0.0.1:<port> or http://localhost:<port>;
 *   - no CORS headers are sent at all.
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawn, execFileSync } from 'child_process';

const ROOT = path.resolve(process.cwd());
const HOST = '127.0.0.1';
const PORT = Number(process.env.TRACKER_PORT || 7788);
const TRACKER_PATH = path.join(ROOT, 'local/cover-tracker.html');
const PUBLISH_SCRIPT = path.join(ROOT, 'scripts/publish-generated-images.mjs');
const TOKEN = crypto.randomBytes(24).toString('hex');
const MAX_LOG = 200 * 1024;

let child = null;
let logBuffer = '';
let exitCode = null;
let startedAt = null;
let finishedAt = null;

const allowedOrigins = new Set([`http://127.0.0.1:${PORT}`, `http://localhost:${PORT}`]);

const regenerateTracker = () => {
    try {
        execFileSync(process.execPath, [path.join(ROOT, 'scripts/generate-cover-tracker.mjs')], {
            cwd: ROOT,
            stdio: 'ignore'
        });
    } catch (error) {
        console.error('[tracker] regenerate failed:', error.message);
    }
};

const appendLog = (chunk) => {
    logBuffer += chunk.toString();
    if (logBuffer.length > MAX_LOG) logBuffer = logBuffer.slice(-MAX_LOG);
};

const authorized = (req) => {
    if (req.headers['x-pp-token'] !== TOKEN) return false;
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.has(origin)) return false;
    return true;
};

const json = (res, status, payload) => {
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    res.end(JSON.stringify(payload));
};

const servePage = (res) => {
    if (!fs.existsSync(TRACKER_PATH)) {
        json(res, 500, { error: 'tracker not generated yet; run node scripts/generate-cover-tracker.mjs' });
        return;
    }
    const html = fs.readFileSync(TRACKER_PATH, 'utf8')
        .replace('</head>', `<meta name="pp-token" content="${TOKEN}" /></head>`);
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Frame-Options': 'DENY'
    });
    res.end(html);
};

const startPublish = () => {
    if (child) return false;
    logBuffer = '';
    exitCode = null;
    finishedAt = null;
    startedAt = new Date().toISOString();
    child = spawn(process.execPath, [PUBLISH_SCRIPT, '--apply', '--archive'], {
        cwd: ROOT,
        env: process.env
    });
    child.stdout.on('data', appendLog);
    child.stderr.on('data', appendLog);
    child.on('close', (code) => {
        child = null;
        exitCode = code ?? 1;
        finishedAt = new Date().toISOString();
        regenerateTracker();
    });
    return true;
};

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${HOST}:${PORT}`);
    const pathname = url.pathname;

    if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
        servePage(res);
        return;
    }
    if (req.method === 'GET' && pathname === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
    }
    if (pathname === '/api/status') {
        if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
        if (!authorized(req)) return json(res, 401, { error: 'Unauthorized' });
        return json(res, 200, {
            running: Boolean(child),
            exitCode,
            startedAt,
            finishedAt,
            log: logBuffer
        });
    }
    if (pathname === '/api/publish') {
        if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
        if (!authorized(req)) return json(res, 401, { error: 'Unauthorized' });
        if (child) return json(res, 409, { error: 'publish already running' });
        startPublish();
        return json(res, 200, { started: true });
    }
    return json(res, 404, { error: 'Not found' });
});

regenerateTracker();

server.listen(PORT, HOST, () => {
    const url = `http://127.0.0.1:${PORT}`;
    console.log(`\nPentaPrompt 补图追踪服务已启动（仅本机）`);
    console.log(`  ${url}`);
    console.log(`  发布按钮 = node scripts/publish-generated-images.mjs --apply --archive`);
    console.log(`  关闭此终端即停止服务。Ctrl+C 退出。\n`);
    if (process.platform === 'darwin' && !process.env.TRACKER_NO_OPEN) {
        spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
    }
});

const shutdown = () => {
    if (child) {
        try { child.kill('SIGTERM'); } catch { /* ignore */ }
    }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 1500).unref();
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
