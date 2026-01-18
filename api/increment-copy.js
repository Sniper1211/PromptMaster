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

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing prompt ID' });
  }

  try {
    // Atomic increment of real_copy_count
    await pool.query(
      'UPDATE prompts SET real_copy_count = COALESCE(real_copy_count, 0) + 1 WHERE id = $1',
      [id]
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Increment Copy Error]', error);
    return res.status(500).json({ error: error.message });
  }
}
