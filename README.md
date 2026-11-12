# PentaPrompt

A bilingual (English / 中文) library of curated AI prompts — focused on video & image generation prompts, plus writing, coding and marketing templates.

**Live site:** https://pentaprompt.com

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript, Vite 6, React Router 7, Tailwind CSS 3, i18next |
| Backend | Vercel Serverless Functions (`/api`) |
| Database | Neon (PostgreSQL) via `pg` |
| Deploy | Vercel (production = `main` branch) + Cloudflare (proxy / WAF) |
| SEO | Per-route meta via `react-helmet-async` (`src/components/seo/SEOHead.tsx`) |

## Project structure

```
src/
  components/layout/   SiteHeader, Sidebar (filters), Footer, LanguageSwitcher
  components/home/     PromptGrid, SkeletonGrid
  components/          PromptCard, admin modal, ads, common
  pages/               Home, PromptDetail, Collection, Guides, About/Contact/legal, Admin, 404
  hooks/               usePrompts, usePromptDetail, useLanguage
  data/guides.js       Editorial guides (bilingual)
  locales/             en.json / zh.json — UI copy (keep both files in sync)
api/                   Vercel functions; shared helpers in api/_lib/
scripts/               build sitemap, DB utilities (one-off scripts live here too — read before running)
db/                    Schema & migrations (optional; Neon console is the source of truth today)
public/                Static assets, sitemap.xml, robots.txt
docs/                  Project policies (bilingual requirements) and notes
```

## Local development

Requirements: Node.js 20+ and a `.env` file (copy `.env.example`).

```bash
npm install
npm run dev        # Vite on :3000 + local API server on :3001
```

- `npm run dev` reads `.env` from the project root. `.env` is gitignored — never commit it.
- The local API server (`server/index.js`) proxies to the production Postgres via `DATABASE_URL`. Use a **least-privilege** `app_rw` role (no DDL); schema changes go through the Neon console.
- If `.env` is missing, copy it from your backup or recreate it from `.env.example`.

Useful commands:

```bash
npm run build       # generate sitemap, then build the production bundle
npm run build:sitemap
npx vite build      # frontend build only
```

> `npm run build` requires `DATABASE_URL`: the sitemap is generated from the live prompt list and the build fails loudly if the DB is unreachable (we never want to ship a sitemap that silently lost all prompt URLs).

## Environment variables

See `.env.example`. Summary:

| Variable | Scope | Notes |
|---|---|---|
| `DATABASE_URL` | server | Neon connection string (least-privilege role) |
| `ADMIN_PASSWORD` | server | Bearer token for admin endpoints (`/api/prompts` writes, upload, AI helpers) |
| `AI_API_KEY` / `AI_BASE_URL` / `AI_MODEL` | server | AI provider (optional — AI endpoints stay locked until configured) |
| `AI_RATE_LIMIT_MAX` | server | IP rate limit for AI endpoints (default 20 / 10 min) |
| `R2_*` | server | Cloudflare R2 image storage (optional) |
| `VITE_SUBMISSION_WEBHOOK_URL` | client | Public webhook for prompt submissions |

**Security rules**

- Never put secrets in `VITE_*` variables — they are compiled into the public JS bundle.
- Never commit `.env`, API keys or database passwords. Rotate credentials immediately if they leak.
- AI and write endpoints must stay behind `ADMIN_PASSWORD`; the rate limiter relies on the `ai_request_logs` table.

## Deploy

- Push to `main` → Vercel production deployment (production branch is `main`).
- `npm run build` runs `build:sitemap` first, then `vite build`.
- After deploying, smoke-check: `/`, `/prompt/<id>`, `/guides`, `/collections/video-prompts` return 200; anonymous `POST /api/generate-tips` returns 401; `/sitemap.xml` count matches the DB prompt count.
- Legacy URLs `/prompts` and `/discover` permanently redirect to `/` (see `vercel.json`).

## Content rules

- Public pages must be bilingual: English is the baseline, Chinese is added in the same change.
- SEO title/description must exist in both languages.
- See [docs/bilingual-page-policy.md](docs/bilingual-page-policy.md).

## Notes

- Prompt content is stored in PostgreSQL; the admin page (`/admin`) is the editing surface.
- Imported prompts keep their source link/author; provenance tags (e.g. `Imported`, `Nano Banana`, `AI Art`) are filtered out of the UI.
- Copy counts are real events only — no seeded/random counts.
