import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
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

const patterns = [
  /Watermark in .*?["'].*?["']/gi,
  /右下角水印[：:].*?["“].*?["”]/gi,
  /The prompt continues in the first comment/gi,
  /Prompt continues in.*?/gi,
  /"project":\s*"Nano Banana.*?",/gi,
  /"version":\s*"NB-.*?",/gi,
  /By Nano Banana/gi
];

async function cleanWatermarks() {
  try {
    console.log('🧹 Connecting to database...');
    
    const query = `
      SELECT id, title_en, content, chinese_content
      FROM prompts
    `;
    
    const res = await pool.query(query);
    console.log(`🔎 Checking ${res.rowCount} prompts for watermarks...`);

    const cleanedPrompts = [];

    for (const row of res.rows) {
      let needsUpdate = false;
      let newContent = row.content;
      let newChineseContent = row.chinese_content;
      let removedItems = [];

      // Check Content
      if (newContent) {
        patterns.forEach(regex => {
          if (regex.test(newContent)) {
            const matches = newContent.match(regex);
            removedItems.push(...matches);
            newContent = newContent.replace(regex, '');
            needsUpdate = true;
          }
        });
      }

      // Check Chinese Content
      if (newChineseContent) {
        patterns.forEach(regex => {
          if (regex.test(newChineseContent)) {
            const matches = newChineseContent.match(regex);
            removedItems.push(...matches);
            newChineseContent = newChineseContent.replace(regex, '');
            needsUpdate = true;
          }
        });
      }

      if (needsUpdate) {
        // Clean up empty lines left behind
        newContent = newContent.replace(/\n\s*\n/g, '\n\n').trim();
        if (newChineseContent) {
            newChineseContent = newChineseContent.replace(/\n\s*\n/g, '\n\n').trim();
        }

        await pool.query(
          'UPDATE prompts SET content = $1, chinese_content = $2 WHERE id = $3',
          [newContent, newChineseContent, row.id]
        );
        
        cleanedPrompts.push({
          id: row.id,
          title: row.title_en || 'Untitled',
          removed: [...new Set(removedItems)].join(', ') // Unique items
        });
      }
    }

    console.log(`\n✅ Finished! Cleaned ${cleanedPrompts.length} prompts.`);
    
    // Generate Markdown Table
    console.log('\n### 📝 Cleaning Report');
    console.log('| ID | Title | Removed Content |');
    console.log('|---|---|---|');
    cleanedPrompts.forEach(p => {
        // Truncate removed content if too long
        let removed = p.removed.replace(/\n/g, ' ');
        if (removed.length > 50) removed = removed.substring(0, 47) + '...';
        console.log(`| ${p.id} | ${p.title} | ${removed} |`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

cleanWatermarks();
