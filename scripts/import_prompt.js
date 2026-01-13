
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.resolve(__dirname, '../src/data/prompts-zh.ts');
const INPUT_FILE = path.resolve(__dirname, 'new_prompt.json');

// Helper to read TS file content
const readDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`Error: Data file not found at ${DATA_FILE}`);
    process.exit(1);
  }
  return fs.readFileSync(DATA_FILE, 'utf-8');
};

// Helper to find the last ID
const getNextId = (content) => {
  const ids = [];
  const regex = /id:\s*'(\d+)'/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push(parseInt(match[1], 10));
  }
  if (ids.length === 0) return 1;
  return Math.max(...ids) + 1;
};

// Main logic
const run = () => {
  console.log('🚀 Starting Prompt Importer...');

  // 1. Read Input
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Error: Please create ${INPUT_FILE} first.`);
    process.exit(1);
  }
  
  let newPromptData;
  try {
    newPromptData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  } catch (e) {
    console.error('Error: Invalid JSON in new_prompt.json');
    process.exit(1);
  }

  // 2. Read existing data to determine ID
  let fileContent = readDataFile();
  const nextId = getNextId(fileContent);
  const now = new Date().toISOString();

  console.log(`ℹ️  Next ID: ${nextId}`);
  console.log(`ℹ️  Timestamp: ${now}`);

  // 3. Format the new object string
  // We use string manipulation to append to the array because parsing TS/JS with comments is hard
  const newEntryString = `
  {
    id: '${nextId}',
    createdAt: '${now}',
    title: ${JSON.stringify(newPromptData.title)},
    description: ${JSON.stringify(newPromptData.description)},
    category: Category.${newPromptData.category.toUpperCase()},
    tags: ${JSON.stringify(newPromptData.tags)},
    content: ${JSON.stringify(newPromptData.content)},
    chineseContent: ${JSON.stringify(newPromptData.chineseContent)},
    expectedOutput: ${JSON.stringify(newPromptData.expectedOutput)},
    usage: ${JSON.stringify(newPromptData.usage)}${newPromptData.previewImageUrl ? `,\n    previewImageUrl: '${newPromptData.previewImageUrl}'` : ''}
  }`;

  // 4. Insert before the last closing bracket "];"
  // Find the last occurrence of "];"
  const lastBracketIndex = fileContent.lastIndexOf('];');
  
  if (lastBracketIndex === -1) {
    console.error('Error: Could not find closing bracket "];" in data file.');
    process.exit(1);
  }

  // Add a comma if the previous item doesn't have one (simple check)
  const insertPosition = lastBracketIndex;
  const contentBefore = fileContent.substring(0, insertPosition).trimEnd();
  const needsComma = !contentBefore.endsWith(',') && !contentBefore.endsWith('[');
  
  const finalString = contentBefore + (needsComma ? ',' : '') + newEntryString + '\n];\n';

  // 5. Write back
  fs.writeFileSync(DATA_FILE, finalString, 'utf-8');

  console.log(`✅ Successfully added prompt "${newPromptData.title}" (ID: ${nextId})`);
  console.log(`👉 Don't forget to run 'npm run dev' to see changes!`);
};

run();
