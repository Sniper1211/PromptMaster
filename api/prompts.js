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
      const preferredLang = req.query.lang; // 'zh' or 'en'

      // --- Single Item Fetch ---
      if (req.query.id) {
        const { id } = req.query;
        const result = await pool.query('SELECT * FROM prompts WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Prompt not found' });
        }

        const row = result.rows[0];
        let displayTitle = row.title_en || row.title_zh;
        let displayDesc = row.description_en || row.description_zh;
        
        if (preferredLang === 'zh') {
           displayTitle = row.title_zh || row.title_en;
           displayDesc = row.description_zh || row.description_en;
        } else if (preferredLang === 'en') {
           displayTitle = row.title_en || row.title_zh;
           displayDesc = row.description_en || row.description_zh;
        }

        const prompt = {
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
          copyCount: (row.base_count || 0) + (row.real_copy_count || 0),
          // Video prompt specific fields
          promptType: row.prompt_type || 'text',
          sourceLink: row.source_link,
          authorName: row.author_name,
          videoThumbnailUrl: row.video_thumbnail_url
        };

        return res.status(200).json(prompt);
      }

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

      // 1. Get Total Count
      const countResult = await pool.query(queryCount, paramsCount);
      const total = parseInt(countResult.rows[0].count);

      // 2. Get Paginated Data
      if (sort === 'recent') {
        queryData += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
      } else {
        // Random (Hourly Stable)
        // We need to inject the hourKey into the query string safely or use a param
        // To use a param for the seed, we need to push it to paramsData
        // BUT md5(id || $x) might be tricky with variable params order.
        // Let's just interpolate the hourKey since it's server-generated (safe)
        queryData += ` ORDER BY md5(id::text || '${hourKey}') ASC LIMIT $1 OFFSET $2`;
      }
      
      const result = await pool.query(queryData, paramsData);
      
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
          // Calculate total copy count
          copyCount: (row.base_count || 0) + (row.real_copy_count || 0),
          // Video prompt specific fields
          promptType: row.prompt_type || 'text',
          sourceLink: row.source_link,
          authorName: row.author_name,
          videoThumbnailUrl: row.video_thumbnail_url
        };
      });

      return res.status(200).json({
        prompts,
        total,
        page,
        hasMore: offset + prompts.length < total
      });
    } catch (error) {
      console.error('[DB API Error]', error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    // --- Auth Check ---
    const adminPassword = process.env.ADMIN_PASSWORD;
    const authHeader = req.headers.authorization;

    if (adminPassword) {
      if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Admin Password' });
      }
    }
    // ------------------

    try {
      const newPromptData = req.body;
      
      if (!newPromptData.title || !newPromptData.content) {
        return res.status(400).json({ error: 'Title and Content are required' });
      }

      const idResult = await pool.query('SELECT id FROM prompts');
      const existingIds = idResult.rows.map(row => parseInt(row.id)).filter(n => !isNaN(n));
      const nextId = existingIds.length > 0 ? (Math.max(...existingIds) + 1).toString() : '1';
      
      const now = new Date().toISOString();

      // Init base_count with a random number for new prompts (e.g., 100-300) to make the site look active
      const baseCount = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
      const realCopyCount = 0;

      const query = `
        INSERT INTO prompts (
          id, created_at, title_zh, title_en, description_zh, description_en, 
          category, tags, content, chinese_content, expected_output, usage, preview_image_url,
          base_count, real_copy_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
        newPromptData.previewImageUrl || '',
        baseCount,
        realCopyCount
      ];

      await pool.query(query, values);

      return res.status(200).json({ success: true, id: nextId, message: 'Prompt added to database successfully' });

    } catch (error) {
      console.error('[DB API Error]', error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    // --- Auth Check ---
    const adminPassword = process.env.ADMIN_PASSWORD;
    const authHeader = req.headers.authorization;

    if (adminPassword) {
      if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Admin Password' });
      }
    }
    // ------------------

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing Prompt ID' });
    }

    try {
      const updates = req.body;
      
      // Build dynamic update query
      const fields = [];
      const values = [];
      let idx = 1;

      // Allow updating specific fields
      const allowedFields = [
        'title_zh', 'title_en', 'description_zh', 'description_en', 
        'category', 'tags', 'content', 'chinese_content', 
        'expected_output', 'usage', 'preview_image_url'
      ];

      for (const [key, value] of Object.entries(updates)) {
        // Map frontend camelCase to snake_case if needed
        let dbKey = key;
        if (key === 'titleZh') dbKey = 'title_zh';
        if (key === 'titleEn') dbKey = 'title_en';
        if (key === 'descriptionZh') dbKey = 'description_zh';
        if (key === 'descriptionEn') dbKey = 'description_en';
        if (key === 'chineseContent') dbKey = 'chinese_content';
        if (key === 'expectedOutput') dbKey = 'expected_output';
        if (key === 'previewImageUrl') dbKey = 'preview_image_url';

        if (allowedFields.includes(dbKey)) {
          fields.push(`${dbKey} = $${idx}`);
          values.push(dbKey === 'tags' ? JSON.stringify(value) : value);
          idx++;
        }
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      values.push(id); // Add ID as the last parameter
      const query = `UPDATE prompts SET ${fields.join(', ')} WHERE id = $${idx}`;

      await pool.query(query, values);

      return res.status(200).json({ success: true, message: 'Prompt updated successfully' });

    } catch (error) {
      console.error('[DB Update Error]', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
