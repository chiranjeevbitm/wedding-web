import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { RITUALS, SONGS, DECISIONS, QUESTIONS } from '../data/rituals-b.js';
import { t } from '../lib/format.js';
import { Chip } from '../components/ui.jsx';

export default function Guide() {
  const { state } = useStore();
  const lang = state.lang;
  const [q, setQ] = useState('');
  const rituals = RITUALS.filter(r => !q || t(r.name, lang).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="wrap">
      <h2>📿 {lang === 'hi' ? 'रस्म गाइड · गीत · फ़ैसले' : 'Ritual guide · geet · decisions'}</h2>
      <div className="card no-print">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={lang === 'hi' ? 'खोजें: मटकोर, हल्दी…' : 'Search: matkor, haldi…'} />
      </div>
      {rituals.map(r => (
        <div key={r.id} className="card" style={{ margin: '12px 0' }}>
          <h3 style={{ marginBottom: 2 }}>{t(r.name, lang)}</h3>
          <div className="small muted">{t(r.when, lang)}</div>
          <p className="small"><b>{lang === 'hi' ? 'परंपरा में:' : 'Traditionally:'}</b> {t(r.context, lang)}</p>
          <p className="small muted">⚠ {lang === 'hi' ? 'सामान्य जानकारी — हमारे घर की परंपरा अलग हो सकती है।' : 'General info — family practice may differ.'}</p>
        </div>
      ))}
      <div className="card tint-wedding">
        <h3>🎶 {lang === 'hi' ? 'गीत' : 'Geet'}</h3>
        {SONGS.map(s => <div key={s.id} className="small">· 🎵 {s.title}</div>)}
        <p className="small muted">{lang === 'hi' ? 'गीत संगीत (स्टेज) से अलग है — यह रस्मों के साथ गाया जाता है।' : 'Geet is distinct from stage sangeet — sung with rituals.'}</p>
      </div>
      <div className="card">
        <h3>📝 {lang === 'hi' ? 'फ़ैसले और सवाल' : 'Decisions & questions'}</h3>
        {DECISIONS.map(d => <div key={d.id} className="row small" style={{ padding: '6px 0', borderBottom: '1px solid var(--line)' }}><span>· {t(d.text, lang)}</span><span style={{ marginLeft: 'auto' }}><Chip status={d.status} /></span></div>)}
        <h4 style={{ marginTop: 12 }}>{lang === 'hi' ? 'पूछना बाक़ी' : 'Still to ask'}</h4>
        {QUESTIONS.map(x => <div key={x.id} className="small">? {t(x.text, lang)}</div>)}
      </div>
    </div>
  );
}
