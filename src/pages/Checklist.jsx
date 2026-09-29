import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { KITS } from '../data/kits.js';
import { t } from '../lib/format.js';

export default function Checklist() {
  const { state, toggleItem, addItem, addKit } = useStore();
  const lang = state.lang;
  const [filter, setFilter] = useState('all');
  const [text, setText] = useState('');
  const cats = ['all', ...new Set(state.items.map(i => i.category))];
  const list = state.items.filter(i => filter === 'all' || i.category === filter);
  const done = state.items.filter(i => i.done).length;
  return (
    <div className="wrap">
      <h2>✓ {lang === 'hi' ? 'कुल चेकलिस्ट' : 'Master checklist'} — {done}/{state.items.length}</h2>
      <div className="progress"><i style={{ width: `${state.items.length ? Math.round(done / state.items.length * 100) : 0}%` }} /></div>
      <div className="row no-print" style={{ marginTop: 10 }}>
        {cats.map(c => <button key={c} className={`btn small ${filter === c ? '' : 'ghost'}`} onClick={() => setFilter(c)}>{c === 'all' ? (lang === 'hi' ? 'सब' : 'All') : c}</button>)}
      </div>
      <div className="card no-print">
        <label>{lang === 'hi' ? '+ अपना काम जोड़ें' : '+ Add your own task'}</label>
        <div className="row">
          <input value={text} onChange={e => setText(e.target.value)} placeholder={lang === 'hi' ? 'जैसे: दर्जी से कपड़े लेना' : 'e.g. pick up clothes'} style={{ flex: 1 }} />
          <button className="btn small" onClick={() => { if (text.trim()) { addItem({ name: { hi: text.trim(), en: text.trim() }, category: 'custom', dayId: null }); setText(''); } }}>{lang === 'hi' ? 'जोड़ें' : 'Add'}</button>
        </div>
      </div>
      <div className="card">
        {list.map(it => (
          <label key={it.id} className="row" style={{ borderBottom: '1px solid var(--line)', padding: '8px 0', fontWeight: 400 }}>
            <input type="checkbox" checked={!!it.done} onChange={() => toggleItem(it.id)} style={{ width: 22 }} />
            <span style={{ textDecoration: it.done ? 'line-through' : 'none' }}>{t(it.name, lang)}</span>
            <span className="small muted" style={{ marginLeft: 'auto' }}>{it.category}</span>
          </label>
        ))}
        {list.length === 0 && <p className="muted">{lang === 'hi' ? 'इस फ़िल्टर में कुछ नहीं' : 'Nothing here'}</p>}
      </div>
      <div className="card">
        <h3>{lang === 'hi' ? 'एक टैप में किट जोड़ें' : 'Add a kit in one tap'}</h3>
        {KITS.map(k => <div key={k.id} className="row" style={{ padding: '6px 0', borderBottom: '1px solid var(--line)' }}><span>{t(k.name, lang)}</span><button className="btn small ghost" style={{ marginLeft: 'auto' }} onClick={() => addKit(k.id, null)}>＋</button></div>)}
      </div>
    </div>
  );
}
