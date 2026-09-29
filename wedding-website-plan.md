# 02 · Wedding Website — Detailed Build Plan

> **Working title in-product:** घर की शादी · *Ghar Ki Shaadi*
> **Subtitle:** **Dr Deepak × Salvi** · Muzaffarpur · 7–13 Dec 2026 · *cousin: **Gurvav × Alka**, 2 Dec, Delhi*
> **Tagline:** एक शादी नहीं, पूरे परिवार की कहानी। — *Not one wedding. A whole family's story.*
> **Stack:** React + Vite · plain CSS · hand-drawn inline SVG · localStorage · PWA · deployed on Vercel
> **Hard constraint:** frontend only, no backend, no database, no login in v1. Target < 80 KB gzipped JS.
> **Companion document:** `wedding-context-and-reasoning.md` (source of all facts, statuses and seed data)
> **Plan date:** 29 Sep 2026 · **First live target: before 13 Nov 2026 (Chhath)**

---

## 0 · Document map

| Section | What it settles |
| --- | --- |
| §1–2 | Product definition, goals, non-goals, success criteria; users and jobs-to-be-done |
| §3 | Design principles, product laws, the confidence-state contract, the feature gate |
| §4 | Information architecture: route map, navigation chrome, the three tracks |
| §5 | Screen-by-screen specification with wireframes (Home → Journey → Calendar → Day Sheet → Checklist → Items → People → Travel → Ritual Guide → Geet → Prasad → Decisions → About → More → Memories) |
| §6 | Design system: colour, typography, spacing, motifs, motion, tone |
| §7 | Data & state architecture: two stores, entity model, persistence, share links, derived logic, conflict rules |
| §8 | Tech stack decisions, rejected alternatives, and the enforced bundle budget |
| §9 | Project structure and file conventions |
| §10 | Interaction specifications (add flow, tick, timeline editing, swipe, search, family story, copy-as-text) |
| §11 | Edge cases & robustness (E1–E22) |
| §12 | Accessibility & the bilingual strategy |
| §13 | Offline / PWA plan and the offline test protocol |
| §14 | Performance plan and measurement |
| §15 | Testing strategy, including the "we never invent" data test |
| §16 | Deployment on Vercel: repo, `vercel.json`, privacy, previews, go-live checklist |
| §17 | Phased roadmap with acceptance criteria |
| §18 | Launch timeline & the two hard freeze rules |
| §19 | Build-side risk register |
| §20 | Open decisions needed from the user (K1–K6 blocking, S1–S10 shaping) |
| §21 | Appendix A — bilingual copy deck |
| §22 | Appendix B — component inventory & build order |
| §23 | Appendix C — definition of done |
| §24 | Immediate next steps: the first five commits |
| §25 | Closing note — the one sentence that decides success |

> **Sibling document:** `wedding-context-and-reasoning.md` holds every fact, its source and its confidence state.
> **If the two ever disagree, the dossier wins** — the plan bends to the evidence, never the reverse.

## 1 · Product definition

### 1.1 One-line definition

> A featherweight, offline-capable, bilingual **family-season planner** that walks the Kumar family through
> Chhath → the maternal cousin's wedding → Deepak's wedding, holds each date's ritual meaning, checklist,
> items, people, travel and notes, and quietly turns into a **digital keepsake** once the season ends.

### 1.2 Why not just "a wedding website"

Three products were competing inside the original request. We chose the third deliberately:

| Option | Verdict | Reason |
| --- | --- | --- |
| A wedding invitation website | ❌ rejected as the core | The data is three events across 31 days, not one wedding. A single-event site cannot express the `3 Dec → 7 Dec` turnaround, which is the emotional and logistical centre of the season |
| An admin dashboard / task manager | ❌ rejected as the tone | Correct on features, wrong on feeling. Mothers and aunts will not use a Gantt chart |
| **Family-season command centre + noticeboard + keepsake** | ✅ chosen | Serves "what's today", "what's next", "don't forget", "what does it mean", and survives past 13 Dec 2026 |

### 1.3 Goals (v1)

1. **G1** — A relative can answer *"what is happening today and what do I need to do?"* in **under 10 seconds**, on a phone, on 2G, one-handed.
2. **G2** — Every ritual on screen carries a correct, human, bilingual 40–80 word explainer.
3. **G3** — Nothing gets forgotten: every function has a checklist; every checklist item can be assigned to a person.
4. **G4** — The three tracks stay visibly correlated — the season reads as one story, not three calendars.
5. **G5** — It works with **no network** at the venue.
6. **G6** — Any family member's edits persist locally and can be shared back in one tap (no backend).
7. **G7** — Uncertain data never looks certain (the status system in §8.6).

### 1.4 Non-goals (v1) — scope guard

- No login, accounts, roles or permissions.
- No live multi-device sync (see §19 R1 for the mitigation).
- No RSVP collection, invitation cards, gift registry, or vendor marketplace.
- No photo/video upload — photos are **links and placeholders** only.
- No generic "Indian wedding" template aesthetics. Muzaffarpur/Bajjika specificity or nothing.

### 1.5 Success criteria (how we judge it worked)

| Metric | Target |
| --- | --- |
| Gzipped JS + CSS shipped on first load | **< 80 KB** (stretch < 60 KB) |
| Time-to-interactive on a mid-range Android over 4G | **< 1.8 s** |
| Largest contentful paint | **< 1.5 s** |
| Works fully offline after first visit | ✅ (service-worker precache) |
| Lighthouse mobile Performance / Accessibility / Best-practices / SEO | ≥ 95 / 100 / 100 / 100 |
| A non-technical family member can add an item unaided | ✅ (usability smoke test with 2 relatives) |
| Share-link round trip (edit → copy link → open on another phone → same state) | ✅ |
| Bundle has zero runtime dependencies beyond React | ✅ |
| Screen-reader pass on Day Sheet and Checklist | ✅ no critical violations |

## 2 · Users, devices and jobs-to-be-done

### 2.1 Personas → design rules

| Persona | Device | Entry point | Must work one-handed | Language default | Design rule derived |
| --- | --- | --- | --- | --- | --- |
| Planner (owner) | Android + laptop | Deep links to Day Sheet | part-time | English | All power features 2 taps from Home |
| Planner's wife | Phone | Home → Today | ✅ | English + Hindi labels | Dress-code + "bring this" surfaced on Today |
| Mother / Father | Phone | Home → Today | ✅ | **Hindi-first** | Nothing critical below the fold; no nested menus |
| Groom | Phone | Home → Day 11 | ✅ | English | Groom filter on Checklist; sherwani/sehra kit preloaded |
| Cousins / siblings | Phone | Ritual Guide / Geet Book | ✅ | English | Explainers ≤ 60 words; search-first |
| Outstation relatives | Phone, 2G, older Android | Travel & Stay | ✅ | Hindi + English | Offline-first; < 80 KB bundle is a *feature for them* |
| Elders | Phone (often shared) | Family Story | ✅ | Hindi | Large type; "add a voice note later" placeholder |

### 2.2 Jobs-to-be-done (ranked) mapped to screens

