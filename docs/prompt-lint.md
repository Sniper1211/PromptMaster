# Prompt lint / cleanup

`scripts/lint-prompts.mjs` scans and cleans prompt content in the database. Default is a dry run;
`--apply` writes changes in one transaction after backing up every affected row.

```bash
node scripts/lint-prompts.mjs                     # report only
node scripts/lint-prompts.mjs --apply             # repair + update DB (backup written to /tmp)
node scripts/lint-prompts.mjs --ids id1,id2 --apply
node scripts/lint-prompts.mjs --limit 5 --details id1   # inspect before/after for selected ids
npm run lint:prompts -- --apply
```

Reports (workspace): `PromptMaster-内容清洗报告.csv` / `.json`.

## Checks and fixes

| Check | Fix |
|---|---|
| JSON-object prompts that are not valid JSON | repaired with `jsonrepair` + a closing-brace heuristic; re-serialized as valid pretty JSON |
| real people / celebrity names (titles, descriptions, content, usage, Chinese) | replaced with fictional descriptions (`Taylor Swift` → `a fictional pop singer`, …) |
| sexualized / crude wording | softened to neutral wording (`large breasts` → `athletic build`, `bikini` → `swimwear`, `epstein files` → `a personal rivalry`, …) |
| machine-translated JSON in `chinese_content` that is invalid | cleared, so the site no longer shows broken Chinese JSON (the English content is now valid JSON) |
| prompts that cannot be repaired | reported as `manual`, left untouched |

## Cleanup run 2026-11-18

- 77 prompts changed, backup: `/tmp/prompt-lint-backup-2026-11-18T15-04-38-147Z.json`
- issues found: 26 invalid JSON, 18 celebrity names, 25 sexualized wordings, 10 sensitive topics
- after: JSON-object prompts all parse, no celebrity names or flagged terms remain; re-running the linter reports 0 changes
- 34 JSON prompts had their broken Chinese JSON cleared (English JSON remains valid; a JSON-aware re-translation can restore the 中文对照 later)

## Policy notes

- Prompts must not name real people. Celebrity likeness is rejected by most image models and is a
  content-policy risk; use fictional descriptions instead.
- Prompts must not contain sexualized descriptions or slurs; keep fashion/portrait wording neutral.
- JSON prompts should be valid JSON and should not mix Midjourney command flags into a JSON body.

The web copy button copies `prompts.content`; a prompt that is not copy-safe is a broken product experience.
