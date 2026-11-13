import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const rawId = req.query.id;
  const id = typeof rawId === 'string' ? rawId.trim() : '';

  // Only numeric IDs exist in the prompts table; reject anything else before touching the DB.
  if (!id || !/^[0-9]{1,32}$/.test(id)) {
    return res.status(400).json({ error: 'Invalid prompt ID' });
  }

  try {
    // Atomic increment of real_copy_count; 404 when the prompt does not exist.
    const result = await pool.query(
      'UPDATE prompts SET real_copy_count = COALESCE(real_copy_count, 0) + 1 WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Increment Copy Error]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
