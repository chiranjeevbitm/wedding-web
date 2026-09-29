import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY, name TEXT NOT NULL DEFAULT '', message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, name, message, created_at FROM feedback ORDER BY id DESC LIMIT 200`;
      return res.status(200).json({ feedback: rows });
    }
    if (req.method === 'POST') {
      const { name, message } = req.body || {};
      if (!message) return res.status(400).json({ error: 'message required' });
      const rows = await sql`INSERT INTO feedback (name, message)
        VALUES (${name || ''}, ${message}) RETURNING id`;
      return res.status(200).json({ ok: true, id: rows[0].id });
    }
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
