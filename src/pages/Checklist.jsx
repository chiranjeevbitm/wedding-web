import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, ALL_EVENTS } from '../lib/store.jsx';
import { KITS } from '../data/kits.js';
import { fmtDate, t } from '../lib/format.js';
import { CATS } from '../data/cats.js';
import { ANY, groupByDay, groupProgress } from '../lib/order.js';
import { Section } from '../components/ui.jsx';

// Checklist is ordered by DATE: 13 Nov → 13 Dec, then the "anytime" bucket.
const eventOf = (dayId) => ALL_EVENTS.find(e => e.id === dayId);
const dayLabel = (dayId, lang) => {
  if (dayId === ANY) {
    return {
      title: lang === 'hi' ? 'बिना दिन (कभी भी)' : 'Anytime',
      sub: lang === 'hi' ? 'इन्हें किसी भी दिन कर सकते हैं' : 'Can be done on any day',
    };
  }
  const e = eventOf(dayId);
  if (!e) return { title: dayId, sub: '' };
  return { title: t(e.title, lang), sub: fmtDate(e.date, lang) };
};

export default function Checklist() {
  const { state, toggleItem, addItem, editItem, delItem, addKit } = useStore();
  const lang = state.lang;
  const [cat, setCat] = useState('wedding');
  const [texts, setTexts] = useState({});
  const [editing, setEditing] = useState(null);
  const [editTxt, setEditTxt] = useState('');
  const inCat = state.items.filter(i => (i.cat || 'wedding') === cat);
  const done = inCat.filter(i => i.done).length;
  const groups = groupByDay(inCat, ALL_EVENTS); // ordered 13 Nov → 13 Dec, "anytime" last
  const catMeta = CATS.find(c => c.id === cat);
  const save = (day) => {
    const v = (texts[day] || '').trim();
    if (!v) return;
    addItem({ name: { hi: v, en: v }, category: 'custom', dayId: day === ANY ? null : day, cat });
    setTexts(s => ({ ...s, [day]: '' }));
  };
  return (
    <div className="wrap">
      <h2 className="float-hi">✓ {lang === 'hi' ? 'चेकलिस्ट' : 'Checklist'} — {done}/{inCat.length}</h2>
      <div className="progress"><i style={{ width: `${inCat.length ? Math.round(done / inCat.length * 100) : 0}%` }} /></div>
      <div className="seg no-print catseg">
        {CATS.map(c => <button key={c.id} className={`seg-btn press ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}><span>{c.icon}</span>{lang === 'hi' ? c.hi : c.en}</button>)}
      </div>
      <p className="small muted">
        {catMeta.icon} {catMeta.range} · {lang === 'hi' ? 'तारीख़ के क्रम में' : 'in date order'} · {groups.length} {lang === 'hi' ? 'दिन' : 'days'}
      </p>
      {groups.map(({ day, items: arr }, i) => {
        const { done: d, pct } = groupProgress(arr);
        const label = dayLabel(day, lang);
        const e = eventOf(day);
        return (
          <Section key={day} icon={e ? '🧺' : '📌'} title={label.title} sub={label.sub} count={`${d}/${arr.length}`} defaultOpen={i === 0}>
            <div className="progress" style={{ marginBottom: 8 }}>
              <i style={{ width: `${pct}%` }} />
            </div>
            {arr.map(it => (
              <div key={it.id} className="checkrow">
                <input type="checkbox" checked={!!it.done} onChange={() => toggleItem(it.id)} aria-label="done" />
                {editing === it.id
                  ? <input value={editTxt} autoFocus style={{ flex: 1 }} onChange={ev => setEditTxt(ev.target.value)} onKeyDown={ev => { if (ev.key === 'Enter' && editTxt.trim()) { editItem(it.id, { name: { hi: editTxt.trim(), en: editTxt.trim() } }); setEditing(null); } if (ev.key === 'Escape') setEditing(null); }} />
                  : <span className={it.done ? 'struck' : ''} style={{ flex: 1 }}>{t(it.name, lang)}</span>}
                <span className="rowbtns no-print">
                  {editing === it.id
                    ? <><button className="iconbtn" aria-label="save" onClick={() => { if (editTxt.trim()) editItem(it.id, { name: { hi: editTxt.trim(), en: editTxt.trim() } }); setEditing(null); }}>✔</button><button className="iconbtn" aria-label="cancel" onClick={() => setEditing(null)}>✕</button></>
                    : <><button className="iconbtn" aria-label="edit" onClick={() => { setEditing(it.id); setEditTxt(t(it.name, lang)); }}>✎</button><button className="iconbtn danger" aria-label="delete" onClick={() => { if (confirm(lang === 'hi' ? 'हटाएँ?' : 'Delete?')) delItem(it.id); }}>🗑</button></>}
                </span>
              </div>
            ))}
            <div className="addrow no-print" style={{ marginTop: 8 }}>
              <input value={texts[day] || ''} onChange={ev => setTexts(s => ({ ...s, [day]: ev.target.value }))} onKeyDown={ev => ev.key === 'Enter' && save(day)} placeholder={lang === 'hi' ? '+ इस दिन में जोड़ें…' : '+ Add to this day…'} />
              <button className="btn small press" onClick={() => save(day)}>{lang === 'hi' ? 'जोड़ें' : 'Add'}</button>
            </div>
          </Section>
        );
      })}
      {inCat.length === 0 && <p className="muted">{lang === 'hi' ? 'यहाँ अभी कुछ नहीं — नीचे से किट जोड़ें।' : 'Nothing here yet — add a kit below.'}</p>}
      <Section icon="⚡" title={lang === 'hi' ? 'एक टैप में किट जोड़ें' : 'Add a kit in one tap'} count={KITS.length} defaultOpen={false}>
        {KITS.map(k => <div key={k.id} className="checkrow"><span>{t(k.name, lang)}</span><button className="btn small ghost press right" onClick={() => addKit(k.id, (k.forDays[0] && k.forDays[0] !== '*') ? k.forDays[0] : null)}>＋</button></div>)}
      </Section>
      <p className="small muted"><Link to="/journey">{lang === 'hi' ? '← सफ़र में तारीख़ देखें' : '← See dates in Journey'}</Link></p>
    </div>
  );
}
