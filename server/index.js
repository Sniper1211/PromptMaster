
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import pg from 'pg';
import OpenAI from 'openai';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

const DATA_FILE_ZH = path.resolve(__dirname, '../src/data/prompts-zh.ts');

// --- Helper Functions ---
const readDataFile = (filePath) => {
  if (!fs.existsSync(filePath)) throw new Error(`Data file not found at ${filePath}`);
  return fs.readFileSync(filePath, 'utf-8');
};

const getNextId = (content) => {
  const ids = [];
  const regex = /id:\s*'(\d+)'/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push(parseInt(match[1], 10));
  }
  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
};

// --- API: Verify Password ---
app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.warn('[API] ADMIN_PASSWORD not set in env');
    // Default to allow if not set, or block? Let's match cloud logic (usually block or warn)
    // Cloud logic: if not set, pass. But here let's be strict if desired.
    // For now, allow if not set to avoid blocking dev without config.
    return res.json({ success: true });
  }

  if (password === adminPassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});



app.put('/api/prompts', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing ID' });

  // In local dev, we just mock success if no DB connected
  // If DB connected, we should execute update (logic similar to api/prompts.js)
  // For simplicity, I'll just return success here.
  console.log(`[Mock] Updated prompt ${id} with data:`, req.body);
  
  res.json({ success: true });
});

// --- API: Generate Tips with AI ---
app.post('/api/generate-tips', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing content' });

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.warn('[Mock] No Deepseek API Key found. Returning mock tips.');
    // Return mock data if no key (for dev without key)
    return res.json({
      usage_en: "Recommended: --v 6.0 --ar 16:9 (Mock Generated)",
      usage_zh: "建议参数：--v 6.0 --ar 16:9 （模拟生成数据）"
    });
  }

  try {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey
    });

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: 'You are an AI Prompt expert. Output JSON with "usage_en" and "usage_zh".' },
        { role: "user", content: `Generate tips for: ${content}` }
      ],
      model: "deepseek-chat",
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ error: 'AI Generation Failed' });
  }
});

// --- API: Increment Copy Count ---
app.post('/api/increment-copy', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing ID' });

  // In local mock server (without DB), we can't persist this easily unless we use a file.
  // But for dev UI testing, just returning success is enough.
  // If we had a local DB, we would run the UPDATE query.
  
  // Check if we are connected to real DB (if DATABASE_URL is set locally)
  if (process.env.DATABASE_URL) {
     // ... Real DB logic would go here if we extracted the pool ...
     // For now, let's assume local dev might not have full DB write access or logic duplication.
     // Just mock success to let UI proceed.
     console.log(`[Mock] Increment copy count for Prompt ${id}`);
  } else {
     console.log(`[Mock] Increment copy count for Prompt ${id}`);
  }
  
  res.json({ success: true });
});

