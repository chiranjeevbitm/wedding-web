// Store: localStorage first, Neon (via /api/state) when available. One context.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CHHATH_EVENTS, COUSIN_EVENTS, BRIDGE_EVENTS } from '../data/events-a.js';
import { WEDDING_EVENTS } from '../data/events-b.js';
import { KITS } from '../data/kits.js';
import { catOf } from '../data/cats.js';

export const ALL_EVENTS = [...CHHATH_EVENTS, ...COUSIN_EVENTS, ...BRIDGE_EVENTS, ...WEDDING_EVENTS];
const KEY = 'ghar-ki-shaadi-v2';

const seedItems = () => {
  const out = [];
  for (const k of KITS) for (const [i, it] of k.items.entries()) {
    const firstDay = (k.forDays[0] && k.forDays[0] !== '*') ? k.forDays[0] : null;
    const ev = ALL_EVENTS.find(e => e.id === firstDay);
    out.push({ id: `${k.id}-${i}`, kitId: k.id, name: it.name, category: it.category, done: false, dayId: firstDay, cat: ev ? catOf(ev.track) : 'wedding' });
  }
  return out;
};

const blank = () => ({ lang: 'hi', items: seedItems(), peopleSeed: [], notes: {}, wishes: [], feedback: [] });

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
  const [cloud, setCloud] = useState('local');

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }, [state]);

  useEffect(() => {
    fetch('/api/state').then(r => r.ok ? r.json() : null).then(d => {
      if (d && d.state) { setState(s => ({ ...load(), ...s, ...d.state })); setCloud('neon'); }
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
    reset: () => setState(blank()),
  }), [state, cloud]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
