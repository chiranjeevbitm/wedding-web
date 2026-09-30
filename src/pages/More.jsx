import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { Section } from '../components/ui.jsx';

export default function More() {
  const { state, setLang, addFeedback, mergeServer, cloud } = useStore();
  const lang = state.lang;
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState('');
  const list = state.feedback || [];

  // Poll every 15 s so feedback posted by anyone else shows up here too.
  useEffect(() => {
    let alive = true;
    const pull = async () => {
      try {
        const r = await fetch('/api/feedback');
        if (!r.ok) return;
        const d = await r.json();
        if (alive && Array.isArray(d.feedback)) mergeServer('feedback', d.feedback);
      } catch { /* offline → local only */ }
    };
    pull();
    const id = setInterval(pull, 15000);
    return () => { alive = false; clearInterval(id); };
  }, [mergeServer]);
  const send = () => {
    if (!msg.trim()) return;
    addFeedback({ name: name.trim(), message: msg.trim() });
    setMsg(''); setSent(lang === 'hi' ? 'धन्यवाद! लिख लिया 💛' : 'Thanks! Noted 💛');
    setTimeout(() => setSent(''), 2000);
  };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'ghar-ki-shaadi.json'; a.click();
  };
  return (
    <div className="wrap">
      <h2 className="float-hi">💬 {lang === 'hi' ? 'फ़ीडबैक — और बेहतर बनाएँ' : 'Feedback — make it better'}</h2>
      <Section icon="💬" title={lang === 'hi' ? 'क्या बदलें / सुधारें?' : 'What should we change?'} sub={lang === 'hi' ? 'आपकी राय सीधे परिवार तक' : 'Your note reaches the family'} defaultOpen tint="tint-wedding">
        <label>{lang === 'hi' ? 'नाम (वैकल्पिक)' : 'Name (optional)'}</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder={lang === 'hi' ? 'आपका नाम' : 'Your name'} />
        <label>{lang === 'hi' ? 'फ़ीडबैक' : 'Feedback'}</label>
        <textarea rows={3} value={msg} onChange={e => setMsg(e.target.value)} placeholder={lang === 'hi' ? 'जैसे: हल्दी वाले दिन का समय भी लिख दें…' : 'e.g. add timings for haldi day…'} />
        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn press" onClick={send}>{lang === 'hi' ? 'भेजें' : 'Send'}</button>
          {sent && <span className="small pop" style={{ color: 'var(--mehendi)' }}>{sent}</span>}
        </div>
        <p className="small muted">Neon {lang === 'hi' ? 'में सेव (उपलब्ध हो तो), वरना इसी फ़ोन में।' : 'saves to Neon when available, else this phone.'}</p>
      </Section>
      <Section icon="💛" title={lang === 'hi' ? 'सबकी राय' : "Everyone's notes"} count={list.length} defaultOpen={false}>
        {list.length === 0 && <p className="muted small">{lang === 'hi' ? 'अभी कुछ नहीं — पहली राय आप लिखिए।' : 'Nothing yet — write the first note.'}</p>}
        {list.map(x => <div key={x.id || x.message} className="tl-row pop" style={{ marginBottom: 8 }}><b>{x.name || (lang === 'hi' ? 'अज्ञात' : 'Anonymous')}</b><div>{x.message}</div></div>)}
      </Section>
      <Section icon="⚙" title={lang === 'hi' ? 'सेटिंग' : 'Settings'} defaultOpen={false}>
        <div className="row"><b>{lang === 'hi' ? 'भाषा' : 'Language'}</b>
          <button className="btn small ghost press" onClick={() => setLang('hi')}>हिं</button>
          <button className="btn small ghost press" onClick={() => setLang('en')}>EN</button></div>
        <div className="small" style={{ marginTop: 8, background: '#FFF8E7', border: '1px dashed var(--line)', borderRadius: 12, padding: '10px 12px' }}>
          {cloud === 'neon'
            ? (lang === 'hi' ? '🟢 क्लाउड जुड़ा — आपकी हर एडिट/फ़ीडबैक सबके फ़ोन पर दिखेगी (हर 15 सेकंड में सिंक)।' : '🟢 Cloud connected — every edit and feedback reaches all phones (syncs every 15 s).')
            : cloud === 'checking'
              ? (lang === 'hi' ? '⏳ क्लाउड जाँच रहे हैं…' : '⏳ Checking cloud…')
              : (lang === 'hi'
                ? '⚪ सिर्फ़ इसी फ़ोन में — अभी बदलाव दूसरों तक नहीं पहुँच रहे। (Neon कनेक्ट होते ही 🟢 हो जाएगा।)'
                : '⚪ This phone only — changes are not reaching others yet. It turns 🟢 once Neon connects.')}
        </div>
        <p className="small muted" style={{ marginTop: 8 }}>
          🔒 {lang === 'hi' ? 'सेशन: 4 मिनट की निष्क्रियता पर या पेज रिफ़्रेश होते ही फिर से PIN माँगा जाएगा।' : 'Session: PIN is asked again after 4 min idle or on page refresh.'}
        </p>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn small ghost press" onClick={exportJSON}>{lang === 'hi' ? 'फ़ाइल निर्यात' : 'Export'}</button>
          <button className="btn small ghost press" onClick={() => { window.dispatchEvent(new Event('shaadi:lock')); }}>{lang === 'hi' ? 'लॉक 🔒' : 'Lock 🔒'}</button>
          <Link className="btn small ghost press" to="/about">{lang === 'hi' ? 'हमारे बारे में' : 'About'}</Link>
          <button className="btn small ghost press" onClick={() => window.print()}>{lang === 'hi' ? 'प्रिंट' : 'Print'}</button>
        </div>
      </Section>
    </div>
  );
}
