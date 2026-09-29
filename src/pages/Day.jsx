import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore, ALL_EVENTS } from '../lib/store.jsx';
import { KITS } from '../data/kits.js';
import { RITUALS } from '../data/rituals-b.js';
import { fmtDate, t } from '../lib/format.js';
import { Chip } from '../components/ui.jsx';

export default function Day() {
  const { id } = useParams();
  const { state, toggleItem, addItem, addKit, setNote } = useStore();
  const [tab, setTab] = useState('plan');
  const [newText, setNewText] = useState('');
  const [addedMsg, setAddedMsg] = useState('');
  const lang = state.lang;
  const idx = ALL_EVENTS.findIndex(e => e.id === id);
  const e = ALL_EVENTS[idx];
  const noDay = !e;
  if (noDay) return <div className="wrap"><div className="card"><h2>{lang === 'hi' ? 'दिन नहीं मिला' : 'Day not found'}</h2><Link className="btn" to="/calendar">{lang === 'hi' ? 'कैलेंडर' : 'Calendar'}</Link></div></div>;
  const items = state.items.filter(i => i.dayId === id);
  const doneCount = items.filter(i => i.done).length;
  const rituals = (e.ritualIds || []).map(rid => RITUALS.find(r => r.id === rid)).filter(Boolean);
  const prev = ALL_EVENTS[idx - 1], next = ALL_EVENTS[idx + 1];

  const saveItem = () => {
    if (!newText.trim()) return;
    addItem({ name: { hi: newText.trim(), en: newText.trim() }, category: 'custom', dayId: id });
    setNewText('');
    setAddedMsg(lang === 'hi' ? 'जोड़ दिया ✓' : 'Added ✓');
    setTimeout(() => setAddedMsg(''), 1600);
  };
  return (
    <div className="wrap">
      <div className="small muted"><Link to="/calendar">← {lang === 'hi' ? 'कैलेंडर' : 'Calendar'}</Link></div>
      <div className="card tint-wedding pop day-hero">
        <div className="small muted">{fmtDate(e.date, lang)} · {e.roman}</div>
        <h2 style={{ margin: '2px 0' }}>{t(e.title, lang)}</h2>
        <p className="muted" style={{ margin: '2px 0 8px' }}>{t(e.subtitle, lang)}</p>
        <div className="row"><Chip status={e.status} />{e.geetDay && <span className="chip">🎶 {lang === 'hi' ? 'गीत' : 'geet'}</span>}
          {items.length > 0 && <span className="chip">✓ {doneCount}/{items.length}</span>}</div>
      </div>
      <div className="seg no-print" role="tablist">
        {[['plan', lang === 'hi' ? 'कार्यक्रम' : 'Plan', '🗓'], ['items', `${lang === 'hi' ? 'सामान' : 'Items'} · ${items.length}`, '🧺'], ['why', lang === 'hi' ? 'क्यों?' : 'Why', '📿'], ['notes', lang === 'hi' ? 'नोट' : 'Notes', '✎']].map(([k, label, ic]) =>
          <button key={k} role="tab" aria-selected={tab === k} className={`seg-btn ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}><span>{ic}</span>{label}</button>)}
      </div>
      {tab === 'plan' && (
        <div className="card tint-wedding">
          <h3 style={{ marginTop: 0 }}>🗓 {lang === 'hi' ? 'कार्यक्रम' : 'Timeline'}</h3>
          <div className="timeline">
            {(e.slots || []).map((s, i) => <div key={i} className="tl-row pop" style={{ animationDelay: `${i * 60}ms` }}><b>{t(s.label, lang)}</b><div style={{ marginTop: 4 }}><Chip status={s.status} /></div></div>)}
          </div>
          <details className="fold" style={{ marginTop: 10 }}>
            <summary>{lang === 'hi' ? '🧺 किट से जोड़ें (एक टैप)' : '🧺 Add from kit (one tap)'}</summary>
            <div className="row">
              {(e.kitIds || []).map(kid => {
                const k = KITS.find(x => x.id === kid);
                return k ? <button key={kid} className="btn small ghost press" onClick={() => addKit(kid, id)}>＋ {t(k.name, lang)}</button> : null;
              })}
            </div>
          </details>
        </div>
      )}
      {tab === 'items' && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>🧺 {lang === 'hi' ? 'सामान' : 'Items'} · {doneCount}/{items.length}</h3>
          {items.length > 0 && <div className="progress" style={{ marginBottom: 10 }}><i style={{ width: `${Math.round(doneCount / items.length * 100)}%` }} /></div>}
          <div className="addrow no-print">
            <input value={newText} onChange={ev => setNewText(ev.target.value)} onKeyDown={ev => ev.key === 'Enter' && saveItem()}
              placeholder={lang === 'hi' ? 'इस दिन के लिए लिखें…' : 'Add for this day…'} aria-label={lang === 'hi' ? 'सामान जोड़ें' : 'Add item'} />
            <button className="btn small press" onClick={saveItem}>{lang === 'hi' ? 'जोड़ें' : 'Add'}</button>
          </div>
          {addedMsg && <p className="small pop" style={{ color: 'var(--mehendi)' }}>{addedMsg}</p>}
          {items.length === 0 && <p className="muted small">{lang === 'hi' ? 'अभी कुछ नहीं — ऊपर लिखकर जोड़ें, या Plan से किट लें।' : 'Nothing yet — type above, or take a kit from Plan.'}</p>}
          {items.map(it => (
            <label key={it.id} className="checkrow">
              <input type="checkbox" checked={!!it.done} onChange={() => toggleItem(it.id)} />
              <span className={it.done ? 'struck' : ''}>{t(it.name, lang)}</span>
              <span className="small muted right">{it.category}</span>
            </label>
          ))}
        </div>
      )}
      {tab === 'why' && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>📿 {lang === 'hi' ? 'क्यों?' : 'Why?'}</h3>
          {rituals.length === 0 && <p className="muted">{lang === 'hi' ? 'इस दिन की रस्म गाइड में नहीं है।' : 'No guide entry for this day.'}</p>}
          {rituals.map(r => (
            <details key={r.id} className="fold">
              <summary>{t(r.name, lang)} <span className="small muted">· {t(r.when, lang)}</span></summary>
              <p className="small"><b>{lang === 'hi' ? 'परंपरा में:' : 'Traditionally:'}</b> {t(r.context, lang)}</p>
              <p className="small muted">⚠ {lang === 'hi' ? 'सामान्य जानकारी — पंडित जी/बड़ों से पुष्टि करें।' : 'General info — confirm with pandit/elders.'}</p>
            </details>
          ))}
        </div>
      )}
      {tab === 'notes' && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>✎ {lang === 'hi' ? 'नोट' : 'Notes'}</h3>
          <label>{lang === 'hi' ? 'इस दिन का नोट' : 'Note for this day'}</label>
          <textarea rows={4} value={state.notes[id] || ''} onChange={ev => setNote(id, ev.target.value)} placeholder={lang === 'hi' ? 'ठीक है, लिख लिया…' : 'Noted…'} />
          <p className="small muted">{lang === 'hi' ? 'इसी फ़ोन + Neon में सेव।' : 'Saved on phone + Neon.'}</p>
        </div>
      )}
      <div className="row" style={{ marginTop: 12 }}>
        {prev && <Link className="btn small ghost press" to={`/day/${prev.id}`}>← {t(prev.title, lang)}</Link>}
        {next && <Link className="btn small ghost press" to={`/day/${next.id}`}>{t(next.title, lang)} →</Link>}
      </div>
    </div>
  );
}
