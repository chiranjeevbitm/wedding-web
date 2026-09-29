import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from './lib/store.jsx';
import { router } from './app/routes.jsx';
import './styles/tokens.css';
import './styles/base.css';
import './styles/app.css';
import './styles/nav.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider><RouterProvider router={router} /></StoreProvider>
  </React.StrictMode>
);

// Register service worker only in production (vite build), never in dev:
// a stale SW is the classic cause of a blank page on localhost.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
} else if ('serviceWorker' in navigator && import.meta.env.DEV) {
  navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())).catch(() => {});
}
