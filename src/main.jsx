import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from './lib/store.jsx';
import { router } from './app/routes.jsx';
import { lock, isUnlocked, touch } from './lib/gate.js';
import './styles/tokens.css';
import './styles/base.css';
import './styles/app.css';
import './styles/nav.css';
import './styles/pretty.css';
import './styles/gate.css';

function Root() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const doLock = () => {
      lock();
      window.location.replace('/login');
    };

    // Keep the session alive only while the user is actually interacting.
    const activity = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    activity.forEach((t) => window.addEventListener(t, touch, { passive: true }));

    // Expire after the idle window (see SESSION_IDLE_MS) — 4 min.
    const timer = setInterval(() => {
      if (!isUnlocked() && !window.location.pathname.startsWith('/login')) doLock();
    }, 3000);

    window.addEventListener('shaadi:lock', doLock);

    return () => {
      activity.forEach((t) => window.removeEventListener(t, touch));
      clearInterval(timer);
      window.removeEventListener('shaadi:lock', doLock);
    };
  }, []);
  return (
    <React.StrictMode>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);

// Register service worker only in production (vite build), never in dev:
// a stale SW is the classic cause of a blank page on localhost.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
} else if ('serviceWorker' in navigator && import.meta.env.DEV) {
  navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())).catch(() => {});
}
