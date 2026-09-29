import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, ALL_EVENTS } from '../lib/store.jsx';
import { t } from '../lib/format.js';

const MONTHS = [['2026-11', 'नवंबर 2026 · November'], ['2026-12', 'दिसंबर 2026 · December']];

export default function Calendar() {
  const { state } = useStore();
  const [month, setMonth] = useState('2026-12');
  const byDate = useMemo(() => Object.fromEntries(ALL_EVENTS.map(e => [e.date, e])), []);
  const [y, m] = month.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const startDay = (first.getDay() + 6) % 7; // Monday start
  const days = new Date(y, m, 0).getDate();
  const cells = [...Array(startDay).fill(null), ...Array.from({ length: days }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`)];
  return (
    <div className="wrap">
      <h2>▦ {state.lang === 'hi' ? 'कैलेंडर' : 'Calendar'}</h2>
      <div className="row no-print">{MONTHS.map(([id, label]) => <button key={id} className={`btn small ${month === id ? '' : 'ghost'}`} onClick={() => setMonth(id)}>{label}</button>)}</div>
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, textAlign: 'center' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <b key={i} className="small muted">{d}</b>)}
          {cells.map((d, i) => {
            const e = d && byDate[d];
            return (
              <div key={i} style={{ minHeight: 56, border: '1px solid var(--line)', borderRadius: 10, padding: 4, background: e ? 'var(--tint-wedding)' : '#fff' }}>
                {d && <>
                  <div className="small"><b>{Number(d.slice(8))}</b></div>
                  {e ? <Link className="small" to={`/day/${e.id}`} title={t(e.title, state.lang)}>{e.track === 'chhath' ? '☀' : e.track === 'cousin' ? '🪔' : e.track === 'bridge' ? '🧳' : '🌼'}</Link> : null}
                </>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="card">
        <h3>{state.lang === 'hi' ? 'इस महीने के फंक्शन' : 'This month'}</h3>
        {ALL_EVENTS.filter(e => e.date.startsWith(month)).map(e => <div key={e.id} className="small">· {e.date} — <Link to={`/day/${e.id}`}>{t(e.title, state.lang)}</Link></div>)}
      </div>
    </div>
  );
}
