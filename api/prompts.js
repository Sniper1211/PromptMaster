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
      
      const prompts = result.rows.map(row => ({
        id: row.id,
        createdAt: row.created_at,
        title: row.title_zh || row.title_en,
        description: row.description_zh || row.description_en,
        category: row.category,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
        content: row.content,
        chineseContent: row.chinese_content,
        expectedOutput: row.expected_output,
        usage: row.usage,
        previewImageUrl: row.preview_image_url
      }));

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

      const values = [
        nextId,
        now,
        newPromptData.title,
        '',
        newPromptData.description || '',
        '',
        (newPromptData.category || 'CODING').toUpperCase(),
        JSON.stringify(newPromptData.tags || []),
        newPromptData.content,
        newPromptData.chineseContent || '',
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
