# ghar-ki-shaadi (from wedding-web folder)

Bilingual family-season planner: Chhath (13–16 Nov) → cousin's wedding (27 Nov–3 Dec, Delhi 2 Dec) → Deepak × Alka (7–13 Dec), Muzaffarpur.

## Run
npm install
npm run dev        # http://localhost:5173

## Neon DB (optional, for RSVP / wishes / shared state)
DATABASE_URL is in `.env` (git-ignored). Tables auto-create on first API call:
npm run db:init    # creates rsvp, wishes, app_state
# Local dev uses localStorage; /api/* needs `vercel dev` or a Vercel deploy.

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
