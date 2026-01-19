# Import Nano Banana Prompts CSV (Bilingual Support)

## 1. Dependency Setup
- Install `csv-parse` for CSV parsing.
- Install `google-translate-api-x` for automated translation (English -> Chinese).
  - Command: `npm install csv-parse google-translate-api-x`

## 2. Script Development: `scripts/import-csv-prompts.js`
- **Parsing**: Read and parse `nano_banana_prompts.csv`.
- **Data Cleaning**:
  - **Raycast Args**: Replace `{argument name="..." default="VALUE"}` with `VALUE`.
  - **JSON Handling**: If content is JSON, attempt to extract main description or keep as is.
- **Automated Translation** (Crucial Step):
  - Function `translateToChinese(text)` using the translation library.
  - **Fields to Translate**:
    - `title_en` -> `title_zh`
    - `description_en` (generated from prompt snippet) -> `description_zh`
    - `content` (cleaned English prompt) -> `chinese_content` (for user understanding)
  - **Fallback**: If translation fails (rate limit/network), use English text as fallback for Chinese fields to ensure import success.
- **Database Insertion**:
  - Insert complete records with both EN and ZH fields.
  - Set `category` = 'PHOTOGRAPHY' (default).
  - Generate random `base_count`.

## 3. Execution & Verification
- Run the script with a small delay between items to avoid translation rate limits.
- Verify data in the database (check if Chinese fields are populated).
