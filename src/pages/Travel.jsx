import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { TRAVEL_LEGS, EXCURSION } from '../data/events-b.js';
import { SHOPPING_WEEKENDS } from '../data/journey.js';
import { TASKS } from '../data/rituals-b.js';
import { t } from '../lib/format.js';
import { Chip } from '../components/ui.jsx';

export default function Travel() {
  const { state } = useStore();
  const lang = state.lang;
  return (
    <div className="wrap">
      <h2>🚆 {lang === 'hi' ? 'सफ़र और ठहरना' : 'Travel & stay'}</h2>
      <div className="card tint-bridge">
        <b>⚠ {lang === 'hi' ? 'दिसंबर में कोहरा — ट्रेन/फ़्लाइट लेट हो सकती है। बफ़र रखें।' : 'December fog — trains/flights can delay. Keep a buffer.'}</b>
        <p className="small">⏳ {t(EXCURSION.note, lang)}</p>
      </div>
      {TRAVEL_LEGS.map(l => (
        <div key={l.id} className="card" style={{ margin: '12px 0' }}>
          <div className="row"><b>{t(l.label, lang)}</b><Chip status={l.status} /></div>
          <div className="small muted">{l.from} → {l.to} · {l.departAt} · {(l.personIds || []).join(', ')}</div>
        </div>
      ))}
      <div className="card">
        <h3>🎫 {lang === 'hi' ? 'सबसे ज़रूरी काम' : 'Most urgent tasks'}</h3>
        {TASKS.map(tk => <div key={tk.id} className="row small" style={{ padding: '6px 0', borderBottom: '1px solid var(--line)' }}><span>· {t(tk.title, lang)} <span className="muted">({tk.due})</span></span><span style={{ marginLeft: 'auto' }}><Chip status={tk.status} /></span></div>)}
      </div>
      <div className="card tint-wedding">
        <h3>🛒 {lang === 'hi' ? 'ख़रीदारी' : 'Shopping'}</h3>
        {SHOPPING_WEEKENDS.map(w => <div key={w.id} className="small">· <b>{w.dates}</b> — {w[lang]}</div>)}
        <div style={{ marginTop: 8 }}><Link className="btn small" to="/checklist">{lang === 'hi' ? 'चेकलिस्ट' : 'Checklist'}</Link></div>
      </div>
    </div>
  );
}
