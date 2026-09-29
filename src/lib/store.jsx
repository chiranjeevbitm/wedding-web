// Store: localStorage first, Neon (via /api/state) when available. One context.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CHHATH_EVENTS, COUSIN_EVENTS, BRIDGE_EVENTS } from '../data/events-a.js';
import { WEDDING_EVENTS } from '../data/events-b.js';
import { KITS } from '../data/kits.js';

export const ALL_EVENTS = [...CHHATH_EVENTS, ...COUSIN_EVENTS, ...BRIDGE_EVENTS, ...WEDDING_EVENTS];
const KEY = 'ghar-ki-shaadi-v1';

const seedItems = () => {
  const out = [];
  for (const k of KITS) for (const [i, it] of k.items.entries())
    out.push({ id: `${k.id}-${i}`, kitId: k.id, name: it.name, category: it.category, done: false, dayId: (k.forDays[0] && k.forDays[0] !== '*') ? k.forDays[0] : null });
  return out;
};

const blank = () => ({ lang: 'hi', items: seedItems(), people: [], notes: {}, rsvp: [], wishes: [] });

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const p = JSON.parse(raw);
    return { ...blank(), ...p };
  } catch { return blank(); }
}

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);
  const [cloud, setCloud] = useState('local');

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }, [state]);

  // Try cloud sync (Neon). Silent fallback to local.
  useEffect(() => {
    fetch('/api/state').then(r => r.ok ? r.json() : null).then(d => {
      if (d && d.state) { setState(s => ({ ...s, ...d.state })); setCloud('neon'); }
    }).catch(() => {});
  }, []);
  useEffect(() => {
    if (cloud !== 'neon') return;
    const id = setTimeout(() => {
      fetch('/api/state', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ state }) }).catch(() => setCloud('local'));
    }, 1200);
    return () => clearTimeout(id);
  }, [state, cloud]);

  const api = useMemo(() => ({
    state, cloud,
    setLang: (lang) => setState(s => ({ ...s, lang })),
    toggleItem: (id) => setState(s => ({ ...s, items: s.items.map(it => it.id === id ? { ...it, done: !it.done } : it) })),
    addItem: (item) => setState(s => ({ ...s, items: [{ id: 'u-' + Date.now(), done: false, ...item }, ...s.items] })),
    addKit: (kitId, dayId) => setState(s => {
      const kit = KITS.find(k => k.id === kitId);
      if (!kit) return s;
      const add = kit.items.map((it, i) => ({ id: `${kitId}-${dayId || 'any'}-${Date.now()}-${i}`, kitId, name: it.name, category: it.category, done: false, dayId: dayId || null }));
      return { ...s, items: [...add, ...s.items] };
    }),
    addPerson: (p) => setState(s => ({ ...s, people: [...s.people, { id: 'p-' + Date.now(), ...p }] })),
    setNote: (dayId, text) => setState(s => ({ ...s, notes: { ...s.notes, [dayId]: text } })),
    addRsvp: async (r) => {
      setState(s => ({ ...s, rsvp: [{ id: 'r-' + Date.now(), ...r }, ...(s.rsvp || [])] }));
      try { await fetch('/api/rsvp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(r) }); } catch {}
    },
    addWish: async (w) => {
      setState(s => ({ ...s, wishes: [{ id: 'w-' + Date.now(), ...w }, ...(s.wishes || [])] }));
      try { await fetch('/api/wishes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(w) }); } catch {}
    },
    reset: () => setState(blank()),
  }), [state, cloud]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
