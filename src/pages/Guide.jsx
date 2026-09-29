import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { RITUALS, SONGS, DECISIONS, QUESTIONS } from '../data/rituals-b.js';
import { t } from '../lib/format.js';
import { Chip, Section } from '../components/ui.jsx';

export default function Guide() {
  const { state } = useStore();
  const lang = state.lang;
  const [q, setQ] = useState('');
  const rituals = RITUALS.filter(r => !q || t(r.name, lang).toLowerCase().includes(q.toLowerCase()) || t(r.name, lang === 'hi' ? 'en' : 'hi').toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="wrap">
      <h2>📿 {lang === 'hi' ? 'रस्म गाइड · गीत · फ़ैसले' : 'Ritual guide · geet · decisions'}</h2>
      <div className="card no-print pop">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={lang === 'hi' ? 'खोजें: मटकोर, हल्दी…' : 'Search: matkor, haldi…'} />
      </div>
      <Section icon="📿" title={lang === 'hi' ? 'रस्में' : 'Rituals'} count={rituals.length} defaultOpen>
        {rituals.map(r => (
          <details key={r.id} className="fold">
            <summary>{t(r.name, lang)} <span className="small muted">· {t(r.when, lang)}</span></summary>
            <p className="small"><b>{lang === 'hi' ? 'परंपरा में:' : 'Traditionally:'}</b> {t(r.context, lang)}</p>
            <p className="small muted">⚠ {lang === 'hi' ? 'सामान्य जानकारी — हमारे घर की परंपरा अलग हो सकती है।' : 'General info — family practice may differ.'}</p>
          </details>
        ))}
      </Section>
      <Section icon="🎶" title={lang === 'hi' ? 'गीत' : 'Geet'} count={SONGS.length} defaultOpen={false} tint="tint-wedding">
        {SONGS.map(s => <div key={s.id} className="small checkrow">🎵 {s.title}</div>)}
        <p className="small muted">{lang === 'hi' ? 'गीत संगीत (स्टेज) से अलग है — यह रस्मों के साथ गाया जाता है।' : 'Geet is distinct from stage sangeet — sung with rituals.'}</p>
      </Section>
      <Section icon="📝" title={lang === 'hi' ? 'फ़ैसले और सवाल' : 'Decisions & questions'} count={DECISIONS.length} defaultOpen={false}>
        {DECISIONS.map(d => <div key={d.id} className="checkrow small"><span>· {t(d.text, lang)}</span><span className="right"><Chip status={d.status} /></span></div>)}
        <h4 style={{ marginTop: 12 }}>{lang === 'hi' ? 'पूछना बाक़ी' : 'Still to ask'}</h4>
        {QUESTIONS.map(x => <div key={x.id} className="small">? {t(x.text, lang)}</div>)}
      </Section>
    </div>
  );
}
