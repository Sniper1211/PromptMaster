<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1lpwOzb28sZ-quOMnGDWAeGtYLgPm3WhN

## Project rules

- Public-facing pages in this project must be bilingual.
- English is the default baseline for every new public page.
- Chinese support must be added in the same implementation pass before a page is considered complete.
- SEO title and description must also support both languages.
- See [docs/bilingual-page-policy.md](./docs/bilingual-page-policy.md) for the full rule.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