| # | Job | Primary screen | Secondary |
| --- | --- | --- | --- |
| J1 | "What is today and what must I do?" | Home → **Today** card | Day Sheet |
| J2 | "What's next, and how long left?" | Home → countdown + Next Up | Journey |
| J3 | "Don't let anything be forgotten." | Checklist | Day Sheet → Items |
| J4 | "What does this ritual mean?" | Ritual Guide | Day Sheet → "Why we do this" |
| J5 | "Who is coming, when, and where do they stay?" | Travel & Stay | People |
| J6 | "Who is bringing / doing what?" | People → person card | Day Sheet → Items |
| J7 | "What are we singing, and when?" | Geet Book | Day Sheet music block |
| J8 | "Save our version of this tradition." | Family Story (Elders' Notes) | Ritual Guide |
| J9 | "Send today's plan to the family." | More → Share | Any screen (share link) |

### 2.3 Anti-personas (explicitly not designed for)

- **Anonymous public visitors.** The app ships `noindex,nofollow` and an optional passcode — it holds private addresses, numbers and travel plans.
- **Couple's social circle** expecting RSVP / registry / gallery uploads. Out of scope by design (would require a backend).

### 2.4 Device support matrix (test targets)

| Tier | Device | OS / browser | Priority |
| --- | --- | --- | --- |
| T1 | Mid-range Android (e.g. Redmi/Realme class) | Android 12+, Chrome | **Primary** |
| T1 | iPhone | iOS 16+, Safari | **Primary** |
| T2 | Older Android | Android 9–11, Chrome | Must not break |
| T2 | Desktop Chrome / Safari / Edge | latest 2 versions | Secondary |
| T3 | Feature-phone / no-JS | — | Graceful message only |
| T4 | Screen reader | TalkBack / VoiceOver | Required pass |

## 3 · Design principles & product laws

These are the tie-breakers. When two good ideas conflict, the higher law wins.

| # | Law | What it forbids | What it demands |
| --- | --- | --- | --- |
| **P1** | **Truth over polish** — every fact carries a confidence state | Showing a "To verify" item as a final event | `confirmed / tentative / toVerify / suggested / context` chips on every date, time and ritual |
| **P2** | **Mobile-first, one-thumb-first** | Desktop-first layouts, hover-only affordances, menus with > 1 level | Bottom tab bar, bottom sheets, 44 px targets, thumb zone for primary actions |
| **P3** | **Hindi for the heart, English for the controls** | Fully English ritual names, fully Hindi navigation | Ritual names in Devanagari **and** Roman; UI chrome in English with Hindi toggle |
| **P4** | **Today is king** | Making the user hunt for the current day | Home always leads with Today (or Next Up if today is empty) |
| **P5** | **Weight is a feature** | Any non-essential dependency, icon pack, animation library, image asset | Hand-drawn SVG, CSS transitions only, two font families max |
| **P6** | **Works with no signal** | Anything that breaks offline | SW precache of shell + all data + fonts |
| **P7** | **The family owns the data** | Locking data in one browser, silent overwrites | Export/import JSON + share-link + reset-to-official |
| **P8** | **Warm, not corporate** | Dashboard chrome, toasts saying "Operation successful" | Folk-art motifs, gentle copy, marigold micro-rewards |
| **P9** | **Culture is specific or absent** | "Generic Indian wedding" decoration; "Madhubani" as a synonym for Bihar | Bajjika/North-Bihar framing; Mithila linework used as *influence*, never as a claim |
| **P10** | **Research ≠ family** | Auto-filling our research into a family ritual record | Separate "Cultural context" vs "Our family does this" blocks, with elders able to overwrite the latter |
| **P11** | **Reversible by default** | Destructive actions without undo | Every delete has a 5 s undo snackbar; import never silently merges |
| **P12** | **It must still be true on 14 Dec** | A UI that looks dead after the event | Memories mode auto-switch after the last event |

### 3.1 The confidence-state contract (non-negotiable)

```
confirmed   →  solid filled chip, no qualifier
tentative   →  outlined chip + dotted underline on the label + tooltip "provisionally agreed"
toVerify    →  amber chip "? to confirm" + an inline "Ask family" action that creates a checklist item
suggested   →  grey italic chip "planning suggestion" (our scaffolding, never a family claim)
context     →  muted, only inside the Ritual Guide, always prefixed "Traditionally…"
```

Any screen that shows a ritual without a state is a bug.

### 3.2 Feature gate — the 3-question test

Before adding anything, all three must be yes:

1. Does it serve J1–J9 (§2.2)?
2. Does it survive P5 (weight) — i.e. can it be done in < 3 KB of code and zero new dependencies?
3. Does it still make sense in **Memories mode** on 14 Dec 2026?

If (3) is no, it is probably a read-only nicety rather than a feature — cut it or move it to Phase 4.

## 4 · Information architecture

### 4.1 The map

```
                          ┌─────────────────┐
                          │      HOME       │  ← today, countdown, next-up, season strip
                          └────────┬────────┘
        ┌──────────────┬───────────┼────────────┬──────────────┐
        │              │           │            │              │
   ┌────▼────┐   ┌─────▼─────┐ ┌───▼────┐  ┌────▼─────┐  ┌─────▼─────┐
   │ JOURNEY │   │ CALENDAR  │ │ DAYS   │  │CHECKLIST │  │  PEOPLE   │
   │(3 tracks│   │(Nov–Dec   │ │(index  │  │(master   │  │(family +  │
   │  story) │   │ month view│ │ 7–13)  │  │ + items) │  │  roles)   │
   └─────────┘   └─────┬─────┘ └───┬────┘  └──────────┘  └─────┬─────┘
                       │           │                           │
                       └──────►┌───▼───────────┐◄──────────────┘
                               │  DAY SHEET    │  ← the heart of the app
                               │ /day/:date    │    tabs: Timeline · Items · People · Notes · Why
                               └───────┬───────┘
                                       │
   ┌───────────────┬───────────────┬───┴───────────┬───────────────┐
   │               │               │               │               │
┌──▼───┐     ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐  ┌──────▼──────┐
│RITUAL│     │ GEET BOOK │   │  TRAVEL   │   │  PRASAD   │  │  DECISIONS  │
│GUIDE │     │ (songs)   │   │  & STAY   │   │ (recipes) │  │   LOG       │
└──────┘     └───────────┘   └───────────┘   └───────────┘  └─────────────┘
                                       │
                                  ┌────▼─────┐
                                  │ MORE /   │  ← language, share, export/import, reset,
                                  │ SETTINGS │    memories mode, about the groom, passcode
                                  └──────────┘
```

### 4.2 Route table

| Route | Screen | Lazy-loaded | Notes |
| --- | --- | --- | --- |
| `/` | Home | no (core) | Today card, countdown, season strip, next-up |
| `/journey` | Journey | no (core) | Three-track vertical timeline + the 3→7 Dec crunch callout |
| `/calendar` | Calendar | no (core) | Custom month view, Nov–Dec 2026 |
| `/day/:date` | Day Sheet | no (core) | `:date` = `YYYY-MM-DD`. Bottom sheet when opened from Calendar; full page on direct link |
| `/days` | Days index | no (core) | Jump list of the 7 December days + the 4 Chhath days |
| `/checklist` | Master Checklist | no (core) | Filters: day · person · category · status |
| `/items` | Items (by category) | yes | Category grid → item list |
| `/people` | People | yes | Person cards → assigned tasks, items, travel, stay |
| `/travel` | Travel & Stay | yes | Arrival/departure matrix + accommodation matrix |
| `/rituals` | Ritual Guide | yes | Searchable A–Z of every ritual, each with context + family version |
| `/geet` | Geet Book | yes | Songs, when they're sung, who sings them, notes |
| `/prasad` | Prasad & Kitchen | yes | Thekua, kheer, fruit list, who cooks, quantities |
| `/decisions` | Decisions Log | yes | Everything agreed in family conversations, with confidence |
| `/about` | About | yes | Groom profile, the family, this app, credits |
| `/more` | More / Settings | yes | Language, share, export, import, reset, passcode, memories |
| `/memories` | Memories mode | yes | Auto-shown after 13 Dec; album links, stats, geet archive |
| `*` | Not found | no | Friendly "this page has gone to the baraat" + Home link |

### 4.3 Navigation chrome

**Mobile (default, < 768 px)** — fixed bottom tab bar, 5 slots, 44 px min targets, thumb-reachable:

```
┌──────────────────────────────────────────────┐
│  घर   │  Journey  │  Calendar  │  Checklist  │  More  │
│  ⌂    │    ⋮      │    ▦       │     ✓       │   ⋯    │
└──────────────────────────────────────────────┘
```

- Home · Journey · Calendar · Checklist · More
- **Day Sheet, People, Travel, Rituals, Geet, Prasad, Decisions** are reached from within these five (never a 6th tab).
- Active tab = filled icon + track-coloured underline (colour follows the *active track of today*).

**Desktop (≥ 768 px)** — slim top nav bar, same five items + a right-side "Today" pill that shows the current function and jumps to the Day Sheet.

**Floating action button (FAB)** — a single `＋` above the tab bar on every core screen: *Event · Task · Item · Person · Note*. It is the only global action.

### 4.4 The three "tracks" as a first-class IA concept

| Track | id | Colour family | Icon | Date span |
| --- | --- | --- | --- | --- |
| Chhath Puja | `chhath` | saffron → gold, river blue accent | ☀ / sun-over-water | 13–16 Nov 2026 |
| Cousin's wedding | `cousin` | warm red + leaf green | 🪔 / diya | 27 Nov – ~3 Dec 2026 |
| Deepak's wedding | `wedding` | deep maroon + haldi gold + mehndi green | 🌼 / marigold | 7–13 Dec 2026 |

**Tracks as of v1.1 (supersedes the four-track list below):**

| Track | id | Colour family | Icon | Span |
| --- | --- | --- | --- | --- |
| **Home base — Muzaffarpur** | `home` | maroon/ivory, the default backdrop | 🏠 | 5 Nov → 13 Dec |
| Chhath | `chhath` | saffron + river blue | ☀ | 9–16 Nov (prep + four days) |
| Cousin's wedding | `cousin` | warm red + leaf green | 🪔 | 27 Nov matkor (MFP) → 3 Dec return |
| **Delhi excursion** | *inside* `cousin` | dashed red, **not** a track | ⚡ | 30 Nov → 3 Dec, 4 avatars |
| Brother's wedding | `wedding` | deep maroon + haldi gold + mehndi green | 🌼 | 4–13 Dec |
| Travel legs | `travel` | dashed slate | 🚆/✈ | 5 Nov · 30 Nov · 3 Dec |

Consolidation and prep dates (4–6 Dec, and all `suggested` days) use a fourth, visually neutral track: `bridge` (grey-dashed).

Every event, day, checklist item and calendar dot **must carry a track id**. That single field powers: calendar dot colours, theme switching, filter chips, the Journey timeline, and the **presence layer** ("who's away").

## 5 · Screen-by-screen specification

### 5.0 Shared conventions for every screen

Every screen must answer five questions in this order: **Where am I? · What's now? · What's next? · What do I do? · How do I get out?** Concretely, every screen has:

- a **track-tinted header** (colour = active track of that date/section)
- the **today marker** if today falls inside the screen's range
- **skeletons** (not spinners) while data resolves — but since all data is bundled, most screens render instantly
- an **empty state** with one clear action
- **44 × 44 px** minimum touch targets, **16 px** minimum text
- **no horizontal scroll** except intentional swipe carousels (Journey strip, day-carousel in the Day Sheet)
- **URL is the state** — filters, selected tab and open sheet are reflected in the hash so any view can be shared

---

### 5.1 `/` · Home

**Purpose:** J1 + J2 in under 10 seconds.

```
┌──────────────────────────────────────────────┐
│              ॐ  (small, muted)                │
│                                              │
│              घर की शादी                      │   ← Cormorant/Noto Serif Devanagari, large
│        Deepak  ×  Alka                        │   ← from SEASON_META.couple
│      मुज़फ़्फ़रपुर · Muzaffarpur               │
│        07 — 13 दिसंबर 2026                    │
│                                              │
│        ┌────────────────────────┐            │
│        │   75  दिन बाकी          │            │   ← countdown to the FINISH is wrong;
│        │   days to the season   │            │     show BOTH: "next milestone" + "shaadi"
│        └────────────────────────┘            │
│                                              │
│  ─────────  FAMILY SEASON  ─────────         │
│  ☀  छठ         13–16 नवं    ✓ done           │   ← horizontal strip, swipeable
│  🪔  कज़न वेडिंग 27 नवं–3 दिसं ✓  ~ in progress│
│  🌼  भाई की शादी 07–13 दिसं  → 13 Nov gate    │
│                                              │
│  ─────────  TODAY  ─────────                 │
│  ┌────────────────────────────────────────┐  │
│  │ सोमवार · 07 दिसंबर 2026                 │  │   ← or "Next up" + date when today is empty
│  │ 🕉  शिव चर्चा + गीत                     │  │
│  │ सुबह — शिव चर्चा    साम — गीत           │  │
│  │ Checklist ▓▓▓▓▓▓░░░ 12/17  ·  Items 8/10│  │
│  │ [ आज का प्लान देखें → ]                  │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ─────────  NEXT UP  ─────────               │
│  10 दिसंबर · संगीत + मटकोर  (in 3 days)       │
│                                              │
│        ⌂     ⋮      ▦      ✓      ⋯          │
└──────────────────────────────────────────────┘
```

**Content blocks, in order:**

1. **Hero** — blessing glyph ॐ, working title, `Deepak × Salvi`, `मुज़फ़्फ़रपुर · Muzaffarpur`, date range. Decorated with the `MadhubaniBorder` SVG component at 8 % opacity.
2. **Countdown card** — shows **two numbers** because the season has three chapters:
   - primary: days to the **next milestone** (labelled with what it is: "छठ शुरू" / "कज़न की शादी" / "गीत शुरू" / "शादी")
   - secondary: days to **11 Dec (शादी)**, kept small and quiet
   - when today *is* a milestone: the card inverts and says **आज** with the ritual name
3. **Season strip** — three horizontal cards (swipeable, scroll-snap), one per track, each with a state: `done` / `in progress` / `upcoming`. Tapping a card goes to that track's section in Journey.
4. **Today card** — the J1 answer. If today has no event, it becomes **Next up** (with date) and stays visually identical so muscle memory works.
5. **Next up** — one line, the following event after today.
6. **Small print** — "Dates marked ~ are provisional. पंडित जी से पुष्टि करें।"

**Never on Home:** full checklists, travel tables, settings, the groom's CV.

---

### 5.2 `/journey` · Family Season timeline

**Purpose:** the emotional centrepiece. Makes the whole season read as one story (goal G4) — **as of v1.1, rooted in a place rather than a list.**

```
                     ┌─────────────────────────────┐
                     │  मुज़फ़्फ़रपुर — घर         │  Home base, 5 Nov → 13 Dec
                     └──────────────┬──────────────┘
        ┌──────────────┬────────────┼──────────────┬──────────────┐
        ▼              ▼            ▼              ▼              ▼
     5 NOV        9–16 NOV       27 NOV       30 NOV → 3 DEC    4–6 DEC
   चिरंजीव घर     छठ पूजा       कज़न मटकोर      ⚡दिल्ली          तैयारी +
    आए          (घाट, यहीं)     (यहीं)         4 लोग, 1 दिन     आख़िरी ख़रीदारी
                                    │             │
                                    │ 2 दिसं      │ 3 दिसं
                                    │ शादी, दिल्ली │ वापसी
                                    │             │
   ─────────────────────────────────┴─────────────┴──────────────
   7–13 DEC · भाई की शादी · मुज़फ़्फ़रपुर में, 7 दिन
      07 शिव चर्चा+गीत    08 हनुमान आराधना+गीत
      09 हल्दी+मेहंदी+गीत  10 संगीत + मटकोर
      11 शादी 💍          12 टोकरीवाला · विदाई   13 रिसेप्शन 🎉
   ──────────────────────────────────────────────────────────────
```

**Three cards above the rail:**

1. **Home card** — *"मुज़फ़्फ़रपुर · 5 नवंबर – 13 दिसंबर"*, with a **"कौन दूर है?" avatar row** (4 avatars during 30 Nov – 3 Dec, empty otherwise).
2. **Shopping strip** — the four weekends with their priorities, plus the rule line *"पहले ख़रीदें → घर में रखें → दिल्ली → वापसी → सिर्फ़ आख़िरी ख़रीदारी → शादी"* (spec in §5.10).
3. **Excursion band** — the dashed Delhi block with the four names, both legs, and a `toVerify` chip until the tickets are actually booked.

**Interaction:** as the user scrolls, the vertical rule **fills** from top to bottom (a CSS `transform: scaleY()` driven by `IntersectionObserver` or a scroll-linked custom property). Nodes illuminate as they pass. Pure CSS + one observer — no animation library. Respect `prefers-reduced-motion` by making the rule static.

**The "crunch" callout (4 → 7 Dec)** is not decoration: it is the single most important operational fact in the whole season and it links directly to Travel & Stay and to the Decisions Log. Its message is *"the four travellers land on Thursday, the last shopping weekend is Saturday–Sunday, and geet starts Monday."*

**Below the fold:** a small "season maths" block —
`5 Nov घर · 7–8 Nov दीपावली · 13–16 Nov छठ · 21–22 Nov मुख्य ख़रीदारी · 27 Nov मटकोर · 30 Nov–3 Dec दिल्ली · 5–6 Dec आख़िरी ख़रीदारी · 7–13 Dec शादी · 16 Dec से खरमास`.
This quietly explains why the family is running: Chaturmas ended 20 Nov and Kharmas starts 16 Dec.

### 5.3 `/calendar` · Calendar

**Purpose:** the map. See the whole season, spot the crunch, jump anywhere.

**Built by hand — no calendar library.** A general-purpose calendar library costs 15–40 KB gzipped for a two-month static range, and still would not give us track-coloured dots, confidence rings and a bespoke bottom sheet. Hand-rolling is ~4 KB with full control.

```
┌──────────────────────────────────────────────┐
│  ‹   नवंबर 2026  ›   दिसंबर 2026              │   ← two-month pager, no infinite scroll
│                                              │
│  सोम  मंगल बुध  गुरु शुक्र शनि  रवि            │
│   1    2    3    4    5    6    7            │
│   8    9   10   11   12   13   (14)          │
│  15   (16)  17   18   19   20   21           │
│  22   23   24   25   26  (27)  28            │
│  29   30                                     │
│                                              │
│  ── DECEMBER ──                              │
│   1    2    3◐   4~   5~   6~   7●           │
│   8●   9●  10●  11◆  12●  13★                │
│                                              │
│  ● wedding  ◐ cousin  ~ bridge/suggested     │
│  ☀ chhath   ★ reception  ◆ shaadi (major)    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │ TAP A DATE → BOTTOM SHEET            │    │
│  │  09 बुध · हल्दी + मेहंदी + गीत        │    │
│  │  🌼 Haldi   🌿 Mehendi   🎶 Geet     │    │
│  │  10:00 तैयारी · 17:30 मेहंदी · 19:30 गीत│  │
│  │  Checklist 8/12 · Items 6            │    │
│  │  [ पूरा दिन खोलें → ]                 │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

**Visual layers on each date cell** (the "four-layer" idea, kept cheap):

| Layer | Marker | Meaning |
| --- | --- | --- |
| Major | filled ★ / ◆ | Shaadi, Reception, Chhath arghya days |
| Ritual | small ● | Shiv Charcha, Hanuman Aradhana, Haldi, Matkor |
| Operations | ▲ | Travel, stay, shopping, return |
| Memory | ○ (post-event only) | Photos available, story recorded |

**Rules:**
- A cell carries up to **3 dots**, colour-coded by track; more than 3 collapses to `+n`.
- `toVerify` dates render with a **dashed ring**; `suggested` dates with **hollow grey dots** — visible at a glance, so nobody mistakes our scaffolding for a family fact.
- Today's cell has a **pulsing ring** (disabled under `prefers-reduced-motion`) and auto-scrolls into view on mount.
- Chhath days optionally show a **sun-position glyph** (sunrise/sunset) — the one decorative flourish that is culturally load-bearing.
- Swiping between November and December uses `scroll-snap` + native `scroll-behavior`; **no JS animation**.

### 5.4 `/day/:date` · Day Sheet — *the heart of the app*

Opened as a **bottom sheet** from Calendar/Home (drag handle, 92 vh max, drag-to-dismiss) or as a **full page** on direct link / desktop. Swiping left/right moves to the previous/next day **within the same track**.

```
┌──────────────────────────────────────────────┐
│            ═══  (drag handle)                 │
│  बुधवार · 09 दिसंबर 2026        🌼 [track tint]│
│                                              │
│      हल्दी · मेहंदी · गीत                    │
│      Haldi · Mehendi · Geet                  │
│      ✓ CONFIRMED   (chip)                    │
│                                              │
│  ┌─ TIMELINE ─ ITEMS ─ PEOPLE ─ NOTES ─ WHY ─┐│   ← 5 tabs, horizontal, swipeable
│  └──────────────────────────────────────────┘│
│                                              │
│  TAB: TIMELINE                               │
│   10:00  हल्दी की तैयारी            ~ soft    │
│   17:30  मेहंदी                     ~ soft    │
│   19:30  गीत                        ~ soft    │
│   [+ समय जोड़ें]                             │
│                                              │
│  TAB: ITEMS                                  │
│   ☐ हल्दी · सरसों का तेल · बेसन              │
│   ☑ मेहंदी कोन (किसके पास)                   │
│   ☐ पीले कपड़े — सबके लिए                    │
│   ☐ फ़ोटोग्राफ़र / कैमरा                     │
│   ☐ स्पीकर + माइक                            │
│   [+ आइटम जोड़ें]        ▓▓▓▓░░░░ 6/12       │
│                                              │
│  TAB: PEOPLE      Mummy · Papa · Bhaiya ·    │
│                   Bhabhi · Mausi · Mama · …  │
│  TAB: NOTES       "पापा और आप परफ़ॉर्मेंस…"    │
│  TAB: WHY         🌼 Why we do this  →        │
└──────────────────────────────────────────────┘
```

**Tab contents:**

| Tab | Contents | Interactions |
| --- | --- | --- |
| **Timeline** | Ordered rows: time · label · status · 1-line note. Times are **editable placeholders** (`~` marker when unconfirmed) | Tap row → inline edit time/label; `+ Add` adds a row; drag handle reorders |
| **Items** | This day's items from the master item store, grouped by category | Check/uncheck (marigold burst), assign a person, set qty, add new. Shows `done/total` + progress ring |
| **People** | Everyone involved today, with their role ("Mehendi artist", "Photographer", "Leads geet") and contact | Tap → person card (contact, carry-list, assigned tasks) |
| **Notes** | Free text, auto-saved per day. Supports a "voice note later" placeholder | Auto-save on blur, debounce 500 ms |
| **Why** | Two clearly separated blocks: **"हमारे घर में / Our family does this"** (editable) and **"परंपरा / Cultural context"** (read-only) | Link → full Ritual Guide entry |

**The critical split on the "Why" tab** — law P10 made concrete:

```
┌───────────────────────────────────────┐
│  हमारे घर में कैसे होता है              │  ← editable, family's own words
│  "हम लोग हल्दी मेहंदी नौ तारीक को…"      │
│  [✎ Mummy का नोट लिखें]                │
├───────────────────────────────────────┤
│  परंपरा में (सामान्य)                   │  ← read-only, muted, "context" chip
│  Traditionally in Bihar, haldi/ubtan…  │
│  ⚠ यह सामान्य जानकारी है — हमारे घर की   │
│    परंपरा अलग हो सकती है।                │
└───────────────────────────────────────┘
```

**Day-sheet states to design explicitly:**

| State | Rendering |
| --- | --- |
| No event that day | Soft empty: "इस दिन कोई फंक्शन नहीं · आराम" + `+ Add event` |
| `toVerify` day | Amber banner: "इस दिन की तारीख़ अभी तय नहीं — परिवार से पुष्टि करें" + `Add ask` |
| Today | Header switches to **आज** and gains the track accent at full strength |
| Past | Slight desaturation, items remain checkable (people do catch up) |
| Memories mode | A second "असली क्या हुआ / what actually happened" column records real times + photo links beside the plan |

### 5.5 `/checklist` · Master Checklist

**Purpose:** J3. The single place where nothing is forgotten.

```
┌──────────────────────────────────────────────┐
│  ✓ कुल चेकलिस्ट                    ▓▓▓▓▓▓░░ 78%│
│                                              │
│  [सब] [दिन ▾] [व्यक्ति ▾] [श्रेणी ▾] [बाक़ी ▾]│   ← filter chips, single row, scrollable
│                                              │
│  आज · 07 दिसंबर                       12/17   │
│   ☑ पूजा सामग्री — शिव चर्चा                 │
│   ☐ गीत की रिहर्सल                            │
│   ☐ मेहमानों के आने की व्यवस्था               │
│                                              │
│  आने वाले · 09 दिसंबर                   6/12  │
│   ☐ मेहंदी आर्टिस्ट बुक करना                 │
│   ...                                        │
│                                              │
│  बिना दिन के (anytime)                 3/9    │
│   ☐ शगुन/लेन-देन का हिसाब नोटबुक              │
│                                              │
│              ＋                               │
└──────────────────────────────────────────────┘
```

- **Grouping default:** by day (Today first, then upcoming, then `anytime`), because that matches the mental model.
- **Filters** compose: day × person × category × status. Filter state lives in the URL hash so any filtered view is shareable.
- **Categories** (icons, hand-drawn SVG): 🌼 Ritual · 👗 Clothes · 🍽 Food/Prasad · 🎵 Music · 📸 Photo · 🚗 Travel · 🎁 Gifts/Shagun · 🏠 Decor · 🧳 Stay · 📜 Documents · 💰 Money · ⚕ Health.
- **Bulk actions:** mark all visible done, reset day, move day (a high-value "we slipped a day" action).
- **Progress:** one overall ring + per-day bars. The overall ring uses the **soop (woven basket)** motif — the culturally-specific progress metaphor (§7.6).
- **Empty per-filter state:** "इस फ़िल्टर में कुछ नहीं" + "फ़िल्टर हटाएँ".

---

### 5.6 `/items` · Items by category

Items and tasks are the *same entity* in two views. This screen is the **supply-side view**: "what physical things must exist, and where are they?"

```
┌──────────────────────────────────────────────┐
│  श्रेणी से देखें                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│  │ 🌼     │ │ 👗     │ │ 🍽     │ │ 🎵     │ │
│  │ रस्म   │ │ कपड़े  │ │ खाना   │ │ संगीत  │ │
│  │ 18/24  │ │  6/14  │ │ 9/21   │ │ 5/9    │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│  │ 📸     │ │ 🚗     │ │ 🎁     │ │ 🏠     │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ │
│                                              │
│  → श्रेणी खोलें: आइटम · मात्रा · किसके पास ·   │
│     किस दिन चाहिए · ख़रीदा या नहीं            │
└──────────────────────────────────────────────┘
```

Each item row: `☐ name · qty · for-day · with-person · bought? · note`. The **"किसके पास है" (with whom)** field is what actually prevents "who was supposed to bring this?" arguments.

**Ritual Kit templates** (one tap inserts a whole set, fully editable):

| Kit | Inserted for |
| --- | --- |
| Soop / Prasad kit | 14–16 Nov (Chhath) |
| Ghat kit | 15–16 Nov |
| Shiv Charcha kit | 7 Dec |
| Hanuman Aradhana kit | 8 Dec |
| Haldi kit | 9 Dec |
| Mehendi kit | 9 Dec |
| Sangeet kit | 10 Dec |
| Matkor kit | 10 Dec (also reusable for 27 Nov) |
| Baraat / Groom kit | 11 Dec |
| Tokri / Vidai kit | 12 Dec |
| Reception kit | 13 Dec |
| Winter & guest kit | all outdoor events |

---

### 5.7 `/people` · Family, roles and responsibilities

**Purpose:** J6 and J5. Answers "who is doing what, who is bringing what, who is coming when".

```
┌──────────────────────────────────────────────┐
│  परिवार · 24 लोग · 4 समूह                    │
│                                              │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ ⬤  Mummy      │  │ ⬤  Papa       │          │
│  │ कार्य 6 · सामान 3│  │ कार्य 4 · सामान 2│       │
│  └──────────────┘  └──────────────┘          │
│  ...                                         │
│                                              │
│  → व्यक्ति खोलें:                            │
│     भूमिका · फ़ोन · कार्य · लाने वाला सामान ·  │
│     आना/जाना · ठहरना · नोट                    │
└──────────────────────────────────────────────┘
```

Each person record: `name · relation · role(s) · phone · duties[] · carries[] · arrives · departs · staying · notes · who they travel with`.

**Derived answers this screen must produce automatically:**

- "किसके पास सबसे ज़्यादा काम है?" (load imbalance warning)
- "किसका कोई काम नहीं है?" (nobody wants to be useless at a family wedding)
- "इस व्यक्ति को क्या लाना है?" (the carry-list — also rendered on the person's own shared link)
- "कौन कब आ रहा है और कहाँ ठहरेगा?" (feeds Travel & Stay)

Device-agnostic rule: **a person card is the only place a phone number is shown**, and it is rendered as a `tel:` link plus a WhatsApp deep link (`https://wa.me/<number>`), both one tap.

### 5.8 `/travel` · Travel & Stay

**Purpose:** J5. This is where the transcript's real value shows up — it is *full* of travel discussion and neither source draft turned any of it into structure.

> **v1.1 correction:** as of the corrected calendar the travel screen has **exactly three legs** to pre-fill, and **one excursion** that four people share — not a rolling set of unknown journeys. See §5.10 for the shopping layer that interacts with it.

```
┌──────────────────────────────────────────────┐
│  🚗 सफ़र और ठहरना                             │
│                                              │
│  ⚠ दिसंबर में कोहरा — ट्रेन/फ़्लाइट लेट हो सकती  │
│    जान है। बफ़र रखें। (Muzaffarpur दिसंबर:     │
│    अवकाश 10.8°C, दिन 25.3°C, बारिश ~5mm)      │
│                                              │
│  आना (Arrivals)                              │
│  व्यक्ति   से        रवाना    पहुँचना   मोड    │
│  ────────────────────────────────────────────│
│  [      ]  [       ]  [    ]   [    ]  [▾]   │
│  ...                                         │
│                                              │
│  जाना (Departures)                           │
│  व्यक्ति   कब       कहाँ जाना  किसके साथ       │
│  ────────────────────────────────────────────│
│                                              │
│  ठहरना (Stay)                                │
│  व्यक्ति/समूह  आगमन  प्रस्थान  जगह (घर/होटल)  │
│  ────────────────────────────────────────────│
│                                              │
│  पिकअप · गाड़ियाँ · सामान · इमरजेंसी नंबर       │
└──────────────────────────────────────────────┘
```

**Two rows in this screen that exist nowhere else in the app:**

1. **The crunch row** — `3 Dec return → 7 Dec geet`, with an automatic warning: *"सिर्फ़ 4 दिन. कोहरे का बफ़र + रिहर्सल का समय जोड़ें."*
2. **The winter buffer** — every travel row carries `expected arrival` **and** `actual arrival`, and any event starting within 6 h of an arrival is auto-flagged `🚩 tight`.

**"How to reach Muzaffarpur" card** (read-only reference, `context` chip):

| Mode | Detail |
| --- | --- |
| 🚆 Train | **Muzaffarpur Junction (MFP)** — a major North Bihar railhead and the family's likely default. Book early; December fog causes delays |
| ✈️ Flight | The city's own airport is not a normal commercial option — use **Patna (PAT)** or **Darbhanga (DBR)**, then ~2–3 h by road |
| 🚗 Car | Road via the NH 19 / NH 57 / NH 77 / NH 227 corridor |
| 🚌 Bus | Regular Patna ↔ Muzaffarpur services |

**Design detail that matters:** the travel screen must be readable by an outstation relative who has never used the app. So each arrival row is also renderable as a **single shareable text snippet** ("Mummy · 9 Dec · 6:40 am · MFP · Papa picking up") that can be pasted into WhatsApp by tapping a copy button. No screenshot required.

### 5.10 `/shopping` · Shopping & availability (added in v1.1)

**Purpose:** the answer to *"when am I actually free to shop?"* — for a working family in one city, that is the binding constraint, and no other screen holds it.

```
┌──────────────────────────────────────────────┐
│  छोट ख़रीदारी का कैलेंडर                     │
│                                              │
│  नियम: पहले ख़रीदें → घर में रखें → दिल्ली →    │
│        वापसी → सिर्फ़ आख़िरी ख़रीदारी → शादी   │
│        सामान ख़रीदने की आख़िरी तारीख़: 22 नवंबर │
│                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐│
│  │ 07–08 नवं  │ │ 14–15 नवं  │ │ 21–22 नवं  ││
│  │ 🟢 जल्दी   │ │ 🔴 नहीं    │ │ 🟢 मुख्य   ││
│  │ थोक + दिवाली│ │  छठ वीकेंड │ │ असली शॉपिंग││
│  └────────────┘ └────────────┘ └────────────┘│
│  ┌────────────┐ ┌────────────┐               │
│  │ 28–29 नवं  │ │ 05–06 दिसं │  [सामान जोड़ें]│
│  │ 🟡 ज़रूरी   │ │ 🔴 आख़िरी  │               │
│  │ दिल्ली + बचा│ │  सब यहीं  │               │
│  └────────────┘ └────────────┘               │
│                                              │
│  ☑ बाक़ी ख़रीदारी (48)          ▓▓▓▓▓▓░░ 73%   │
│  [बिना वीकेंड वाले] [श्रेणी ▾] [ज़रूरी ▾]      │
└──────────────────────────────────────────────┘
```

**Why it is its own screen and not just a filter:**

| Reason | Detail |
| --- | --- |
| It is a **date-range problem**, not a date problem | Each weekend is a *range* with a priority, and a priority determines what you buy |
| It is the **first thing used in the real season** | Shopping weekend #1 is 7–8 November — *before* Chhath even begins |
| It changes **which checklist items are due when** | Anything tagged with a shopping weekend is pulled forward; items with no weekend are flagged at risk |
| It is the **reality check on scope** | Four weekends, one blocked by Chhath, one partly consumed by Diwali — the app can say *"you have three and a half weekends, not five"* |

**Interactions:**
- Tap a weekend → Checklist filtered to that weekend's `dueByWeekend` items.
- Items are assignee-tagged as before, and can be marked **bought** separately from **packed** (two states; the Delhi weekend requires both).
- The **Diwali flag** on weekend #1 is a soft warning, not a blocker.
- The **22 Nov deadline** is a persistent, non-dismissible line — the one date the app repeats everywhere.

---

### 5.9 Reference screens (lazy-loaded)

#### `/rituals` · Ritual Guide

- Search box (Devanagari + Roman + English), A–Z list, one entry per ritual.
- Each entry structure:
  `name (Hindi + Roman)` · `when it normally happens` · `who performs it` · `what's needed` · **"परंपरा में / Traditionally"** paragraph · **`⚠ यह सामान्य जानकारी है`** disclaimer · **"हमारे घर में / Our family"** editable block · optional **elders' notes**.
- Seeded entries: नहाय-खाय · खरना · संध्या अर्घ्य · उषा अर्घ्य · पारण · गीत · शिव चर्चा · हनुमान आराधना · हल्दी (हल्दी कुटाई) · मेहंदी · संगीत · मटकोर (मड़वा मटकोर) · मड़वा / मंडप · टोकरीवाला · रिश्तेदार विदाई · विदाई · द्वार पूजा · परिच्छवन · जयमाला · कन्यादान · सप्तपदी / भँवर · सिंदूर दान · कोहबर · चौथारी · डोला / गृहप्रवेश · रोका/चेका · फलदान · तिलक · इमली घोटाई.
- Every entry ships with an **empty** family block — the app never claims a family practice.

#### `/geet` · Geet Book

- Song list: `title (Devanagari) · when sung · who sings · language · lyrics · meaning · family note · audio link`.
- Order of preference for sources: **the family's own audio first** (the existing m4a and any future recordings), documented regional songs second, marked `context`.
- Groups: छठ गीत · मटकोर गीत · हल्दी/मेहंदी गीत · विवाह मंगल गीत · विदाई गीत · संगीत प्रस्तुति.
- **Why this screen matters:** Bihar's ceremonial songs are described in cultural sources as orally transmitted traditions, and the family's own recording is more valuable than any downloaded song. This is the archive, not a playlist.

#### `/prasad` · Prasad & Kitchen

- Chhath block: thekua, gud ki kheer, pua, arsa, fruit list, quantities, **who cooks**, **when to buy ingredients**, free-text "घर की विधि".
- Wedding block: documented Bihar wedding feast staples — litti chokha, khaja, thekua, anarsa, pua, makhana — with a **satvik / non-veg** flag, because families differ sharply here.
- Never auto-assume a menu. Everything is a template the family edits.

#### `/decisions` · Decisions Log

The quietest, most useful screen. Every settled and unsettled item from the family conversations becomes a row:

```
✓ गीत 7 दिसंबर से, 5 दिन (शादी का दिन शामिल)           confirmed
✓ शिव चर्चा सुबह, गीत शाम                               tentative
✓ हल्दी + मेहंदी 9 तारीख़                                confirmed
✓ संगीत + मटकोर 10 तारीख़                                confirmed
~ 10 दिसंबर का क्रम: सुबह संगीत, शाम मटकोर                tentative
✓ रिसेप्शन 13 दिसंबर (रविवार) — बारात देर रात लौटेगी      confirmed
? कज़न की शादी — बारात का दिन तय नहीं                     toVerify
? 30 नवंबर रात या 1 दिसंबर — रवाना कब?                   toVerify
? टोकरीवाला में असल में क्या होता है?                     toVerify
? कौन सा घाट, कौन व्रत रखेगा                              toVerify
? विवाह मुहूर्त (पंडित जी से)                             toVerify
```

Each row carries `source` (which conversation / date), `confidence`, and an **owner** ("ask Mummy"). Flipping a `?` to `✓` updates the calendar, Journey and Day Sheets automatically — one edit, whole-app consistency.

#### `/about` · About

- **Meet the groom:** **Dr. Deepak Kumar × Alka** — a warm card, a single link to the existing profile (https://doctors-profile-chi.vercel.app/), framed as *"आज वे डॉक्टर नहीं, दूल्हा हैं।"* No CV copied, no professional claims invented. A second, smaller card reads **"गुवाव × अल्का · 2 दिसंबर, दिल्ली"** — the cousin's wedding, since it is the season's other celebration.
- **This family:** **Chiranjeev** (Senior AI engineer) · **Komal** (Senior AI engineer) · **Gauri Shankar** (Govt. Teacher) · **Pramila Kumari** (Govt. Teacher) · Nani · **Dr. Deepak Kumar** (Doctor, groom) — roles and professions rendered as given, editable from `SEASON_META.family` only.
- **Our place:** Muzaffarpur · Tirhut · North Bihar · Bajjika cultural zone · *"Land of Litchi"* · *"Capital of North Bihar"* · the Budhi Gandak · Baba Garibnath Mandir as a cultural anchor. All marked `context`.
- **This app:** who built it, why, that data lives locally in the browser, and how to export/share.
- **Credits & standing disclaimer:** sources listed, plus *"परंपरा हर परिवार में अलग होती है — पंडित जी और बड़ों से पुष्टि करें।"*

#### `/more` · More / Settings

`भाषा (EN / हिं)` · Share this plan · Export JSON · Import JSON · Reset to official version · Memories mode · Passcode · Install app · Storage used · What's new.

#### `/memories` · Memories mode

Auto-activates after 13 Dec 2026 (or manually via toggle). Changes:

| Before | After |
| --- | --- |
| Today card | "Season complete" card |
| Countdown | `7 दिन · 14 रस्में · 42 लोग · 17 गीत · 1 शुरुआत` |
| Day Timeline | Planned times **plus** recorded actual times |
| Notes | Family Story entries + photo/album links per day |
| Checklist | Read-only archive of what was actually done |
| Geet Book | Promoted to the home screen |

## 6 · Design system

Everything here must be expressible in **plain CSS custom properties + inline SVG**. No UI kit, no icon package, no animation library, no image files.

### 6.1 Colour

**Base palette (fixed, always present):**

| Token | Hex | Use |
| --- | --- | --- |
| `--ivory` | `#FBF8F1` | Page background |
| `--ivory-deep` | `#F4EEE2` | Cards, sheets, alternating rows |
| `--ink` | `#292522` | Primary text |
| `--ink-soft` | `#5B534A` | Secondary text |
| `--line` | `#E3D9C6` | Hairlines, dividers |
| `--maroon` | `#7A2633` | Primary brand, headings, major accents |
| `--sindoor` | `#B33A3A` | Weddings, alerts-soft, vidai |
| `--haldi` | `#D89B32` | Accents, haldi day, highlights |
| `--marigold` | `#E9A93B` | Rewards, celebration, completion |
| `--mehendi` | `#5C7350` | Secondary accent, nature/leaf motifs, "done" states |
| `--river` | `#3E6B8A` | Chhath only — water, dawn, ghat |
| `--saffron` | `#E07B39` | Chhath sun / sunrise-sunset |

**Track tints (the theme shifts with the season):**

| Track / phase | Background tint | Accent | Notes |
| --- | --- | --- | --- |
| Chhath (`chhath`) | `#FFF6E8` | `--saffron`, `--river` | Sun/water motifs, cooler text |
| Interlude (quiet) | `--ivory` | `--maroon` (muted) | Minimal decoration |
| Cousin's wedding (`cousin`) | `#FDF1EC` | `--sindoor`, `--mehendi` | Diya motif |
| Bridge / crunch | `#F3F1EC` | `--ink-soft` + dashed borders | Practical, warning-toned |
| Deepak's wedding (`wedding`) | `#FFF9EF` | `--maroon`, `--haldi` | Full palette |
| Epilogue / memories | `#FCFAF4` | `--haldi` (soft), champagne | Slower motion |

**Per-day tints (within the wedding track)** — the sequence should be *visible* when scrolling the Days index:

| Day | Tint | Reason |
| --- | --- | --- |
| 7 Dec | soft saffron `#FFF4E4` | devotional opening |
| 8 Dec | soft saffron-orange `#FFF0DE` | devotional |
| 9 Dec | yellow-green `#FAF7E2` | haldi + mehendi |
| 10 Dec | warm gold `#FDF3E0` | sangeet + matkor |
| 11 Dec | red-gold `#FCEEE9` | shaadi — the peak |
| 12 Dec | soft green-grey `#F2F4EE` | return, vidai |
| 13 Dec | champagne `#FBF6EC` | reception, closing |

**Semantic colours for confidence chips:**

| State | Text/border | Background |
| --- | --- | --- |
| `confirmed` | `--mehendi` / `--mehendi` | `#EFF3EA` |
| `tentative` | `--haldi` / `--haldi` (dotted) | `#FDF5E4` |
| `toVerify` | `#B4781A` / `#E0B269` | `#FFF8E7` + ⚠ |
| `suggested` | `--ink-soft` / `--line` | `#F4F2EE` (italic) |
| `context` | `--ink-soft` / `--line` | transparent, muted |

**Rules:** never use pure black `#000` or pure white `#fff`. Never use colour alone to signal confidence — always pair with a shape, glyph or dotted border (colour-blind safety).

### 6.2 Typography

Exactly **two families**, self-hosted, subsetted, `font-display: swap`:

| Role | Family | Weights | Notes |
| --- | --- | --- | --- |
| Display / headings / ritual names | **Cormorant Garamond** (or Noto Serif Display) | 500, 600 | Elegant, wedding-appropriate |
| Devanagari display | **Noto Serif Devanagari** | 500, 600 | Pairs cleanly with the above; required — Devanagari must render beautifully, not "fall back" |
| UI / body | **Inter** or **DM Sans** | 400, 500, 600 | Neutral, mobile-legible |
| Devanagari body | Devanagari subset of the body family (or **Noto Sans Devanagari**) | 400, 500 | |

Constraints:
- Self-host **woff2 only**, subset to the Devanagari + Latin glyphs actually used (a subsetter step in the build).
- **Two families maximum** (each with a Devanagari companion) — that is already 4 files; do not add a third.
- Metric-compatible fallback stack to prevent layout shift: `'Inter', -apple-system, 'Segoe UI', Roboto, 'Noto Sans Devanagari', sans-serif`.
- Base size 16 px; body line-height 1.6; never below 14 px for anything a person over 45 must read.
- **Hindi numerals vs Latin numerals:** keep Latin digits for times/dates (unambiguous), use Devanagari for headings and ritual names.

### 6.3 Type scale

| Token | Size / line-height | Use |
| --- | --- | --- |
| `--fs-hero` | 40 / 1.1 (mobile 32) | Home title |
| `--fs-h1` | 28 / 1.2 | Screen titles |
| `--fs-h2` | 22 / 1.3 | Day titles, ritual names |
| `--fs-h3` | 18 / 1.35 | Section heads, person names |
| `--fs-body` | 16 / 1.6 | Default |
| `--fs-small` | 14 / 1.5 | Meta, chips, captions |
| `--fs-micro` | 12 / 1.4 | Timestamps, footnotes |

### 6.4 Spacing, radius, elevation

- **Spacing scale (4 px base):** `4 8 12 16 20 24 32 40 48 64`. Only these values.
- **Radius:** `--r-sm 8px`, `--r-md 14px`, `--r-lg 20px`, `--r-pill 999px`. Bottom sheets use `--r-lg` on top corners only.
- **Elevation:** three levels only, all soft and warm (tinted with maroon, not grey):
  - `--e1: 0 1px 2px rgba(122,38,51,.06)`
  - `--e2: 0 4px 14px rgba(122,38,51,.08)`
  - `--e3: 0 12px 32px rgba(122,38,51,.12)` (sheets, FAB)
- **Layout width:** content max 720 px on desktop, centred; sheets max 560 px.
- **Safe areas:** honour `env(safe-area-inset-bottom)` for the tab bar and FAB (iPhone notch/home bar).

### 6.5 Motifs, icons and illustration (all inline SVG)

Hand-drawn as React components, `currentColor`-driven, no external files, no sprite sheet. Budget: **≤ 12 KB of SVG total**.

**Motif components (decorative):**

| Component | Where used |
| --- | --- |
| `MadhubaniBorder` | Home hero, About, section dividers (Mithila-style line work used as *influence*) |
| `FolkRule` | Thin ornamental divider between sections |
| `SunArghya` | Chhath screens — sun over water with ripples |
| `Marigold` | Section corners, completion celebrations |
| `Diya` | Header ornaments, cousin-wedding track |
| `Lotus` | Ritual Guide, Prasad |
| `BananaLeaf` / `MangoLeaf` | Mandap / preparation blocks |
| `SoopBasket` | The progress-ring motif (see below) |
| `Peacock` | Reception, About (used sparingly) |
| `ShivaTrishul` | Shiv Charcha day |
| `HanumanGada` | Hanuman Aradhana day |
| `MehendiHand` | Mehendi day |
| `BaraatGhodi` | Shaadi day |
| `TokriBasket` | Tokriwala / vidai |
| `Train` / `Plane` | Travel screen modes |

**Icon set (functional, 20 × 20, 1.6 px stroke):** home · journey · calendar · checklist · more · plus · check · chevron · search · filter · share · download · upload · edit · trash · bell · phone · whatsapp · location · clock · person · users · note · warning · info · lock · sun · sunrise · sunset · rupee · gift · camera · music · mic · bag · box.

**The soop progress motif** — the culturally-specific replacement for a generic progress bar:

```
   ┌──────────────┐
   │ ██████████   │   ← woven basket weave, filled proportionally
   │ ████████     │
   │ █████        │      WEDDING PREP
   │              │          82%
   └──────────────┘
```

Rendered as a single SVG with a `clipPath` — the fill height is a CSS custom property. ~600 bytes, and it ties Chhath, Bihar craft (bamboo/sikki work) and the family together in one visual idea.

### 6.6 Motion

Motion is **feedback, not decoration**. Budget: no animation library, no `requestAnimationFrame` loops, only CSS transitions and keyframes.

| Interaction | Motion | Duration / easing | Reduced-motion fallback |
| --- | --- | --- | --- |
| Bottom sheet open | translateY(100%) → 0 + backdrop fade | 260 ms `cubic-bezier(.22,1,.36,1)` | instant |
| Sheet dismiss (drag) | follow finger, snap | 200 ms | instant |
| Tab switch in Day Sheet | horizontal translate of the panel | 200 ms | instant |
| Item tick | checkmark draws (stroke-dashoffset) + **marigold petal burst** (6–8 petals, CSS keyframes) | 420 ms | checkmark only, no burst |
| Day card enter | fade + 8 px translateY, staggered 30 ms | 220 ms | instant |
| Journey rule fill | `scaleY` driven by `IntersectionObserver` | scroll-linked | static rule |
| Countdown number change | subtle fade-swap (no flip animation) | 180 ms | instant |
| Progress ring / soop fill | width/height transition | 400 ms ease-out | instant |
| Confetti at 100 % of a day | once per day only, dismissible | 900 ms | none |
| Page transitions | **none** — instant route change | — | — |

Every motion must be wrapped in `@media (prefers-reduced-motion: reduce)` overrides, and must never block interaction.

### 6.7 Visual tone rules

- **Warm and personal, never corporate.** No "dashboard", no "task management", no toasts saying "Saved successfully" — say *"ठीक है, लिख लिया"* / "noted".
- **Restrained ornament.** Motifs are 8–12 % opacity backgrounds; only one "hero" motif per screen. Over-decoration is the fastest way to look like a template.
- **Whitespace before decoration.** If a screen feels empty, add air, not flowers.
- **Regional specificity.** Bajjika/North-Bihar first; Mithila line work as *influence only* (see `wedding-context-and-reasoning.md` §11.2 for why this distinction matters).
- **Tone-matching with the groom's profile site.** We cannot read its palette from the outside (it is a client-rendered SPA returning an 820-byte shell). **Decision needed:** the user should share 2–3 hex codes or a screenshot from https://doctors-profile-chi.vercel.app/ so the two sites read as one family. Until then, the palette in §6.1 stands.

## 7 · Data & state architecture

### 7.1 Two stores, always separate

```
┌──────────────────────────────────────────────────────────────┐
│  OFFICIAL SEED  (read-only, shipped in the bundle)           │
│  src/data/*.js  ·  versioned  ·  immutable at runtime        │
│  → every ritual, date, status, template, explainer           │
└──────────────────────────┬───────────────────────────────────┘
                           │  deep-merged on first load
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  FAMILY STATE  (read-write, localStorage)                    │
│  wedding-app-v1  ·  { version, updatedAt, patch }            │
│  → only the DELTA: checked items, added items, times filled,  │
│    notes, people, travel rows, decisions flipped to ✓         │
└──────────────────────────────────────────────────────────────┘
```

**Why the delta model and not "copy the whole seed into storage":**

1. A seed update (we fix a date, add a ritual) reaches every device **without wiping family edits**.
2. Storage stays tiny (a few KB instead of tens of KB).
3. "Reset to official" becomes trivial and safe.
4. Import/export files are small enough to paste into WhatsApp if needed.

Merge rules, in order of precedence: **family edit > seed**. Deletions are recorded as tombstones (`{id, deleted:true}`) so a seed item can be removed without it reappearing.

### 7.2 Entity model

| Entity | Key fields |
| --- | --- |
| `event` | `id · date · endDate? · track · kind · title{en,hi} · subtitle{en,hi} · status · slots[{time,label,status}] · ritualIds[] · kitIds[] · dayTint · openQuestions[] · notes` |
| `cluster` | `id · title · startDate · endDate · status · known[]{date,label,status} · unknownBlock{label} · returnDate · questions[]` (Track B needs this) |
| `item` | `id · name{en,hi} · category · dayIds[] · qty · unit · ownerId? · bought · notes · track · templateId?` |
| `task` | `id · title{en,hi} · dayId? · category · ownerId? · done · dueBeforeEvent? · bufferMinutes? · priority` |
| `person` | `id · name · relation{en,hi} · roleIds[] · phone? · carries[] · dutyIds[] · arrives? · departs? · staying? · travelsWith? · notes` |
| `ritual` | `id · name{en,hi,roman} · when · who · needs[] · contextText{en,hi} · familyText{en,hi} · eldersNotes[] · sources[]` |
| `song` | `id · title · language · occasions[] · singers · lyrics? · meaning{en,hi} · familyNote · audioUrl? · source` |
| `travelLeg` | `id · personIds[] · from · to · mode · departAt · arriveExpected · arriveActual? · pickupBy? · vehicle? · notes` |
| `stay` | `id · personIds[] · place · type(home/hotel/relative) · from · to · notes` |
| `decision` | `id · text{en,hi} · status · owner · sourceConversation · sourceDate · derivedEventIds[]` |
| `kit` | `id · name{en,hi} · forDay · items[]` (ritual kits / templates) |
| `question` | `id · text{en,hi} · owner · answer? · linkedEventId?` |

**Naming rule:** every user-visible string is `{en, hi}` (or `{en, hi, roman}` for ritual names). Addresses, phone numbers, album URLs, notes and lyrics are plain strings.

### 7.3 Where the seed data lives

```
src/data/
├── journey.js        tracks, phases, narrative copy, crunch callout
├── events.js         all days 13 Nov – 13 Dec, with statuses and slots
├── clusters.js       the cousin-wedding cluster with unknown interior
├── chhath.js         four days, ghat plan, prasad kit
├── kits.js           ritual kit templates (haldi, matkor, sangeet, baraat…)
├── rituals.js        Ritual Guide content (context only, family block empty)
├── songs.js          Geet Book seeds (family audio first)
├── people.js         placeholder structure — starts nearly empty
├── decisions.js      the decisions log rows from the transcript decode
├── questions.js      open questions to ask the family
└── strings.js        the bilingual copy deck (§21)
```

**Hard rule:** `people.js`, `decisions.js` and `questions.js` may ship with structure but **must not invent names, phone numbers or answers**. Placeholders render as "जोड़ें / add".

### 7.4 Persistence API (one small module)

```
storage.js
  KEY              = 'ghar-ki-shaadi:v1'
  load()           → { ok, patch, error }
  save(patch)      → debounced 300 ms, try/catch on QuotaExceeded
  export()         → 'ghar-ki-shaadi-<YYYY-MM-DD>.json'
  import(file)     → validate schema → PREVIEW diff → confirm → merge
  reset()          → clear localStorage, reload seed
  migrate(fromVer) → forward-only migration table
  quotaGuard()     → if > 2 MB used, warn + offer export
```

**Rules:**
- **Never** write on every keystroke. Debounce 300 ms; flush on `visibilitychange: hidden` and on `pagehide`.
- **Never** auto-merge two states. Import always shows: `+12 new · ~7 changed · -0 removed` with a Confirmed/Cancel choice.
- **Always** keep a single **pre-import backup snapshot** (one slot) so a bad import is undoable.
- Corruption safety: if `JSON.parse` fails, keep the bad payload under `…:v1:corrupt` for debugging and boot from seed with a gentle banner.

### 7.5 Share link (the "no-backend collaboration" trick)

```
https://<app>/#/share?d=<base64url(deflate(patch))>&v=1&n=<short-label>
```

- Encode: `patch` → JSON → `CompressionStream('deflate-raw')` (native, no dependency) → base64url.
- Typical delta compresses to **a few hundred characters** — short enough for WhatsApp.
- On open: `Share preview` screen shows *"This will replace your local plan. Current: X items done · Incoming: Y"* → **Merge / Replace / Cancel**.
- Labels: `n=planner` / `n=mummy-phone` so people know whose version they are opening.
- **Fallback for very old browsers:** if `CompressionStream` is missing, offer the JSON file export instead (feature-detect, never crash).

### 7.6 Derived logic (pure functions — no side effects, easy to unit test)

| # | Function | Used by | Rule |
| --- | --- | --- | --- |
| L1 | `getToday(now, events)` | Home | Returns today's event, else `null` |
| L2 | `getNextUp(now, events)` | Home, Journey | Next event with `date >= today`; if today has one, show the one after |
| L3 | `getCountdown(now, events)` | Home | **Two values**: to next milestone, and to 11 Dec |
| L4 | `getSeasonPhase(now)` | Theme | `chhath` / `interlude` / `cousin` / `bridge` / `wedding` / `memories` |
| L5 | `getConflicts(state)` | Day Sheet, Journey, Calendar | Same-day blocks overlapping beyond a threshold; matkor-vs-sangeet on 10 Dec; any ceremony inside the crunch window |
| L6 | `getTightArrivals(state)` | Travel | Any event starting within 6 h of an `arriveExpected` |
| L7 | `getDayProgress(date, state)` | Checklist, Calendar | `done/total` for items + tasks of that date |
| L8 | `getOverallProgress(state)` | Home, Checklist | Weighted: ritual items count double |
| L9 | `getUnanswered()` | Decisions, Home badge | All `question` rows + `decision` rows with status `toVerify` |
| L10 | `getPersonLoad(personId, state)` | People | Count of duties + carries; flag top and zero |
| L11 | `getCarryList(personId, state)` | People, share snippet | Plain-text list for WhatsApp |
| L12 | `getRitualFor(id)` | Ritual Guide, Day Sheet | Lookup + split into `familyText` / `contextText` |
| L13 | `getPrepWindow(now)` | Journey, Home | Days remaining until the next open question becomes urgent |
| L14 | `toICS(events, state)` | `.ics` export | Only `confirmed` + user-confirmed timings; all-day events otherwise |
| L15 | `getMemoriesStats(state)` | Memories mode | Days, rituals, people, songs, items, photos linked |

**Why pure functions matter here:** this app has no test framework budget for UI, but it has a *large* amount of date logic. Putting all of it in pure, dependency-free functions under `src/utils/` means it can be unit-tested in seconds and reasoned about by reading.

### 7.7 Conflict detection rules (explicit, so they're not vague)

| Rule | Trigger | Message shown |
| --- | --- | --- |
| C1 | Two blocks on the same day overlap by > 30 min | "⏱ समय टकरा रहा है" with both blocks named |
| C2 | ≥ 3 events on one day with no gap ≥ 60 min | "इस दिन बहुत भरा है — ब्रेक रखें" |
| C3 | Any ceremony scheduled within 6 h of an arrival | "🚩 आने और फंक्शन के बीच बहुत कम समय" |
| C4 | Travel day immediately followed by a function next morning | "😴 आराम का समय नहीं है" |
| C5 | 3 Dec → 7 Dec window has no prep day marked | "रिहर्सल/तैयारी का दिन बाक़ी है" |
| C6 | Outdoor event on a `toVerify` venue after 20:00 in December | "❄ रात ठंडी होगी — शॉल/हीटर" |
| C7 | An event still `toVerify` and less than 14 days away | "पुष्टि बाक़ी — 14 दिन से कम" |

Conflicts are **inline and quiet** — a small amber row, never a modal, and dismissible with "ठीक है" (remembered per session).

## 8 · Tech stack: decisions, rejections and budgets

### 8.1 Chosen stack

| Layer | Choice | Why |
| --- | --- | --- |
| Build | **Vite** | Fastest dev server, tiny production output, first-class Vercel support. Already the default in the ecosystem; no config needed |
| UI | **React 18/19** | Requested. Small enough, and its concurrent features are irrelevant-but-harmless here — we mostly need components + state |
| Language | **JavaScript (JSX)** | A single-developer family app. TypeScript adds build config and ceremony for little payoff at this size. *If* the team grows or the data model gets hairy, migrate `src/utils` and `src/data` first — they're pure and easy to type |
| Styling | **Plain CSS** with custom properties + one `global.css` + per-component CSS files (or CSS Modules) | Zero runtime, zero dependency, full control over the cultural design system. Tailwind would add a build step and a mental model for no benefit at this scale |
| Routing | **HashRouter** (or a ~40-line hand-rolled hash router) | The app must work when opened from a file/exported/offline, and share links need to carry state in the hash. `BrowserRouter` + a rewrite is also fine on Vercel, but hash routing removes one deployment dependency |
| State | **React `useState` + `useReducer` in one `useWeddingStore` hook, exposed via Context** | No Redux, no Zustand, no Jotai. One store, ~150 lines, fully testable |
| Persistence | **localStorage** (+ one backup slot) | Requirement: frontend-only |
| PWA | **Hand-written `sw.js` + `manifest.webmanifest`** | `vite-plugin-pwa` is convenient but pulls Workbox (~20–30 KB in the SW, plus a plugin). A ~60-line hand-written precache SW is enough for one app shell with a fixed version |
| Dates | **None — use `Intl.DateTimeFormat` + `Temporal`-free plain `Date`** for a fixed 2026 range | `date-fns` is ~7 KB gzipped for what we need (formatting, weekday names, day differences). `Intl` handles Devanagari weekday/month names natively and costs 0 KB |
| Icons/motifs | **Hand-written inline SVG components** | Zero KB of library, and no icon library has a soop or a doli |
| Fonts | **2 families, self-hosted woff2, subsetted** | See §6.2 |
| Compression (share links) | **Native `CompressionStream('deflate-raw')`** | 0 KB, supported in all current browsers; feature-detect with a file-export fallback |
| Tests | **Vitest** (utils only) | Fast, zero-config with Vite |

### 8.2 Rejected alternatives (and why — so we don't revisit)

| Rejected | Why |
| --- | --- |
| Full calendar library (FullCalendar, react-big-calendar, react-calendar) | 15–40 KB gz for a static two-month range; cannot render our confidence rings or track dots; we need ~4 KB of logic instead |
| `date-fns` / `dayjs` / `luxon` | ~7–20 KB gz for a fixed 2026 date range. `Intl` covers formatting and Devanagari names |
| Tailwind CSS | Adds a build-time dependency and a different mental model for a single-designer app; we need very few utility patterns and a lot of bespoke design |
| `vite-plugin-pwa` / Workbox | Powerful, but ~20–30 KB and a plugin config surface for what is a 60-line precache |
| Framer Motion / react-spring / GSAP | 15–45 KB gz for six transitions that CSS does for free |
| Zustand / Redux / Jotai | One store, one consumer tree. Context + `useReducer` is enough and removable |
| Supabase / Firebase (v1) | Explicit non-goal; adds auth, network failure modes and a privacy surface. Deferred to Phase 4 only if share-links prove insufficient |
| Google Fonts CDN | Extra DNS + a third-party request + no subsetting control; self-hosting is faster and works offline |
| Any CSS-in-JS runtime | Runtime cost and bundle cost for zero benefit here |
| TypeScript (v1) | Real benefit, wrong trade-off at one-developer scale and for speed to Chhath. Revisit post-13 Dec |

### 8.3 Bundle budget (enforced, not aspirational)

| Asset | Budget |
| --- | --- |
| React + ReactDOM (production, gz) | ~45 KB |
| App code (gz) | ≤ 20 KB |
| CSS (gz) | ≤ 6 KB |
| SVG icons + motifs (inline, gz) | ≤ 4 KB |
| Seed data (gz) | ≤ 3 KB |
| **Total first load (JS + CSS)** | **≤ 80 KB gz**, stretch target 60 KB |
| Fonts (2 families × 2 Devanagari companions, woff2 subsetted) | ≤ 90 KB total, **preloaded**, cached forever |
| Service worker | ≤ 2 KB |
| Images | **0** (no raster assets at all — one small favicon/manifest icon set only; optionally a `maskable` icon ≤ 5 KB) |

Enforcement: a `size-limit`-style check (or simply `du -b dist/assets/*` in the build script) that **fails the build** if the gz total exceeds 80 KB. Do not let the budget rot silently.

## 9 · Project structure

```
wedding_web/                      ← the app lives here (the folder already exists)
├── index.html                    ← the ONLY html file; inlined critical CSS + font preloads
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js                     ← hand-written precache service worker
│   ├── favicon.svg               ← one SVG favicon (marigold/lotus mark)
│   └── icons/                    ← 2–3 PNG sizes for installability (maskable + any)
├── src/
│   ├── main.jsx                  ← entry: mounts <App/>, registers SW, boots store
│   ├── App.jsx                   ← shell: layout, nav, providers, route switch
│   │
│   ├── routes/                   ← one file per screen (thin; compose components)
│   │   ├── Home.jsx · Journey.jsx · CalendarScreen.jsx · DaysIndex.jsx
│   │   ├── DaySheet.jsx · Checklist.jsx · Items.jsx · People.jsx
│   │   ├── TravelStay.jsx · RitualGuide.jsx · GeetBook.jsx · Prasad.jsx
│   │   ├── Decisions.jsx · Memories.jsx · About.jsx · More.jsx
│   │   └── ShareImport.jsx · NotFound.jsx
│   │
│   ├── components/               ← reusable UI, presentational
│   │   ├── AppShell.jsx · TabBar.jsx · TopNav.jsx · FAB.jsx
│   │   ├── BottomSheet.jsx · Modal.jsx · UndoSnackbar.jsx
│   │   ├── CountdownCard.jsx · TodayCard.jsx · NextUpCard.jsx · SeasonStrip.jsx
│   │   ├── TrackBadge.jsx · StatusChip.jsx · JourneyRail.jsx
│   │   ├── MonthGrid.jsx · DayCell.jsx · DayDots.jsx · DayHeader.jsx · DayTabs.jsx
│   │   ├── TimelineList.jsx · SlotRow.jsx
│   │   ├── ItemList.jsx · ItemRow.jsx · AddItemForm.jsx · KitInserter.jsx
│   │   ├── AddSheet.jsx · PersonPicker.jsx · PersonCard.jsx · CarryList.jsx
│   │   ├── ProgressRing.jsx · SoopProgress.jsx
│   │   ├── FilterChips.jsx · SearchBar.jsx · EmptyState.jsx
│   │   ├── CopyShareSnippet.jsx · ConflictNote.jsx
│   │   ├── TravelTable.jsx · StayTable.jsx
│   │   ├── RitualCard.jsx · FamilyStoryEditor.jsx · SongCard.jsx
│   │   ├── DecisionRow.jsx · MemoriesStats.jsx
│   │   └── LanguageToggle.jsx · InstallPrompt.jsx · PasscodeGate.jsx
│   │
│   ├── motifs/                   ← decorative inline SVG (§6.5)
│   │   ├── MadhubaniBorder.jsx · SunArghya.jsx · Marigold.jsx · Diya.jsx
│   │   ├── Lotus.jsx · BananaLeaf.jsx · SoopBasket.jsx · Peacock.jsx
│   │   ├── ShivaTrishul.jsx · HanumanGada.jsx · MehendiHand.jsx
│   │   └── BaraatGhodi.jsx · TokriBasket.jsx · FolkRule.jsx
│   │
│   ├── icons/
│   │   ├── Icon.jsx              ← <Icon name="calendar" /> dispatcher
│   │   └── paths.js              ← raw path data in one auditable file
│   │
│   ├── data/                     ← THE SEED (§7.3) — the source of truth
│   │   ├── journey.js · events.js · clusters.js · chhath.js
│   │   ├── kits.js · rituals.js · songs.js · people.js
│   │   └── decisions.js · questions.js · travel.js · strings.js
```

│   ├── hooks/
│   │   ├── useWeddingStore.js    ← the one store (Context + useReducer)
│   │   └── useLanguage.js · useLocalStorage.js · useToday.js
│   │       useMediaQuery.js · useReducedMotion.js · useSwipe.js
│   │       useFocusTrap.js · useClipboard.js
│   ├── utils/
│   │   ├── dates.js              ← Intl formatting, Devanagari names, day diffs
│   │   ├── storage.js            ← persistence (§7.4)
│   │   ├── share.js              ← share-link encode/decode (§7.5)
│   │   ├── derive.js             ← the L1–L15 pure functions (§7.6)
│   │   ├── conflicts.js          ← C1–C7 (§7.7)
│   │   ├── ics.js                ← .ics export
│   │   ├── text.js               ← bilingual helpers, Devanagari-safe truncation
│   │   └── toast.js
│   ├── styles/
│   │   ├── tokens.css            ← ALL design tokens
│   │   ├── base.css              ← reset, typography, focus rings, reduced-motion
│   │   ├── utilities.css         ← ~15 genuinely shared helpers
│   │   └── print.css             ← the one-page printable plan
│   └── fonts/                    ← 4 subsetted woff2 files, self-hosted
│
├── tests/utils/                  ← Vitest: dates, derive, conflicts, share, ics, storage
├── scripts/
│   ├── subset-fonts.mjs          ← font subsetting step
│   └── check-budget.mjs          ← fails the build if the bundle budget is exceeded (§8.3)
├── vite.config.js
├── .gitignore
├── README.md
├── wedding-context-and-reasoning.md   ← the dossier
└── wedding-website-plan.md            ← this plan
```

**Conventions (enforced by review, because there is no linter budget for taste)**

- Every route file is **thin** — it composes components and reads the store; logic lives in `utils/` or the store.
- Any component with > ~40 lines of styles gets a sibling `ComponentName.css`; tokens stay global in `tokens.css`.
- **No component reads `localStorage` directly.** Only `storage.js` does.
- **No component formats a date directly.** Only `utils/dates.js` does.
- **`data/*.js` contains zero JSX and zero logic** — pure data, so it can be validated by a script or a test.
- **One store, one dispatch.** Mutations go through named actions (`tickItem`, `addItem`, `assignItem`, `setSlotTime`, `addPerson`, `addLeg`, `flipDecision`), never through ad-hoc `setState` in components.
- **No `any`-style magic strings** — categories, tracks, statuses and kinds are exported constants from `data/` and imported everywhere.

## 10 · Interaction specifications

### 10.1 The global "Add" flow (the most-used interaction in the app)

One FAB, one sheet, four taps maximum to save anything.

```
tap ＋  →  ┌──────────────────────────────┐
           │  क्या जोड़ना है?              │
           │  ▢ काम / Task                │
           │  ▢ सामान / Item              │
           │  ▢ फंक्शन / Event            │
           │  ▢ व्यक्ति / Person          │
           │  ▢ नोट / Note                │
           └──────────────────────────────┘
                        │
              e.g. "Item"
                        ▼
   ┌────────────────────────────────────────┐
   │  नाम        [ फूल की माला        ]      │
   │  दिन        [ 09 दिसंबर      ▾ ]  ← default: the day you're viewing
   │  श्रेणी     [ रस्म           ▾ ]        │
   │  मात्रा     [ 2     ] [ गिनती ▾ ]       │
   │  किसके पास  [ Mummy          ▾ ]        │
   │  नोट        [                    ]      │
   │              [ जोड़ें ]  [ एक और ]      │
   └────────────────────────────────────────┘
```

**Rules that make it feel effortless:**

1. **Context carries over.** If you tapped `＋` from the 9 Dec Day Sheet, the new item is pre-filled with 9 Dec and that day's track.
2. **"एक और / Add another"** keeps the sheet open and resets only the name field. This is how you enter twenty items in two minutes.
3. **No required field other than the name.** Everything else can be filled later, or never.
4. **The last-used combination is remembered** (category + day + person) for the next add.
5. **Offline-safe**: the sheet never awaits the network, because there is none.

### 10.2 Ticking an item (the micro-reward)

```
☐  मेहंदी कोन                    Mummy
      ↓ tap
  · checkmark stroke draws in (140 ms)
  · 6–8 marigold petals burst outward and fade (280 ms)
  · the row slides to the "done" group (200 ms)
  · the day's ring fills by one step (400 ms)
  · if the day hits 100 %: a single quiet confetti-once + copy
    "आज का काम पूरा 🎉"
      ↓ long-press (500 ms)
  · undo, edit, assign, move to another day, delete
```

Long-press to undo is deliberate: it prevents accidental unticking while scrolling, and it hides power actions from people who don't need them.

### 10.3 Timeline editing on a day

- Every time slot is a **text field, not a fixed value**. Tapping `10:00 हल्दी की तैयारी` turns it inline-editable.
- Unconfirmed times display with a `~` and a dotted underline. Filling in a real time **removes the marker and asks** *"इसे पक्का कर दें? / Mark as confirmed?"* — which is how caveats get resolved by the family over time.
- Drag the handle to reorder; the order is stored.
- `+ समय जोड़ें` appends a blank row at the end.

### 10.4 Swiping between days

- On the Day Sheet, swipe left/right moves to the adjacent day **within the same track** (so 10 Dec → 11 Dec, not 10 Dec → 15 Nov).
- At a track boundary, a gentle edge-hint appears: *"कज़न वेडिंग ख़त्म — भाई की शादी शुरू"*.
- Swipe is **pointer-events based** (~40 lines in `useSwipe.js`), with a `touch-action: pan-y` CSS hint so vertical scrolling is never hijacked.
- A visible `‹ ›` chevron pair exists on desktop, where swiping is unnatural.

### 10.5 Search and filter

| Screen | Search over | Filters |
| --- | --- | --- |
| Ritual Guide | name (Devanagari + Roman + English) + body text | category, family-said-yes/no |
| Geet Book | title + lyrics + occasion | occasion, language, has-audio |
| Checklist | item name + note | day · person · category · status · track |
| Items | item name | category · day · bought/not · owner |
| People | name + relation | role · travelling · staying |
| Decisions | text + source | status (✓ / ~ / ?) · owner |
| Everything | — | one global "track" chip row on Journey/Calendar |

Search is **client-side over the in-memory store** — instant, no debounce needed below ~1,000 items. If the dataset ever grows past that, add a 120 ms debounce; not before.

### 10.6 The Family Story / Elders' Notes editor

```
┌───────────────────────────────────────┐
│  📖 परिवार की बात                      │
│                                       │
│  हमारे घर में मटकोर कैसे होता है?       │
│  ┌─────────────────────────────────┐  │
│  │                                 │  │  ← free text, auto-save
│  └─────────────────────────────────┘  │
│  किसने बताया?  [ Mummy            ▾ ] │
│  कब बताया?     [ 29 सितंबर 2026  ]    │
│  [ 🎙 बाद में आवाज़ में सुनाएँ ]         │
└───────────────────────────────────────┘
```

Voice recording is **deliberately out of v1** (it needs storage and permissions), but the placeholder stays so the family sees the intent. When it lands (Phase 3), the same card gains a record button writing to IndexedDB.

### 10.7 Copy-as-text (the WhatsApp bridge)

Every list, table and day can be copied as **plain text**:

```
📋 09 दिसंबर 2026 · हल्दी + मेहंदी + गीत
──────────────────────────────
10:00  हल्दी की तैयारी
17:30  मेहंदी
19:30  गीत
सामान (6/12): ☐ हल्दी ☑ मेहंदी कोन …
लोग: Mummy, Papa, Bhaiya
──────────────────────────────
घर की शादी · Muzaffarpur
```

One tap → clipboard. This is how the app reaches people who will never install it, and it costs ~20 lines of code.

## 11 · Edge cases & robustness

Because this app will be used **once, under stress, in a house full of people**, robustness beats features.

| # | Case | Handling |
| --- | --- | --- |
| E1 | **Offline, first visit** (someone opens the link on a train) | Show a friendly "पहली बार इंटरनेट चाहिए — बाद में ऑफ़लाइन चलेगा" page. Cannot be avoided; must be graceful |
| E2 | **Offline, subsequent visits** | Fully functional: SW serves shell + data + fonts |
| E3 | **localStorage disabled / private mode** | Feature-detect `localStorage` in a try/catch. If unavailable, run **in-memory only** and show a persistent banner: "इस फ़ोन पर बदलाव सेव नहीं होंगे — फ़ाइल में निर्यात करें" |
| E4 | **Storage quota exceeded** | Catch `QuotaExceededError` → prompt *"निर्यात करें और हल्का करें"*, offer export + prune of old snapshots |
| E5 | **Corrupt stored JSON** | Keep the corrupt payload under a `:corrupt` key, boot from seed, show a gentle "पुराना डेटा पढ़ा नहीं जा सका" banner with an export-corrupt option |
| E6 | **Seed version upgrade** | `migrate(fromVer)` runs a forward-only table. Family patch is preserved; new seed fields appear automatically |
| E7 | **Device date is wrong** (common on cheap phones) | Never trust the device clock for anything destructive. Show the countdown *and* the absolute date. Add a dismissible "आज की तारीख़: 7 दिसंबर" confirmation on Home |
| E8 | **Clock crosses midnight while open** | `useToday` re-computes on `visibilitychange` and on a 60-second timer (cleared when hidden) |
| E9 | **Timezone** | Everything is a **calendar date**, not an instant. Times are stored as local `HH:mm` strings plus a `tz: 'IST'` label. **No UTC conversion anywhere** — this eliminates a whole class of bugs |
| E10 | **Two tabs open** | Listen to the `storage` event and merge-by-latest-timestamp into memory so tabs agree |
| E11 | **Very long Devanagari strings** overflow chips | `text.js` provides Devanagari-safe truncation (never split a grapheme cluster); chips wrap instead of clipping |
| E12 | **Emoji fallback missing** | All emoji are **decorative**; every one has adjacent text. Nothing relies on an emoji rendering |
| E13 | **Print** (someone wants the plan on paper) | `print.css` produces a clean one-page plan per day, black-on-white, no motifs, no nav |
| E14 | **Share link truncated by WhatsApp** | Show the decoded-length estimate before sharing; if > 2,000 chars, offer the JSON file instead |
| E15 | **Person deletes an item the seed also has** | Tombstone (`deleted:true`) beats seed, and a "परत खोलें / restore" affordance exists in Settings |
| E16 | **A seed date changes after family edits exist** | Seed version bumps → Home shows a quiet "प्लान अपडेट हुआ" note listing what changed, so nobody is surprised |
| E17 | **Someone opens a deep link to a bad date** (`/day/2027-05-01`) | Friendly fallback to the nearest valid date with "तारीख़ नहीं मिली" |
| E18 | **Older Android WebView, no `CompressionStream`, no `Intl` Devanagari** | Feature-detect each: share → JSON fallback; Devanagari names → a tiny static month/day-name table |
| E19 | **Reduced motion / slow device** | All animations off; no `IntersectionObserver`-driven visuals, static rail |
| E20 | **User pastes a huge note** | Cap note length at 4,000 chars with a counter; store as-is otherwise |
| E21 | **Duplicate person names** ("Mummy" ×2) | Allow duplicates; disambiguate with relation + a colour dot |
| E22 | **Family disputes a fact** | The `context` vs `familyText` split means disputes are resolved by editing the family block, not by us shipping a fix |

## 12 · Accessibility & bilingual strategy

### 12.1 Bilingual model

**Rule P3: Hindi for the heart, English for the controls.**

| Layer | Default | Toggle behaviour |
| --- | --- | --- |
| Ritual names | **Devanagari + Roman, always shown together** (`हल्दी · Haldi`) | unchanged (both stay) |
| Day titles, section headings, empty states, buttons, chips | Hindi-first when the language is `hi` | `EN` mode swaps to English-first |
| Times, dates (digits), names, phone numbers | Latin digits always | unchanged |
| Notes, family stories, song lyrics | whatever the family typed | unchanged |
| `context` reference paragraphs | Hindi + English in the seed where possible | shows the active language, with the other available via a small "EN/हिं" toggle on the card |

**Why always show Devanagari + Roman for ritual names:** the younger generation reads Roman, the elders read Devanagari, and *both* need to be able to say the word out loud in a pandit's presence. This single decision does more for the app's usability than any feature.

### 12.2 Language state

- Stored under `settings.lang` (`'hi' | 'en'`), default: **`hi`** if the device language starts with `hi`, else `en`.
- Toggle in the header (a two-state pill, no dropdown) and in `/more`.
- **No page reload** to switch — the strings come from `data/strings.js` through `useLanguage()`.
- `document.documentElement.lang` and `dir="ltr"` are kept correct for screen readers and hyphenation.

### 12.3 Accessibility checklist (WCAG 2.2 AA target)

| Area | Requirement |
| --- | --- |
| Contrast | Body text ≥ 4.5:1; large text ≥ 3:1. The chosen ink `#292522` on ivory `#FBF8F1` is ~13:1. Verify every tint pair, especially haldi and marigold on ivory |
| Colour-blind safety | Confidence states never rely on colour alone — shape + glyph + border style too |
| Touch targets | ≥ 44 × 44 px, ≥ 8 px spacing between adjacent targets |
| Focus | Visible focus ring (`outline: 2px solid var(--maroon); outline-offset: 2px`) — never `outline: none` |
| Keyboard | Every action reachable: tab bar, sheets (focus trap + Esc), checkboxes (space), FAB (Enter) |
| Screen reader | Semantic landmarks (`header/nav/main`), `aria-current` on the active tab, `aria-live="polite"` for the "added / ticked / undone" announcements, real `<button>` elements everywhere |
| Sheets/modals | `role="dialog"`, `aria-modal`, labelled by the sheet title, focus trapped, Esc closes, focus returns to the trigger |
| Forms | Every input has a visible `<label>` (not placeholder-as-label); errors described in text |
| Motion | Full `prefers-reduced-motion` coverage (see §6.6) |
| Zoom | Layout survives 200 % text zoom without horizontal scroll; no `user-scalable=no` |
| Type size | Base 16 px; nothing meaningful below 14 px |
| Emoji | Always paired with text (never the only carrier of meaning) |
| Targets | No hover-only affordances — every hover action has a tap equivalent |
| Skip link | "मुख्य भाग पर जाएँ / Skip to content" as the first focusable element |
| Print | `print.css` for a readable paper plan |

### 12.4 Testing for accessibility

- **Automated:** `axe-core` via a one-off dev-only script (do not ship it) or the browser DevTools Lighthouse pass — run on Home, Day Sheet and Checklist.
- **Manual:** keyboard-only pass on those three screens; TalkBack (Android) and VoiceOver (iOS) pass on Home + Checklist.
- **Real-world:** ask one person over 50 to open the app and find today's function, with no instructions. If they can't, the design failed regardless of the audit.

## 13 · Offline / PWA plan

### 13.1 Why this is not optional

The app will be opened at ghats before sunrise, inside a crowded wedding house, on a train in fog, and in a village with one bar of signal. **Offline is a core feature, not a nice-to-have.**

### 13.2 The service worker (hand-written, ~60 lines)

```
CACHE_NAME = 'gks-v<build-hash>'          // changes every deploy

install  → precache: index.html, the hashed JS+CSS, 4 fonts,
                      manifest, favicon, and (optionally) the icons
            → skipWaiting()
activate → delete every cache whose name ≠ CACHE_NAME
            → clients.claim()
fetch    → navigation request  → cache-first, fall back to index.html (SPA shell)
            hashed asset       → cache-first (immutable, safe forever)
            anything else      → stale-while-revalidate
```

**Rules**
- **Never** cache a request that isn't same-origin. There are no third-party requests anyway (fonts are self-hosted) — which is exactly why offline works so cleanly here.
- Version the cache by build hash so an update is atomic.
- Detect a new SW and show a quiet, dismissible bar: *"नया वर्शन आया है — रीफ़्रेश करें"* rather than forcing a reload mid-task.
- **Never** let the SW interfere with the share link: hash routing means the SW only ever sees `/index.html` for navigations, so `#/share?d=…` works offline too.

### 13.3 Installability (manifest)

```json
{
  "name": "घर की शादी · Ghar Ki Shaadi",
  "short_name": "घर की शादी",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FBF8F1",
  "theme_color": "#7A2633",
  "lang": "hi",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

**Install prompt etiquette:** never interrupt. Show a one-line, dismissible hint once the person has visited twice *and* is on Android/Chrome: *"होम स्क्रीन पर जोड़ें — बिना इंटरनेट भी चलेगा।"* Once dismissed, never shown again.

**iOS note:** iOS has no `beforeinstallprompt`. Show a tiny illustrated hint ("Share → Add to Home Screen") once, then stop.

### 13.4 Offline test protocol (run before sharing with the family)

| # | Test | Pass condition |
| --- | --- | --- |
| O1 | Load once, then enable airplane mode, then hard-reload | App renders fully |
| O2 | Airplane mode → tick 5 items → reload | States persist |
| O3 | Airplane mode → add a new item → reload | Item persists |
| O4 | Airplane mode → open the share link (previously visited) | Share preview renders |
| O5 | Airplane mode → open an unvisited route (e.g. `/rituals`) | Renders (it is in the precache or the SPA shell + lazy chunk is cached on first visit) |
| O6 | Deploy a new version while the old SW is active | Update bar appears, refresh works, cache is clean |
| O7 | Cold install of a new version, then offline | New version works offline |

> **Design decision that makes O5 reliable:** the *lazy-loaded* chunks must also be precached, because a wedding guest may first visit `/rituals` in a village with no signal. So: lazy-load for **initial** load speed, but **precache all chunks** in the SW install step. That gives both a fast first paint and complete offline coverage.

## 14 · Performance plan

### 14.1 Targets

| Metric | Target | How |
| --- | --- | --- |
| First load (JS+CSS, gz) | **< 80 KB** | §8.3 budget, enforced by `check-budget.mjs` |
| Time to Interactive (mid-range Android, 4G) | **< 1.8 s** | Tiny bundle + inlined critical CSS + no third-party requests |
| LCP | **< 1.5 s** | Hero is text + inline SVG; no images to wait for |
| CLS | **< 0.02** | Font metrics matched, fixed card heights, no late-inserted banners |
| Lighthouse mobile Performance | **≥ 95** | Measured on Home with 4× CPU throttle |
| Repeat visit | **instant** | SW cache-first |
| Interaction latency | **< 50 ms** | Pure local state, no network hop |

### 14.2 Techniques (in priority order)

1. **No images.** The single biggest performance decision. Every visual is CSS or inline SVG.
2. **Critical CSS inlined** in `index.html` for the shell (background, header, tab bar) — the app paints before the JS parses.
3. **Fonts:** self-hosted, `woff2`, **subsetted** (Devanagari + Latin only), `preload` the two most-used faces, `font-display: swap`, and a metric-compatible fallback to avoid CLS.
4. **Route-level code splitting:** core screens in the main chunk; `/rituals`, `/geet`, `/prasad`, `/memories`, `/about`, `/decisions`, `/people`, `/travel` lazy-loaded. **But all chunks precached by the SW** (§13.4).
5. **React production build** with the dev-only paths stripped; no `prop-types`; no source maps in production.
6. **Avoid re-render storms:** the store exposes narrow selector hooks (`useItemsForDay(date)`) rather than one giant context value; list rows are memoised with `React.memo` where the profiler proves it helps.
7. **Long lists:** the Checklist can reach a few hundred rows. Render in groups with `content-visibility: auto` on day sections — a CSS-only virtualisation that costs nothing and needs no library.
8. **Debounce persistence, not rendering.** Saving is debounced 300 ms; the UI updates instantly.
9. **No layout thrash:** all animations use `transform` / `opacity` only.
10. **No analytics, no fonts CDN, no error-reporting SDK** — nothing third-party at all, which is both a privacy and a performance decision.

### 14.3 Measurement protocol

- Run Lighthouse (mobile, throttled) on `/` with a cold cache before every phase gate.
- Record the numbers in the README so regressions are visible, not vibes.
- Physically test on: one mid-range Android, one older Android, one iPhone, and — importantly — **once with DevTools set to Slow 3G** to simulate the village-network case.
- Compare against the budget in §8.3; if the build exceeds it, fix before merging, not after.

## 15 · Testing strategy

### 15.1 What we test (and what we deliberately don't)

| Layer | Tested? | How |
| --- | --- | --- |
| `utils/dates.js` | **Yes — mandatory** | Vitest unit tests: weekday names in `hi`/`en`, day differences, month grids incl. leap/edge cases, far-future dates |
| `utils/derive.js` (L1–L15) | **Yes — mandatory** | Table-driven tests: today/next-up/countdown around every milestone; season phase at every boundary; progress maths |
| `utils/conflicts.js` (C1–C7) | **Yes — mandatory** | One test per rule, plus a "no false positive" test on a clean day |
| `utils/share.js` | **Yes** | Round-trip encode/decode; malformed input; oversized input; missing-`CompressionStream` fallback |
| `utils/storage.js` | **Yes** | Mock `localStorage`: quota error, corrupt JSON, migration from v0 → v1, tombstones |
| `utils/ics.js` | **Yes** | Snapshot the generated `.ics`; verify CRLF, `DTSTART;VALUE=DATE`, escaping of commas/semicolons |
| `data/*.js` | **Yes — validation only** | A schema test: every event has a valid `track`, `status` and date in range; every `ritualId` resolves; every `kitId` resolves; no duplicate ids; no seeded `person.name` |
| Components / rendering | **No unit tests** | Cost/benefit is wrong for a ~25-component app used for eight weeks. Covered by manual passes |
| UI flows | **Manual scripted passes** | The flows in §15.3 |
| Accessibility | **Automated + manual** | §12.4 |
| Performance | **Automated** | §14.3 |

**Why this split:** the risky logic in this app is *dates, merges, and derived state* — not rendering. Burning the testing budget there is the highest-value trade. Rendering errors are visible in seconds; a wrong weekday is invisible and embarrassing.

### 15.2 Data-validation test (the highest-value single test)

```js
// tests/data.schema.test.js  (conceptual)
- every Event.date matches /^2026-1[12]-\d{2}$/ and lies within 2026-11-13 … 2026-12-13
- every Event.status ∈ {confirmed, tentative, toVerify, suggested, context}
- every Event.track ∈ {chhath, cousin, bridge, wedding}
- every Event.ritualIds[] resolves in rituals.js
- every Event.kitIds[] resolves in kits.js
- every Cluster.known[].date parses
- no Person has a non-empty `name` in the seed           ← enforces "we never invent people"
- no Ritual has a non-empty `familyText` in the seed      ← enforces "we never invent family practice"
- no CHHATH_GHAT.ghat is non-empty                        ← enforces "we never name a ghat"
- no Event has a non-empty `slots[].time` unless status is 'confirmed'
- every Decision.status ∈ {confirmed, tentative, toVerify}
```

That last block of assertions is the **institutional memory of this project's ethics** — encoded as a failing test so a future contributor (or a future us) cannot casually break it.

### 15.3 Manual test scripts (run before each phase gate)

| # | Script | Steps | Pass |
| --- | --- | --- | --- |
| M1 | **The 10-second test** | Open Home on a phone; without scrolling, state today's function and its two blocks | Achieved, twice in a row |
| M2 | **The 60-second add** | Open FAB → add 5 items to 9 Dec with owners | All 5 present, correctly dated, in under 60 s |
| M3 | **The crash-consistency test** | Tick 6 items across 3 days → hard-reload | All states identical |
| M4 | **The share round trip** | Export a link → open on a second phone → merge → verify | Identical state, no duplicates |
| M5 | **The offline test** | §13.4 O1–O7 | All pass |
| M6 | **The elder test** | Hand the phone to someone 50+; ask "what's happening on the 10th?" | They find it unaided |
| M7 | **The Hindi-only test** | Switch to `hi`; every screen readable with no English required to act | No dead ends |
| M8 | **The unknown-date test** | Open the cousin's cluster; fill in one `?` row; check Calendar + Journey + Day Sheet all update | One edit propagates everywhere |
| M9 | **The pre-emptive-chaos test** | Set the device date to 10 Dec, then 11 Dec, then 14 Dec | Today card, countdown, themes and Memories mode all behave |
| M10 | **The keyboard test** | Tab through Day Sheet | Fully operable, focus visible |

### 15.4 Regression discipline

- `npm run test` must pass before every commit that touches `utils/` or `data/`.
- `npm run build` runs `check-budget.mjs`; a budget breach is a build failure.
- Keep a short `CHANGELOG.md` with entries like *"14 Oct — reception confirmed 13 Dec; seed v3; family patches preserved"*.

## 16 · Deployment on Vercel

### 16.1 Repo & project setup

1. **Initialise git** in `weds/` (it is not a repo yet — verified). Add a `.gitignore` covering `node_modules`, `dist`, `.env*`, `.DS_Store`, `*.m4a`.
2. **Decide the repo boundary.** Recommended: put the app in a **`wedding_web/` subfolder** and set the Vercel **Root Directory** to `wedding_web`. That keeps the audio file, the dossier and the plan at the repo root, while the app stays self-contained. *(The `wedding_web/` folder already exists; it currently holds only a `.env`.)*
3. **`.env` handling.** The existing `wedding_web/.env` contains `DATABASE_URL` and `TAVILY_API_KEY`. The app needs **neither** — it is frontend-only with no backend and no search calls. So:
   - do **not** copy that file into the app,
   - make sure `.gitignore` excludes `.env*`,
   - and **rotate the exposed keys** if that file was ever committed or shared.
4. **Connect to Vercel** → *New Project* → import the repo → set Root Directory → Framework preset **Vite** → build `npm run build`, output `dist`. Every push to `main` publishes; every branch/PR gets a **preview URL**.

### 16.2 `vercel.json` (small but worth having)

```json
{
  "headers": [
    { "source": "/assets/(.*)", "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] },
    { "source": "/(.*)", "headers": [
        { "key": "X-Robots-Tag",  "value": "noindex, nofollow, noarchive" },
        { "key": "Referrer-Policy", "value": "no-referrer" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" } ] }
  ],
  "rewrites": [ { "source": "/(.*)", "destination": "/index.html" } ]
}
```

- The **`noindex` header is required**, not optional: the site contains family travel dates, addresses and phone numbers.
- Hash routing makes the rewrite mostly redundant, but keep it so a future switch to `BrowserRouter` doesn't break direct links.

### 16.3 Environment & build config

- **No `VITE_*` secrets at all.** The `passcode` for the optional gate is a **client-side soft gate only** — it is obfuscation, not security, and the docs must say so plainly. It stops a curious stranger with the link; it does not protect against a determined one.
- Set `"node": ">=20"` in `engines` if needed (local Node is v22.22.0).
- Add `npm run build` → `vite build` and, crucially, append the budget check: `vite build && node scripts/check-budget.mjs`.

### 16.4 Access control options (pick one, in order of preference)

| Option | Effort | Protection | Recommendation |
| --- | --- | --- | --- |
| **A. Unlisted URL** (`ghar-ki-shaadi-<random>.vercel.app`) | none | obscurity only | minimum baseline — always do this |
| **B. Soft passcode gate** (client-side, stored in `settings`) | ~30 lines | keeps out casual visitors; **not real security** | good default for a family site |
| **C. Vercel Password Protection** | paid plan | real HTTP-level protection | if the family wants genuine privacy and has a Pro plan |
| **D. Unlisted + `noindex` + passcode + rotate the URL after the wedding** | small | good enough in practice | **recommended combination** |

### 16.5 Preview deployments as a workflow

This is the single most useful Vercel feature for this project, because the family will keep changing dates:

- Make each seed-data change a **small commit** (`chore(seed): reception confirmed 13 Dec`).
- Share the **preview URL** in the family WhatsApp group and ask for confirmation.
- Only merge to `main` (and thus the live site) once confirmed.
- Tag each confirmed seed version (`seed-v3`) so the live state is traceable.

### 16.6 Domain

- Use a friendly, readable subdomain — e.g. `deepak-shadi.vercel.app` — or a custom domain if the family owns one.
- Keep the URL **short**, because it will be typed by hand and pasted into WhatsApp.
- After 13 Dec, keep the URL alive: it becomes the **Memories** archive.

### 16.7 Pre-share go-live checklist

| # | Check |
| --- | --- |
| 1 | `npm run build` passes **including the 80 KB budget check** |
| 2 | Lighthouse mobile on `/`: Performance ≥ 95, A11y 100, Best practices 100, SEO 100 |
| 3 | `noindex` header verified with `curl -I` |
| 4 | Offline protocol (§13.4 O1–O7) all pass on a real phone |
| 5 | Tested on one real Android **and** one real iPhone, in portrait, one-handed |
| 6 | Hindi-only pass: every screen usable without English (§15.3 M7) |
| 7 | Share-link round trip verified between two devices |
| 8 | **No seeded bride name, no family names, no phone numbers** in the shipped bundle |
| 9 | `.env` is not referenced anywhere in the app code |
| 10 | README documents: what the app is, how to run it, how to update seed data, how to export/import |
| 11 | One family member has successfully opened the preview and found today's function |

## 17 · Phased roadmap

Principles: **Phase 1 must be useful before Chhath (13 Nov)**, because the first real deadline in the data is not the wedding — it is Chhath. Everything after that can be polished while the December details firm up.

### Phase 0 — Foundation (1–2 evenings)

| Task | Deliverable |
| --- | --- |
| `npm create vite@latest` in `wedding_web/` | React + JS scaffold |
| Remove all demo files, fonts, logos | Clean slate |
| `tokens.css`, `base.css`, `utilities.css` | The design system skeleton |
| Self-host + subset the 4 fonts | Font pipeline working |
| `vite.config.js`, `.gitignore`, `vercel.json`, `README.md` | Deployable empty shell |
| `check-budget.mjs` | Budget gate active from day one |
| Deploy the empty shell to Vercel | **Preview URL exists on day one** |

**Acceptance:** an empty, styled shell is live on a Vercel preview URL, under 80 KB, and installable.

### Phase 1 — The usable core (target: live before 13 Nov)

| Task | Deliverable |
| --- | --- |
| `data/journey.js`, `data/events.js`, `data/chhath.js`, `data/clusters.js` | All 15 dates seeded with correct statuses |
| `hooks/useWeddingStore.js` | Store + named actions |
| `utils/storage.js`, `utils/dates.js`, `utils/derive.js` (L1–L4, L7, L8) | Persistence + date logic |
| `AppShell`, `TabBar`, `TopNav`, `FAB` | Navigation |
| `Home` (hero, countdown, season strip, today card, next up) | **J1 + J2 answered** |
| `Journey` with `JourneyRail` + the crunch callout | **The three-event story visible** |
| `CalendarScreen` + `MonthGrid` + `DayCell` + bottom sheet | Navigation by date |
| `DaySheet` with Timeline + Items + Notes tabs | Per-day workspace |
| `Checklist` with day grouping + `ItemRow` ticking | **J3 answered** |
| Marquee micro-interaction | The check + marigold burst |
| Seed items + `kits.js` with the Prasad kit | Real checklists, not empty screens |
| Vitest tests for `dates`, `derive`, `storage`, `data` schema | Green suite |

**Acceptance:** a relative can open the link and answer "what's happening today / next, and what do I have to do?" — and the Chhath prasad list is usable.

### Phase 2 — Beautiful, bilingual, shareable (target: mid‑November)

| Task | Deliverable |
| --- | --- |
| Language toggle + `data/strings.js` | **Hindi/English throughout** |
| `RitualGuide` with the family/context split | **J4 answered**, culture made safe |
| `People` + person cards + carry lists | **J6 answered** |
| `TravelStay` with the winter advisory and crunch row | **J5 answered** |
| `GeetBook` seeded from the family audio + context songs | **J7 answered** |
| `Prasad` screen | The kitchen checklist |
| `Decisions` screen + questions | **The unresolved questions become visible** |
| `.ics` export | Dates into Google/Apple Calendar |
| `Memories` mode (read-only switch) | Future-proofed |
| `About` with the groom card and Muzaffarpur context | Emotional landing |
| Design polish pass: motifs, day tints, sheet motion | **It looks like itself** |

**Acceptance:** a Hindi-only user, an English-only user and an elder can all use it; the ritual guide answers "what is matkor?" correctly and safely; a date can be exported to a phone calendar.

### Phase 3 — Reliable on the ground (target: late November)

| Task | Deliverable |
| --- | --- |
| `sw.js` + manifest + install prompt | **Offline + installable** |
| Share link (encode/decode) + import preview + backup slot | **J9 answered** |
| Conflict engine C1–C7 with quiet inline notes | Proactive protection |
| `KitInserter` for all 12 kits | Fast setup |
| `CopyShareSnippet` everywhere | WhatsApp bridge |
| Passcode gate + `noindex` verification | Privacy |
| Accessibility pass (keyboard, TalkBack, contrast) | WCAG 2.2 AA |
| Offline protocol O1–O7 on real devices | Verified |
| Print stylesheet | Paper plan |
| Performance verification against the 80 KB budget | Measured, not assumed |

**Acceptance:** the app fully works in airplane mode at a ghat at 5 am.

### Phase 4 — Only if genuinely needed (post‑13 Dec, or earlier if demanded)

| Candidate | Trigger condition | Cost |
| --- | --- | --- |
| Supabase/Firebase live sync | The family genuinely cannot coordinate via share links | Breaks the "frontend only" constraint; adds auth + privacy surface |
| Voice notes for Family Story | Elders want to record rather than type | IndexedDB + permissions |
| Photo gallery links per day | The photographer shares an album | Just links — no uploads |
| RSVP / guest list with counts | The reception needs head counts | Local-only list; keep it out of the public build |
| WhatsApp reminder bot | Nothing else works | Requires a backend; high effort, low durability |
| TypeScript migration | The codebase grows or a second developer joins | Medium effort, mechanical |

**Explicitly never:** a payment page, a gift registry, a public gallery with uploads, or anything requiring the family's data to leave their devices without a deliberate decision.

## 18 · Launch timeline & work calendar

Working backwards from the two hard deadlines in the data (**13 Nov** and **7 Dec**):

| Window | Focus | Gate to pass |
| --- | --- | --- |
| **29 Sep – 3 Oct** | Phase 0 + Phase 1 core (data, store, Home, Journey, Calendar, Day Sheet, Checklist) | Home + Journey + Day Sheet usable on a phone; **home base, shopping strip and the four pre-filled travel legs all present** |
| **4 Oct – 11 Oct** | Phase 1 polish + tests + first Vercel deploy. **Add the `home` track, `SHOPPING_WEEKENDS` and `TRAVEL_LEGS` seed** | Live preview URL shared with 2 family members |
| **12 Oct – 26 Oct** | Phase 2: bilingual, Ritual Guide, People, Travel & Stay (the Delhi group), Decisions, `.ics`, About | A Hindi-only relative completes a task unaided |
| **27 Oct – 1 Nov** | Phase 3: PWA/offline, share link, conflicts, a11y pass, performance pass | Offline protocol passes on 2 real devices |
| **2–4 Nov** | **FINAL PASS BEFORE CHIRANJEEV ARRIVES** — bug fixes only after 1 Nov | **Live and usable on 5 Nov (Thu), when the user lands in Muzaffarpur** |
| **5–12 Nov** | App in real use: shopping list #1 (7–8 Nov), Chhath prep (9–12 Nov), leave confirmation for 16 Nov | Ticket task + Chhath kit driven from the app |
| **11 Nov – 13 Nov** | **FREEZE FOR CHHATH.** Only bug fixes | App used live during Chhath (13–16 Nov) — first real-world test |
| **17–26 Nov** | Post-Chhath fixes from the field; shopping weekend #2 (21–22 Nov); fill cousin-Delhi details as they settle | Shopping weekend #2 completed against the in-app list |
| **27 Nov – 3 Dec** | Matkor (27 Nov), packing (29 Nov), **Delhi excursion (30 Nov – 3 Dec)**; only seed-data commits | Tickets booked; 1 Dec plan entered; who-holds-the-house decided |
| **4 Dec – 6 Dec** | **RESET + CRITICAL SHOPPING (5–6 Dec).** No new features, no deploys unless broken | Live site matches family reality before 7 Dec |
| **7 Dec – 13 Dec** | **Do not deploy unless something is broken.** The app is now a *noticeboard*, not a project | It just works |
| **14 Dec onward** | Switch to **Memories mode**; collect photos, elders' notes, geet recordings; archive | The keepsake exists |

**Two hard rules for this schedule**

1. **Feature freeze at T‑2 days** before every live event (**4 Nov**, **11 Nov**, **4 Dec**). A broken deploy during Chhath or the wedding is far worse than a missing feature.
2. **Only seed-data commits** during the event weeks. Data changes are reviewable and reversible; code changes are not, at 11 pm in a wedding house.

**Revised deadline note:** the first real deadline is now **5 November (the user's arrival)**, not 13 November. Everything on the critical path — home base, shopping strip, ticket task, Chhath kit — must be working by then, because 7–8 November is shopping weekend #1.

## 19 · Risk register (build side)

The cultural/data risks live in `wedding-context-and-reasoning.md` §13.4. This is the delivery-specific list.

| # | Risk | L | I | Mitigation | Early warning signal |
| --- | --- | --- | --- | --- | --- |
| B1 | **Over-engineering the start** — building the calendar before the data model | High | High | Phase 1 order is fixed: data → store → date utils → screens | Anyone opens a UI file before `data/*.js` exists |
| B2 | **Design thrash** — repainting three times | Medium | Medium | Lock tokens in Phase 0; only *tints* change per day, never the base palette | More than one redesign of the tab bar |
| B3 | **Font weight creep** — adding a third family for "just the headings" | Medium | Medium | The 2-family rule (§6.2) is a review-blocking rule | Bundle of fonts > 90 KB |
| B4 | **Devanagari bugs only visible on Android** | Medium | Medium | Test on a real Android from Phase 1; never rely on system fonts for ritual names | Text clipping in screenshots |
| B5 | **Midnight/date bugs** | Medium | High | `useToday` + pure date utils + tests (M9) | A countdown off by one |
| B6 | **Share-link fragility** (WhatsApp truncation) | Medium | Medium | Length pre-check; JSON fallback; keep the patch small | A link arriving broken in a real chat |
| B7 | **Silent data loss on one phone** | Medium | High | Export reminder on Home; a "backup now" nudge before each event | A family member reporting missing ticks |
| B8 | **Accessibility regressions from custom sheets** | Medium | Medium | Focus trap + Esc + `aria-modal` in the `BottomSheet` primitive itself, not per screen | Keyboard pass failing |
| B9 | **Scope creep from family requests** | High | Medium | Feature Gate (§3.2); anything new goes to a "Phase 4 candidates" list | A request for RSVP or photo upload |
| B10 | **Nobody uses it** | Medium-High | High | Ship `Copy as text`; give each relative one concrete job; put the Chhath prasad kit in front of the mother first | Low engagement after the first share |
| B11 | **A wrong date ships** | Medium | High | Status system + the data-schema test + preview-URL review with the family | A family member correcting a date verbally |
| B12 | **Credential leakage** (`DATABASE_URL`, `TAVILY_API_KEY` in `wedding_web/.env`) | Medium | High | `.gitignore` `.env*`; never import it in app code; rotate keys if it was ever pushed | `.env` appears in `git status` |
| B13 | **Deployment during an event breaks the site** | Low | Very High | Feature freeze at T‑2 days (§18); deploy in the morning, never at night | A "small fix" proposed on 10 Dec |

## 20 · Open decisions needed from the user

These block or shape specific screens. Each one is numbered so it can be answered in any order.

### 20.1 Blocking (needed before the relevant screen can be finished)

| # | Decision | Blocks | Recommendation | **v1.1 status** |
| --- | --- | --- | --- | --- |
| **K1** | **Bride's name** (and whether to show it at all) | Home hero, About | ~~Leave blank and render `[दुल्हन का नाम]` until given~~ | ✅ **RESOLVED — brother's bride **Salvi**, cousin's bride **Alka** (as supplied). Home hero becomes "Deepak × Salvi"; the cousin card reads "Gurvav × Alka". Correct any spelling in `SEASON_META` only, once, and it propagates everywhere |
| **K2** | ~~Cousin's wedding city, dates, and which cousin~~ | The cluster's unknown block, Travel & Stay | ~~Ship the cluster with `?` rows; fill in as soon as the family knows~~ | ✅ **RESOLVED — Delhi, 2 Dec, maternal cousin brother, travel 30 Nov → 3 Dec, 4 named people. Ship as `confirmed`** |
| **K3** | **Family's Chhath ghat + who fasts + prasad quantities** | Chhath module | Ship the Ghat Plan empty; the family fills it in the app | open |
| **K4** | **Who can edit**: just the user, or the whole family? | Share-link + export/import design | Recommended: everyone edits their own copy; the user's copy is the master, distributed via share link | open |
| **K5** | **Public or private**, and does the family want a passcode? | Deployment §16.4 | Recommended: unlisted + `noindex` + soft passcode | open |
| **K6** | **Colours/fonts from the groom's profile site** (a screenshot or 2–3 hex codes) | Design system §6 | The profile is a client-rendered SPA returning an 820-byte shell, so its palette cannot be read from outside. A screenshot solves it in seconds | open |
| **K7** | **Delhi stay (30 Nov – 2 Dec)** — hotel or relative's home; and **which mode** for MFP ↔ Delhi | Travel & Stay, packing lists, Nani's comfort | Ask before 27 Nov; it decides berth class vs flight and what luggage goes | **new, open** |
| **K8** | **Who holds the house while the four are in Delhi** | Journey home card, prep continuity | ~~Ask before 25 Nov~~ | ✅ **RESOLVED — Gauri Shankar (father), Govt. Teacher, stays in Muzaffarpur** |

### 20.2 Shaping (needed to finish well)

| # | Decision | Shapes | Recommendation |
| --- | --- | --- | --- |
| S1 | Which language should be the **default** for the shared link? | Bilingual UX | Hindi — it is the elders who most need help |
| S2 | Do we include a **groom-only filter** (his own checklist)? | Checklist, People | Yes — cheap and genuinely useful |
| S3 | Do we want an **`.ics` export** in v1, or only a copy-as-text? | Phase 2 scope | Both; `.ics` is ~40 lines and very useful |
| S4 | Should the **reception** be treated as guest-facing (i.e. include "how to reach")? | Reception day | Yes — it is the one public-feeling event |
| S5 | Do we add **shagun/lena-dena** as a first-class category? | Checklist, 12 Dec | Yes — it is a real source of family stress |
| S6 | Where should **photos/albums** be linked from (Google Photos, iCloud, WhatsApp)? | Memories mode | Just store URLs; do not host anything |
| S7 | Do we want a **printed plan** for elders? | `print.css` | Yes — cheap, and some people will want paper |
| S8 | Should the site stay live and readable **after the wedding**? | Memories mode | Yes — it becomes the keepsake; keep the URL and the archive |
| S9 | Is there a **family WhatsApp group** to distribute the share link into? | Adoption | Yes — it is the distribution channel; the copy-as-text feature is built for it |
| S10 | Do we want a **custom domain**? | Deployment | Optional; a short Vercel subdomain is enough |

## 21 · Appendix A — bilingual copy deck (`data/strings.js`)

Canonical UI strings. **Ritual names always show Devanagari + Roman together.**

```js
export const S = {
  app:        { hi:'घर की शादी',            en:'Ghar Ki Shaadi' },
  couple:     { hi:'डॉ. दीपक × सल्वी',        en:'Dr. Deepak × Salvi' },
  cousinCouple:{ hi:'गुवाव × अल्का',         en:'Gurvav × Alka' },
  tagline:    { hi:'एक शादी नहीं, पूरे परिवार की कहानी।', en:"Not one wedding — a whole family's story." },

  nav: {
    home:      { hi:'घर',        en:'Home' },
    journey:   { hi:'सफ़र',      en:'Journey' },
    calendar:  { hi:'कैलेंडर',   en:'Calendar' },
    checklist: { hi:'चेकलिस्ट',  en:'Checklist' },
    more:      { hi:'और',        en:'More' }
  },

  home: {
    season:      { hi:'परिवार का मौसम',   en:'Family season' },
    today:       { hi:'आज',              en:'Today' },
    nextUp:      { hi:'आगे',             en:'Next up' },
    daysLeft:    { hi:'दिन बाक़ी',        en:'days to go' },
    openPlan:    { hi:'आज का प्लान देखें', en:"See today's plan" },
    provisional: { hi:'~ वाली तारीख़ें अभी पक्की नहीं — पंडित जी/परिवार से पुष्टि करें।',
                   en:'Dates marked ~ are not final — confirm with the pandit/family.' }
  },

  status: {
    confirmed: { hi:'पक्का',        en:'Confirmed' },
    tentative: { hi:'लगभग तय',      en:'Tentative' },
    toVerify:  { hi:'पुष्टि बाक़ी',  en:'To confirm' },
    suggested: { hi:'सुझाव',        en:'Suggestion' },
    context:   { hi:'सामान्य जानकारी', en:'General context' }
  },

  day: {
    timeline:  { hi:'कार्यक्रम',   en:'Timeline' },
    items:     { hi:'सामान',       en:'Items' },
    people:    { hi:'लोग',         en:'People' },
    notes:     { hi:'नोट',         en:'Notes' },
    why:       { hi:'क्यों?',       en:'Why' },
    addTime:   { hi:'+ समय जोड़ें',  en:'+ Add time' },
    addItem:   { hi:'+ आइटम जोड़ें', en:'+ Add item' },
    ourFamily: { hi:'हमारे घर में कैसे होता है', en:'How our family does this' },
    tradition: { hi:'परंपरा में (सामान्य)',      en:'Traditionally (general)' },
    disclaimer:{ hi:'यह सामान्य जानकारी है — हमारे घर की परंपरा अलग हो सकती है।',
                 en:'This is general information — our family’s practice may differ.' },
    empty:     { hi:'इस दिन कोई फंक्शन नहीं · आराम', en:'No function this day · rest' }
  },

  add: {
    title:  { hi:'क्या जोड़ना है?', en:'What do you want to add?' },
    task:   { hi:'काम',    en:'Task' },
    item:   { hi:'सामान',  en:'Item' },
    event:  { hi:'फंक्शन', en:'Event' },
    person: { hi:'व्यक्ति', en:'Person' },
    note:   { hi:'नोट',    en:'Note' },
    save:   { hi:'जोड़ें',  en:'Add' },
    again:  { hi:'एक और',   en:'Add another' }
  },

  checklist: {
    title:    { hi:'कुल चेकलिस्ट', en:'Master checklist' },
    all:      { hi:'सब',          en:'All' },
    byDay:    { hi:'दिन',         en:'Day' },
    byPerson: { hi:'व्यक्ति',      en:'Person' },
    byCat:    { hi:'श्रेणी',       en:'Category' },
    pending:  { hi:'बाक़ी',        en:'Pending' },
    anytime:  { hi:'बिना दिन',     en:'Anytime' },
    empty:    { hi:'इस फ़िल्टर में कुछ नहीं', en:'Nothing in this filter' }
  },

  travel: {
    title:     { hi:'सफ़र और ठहरना',  en:'Travel & stay' },
    arrivals:  { hi:'आना',           en:'Arrivals' },
    departures:{ hi:'जाना',          en:'Departures' },
    stay:      { hi:'ठहरना',          en:'Stay' },
    fogWarning:{ hi:'दिसंबर में कोहरा — ट्रेन/फ़्लाइट लेट हो सकती है। बफ़र रखें।',
                 en:'December fog — trains/flights can be delayed. Keep a buffer.' },
    crunch:    { hi:'सिर्फ़ 4 दिन. कोहरे का बफ़र + रिहर्सल का समय जोड़ें.',
                 en:'Only 4 days. Add a fog buffer and rehearsal time.' },
    tight:     { hi:'आने और फंक्शन के बीच कम समय', en:'Little time between arrival and function' }
  },

  more: {
    language:  { hi:'भाषा',          en:'Language' },
    share:     { hi:'प्लान शेयर करें', en:'Share this plan' },
    export:    { hi:'फ़ाइल निर्यात',   en:'Export file' },
    import:    { hi:'फ़ाइल आयात',     en:'Import file' },
    reset:     { hi:'आधिकारिक प्लान पर लौटें', en:'Reset to official version' },
    memories:  { hi:'यादें',          en:'Memories' },
    install:   { hi:'होम स्क्रीन पर जोड़ें', en:'Add to Home Screen' },
    localOnly: { hi:'बदलाव इसी फ़ोन पर सेव होते हैं', en:'Changes are saved on this phone only' }
  },

  memories: {
    complete: { hi:'मौसम पूरा हुआ', en:'Season complete' },
    stats:    { hi:'{d} दिन · {r} रस्में · {p} लोग · {g} गीत · 1 शुरुआत',
                en:'{d} days · {r} rituals · {p} people · {g} songs · 1 beginning' }
  },

  a11y: {
    skip:     { hi:'मुख्य भाग पर जाएँ',  en:'Skip to content' },
    added:    { hi:'जोड़ दिया',          en:'Added' },
    ticked:   { hi:'हो गया',             en:'Done' },
    undone:   { hi:'वापस बाक़ी',         en:'Marked pending' },
    close:    { hi:'बंद करें',           en:'Close' }
  }
};
```

## 22 · Appendix B — component inventory & build order

Build order matters more than the list. Each row assumes everything above it exists.

| Order | Component | Depends on | Rough size | Notes |
| --- | --- | --- | --- | --- |
| 1 | `tokens.css` + `base.css` + `utilities.css` | — | 4 KB | Nothing visual works before this |
| 2 | `utils/dates.js` | — | 1.5 KB | Pure; unit-tested first |
| 3 | `data/*.js` | — | 3 KB | Pure; schema-tested |
| 4 | `hooks/useWeddingStore.js` | 2, 3 | 2 KB | The one store |
| 5 | `utils/storage.js` | 3, 4 | 1 KB | Debounced persistence |
| 6 | `utils/derive.js` | 2, 3 | 1.5 KB | L1–L15 |
| 7 | `Icon.jsx` + `paths.js` | 1 | 2 KB | ~35 icons |
| 8 | `motifs/*` | 1 | 4 KB | 15 decorative SVGs |
| 9 | `AppShell`, `TabBar`, `TopNav` | 1, 7 | 1.5 KB | The frame |
| 10 | `StatusChip`, `TrackBadge`, `EmptyState`, `Modal`, `BottomSheet` | 1, 7 | 2.5 KB | Primitives |
| 11 | `Home` (`CountdownCard`, `TodayCard`, `NextUpCard`, `SeasonStrip`) | 4, 6, 9, 10 | 3 KB | J1 + J2 |
| 12 | `Journey` (`JourneyRail`) | 4, 6, 8, 9 | 2.5 KB | The story |
| 13 | `CalendarScreen` (`MonthGrid`, `DayCell`, `DayDots`) | 2, 4, 6, 10 | 3 KB | Hand-rolled |
| 14 | `DaySheet` (`DayHeader`, `DayTabs`, `TimelineList`, `SlotRow`) | 2, 4, 10, 13 | 4 KB | The heart |
| 15 | `ItemList`, `ItemRow`, `AddItemForm` | 4, 10 | 2.5 KB | J3 |
| 16 | `AddSheet` + `FAB` | 4, 10 | 2 KB | The add flow |
| 17 | `Checklist` (`FilterChips`, `ProgressRing`/`SoopProgress`) | 4, 6, 15 | 3 KB | J3 at scale |
| 18 | `KitInserter` | 3, 4, 15 | 1 KB | One-tap kits |
| 19 | `People`, `PersonCard`, `PersonPicker`, `CarryList` | 4, 10 | 2.5 KB | J6 |
| 20 | `TravelStay` (`TravelTable`, `StayTable`) | 2, 4, 10 | 3 KB | J5 |
| 21 | `RitualGuide`, `RitualCard`, `FamilyStoryEditor` | 4, 10 | 3 KB | J4 + J8 |
| 22 | `GeetBook`, `SongCard` | 4, 10 | 2 KB | J7 |
| 23 | `Prasad` | 4, 15 | 1.5 KB | Kitchen |
| 24 | `Decisions`, `DecisionRow` | 4, 10 | 1.5 KB | The collaborator |
| 25 | `TravelStay` crunch + fog notes, `ConflictNote`, `utils/conflicts.js` | 6, 20 | 1.5 KB | Proactive |
| 26 | `utils/share.js`, `ShareImport`, `CopyShareSnippet` | 4, 5 | 2 KB | J9 |
| 27 | `utils/ics.js` | 2, 3 | 0.7 KB | Export |
| 28 | `Memories`, `MemoriesStats` | 4, 6 | 1.5 KB | The keepsake |
| 29 | `About`, `More`, `LanguageToggle`, `PasscodeGate`, `InstallPrompt` | 4, 9 | 2 KB | Settings |
| 30 | `sw.js`, `manifest.webmanifest`, `print.css` | — | 2 KB | Production |
| 31 | `scripts/check-budget.mjs`, `scripts/subset-fonts.mjs` | — | 1 KB | Guardrails |

**Total app-code estimate: ≈ 68 KB raw → ≈ 20 KB gzipped.** That fits the §8.3 budget alongside React.

## 23 · Appendix C — definition of done

### 23.1 Per feature

A feature is done when **all** of these are true:

1. It works on a real Android phone and a real iPhone, one-handed, in portrait.
2. It works **offline** after first load.
3. It has an **empty state** and an **error/unknown state** designed, not just a happy path.
4. Every user-visible string is bilingual (`{hi, en}`, and ritual names also carry `roman`).
5. Every fact shown carries a confidence state; nothing unverified looks final.
6. It is keyboard-operable and screen-reader-labelled.
7. It does not violate the bundle budget.
8. It respects `prefers-reduced-motion`.
9. Its state lives in the store (or is derivable), not in a component-local hack that breaks on navigation.
10. It survives a hard reload with the state intact.

### 23.2 Per phase

| Phase | Definition of done |
| --- | --- |
| 0 | Empty styled shell live on a Vercel preview; budget gate active; fonts self-hosted and subsetted |
| 1 | A relative can answer J1 + J2 unaided; the Chhath prasad kit is usable; `npm run test` green |
| 2 | Hindi-only usable end-to-end; Ritual Guide answers "what is matkor?" safely; `.ics` imports into Google Calendar on a phone |
| 3 | Airplane-mode protocol O1–O7 passes on 2 real devices; share round trip works; Lighthouse ≥ 95/100/100/100 |
| 4 | Only if triggered; each item must clear the §3.2 Feature Gate before it is started |

### 23.3 Project-level (the real definition of done)

> **The app is done when, on 7 December 2026, someone in Muzaffarpur opens it in the morning on a mid-range Android
> with one bar of signal, and in ten seconds knows what today is, what time to be ready, what to wear,
> who is coming, and what is still missing — and nothing on that screen is a claim we invented.**

That single sentence is the acceptance test for the whole project. Everything in both documents exists to serve it.

## 24 · Immediate next steps — the first five commits

If development starts tomorrow, this is the exact order. Nothing here needs a decision from the user except K1–K6 (§20).

### Commit 1 · Scaffold & guardrails

```
git init
npm create vite@latest wedding_web -- --template react
# remove demo files; add:
#   src/styles/tokens.css, base.css, utilities.css
#   scripts/check-budget.mjs
#   .gitignore   (node_modules, dist, .env*, .DS_Store, *.m4a)
#   README.md    (what this is, how to run, how to update seed data)
#   vercel.json  (headers + rewrite)
git commit -m "chore: vite+react scaffold, design tokens, budget gate"
```

### Commit 2 · The truth, in data

```
# src/data/journey.js, chhath.js, clusters.js, events.js, strings.js
# every status flag exactly as specified in the dossier §15
# tests/data.schema.test.js  → the "we never invent" assertions
git commit -m "feat(data): seed the full 13 Nov – 13 Dec season with confidence states"
```

### Commit 3 · Store, persistence and date logic

```
# src/utils/dates.js, storage.js, derive.js
# src/hooks/useWeddingStore.js, useToday.js, useLanguage.js
# tests/utils/{dates,derive,storage,share}.test.js
git commit -m "feat(core): store, persistence, pure date/derive logic + tests"
```

### Commit 4 · The frame and the answer to "what's today"

```
# AppShell, TabBar, TopNav, FAB, Icon, motifs
# Home: CountdownCard, TodayCard, NextUpCard, SeasonStrip
git commit -m "feat(home): navigation shell + today/countdown/season"
```

### Commit 5 · Journey + Calendar + Day Sheet + Checklist

```
# JourneyRail + crunch callout
# MonthGrid, DayCell, DayDots, BottomSheet
# DaySheet (Timeline · Items · Notes), SlotRow, ItemRow, AddSheet
# Checklist with day grouping, ProgressRing/SoopProgress, KitInserter
git commit -m "feat(planner): journey, calendar, day sheet, checklist, kits"
```

After Commit 5 the app is **already useful** — which matters, because Chhath is the first real deadline (13 Nov), not the wedding.

### What to do the moment the user answers K1–K6

| Answer | Immediate action |
| --- | --- |
| Bride's name | ✅ resolved — Salvi (brother), Alka (cousin) — already in `SEASON_META` |
| Cousin's wedding venue/dates | ✅ resolved — **Gurvav × Alka, 2 Dec, Delhi** — mark the cluster `confirmed` |
| Chhath ghat / who fasts | These are **app-entered**, not seed-entered — send the link and ask them to fill it in |
| Who can edit | Decide between share-link-only (recommended) vs a Phase 4 sync backend |
| Public vs private | Apply the passcode gate + verify the `noindex` header |
| Colours/fonts from the profile site | Update only `tokens.css` — nothing else needs to change |

---

## 25 · Closing note

**The single sentence that decides whether this project succeeds:**

> On 7 December 2026, someone in Muzaffarpur opens this on a mid-range Android with one bar of signal
> and, in ten seconds, knows what today is, what time to be ready, what to wear, who is coming,
> and what is still missing — **and nothing on that screen is something we invented.**

Build in this order: **data → store → date logic → Home → Day Sheet → Checklist**. Everything else is polish. Ship before 13 November, freeze before 13 November, and then let the family use it while you watch what breaks.

And keep the two documents honest. If a fact in the seed cannot be traced to a source in the dossier, it does not belong in the seed.

*End of build plan.* **Reasoning, evidence and seed data:** `wedding-context-and-reasoning.md`.
*Prepared 29 September 2026 — 45 days to Chhath, 69 days to the wedding.*
