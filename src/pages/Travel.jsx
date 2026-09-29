import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { TRAVEL_LEGS, EXCURSION } from '../data/events-b.js';
import { SHOPPING_WEEKENDS } from '../data/journey.js';
import { TASKS } from '../data/rituals-b.js';
import { t } from '../lib/format.js';
import { Chip, Section } from '../components/ui.jsx';

export default function Travel() {
  const { state } = useStore();
  const lang = state.lang;
  return (
    <div className="wrap">
      <h2>🚆 {lang === 'hi' ? 'सफ़र और ठहरना' : 'Travel & stay'}</h2>
      <div className="card tint-bridge pop">
        <b>⚠ {lang === 'hi' ? 'दिसंबर में कोहरा — ट्रेन/फ़्लाइट लेट हो सकती है। बफ़र रखें।' : 'December fog — trains/flights can delay. Keep a buffer.'}</b>
        <p className="small">⏳ {t(EXCURSION.note, lang)}</p>
      </div>
      <Section icon="🚆" title={lang === 'hi' ? 'यात्रा' : 'Journeys'} count={TRAVEL_LEGS.length} defaultOpen>
        {TRAVEL_LEGS.map(l => (
          <div key={l.id} className="tl-row pop" style={{ marginBottom: 8 }}>
            <div className="row"><b>{t(l.label, lang)}</b><Chip status={l.status} /></div>
            <div className="small muted">{l.from} → {l.to} · {l.departAt} · {(l.personIds || []).join(', ')}</div>
          </div>
        ))}
      </Section>
      <Section icon="🎫" title={lang === 'hi' ? 'सबसे ज़रूरी काम' : 'Most urgent tasks'} count={TASKS.length} defaultOpen={false}>
        {TASKS.map(tk => <div key={tk.id} className="checkrow small"><span>· {t(tk.title, lang)} <span className="muted">({tk.due})</span></span><span className="right"><Chip status={tk.status} /></span></div>)}
      </Section>
      <Section icon="🛒" title={lang === 'hi' ? 'ख़रीदारी' : 'Shopping'} count={SHOPPING_WEEKENDS.length} defaultOpen={false} tint="tint-wedding">
        {SHOPPING_WEEKENDS.map(w => <div key={w.id} className="small checkrow">· <b>{w.dates}</b> — {w[lang]}</div>)}
        <div style={{ marginTop: 8 }}><Link className="btn small press" to="/checklist">{lang === 'hi' ? 'चेकलिस्ट' : 'Checklist'}</Link></div>
      </Section>
    </div>
  );
}
