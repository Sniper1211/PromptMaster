# Generated cover images (AI)

Covers generated with 即梦 (Jimeng) to fill prompts that had no preview image (188 rows — see
`PromptMaster-补图工作清单.csv`). Uploaded to Cloudflare R2 and imported with
`scripts/import-generated-images.mjs`.

Convention:

- local file: `<promptId>.<png|jpg|jpeg|webp|avif>` (recommended 4:3, e.g. 1024×768 or 1728×1296)
- R2 key: `pentaprompt/prompts/<promptId>-<sha256(webp):8>.webp`
- DB: `prompts.preview_image_url = https://img.ok9981.com/pentaprompt/prompts/<...>.webp`
- image is converted to WebP (max width 1200, q82) and served with a 1-year immutable cache

## Log

| date | prompt id | category | R2 URL | notes |
|---|---|---|---|---|
| 2026-11-15 | 15 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/15-a091d171.webp | first generated cover (即梦, 1728×1296 source) |
| 2026-11-15 | 15 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/15-d88580a9.webp | regenerated watermark-free via the Jimeng downloader extension (replaces the watermarked cover) |
| 2026-11-15 | 16 | COMMERCIAL | https://img.ok9981.com/pentaprompt/prompts/16-26df7868.webp | generated with 即梦, downloaded via the extension |
