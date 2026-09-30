import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from './lib/store.jsx';
import { router } from './app/routes.jsx';
import { lock } from './lib/gate.js';
import './styles/tokens.css';
import './styles/base.css';
import './styles/app.css';
import './styles/nav.css';
import './styles/pretty.css';
import './styles/gate.css';

function Root() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const toggle = () => {
      try {
        const raw = localStorage.getItem('ghar-ki-shaadi-v2');
        const s = raw ? JSON.parse(raw) : {};
        localStorage.setItem(
          'ghar-ki-shaadi-v2',
          JSON.stringify({ ...s, lang: s.lang === 'hi' ? 'en' : 'hi' })
        );
      } catch {
        /* noop */
      }
      force();
      window.location.reload();
    };
    window.addEventListener('shaadi:lang', toggle);
    window.addEventListener('shaadi:lock', () => {
      lock();
      window.location.reload();
    });
    return () => {
      window.removeEventListener('shaadi:lang', toggle);
      window.removeEventListener('shaadi:lock', () => {});
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
