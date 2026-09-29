// Creates Neon tables from .env DATABASE_URL. Run: npm run db:init
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);
await sql`CREATE TABLE IF NOT EXISTS wishes (
  id SERIAL PRIMARY KEY, name TEXT NOT NULL, message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
)`;
await sql`CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY, name TEXT NOT NULL DEFAULT '', message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
)`;
await sql`CREATE TABLE IF NOT EXISTS app_state (
  id INT PRIMARY KEY DEFAULT 1, state JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT one_row CHECK (id = 1)
)`;
console.log('Neon tables ready: wishes, feedback, app_state');

