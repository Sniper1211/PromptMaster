/**
 * Build-time SEO prerender.
 *
 * The app is a client-side SPA; social crawlers and non-JS crawlers only see the
 * shell from index.html. This script writes per-route HTML files (English at the
 * root, Chinese under /zh) that contain the correct <title>, description,
 * canonical, hreflang, Open Graph, Twitter and JSON-LD tags.
 *
 * A tiny inline script removes the prerendered tags right before React mounts, so
 * react-helmet-async stays the single source of head tags for JS-enabled clients
 * (and crawlers that execute JS see the same values, not duplicates).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import { getPublishedGuides } from '../src/data/guides.js';
import { categoryEditorial, categoryEditorialFallback, categoryTitle } from '../src/data/categoryEditorial.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = 'https://pentaprompt.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
const DIST = path.resolve(__dirname, '../dist');

const locales = {
    en: JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/locales/en.json'), 'utf8')),
    zh: JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/locales/zh.json'), 'utf8'))
};

// Guides index copy lives in GuidesPage.tsx (not in the locale files); keep these in sync.
const GUIDES_COPY = {
    en: {
        title: 'AI Prompt Guides | PentaPrompt',
        description:
            'Practical guides on prompt writing, SEO, commercial visuals, and team workflows—frameworks, examples, and checklists for more reliable outputs.'
    },
    zh: {
        title: 'AI Prompt 指南 | PentaPrompt',
        description:
            '围绕提示词写作、SEO、商业视觉与团队工作流的实战指南，提供写法框架、示例与清单，帮助你获得更稳定的结果。'
    }
};

const COLLECTIONS = [
    { slug: 'writing-prompts', key: 'writing' },
    { slug: 'seo-prompts', key: 'seo' },
    { slug: 'marketing-prompts', key: 'marketing' },
    { slug: 'coding-prompts', key: 'coding' },
    { slug: 'video-prompts', key: 'video' }
];

const esc = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const absoluteImage = (image) => {
    if (!image) return DEFAULT_IMAGE;
    if (/^https?:\/\//i.test(image)) return image;
    return `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
};

const localized = (lang, value) => (lang === 'zh' ? value.zh : value.en) || '';

const hrefFor = (lang, path) => (lang === 'zh' ? (path === '/' ? '/zh' : `/zh${path}`) : path);

const promptTitle = (row, lang) =>
    lang === 'zh' ? row.title_zh || row.title_en || '' : row.title_en || row.title_zh || '';

const promptDescription = (row, lang) =>
    lang === 'zh' ? row.description_zh || row.description_en || '' : row.description_en || row.description_zh || '';

const promptContent = (row, lang) =>
    (lang === 'zh' ? row.chinese_content || row.content : row.content) || '';

const categoryLabel = (category, lang) => {
    const entry = categoryTitle[category];
    return entry ? localized(lang, entry) : category || '';
};

const categoryContext = (category, lang) => {
    const entry = categoryEditorial[category];
    return entry ? localized(lang, entry) : localized(lang, categoryEditorialFallback);
};

const bodyShell = (inner) =>
    `<div style="max-width:980px;margin:0 auto;padding:28px 20px;font-family:system-ui,-apple-system,'Segoe UI','PingFang SC',sans-serif;line-height:1.7;color:#111827;background:#fff">${inner}</div>`;

const renderPromptBody = (row, lang, allPrompts) => {
    const zh = lang === 'zh';
    const title = promptTitle(row, lang);
    const description = promptDescription(row, lang);
    const content = promptContent(row, lang);
    const rawContent = row.content || '';
    const chinese = row.chinese_content || '';
    const usage = row.usage || '';
    const source = row.source_link || '';
    const related = allPrompts
        .filter((item) => String(item.id) !== String(row.id) && item.category === row.category)
        .slice(0, 6);
    return bodyShell(`
<nav style="font-size:13px;color:#6b7280;margin-bottom:18px">
  <a href="${hrefFor(lang, '/')}" style="color:#111827;text-decoration:none">${zh ? '首页' : 'Home'}</a> /
  <a href="${hrefFor(lang, '/')}?category=${encodeURIComponent(row.category || '')}" style="color:#111827;text-decoration:none">${esc(categoryLabel(row.category, lang))}</a>
</nav>
<article>
  <h1 style="font-size:30px;line-height:1.3;margin:0 0 12px">${esc(title)}</h1>
  <p style="font-size:16px;color:#374151;margin:0 0 20px">${esc(description)}</p>
  <h2 style="font-size:20px;margin:24px 0 8px">${zh ? '提示词' : 'Prompt'}</h2>
  <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e5e7eb;padding:16px;border-radius:8px;font-size:14px;overflow:auto">${esc(content)}</pre>
  ${chinese && chinese !== rawContent ? `<h2 style="font-size:20px;margin:24px 0 8px">${zh ? '中文对照' : 'Chinese version'}</h2><pre style="white-space:pre-wrap;background:#fffbeb;border:1px solid #fde68a;padding:16px;border-radius:8px;font-size:14px;overflow:auto">${esc(chinese)}</pre>` : ''}
  ${usage ? `<h2 style="font-size:20px;margin:24px 0 8px">${zh ? '使用建议' : 'How to use'}</h2><pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e5e7eb;padding:16px;border-radius:8px;font-size:14px;overflow:auto">${esc(usage)}</pre>` : ''}
  <h2 style="font-size:20px;margin:24px 0 8px">${zh ? '关于这个分类' : 'About this category'}</h2>
  <p style="font-size:15px;color:#374151">${esc(categoryContext(row.category, lang))}</p>
  ${source ? `<p style="font-size:13px;color:#6b7280;margin-top:20px">${zh ? '来源' : 'Source'}: <a href="${esc(source)}" rel="noreferrer nofollow">${esc(source)}</a></p>` : ''}
</article>
${related.length ? `<section style="margin-top:28px"><h2 style="font-size:20px">${zh ? '相关提示词' : 'Related prompts'}</h2><ul style="padding-left:20px">${related.map((item) => `<li style="margin:8px 0"><a href="${hrefFor(lang, `/prompt/${item.id}`)}">${esc(promptTitle(item, lang))}</a><div style="font-size:13px;color:#6b7280">${esc(promptDescription(item, lang))}</div></li>`).join('')}</ul></section>` : ''}
<footer style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280">
  <a href="${hrefFor(lang, '/')}" style="color:#111827">${zh ? '浏览全部提示词' : 'Browse all prompts'}</a> ·
  <a href="${hrefFor(lang, '/guides')}" style="color:#111827">${zh ? '提示词指南' : 'Guides'}</a> ·
  <a href="${hrefFor(lang, '/about')}" style="color:#111827">${zh ? '关于' : 'About'}</a>
</footer>
`);
};

const renderListBody = (title, description, rows, lang) => {
    const zh = lang === 'zh';
    return bodyShell(`
<nav style="font-size:13px;color:#6b7280;margin-bottom:18px"><a href="${hrefFor(lang, '/')}" style="color:#111827;text-decoration:none">${zh ? '首页' : 'Home'}</a></nav>
<h1 style="font-size:30px;line-height:1.3;margin:0 0 12px">${esc(title)}</h1>
<p style="font-size:16px;color:#374151;margin:0 0 22px">${esc(description)}</p>
<h2 style="font-size:20px;margin:24px 0 10px">${zh ? '精选提示词' : 'Selected prompts'}</h2>
<ul style="padding-left:20px">${rows.map((row) => `<li style="margin:10px 0"><a href="${hrefFor(lang, `/prompt/${row.id}`)}" style="color:#0f766e">${esc(promptTitle(row, lang))}</a><div style="font-size:13px;color:#6b7280">${esc(promptDescription(row, lang))}</div></li>`).join('')}</ul>
<footer style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280">
  <a href="${hrefFor(lang, '/')}" style="color:#111827">${zh ? '浏览全部提示词' : 'Browse all prompts'}</a> ·
  <a href="${hrefFor(lang, '/guides')}" style="color:#111827">${zh ? '提示词指南' : 'Guides'}</a>
</footer>
`);
};

const renderGuidesBody = (lang) => {
    const zh = lang === 'zh';
    const items = getPublishedGuides().map((guide) => `<li style="margin:12px 0"><a href="${hrefFor(lang, `/guides/${guide.slug}`)}" style="font-size:17px;color:#0f766e;text-decoration:none">${esc(localized(lang, guide.title))}</a><div style="font-size:14px;color:#4b5563;margin-top:4px">${esc(localized(lang, guide.description))}</div></li>`).join('');
    return bodyShell(`<h1 style="font-size:30px">${esc(lang === 'zh' ? 'AI 提示词指南' : 'AI Prompt Guides')}</h1><p style="font-size:16px;color:#374151">${esc(GUIDES_COPY[lang].description)}</p><ul style="padding-left:20px">${items}</ul>`);
};

const renderGuideArticleBody = (guide, lang) => {
    const paragraph = (node) => `<p style="font-size:16px;color:#374151;line-height:1.8;margin:12px 0">${esc(localized(lang, node))}</p>`;
    const intro = (guide.intro || []).map(paragraph).join('');
    const takeaways = (guide.takeaways || []).map((item) => `<li style="margin:6px 0">${esc(localized(lang, item))}</li>`).join('');
    const sections = (guide.sections || []).map((section) => `<section style="margin:24px 0"><h2 style="font-size:21px">${esc(localized(lang, section.heading))}</h2>${(section.paragraphs || []).map(paragraph).join('')}${(section.bullets || []).length ? `<ul style="padding-left:20px">${section.bullets.map((bullet) => `<li style="margin:6px 0">${esc(localized(lang, bullet))}</li>`).join('')}</ul>` : ''}</section>`).join('');
    return bodyShell(`<nav style="font-size:13px;color:#6b7280;margin-bottom:18px"><a href="${hrefFor(lang, '/')}" style="color:#111827;text-decoration:none">${lang === 'zh' ? '首页' : 'Home'}</a> / <a href="${hrefFor(lang, '/guides')}" style="color:#111827;text-decoration:none">${lang === 'zh' ? '指南' : 'Guides'}</a></nav><article><p style="font-size:12px;text-transform:uppercase;letter-spacing:.16em;color:#6b7280">${esc(localized(lang, guide.kicker))}</p><h1 style="font-size:30px;line-height:1.3">${esc(localized(lang, guide.title))}</h1><p style="font-size:17px;color:#4b5563">${esc(localized(lang, guide.description))}</p>${intro}<h2 style="font-size:21px;margin-top:24px">${lang === 'zh' ? '关键要点' : 'Key takeaways'}</h2><ul style="padding-left:20px">${takeaways}</ul>${sections}</article>`);
};

const renderStaticBody = (page, lang, copy) =>
    bodyShell(`<h1 style="font-size:30px">${esc(copy.title)}</h1><p style="font-size:16px;color:#374151">${esc(copy.description)}</p><p style="font-size:14px;color:#6b7280;margin-top:24px">${lang === 'zh' ? '完整内容由交互页面呈现。' : 'The full interactive version of this page is available on the site.'}</p><p><a href="${hrefFor(lang, '/')}" style="color:#0f766e">${lang === 'zh' ? '返回提示词库' : 'Back to the prompt library'}</a></p>`);

const urlsFor = (routePath) => {
    const enUrl = `${BASE_URL}${routePath === '/' ? '' : routePath}`;
    const zhUrl = `${BASE_URL}${routePath === '/' ? '/zh' : `/zh${routePath}`}`;
    return { enUrl, zhUrl };
};

function buildMeta(lang, meta) {
    const { enUrl, zhUrl } = urlsFor(meta.path);
    const canonical = lang === 'zh' ? zhUrl : enUrl;
    const image = absoluteImage(meta.image);
    const ogLocale = lang === 'zh' ? 'zh_CN' : 'en_US';
    const altLocale = lang === 'zh' ? 'en_US' : 'zh_CN';

    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'PentaPrompt',
            url: BASE_URL,
            logo: `${BASE_URL}/logo.png`
        },
        ...(meta.schemas || [])
    ];

    const tags = [
        `<title data-prerender="1">${esc(meta.title)}</title>`,
        `<meta data-prerender="1" name="description" content="${esc(meta.description)}">`,
        `<meta data-prerender="1" name="robots" content="index, follow, max-image-preview:large">`,
        `<link data-prerender="1" rel="canonical" href="${canonical}">`,
        `<link data-prerender="1" rel="alternate" hreflang="en" href="${enUrl}">`,
        `<link data-prerender="1" rel="alternate" hreflang="zh" href="${zhUrl}">`,
        `<link data-prerender="1" rel="alternate" hreflang="x-default" href="${enUrl}">`,
        `<meta data-prerender="1" property="og:type" content="${meta.type || 'website'}">`,
        `<meta data-prerender="1" property="og:site_name" content="PentaPrompt">`,
        `<meta data-prerender="1" property="og:title" content="${esc(meta.title)}">`,
        `<meta data-prerender="1" property="og:description" content="${esc(meta.description)}">`,
        `<meta data-prerender="1" property="og:image" content="${esc(image)}">`,
        `<meta data-prerender="1" property="og:url" content="${canonical}">`,
        `<meta data-prerender="1" property="og:locale" content="${ogLocale}">`,
        `<meta data-prerender="1" property="og:locale:alternate" content="${altLocale}">`,
        `<meta data-prerender="1" name="twitter:card" content="summary_large_image">`,
        `<meta data-prerender="1" name="twitter:title" content="${esc(meta.title)}">`,
        `<meta data-prerender="1" name="twitter:description" content="${esc(meta.description)}">`,
        `<meta data-prerender="1" name="twitter:image" content="${esc(image)}">`,
        ...schemas.map(
            (schema) =>
                `<script data-prerender="1" type="application/ld+json">${JSON.stringify(schema)}</script>`
        )
    ];
    return tags.join('\n    ');
}

function writePage(routePath, lang, meta) {
    const html = meta.html;
    const dir = lang === 'zh' ? path.join(DIST, 'zh') : DIST;
    const relative =
        routePath === '/' ? 'index.html' : path.join(routePath.replace(/^\//, ''), 'index.html');
    const outPath = path.join(dir, relative);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
}

function renderHtml(lang, meta) {
    let html = this.template;
    html = html.replace('<html lang="en">', `<html lang="${lang}">`);
    html = html.replace('</head>', `    ${buildMeta(lang, meta)}\n  </head>`);
    if (meta.body) {
        html = html.replace('<div id="root"></div>', `<div id="root">${meta.body}</div>`);
    }
    // Remove prerendered head tags before React mounts (JS-enabled clients get
    // identical tags from react-helmet-async). Non-JS crawlers never run this.
    html = html.replace(
        '</body>',
        `    <script>document.querySelectorAll('head [data-prerender]').forEach(function(el){el.remove();});</script>\n  </body>`
    );
    return html;
}

async function main() {
    const templatePath = path.join(DIST, 'index.html');
    if (!fs.existsSync(templatePath)) {
        console.error('[prerender] dist/index.html not found — run vite build first.');
        process.exit(1);
    }
    const template = fs.readFileSync(templatePath, 'utf8');

    // SPA-only shell for non-indexable routes (admin) and unknown URLs served by the
    // catch-all rewrite. It has no canonical/OG tags and explicitly asks not to index.
    const noindexShell = template.replace(
        '</head>',
        '    <meta name="robots" content="noindex, nofollow">\n  </head>'
    );
    fs.writeFileSync(path.join(DIST, 'app.html'), noindexShell);

    const { Pool } = pg;
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    let prompts = [];
    try {
        const res = await pool.query(
            'SELECT id, title_en, title_zh, description_en, description_zh, content, chinese_content, usage, expected_output, prompt_type, preview_image_url, category, tags, author_name, source_link, created_at FROM prompts ORDER BY id ASC'
        );
        prompts = res.rows;
    } catch (error) {
        console.error('[prerender] FATAL: could not load prompts from database:', error.message);
        await pool.end();
        process.exit(1);
    }
    await pool.end();

    const all = [];
    for (const lang of ['en', 'zh']) {
        const L = locales[lang];
        const pages = [];

        // Static pages
        const staticPages = [
            { path: '/', key: 'library' },
            { path: '/about', key: 'about' },
            { path: '/contact', key: 'contact' },
            { path: '/privacy', key: 'privacyPolicy' },
            { path: '/terms', key: 'termsOfService' },
            { path: '/editorial-policy', key: 'editorialPolicy' },
            { path: '/copyright', key: 'copyright' }
        ];
        for (const page of staticPages) {
            const seo = L.seo?.[page.key] || {};
            const staticCopy = { title: seo.title || 'PentaPrompt', description: seo.description || '' };
            const staticBody = page.path === '/'
                ? renderListBody(staticCopy.title, staticCopy.description, prompts.slice(0, 30), lang)
                : renderStaticBody(page, lang, staticCopy);
            pages.push({
                path: page.path,
                title: seo.title || 'PentaPrompt',
                description: seo.description || '',
                type: 'website',
                body: staticBody
            });
        }

        // Guides index
        pages.push({
            path: '/guides',
            title: GUIDES_COPY[lang].title,
            description: GUIDES_COPY[lang].description,
            type: 'website',
            body: renderGuidesBody(lang)
        });

        // Guide articles
        for (const guide of getPublishedGuides()) {
            pages.push({
                path: `/guides/${guide.slug}`,
                title: `${guide.title[lang]} | PentaPrompt`,
                description: guide.description[lang],
                type: 'article',
                body: renderGuideArticleBody(guide, lang),
                schemas: [
                    {
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: guide.title[lang],
                        description: guide.description[lang],
                        mainEntityOfPage: `${BASE_URL}${lang === 'zh' ? '/zh' : ''}/guides/${guide.slug}`,
                        publisher: { '@type': 'Organization', name: 'PentaPrompt' }
                    }
                ]
            });
        }

        // Collections
        for (const collection of COLLECTIONS) {
            const seo = L.seo?.collections?.[collection.key] || {};
            pages.push({
                path: `/collections/${collection.slug}`,
                title: seo.title || `Prompt Collections | PentaPrompt`,
                description: seo.description || '',
                type: 'website',
                body: renderListBody(
                    seo.title || 'Prompt Collections',
                    seo.description || '',
                    prompts.filter((row) => {
                        if (collection.key === 'video') return (row.prompt_type || 'text') === 'video';
                        const map = { writing: 'WRITING', seo: 'SEO', marketing: 'MARKETING', coding: 'CODING', video: 'VIDEO' };
                        return row.category === map[collection.key];
                    }).slice(0, 40),
                    lang
                ),
                schemas: [
                    {
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: seo.title || collection.slug,
                        description: seo.description || ''
                    }
                ]
            });
        }

        // Prompt detail pages
        for (const row of prompts) {
            const title = lang === 'zh' ? row.title_zh || row.title_en : row.title_en || row.title_zh;
            const description =
                lang === 'zh' ? row.description_zh || row.description_en : row.description_en || row.description_zh;
            const keywords = (() => {
                try {
                    const parsed = JSON.parse(row.tags || '[]');
                    return Array.isArray(parsed) ? parsed.join(', ') : '';
                } catch {
                    return '';
                }
            })();
            pages.push({
                path: `/prompt/${row.id}`,
                title: `${title} - PentaPrompt`,
                description: description || '',
                image: row.preview_image_url || undefined,
                type: 'article',
                body: renderPromptBody(row, lang, prompts),
                schemas: [
                    {
                        '@context': 'https://schema.org',
                        '@type': 'CreativeWork',
                        name: title,
                        headline: title,
                        description: description || '',
                        genre: row.category,
                        keywords,
                        datePublished: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : undefined,
                        author: row.author_name
                            ? { '@type': 'Person', name: row.author_name }
                            : { '@type': 'Organization', name: 'PentaPrompt' },
                        url: `${BASE_URL}${lang === 'zh' ? '/zh' : ''}/prompt/${row.id}`
                    }
                ]
            });
        }

        for (const page of pages) {
            const meta = { ...page };
            meta.html = renderHtml.call({ template }, lang, page);
            writePage(page.path, lang, meta);
            all.push(lang === 'zh' ? `zh:${page.path}` : page.path);
        }
    }

    console.log(`[prerender] wrote ${all.length} localized HTML pages (en + zh)`);
}

main().catch((error) => {
    console.error('[prerender] failed:', error);
    process.exit(1);
});
