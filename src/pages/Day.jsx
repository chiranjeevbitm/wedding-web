import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore, ALL_EVENTS } from '../lib/store.jsx';
import { KITS } from '../data/kits.js';
import { RITUALS } from '../data/rituals-b.js';
import { fmtDate, t } from '../lib/format.js';
import { Chip } from '../components/ui.jsx';

export default function Day() {
  const { id } = useParams();
  const { state, toggleItem, addKit, setNote } = useStore();
  const [tab, setTab] = useState('plan');
  const lang = state.lang;
  const idx = ALL_EVENTS.findIndex(e => e.id === id);
  const e = ALL_EVENTS[idx];
  if (!e) return <div className="wrap"><div className="card"><h2>दिन नहीं मिला</h2><Link className="btn" to="/calendar">कैलेंडर</Link></div></div>;
  const items = state.items.filter(i => i.dayId === id);
  const rituals = (e.ritualIds || []).map(rid => RITUALS.find(r => r.id === rid)).filter(Boolean);
  const prev = ALL_EVENTS[idx - 1], next = ALL_EVENTS[idx + 1];
  return (
    <div className="wrap">
      <div className="small muted"><Link to="/calendar">← {lang === 'hi' ? 'कैलेंडर' : 'Calendar'}</Link></div>
      <h2>{t(e.title, lang)}</h2>
      <div className="row"><span className="muted">{fmtDate(e.date, lang)} · {e.roman}</span><Chip status={e.status} /></div>
      <p className="muted">{t(e.subtitle, lang)}</p>
      <div className="row no-print">
        {[['plan', lang === 'hi' ? 'कार्यक्रम' : 'Plan'], ['items', `${lang === 'hi' ? 'सामान' : 'Items'} (${items.length})`], ['why', lang === 'hi' ? 'क्यों?' : 'Why'], ['notes', lang === 'hi' ? 'नोट' : 'Notes']].map(([k, label]) =>
          <button key={k} className={`btn small ${tab === k ? '' : 'ghost'}`} onClick={() => setTab(k)}>{label}</button>)}
      </div>
      {tab === 'plan' && (
        <div className="card tint-wedding">
          <div className="timeline">
            {(e.slots || []).map((s, i) => <div key={i}><b>{t(s.label, lang)}</b><div><Chip status={s.status} /></div></div>)}
          </div>
          {(e.kitIds || []).length > 0 && (
            <div className="row" style={{ marginTop: 12 }}>
              {(e.kitIds || []).map(kid => {
                const k = KITS.find(x => x.id === kid);
                return k ? <button key={kid} className="btn small ghost" onClick={() => addKit(kid, id)}>＋ {t(k.name, lang)}</button> : null;
              })}
            </div>
          )}
        </div>
      )}
      {tab === 'items' && (
        <div className="card">
          {items.length === 0 && <p className="muted">{lang === 'hi' ? 'अभी कुछ नहीं — ऊपर से किट जोड़ें।' : 'Nothing yet — add a kit from Plan.'}</p>}
          {items.map(it => (
            <label key={it.id} className="row" style={{ borderBottom: '1px solid var(--line)', padding: '8px 0', fontWeight: 400 }}>
              <input type="checkbox" checked={!!it.done} onChange={() => toggleItem(it.id)} style={{ width: 22 }} />
              <span style={{ textDecoration: it.done ? 'line-through' : 'none' }}>{t(it.name, lang)}</span>
            </label>
          ))}
        </div>
      )}
      {tab === 'why' && (
        <div className="card">
          {rituals.length === 0 && <p className="muted">{lang === 'hi' ? 'इस दिन की रस्म गाइड में नहीं है।' : 'No guide entry for this day.'}</p>}
          {rituals.map(r => (
            <div key={r.id} style={{ marginBottom: 14 }}>
              <h3>{t(r.name, lang)}</h3>
              <p className="small"><b>{lang === 'hi' ? 'परंपरा में (सामान्य):' : 'Traditionally:'}</b> {t(r.context, lang)}</p>
              <p className="small muted">{lang === 'hi' ? 'हमारे घर में: (परिवार भरेगा)' : 'Our family: (to be filled)'} {t(r.family, lang)}</p>
              <p className="small muted">⚠ {lang === 'hi' ? 'यह सामान्य जानकारी है — पंडित जी/बड़ों से पुष्टि करें।' : 'General info — confirm with pandit/elders.'}</p>
            </div>
          ))}
        </div>
      )}
      {tab === 'notes' && (
        <div className="card">
          <label>{lang === 'hi' ? 'इस दिन का नोट' : 'Note for this day'}</label>
          <textarea rows={4} value={state.notes[id] || ''} onChange={ev => setNote(id, ev.target.value)} placeholder={lang === 'hi' ? 'ठीक है, लिख लिया…' : 'Noted…'} />
        </div>
      )}
      <div className="row">
        {prev && <Link className="btn small ghost" to={`/day/${prev.id}`}>← {t(prev.title, lang)}</Link>}
        {next && <Link className="btn small ghost" to={`/day/${next.id}`}>{t(next.title, lang)} →</Link>}
      </div>
    </div>
  );
}
