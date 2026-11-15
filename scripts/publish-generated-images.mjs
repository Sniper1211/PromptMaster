#!/usr/bin/env node
/**
 * One-command publish for AI-generated covers.
 *
 *   npm run publish:covers          # = --apply --archive
 *   node scripts/publish-generated-images.mjs --apply [--archive] [--replace] [--no-deploy]
 *
 * Steps:
 *   1. imports images from --dir (default ~/pm-images) via scripts/import-generated-images.mjs:
 *      converts to WebP, uploads to R2, updates prompts.preview_image_url (with URL backup)
 *   2. appends new rows to docs/generated-images.md (deduplicated by URL)
 *   3. commits + pushes to main (triggers the Vercel production deploy) and fast-forwards preview
 *   4. polls the production prompt page until the new OG image is live, checks the image URLs
 *      (200 / image-webp / cache HIT) and reports the remaining missing-image count
 *   5. optionally archives the local source files to ~/pm-images-archive
 *
 * Without --apply it only runs the import dry-run and prints what would be published.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import pg from 'pg';
import dotenv from 'dotenv';

const ROOT = path.resolve(process.cwd());
dotenv.config({ path: path.join(ROOT, '.env') });

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : fallback;
};
const APPLY = args.includes('--apply');
const REPLACE = args.includes('--replace');
const NO_DEPLOY = args.includes('--no-deploy');
const ARCHIVE = args.includes('--archive');
const SKIP_VERIFY = args.includes('--skip-verify');
const DIR = path.resolve(getArg('--dir', path.join(os.homedir(), 'pm-images')));
const VERIFY_TIMEOUT_SECONDS = parseInt(getArg('--timeout', '300'), 10);
const BASE_URL = 'https://pentaprompt.com';
const DOCS_PATH = path.join(ROOT, 'docs/generated-images.md');
const WORKSPACE = fs.existsSync(path.join(os.homedir(), 'dsh')) ? path.join(os.homedir(), 'dsh') : os.homedir();
const TRACKER_PATH = process.env.COVER_TRACKER_OUT || path.join(WORKSPACE, 'PromptMaster-补图清单.xlsx');
const ARCHIVE_DIR = path.join(os.homedir(), 'pm-images-archive');
const startedAt = Date.now();

const log = (...parts) => console.log(...parts);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const run = (command, commandArgs, options = {}) => execFileSync(command, commandArgs, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
});

const fail = (message) => {
    console.error(`\n✖ ${message}`);
    process.exit(1);
};

// ---------------------------------------------------------------- step 1: import
if (!fs.existsSync(DIR)) fail(`image folder not found: ${DIR}`);
const reportPath = path.join(os.tmpdir(), `pp-publish-report-${Date.now()}.json`);
const importArgs = [path.join(ROOT, 'scripts/import-generated-images.mjs'), '--dir', DIR, '--report-json', reportPath];
if (APPLY) importArgs.push('--apply');
if (REPLACE) importArgs.push('--replace');

log(`\n== 1/4 导入图片 ==\n文件夹: ${DIR}${APPLY ? '' : '  (dry-run，不写数据库)'}`);
try {
    execFileSync(process.execPath, importArgs, { cwd: ROOT, stdio: 'inherit' });
} catch (error) {
    fail(`导入失败（scripts/import-generated-images.mjs 退出码 ${error.status}）`);
}
if (!fs.existsSync(reportPath)) fail('导入脚本没有生成报告文件');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
fs.rmSync(reportPath, { force: true });

if (report.failed?.length) {
    console.error('\n✖ 有图片处理失败，已中止发布（数据库可能已更新部分记录，请先修复失败项）：');
    report.failed.forEach((item) => console.error(`  ${item.id}: ${item.error}`));
    process.exit(1);
}
const uploads = (report.uploaded || []).filter((item) => item.url);
if (!uploads.length) {
    log('\n没有需要发布的新图片。');
    if (report.skippedExisting?.length) {
        log(`已跳过 ${report.skippedExisting.length} 张已有封面的图（需要替换请加 --replace）：${report.skippedExisting.map((item) => item.id).join(', ')}`);
    }
    if (report.unknownIds?.length) log(`数据库里找不到这些 ID：${report.unknownIds.join(', ')}`);
    process.exit(0);
}
log(`\n待发布: ${uploads.length} 张（合计 ${Math.round(uploads.reduce((sum, item) => sum + (item.bytes || 0), 0) / 1024)} KB）`);
uploads.forEach((item) => log(`  ${item.id} -> ${item.url}`));
if (!APPLY) {
    log('\n(dry-run) 加 --apply 才会写数据库、提交部署。');
    process.exit(0);
}

// ---------------------------------------------------------------- step 2: docs log
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
let categories = new Map();
try {
    const rows = (await pool.query('SELECT id, category FROM prompts WHERE id = ANY($1::text[])', [uploads.map((item) => item.id)])).rows;
    categories = new Map(rows.map((row) => [String(row.id), row.category]));
} catch (error) {
    log(`(warn) 读取分类失败，日志里分类留空: ${error.message}`);
}

let docs = fs.readFileSync(DOCS_PATH, 'utf8');
const knownUrls = new Set((docs.match(/https:\/\/img\.ok9981\.com\/\S+/g) || []).map((url) => url.replace(/[|)\s]+$/, '')));
const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' });
const newRows = uploads
    .filter((item) => !knownUrls.has(item.url))
    .map((item) => `| ${today} | ${item.id} | ${categories.get(String(item.id)) || 'UNKNOWN'} | ${item.url} | generated with 即梦, published via publish script |`);
if (newRows.length) {
    docs = `${docs.replace(/\s*$/, '')}\n${newRows.join('\n')}\n`;
    fs.writeFileSync(DOCS_PATH, docs);
    log(`\n== 2/4 更新生成图片日志 ==\n新增 ${newRows.length} 行 -> docs/generated-images.md`);
} else {
    log('\n== 2/4 更新生成图片日志 ==\n日志里已有这些 URL，无需追加。');
}
log('生成进度追踪表…');
try {
    execFileSync(process.execPath, [path.join(ROOT, 'scripts/generate-cover-tracker.mjs')], { cwd: ROOT, stdio: 'inherit' });
} catch (error) {
    log(`(warn) 追踪表生成失败: ${error.message.split('\n')[0]}`);
}

// ---------------------------------------------------------------- step 3: commit + deploy
let commitHash = null;
if (!NO_DEPLOY) {
    log('\n== 3/4 提交并部署 ==');
    try {
        const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']).trim();
        if (branch !== 'main') fail(`当前分支是 ${branch}，请先切回 main 再发布`);
        run('git', ['add', 'docs/generated-images.md']);
        const staged = run('git', ['diff', '--cached', '--name-only']).trim();
        const message = `content: publish ${uploads.length} generated cover(s)\n\n${uploads.map((item) => `${item.id} -> ${item.url}`).join('\n')}`;
        run('git', ['commit', ...(staged ? [] : ['--allow-empty']), '-m', message]);
        commitHash = run('git', ['rev-parse', '--short', 'HEAD']).trim();
        run('git', ['push', 'origin', 'main']);
        log(`已推送 main（${commitHash}），Vercel 生产部署已触发。`);
        // Keep the preview branch in sync (best effort; never leaves main checked out).
        try {
            run('git', ['checkout', 'preview']);
            run('git', ['merge', '--ff-only', 'main']);
            run('git', ['push', 'origin', 'preview']);
            log('preview 分支已同步。');
        } catch (previewError) {
            log(`(warn) preview 分支同步失败，不影响生产: ${previewError.message.split('\n')[0]}`);
        } finally {
            try { run('git', ['checkout', 'main']); } catch { /* ignore */ }
        }
    } catch (error) {
        fail(`提交/部署失败：${error.message.trim()}\n数据库已经更新，请手动提交并 git push origin main 触发部署。`);
    }
} else {
    log('\n== 3/4 跳过提交部署 (--no-deploy) ==');
}

