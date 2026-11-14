/**
 * Import machine-assisted Chinese translations (title_zh / description_zh / chinese_content)
 * produced as batches by the workflow in docs/content-localization.md.
 *
 * Usage:
 *   node scripts/import-translations.mjs --dir /path/to/pm-i18n            # dry run (validate only)
 *   node scripts/import-translations.mjs --dir /path/to/pm-i18n --apply    # write to the database
 *
 * The directory must contain manifest.json plus input/batch-XX.json and output/batch-XX.json.
 * The script validates everything before touching the database, backs up the current values,
 * and only updates the fields that were actually translated.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const args = process.argv.slice(2);
const dirArg = args.indexOf('--dir');
const baseDir = dirArg >= 0 ? path.resolve(args[dirArg + 1]) : null;
const apply = args.includes('--apply');

if (!baseDir) {
    console.error('Usage: node scripts/import-translations.mjs --dir <pm-i18n dir> [--apply]');
    process.exit(1);
}

const hasCjk = (value) => /[\u4e00-\u9fff]/.test(String(value || ''));
const hasKanaOrHangul = (value) => /[\u3040-\u30ff\uac00-\ud7af]/.test(String(value || ''));
// Only these sources need a real translation; some imported prompts are already Chinese/Japanese.
const needsTranslation = (value) => !hasCjk(value) && !hasKanaOrHangul(value);
// Preserve structural placeholders; bracketed shot labels like "[Shot 1: …]" may be translated.
const placeholders = (value) => {
    const text = String(value || '');
    // {argument ...} placeholders and <...> slots must survive translation.
    // Bracketed labels such as [Style] may be localized, so they are not compared.
    const argumentCount = (text.match(/\{argument\b/g) || []).length;
    const angles = [...new Set(text.match(/<[^>]{1,80}>/g) || [])].sort().join('|');
    return `${argumentCount}|${angles}`;
};
// Decorative/emoji/Korean/ASCII-art records were deliberately kept verbatim by the translators.
const NON_TRANSLATABLE_CONTENT = new Set(['461', '462', '463', '464', '542']);

const validateBatch = (batchMeta) => {
    const errors = [];
    const inputs = JSON.parse(fs.readFileSync(batchMeta.input, 'utf8'));
    const outPath = batchMeta.output;
    if (!fs.existsSync(outPath)) {
        return [`batch ${batchMeta.batch}: output file missing`];
    }
    let outputs;
    try {
        outputs = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch (error) {
        return [`batch ${batchMeta.batch}: output is not valid JSON (${error.message})`];
    }
    if (!Array.isArray(outputs)) return [`batch ${batchMeta.batch}: output is not an array`];
    if (outputs.length !== inputs.length) {
        errors.push(`batch ${batchMeta.batch}: expected ${inputs.length} items, got ${outputs.length}`);
    }

    const byId = new Map(outputs.map((item) => [String(item?.id), item]));
    const records = [];
    for (const input of inputs) {
        const output = byId.get(String(input.id));
        if (!output) {
            errors.push(`batch ${batchMeta.batch}: missing id ${input.id}`);
            continue;
        }
        const record = { id: String(input.id) };
        if (input.needTitle) {
            const value = output.title_zh;
            if (typeof value !== 'string' || !value.trim()) errors.push(`id ${input.id}: empty title_zh`);
            else if (needsTranslation(input.title_en) && value === input.title_en) errors.push(`id ${input.id}: title_zh equals English`);
            else if (!hasCjk(value)) errors.push(`id ${input.id}: title_zh has no Chinese`);
            record.title_zh = value.trim();
        }
        if (input.needDesc) {
            const value = output.description_zh;
            if (typeof value !== 'string' || !value.trim()) errors.push(`id ${input.id}: empty description_zh`);
            else if (needsTranslation(input.description_en) && value === input.description_en) errors.push(`id ${input.id}: description_zh equals English`);
            else if (!hasCjk(value)) errors.push(`id ${input.id}: description_zh has no Chinese`);
            record.description_zh = value.trim();
        }
        if (input.needContent) {
            const value = output.chinese_content;
            const verbatimOk = NON_TRANSLATABLE_CONTENT.has(String(input.id));
            const translatable = needsTranslation(input.content) && !verbatimOk;
            if (typeof value !== 'string' || !value.trim()) errors.push(`id ${input.id}: empty chinese_content`);
            else if (translatable && value === input.content) errors.push(`id ${input.id}: chinese_content equals English`);
            else if (translatable && !hasCjk(value)) errors.push(`id ${input.id}: chinese_content has no Chinese`);
            else {
                if (translatable) {
                    const ratio = value.length / Math.max(1, String(input.content).length);
                    if (ratio < 0.12 || ratio > 1.6) {
                        errors.push(`id ${input.id}: chinese_content length ratio looks off (${ratio.toFixed(2)})`);
                    }
                }
                if (placeholders(value) !== placeholders(input.content)) {
                    errors.push(`id ${input.id}: placeholders changed`);
                }
            }
            record.chinese_content = value.trim();
        }
        records.push(record);
    }
    return { errors, records };
};

const main = async () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(baseDir, 'manifest.json'), 'utf8'));
    const allRecords = [];
    const allErrors = [];
    for (const batchMeta of manifest.batches) {
        const result = validateBatch(batchMeta);
        if (Array.isArray(result)) {
            allErrors.push(...result);
            continue;
        }
        allErrors.push(...result.errors);
        allRecords.push(...result.records);
    }

    console.log(`validated ${allRecords.length}/${manifest.total} records; ${allErrors.length} error(s)`);
    if (allErrors.length > 0) {
        console.error(allErrors.slice(0, 40).join('\n'));
        if (allErrors.length > 40) console.error(`... and ${allErrors.length - 40} more`);
        process.exit(1);
    }

    if (!apply) {
        console.log('dry run only — pass --apply to write to the database');
        return;
    }

    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const backupPath = `/tmp/pentaprompt-zh-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    try {
        const ids = allRecords.map((record) => record.id);
        const current = await pool.query(
            'SELECT id, title_zh, description_zh, chinese_content FROM prompts WHERE id = ANY($1::text[])',
            [ids]
        );
        fs.writeFileSync(backupPath, JSON.stringify(current.rows, null, 1));
        console.log(`backup of ${current.rowCount} rows -> ${backupPath}`);

        const client = await pool.connect();
        let updated = 0;
        try {
            await client.query('BEGIN');
            for (const record of allRecords) {
                const sets = [];
                const values = [];
                let index = 1;
                for (const field of ['title_zh', 'description_zh', 'chinese_content']) {
                    if (record[field] !== undefined) {
                        sets.push(`${field} = $${index++}`);
                        values.push(record[field]);
                    }
                }
                values.push(record.id);
                const result = await client.query(
                    `UPDATE prompts SET ${sets.join(', ')} WHERE id = $${index}`,
                    values
                );
                updated += result.rowCount;
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        console.log(`updated ${updated} rows`);
    } finally {
        await pool.end();
    }
};

main().catch((error) => {
    console.error('import failed:', error.message);
    process.exit(1);
});
