import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

const testConnection = async () => {
  console.log('🔌 Testing database connection...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Test query
    const result = await client.query('SELECT COUNT(*) as count FROM prompts');
    console.log(`📊 Total prompts in database: ${result.rows[0].count}`);
    
    // Test video prompts
    const videoResult = await client.query("SELECT COUNT(*) as count FROM prompts WHERE prompt_type = 'video'");
    console.log(`🎥 Video prompts: ${videoResult.rows[0].count}`);
    
    // Test text prompts
    const textResult = await client.query("SELECT COUNT(*) as count FROM prompts WHERE prompt_type = 'text' OR prompt_type IS NULL");
    console.log(`📝 Text prompts: ${videoResult.rows[0].count}`);
    
    // Get sample video prompt
    const sampleResult = await client.query("SELECT id, title_en, prompt_type, source_link, author_name FROM prompts WHERE prompt_type = 'video' LIMIT 1");
    if (sampleResult.rows.length > 0) {
      const sample = sampleResult.rows[0];
      console.log('\n📋 Sample video prompt:');
      console.log(`   ID: ${sample.id}`);
      console.log(`   Title: ${sample.title_en}`);
      console.log(`   Type: ${sample.prompt_type}`);
      console.log(`   Source: ${sample.source_link || 'N/A'}`);
      console.log(`   Author: ${sample.author_name || 'N/A'}`);
    }
    
    client.release();
    console.log('\n🎉 All tests passed!');
    
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    console.error('Full error:', err);
  } finally {
    await pool.end();
  }
};

testConnection();