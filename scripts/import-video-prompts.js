import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import pg from 'pg';
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

const CSV_FILE = path.resolve(__dirname, '../seedance-2-0-prompts-20260222.csv');

// Helper: Parse JSON fields from CSV
const parseJsonField = (field) => {
  if (!field || field === '[]' || field === '""') return null;
  try {
    return JSON.parse(field);
  } catch (err) {
    console.warn(`Failed to parse JSON field: ${field.substring(0, 50)}...`);
    return null;
  }
};

// Helper: Extract author name from JSON
const extractAuthorName = (authorJson) => {
  if (!authorJson) return null;
  try {
    const author = parseJsonField(authorJson);
    return author?.name || null;
  } catch (err) {
    // Try to extract name from string
    const match = authorJson.match(/"name"\s*:\s*"([^"]+)"/);
    return match ? match[1] : null;
  }
};

// Helper: Extract first video thumbnail
const extractFirstVideoThumbnail = (videosJson) => {
  if (!videosJson || videosJson === '[]') return null;
  try {
    const videos = parseJsonField(videosJson);
    if (videos && videos.length > 0 && videos[0].thumbnail) {
      return videos[0].thumbnail;
    }
  } catch (err) {
    // Try to extract thumbnail from string
    const match = videosJson.match(/"thumbnail"\s*:\s*"([^"]+)"/);
    return match ? match[1] : null;
  }
  return null;
};

// Helper: Generate random copy count (100-300)
const generateRandomCopyCount = () => {
  return Math.floor(Math.random() * (300 - 100 + 1)) + 100;
};

const runImport = async () => {
  console.log('🚀 Starting Video Prompts Import Process...');
  
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
    console.log(`📄 CSV file loaded: ${CSV_FILE}`);
    
    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true
    });
    
    console.log(`📊 Found ${records.length} records in CSV`);
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Process each record
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      try {
        // Skip if essential fields are missing
        if (!record.id || !record.title || !record.content) {
          console.warn(`⚠️ Skipping record ${i}: Missing essential fields`);
          skippedCount++;
          continue;
        }
        
        // Extract data
        const authorName = extractAuthorName(record.author);
        const videoThumbnail = extractFirstVideoThumbnail(record.sourceVideos);
        
        // Prepare prompt data
        const promptData = {
          id: record.id.toString(),
          title_en: record.title,
          title_zh: record.title, // Use English title as Chinese title for now
          description_en: record.description || '',
          description_zh: record.description || '', // Use English description as Chinese for now
          content: record.content,
          chinese_content: record.content, // Use same content for Chinese
          category: 'VIDEO',
          tags: JSON.stringify(['video', 'seedance-2.0', 'ai-video']),
          expected_output: 'Video generation using Seedance 2.0',
          usage: `Source: ${record.sourceLink || ''}\nAuthor: ${authorName || 'Unknown'}`,
          preview_image_url: videoThumbnail,
          prompt_type: 'video',
          source_link: record.sourceLink || null,
          author_name: authorName || null,
          video_thumbnail_url: videoThumbnail,
          base_count: generateRandomCopyCount(),
          real_copy_count: 0,
          created_at: record.sourcePublishedAt || new Date().toISOString()
        };
        
        // Check if prompt already exists
        const existingResult = await pool.query(
          'SELECT id FROM prompts WHERE id = $1',
          [promptData.id]
        );
        
        if (existingResult.rowCount > 0) {
          // Update existing prompt
          await pool.query(`
            UPDATE prompts SET
              title_en = $2,
              title_zh = $3,
              description_en = $4,
              description_zh = $5,
              content = $6,
              chinese_content = $7,
              category = $8,
              tags = $9,
              expected_output = $10,
              usage = $11,
              preview_image_url = $12,
              prompt_type = $13,
              source_link = $14,
              author_name = $15,
              video_thumbnail_url = $16,
              base_count = $17,
              real_copy_count = $18,
              created_at = $19
            WHERE id = $1
          `, [
            promptData.id,
            promptData.title_en,
            promptData.title_zh,
            promptData.description_en,
            promptData.description_zh,
            promptData.content,
            promptData.chinese_content,
            promptData.category,
            promptData.tags,
            promptData.expected_output,
            promptData.usage,
            promptData.preview_image_url,
            promptData.prompt_type,
            promptData.source_link,
            promptData.author_name,
            promptData.video_thumbnail_url,
            promptData.base_count,
            promptData.real_copy_count,
            promptData.created_at
          ]);
          
          console.log(`🔄 Updated existing prompt: ${promptData.id} - ${promptData.title_en.substring(0, 50)}...`);
        } else {
          // Insert new prompt
          await pool.query(`
            INSERT INTO prompts (
              id, title_en, title_zh, description_en, description_zh,
              content, chinese_content, category, tags, expected_output,
              usage, preview_image_url, prompt_type, source_link,
              author_name, video_thumbnail_url, base_count, real_copy_count, created_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15, $16, $17, $18, $19
            )
          `, [
            promptData.id,
            promptData.title_en,
            promptData.title_zh,
            promptData.description_en,
            promptData.description_zh,
            promptData.content,
            promptData.chinese_content,
            promptData.category,
            promptData.tags,
            promptData.expected_output,
            promptData.usage,
            promptData.preview_image_url,
            promptData.prompt_type,
            promptData.source_link,
            promptData.author_name,
            promptData.video_thumbnail_url,
            promptData.base_count,
            promptData.real_copy_count,
            promptData.created_at
          ]);
          
          console.log(`✅ Imported new prompt: ${promptData.id} - ${promptData.title_en.substring(0, 50)}...`);
        }
        
        importedCount++;
        
        // Show progress every 50 records
        if (importedCount % 50 === 0) {
          console.log(`📈 Progress: ${importedCount}/${records.length} records imported`);
        }
        
      } catch (err) {
        console.error(`❌ Error importing record ${i} (ID: ${record.id}):`, err.message);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Import Summary:');
    console.log(`✅ Successfully imported/updated: ${importedCount} prompts`);
    console.log(`⚠️ Skipped: ${skippedCount} prompts`);
    console.log(`❌ Errors: ${errorCount} prompts`);
    
  } catch (err) {
    console.error('❌ Fatal error during import:', err);
  } finally {
    await pool.end();
    console.log('🔌 Database connection closed');
  }
};

runImport();