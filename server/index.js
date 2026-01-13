
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

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

// --- API: Analyze Text via LLM ---
app.post('/api/analyze', async (req, res) => {
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
      "title": "A short, catchy title (English)",
      "description": "A 1-sentence summary (English)",
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

// --- API: Save Prompt ---
app.post('/api/prompts', (req, res) => {
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
