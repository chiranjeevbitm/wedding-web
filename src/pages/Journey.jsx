import { Link } from 'react-router-dom';
import { useStore, ALL_EVENTS } from '../lib/store.jsx';
import { EXCURSION } from '../data/events-b.js';
import { HOME_BASE, SEASON_META } from '../data/journey.js';
import { CATS, catOf } from '../data/cats.js';
import { fmtDate, t } from '../lib/format.js';
import { Chip, Section } from '../components/ui.jsx';

export default function Journey() {
  const { state } = useStore();
  const lang = state.lang;
  const sorted = [...ALL_EVENTS].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="wrap">
      <Section icon="🏠" title={t(HOME_BASE.title, lang)} sub={lang === 'hi' ? 'मुज़फ़्फ़रपुर · पूरा मौसम' : 'Muzaffarpur · whole season'} defaultOpen tint="tint-wedding">
        <p>{t(HOME_BASE.body, lang)}</p>
        <p className="small">⚡ Delhi 30 Nov → 3 Dec · {(EXCURSION.personIds || []).join(', ')} · <span className="muted">{t(EXCURSION.note, lang)}</span></p>
      </Section>
      <h2 style={{ marginTop: 18 }}>⋮ {lang === 'hi' ? 'पूरा सफ़र — 3 पड़ाव' : 'Full journey — 3 chapters'}</h2>
      {CATS.map((g, gi) => {
        const evs = sorted.filter(e => catOf(e.track) === g.id);
        if (!evs.length) return null;
        const dates = evs.map(e => e.date).sort();
        return (
          <Section key={g.id} icon={g.icon} title={lang === 'hi' ? g.hi : g.en} sub={`${dates[0]} → ${dates[dates.length - 1]}`} count={evs.length} defaultOpen={gi > 0} tint={g.tint}>
            <div className="timeline">
              {evs.map(e => (
                <div key={e.id} className="tl-row pop">
                  <div className="small muted">{fmtDate(e.date, lang)} · {e.roman}</div>
                  <h3 style={{ margin: '2px 0' }}><Link to={`/day/${e.id}`}>{t(e.title, lang)}</Link></h3>
                  <div className="small muted">{t(e.subtitle, lang)}</div>
                  <div className="row" style={{ marginTop: 6 }}><Chip status={e.status} />{e.geetDay && <span className="chip">🎶 {lang === 'hi' ? 'गीत' : 'geet'}</span>}</div>
                </div>
              ))}
            </div>
          </Section>
        );
      })}
      <p className="small muted">{SEASON_META.season.start} → {SEASON_META.season.end} · 16 Dec {lang === 'hi' ? 'से खरमास — कोई शुभ काम नहीं' : 'Kharmas begins — nothing shubh'}</p>
    </div>
  );
}
