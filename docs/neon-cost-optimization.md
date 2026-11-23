# Neon compute cost optimization

## Problem (2026-11-23)

Neon emailed: project PentaPrompt used **80.1 of 100 CU-hours** in the current cycle.

Evidence gathered from Cloudflare analytics (last 30 days):

| Metric | Value |
|---|---:|
| Total zone requests | 165,920 |
| `/api/prompts` requests | **20,970** (≈700/day, one every ~2 min on average) |
| Responses not cached by Cloudflare | 115,880 |
| Cloudflare cache hits | 7,140 |
| Vercel production builds (pushes) | 34 in 30 days |

Neon Free plan uses a **fixed 5-minute scale-to-zero timeout** (not configurable on Free; only paid
plans can change it). A query every ~2 minutes keeps the 0.25 CU compute awake almost continuously:
0.25 CU × 24 h ≈ 6 CU-hours/day, i.e. ~180 CU-hours for a full month. The 80.1 CU-hours is the
expected result of an always-awake compute, not of data size (560 rows, ~15 MB).

## Fix: public pages no longer query Neon

`scripts/export-static-data.mjs` runs during `npm run build` (before Vite) and writes:

- `public/data/index.json` — list fields for all prompts (no full content)
- `public/data/prompts/<id>.json` — full detail for one prompt
- `public/data/categories.json` — category counts + video count
- `public/data/manifest.json` — build version/timestamp

`public/data/` is gitignored and regenerated on every deploy. The frontend reads it from the CDN:

| Page/feature | Before | After |
|---|---|---|
| Home / collection list | `GET /api/prompts?...` (DB) | `/data/index.json` (static) |
| Prompt detail | `GET /api/prompts?id=...` (DB) | `/data/prompts/<id>.json` (static) |
| Related prompts | `GET /api/prompts?category=...` (DB) | filtered from static index |
| Card copy | `GET /api/prompts?id=...` (DB) | `/data/prompts/<id>.json` |
| Footer/library stats | `GET /api/prompts?summary=categories` (DB) | `/data/categories.json` |
| Admin dashboard | API (live) | unchanged — `usePrompts(..., { live: true })` |
| Copy counter | `POST /api/increment-copy` (DB) | unchanged (write on user copy, low volume) |

If the static files are missing (local `vite dev`), every helper falls back to the API automatically.

Additional reductions:

- Public GET APIs now send long CDN cache headers (`Vercel-CDN-Cache-Control` s-maxage 1 day for
  detail/categories, 1 hour for lists); Cloudflare can cache them too.
- Batch image publishing (`npm run publish:covers` with several images) to reduce build frequency.

## Expected result

- Public browsing no longer wakes Neon. Remaining DB traffic: admin actions, copy increments,
  submissions, and build-time sitemap/export/prerender queries (one short burst per deploy).
- Expected Neon usage: **under ~5 CU-hours per cycle** instead of 80.
- Monitor Neon → Billing/Usage after the next cycle; public request volume can still be checked in
  Cloudflare analytics.

## Rollback

Revert the `static-data` commit and redeploy; the API endpoints were kept, so old behavior returns.
`public/data/` is generated output; delete it safely if needed.

## Applied Cloudflare changes (2026-11-23)

Using the locally authenticated cf CLI OAuth credentials (Cloudflare API, account busivaa@gmail.com):

- **Cache Rule** (Caching -> Cache Rules): `GET /api/prompts*` -> eligible for cache, Edge TTL "respect origin".
  The API now sends `s-maxage=3600` (lists) / `s-maxage=86400` (detail, categories), so the edge caches it.
- **WAF custom rule** (Security -> WAF -> Custom rules): "block common scanner paths" for `/.env`, `/.git`,
  `/wp-admin`, `/wp-login`, `/xmlrpc.php`, `/index.php`, `/nuclei*`, `/phpmyadmin`, `/.aws`, `/vendor/phpunit`.
  Verified: those paths now return 403.
- **Bot Fight Mode was already on**: `fight_mode=true`, `enable_js=true`, `ai_bots_protection=block`,
  `crawler_protection=enabled`, `ai_training=disallow`. Cloudflare also manages `robots.txt`
  (`is_robots_txt_managed=true`), which is why the served robots file includes managed content signals.
- `/data/*` static JSON gets a long cache header in `vercel.json` (browser 5 min, CDN 1 day with SWR).

## Neon Free plan suspend setting

There is no suspend-timeout setting on the Free plan; it is fixed at 5 minutes and only paid plans
(Scale) can change it. The "Increase your limits" $5/month add-on changes quotas (250 compute hours,
etc.), not the timeout. The fix is therefore to stop querying the database so often, which the static
data migration does.

## Remaining DB writes (acceptable)

- `POST /api/increment-copy` on user copy clicks.
- Admin actions (add/edit prompts), submissions, upload.
- Build-time queries (sitemap, static export, prerender): one short burst per deploy.

If Neon usage is still higher than expected after a cycle, next candidates are batching copy counters
and reducing deploy frequency further.

## Follow-up: remaining anonymous API wakes (2026-11-24)

After the static-data deploy (04:35Z), Cloudflare analytics still showed ~10 anonymous
`GET /api/prompts` requests in 10 hours (cache misses, likely bots with random query strings or
stale SPA bundles). Each one wakes the Neon compute for up to 5 minutes, so they still mattered.

Changes:

- New admin-only endpoint `/api/admin-prompts` (GET, requires `Authorization: Bearer ADMIN_PASSWORD`);
  the admin dashboard now uses it (live list + detail), with the token from `localStorage.adminToken`.
- Cloudflare WAF custom rule blocks **all** anonymous `GET /api/prompts*` at the edge. Public pages use
  `/data/*`; the old API GET is only a local-dev fallback (WAF does not apply on localhost).
- The API cache rule is now irrelevant for the blocked path and can be removed later.

Expected: public/API scraper traffic in the database is now zero. Remaining DB traffic: copy increments
(observed ~2 per 12h), admin actions, submissions, and build-time queries.
