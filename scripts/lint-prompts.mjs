#!/usr/bin/env node
/**
 * Lint + clean prompt content in the database.
 *
 *   node scripts/lint-prompts.mjs                       # dry run: report only
 *   node scripts/lint-prompts.mjs --apply               # backup + update changed rows
 *   node scripts/lint-prompts.mjs --ids id1,id2 --apply
 *   node scripts/lint-prompts.mjs --limit 5             # smoke test
 *
 * What it checks / fixes:
 *   1. JSON-object prompts (content starts with "{") that are not valid JSON
 *      -> repaired with `jsonrepair`, re-serialized as valid pretty JSON;
 *   2. real people / celebrity names in title, description, content, usage, chinese_content
 *      -> replaced with fictional descriptions (Taylor Swift -> "a fictional pop singer", ...);
 *   3. sexualized / crude wording -> softened to neutral fashion/portrait wording
 *      ("large breasts" -> "athletic build", "bikini" -> "swimwear", "retarded" -> "over-the-top", ...);
 *   4. JSON prompts whose chinese_content is a machine-translated (invalid) JSON
 *      -> chinese_content cleared, so the site no longer shows broken Chinese JSON.
 *
 * Reports are written to the workspace:
 *   PromptMaster-内容清洗报告.csv / .json
 * Every applied change is backed up to /tmp/prompt-lint-backup-*.json before the transaction.
 * Prompts that cannot be repaired automatically are listed as "manual" in the report and left unchanged.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import { jsonrepair } from 'jsonrepair';

const ROOT = path.resolve(process.cwd());
dotenv.config({ path: path.join(ROOT, '.env') });

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : fallback;
};
const APPLY = args.includes('--apply');
const LIMIT = parseInt(getArg('--limit', '0'), 10) || 0;
const IDS = getArg('--ids', '').split(',').map((id) => id.trim()).filter(Boolean);
const DETAILS = getArg('--details', '').split(',').map((id) => id.trim()).filter(Boolean);
const WORKSPACE = fs.existsSync(path.join(os.homedir(), 'dsh')) ? path.join(os.homedir(), 'dsh') : os.homedir();
const REPORT_CSV = path.resolve(getArg('--report', path.join(WORKSPACE, 'PromptMaster-内容清洗报告.csv')));
const REPORT_JSON = path.resolve(getArg('--json-report', path.join(WORKSPACE, 'PromptMaster-内容清洗报告.json')));

// ---------------------------------------------------------------- sanitizers
const NAME_RULES = [
    // compound phrases first, so titles read naturally
    [/brad pitt\s+(?:and|vs\.?|versus)\s+tom cruise/gi, 'two rival action heroes'],
    [/trump\s+(?:vs\.?|versus)\s+kim jong[- ]un/gi, 'two fictional rival leaders'],
    [/joe rogan['’]s podcast/gi, 'a fictional podcast'],
    [/sydney sweeney vibes/gi, 'editorial studio vibes'],
    [/teresa palmer/gi, 'a fictional actress'],
    [/taylor swift/gi, 'a fictional pop singer'],
    [/bratt pitt/gi, 'a veteran action hero'],
    [/brad pitt/gi, 'a veteran action hero'],
    [/tom cruise/gi, 'a rival action hero'],
    [/sydney sweeney/gi, 'a fictional actress'],
    [/ana de armas/gi, 'a fictional actress'],
    [/elon musk/gi, 'a fictional tech billionaire'],
    [/donald trump/gi, 'a fictional business tycoon'],
    [/kim jong[- ]un/gi, 'a fictional rival leader'],
    [/joe rogan/gi, 'a fictional podcast host'],
    [/kanye west/gi, 'a fictional musician'],
    [/kim kardashian|kylie jenner/gi, 'a fictional media personality'],
    [/selena gomez|ariana grande|beyonce|rihanna|billie eilish|zendaya|margot robbie|scarlett johansson|kendall jenner/gi, 'a fictional performer'],
    [/\bthe\s+epstein files?/gi, 'a personal rivalry'],
    [/epstein files?/gi, 'a personal rivalry'],
    [/epstein/gi, 'a personal rivalry'],
    // Chinese variants
    [/穿着乳胶裙的泰勒[·•]?斯威夫特/g, '一位穿修身裙的虚构流行歌手'],
    [/泰勒[·•]?斯威夫特身穿乳胶连衣裙/g, '一位穿修身裙的虚构流行歌手'],
    [/泰勒[·•]?斯威夫特/g, '一位虚构的流行歌手'],
    [/西德尼[·•]?斯威尼|西德妮[·•]?斯威尼/g, '一位虚构的女演员'],
    [/安娜[·•]?德[·•]?阿玛斯/g, '一位虚构的女演员'],
    [/布拉德[·•]?皮特/g, '一位资深动作演员'],
    [/汤姆[·•]?克鲁斯/g, '一位对手动作演员'],
    [/埃隆[·•]?马斯克/g, '一位虚构的科技富豪'],
    [/唐纳德[·•]?特朗普|特朗普/g, '一位虚构的商业大亨'],
    [/金正恩/g, '一位虚构的对手领袖'],
    [/乔[·•]?罗根/g, '一位虚构的播客主持人']
];

const TEXT_RULES = [
    [/\blarge breasts\b/gi, 'athletic build'],
    [/\bfat milkers\b/gi, 'iconic look'],
    [/\bbreasts\b/gi, 'figure'],
    [/\bcleavage\b/gi, 'neckline'],
    [/\bbikinis?\b/gi, 'swimwear'],
    [/\bfishnets?\b/gi, 'patterned tights'],
    [/\bin latex dress\b/gi, 'in a fitted dress'],
    [/\blatex mini[- ]dress\b/gi, 'fitted mini-dress'],
    [/\blatex dress\b/gi, 'fitted dress'],
    [/\blatex\b/gi, 'glossy'],
    [/\bunderwear\b/gi, 'base layer'],
    [/\blingerie\b/gi, 'loungewear'],
    [/\bnude pink lipstick\b/gi, 'soft pink lipstick'],
    [/\bnude lipstick\b/gi, 'soft pink lipstick'],
    [/\bnude lips\b/gi, 'soft pink lips'],
    [/\bnude pink\b/gi, 'soft pink'],
    [/\bnude\b/gi, 'neutral'],
    [/\btopless\b/gi, 'bare-shouldered'],
    [/\bseductive\b/gi, 'playful'],
    [/\bsexually explicit\b/gi, 'fashion-forward'],
    [/\bretarded\b/gi, 'over-the-top'],
    [/\bperv(?:ert)?\b/gi, 'character'],
    [/大胸/g, '健美体型'],
    [/性感撩人/g, '活泼俏皮'],
    [/性感/g, '俏皮'],
    [/比基尼/g, '泳装'],
    [/穿着乳胶裙的/g, '穿着修身裙的'],
    [/乳胶裙/g, '修身裙'],
    [/乳胶/g, '光泽面料'],
    [/渔网袜/g, '花纹连裤袜'],
    [/裸露/g, '简约'],
    [/暴露/g, '简约'],
    [/内衣/g, '内搭']
];

const JSON_KEY_RULES = [
    [/"celebrity_likeness"/g, '"character_likeness"'],
    [/"celebrity"/g, '"character"']
];

const FIELDS = ['title_en', 'title_zh', 'description_en', 'description_zh', 'content', 'chinese_content', 'usage', 'expected_output'];
const TEXT_FIELDS = ['title_en', 'title_zh', 'description_en', 'description_zh', 'usage', 'expected_output'];

const applyRules = (text, rules) => {
    let value = text;
    for (const [pattern, replacement] of rules) value = value.replace(pattern, replacement);
    return value;
};

const sanitizeText = (text) => {
    if (typeof text !== 'string' || !text) return text;
    let value = applyRules(text, NAME_RULES);
    value = applyRules(value, TEXT_RULES);
    return value;
};

const isJsonLike = (text) => typeof text === 'string' && text.trim().startsWith('{');

const sanitizeJsonValue = (value) => {
    if (typeof value === 'string') return sanitizeText(value);
    if (Array.isArray(value)) return value.map(sanitizeJsonValue);
    if (value && typeof value === 'object') {
        const out = {};
        for (const [key, child] of Object.entries(value)) {
            const safeKey = key.replace(/celebrity_likeness/g, 'character_likeness').replace(/^celebrity$/g, 'character');
            out[safeKey] = sanitizeJsonValue(child);
        }
        return out;
    }
    return value;
};

const closeJson = (text) => {
    let inString = false;
    let escaped = false;
    const stack = [];
    for (const char of text) {
        if (inString) {
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === '"') inString = false;
            continue;
        }
        if (char === '"') inString = true;
        else if (char === '{' || char === '[') stack.push(char);
        else if (char === '}' || char === ']') stack.pop();
    }
    let out = text;
    if (inString) out += '"';
    while (stack.length) {
        const open = stack.pop();
        out += open === '{' ? '}' : ']';
    }
    return out;
};

const preCleanJson = (text) => text
    // nested {argument name="x" default="y"} quotes make the outer JSON invalid
    .replace(/\{argument\s+name="([^"]*)"\s+default="([^"]*)"\}/g, "{argument name='$1' default='$2'}")
    // stray bare string between properties: "gender": "Female","Teresa Palmer"\n "appearance"
    .replace(/,"[^"]{2,80}"(?=\s*\n\s*")/g, ',')
    // first value is a bare quoted string: { "long prompt", "size": ... }
    .replace(/^\{(\s*)"([^"]{20,})"/, '{$1"prompt": "$2"');

const tryParseJson = (candidate) => {
    try {
        return JSON.parse(candidate);
    } catch {
        try {
            return JSON.parse(jsonrepair(candidate));
        } catch {
            return null;
        }
    }
};

const repairJsonContent = (text) => {
    try {
        const parsed = JSON.parse(text);
        const pretty = JSON.stringify(sanitizeJsonValue(parsed), null, 2);
        return { ok: true, value: pretty, repaired: false, changed: pretty !== text };
    } catch { /* try repairs */ }

    const preCleaned = preCleanJson(text);
    for (const candidate of [preCleaned, closeJson(preCleaned)]) {
        const parsed = tryParseJson(candidate);
        if (parsed) {
            return { ok: true, value: JSON.stringify(sanitizeJsonValue(parsed), null, 2), repaired: true, changed: true };
        }
    }

    // JSON object followed by trailing prose (e.g. a note after the closing brace).
    for (let index = text.lastIndexOf('}'); index > 0; index = text.lastIndexOf('}', index - 1)) {
        const parsed = tryParseJson(text.slice(0, index + 1));
        if (parsed) {
            const trailing = text.slice(index + 1).trim();
            if (trailing) parsed.additional_notes = sanitizeText(trailing);
            return { ok: true, value: JSON.stringify(sanitizeJsonValue(parsed), null, 2), repaired: true, changed: true };
        }
    }

    // Text wrapped in braces (not JSON): keep the inner text.
    if (!/":/.test(text)) {
        const inner = text.trim().replace(/^\{\s*/, '').replace(/\s*\}$/, '');
        if (inner) return { ok: true, value: sanitizeText(inner), repaired: true, changed: true, plainText: true };
    }

    return { ok: false, error: 'could not repair JSON', value: text, repaired: false, changed: false };
};

