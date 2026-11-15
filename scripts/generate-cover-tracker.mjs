#!/usr/bin/env node
/**
 * Regenerate the cover-PROGRESS tracker (styled .xlsx + pending-only .csv).
 *
 *   node scripts/generate-cover-tracker.mjs
 *   node scripts/generate-cover-tracker.mjs --out ~/PromptMaster-补图清单.xlsx --csv-out ~/PromptMaster-补图工作清单.csv
 *
 * Status rules:
 *   ✅ 已补图   preview_image_url is an R2 AI-generated cover (https://img.ok9981.com/...)
 *   ⬜ 待补图   no preview image
 *   已有原图    any other image (repo-hosted local cover or legacy external URL)
 *
 * Completed rows are KEPT and highlighted (green); pending rows stay white; original stock covers are grey.
 * The publish script (scripts/publish-generated-images.mjs) calls this automatically after every import.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import ExcelJS from 'exceljs';

const ROOT = path.resolve(process.cwd());
dotenv.config({ path: path.join(ROOT, '.env') });

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : fallback;
};
const WORKSPACE = fs.existsSync(path.join(os.homedir(), 'dsh')) ? path.join(os.homedir(), 'dsh') : os.homedir();
const OUT_XLSX = path.resolve(getArg('--out', process.env.COVER_TRACKER_OUT || path.join(WORKSPACE, 'PromptMaster-补图清单.xlsx')));
const OUT_CSV = path.resolve(getArg('--csv-out', path.join(WORKSPACE, 'PromptMaster-补图工作清单.csv')));
const DOCS_LOG = path.join(ROOT, 'docs/generated-images.md');

const STATUS = {
    done: { label: '✅ 已补图', fill: 'FFC6EFCE', font: 'FF006100' },
    pending: { label: '⬜ 待补图', fill: 'FFFFF2CC', font: 'FF7F6000' },
    stock: { label: '已有原图', fill: 'FFF2F2F2', font: 'FF595959' }
};
const PRIORITY = { PHOTOGRAPHY: 1, VIDEO: 2 };

const isGenerated = (url) => typeof url === 'string' && url.startsWith('https://img.ok9981.com/');

const parseDoneDates = () => {
    const dates = new Map();
    if (!fs.existsSync(DOCS_LOG)) return dates;
    const lines = fs.readFileSync(DOCS_LOG, 'utf8').split('\n');
    for (const line of lines) {
        const match = line.match(/^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([0-9]+)\s*\|[^|]*\|[^|]*\|/);
        if (match) dates.set(match[2], match[1]);
    }
    return dates;
};

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const rows = (await pool.query(`
    SELECT id, category, prompt_type, title_zh, title_en, description_zh, description_en,
           content, source_link, author_name, preview_image_url
    FROM prompts
    ORDER BY id ASC
`)).rows;
await pool.end();

const doneDates = parseDoneDates();
const items = rows.map((row) => {
    const status = isGenerated(row.preview_image_url) ? 'done' : (row.preview_image_url ? 'stock' : 'pending');
    return { ...row, status, doneDate: status === 'done' ? (doneDates.get(String(row.id)) || '') : '' };
});
const pending = items.filter((item) => item.status === 'pending');
const done = items.filter((item) => item.status === 'done');
const stock = items.filter((item) => item.status === 'stock');

const HEADERS = ['状态', 'ID', '类别', '类型', '中文标题', '英文标题', '中文描述', '英文描述', 'Prompt 正文', '建议文件名', '封面地址', '完成日期', '来源链接', '作者'];
const WIDTHS = [11, 18, 12, 8, 30, 34, 44, 44, 70, 18, 42, 12, 34, 14];

const addSheet = (workbook, name, data, freeze = 'C2') => {
    const sheet = workbook.addWorksheet(name, { views: [{ state: 'frozen', xSplit: 2, ySplit: 1 }] });
    sheet.columns = HEADERS.map((header, index) => ({ header, width: WIDTHS[index], key: header }));
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111111' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    headerRow.height = 24;

    for (const item of data) {
        const style = STATUS[item.status];
        const values = [
            style.label,
            item.id,
            item.category || '',
            item.prompt_type || 'text',
            item.title_zh || '',
            item.title_en || '',
            item.description_zh || '',
            item.description_en || '',
            item.content || '',
            `${item.id}.png`,
            item.preview_image_url || '',
            item.doneDate || '',
            item.source_link || '',
            item.author_name || ''
        ];
        const row = sheet.addRow(values);
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: style.fill } };
            cell.alignment = { vertical: 'top', wrapText: false };
            cell.font = { color: { argb: style.font }, size: 10 };
        });
        row.getCell(1).font = { bold: true, color: { argb: style.font }, size: 10 };
        row.getCell(1).alignment = { vertical: 'top', horizontal: 'center' };
        // Wrap the human-readable description columns only (prompt body stays one line so rows are not huge).
        for (const index of [5, 6, 7, 8, 13]) {
            row.getCell(index).alignment = { vertical: 'top', wrapText: true };
        }
        if (item.preview_image_url) {
            row.getCell(11).value = { text: item.preview_image_url, hyperlink: item.preview_image_url };
            row.getCell(11).font = { color: { argb: 'FF0563C1' }, underline: true, size: 10 };
        }
        if (item.source_link) {
            row.getCell(13).value = { text: item.source_link, hyperlink: item.source_link };
            row.getCell(13).font = { color: { argb: 'FF0563C1' }, underline: true, size: 10 };
        }
    }
    if (data.length) {
        sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: data.length + 1, column: HEADERS.length } };
    }
    sheet.properties.defaultRowHeight = 30;
    return sheet;
};

const workbook = new ExcelJS.Workbook();
workbook.creator = 'PentaPrompt publish pipeline';
workbook.created = new Date();

// Sheet 1: working list (pending first, completed kept below)
const workingRows = [
    ...pending.slice().sort((a, b) => (PRIORITY[a.category] || 3) - (PRIORITY[b.category] || 3) || String(a.id).localeCompare(String(b.id))),
    ...done.slice().sort((a, b) => (b.doneDate || '').localeCompare(a.doneDate || '') || String(a.id).localeCompare(String(b.id)))
];
addSheet(workbook, '补图清单', workingRows);

// Sheet 2: full library for review
addSheet(workbook, '全部提示词', items);

// Sheet 3: summary
const summary = workbook.addWorksheet('统计');
summary.columns = [{ header: '类别', width: 18 }, { header: '总数', width: 10 }, { header: '已补图', width: 10 }, { header: '待补图', width: 10 }, { header: '原有图', width: 10 }];
summary.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111111' } };
});
const categories = [...new Set(items.map((item) => item.category || 'UNKNOWN'))].sort();
for (const category of categories) {
    const ofCategory = items.filter((item) => (item.category || 'UNKNOWN') === category);
    summary.addRow([
        category,
        ofCategory.length,
        ofCategory.filter((item) => item.status === 'done').length,
        ofCategory.filter((item) => item.status === 'pending').length,
        ofCategory.filter((item) => item.status === 'stock').length
    ]);
}
summary.addRow(['合计', items.length, done.length, pending.length, stock.length]);
summary.getRow(summary.rowCount).font = { bold: true };

fs.mkdirSync(path.dirname(OUT_XLSX), { recursive: true });
await workbook.xlsx.writeFile(OUT_XLSX);

// Pending-only CSV for tooling / quick copy
const esc = (value) => `"${String(value ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
const csvHeaders = ['priority', 'id', 'category', 'prompt_type', 'suggested_filename', 'recommended_aspect', 'title_zh', 'title_en', 'description_zh', 'description_en', 'prompt_content', 'source_link', 'author_name'];
const csvLines = [csvHeaders.join(',')];
for (const item of pending.slice().sort((a, b) => (PRIORITY[a.category] || 3) - (PRIORITY[b.category] || 3) || String(a.id).localeCompare(String(b.id)))) {
    csvLines.push([
        PRIORITY[item.category] || 3, item.id, item.category, item.prompt_type || 'text', `${item.id}.png`, '4:3 (1024x768 recommended)',
        item.title_zh, item.title_en, item.description_zh, item.description_en, item.content, item.source_link, item.author_name
    ].map(esc).join(','));
}
fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });
fs.writeFileSync(OUT_CSV, `${csvLines.join('\n')}\n`);

console.log(`tracker: ${OUT_XLSX}`);
console.log(`pending csv: ${OUT_CSV}`);
console.log(`status: 已补图 ${done.length} | 待补图 ${pending.length} | 已有原图 ${stock.length} | 总 ${items.length}`);
