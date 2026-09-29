import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS rsvp (
      id SERIAL PRIMARY KEY, name TEXT NOT NULL, side TEXT DEFAULT 'groom',
      attending TEXT DEFAULT 'yes', count TEXT DEFAULT '1', phone TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, name, side, attending, count, phone, created_at FROM rsvp ORDER BY id DESC LIMIT 200`;
      return res.status(200).json({ rsvp: rows });
    }
    if (req.method === 'POST') {
      const { name, side, attending, count, phone } = req.body || {};
      if (!name) return res.status(400).json({ error: 'name required' });
      const rows = await sql`INSERT INTO rsvp (name, side, attending, count, phone)
        VALUES (${name}, ${side || 'groom'}, ${attending || 'yes'}, ${count || '1'}, ${phone || ''}) RETURNING id`;
      return res.status(200).json({ ok: true, id: rows[0].id });
    }
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