const celebrityPattern = /taylor swift|sydney sweeney|ana de armas|brad pitt|bratt pitt|tom cruise|elon musk|donald trump|kim jong[- ]un|joe rogan|kim kardashian|kylie jenner|selena gomez|ariana grande|beyonce|rihanna|billie eilish|zendaya|margot robbie|scarlett johansson|kendall jenner|epstein|泰勒[·•]?斯威夫特|西德尼[·•]?斯威尼|西德妮[·•]?斯威尼|安娜[·•]?德[·•]?阿玛斯|布拉德[·•]?皮特|汤姆[·•]?克鲁斯|埃隆[·•]?马斯克|唐纳德[·•]?特朗普|特朗普|金正恩/i;
const sexualPattern = /\b(breasts?|fat milkers|cleavage|bikinis?|fishnets?|latex|underwear|lingerie|nude|topless|seductive|retarded|pervert?)\b|大胸|性感|比基尼|乳胶|渔网袜|裸露|暴露|内衣/i;

// ---------------------------------------------------------------- run
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const where = [];
const params = [];
if (IDS.length) {
    params.push(IDS);
    where.push(`id = ANY($${params.length}::text[])`);
}
const query = `SELECT id, ${FIELDS.join(', ')} FROM prompts ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY id ASC`;
let rows = (await pool.query(query, params)).rows;
if (LIMIT > 0) rows = rows.slice(0, LIMIT);
await pool.end();

