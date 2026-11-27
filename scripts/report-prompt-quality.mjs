#!/usr/bin/env node
/**
 * Report low-quality / risky prompts for editorial cleanup (read-only).
 *
 *   node scripts/report-prompt-quality.mjs
 *
 * Writes PromptMaster-低质量提示词清单.csv + .json to the workspace and prints a summary.
 * Reasons: short_content, empty_content, invalid_json, en_eq_zh, ip_brand, duplicate_content,
 * duplicate_title, missing_usage, missing_description.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import pg from 'pg';
import dotenv from 'dotenv';

const ROOT = path.resolve(process.cwd());
dotenv.config({ path: path.join(ROOT, '.env') });
const WORKSPACE = fs.existsSync(path.join(os.homedir(), 'dsh')) ? path.join(os.homedir(), 'dsh') : os.homedir();
const OUT_CSV = path.join(WORKSPACE, 'PromptMaster-低质量提示词清单.csv');
const OUT_JSON = path.join(WORKSPACE, 'PromptMaster-低质量提示词清单.json');

const IP_RE = /\b(dragon ball|naruto|one piece|harry potter|zelda|pokemon|marvel|disney|pixar|spider-man|batman|superman|star wars|lego|the nun|conjuring|south park|stranger things|sailor moon|demon slayer|jujutsu|transformers|optimus prime|game of thrones|minecraft|fortnite|barbie|hello kitty|sanrio|paw patrol|mickey|elsa|frozen)\b/i;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const rows = (await pool.query(`
    SELECT id, category, title_en, title_zh, description_en, description_zh, content, chinese_content, usage
    FROM prompts ORDER BY id ASC
`)).rows;
await pool.end();

const contentHashes = new Map();
const titleKeys = new Map();
for (const row of rows) {
    const content = String(row.content || '').trim();
    if (content) {
        const hash = crypto.createHash('sha1').update(content).digest('hex');
        contentHashes.set(hash, [...(contentHashes.get(hash) || []), String(row.id)]);
    }
    const title = String(row.title_en || row.title_zh || '').trim().toLowerCase();
    if (title) titleKeys.set(title, [...(titleKeys.get(title) || []), String(row.id)]);
}

const items = [];
const counts = {};
const bump = (reason) => { counts[reason] = (counts[reason] || 0) + 1; };

for (const row of rows) {
    const content = String(row.content || '');
    const trimmed = content.trim();
    const reasons = [];

    if (!trimmed) reasons.push('empty_content');
    else if (trimmed.length < 80) reasons.push('short_content');

    if (trimmed.startsWith('{')) {
        try { JSON.parse(trimmed); } catch { reasons.push('invalid_json'); }
    }

    if (trimmed && String(row.chinese_content || '').trim() === trimmed) reasons.push('en_eq_zh');

    if (!row.usage) reasons.push('missing_usage');
    if (!row.description_en && !row.description_zh) reasons.push('missing_description');

    const blob = [row.title_en, row.title_zh, content, row.description_en].join(' ');
    const ipTerms = [...new Set((blob.match(new RegExp(IP_RE.source, 'gi')) || []).map((term) => term.toLowerCase()))];
    if (ipTerms.length) reasons.push('ip_brand');

    const contentHash = trimmed ? crypto.createHash('sha1').update(trimmed).digest('hex') : '';
    if (contentHash && (contentHashes.get(contentHash) || []).length > 1) reasons.push('duplicate_content');
    const titleKey = String(row.title_en || row.title_zh || '').trim().toLowerCase();
    if (titleKey && (titleKeys.get(titleKey) || []).length > 1) reasons.push('duplicate_title');

    if (!reasons.length) continue;

    reasons.forEach(bump);
    const suggested = reasons.includes('empty_content') || reasons.includes('invalid_json')
        ? 'rewrite_or_remove'
        : reasons.includes('ip_brand')
            ? 'de-identify'
            : reasons.includes('short_content')
                ? 'expand'
                : 'review';

    items.push({
        id: String(row.id),
        category: row.category,
        title_en: row.title_en || '',
        title_zh: row.title_zh || '',
        reasons,
        suggested_action: suggested,
        content_length: trimmed.length,
        ip_terms: ipTerms.join(','),
        preview: trimmed.replace(/\s+/g, ' ').slice(0, 160)
    });
}

const esc = (value) => `"${String(value ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
const headers = ['id', 'category', 'title_en', 'title_zh', 'reasons', 'suggested_action', 'content_length', 'ip_terms', 'preview'];
const lines = [headers.join(',')];
for (const item of items) {
    lines.push([item.id, item.category, item.title_en, item.title_zh, item.reasons.join('|'), item.suggested_action, item.content_length, item.ip_terms, item.preview].map(esc).join(','));
}
fs.writeFileSync(OUT_CSV, `${lines.join('\n')}\n`);
fs.writeFileSync(OUT_JSON, JSON.stringify({ generatedAt: new Date().toISOString(), total: rows.length, flagged: items.length, counts, items }, null, 2));

console.log(`scanned ${rows.length} prompts; flagged ${items.length}`);
console.log('reasons:', JSON.stringify(counts));
console.log('csv:', OUT_CSV);
console.log('json:', OUT_JSON);
