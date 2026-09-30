# ghar-ki-shaadi (from wedding-web folder)

Bilingual family-season planner: Chhath (13–16 Nov) → cousin's wedding (27 Nov–3 Dec, Delhi 2 Dec) → Deepak × Salvi (7–13 Dec), Muzaffarpur.

## Run
npm install
npm run dev        # http://localhost:5173

## Checks
npm run check:all  # gate + sync + auth (72 assertions)

## Neon DB (global sync)
`DATABASE_URL` in `.env` (git-ignored). Tables: `app_state` (the one shared
document), `wishes`, `feedback`. `npm run db:init` creates them.

Sync: boot → PULL, then every 15 s; your edits PUSH after 700 ms. So an edit
made on any phone shows up on every phone. On Vercel set `DATABASE_URL` as an
env var, otherwise every phone stays local ("⚪ this phone only").

## Login
PIN = the current time in Asia/Kolkata, digits only (01:23 → `0123`; 24-hr
`1323` and 3-digit `123` also work). Session is in-memory: a refresh asks
again, and 4 minutes idle locks the app. No hints are shown on screen.

## Structure (simple for agents)
src/data/   — seed truth (journey, events-a/b, kits, rituals-a/b). Edit facts here.
src/lib/    — store.jsx (one store), format.js (dates + bilingual)
src/pages/  — Home Journey Calendar Day Checklist People Travel Guide Rsvp About More
src/components/ — Shell (nav), ui (Chip, FolkBorder)
api/        — state.js rsvp.js wishes.js (Neon serverless)
public/     — favicon, manifest, sw.js (offline)

## Rules
- Dossier wins: wedding-context-and-reasoning.md over plan.
- Never invent names/times/muhurat/ghat — leave empty with toVerify.
- Colours/fonts only in src/styles/tokens.css.
