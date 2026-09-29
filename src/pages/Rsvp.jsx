import { useEffect, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { t } from '../lib/format.js';

export default function Rsvp() {
  const { state, addRsvp, addWish } = useStore();
  const lang = state.lang;
  const [f, setF] = useState({ name: '', side: 'groom', attending: 'yes', count: '1', phone: '' });
  const [w, setW] = useState({ name: '', message: '' });
  const [wishes, setWishes] = useState(state.wishes || []);
  const [msg, setMsg] = useState('');

  useEffect(() => { setWishes(state.wishes || []); }, [state.wishes]);
  useEffect(() => {
    fetch('/api/wishes').then(r => r.ok ? r.json() : null).then(d => {
      if (d && Array.isArray(d.wishes) && d.wishes.length) setWishes(d.wishes);
    }).catch(() => {});
  }, []);

  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  return (
    <div className="wrap">
      <h2>💌 RSVP · {lang === 'hi' ? 'शुभकामना' : 'Wishes'}</h2>
      <div className="card tint-wedding">
        <h3>{lang === 'hi' ? 'आ रहे हैं? बताइए' : 'Are you coming?'}</h3>
        <label>{lang === 'hi' ? 'नाम' : 'Name'}</label>
        <input value={f.name} onChange={e => set('name', e.target.value)} placeholder={lang === 'hi' ? 'आपका नाम' : 'Your name'} />
        <div className="grid two">
          <div><label>{lang === 'hi' ? 'पक्ष' : 'Side'}</label>
            <select value={f.side} onChange={e => set('side', e.target.value)}>
              <option value="groom">{lang === 'hi' ? 'दूल्हा पक्ष' : 'Groom side'}</option>
              <option value="bride">{lang === 'hi' ? 'दुल्हन पक्ष' : 'Bride side'}</option>
              <option value="cousin">{lang === 'hi' ? 'कज़न की शादी' : "Cousin's wedding"}</option>
            </select></div>
          <div><label>{lang === 'hi' ? 'उपस्थिति' : 'Attending'}</label>
            <select value={f.attending} onChange={e => set('attending', e.target.value)}>
              <option value="yes">{lang === 'hi' ? 'हाँ, ज़रूर' : 'Yes'}</option>
              <option value="maybe">{lang === 'hi' ? 'शायद' : 'Maybe'}</option>
              <option value="no">{lang === 'hi' ? 'नहीं हो पाएगा' : 'No'}</option>
            </select></div>
        </div>
        <div className="grid two">
          <div><label>{lang === 'hi' ? 'कितने लोग' : 'How many'}</label>
            <input value={f.count} onChange={e => set('count', e.target.value)} inputMode="numeric" /></div>
          <div><label>{lang === 'hi' ? 'फ़ोन (वैकल्पिक)' : 'Phone (optional)'}</label>
            <input value={f.phone} onChange={e => set('phone', e.target.value)} inputMode="tel" /></div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => {
            if (!f.name.trim()) { setMsg(lang === 'hi' ? 'कृपया नाम लिखें' : 'Please add a name'); return; }
            addRsvp({ ...f, name: f.name.trim() }); setMsg(lang === 'hi' ? 'ठीक है, लिख लिया 🙏' : 'Noted 🙏'); setF({ name: '', side: 'groom', attending: 'yes', count: '1', phone: '' });
          }}>{lang === 'hi' ? 'भेजें' : 'Send RSVP'}</button>
          {msg && <span className="small" style={{ marginLeft: 10 }}>{msg}</span>}
        </div>
        <p className="small muted">Neon DB {lang === 'hi' ? 'में सेव होता है (उपलब्ध होने पर), वरना इसी फ़ोन में।' : 'saves to Neon when available, else this phone.'}</p>
      </div>

      <div className="card">
        <h3>🌼 {lang === 'hi' ? 'शुभकामना लिखें' : 'Write a wish'}</h3>
        <label>{lang === 'hi' ? 'नाम' : 'Name'}</label>
        <input value={w.name} onChange={e => setW({ ...w, name: e.target.value })} />
        <label>{lang === 'hi' ? 'संदेश' : 'Message'}</label>
        <textarea rows={3} value={w.message} onChange={e => setW({ ...w, message: e.target.value })} placeholder={lang === 'hi' ? 'दीपक और अल्का के लिए…' : 'For Deepak & Alka…'} />
        <div style={{ marginTop: 10 }}>
          <button className="btn small" onClick={() => {
            if (!w.message.trim()) return;
            addWish({ name: w.name.trim() || (lang === 'hi' ? 'अज्ञात' : 'Anonymous'), message: w.message.trim() });
            setW({ name: '', message: '' });
          }}>{lang === 'hi' ? 'शुभकामना भेजें' : 'Send wish'}</button>
        </div>
      </div>

      <div className="card tint-wedding pop">
        <h3>💛 {lang === 'hi' ? 'शुभकामनाएँ' : 'Wishes'} ({wishes.length})</h3>
        {wishes.length === 0 && <p className="muted small">{lang === 'hi' ? 'अभी कोई शुभकामना नहीं — पहली आप लिखिए।' : 'No wishes yet — write the first one.'}</p>}
        {wishes.map(x => <div key={x.id || x.message} className="tl-row pop" style={{ marginBottom: 8 }}><b>{x.name}</b><div>{x.message}</div></div>)}
        {state.rsvp?.length > 0 && <p className="small muted" style={{ marginTop: 10 }}>RSVP: {state.rsvp.length} {lang === 'hi' ? 'जवाब' : 'responses'}</p>}
      </div>
    </div>
  );
}
