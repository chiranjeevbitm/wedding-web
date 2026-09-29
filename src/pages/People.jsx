import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { SEASON_META } from '../data/journey.js';
import { Section } from '../components/ui.jsx';

export default function People() {
  const { state, addPerson, editPerson, delPerson } = useStore();
  const lang = state.lang;
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [editing, setEditing] = useState(null);
  const [eName, setEName] = useState('');
  const [eRole, setERole] = useState('');
  const list = state.peopleSeed || [];
  const save = () => { if (name.trim()) { addPerson({ name: name.trim(), role: role.trim() }); setName(''); setRole(''); } };
  return (
    <div className="wrap">
      <h2 className="float-hi">👪 {lang === 'hi' ? 'परिवार · ज़िम्मेदारी' : 'Family · roles'}</h2>
      <Section icon="🏠" title={lang === 'hi' ? 'घर के लोग' : 'Household'} count={SEASON_META.family.length} defaultOpen tint="tint-wedding">
        {SEASON_META.family.map(p => (
          <div key={p.id} className="checkrow small pop">
            <span><b>{lang === 'hi' ? (p.hi || p.name) : (p.name || p.hi)}</b> · {p.relation[lang]} {p.profession ? `· ${p.profession[lang]}` : ''}</span>
          </div>
        ))}
      </Section>
      <Section icon="＋" title={lang === 'hi' ? 'जोड़े गए लोग' : 'Added people'} count={list.length} defaultOpen>
        {list.length === 0 && <p className="muted small">{lang === 'hi' ? 'अभी किसी का नाम नहीं जोड़ा है।' : 'No names yet.'}</p>}
        {list.map(p => (
          <div key={p.id} className="checkrow small">
            {editing === p.id
              ? <><input value={eName} autoFocus style={{ flex: 1 }} onChange={e => setEName(e.target.value)} /><input value={eRole} style={{ flex: 1 }} onChange={e => setERole(e.target.value)} /></>
              : <span style={{ flex: 1 }}><b>{p.name}</b>{p.role ? ` · ${p.role}` : ''}</span>}
            <span className="rowbtns no-print">
              {editing === p.id
                ? <><button className="iconbtn" aria-label="save" onClick={() => { if (eName.trim()) editPerson(p.id, { name: eName.trim(), role: eRole.trim() }); setEditing(null); }}>✔</button><button className="iconbtn" aria-label="cancel" onClick={() => setEditing(null)}>✕</button></>
                : <><button className="iconbtn" aria-label="edit" onClick={() => { setEditing(p.id); setEName(p.name); setERole(p.role || ''); }}>✎</button><button className="iconbtn danger" aria-label="delete" onClick={() => { if (confirm(lang === 'hi' ? 'हटाएँ?' : 'Delete?')) delPerson(p.id); }}>🗑</button></>}
            </span>
          </div>
        ))}
        <div className="addrow no-print" style={{ marginTop: 8 }}>
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} placeholder={lang === 'hi' ? 'नाम: बुआ जी' : 'Name'} />
          <input value={role} onChange={e => setRole(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} placeholder={lang === 'hi' ? 'रोल' : 'Role'} />
          <button className="btn small press" onClick={save}>{lang === 'hi' ? 'जोड़ें' : 'Add'}</button>
        </div>
      </Section>
    </div>
  );
}
