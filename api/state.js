import { getSql, dbError } from './_db.js';

async function ensure(sql) {
  await sql`CREATE TABLE IF NOT EXISTS rsvp (
    id SERIAL PRIMARY KEY, name TEXT NOT NULL, side TEXT DEFAULT 'groom',
    attending TEXT DEFAULT 'yes', count TEXT DEFAULT '1', phone TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS wishes (
    id SERIAL PRIMARY KEY, name TEXT NOT NULL, message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS app_state (
    id INT PRIMARY KEY DEFAULT 1, state JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT one_row CHECK (id = 1)
  )`;
}

export default async function handler(req, res) {
  try {
    const sql = getSql();
    await ensure(sql);
    if (req.method === 'GET') {
      const rows = await sql`SELECT state FROM app_state WHERE id = 1`;
      return res.status(200).json({ state: rows[0]?.state || null });
    }
    if (req.method === 'POST') {
      const { state } = req.body || {};
      if (!state) return res.status(400).json({ error: 'missing state' });
      await sql`INSERT INTO app_state (id, state, updated_at) VALUES (1, ${JSON.stringify(state)}, NOW())
        ON CONFLICT (id) DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()`;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json(dbError(e));
  }
}
