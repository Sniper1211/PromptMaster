# AdSense readiness (audit + action plan)

Status: application returned "需要稍作调整" (needs adjustments) — not a ban; Google asks for fixes and a
re-review. Publisher ID `pub-9245714228354292`.

## What AdSense sees (before this fix)

| Check | Result |
|---|---|
| `ads.txt` | correct: `google.com, pub-9245714228354292, DIRECT, f08c47fec0942fa0` |
| AdSense account meta + loader | present in `index.html` |
| robots.txt | no explicit AdSense crawler rule (Cloudflare-managed file); added allow rules |
| Privacy policy | exists, mentions Google/AdSense/cookies; added opt-out links |
| About / Contact / Terms | present |
| **Crawler-visible content on pages** | **empty SPA shell (~5 KB, no h1/body)** — the main technical problem |
| Guides / editorial content | only **5** guide articles |
| Prompt quality | 560 prompts; **51 with content < 80 chars**, **35 with IP/brand names**, 105 with en==zh |

AdSense's "content is key" remark usually maps to **low-value / insufficient content**. An empty
server-rendered HTML page plus imported/auto-translated prompt text is a plausible cause.

## Fixed in commit `4b024f5`

1. **Prerender real body content into HTML** for all 1152 localized pages:
   - prompt pages: title, description, prompt text, Chinese version (when different), usage, category
     editorial, related prompt links, source link;
   - home: intro + 30 prompt links/descriptions;
   - collections: category intro + up to 40 prompt links;
   - guides index: guide list; guide articles: **full article text**;
   - verified: `/prompt/<id>` 5 KB → 11.7 KB with `<h1>`/content; home 17.6 KB with prompt list.
2. **Original category editorial** (`src/data/categoryEditorial.js`) shown on prompt pages ("About this
   category") — adds unique context for each of the 12 categories.
3. **Privacy policy**: explicit Google Ads Settings + aboutads.info opt-out links (both languages).
4. **robots.txt**: explicit `Mediapartners-Google` / `AdsBot-Google` allow rules.

## Still needed before re-applying (content work, cannot be auto-fixed)

1. **Add original editorial content**: aim for 15–20 guides (currently 5). Suggested topics:
   prompt structure for image models; video prompt timelines; Midjourney vs Seedream vs Nano Banana;
   commercial photography prompts; SEO prompts; writing prompts; how to evaluate output; copyright and
   likeness in AI images; bilingual prompt adaptation; a beginner workflow.
2. **Improve thin prompts**: expand the 51 short prompts with when-to-use/how-to-use notes; review the 105
   prompts where English and Chinese text are identical.
3. **Handle IP/brand prompts** (35): rewrite to original characters or clearly mark as commentary; avoid
   pages whose main purpose is reproducing copyrighted characters/celebrities.
4. **Trust pages**: add an Editorial Policy page (curation, AI translation disclosure, source attribution)
   and a Copyright/DMCA page. About page already covers the basics; adding these strengthens review.
5. **Consent management**: AdSense requires a Google-certified CMP for EEA/UK traffic. Set up
   AdSense → Privacy & messaging → GDPR message (free) before serving ads in those regions.
6. **Reapply once**: AdSense → 查看您的申请 → request review. Do not reapply repeatedly while content is
   still being added.

## Not needed

- Upgrading or buying anything for AdSense.
- Filling ad slot IDs before approval (the account meta + loader are enough for review; slots can be
  configured after approval).

## Verification commands

```bash
curl -sL https://pentaprompt.com/prompt/1768754029304318 | grep -o '<h1[^>]*>[^<]*'
curl -sL https://pentaprompt.com/ | wc -c          # expect ~17 KB with content, not ~5 KB
curl -s https://pentaprompt.com/ads.txt
curl -s https://pentaprompt.com/robots.txt | grep -i -A2 mediapartners
```
