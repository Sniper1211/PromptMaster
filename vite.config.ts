import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      {
        name: 'admin-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/save-prompt' && req.method === 'POST') {
              let body = '';
              for await (const chunk of req) {
                body += chunk;
              }

              try {
                const prompt = JSON.parse(body);
                const zhPath = path.resolve(__dirname, 'src/data/prompts-zh.ts');
                const enPath = path.resolve(__dirname, 'src/data/prompts-en.ts');

                const appendPrompt = (filePath: string) => {
                  let content = fs.readFileSync(filePath, 'utf-8');
                  const lastBracketIndex = content.lastIndexOf('];');

                  if (lastBracketIndex === -1) throw new Error('Could not find end of array');

                  // Map string categories back to Category enum references
                  const categoryMap: Record<string, string> = {
                    'Coding': 'Category.CODING',
                    'Writing': 'Category.WRITING',
                    'Business': 'Category.BUSINESS',
                    'Photography': 'Category.PHOTOGRAPHY',
                    'Art & Design': 'Category.ART',
                    'Commercial Visuals': 'Category.COMMERCIAL'
                  };

                  let entryString = JSON.stringify(prompt, null, 2);

                  // Convert "category": "Coding" -> category: Category.CODING
                  if (categoryMap[prompt.category]) {
                    const enumValue = categoryMap[prompt.category];
                    entryString = entryString.replace(
                      /"category":\s*"[^"]+"/,
                      `category: ${enumValue}`
                    );
                  }

                  // Remove quotes from first-level keys for cleaner TS look (optional but nicer)
                  entryString = entryString.replace(/^(\s*)"(\w+)":/gm, '$1$2:');

                  const newEntry = `,\n  ${entryString.replace(/\n/g, '\n  ')}\n`;
                  const newContent = content.slice(0, lastBracketIndex).trimEnd() + newEntry + content.slice(lastBracketIndex);

                  fs.writeFileSync(filePath, newContent);
                };

                appendPrompt(zhPath);
                appendPrompt(enPath);

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
                return;
              } catch (err: any) {
                console.error('Save error:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
                return;
              }
            }
            next();
          });
        }
      }
    ],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  };
});
