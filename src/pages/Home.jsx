import { Link } from 'react-router-dom';
import { useStore, ALL_EVENTS } from '../lib/store.jsx';
import { SEASON_META, TRACKS } from '../data/journey.js';
import { daysUntil, fmtDate, t } from '../lib/format.js';
import { Chip, FolkBorder, Section } from '../components/ui.jsx';

export default function Home() {
  const { state } = useStore();
  const lang = state.lang;
  const today = new Date().toISOString().slice(0, 10);
  const next = SEASON_META.milestones.find(m => m.date >= today) || SEASON_META.milestones.at(-1);
  const dNext = daysUntil(next.date);
  const dShaadi = daysUntil('2026-12-11');
  const todayEv = ALL_EVENTS.filter(e => e.date === today);
  const upcoming = ALL_EVENTS.filter(e => e.date > today).slice(0, 3);
  const done = state.items.filter(i => i.done).length;

  return (
    <>
      <section className="hero">
        <div className="om">ॐ</div>
        <h1><span className="hi">{lang === 'hi' ? SEASON_META.title.hi : SEASON_META.title.en}</span></h1>
        <div className="couple">Dr Deepak × Alka</div>
        <p className="place">{lang === 'hi' ? `${SEASON_META.place.hi} · ${SEASON_META.place.note.hi}` : `${SEASON_META.place.city} · ${SEASON_META.place.note.en}`}</p>
        <div><span className="dates">{lang === 'hi' ? '07 — 13 दिसंबर 2026 · मुज़फ़्फ़रपुर' : '07 — 13 December 2026 · Muzaffarpur'}</span></div>
        <p className="tagline">{t(SEASON_META.tagline, lang)}</p>
        <div style={{ marginTop: 8 }}><FolkBorder /></div>
      </section>
      <div className="wrap">
        <div className="grid two">
          <div className="card tint-wedding pop">
            <div className="small muted">{lang === 'hi' ? 'अगला पड़ाव' : 'Next milestone'} · {t(next.label, lang)}</div>
            <div className="count-big">{dNext <= 0 ? (lang === 'hi' ? 'आज' : 'Today') : `${dNext} ${lang === 'hi' ? 'दिन बाक़ी' : 'days to go'}`}</div>
            <div className="small muted">{fmtDate(next.date, lang)} · {lang === 'hi' ? 'शादी में' : 'to shaadi'}: {dShaadi} {lang === 'hi' ? 'दिन' : 'days'}</div>
          </div>
          <div className="card pop">
            <div className="small muted">{lang === 'hi' ? 'आज' : 'Today'} · {fmtDate(today, lang)}</div>
            {todayEv.length === 0 ? <p>{lang === 'hi' ? 'आज कोई फंक्शन नहीं · आराम। आगे:' : 'No function today. Next:'}</p> :
              todayEv.map(e => <div key={e.id}><h3 style={{ marginBottom: 2 }}>{t(e.title, lang)}</h3><div className="row"><Chip status={e.status} /><Link className="btn small press" to={`/day/${e.id}`}>{lang === 'hi' ? 'आज का प्लान →' : 'Today’s plan →'}</Link></div></div>)}
            {upcoming.map(e => <div key={e.id} className="small">· {fmtDate(e.date, lang)} — <Link to={`/day/${e.id}`}>{t(e.title, lang)}</Link></div>)}
          </div>
        </div>

        <Section icon="🌼" title={lang === 'hi' ? 'परिवार का मौसम' : 'Family season'} sub={lang === 'hi' ? '4 पड़ाव · टैप करके खोलें' : '4 tracks · tap to open'} count={TRACKS.length} defaultOpen>
          <div className="grid two">
            {TRACKS.map(tr => (
              <Link key={tr.id} to="/journey" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={`card press ${tr.tint}`} style={{ margin: 0 }}>
                  <div style={{ fontSize: 26 }}>{tr.icon}</div>
                  <h3>{lang === 'hi' ? tr.hi : tr.en}</h3>
                  <div className="small muted">{t(tr.line, lang)}</div>
                  <div className="small">{tr.start} → {tr.end}</div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <Section icon="✓" title={lang === 'hi' ? 'तैयारी' : 'Preparation'} sub={`${done}/${state.items.length}`} count={`${state.items.length ? Math.round(done / state.items.length * 100) : 0}%`} defaultOpen={false} tint="tint-wedding">
          <div className="progress"><i style={{ width: `${state.items.length ? Math.round(done / state.items.length * 100) : 0}%` }} /></div>
          <div className="row" style={{ marginTop: 10 }}>
            <Link className="btn small press" to="/checklist">{lang === 'hi' ? 'चेकलिस्ट खोलें' : 'Open checklist'}</Link>
            <Link className="btn small ghost press" to="/rsvp">RSVP · {lang === 'hi' ? 'शुभकामना' : 'Wishes'}</Link>
          </div>
        </Section>
        <p className="small muted">~ {lang === 'hi' ? 'वाली तारीख़ें पक्की नहीं — पंडित जी/परिवार से पुष्टि करें।' : 'Dates marked ~ are not final — confirm with pandit/family.'}</p>
      </div>
    </>
  );
}
