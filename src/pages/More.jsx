import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';

export default function More() {
  const { state, setLang, addItem, addPerson, setNote, reset, cloud } = useStore();
  const lang = state.lang;
  const [kind, setKind] = useState('item');
  const [text, setText] = useState('');
  const [done, setDone] = useState('');

  const save = () => {
    if (!text.trim()) return;
    if (kind === 'item') addItem({ name: { hi: text.trim(), en: text.trim() }, category: 'custom', dayId: null });
    if (kind === 'person') addPerson({ name: text.trim(), role: '' });
    if (kind === 'note') setNote('dec-11', text.trim());
    setDone(lang === 'hi' ? 'जोड़ दिया ✓' : 'Added ✓'); setText('');
    setTimeout(() => setDone(''), 1800);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'ghar-ki-shaadi.json'; a.click();
  };

  return (
    <div className="wrap">
      <h2>⋯ {lang === 'hi' ? 'और' : 'More'}</h2>
      <div className="card" id="add">
        <h3>＋ {lang === 'hi' ? 'क्या जोड़ना है?' : 'What to add?'}</h3>
        <div className="row">
          {[['item', lang === 'hi' ? 'सामान' : 'Item'], ['person', lang === 'hi' ? 'व्यक्ति' : 'Person'], ['note', lang === 'hi' ? 'नोट' : 'Note']].map(([k, label]) =>
            <button key={k} className={`btn small ${kind === k ? '' : 'ghost'}`} onClick={() => setKind(k)}>{label}</button>)}
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <input value={text} onChange={e => setText(e.target.value)} placeholder={lang === 'hi' ? 'लिखें…' : 'Write…'} style={{ flex: 1 }} />
          <button className="btn small" onClick={save}>{lang === 'hi' ? 'जोड़ें' : 'Add'}</button>
        </div>
        {done && <p className="small" style={{ color: 'var(--mehendi)' }}>{done}</p>}
      </div>
      <div className="card">
        <div className="row"><b>{lang === 'hi' ? 'भाषा' : 'Language'}</b>
          <button className="btn small ghost" onClick={() => setLang('hi')}>हिं</button>
          <button className="btn small ghost" onClick={() => setLang('en')}>EN</button></div>
        <div className="small muted" style={{ marginTop: 6 }}>Cloud: {cloud === 'neon' ? '🟢 Neon DB' : '⚪ ' + (lang === 'hi' ? 'इसी फ़ोन में' : 'this phone only')}</div>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn small ghost" onClick={exportJSON}>{lang === 'hi' ? 'फ़ाइल निर्यात' : 'Export file'}</button>
          <button className="btn small ghost" onClick={() => { if (confirm(lang === 'hi' ? 'आधिकारिक प्लान पर लौटें?' : 'Reset to official?')) reset(); }}>{lang === 'hi' ? 'रीसेट' : 'Reset'}</button>
          <Link className="btn small ghost" to="/about">{lang === 'hi' ? 'हमारे बारे में' : 'About'}</Link>
          <button className="btn small ghost" onClick={() => window.print()}>{lang === 'hi' ? 'प्रिंट' : 'Print'}</button>
        </div>
      </div>
      <div className="card tint-wedding">
        <h3>🌼 {lang === 'hi' ? 'यादें (13 दिसं के बाद)' : 'Memories (after 13 Dec)'}</h3>
        <p className="small">{lang === 'hi' ? '7 दिन · 14 रस्में · 1 शुरुआत। फ़ोटो/एल्बम लिंक Day Notes में जोड़ें।' : '7 days · 14 rituals · 1 beginning. Add photo links in Day Notes.'}</p>
      </div>
    </div>
  );
}
