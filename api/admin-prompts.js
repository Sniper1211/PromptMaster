import promptsHandler from './prompts.js';

/**
 * Admin-only prompt API.
 *
 * The public anonymous GET /api/prompts is blocked at the edge (WAF) because public pages now
 * read the build-time static JSON. The admin dashboard uses this endpoint with
 * `Authorization: Bearer <ADMIN_PASSWORD>`; it delegates GET requests to the same handler.
 */
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
        return res.status(503).json({ error: 'Admin auth is not configured' });
    }
    if (req.headers.authorization !== `Bearer ${adminPassword}`) {
        res.setHeader('Cache-Control', 'no-store');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    res.setHeader('Cache-Control', 'no-store');
    return promptsHandler(req, res);
}