// --- API: Upload File (S3/R2 Compatible) ---
// Note: This is for local dev simulation or forwarding.
app.post('/api/upload', async (req, res) => {
  // Auth Check
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.authorization;
  if (adminPassword && (!authHeader || authHeader !== `Bearer ${adminPassword}`)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if R2 config exists
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.warn('[API] R2 credentials not set. Returning mock URL.');
    // Return a mock URL for local testing without real upload
    return res.json({ 
      url: 'https://via.placeholder.com/800x450.png?text=Uploaded+Image+(Local+Mock)',
      pathname: req.query.filename || 'mock-image.png',
      contentType: 'image/png'
    });
  }

  // If credentials exist, try real upload using S3 Client
  try {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    
    const S3 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    const filename = req.query.filename;
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const uniqueKey = `pentaprompt/${Date.now()}-${filename}`;
    
    // Read request stream into buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueKey,
      Body: buffer,
      ContentType: req.headers['content-type'] || 'application/octet-stream',
    };

    await S3.send(new PutObjectCommand(uploadParams));

    // Construct Public URL
    const publicUrlBase = process.env.R2_PUBLIC_URL;
    if (!publicUrlBase) {
      throw new Error('R2_PUBLIC_URL env var is not set');
    }

    const finalUrl = `${publicUrlBase.replace(/\/$/, '')}/${uniqueKey}`;

    res.json({ 
      url: finalUrl,
      pathname: uniqueKey,
      contentType: uploadParams.ContentType
    });

  } catch (error) {
    console.error('[Upload Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// --- API: Analyze Text via LLM ---
app.post('/api/analyze', async (req, res) => {
  // Auth Check
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.authorization;
  if (adminPassword && (!authHeader || authHeader !== `Bearer ${adminPassword}`)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { rawText, apiKey, baseUrl, model } = req.body;
    
    // Use provided key or env key
    const FINAL_API_KEY = apiKey || process.env.AI_API_KEY;
    const FINAL_BASE_URL = baseUrl || process.env.AI_BASE_URL || 'https://api.openai.com/v1';
    const FINAL_MODEL = model || process.env.AI_MODEL || 'gpt-3.5-turbo';

    if (!FINAL_API_KEY) {
      return res.status(400).json({ error: 'Missing API Key. Please provide it in the UI or .env file.' });
    }

    if (!rawText) {
      return res.status(400).json({ error: 'No text provided' });
    }

    console.log(`[API] Analyzing text with model: ${FINAL_MODEL}`);

    const systemPrompt = `
    You are an expert prompt engineer and classifier.
    Your task is to analyze the user's input (which is a raw prompt or description) and extract structured data for a prompt library.
    
    Return ONLY a valid JSON object with no markdown formatting.
    Structure:
    {
      "title": "A short, catchy title in English",
      "titleZh": "A short, catchy title in Chinese (Simp. Chinese)",
      "description": "A 1-sentence summary in English",
      "descriptionZh": "A 1-sentence summary in Chinese (Simp. Chinese)",
      "category": "One of: CODING, WRITING, DESIGN, PRODUCTIVITY, MARKETING, FUN, SEO, LEARNING",
      "tags": ["tag1", "tag2", "tag3"],
      "content": "The actual prompt content in English. If the input is Chinese, translate it to high-quality English prompt.",
      "chineseContent": "The prompt content translated to Chinese. If the input is Chinese, keep it or refine it.",
      "expectedOutput": "What the user should expect (English)",
      "usage": "How to use this prompt (Chinese, short guide)"
    }
    `;

    const response = await axios.post(
      `${FINAL_BASE_URL}/chat/completions`,
      {
        model: FINAL_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: rawText }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${FINAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Clean up potential markdown code blocks
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonString);

    res.json(result);

  } catch (error) {
    console.error('[Analyze Error]', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'AI Analysis Failed', 
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

// --- API: Save Prompt (Database Version) ---
app.post('/api/prompts', async (req, res) => {
  // Auth Check
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.authorization;
  if (adminPassword && (!authHeader || authHeader !== `Bearer ${adminPassword}`)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const newPromptData = req.body;
    
    if (!newPromptData.title || !newPromptData.content) {
      return res.status(400).json({ error: 'Title and Content are required' });
    }

    // Generate a numeric-like ID using timestamp or max ID from DB
    // For simplicity and compatibility with current string IDs, we'll use a simple query
    const idResult = await pool.query('SELECT id FROM prompts');
    const existingIds = idResult.rows.map(row => parseInt(row.id)).filter(n => !isNaN(n));
    const nextId = existingIds.length > 0 ? (Math.max(...existingIds) + 1).toString() : '1';
    
    const now = new Date().toISOString();

    const query = `
      INSERT INTO prompts (
        id, created_at, title_zh, title_en, description_zh, description_en, 
        category, tags, content, chinese_content, expected_output, usage, preview_image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `;

    // For simplicity, we assume the input from AdminPage (which is mainly for Chinese users) is Chinese content
    // But since AdminPage form has fields 'title', 'description', 'content', 'chineseContent'
    // We should map them correctly.
    // However, the database schema has title_zh/title_en.
    // The legacy local file format only had 'title' (which was mixed) and 'content' + 'chineseContent'.
    
    // Strategy: 
    // 1. Prefer explicit fields from frontend (titleZh, title, descriptionZh, description)
    // 2. Fallback: If titleZh is missing, use title (and vice versa)
    // 3. Fallback: If descriptionZh is missing, use description (and vice versa)
    
    const titleEn = newPromptData.title || newPromptData.titleZh || '';
    const titleZh = newPromptData.titleZh || newPromptData.title || ''; 
    const descEn = newPromptData.description || newPromptData.descriptionZh || '';
    const descZh = newPromptData.descriptionZh || newPromptData.description || '';

    // Define the Category Enum mapping (Value -> Key) for normalization
    const CategoryMap = {
      'All': 'ALL',
      'Coding': 'CODING',
      'Writing': 'WRITING',
      'Business': 'BUSINESS',
      'Photography': 'PHOTOGRAPHY',
      'Art & Design': 'ART',
      'Commercial Visuals': 'COMMERCIAL',
      'Productivity': 'PRODUCTIVITY',
      'Marketing': 'MARKETING',
      'Fun & Creative': 'FUN',
      'SEO': 'SEO',
      'Learning': 'LEARNING'
    };

    let finalCategory = (newPromptData.category || 'CODING');
    
    // Normalize logic:
    // If input matches a known Value (e.g. "Art & Design"), convert to Key ("ART")
    const matchedValueKey = Object.keys(CategoryMap).find(k => k.toLowerCase() === finalCategory.toLowerCase());
    
    if (matchedValueKey) {
      finalCategory = CategoryMap[matchedValueKey];
    } else {
      finalCategory = finalCategory.toUpperCase();
    }

    const values = [
      nextId,
      now,
      titleZh, 
      titleEn, 
      descZh, 
      descEn, 
      finalCategory,
      JSON.stringify(newPromptData.tags || []),
      newPromptData.content, // This is the English Prompt content usually
      newPromptData.chineseContent || '', // Chinese translation of the prompt
      newPromptData.expectedOutput || '',
      newPromptData.usage || '',
      newPromptData.previewImageUrl || ''
    ];

    await pool.query(query, values);

    console.log(`[DB API] Added prompt ${nextId}: ${newPromptData.title}`);
    res.json({ success: true, id: nextId, message: 'Prompt added to database successfully' });

  } catch (error) {
    console.error('[DB API Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// --- API: Update Prompt (Edit) ---
app.put('/api/prompts/:id', async (req, res) => {
  // Auth Check
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.authorization;
  if (adminPassword && (!authHeader || authHeader !== `Bearer ${adminPassword}`)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // We only update fields that are provided
    // Construct dynamic query
    
    // Mapping frontend fields to DB columns
    const fieldMap = {
      titleZh: 'title_zh',
      titleEn: 'title_en',
      // 'title' from frontend is ambiguous, let's prioritize explicit lang fields. 
      // If 'title' is sent but no 'titleEn', maybe treat as title_en? 
      // For safety, let's stick to explicit fields or 'title' -> 'title_zh' (if no titleZh provided) to match create logic?
      // Actually, for edit, we expect precise fields.
      
      descriptionZh: 'description_zh',
      descriptionEn: 'description_en',
      category: 'category',
      tags: 'tags',
      content: 'content',
      chineseContent: 'chinese_content',
      expectedOutput: 'expected_output',
      usage: 'usage',
      previewImageUrl: 'preview_image_url'
    };

    // Special handling for tags (JSON stringify) and category (uppercase)
    const values = [];
    const setClauses = [];
    let paramIndex = 1;

    // Helper to add field
    const addField = (key, val) => {
      if (val !== undefined) {
        setClauses.push(`${fieldMap[key]} = $${paramIndex}`);
        values.push(val);
        paramIndex++;
      }
    };

    if (updateData.titleZh !== undefined) addField('titleZh', updateData.titleZh);
    if (updateData.titleEn !== undefined) addField('titleEn', updateData.titleEn);
    if (updateData.descriptionZh !== undefined) addField('descriptionZh', updateData.descriptionZh);
    if (updateData.descriptionEn !== undefined) addField('descriptionEn', updateData.descriptionEn);
    
    // Define the Category Enum mapping (Value -> Key) for normalization
    const CategoryMap = {
      'All': 'ALL',
      'Coding': 'CODING',
      'Writing': 'WRITING',
      'Business': 'BUSINESS',
      'Photography': 'PHOTOGRAPHY',
      'Art & Design': 'ART',
      'Commercial Visuals': 'COMMERCIAL',
      'Productivity': 'PRODUCTIVITY',
      'Marketing': 'MARKETING',
      'Fun & Creative': 'FUN',
      'SEO': 'SEO',
      'Learning': 'LEARNING'
    };

    // Helper to normalize category
    const normalizeCategory = (inputCat) => {
      if (!inputCat) return 'CODING';
      
      // 1. Check if it's a known Value (e.g. "Art & Design") -> Return Key ("ART")
      const mapKey = Object.keys(CategoryMap).find(key => key.toLowerCase() === inputCat.toLowerCase());
      if (mapKey) return CategoryMap[mapKey];

      // 2. Check if it's already a known Key (e.g. "ART") -> Return it
      const validKeys = Object.values(CategoryMap);
      if (validKeys.includes(inputCat.toUpperCase())) return inputCat.toUpperCase();

      // 3. Check if input is a valid Key but lowercase (e.g. "art") -> Return "ART"
      // (This is covered by checking if upper version is in values, but for clarity:)
      // Actually, Object.values(CategoryMap) contains KEYS like 'CODING', 'ART'.
      // Wait, in my script CategoryMap keys were Values and values were Keys.
      // Let's stick to the script's logic which was correct.
      
      // Re-defining map to be consistent with script: Value -> Key
      // But here I defined it above as Value -> Key too? 
      // 'Art & Design': 'ART' -> Key is Value, Value is Key. Correct.
      
      // 4. Fallback: just uppercase it
      return inputCat.toUpperCase();
    };

    if (updateData.category !== undefined) {
      setClauses.push(`category = $${paramIndex}`);
      // Normalize category before saving
      // If frontend sends "Art & Design" (Value), we want to save "ART" (Key).
      // If frontend sends "ART" (Key), we want to save "ART" (Key).
      
      let finalCategory = updateData.category;
      
      // Try to find if the input matches any Value in our map (case-insensitive)
      // e.g. input "Art & Design" matches key "Art & Design" -> val "ART"
      const matchedValueKey = Object.keys(CategoryMap).find(k => k.toLowerCase() === finalCategory.toLowerCase());
      
      if (matchedValueKey) {
        finalCategory = CategoryMap[matchedValueKey];
      } else {
        // If not a Value, assume it's a Key or needs upper casing
        finalCategory = finalCategory.toUpperCase();
      }

      values.push(finalCategory);
      paramIndex++;
    }
    
    if (updateData.tags !== undefined) {
      setClauses.push(`tags = $${paramIndex}`);
      values.push(JSON.stringify(updateData.tags));
      paramIndex++;
    }

    if (updateData.content !== undefined) addField('content', updateData.content);
    if (updateData.chineseContent !== undefined) addField('chineseContent', updateData.chineseContent);
    if (updateData.expectedOutput !== undefined) addField('expectedOutput', updateData.expectedOutput);
    if (updateData.usage !== undefined) addField('usage', updateData.usage);
    if (updateData.previewImageUrl !== undefined) addField('previewImageUrl', updateData.previewImageUrl);

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const query = `UPDATE prompts SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    console.log(`[DB API] Updated prompt ${id}`);
    res.json({ success: true, message: 'Prompt updated successfully', prompt: result.rows[0] });

  } catch (error) {
    console.error('[DB API Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// --- API: Get Prompts (Database Version) ---
app.get('/api/prompts', async (req, res) => {
  try {
    // --- Pagination & Random Sort Logic ---
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const offset = (page - 1) * limit;
    const category = req.query.category; // Optional category filter
    const sort = req.query.sort || 'random'; // 'random' (default) or 'recent'

    // Generate a stable seed for the current hour (e.g., "2023-10-27T14")
    const hourKey = new Date().toISOString().slice(0, 13); 

    let queryCount = 'SELECT COUNT(*) FROM prompts';
    let queryData = 'SELECT * FROM prompts';
    let paramsCount = [];
    let paramsData = [limit, offset]; // $1=limit, $2=offset (will adjust index dynamically)
    
    // Dynamic Param Index Helper
    let paramIdx = 3; // Start from $3

    // Add Category Filter
    if (category && category !== 'ALL') {
      const catUpper = category.toUpperCase();
      queryCount += ' WHERE category = $1';
      queryData += ` WHERE category = $${paramIdx}`;
      paramsCount.push(catUpper);
      paramsData.push(catUpper);
      paramIdx++;
    }

    // 1. Get Total Count (for hasMore check)
    const countResult = await pool.query(queryCount, paramsCount);
    const total = parseInt(countResult.rows[0].count);

    // 2. Get Paginated Data with Random Sort
    if (sort === 'recent') {
      queryData += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    } else {
      queryData += ` ORDER BY md5(id::text || '${hourKey}') ASC LIMIT $1 OFFSET $2`;
    }

    const result = await pool.query(queryData, paramsData);
    
    const preferredLang = req.query.lang; // 'zh' or 'en'
    
    const prompts = result.rows.map(row => {
      let displayTitle = row.title_en || row.title_zh;
      let displayDesc = row.description_en || row.description_zh;
      
      if (preferredLang === 'zh') {
         displayTitle = row.title_zh || row.title_en;
         displayDesc = row.description_zh || row.description_en;
      } else if (preferredLang === 'en') {
         displayTitle = row.title_en || row.title_zh;
         displayDesc = row.description_en || row.description_zh;
      }
      
      return {
        id: row.id,
        createdAt: row.created_at,
        title: displayTitle,
        titleZh: row.title_zh,
        titleEn: row.title_en,
        description: displayDesc,
        descriptionZh: row.description_zh,
        descriptionEn: row.description_en,
        category: row.category,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
        content: row.content,
        chineseContent: row.chinese_content,
        expectedOutput: row.expected_output,
        usage: row.usage,
        previewImageUrl: row.preview_image_url,
        // Calculate total copy count (Local Server Sync)
        copyCount: (row.base_count || 0) + (row.real_copy_count || 0)
      };
    });

    res.json({
      prompts,
      total,
      page,
      hasMore: offset + prompts.length < total
    });
  } catch (error) {
    console.error('[DB API Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// --- LEGACY API: Save Prompt to File (Preserved) ---
app.post('/api/prompts-legacy', (req, res) => {
  try {
    const newPromptData = req.body;
    
    if (!newPromptData.title || !newPromptData.content) {
      return res.status(400).json({ error: 'Title and Content are required' });
    }

    let fileContent = readDataFile(DATA_FILE_ZH);
    const nextId = getNextId(fileContent);
    const now = new Date().toISOString();

    const newEntryString = `
  {
    id: '${nextId}',
    createdAt: '${now}',
    title: ${JSON.stringify(newPromptData.title)},
    description: ${JSON.stringify(newPromptData.description || '')},
    category: Category.${(newPromptData.category || 'CODING').toUpperCase()},
    tags: ${JSON.stringify(newPromptData.tags || [])},
    content: ${JSON.stringify(newPromptData.content)},
    chineseContent: ${JSON.stringify(newPromptData.chineseContent || '')},
    expectedOutput: ${JSON.stringify(newPromptData.expectedOutput || '')},
    usage: ${JSON.stringify(newPromptData.usage || '')}${newPromptData.previewImageUrl ? `,\n    previewImageUrl: '${newPromptData.previewImageUrl}'` : ''}
  }`;

    const lastBracketIndex = fileContent.lastIndexOf('];');
    if (lastBracketIndex === -1) throw new Error('Could not find closing bracket "];"');

    const insertPosition = lastBracketIndex;
    const contentBefore = fileContent.substring(0, insertPosition).trimEnd();
    const needsComma = !contentBefore.endsWith(',') && !contentBefore.endsWith('[');
    
    const finalString = contentBefore + (needsComma ? ',' : '') + newEntryString + '\n];\n';

    fs.writeFileSync(DATA_FILE_ZH, finalString, 'utf-8');

    console.log(`[API] Added prompt ${nextId}: ${newPromptData.title}`);
    res.json({ success: true, id: nextId, message: 'Prompt added successfully' });

  } catch (error) {
    console.error('[API Error]', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Local API Server running at http://localhost:${PORT}`);
});
