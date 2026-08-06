# Bilingual Page Policy

This project must treat bilingual support as a default requirement for public-facing pages.

## Core rule

- English is the default content baseline for every new public page.
- Chinese support is required for every new public page before it is considered complete.
- A page is not "done" if only one language is available.

## Scope

This policy applies to:

- top-level pages such as `/`, `/discover`, `/about`, `/contact`, `/privacy`, `/terms`, `/guides`
- dynamic public pages such as guide detail pages, collection pages, and prompt detail pages
- new public navigation links, homepage sections, collection sections, footer links, and CTA labels
- SEO metadata for public pages

This policy does not require full bilingual coverage for:

- temporary internal debug text
- private admin-only implementation notes
- development-only console logs

## Required implementation rules

For every new public page:

1. Provide an English version first.
2. Provide a Chinese version in the same implementation pass.
3. Ensure the page title, description, CTA labels, and support text all switch by language.
4. Ensure the SEO title and SEO description also switch by language.
5. Ensure any new internal link or entry point uses bilingual labels.

## Recommended content structure

When content is page-specific and long-form:

- store content as explicit `{ en, zh }` pairs
- keep English and Chinese sections structurally aligned
- avoid shipping placeholder Chinese or placeholder English copy

When content is reusable UI copy:

- prefer `i18n` locale files

## Release checklist

Before pushing a page change:

- check the page in English
- check the page in Chinese
- check the SEO title/description in both languages
- check new entry links in both languages
- check that no section falls back to mixed-language UI accidentally

## Project expectation

If a new public page cannot be completed bilingually in the same change, it should be treated as incomplete work and not presented as finished.
