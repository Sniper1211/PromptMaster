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
import { guideArticles } from '../src/data/guides.js';

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
            'SELECT id, title_en, title_zh, description_en, description_zh, preview_image_url, category, tags, author_name, source_link, created_at FROM prompts ORDER BY id ASC'
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
            { path: '/terms', key: 'termsOfService' }
        ];
        for (const page of staticPages) {
            const seo = L.seo?.[page.key] || {};
            pages.push({
                path: page.path,
                title: seo.title || 'PentaPrompt',
                description: seo.description || '',
                type: 'website'
            });
        }

        // Guides index
        pages.push({
            path: '/guides',
            title: GUIDES_COPY[lang].title,
            description: GUIDES_COPY[lang].description,
            type: 'website'
        });

        // Guide articles
        for (const guide of guideArticles) {
            pages.push({
                path: `/guides/${guide.slug}`,
                title: `${guide.title[lang]} | PentaPrompt`,
                description: guide.description[lang],
                type: 'article',
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
