import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';

const TABS = [
  { to: '/', label: 'घर', icon: '⌂' },
  { to: '/journey', label: 'सफ़र', icon: '⋮' },
  { to: '/calendar', label: 'कैलेंडर', icon: '▦' },
  { to: '/checklist', label: 'चेकलिस्ट', icon: '✓' },
  { to: '/more', label: 'और', icon: '⋯' },
];

const LINKS = [
  { to: '/', label: 'घर' },
  { to: '/journey', label: 'सफ़र' },
  { to: '/calendar', label: 'कैलेंडर' },
  { to: '/checklist', label: 'चेकलिस्ट' },
  { to: '/people', label: 'लोग' },
  { to: '/travel', label: 'सफ़र-ठहरना' },
  { to: '/guide', label: 'रस्में·गीत' },
  { to: '/rsvp', label: 'RSVP' },
  { to: '/more', label: 'और' },
];

export default function Shell({ children }) {
  const { state, setLang } = useStore();
  const nav = useNavigate();
  return (
    <>
      <a className="skip" href="#main">मुख्य भाग पर जाएँ</a>
      <header className="topnav no-print">
        <div className="in">
          <a className="brand" href="/">🌼 घर की शादी</a>
          <nav>{LINKS.map(l => <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>{l.label}</NavLink>)}</nav>
          <button className="lang" onClick={() => setLang(state.lang === 'hi' ? 'en' : 'hi')} aria-label="language">
            {state.lang === 'hi' ? 'EN' : 'हिं'}
          </button>
        </div>
      </header>
      <main id="main">{children}</main>
      <nav className="tabbar no-print" aria-label="tabs">
        {TABS.map(t => <NavLink key={t.to} to={t.to} className={({ isActive }) => isActive ? 'active' : ''}><span className="ic">{t.icon}</span>{t.label}</NavLink>)}
      </nav>
      <button className="btn no-print" onClick={() => nav('/more#add')}
        style={{ position: 'fixed', right: 16, bottom: 76, zIndex: 50, width: 56, height: 56, borderRadius: '50%', padding: 0, fontSize: 26 }} aria-label="add">＋</button>
    </>
  );
}
