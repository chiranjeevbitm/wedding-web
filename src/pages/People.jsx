import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { SEASON_META } from '../data/journey.js';

export default function People() {
  const { state, addPerson } = useStore();
  const lang = state.lang;
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  return (
    <div className="wrap">
      <h2>👪 {lang === 'hi' ? 'परिवार · ज़िम्मेदारी' : 'Family · roles'}</h2>
      <div className="card tint-wedding">
        <h3>{lang === 'hi' ? 'घर के लोग' : 'Household'}</h3>
        {SEASON_META.family.map(p => (
          <div key={p.id} className="small" style={{ padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
            <b>{p.hi || p.name}</b> · {p.relation[lang]} {p.profession ? `· ${p.profession[lang]}` : ''}
            {p.staysHome && <span className="chip" style={{ marginLeft: 6 }}>🏠 {lang === 'hi' ? 'घर सँभालेंगे' : 'holds house'}</span>}
            {p.travelsDelhi && <span className="chip" style={{ marginLeft: 6 }}>✈ Delhi</span>}
          </div>
        ))}
      </div>
      <div className="card">
        <h3>{lang === 'hi' ? 'जोड़े गए लोग' : 'Added people'} ({state.people.length})</h3>
        {state.people.length === 0 && <p className="muted small">{lang === 'hi' ? 'अभी किसी का नाम नहीं जोड़ा है। जिसे काम सौंपना हो, पहले उसे जोड़ें।' : 'No names yet. Add a person before assigning anything.'}</p>}
        {state.people.map(p => <div key={p.id} className="small" style={{ padding: '6px 0', borderBottom: '1px solid var(--line)' }}><b>{p.name}</b>{p.role ? ` · ${p.role}` : ''}</div>)}
        <label>{lang === 'hi' ? 'नाम' : 'Name'}</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder={lang === 'hi' ? 'जैसे: बुआ जी' : 'e.g. Bua ji'} />
        <label>{lang === 'hi' ? 'रोल / ज़िम्मेदारी' : 'Role'}</label>
        <input value={role} onChange={e => setRole(e.target.value)} placeholder={lang === 'hi' ? 'जैसे: मटकोर की मिट्टी' : 'e.g. matkor soil'} />
        <div style={{ marginTop: 10 }}><button className="btn small" onClick={() => { if (name.trim()) { addPerson({ name: name.trim(), role: role.trim() }); setName(''); setRole(''); } }}>{lang === 'hi' ? 'जोड़ें' : 'Add'}</button></div>
      </div>
    </div>
  );
}
