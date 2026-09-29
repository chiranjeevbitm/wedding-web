import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';

const TABS = (L) => [
  { to: '/', hi: 'घर', en: 'Home', icon: '⌂' },
  { to: '/journey', hi: 'सफ़र', en: 'Journey', icon: '⋮' },
  { to: '/calendar', hi: 'कैलेंडर', en: 'Calendar', icon: '▦' },
  { to: '/checklist', hi: 'चेकलिस्ट', en: 'List', icon: '✓' },
  { to: '/more', hi: 'फ़ीडबैक', en: 'Feedback', icon: '💬' },
];

const LINKS = (L) => [
  { to: '/', hi: 'घर', en: 'Home' },
  { to: '/journey', hi: 'सफ़र', en: 'Journey' },
  { to: '/calendar', hi: 'कैलेंडर', en: 'Calendar' },
  { to: '/checklist', hi: 'चेकलिस्ट', en: 'Checklist' },
  { to: '/people', hi: 'लोग', en: 'People' },
  { to: '/travel', hi: 'सफ़र-ठहरना', en: 'Travel' },
  { to: '/guide', hi: 'रस्में·गीत', en: 'Rituals' },
  { to: '/more', hi: 'फ़ीडबैक', en: 'Feedback' },
];

export default function Shell({ children }) {
  const { state, setLang } = useStore();
  const L = state.lang;
  const nav = useNavigate();
  return (
    <>
      <a className="skip" href="#main">{L === 'hi' ? 'मुख्य भाग पर जाएँ' : 'Skip to content'}</a>
      <header className="topnav no-print">
        <div className="in">
          <a className="brand" href="/">🌼 {L === 'hi' ? 'घर की शादी' : 'Ghar Ki Shaadi'}</a>
          <nav>{LINKS(L).map(l => <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>{L === 'hi' ? l.hi : l.en}</NavLink>)}</nav>
          <button className="lang" onClick={() => setLang(L === 'hi' ? 'en' : 'hi')} aria-label="language">
            {L === 'hi' ? 'EN' : 'हिं'}
          </button>
        </div>
      </header>
      <main id="main">{children}</main>
      <nav className="tabbar no-print" aria-label="tabs">
        {TABS(L).map(t => <NavLink key={t.to} to={t.to} className={({ isActive }) => isActive ? 'active' : ''}><span className="ic">{t.icon}</span>{L === 'hi' ? t.hi : t.en}</NavLink>)}
      </nav>
      <button className="btn fab no-print" onClick={() => nav('/more#add')} aria-label="add">＋</button>
    </>
  );
}
