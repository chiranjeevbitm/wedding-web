import { getSql, dbError } from './_db.js';

// Login-free diagnostics for the deploy: tells us (in plain words) whether
// the API can reach Neon — GET /api/diag from any browser or curl.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });
  const out = { ok: false, hasDbUrl: !!process.env.DATABASE_URL, canQuery: false, tablesOk: false, counts: null, error: null };
  try {
    const sql = getSql();
    await sql`SELECT 1`;
    out.canQuery = true;
    const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      AND tablename IN ('app_state', 'wishes', 'feedback')`;
    out.tablesOk = tables.length === 3;
    const wb = await sql`SELECT COUNT(*)::int AS c FROM wishes`.catch(() => [{ c: -1 }]);
    const fb = await sql`SELECT COUNT(*)::int AS c FROM feedback`.catch(() => [{ c: -1 }]);
    const st = await sql`SELECT COUNT(*)::int AS c FROM app_state`.catch(() => [{ c: -1 }]);
    out.counts = { wishes: wb[0].c, feedback: fb[0].c, app_state: st[0].c };
    out.ok = out.hasDbUrl && out.canQuery && out.tablesOk;
  } catch (e) {
    out.error = dbError(e).error;
  }
  return res.status(out.ok ? 200 : 500).json(out);
}
