import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM prompts ORDER BY created_at DESC');
      
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
          previewImageUrl: row.preview_image_url
        };
      });

      return res.status(200).json(prompts);
    } catch (error) {
      console.error('[DB API Error]', error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const newPromptData = req.body;
      
      if (!newPromptData.title || !newPromptData.content) {
        return res.status(400).json({ error: 'Title and Content are required' });
      }

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

      return res.status(200).json({ success: true, id: nextId, message: 'Prompt added to database successfully' });

    } catch (error) {
      console.error('[DB API Error]', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
