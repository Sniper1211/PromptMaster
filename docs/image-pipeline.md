# Image pipeline

Prompt preview images are stored in the repository and served from Vercel's CDN — no third-party image hosts.

## Rules

- Localized images live in `public/images/prompts/<promptId>.webp`, encoded as WebP, max width 900 px, quality 80.
- `prompts.preview_image_url` in the database stores the local path (`/images/prompts/<id>.webp`).
- Prompts without an image (currently 171) intentionally keep `preview_image_url` empty and render the
  neutral category placeholder in `PromptCard` / detail page. Do not invent filler images.
- `/images/*` is served with `Cache-Control: public, max-age=31536000, immutable` (see `vercel.json`).
  If an image is replaced, bump the filename (e.g. add a version suffix) instead of reusing the path.

## Localizing images

```bash
node scripts/localize-images.mjs --limit 5      # smoke test
node scripts/localize-images.mjs                # download + convert, write files (no DB change)
node scripts/localize-images.mjs --apply        # also update preview_image_url in Neon
```

The script:

1. selects prompts whose `preview_image_url` is an external URL (or a legacy `/previews/*` path);
2. downloads the image (retries + timeout), converts it with `sharp` (WebP q80, max width 900);
3. writes `public/images/prompts/<id>.webp` (idempotent: existing files are skipped unless `--force`);
4. with `--apply`, backs up the current URLs to `/tmp/prompt-image-urls-backup-*.json` and updates
   only the successfully localized rows in one transaction.

A JSON report of every processed image (source, output, size, failures) is written to
`/tmp/image-localization-report.json`.

## Notes

- Source images are still third-party artwork/video stills. Attribution stays on each prompt page
  (`source_link` / `author_name`); replacing them with original or licensed imagery is a content decision.
- Legacy `public/previews/*` files are no longer referenced once their prompts are localized and can be deleted.
- `sharp` is a devDependency used only by this script; it is not part of the runtime bundle.
