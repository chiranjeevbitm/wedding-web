import { Link } from 'react-router-dom';
import { useStore, ALL_EVENTS } from '../lib/store.jsx';
import { CLUSTERS, EXCURSION } from '../data/events-b.js';
import { HOME_BASE, SEASON_META } from '../data/journey.js';
import { fmtDate, t } from '../lib/format.js';
import { Chip, Section } from '../components/ui.jsx';

export default function Journey() {
  const { state } = useStore();
  const lang = state.lang;
  const sorted = [...ALL_EVENTS].sort((a, b) => a.date.localeCompare(b.date));
  const groups = [
    { id: 'chhath', hi: 'छठ पूजा', en: 'Chhath Puja', icon: '☀' },
    { id: 'cousin', hi: 'कज़न की शादी', en: "Cousin's wedding", icon: '🪔' },
    { id: 'bridge', hi: 'तैयारी', en: 'Preparation', icon: '🧳' },
    { id: 'wedding', hi: 'भाई की शादी', en: "Brother's wedding", icon: '🌼' },
  ];
  return (
    <div className="wrap">
      <Section icon="🏠" title={t(HOME_BASE.title, lang)} sub={lang === 'hi' ? 'मुज़फ़्फ़रपुर · पूरा मौसम' : 'Muzaffarpur · whole season'} defaultOpen tint="tint-wedding">
        <p>{t(HOME_BASE.body, lang)}</p>
        <p className="small">⚡ Delhi 30 Nov → 3 Dec · {(EXCURSION.personIds || []).join(', ')} · <span className="muted">{t(EXCURSION.note, lang)}</span></p>
      </Section>
      <h2 style={{ marginTop: 18 }}>⋮ {lang === 'hi' ? 'पूरा सफ़र — एक कहानी' : 'Full journey — one story'}</h2>
      {groups.map((g, gi) => {
        const evs = sorted.filter(e => e.track === g.id);
        if (!evs.length) return null;
        return (
          <Section key={g.id} icon={g.icon} title={lang === 'hi' ? g.hi : g.en} count={evs.length} defaultOpen={gi >= 1} tint={g.id === 'wedding' ? 'tint-wedding' : g.id === 'chhath' ? 'tint-chhath' : g.id === 'cousin' ? 'tint-cousin' : 'tint-bridge'}>
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
      <Section icon="🪔" title={t(CLUSTERS[0].title, lang)} defaultOpen={false} tint="tint-cousin">
        {CLUSTERS[0].known.map(k => <div key={k.date} className="small">· {k.date} — {t(k.label, lang)}</div>)}
      </Section>
      <p className="small muted">{SEASON_META.season.start} → {SEASON_META.season.end} · 16 Dec {lang === 'hi' ? 'से खरमास — कोई शुभ काम नहीं' : 'Kharmas begins — nothing shubh'}</p>
    </div>
  );
}
