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
| 2026-11-15 | 1768753688286298 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753688286298-b3f114a2.webp | generated with 即梦, 1728×1296 source, imported via extension |
| 2026-11-15 | 1768753691246985 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753691246985-a3326470.webp | generated with 即梦, 1728×1296 source, imported via extension |
| 2026-11-15 | 1768753694225476 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753694225476-bafa2df7.webp | generated with 即梦, 1728×1296 source, imported via extension |
| 2026-11-15 | 1768753701887691 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753701887691-c7ea5c34.webp | generated with 即梦, 1728×1296 source, imported via extension |
| 2026-11-15 | 176875370490538 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/176875370490538-c90308bc.webp | generated with 即梦, 1728×1296 source, imported via extension |
| 2026-11-15 | 1768753707953143 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753707953143-5d1deaf9.webp | generated with 即梦, published via publish script |
| 2026-11-15 | 1768753714574201 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753714574201-b9887e81.webp | generated with 即梦, published via publish script |
| 2026-11-15 | 176875371754521 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/176875371754521-b2be7b19.webp | generated with 即梦, published via publish script |
| 2026-11-15 | 1768753711747579 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753711747579-bcb78066.webp | generated with 即梦, published via publish script |
| 2026-11-15 | 1768753720492926 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753720492926-34fa39ec.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753723454691 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753723454691-220d514b.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753729419400 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753729419400-16bdedc4.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753738259995 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753738259995-354d1084.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753735327650 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753735327650-c2840053.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753741232216 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753741232216-73655e00.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753732372340 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753732372340-08632dae.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753744196537 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753744196537-38761ef6.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 176875374719494 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/176875374719494-5bbe1585.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753750170104 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753750170104-531061d9.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753753236694 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753753236694-1ea92086.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753756161877 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753756161877-d1a534fb.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753759258400 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753759258400-7ae7dde0.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753762286163 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753762286163-735c8f60.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753765216705 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753765216705-67c8553c.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753768229477 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753768229477-21e2dbec.webp | generated with 即梦, published via publish script |
| 2026-11-16 | 1768753771166295 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753771166295-6b26f990.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753777473680 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753777473680-1706e090.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753774521901 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753774521901-a0d101ae.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753780471660 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753780471660-06f86aa5.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753783495726 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753783495726-ed2d46ae.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753789651534 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753789651534-8f093b3a.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753786538289 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753786538289-c8ea982f.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753792611459 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753792611459-79417a7b.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753795569736 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753795569736-8051f314.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753798484223 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753798484223-fe85c772.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753801454764 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753801454764-b1b29cc6.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753810480226 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753810480226-c7eff15c.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753804487204 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753804487204-7f5feca3.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753807487482 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753807487482-6296a63d.webp | generated with 即梦, published via publish script |
| 2026-11-17 | 1768753813700719 | PHOTOGRAPHY | https://img.ok9981.com/pentaprompt/prompts/1768753813700719-f04b1b71.webp | generated with 即梦, published via publish script |