// ---------------------------------------------------------------- step 4: verify
const verify = { deployed: false, images: [] };
if (!SKIP_VERIFY && !NO_DEPLOY) {
    log('\n== 4/4 等待部署并验收 ==');
    const target = uploads[0];
    const targetHash = target.key.split('-').pop().replace('.webp', '');
    const deadline = Date.now() + VERIFY_TIMEOUT_SECONDS * 1000;
    let lastStatus = '等待部署…';
    while (Date.now() < deadline) {
        try {
            const response = await fetch(`${BASE_URL}/prompt/${target.id}`);
            const html = await response.text();
            if (html.includes(targetHash)) { verify.deployed = true; break; }
            lastStatus = `页面已部署但还没出现新图（HTTP ${response.status}）`;
        } catch (error) {
            lastStatus = `请求失败: ${error.message}`;
        }
        await sleep(10000);
    }
    if (verify.deployed) log(`部署完成：/prompt/${target.id} 的 og:image 已指向新图。`);
    else log(`(warn) ${VERIFY_TIMEOUT_SECONDS}s 内没检测到新部署：${lastStatus}。可以稍后刷新页面确认。`);

    for (const item of uploads) {
        try {
            const first = await fetch(item.url);
            await first.arrayBuffer();
            const second = await fetch(item.url);
            const type = second.headers.get('content-type') || '';
            const cache = second.headers.get('cf-cache-status') || 'unknown';
            verify.images.push({ id: item.id, status: second.status, type, cache });
        } catch (error) {
            verify.images.push({ id: item.id, status: 'failed', type: '', cache: error.message });
        }
    }
    log('图片检查:');
    verify.images.forEach((item) => log(`  ${item.id}: HTTP ${item.status} | ${item.type || '-'} | cache ${item.cache}`));
}

