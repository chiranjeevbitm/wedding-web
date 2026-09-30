// Shared Neon helper for the /api/* functions.
// IMPORTANT: the connection is created INSIDE the handler (not at module
// top) so a missing env var becomes a readable 500 instead of a dead function.
import { neon } from '@neondatabase/serverless';

export function getSql() {
  if (!process.env.DATABASE_URL) {
    const e = new Error(
      'DATABASE_URL is not set on the server — add it in Vercel → Project → Settings → Environment Variables, then redeploy.'
    );
    e.code = 'NO_DB_URL';
    throw e;
  }
  return neon(process.env.DATABASE_URL);
}

export function dbError(e) {
  const msg = e && e.code === 'NO_DB_URL'
    ? String(e.message)
    : String((e && e.message) || e);
  return { error: msg };
}
