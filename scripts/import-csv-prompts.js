
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import pg from 'pg';
import { translate } from 'google-translate-api-x';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const CSV_FILE = path.resolve(__dirname, '../nano_banana_prompts.csv');
const DELAY_MS = 1500; // Delay between translations to avoid rate limits

// Helper: Clean Raycast Arguments
const cleanRaycastArgs = (text) => {
  if (!text) return '';
  // Replace {argument name="..." default="VALUE"} with VALUE
  // Regex needs to handle multiline and various quotes
  return text.replace(/\{argument\s+name="[^"]*"\s+default="([^"]*)"\}/g, '$1')
             .replace(/\{argument\s+default="([^"]*)"\s+name="[^"]*"\}/g, '$1'); // Handle order variation
};

// Helper: Sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Translate with Retry
const translateText = async (text, to = 'zh-CN') => {
  if (!text) return '';
  try {
    // google-translate-api-x might fail, so we wrap it
    const res = await translate(text, { to });
    return res.text;
  } catch (err) {
    console.warn(`[Translate Warning] Failed to translate: "${text.substring(0, 20)}...". Using original text. Error: ${err.message}`);
    return text; // Fallback to original
  }
};

const runImport = async () => {
  console.log('🚀 Starting Import Process...');
  
  // 1. Read CSV
  const fileContent = fs.readFileSync(CSV_FILE, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  console.log(`Found ${records.length} records. Processing...`);

  let successCount = 0;
  let skipCount = 0;
  let consecutiveErrors = 0; // Circuit breaker

  for (const record of records) {
    // Circuit breaker check
    if (consecutiveErrors >= 3) {
      console.error('\n🚨 STOPPING IMPORT: 3 consecutive errors detected.');
      console.error('Please check the CSV format or network connection.');
      break;
    }

    try {
      const { title, prompt } = record;
      
      // Check if exists (simple check by English title)
      const existsRes = await pool.query('SELECT id FROM prompts WHERE title_en = $1', [title]);
      if (existsRes.rowCount > 0) {
        console.log(`[Skip] "${title}" already exists.`);
        skipCount++;
        consecutiveErrors = 0; // Reset on successful skip
        continue;
      }

      // 2. Data Cleaning
      const cleanedContent = cleanRaycastArgs(prompt);
      
      // Detect if content is JSON
      let isJson = false;
      try {
        JSON.parse(cleanedContent);
        isJson = true;
      } catch (e) {
        isJson = false;
      }

      // 3. Prepare Fields
      const titleEn = title;
      // Description: Take first 150 chars of cleaned content (or title if content is JSON/short)
      let descriptionSource = isJson ? title : cleanedContent;
      // Remove newlines for description
      descriptionSource = descriptionSource.replace(/\n/g, ' ').substring(0, 150) + (descriptionSource.length > 150 ? '...' : '');
      const descriptionEn = descriptionSource;

      // 4. Translation
      console.log(`Processing: ${titleEn.substring(0, 30)}...`);
      
      const titleZh = await translateText(titleEn);
      await sleep(500); // Small delay
      
      const descriptionZh = await translateText(descriptionEn);
      await sleep(500);

      let chineseContent = '';
      if (isJson) {
        chineseContent = "（此提示词为复杂 JSON 配置，请直接使用英文原始内容）\n(This prompt is a complex JSON configuration, please use the English content directly)";
      } else {
        chineseContent = await translateText(cleanedContent);
      }

      // 5. Insert
      const id = Date.now().toString() + Math.floor(Math.random() * 1000); // Simple ID generation
      const createdAt = new Date().toISOString();
      const category = 'PHOTOGRAPHY'; // Default category
      const tags = ['Imported', 'Nano Banana', 'AI Art'];
      const baseCount = Math.floor(Math.random() * (200 - 50 + 1)) + 50;

      const insertQuery = `
        INSERT INTO prompts (
          id, created_at, title_zh, title_en, description_zh, description_en,
          category, tags, content, chinese_content, 
          base_count, real_copy_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0)
      `;

      await pool.query(insertQuery, [
        id, createdAt, titleZh, titleEn, descriptionZh, descriptionEn,
        category, JSON.stringify(tags), cleanedContent, chineseContent,
        baseCount
      ]);
      console.log(`✅ Imported: ${titleEn}`);
      successCount++;
      consecutiveErrors = 0; // Reset on success

      await sleep(DELAY_MS); // Rate limiting
    } catch (err) {
      console.error(`❌ Error processing record:`, err.message);
      consecutiveErrors++;
    }
  }

  console.log(`\n🎉 Import Complete!`);
  console.log(`Success: ${successCount}`);
  console.log(`Skipped: ${skipCount}`);
  
  await pool.end();
};

runImport();
