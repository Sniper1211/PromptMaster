import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const updateData = req.body;
      
      // Mapping frontend fields to DB columns
      const fieldMap = {
        titleZh: 'title_zh',
        titleEn: 'title_en',
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

      if (updateData.category !== undefined) {
        setClauses.push(`category = $${paramIndex}`);
        let finalCategory = updateData.category;
        
        // Normalize logic
        const matchedValueKey = Object.keys(CategoryMap).find(k => k.toLowerCase() === finalCategory.toLowerCase());
        
        if (matchedValueKey) {
          finalCategory = CategoryMap[matchedValueKey];
        } else {
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

      return res.status(200).json({ success: true, message: 'Prompt updated successfully', prompt: result.rows[0] });

    } catch (error) {
      console.error('[DB API Error]', error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
      // Implement delete logic if needed
      return res.status(501).json({ error: 'Not implemented' });
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
