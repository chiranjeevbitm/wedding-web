import { Link } from 'react-router-dom';
import { useStore, ALL_EVENTS } from '../lib/store.jsx';
import { SEASON_META, TRACKS, CRUNCH, SHOPPING_WEEKENDS, SHOPPING_RULE } from '../data/journey.js';
import { daysUntil, fmtDate, t } from '../lib/format.js';
import { Chip, FolkBorder } from '../components/ui.jsx';

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
        <h1><span className="hi">{SEASON_META.title.hi}</span></h1>
        <div className="couple">Dr Deepak × Alka</div>
        <p className="place">{t(SEASON_META.place, lang)} · {SEASON_META.place.hi} · {SEASON_META.place.note[lang]}</p>
        <div><span className="dates">07 — 13 दिसंबर 2026 · Muzaffarpur</span></div>
        <p className="tagline">{t(SEASON_META.tagline, lang)}</p>
        <div style={{ marginTop: 8 }}><FolkBorder /></div>
      </section>
      <div className="wrap">
        <div className="grid two">
          <div className="card tint-wedding">
            <div className="small muted">{lang === 'hi' ? 'अगला पड़ाव' : 'Next milestone'} · {t(next.label, lang)}</div>
            <div className="count-big">{dNext <= 0 ? (lang === 'hi' ? 'आज' : 'Today') : `${dNext} ${lang === 'hi' ? 'दिन बाक़ी' : 'days to go'}`}</div>
            <div className="small muted">{fmtDate(next.date, lang)} · {lang === 'hi' ? 'शादी में' : 'to shaadi'}: {dShaadi} {lang === 'hi' ? 'दिन' : 'days'}</div>
          </div>
          <div className="card">
            <div className="small muted">{lang === 'hi' ? 'आज' : 'Today'} · {fmtDate(today, lang)}</div>
            {todayEv.length === 0 ? <p>{lang === 'hi' ? 'आज कोई फंक्शन नहीं · आराम। आगे:' : 'No function today. Next:'}</p> :
              todayEv.map(e => <div key={e.id}><h3 style={{ marginBottom: 2 }}>{t(e.title, lang)}</h3><div className="row"><Chip status={e.status} /><Link className="btn small" to={`/day/${e.id}`}>{lang === 'hi' ? 'आज का प्लान →' : 'Today’s plan →'}</Link></div></div>)}
            {upcoming.map(e => <div key={e.id} className="small">· {fmtDate(e.date, lang)} — <Link to={`/day/${e.id}`}>{t(e.title, lang)}</Link></div>)}
          </div>
        </div>

        <h2>🌼 {lang === 'hi' ? 'परिवार का मौसम' : 'Family season'}</h2>
        <div className="grid two">
          {TRACKS.map(tr => (
            <Link key={tr.id} to="/journey" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={`card ${tr.tint}`} style={{ margin: 0 }}>
                <div style={{ fontSize: 26 }}>{tr.icon}</div>
                <h3>{lang === 'hi' ? tr.hi : tr.en}</h3>
                <div className="small muted">{t(tr.line, lang)}</div>
                <div className="small">{tr.start} → {tr.end}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="card tint-bridge">
          <h3>⏳ {t(CRUNCH.title, lang)}</h3>
          <p>{t(CRUNCH.body, lang)}</p>
        </div>

        <div className="card">
          <h3>🛒 {lang === 'hi' ? 'ख़रीदारी के 4 मौके' : '4 shopping windows'}</h3>
          <p className="small muted">{t(SHOPPING_RULE, lang)}</p>
          {SHOPPING_WEEKENDS.map(w => <div key={w.id} className="small">· <b>{w.dates}</b> — {w[lang]}</div>)}
        </div>

        <div className="card tint-wedding">
          <h3>✓ {lang === 'hi' ? 'तैयारी' : 'Preparation'} — {done}/{state.items.length}</h3>
          <div className="progress"><i style={{ width: `${state.items.length ? Math.round(done / state.items.length * 100) : 0}%` }} /></div>
          <div className="row" style={{ marginTop: 10 }}>
            <Link className="btn small" to="/checklist">{lang === 'hi' ? 'चेकलिस्ट खोलें' : 'Open checklist'}</Link>
            <Link className="btn small ghost" to="/rsvp">RSVP · {lang === 'hi' ? 'शुभकामना' : 'Wishes'}</Link>
          </div>
        </div>
        <p className="small muted">~ {lang === 'hi' ? 'वाली तारीख़ें पक्की नहीं — पंडित जी/परिवार से पुष्टि करें।' : 'Dates marked ~ are not final — confirm with pandit/family.'}</p>
      </div>
    </>
  );
}
