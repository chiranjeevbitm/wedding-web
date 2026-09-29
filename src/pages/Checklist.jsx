import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { KITS } from '../data/kits.js';
import { t } from '../lib/format.js';
import { Section } from '../components/ui.jsx';

export default function Checklist() {
  const { state, toggleItem, addItem, addKit } = useStore();
  const lang = state.lang;
  const [filter, setFilter] = useState('all');
  const [text, setText] = useState('');
  const cats = ['all', ...new Set(state.items.map(i => i.category))];
  const list = state.items.filter(i => filter === 'all' || i.category === filter);
  const done = state.items.filter(i => i.done).length;
  const byDay = {};
  for (const it of list) { const k = it.dayId || (lang === 'hi' ? 'बिना दिन' : 'anytime'); (byDay[k] = byDay[k] || []).push(it); }
  return (
    <div className="wrap">
      <h2>✓ {lang === 'hi' ? 'कुल चेकलिस्ट' : 'Master checklist'} — {done}/{state.items.length}</h2>
      <div className="progress"><i style={{ width: `${state.items.length ? Math.round(done / state.items.length * 100) : 0}%` }} /></div>
      <div className="seg no-print">
        {cats.map(c => <button key={c} className={`seg-btn press ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>{c === 'all' ? (lang === 'hi' ? 'सब' : 'All') : c}</button>)}
      </div>
      <Section icon="＋" title={lang === 'hi' ? 'अपना काम जोड़ें' : 'Add your own'} defaultOpen={false}>
        <div className="addrow">
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && text.trim() && (addItem({ name: { hi: text.trim(), en: text.trim() }, category: 'custom', dayId: null }), setText(''))} placeholder={lang === 'hi' ? 'जैसे: दर्जी से कपड़े लेना' : 'e.g. pick up clothes'} />
          <button className="btn small press" onClick={() => { if (text.trim()) { addItem({ name: { hi: text.trim(), en: text.trim() }, category: 'custom', dayId: null }); setText(''); } }}>{lang === 'hi' ? 'जोड़ें' : 'Add'}</button>
        </div>
      </Section>
      {Object.entries(byDay).map(([day, arr]) => (
        <Section key={day} icon="🧺" title={day} count={`${arr.filter(a => a.done).length}/${arr.length}`} defaultOpen={day !== (lang === 'hi' ? 'बिना दिन' : 'anytime')}>
          {arr.map(it => (
            <label key={it.id} className="checkrow">
              <input type="checkbox" checked={!!it.done} onChange={() => toggleItem(it.id)} />
              <span className={it.done ? 'struck' : ''}>{t(it.name, lang)}</span>
              <span className="small muted right">{it.category}</span>
            </label>
          ))}
        </Section>
      ))}
      {list.length === 0 && <p className="muted">{lang === 'hi' ? 'इस फ़िल्टर में कुछ नहीं' : 'Nothing here'}</p>}
      <Section icon="⚡" title={lang === 'hi' ? 'एक टैप में किट जोड़ें' : 'Add a kit in one tap'} count={KITS.length} defaultOpen={false}>
        {KITS.map(k => <div key={k.id} className="checkrow"><span>{t(k.name, lang)}</span><button className="btn small ghost press right" onClick={() => addKit(k.id, null)}>＋</button></div>)}
      </Section>
    </div>
  );
}