const results = [];
for (const row of rows) {
    const changes = {};
    const issues = [];
    let manual = false;
    let notes = [];
    let jsonRepaired = false;

    const jsonLike = isJsonLike(row.content);
    if (jsonLike) {
        const repair = repairJsonContent(row.content);
        if (!repair.ok) {
            issues.push('invalid_json');
            manual = true;
            notes.push(`JSON repair failed: ${repair.error}`);
            // still sanitize words in the raw text so at least names/terms are cleaned
            const sanitizedRaw = sanitizeText(row.content);
            if (sanitizedRaw !== row.content) changes.content = sanitizedRaw;
            if (row.chinese_content) changes.chinese_content = '';
        } else {
            if (repair.repaired) { issues.push('invalid_json'); notes.push('JSON repaired'); }
            jsonRepaired = repair.repaired;
            if (repair.value !== row.content) changes.content = repair.value;
            // Translated JSON chinese_content is usually broken; only drop it when it is JSON-like/invalid.
            if (row.chinese_content) {
                if (isJsonLike(row.chinese_content)) {
                    try {
                        JSON.parse(row.chinese_content);
                        const cleanedZhJson = sanitizeJsonValue(JSON.parse(row.chinese_content));
                        const prettyZh = JSON.stringify(cleanedZhJson, null, 2);
                        if (prettyZh !== row.chinese_content) changes.chinese_content = prettyZh;
                    } catch {
                        changes.chinese_content = '';
                    }
                } else {
                    const cleanedZh = sanitizeText(row.chinese_content);
                    if (cleanedZh !== row.chinese_content) changes.chinese_content = cleanedZh;
                }
            }
        }
    } else {
        const cleaned = sanitizeText(row.content);
        if (cleaned !== row.content) changes.content = cleaned;
        if (row.chinese_content) {
            const cleanedZh = sanitizeText(row.chinese_content);
            if (cleanedZh !== row.chinese_content) changes.chinese_content = cleanedZh;
        }
    }

    for (const field of TEXT_FIELDS) {
        if (!row[field]) continue;
        const cleaned = sanitizeText(row[field]);
        if (cleaned !== row[field]) changes[field] = cleaned;
    }

    // detect problems on the ORIGINAL row
    const blob = FIELDS.map((field) => row[field] || '').join(' ');
    if (celebrityPattern.test(blob)) issues.push('celebrity_name');
    if (sexualPattern.test(blob)) issues.push('sexualized_wording');
    if (/\bretarded\b|epstein/i.test(blob)) issues.push('sensitive_topic');
    if (jsonLike && !jsonRepaired) {
        try { JSON.parse(row.content); } catch { if (!issues.includes('invalid_json')) issues.push('invalid_json'); }
    }
    if (jsonRepaired && !issues.includes('invalid_json')) issues.push('invalid_json');

    if (Object.keys(changes).length || issues.length) {
        results.push({
            id: String(row.id),
            title: String(row.title_en || '').slice(0, 90),
            category: row.category || '',
            issues,
            fieldsChanged: Object.keys(changes),
            jsonLike,
            jsonRepaired,
            manual,
            notes: notes.join('; '),
            before: row,
            changes
        });
    }
}

