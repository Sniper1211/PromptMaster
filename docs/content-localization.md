# Content localization (Chinese)

PentaPrompt is bilingual. UI copy lives in `src/locales/en.json` / `zh.json`; prompt content lives in the database.

## Current state

- All public pages exist in English (`/…`) and Chinese (`/zh/…`), with prerendered meta for both languages.
- 560 prompts in the database.
- 411 of them (video prompts imported from social sources) originally had `title_zh`, `description_zh`
  and `chinese_content` copied from the English fields. They are being translated to Simplified Chinese
  so the Chinese site shows real Chinese content instead of English fallbacks.

## Translation pipeline (repeatable)

1. Export the records that still need translation:

   ```bash
   # selects rows where title_zh/description_zh/chinese_content are empty or identical to English
   # writes pm-i18n/input/batch-XX.json + manifest.json
   ```

2. Fan the batches out to translators (human or LLM). Each batch output is a JSON array:
   `[{ "id": "…", "title_zh": "…", "description_zh": "…", "chinese_content": "…" }]`
   Only include the fields that were requested for that record.

   Translation rules:
   - natural, concise Simplified Chinese (not word-for-word);
   - keep model/brand names (`Seedance 2.0`, `ChatGPT`, `Midjourney`, `Kling 3.0`, …) untranslated;
   - keep placeholders (`[image]`, `{character}`, `<subject>`), URLs, numbers and line breaks;
   - `chinese_content` is the prompt text itself — translate faithfully, do not summarize.

3. Validate + import:

   ```bash
   node scripts/import-translations.mjs --dir /path/to/pm-i18n            # dry run
   node scripts/import-translations.mjs --dir /path/to/pm-i18n --apply    # writes to Neon
   ```

   The script validates every record (ids, non-empty Chinese, not identical to English, placeholder
   preservation, length sanity), backs up the current values to `/tmp/pentaprompt-zh-backup-*.json`,
   then updates only the translated fields in one transaction.

4. Rebuild: prerendered `/zh/…` pages are generated from the database at build time, so push a commit
   (or redeploy) after importing to refresh them.

## Notes

- The import script uses `DATABASE_URL` from `.env` (least-privilege `app_rw` role: UPDATE is allowed,
  DDL is not).
- If a batch fails validation, fix the output file and re-run the dry run before applying.
- Chinese copy for guides and static pages is maintained in `src/locales/zh.json` and `src/data/guides.js`.