// ---------------------------------------------------------------- archive
if (ARCHIVE) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    let moved = 0;
    for (const item of uploads) {
        const source = path.join(DIR, item.file);
        if (!fs.existsSync(source)) continue;
        let target = path.join(ARCHIVE_DIR, path.basename(item.file));
        if (fs.existsSync(target)) {
            const ext = path.extname(item.file);
            target = path.join(ARCHIVE_DIR, `${path.basename(item.file, ext)}-${Date.now()}${ext}`);
        }
        fs.renameSync(source, target);
        moved++;
    }
    log(`\n本地源文件已归档: ${moved} 个 -> ${ARCHIVE_DIR}`);
}

// ---------------------------------------------------------------- summary
let remaining = null;
try {
    const result = await pool.query("SELECT count(*)::int AS n FROM prompts WHERE preview_image_url IS NULL OR preview_image_url = ''");
    remaining = result.rows[0].n;
} catch { /* ignore */ }
await pool.end();

const seconds = Math.round((Date.now() - startedAt) / 1000);
log('\n================ 发布完成 ================');
log(`封面: ${uploads.length} 张，${Math.round(uploads.reduce((sum, item) => sum + (item.bytes || 0), 0) / 1024)} KB`);
if (commitHash) log(`提交: ${commitHash}（已推送 main，触发生产部署）`);
if (!NO_DEPLOY && !SKIP_VERIFY) log(`部署验收: ${verify.deployed ? '通过' : '未确认（稍后刷新页面看）'}`);
if (verify.images.length) log(`图片: ${verify.images.filter((item) => item.status === 200 && item.type.startsWith('image/')).length}/${verify.images.length} 正常 200 + image/*`);
if (remaining !== null) log(`剩余无图: ${remaining} 条（追踪表: ${TRACKER_PATH}）`);
log(`耗时: ${seconds}s`);