// ---------------------------------------------------------------- report
const esc = (value) => `"${String(value ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
const csvLines = ['id,category,title,issues,fields_changed,json_like,json_repaired,status,notes'];
for (const item of results) {
    csvLines.push([
        item.id, item.category, item.title, item.issues.join('|'), item.fieldsChanged.join('|'),
        item.jsonLike ? 'yes' : 'no', item.jsonRepaired ? 'yes' : 'no',
        item.manual ? 'manual' : (Object.keys(item.changes).length ? 'auto' : 'report-only'),
        item.notes
    ].map(esc).join(','));
}
fs.writeFileSync(REPORT_CSV, `${csvLines.join('\n')}\n`);
fs.writeFileSync(REPORT_JSON, JSON.stringify(results.map((item) => ({
    id: item.id, category: item.category, title: item.title, issues: item.issues,
    fieldsChanged: item.fieldsChanged, jsonRepaired: item.jsonRepaired, manual: item.manual,
    notes: item.notes, preview: item.changes.content ? String(item.changes.content).slice(0, 400) : undefined
})), null, 2));

const countBy = (arr) => arr.reduce((acc, item) => { for (const issue of item.issues) acc[issue] = (acc[issue] || 0) + 1; return acc; }, {});
console.log(`scanned ${rows.length} prompts; affected ${results.length}`);
console.log('issues:', JSON.stringify(countBy(results)));
console.log('auto-fixable:', results.filter((item) => !item.manual && Object.keys(item.changes).length).length,
    '| manual:', results.filter((item) => item.manual).length);
const manualItems = results.filter((item) => item.manual);
if (manualItems.length) {
    console.log('manual review needed:');
    manualItems.slice(0, 20).forEach((item) => console.log(`  ${item.id} | ${item.title} | ${item.notes}`));
}
console.log('report:', REPORT_CSV);

if (DETAILS.length) {
    for (const id of DETAILS) {
        const item = results.find((entry) => entry.id === id);
        if (!item) { console.log(`\n[details] ${id}: no changes`); continue; }
        console.log(`\n[details] ${id} | ${item.title}`);
        for (const field of Object.keys(item.changes)) {
            console.log(`  --- ${field} BEFORE ---`);
            console.log(String(item.before[field] || '').slice(0, 1200));
            console.log(`  --- ${field} AFTER ---`);
            console.log(String(item.changes[field] || '').slice(0, 1200));
        }
    }
}

if (!APPLY) {
    console.log('\ndry run: nothing was written. Re-run with --apply to update the database.');
    process.exit(0);
}

const toUpdate = results.filter((item) => !item.manual && Object.keys(item.changes).length);
if (!toUpdate.length) {
    console.log('nothing to update');
    process.exit(0);
}

const backupPath = `/tmp/prompt-lint-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
fs.writeFileSync(backupPath, JSON.stringify(toUpdate.map((item) => item.before), null, 1));
console.log('backup:', backupPath);

const pool2 = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const client = await pool2.connect();
let updated = 0;
try {
    await client.query('BEGIN');
    for (const item of toUpdate) {
        const fields = Object.keys(item.changes);
        const values = fields.map((field) => item.changes[field]);
        const sets = fields.map((field, index) => `${field} = $${index + 1}`);
        values.push(item.id);
        await client.query(`UPDATE prompts SET ${sets.join(', ')} WHERE id = $${fields.length + 1}`, values);
        updated++;
    }
    await client.query('COMMIT');
} catch (error) {
    await client.query('ROLLBACK');
    throw error;
} finally {
    client.release();
    await pool2.end();
}
console.log(`updated ${updated} rows`);
console.log('deploy needed: push a commit so prerendered pages pick up the cleaned content.');
