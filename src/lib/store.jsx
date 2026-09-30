// Shared-state sync with Neon.
//
// What the family asked for ("edits must reach everyone"):
//   * ONE shared document in `app_state` — last write wins (updatedAt).
//   * PULL once at boot, then every 15 s → other people's edits arrive.
//   * PUSH debounced 700 ms after your own edit.
//   * Seeding fixed: an empty table used to leave everyone in "local" mode
//     forever; we now write the first row ourselves.
//   * localStorage stays as offline cache/fallback.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ALL_EVENTS } from '../data/all-events.js';
import { KITS } from '../data/kits.js';
import { catOf } from '../data/cats.js';
import { decide } from './sync.js';

export { ALL_EVENTS };
const KEY = 'ghar-ki-shaadi-v2';
const PULL_MS = 15000;
const PUSH_MS = 700;

const seedItems = () => {
  const out = [];
  for (const k of KITS) for (const [i, it] of k.items.entries()) {
    const firstDay = (k.forDays[0] && k.forDays[0] !== '*') ? k.forDays[0] : null;
    const ev = ALL_EVENTS.find(e => e.id === firstDay);
    out.push({ id: `${k.id}-${i}`, kitId: k.id, name: it.name, category: it.category, done: false, dayId: firstDay, cat: ev ? catOf(ev.track) : 'wedding' });
  }
  return out;
};

const blank = () => ({ lang: 'hi', items: seedItems(), peopleSeed: [], notes: {}, wishes: [], feedback: [], updatedAt: 0 });

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const p = JSON.parse(raw);
    // migrate v1 (people/rsvp) → v2
    const merged = { ...blank(), ...p };
    if (Array.isArray(p.people) && !p.peopleSeed) merged.peopleSeed = p.people;
    delete merged.people; delete merged.rsvp;
    merged.items = (merged.items || []).map(it => ({ cat: 'wedding', ...it, cat: it.cat || (it.dayId ? (catOf((ALL_EVENTS.find(e => e.id === it.dayId) || {}).track || 'wedding')) : 'wedding') }));
    return merged;
  } catch { return blank(); }
}

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);
  const [cloud, setCloud] = useState('checking'); // checking | neon | local
  const ref = useRef(state);
  ref.current = state;
  const pushTs = useRef(0);  // stamp of the last write we sent
  const seenTs = useRef(0);  // newest server stamp already accepted
  const adopting = useRef(false);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }, [state]);

  // PULL: once at boot, then every 15 s so edits reach everyone.
  useEffect(() => {
    let alive = true;
    const pull = async (initial) => {
      try {
        const r = await fetch('/api/state', { headers: { accept: 'application/json' } });
        if (!r.ok) throw new Error(`http ${r.status}`);
        const d = await r.json();
        if (!alive) return;
        setCloud('neon');
        const remote = d.state;
        const action = decide({ remote, initial, seenTs: seenTs.current, pushTs: pushTs.current });
        if (action === 'adopt') {
          seenTs.current = Number(remote.updatedAt) || 0;
          adopting.current = true;
          setState({ ...load(), ...remote });
          setTimeout(() => { adopting.current = false; }, 0);
        } else if (action === 'seed') {
          const stamp = Date.now();
          pushTs.current = stamp; seenTs.current = stamp;
          await fetch('/api/state', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ state: { ...ref.current, updatedAt: stamp } }),
          });
        } else if (remote) {
          seenTs.current = Math.max(seenTs.current, Number(remote.updatedAt) || 0);
        }
      } catch {
        if (initial && alive) setCloud('local');
      }
    };
    pull(true);
    const id = setInterval(() => pull(false), PULL_MS);
    return () => { alive = false; clearInterval(id); };
  }, []);

  // PUSH: debounced after your own edit.
  useEffect(() => {
    if (cloud !== 'neon') return;
    if (adopting.current) return;
    const id = setTimeout(async () => {
      const stamp = Date.now();
      pushTs.current = stamp; seenTs.current = stamp;
      try {
        await fetch('/api/state', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ state: { ...ref.current, updatedAt: stamp } }),
        });
        setCloud('neon');
      } catch { setCloud('local'); }
    }, PUSH_MS);
    return () => clearTimeout(id);
  }, [state, cloud]);

  // Fold server-side rows (wishes/feedback tables) into local state rows.
  // useCallback([]) keeps it identity-stable so polling effects don't churn.
  const mergeServer = useCallback((key, rows) => setState(s => {
    if (!Array.isArray(rows) || rows.length === 0) return s;
    const cur = s[key] || [];
    const has = new Set(cur.map(r => `${r.message}|${r.name}`));
    const extra = rows.filter(r => !has.has(`${r.message}|${r.name}`));
    return extra.length ? { ...s, [key]: [...cur, ...extra] } : s;
  }), []);

  const api = useMemo(() => ({
    state, cloud,
    setLang: (lang) => setState(s => ({ ...s, lang })),
    toggleItem: (id) => setState(s => ({ ...s, items: s.items.map(it => it.id === id ? { ...it, done: !it.done } : it) })),
    addItem: (item) => setState(s => ({ ...s, items: [{ id: 'u-' + Date.now(), done: false, cat: 'wedding', ...item }, ...s.items] })),
    editItem: (id, patch) => setState(s => ({ ...s, items: s.items.map(it => it.id === id ? { ...it, ...patch } : it) })),
    delItem: (id) => setState(s => ({ ...s, items: s.items.filter(it => it.id !== id) })),
    addKit: (kitId, dayId) => setState(s => {
      const kit = KITS.find(k => k.id === kitId);
      if (!kit) return s;
      const ev = ALL_EVENTS.find(e => e.id === dayId);
      const cat = ev ? catOf(ev.track) : 'wedding';
      const add = kit.items.map((it, i) => ({ id: `${kitId}-${dayId || 'any'}-${Date.now()}-${i}`, kitId, name: it.name, category: it.category, done: false, dayId: dayId || null, cat }));
      return { ...s, items: [...add, ...s.items] };
    }),
    addPerson: (p) => setState(s => ({ ...s, peopleSeed: [...(s.peopleSeed || []), { id: 'p-' + Date.now(), ...p }] })),
    editPerson: (id, patch) => setState(s => ({ ...s, peopleSeed: (s.peopleSeed || []).map(p => p.id === id ? { ...p, ...patch } : p) })),
    delPerson: (id) => setState(s => ({ ...s, peopleSeed: (s.peopleSeed || []).filter(p => p.id !== id) })),
    setNote: (dayId, text) => setState(s => ({ ...s, notes: { ...s.notes, [dayId]: text } })),
    addWish: async (w) => {
      setState(s => ({ ...s, wishes: [{ id: 'w-' + Date.now(), ...w }, ...(s.wishes || [])] }));
      try { await fetch('/api/wishes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(w) }); } catch {}
    },
    addFeedback: async (w) => {
      setState(s => ({ ...s, feedback: [{ id: 'f-' + Date.now(), ...w }, ...(s.feedback || [])] }));
      try { await fetch('/api/feedback', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(w) }); } catch {}
    },
    // Fold server-side rows (wishes/feedback tables) into local state rows.
    mergeServer,
    reset: () => setState(blank()),
  }), [state, cloud, mergeServer]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
