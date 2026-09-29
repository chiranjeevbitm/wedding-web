import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS wishes (
      id SERIAL PRIMARY KEY, name TEXT NOT NULL, message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, name, message, created_at FROM wishes ORDER BY id DESC LIMIT 200`;
      return res.status(200).json({ wishes: rows });
    }
    if (req.method === 'POST') {
      const { name, message } = req.body || {};
      if (!message) return res.status(400).json({ error: 'message required' });
      const rows = await sql`INSERT INTO wishes (name, message)
        VALUES (${name || 'Anonymous'}, ${message}) RETURNING id`;
      return res.status(200).json({ ok: true, id: rows[0].id });
    }
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
