import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { SEASON_META } from '../data/journey.js';
import { Section } from '../components/ui.jsx';

export default function People() {
  const { state, addPerson } = useStore();
  const lang = state.lang;
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const save = () => { if (name.trim()) { addPerson({ name: name.trim(), role: role.trim() }); setName(''); setRole(''); } };
  return (
    <div className="wrap">
      <h2>👪 {lang === 'hi' ? 'परिवार · ज़िम्मेदारी' : 'Family · roles'}</h2>
      <Section icon="🏠" title={lang === 'hi' ? 'घर के लोग' : 'Household'} count={SEASON_META.family.length} defaultOpen tint="tint-wedding">
        {SEASON_META.family.map(p => (
          <div key={p.id} className="checkrow small">
            <span><b>{lang === 'hi' ? (p.hi || p.name) : (p.name || p.hi)}</b> · {p.relation[lang]} {p.profession ? `· ${p.profession[lang]}` : ''}</span>
          </div>
        ))}
      </Section>
      <Section icon="＋" title={lang === 'hi' ? 'जोड़े गए लोग' : 'Added people'} count={state.people.length} defaultOpen>
        {state.people.length === 0 && <p className="muted small">{lang === 'hi' ? 'अभी किसी का नाम नहीं जोड़ा है। जिसे काम सौंपना हो, पहले उसे जोड़ें।' : 'No names yet. Add a person before assigning anything.'}</p>}
        {state.people.map(p => <div key={p.id} className="checkrow small"><b>{p.name}</b>{p.role ? ` · ${p.role}` : ''}</div>)}
        <div className="addrow" style={{ marginTop: 8 }}>
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} placeholder={lang === 'hi' ? 'नाम: बुआ जी' : 'Name: Bua ji'} />
          <input value={role} onChange={e => setRole(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} placeholder={lang === 'hi' ? 'रोल' : 'Role'} />
          <button className="btn small press" onClick={save}>{lang === 'hi' ? 'जोड़ें' : 'Add'}</button>
        </div>
      </Section>
    </div>
  );
}
