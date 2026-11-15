#!/usr/bin/env node
/**
 * Generate the cover-progress tracker as a standalone HTML page (plus a pending-only CSV).
 *
 *   node scripts/generate-cover-tracker.mjs
 *   node scripts/generate-cover-tracker.mjs --out public/cover-tracker.html --csv-out /path/pending.csv
 *
 * The page lists prompts that still need a cover (⬜ 待补图) and prompts that already have an
 * AI-generated cover (✅ 已补图, kept for review, highlighted green). Original stock covers are
 * summarised in the header but not listed (the table stays small and fast).
 *
 * Features: live search (`/` to focus), status/category filters, sorting, one-click copy of the
 * prompt text / title / description, links to the prompt page and source.
 *
 * The publish script (scripts/publish-generated-images.mjs) regenerates this page after every import,
 * commits it together with docs/generated-images.md, and deploys it to https://pentaprompt.com/cover-tracker.html
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

const ROOT = path.resolve(process.cwd());
dotenv.config({ path: path.join(ROOT, '.env') });

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : fallback;
};
const WORKSPACE = fs.existsSync(path.join(os.homedir(), 'dsh')) ? path.join(os.homedir(), 'dsh') : os.homedir();
const OUT_HTML = path.resolve(getArg('--out', path.join(ROOT, 'public/cover-tracker.html')));
const OUT_CSV = path.resolve(getArg('--csv-out', path.join(WORKSPACE, 'PromptMaster-补图工作清单.csv')));
const DOCS_LOG = path.join(ROOT, 'docs/generated-images.md');
const PRIORITY = { PHOTOGRAPHY: 1, VIDEO: 2 };

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const isGenerated = (url) => typeof url === 'string' && url.startsWith('https://img.ok9981.com/');

const parseDoneDates = () => {
    const dates = new Map();
    if (!fs.existsSync(DOCS_LOG)) return dates;
    for (const line of fs.readFileSync(DOCS_LOG, 'utf8').split('\n')) {
        const match = line.match(/^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([0-9]+)\s*\|[^|]*\|[^|]*\|/);
        if (match) dates.set(match[2], match[1]);
    }
    return dates;
};

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const rows = (await pool.query(`
    SELECT id, category, prompt_type, title_zh, title_en, description_zh, description_en,
           content, source_link, author_name, preview_image_url
    FROM prompts ORDER BY id ASC
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

const pendingSorted = pending.slice().sort((a, b) => (PRIORITY[a.category] || 3) - (PRIORITY[b.category] || 3) || String(a.id).localeCompare(String(b.id)));
const doneSorted = done.slice().sort((a, b) => (b.doneDate || '').localeCompare(a.doneDate || '') || String(b.id).localeCompare(String(a.id)));
const visible = [...pendingSorted, ...doneSorted];

const STATUS_META = {
    pending: { label: '⬜ 待补图', className: 'pending' },
    done: { label: '✅ 已补图', className: 'done' }
};

const rowsHtml = visible.map((item) => {
    const meta = STATUS_META[item.status];
    const search = [item.id, item.category, item.prompt_type, item.title_zh, item.title_en, item.description_zh, item.description_en, item.author_name]
        .filter(Boolean).join(' ').toLowerCase();
    const thumb = item.status === 'done'
        ? `<a class="thumb" href="${escapeHtml(item.preview_image_url)}" target="_blank" rel="noreferrer"><img src="${escapeHtml(item.preview_image_url)}" alt="" loading="lazy" /></a>`
        : `<div class="thumb empty"><span>待补图</span></div>`;
    const doneInfo = item.status === 'done' && item.doneDate ? `<div class="meta">完成于 ${escapeHtml(item.doneDate)}</div>` : '';
    const source = item.source_link ? `<a href="${escapeHtml(item.source_link)}" target="_blank" rel="noreferrer">来源</a>` : '';
    return `<tr data-id="${escapeHtml(item.id)}" data-status="${item.status}" data-cat="${escapeHtml(item.category || 'UNKNOWN')}" data-search="${escapeHtml(search)}">
<td>${thumb}</td>
<td class="status-cell"><span class="badge ${meta.className}">${meta.label}</span>${doneInfo}</td>
<td><a class="id" href="/prompt/${escapeHtml(item.id)}" target="_blank">${escapeHtml(item.id)}</a><div class="meta">${escapeHtml(item.category || 'UNKNOWN')} · ${escapeHtml(item.prompt_type || 'text')}</div></td>
<td class="text-cell"><div class="title-zh">${escapeHtml(item.title_zh || '(无标题)')}</div><div class="muted">${escapeHtml(item.title_en || '')}</div></td>
<td class="text-cell"><div class="desc">${escapeHtml(item.description_zh || '')}</div></td>
<td class="ops">
<button class="copy primary" data-copy="content" data-id="${escapeHtml(item.id)}">复制提示词</button>
<button class="copy" data-copy="title" data-id="${escapeHtml(item.id)}">标题</button>
<button class="copy" data-copy="description" data-id="${escapeHtml(item.id)}">描述</button>
<a href="/prompt/${escapeHtml(item.id)}" target="_blank">详情</a>
${source}
</td>
</tr>`;
}).join('\n');

const records = visible.map((item) => ({
    id: String(item.id),
    content: item.content || '',
    title_zh: item.title_zh || '',
    description_zh: item.description_zh || ''
}));
const recordsJson = JSON.stringify(records).replace(/</g, '\\u003c');

const categories = [...new Set(visible.map((item) => item.category || 'UNKNOWN'))].sort();
const categoryOptions = categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
const generatedAt = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
const total = items.length;

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>PentaPrompt 补图追踪表</title>
<style>
  :root { color-scheme: light; --ink:#111; --muted:#6b7280; --line:#e5e7eb; --bg:#fafafa; --accent:#2dd4bf; --done:#e9f7ec; --done-ink:#047857; --pending:#fff8dc; --pending-ink:#92400e; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB",sans-serif; }
  header { padding:22px 28px 16px; background:#111; color:#fff; }
  header h1 { margin:0 0 6px; font-size:20px; }
  header .sub { color:#9ca3af; font-size:12px; }
  .stats { display:flex; gap:10px; margin-top:14px; flex-wrap:wrap; }
  .stat { background:#1f2937; border-radius:8px; padding:8px 12px; min-width:104px; }
  .stat b { display:block; font-size:20px; }
  .stat span { font-size:11px; color:#9ca3af; }
  .stat.done b { color:#6ee7b7; }
  .stat.pending b { color:#fcd34d; }
  .toolbar { position:sticky; top:0; z-index:10; background:#fff; border-bottom:1px solid var(--line); padding:10px 28px; display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  .toolbar input[type=search] { flex:1 1 260px; min-width:220px; border:1px solid var(--line); border-radius:8px; padding:9px 12px; font-size:13px; }
  .filters { display:flex; gap:6px; flex-wrap:wrap; }
  .filters button { border:1px solid var(--line); background:#fff; border-radius:20px; padding:7px 12px; font-size:12px; cursor:pointer; }
  .filters button.active { background:#111; color:#fff; border-color:#111; }
  .filters button b { font-weight:600; }
  select { border:1px solid var(--line); border-radius:8px; padding:8px 10px; font-size:12px; background:#fff; }
  #count { font-size:12px; color:var(--muted); margin-left:auto; }
  main { padding:14px 28px 40px; }
  table { width:100%; border-collapse:collapse; background:#fff; border:1px solid var(--line); }
  thead th { position:sticky; top:57px; background:#111; color:#fff; font-size:12px; text-align:left; padding:10px; z-index:5; }
  tbody tr { border-top:1px solid var(--line); }
  tbody tr[data-status="done"] { background:var(--done); }
  tbody tr[data-status="pending"] { background:var(--pending); }
  tbody tr[hidden] { display:none; }
  td { padding:10px; vertical-align:top; font-size:13px; }
  .thumb { display:block; width:96px; height:72px; border-radius:6px; overflow:hidden; background:#eee; border:1px solid var(--line); }
  .thumb img { width:100%; height:100%; object-fit:cover; display:block; }
  .thumb.empty { display:flex; align-items:center; justify-content:center; color:#9ca3af; font-size:11px; }
  .badge { display:inline-block; border-radius:20px; padding:3px 8px; font-size:11px; font-weight:600; white-space:nowrap; }
  .badge.pending { background:#fde68a; color:#78350f; }
  .badge.done { background:#a7f3d0; color:#065f46; }
  .meta { font-size:11px; color:var(--muted); margin-top:3px; }
  .muted { font-size:11px; color:var(--muted); margin-top:3px; }
  .id { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:12px; color:#0f766e; text-decoration:none; }
  .title-zh { font-weight:600; font-size:13px; }
  .desc { max-width:520px; color:#374151; font-size:12px; line-height:1.5; }
  .text-cell { max-width:560px; }
  .ops { white-space:nowrap; }
  .ops button, .ops a { display:inline-block; margin:2px 3px 2px 0; border-radius:6px; border:1px solid var(--line); background:#fff; padding:5px 8px; font-size:11px; cursor:pointer; color:var(--ink); text-decoration:none; }
  .ops button.primary { background:var(--accent); border-color:#0f766e; font-weight:600; }
  .ops button:hover, .ops a:hover { background:#f3f4f6; }
  .ops button.primary:hover { background:#5eead4; }
  #toast { position:fixed; left:50%; bottom:24px; transform:translateX(-50%); background:#111; color:#fff; padding:9px 16px; border-radius:8px; font-size:13px; opacity:0; pointer-events:none; transition:opacity .18s; z-index:50; }
  #toast.show { opacity:1; }
  .note { margin:14px 0 0; font-size:12px; color:var(--muted); }
  @media (max-width:900px) { .stats .stat { min-width:80px; } thead { display:none; } table, tbody, tr, td { display:block; width:100%; } tbody tr { padding:8px 0; } td { padding:4px 10px; } .thumb { width:100%; height:auto; aspect-ratio:4/3; } }
</style>
</head>
<body>
<header>
  <h1>PentaPrompt 补图追踪表</h1>
  <div class="sub">生成时间 ${escapeHtml(generatedAt)} · 本表列出待补图 + 已补图（共 ${visible.length} 条）；已有原图的 ${stock.length} 条省略（站内搜索仍可找到）。</div>
  <div class="stats">
    <div class="stat"><b>${total}</b><span>提示词总数</span></div>
    <div class="stat done"><b>${done.length}</b><span>✅ 已补图（AI 封面）</span></div>
    <div class="stat pending"><b>${pending.length}</b><span>⬜ 待补图</span></div>
    <div class="stat"><b>${stock.length}</b><span>已有原图（不在本表）</span></div>
  </div>
</header>
<div class="toolbar">
  <input id="q" type="search" placeholder="搜索 ID / 标题 / 描述 / 提示词…（按 / 聚焦）" />
  <div class="filters">
    <button data-status="all" class="active">全部 <b>${visible.length}</b></button>
    <button data-status="pending">待补图 <b>${pending.length}</b></button>
    <button data-status="done">已补图 <b>${done.length}</b></button>
  </div>
  <select id="category"><option value="">全部分类</option>${categoryOptions}</select>
  <select id="sort">
    <option value="default">默认（待补图优先）</option>
    <option value="id">按 ID</option>
    <option value="category">按分类</option>
    <option value="done">按完成日期</option>
  </select>
  <span id="count"></span>
</div>
<main>
  <table>
    <thead><tr><th>封面</th><th>状态</th><th>ID / 分类</th><th>标题</th><th>描述</th><th>操作</th></tr></thead>
    <tbody id="rows">
${rowsHtml}
    </tbody>
  </table>
  <p class="note">提示词正文可通过「复制提示词」一键复制，直接粘贴到即梦使用；已补图的条目保留在表里方便回顾。新增图片后运行 <code>npm run publish:covers</code> 会自动刷新本页。</p>
</main>
<div id="toast"></div>
<script id="records" type="application/json">${recordsJson}</script>
<script>
(() => {
  const records = new Map(JSON.parse(document.getElementById('records').textContent).map((item) => [item.id, item]));
  const rows = Array.from(document.querySelectorAll('#rows tr'));
  const defaultOrder = rows.slice();
  const state = { status: 'all', category: '', query: '', sort: 'default' };
  const q = document.getElementById('q');
  const count = document.getElementById('count');
  const toastEl = document.getElementById('toast');
  let toastTimer = 0;

  const toast = (message) => {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1600);
  };

  const apply = () => {
    let visible = 0;
    for (const row of rows) {
      const record = records.get(row.dataset.id);
      const hitSearch = !state.query
        || row.dataset.search.includes(state.query)
        || (record?.content || '').toLowerCase().includes(state.query);
      const ok = (state.status === 'all' || row.dataset.status === state.status)
        && (!state.category || row.dataset.cat === state.category)
        && hitSearch;
      row.hidden = !ok;
      if (ok) visible++;
    }
    count.textContent = '显示 ' + visible + ' / ' + rows.length;
  };

  const reorder = () => {
    const tbody = document.getElementById('rows');
    const order = defaultOrder.slice();
    if (state.sort === 'id') order.sort((a, b) => Number(a.dataset.id) - Number(b.dataset.id));
    if (state.sort === 'category') order.sort((a, b) => a.dataset.cat.localeCompare(b.dataset.cat) || Number(a.dataset.id) - Number(b.dataset.id));
    if (state.sort === 'done') {
      const dateOf = (row) => (row.querySelector('.status-cell .meta')?.textContent || '').replace('完成于 ', '');
      order.sort((a, b) => (dateOf(b) || '').localeCompare(dateOf(a) || ''));
    }
    for (const row of order) tbody.appendChild(row);
    apply();
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    toast('已复制');
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-copy]');
    if (button) {
      const record = records.get(button.dataset.id);
      if (!record) return;
      const field = button.dataset.copy;
      const text = field === 'content' ? record.content : field === 'title' ? record.title_zh : record.description_zh;
      if (text) copyText(text);
      else toast('这条没有可复制的内容');
      return;
    }
    const statusButton = event.target.closest('[data-status]');
    if (statusButton) {
      state.status = statusButton.dataset.status;
      document.querySelectorAll('.filters button').forEach((node) => node.classList.toggle('active', node === statusButton));
      apply();
    }
  });

  q.addEventListener('input', () => { state.query = q.value.trim().toLowerCase(); apply(); });
  document.getElementById('category').addEventListener('change', (event) => { state.category = event.target.value; apply(); });
  document.getElementById('sort').addEventListener('change', (event) => { state.sort = event.target.value; reorder(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== q) { event.preventDefault(); q.focus(); }
    if (event.key === 'Escape' && document.activeElement === q) { q.value = ''; state.query = ''; q.blur(); apply(); }
  });
  apply();
})();
</script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(OUT_HTML), { recursive: true });
fs.writeFileSync(OUT_HTML, html, 'utf8');

// Pending-only CSV for tooling / quick copy
const esc = (value) => `"${String(value ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
const csvHeaders = ['priority', 'id', 'category', 'prompt_type', 'suggested_filename', 'recommended_aspect', 'title_zh', 'title_en', 'description_zh', 'description_en', 'prompt_content', 'source_link', 'author_name'];
const csvLines = [csvHeaders.join(',')];
for (const item of pendingSorted) {
    csvLines.push([
        PRIORITY[item.category] || 3, item.id, item.category, item.prompt_type || 'text', `${item.id}.png`, '4:3 (1024x768 recommended)',
        item.title_zh, item.title_en, item.description_zh, item.description_en, item.content, item.source_link, item.author_name
    ].map(esc).join(','));
}
fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });
fs.writeFileSync(OUT_CSV, `${csvLines.join('\n')}\n`);

console.log(`tracker html: ${OUT_HTML} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
console.log(`pending csv: ${OUT_CSV}`);
console.log(`status: 已补图 ${done.length} | 待补图 ${pending.length} | 已有原图 ${stock.length} | 总 ${total}`);
