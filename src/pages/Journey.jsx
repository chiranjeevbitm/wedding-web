import { Link } from 'react-router-dom';
import { useStore, ALL_EVENTS } from '../lib/store.jsx';
import { CLUSTERS, EXCURSION } from '../data/events-b.js';
import { HOME_BASE, SEASON_META } from '../data/journey.js';
import { fmtDate, t } from '../lib/format.js';
import { Chip } from '../components/ui.jsx';

export default function Journey() {
  const { state } = useStore();
  const lang = state.lang;
  const sorted = [...ALL_EVENTS].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="wrap">
      <div className="card tint-wedding">
        <div className="small muted">🏠 {t(HOME_BASE.title, lang)}</div>
        <p>{t(HOME_BASE.body, lang)}</p>
        <p className="small">⚡ Delhi 30 Nov → 3 Dec · {(EXCURSION.personIds || []).join(', ')} · <span className="muted">{t(EXCURSION.note, lang)}</span></p>
      </div>
      <h2 style={{ marginTop: 18 }}>⋮ {lang === 'hi' ? 'पूरा सफ़र — एक कहानी' : 'Full journey — one story'}</h2>
      <div className="timeline">
        {sorted.map(e => (
          <div key={e.id} className="card" style={{ margin: 0 }}>
            <span className="dot" />
            <div className="small muted">{fmtDate(e.date, lang)} · {e.roman}</div>
            <h3 style={{ margin: '2px 0' }}><Link to={`/day/${e.id}`}>{t(e.title, lang)}</Link></h3>
            <div className="small muted">{t(e.subtitle, lang)}</div>
            <div className="row" style={{ marginTop: 6 }}><Chip status={e.status} />{e.geetDay && <span className="chip">🎶 {lang === 'hi' ? 'गीत' : 'geet'}</span>}</div>
          </div>
        ))}
      </div>
      <div className="card tint-cousin">
        <h3>🪔 {t(CLUSTERS[0].title, lang)}</h3>
        {CLUSTERS[0].known.map(k => <div key={k.date} className="small">· {k.date} — {t(k.label, lang)}</div>)}
      </div>
      <p className="small muted">{SEASON_META.season.start} → {SEASON_META.season.end} · 16 Dec {lang === 'hi' ? 'से खरमास — कोई शुभ काम नहीं' : 'Kharmas begins — nothing shubh'}</p>
    </div>
  );
}
