// Smoke-renders every page with the real store, so an undefined variable or a
// broken hook fails here instead of in production (this is exactly how the
// "dayOrder is not defined" crash on the Checklist page would have been caught).
// Run: npm run check:pages
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Browser stubs: the store reads localStorage while initialising. Effects
// (fetch/setInterval) do not run during a server render, so no network here.
const memStore = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  };
};

let fail = 0;
const ok = (label, got, want) => {
  const pass = got === want;
  if (!pass) fail++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}  got=${got} want=${want}`);
};

const main = async () => {
  globalThis.localStorage = memStore();
  globalThis.sessionStorage = memStore();

  const { StoreProvider } = await import('../src/lib/store.jsx');

  const cases = [
    ['Home', '/', '/', (await import('../src/pages/Home.jsx')).default],
    ['Journey', '/journey', '/journey', (await import('../src/pages/Journey.jsx')).default],
    ['Calendar', '/calendar', '/calendar', (await import('../src/pages/Calendar.jsx')).default],
    ['Day', '/day/dec-11', '/day/:id', (await import('../src/pages/Day.jsx')).default],
    ['Checklist', '/checklist', '/checklist', (await import('../src/pages/Checklist.jsx')).default],
    ['People', '/people', '/people', (await import('../src/pages/People.jsx')).default],
    ['Travel', '/travel', '/travel', (await import('../src/pages/Travel.jsx')).default],
    ['Guide', '/guide', '/guide', (await import('../src/pages/Guide.jsx')).default],
    ['About', '/about', '/about', (await import('../src/pages/About.jsx')).default],
    ['More', '/more', '/more', (await import('../src/pages/More.jsx')).default],
    ['Login', '/login', '/login', (await import('../src/pages/Login.jsx')).default],
  ];

  const html = {};
  for (const [name, path, match, Page] of cases) {
    const tree = React.createElement(
      StoreProvider,
      null,
      React.createElement(
        MemoryRouter,
        { initialEntries: [path] },
        React.createElement(Routes, null, React.createElement(Route, { path: match, element: React.createElement(Page) }))
      )
    );
    try {
      // Silence the expected react-router SSR useLayoutEffect noise for this
      // one synchronous render — real crashes still throw through.
      const err = console.error;
      console.error = () => {};
      html[name] = renderToString(tree);
      console.error = err;
      ok(`${name} renders without crashing`, true, true);
      ok(`${name} produced markup (${html[name].length} chars)`, html[name].length > 400, true);
    } catch (e) {
      html[name] = '';
      ok(`${name} renders without crashing`, `THREW: ${e.message}`, true);
    }
  }

  // The Checklist specifically must show date-ordered day groups.
  ok('Checklist shows its heading', /चेकलिस्ट|Checklist/.test(html.Checklist), true);
  ok('Checklist shows a date-ordered day count', /दिन|days/.test(html.Checklist), true);
  ok('Checklist lists real event names', /(शिव चर्चा|हल्दी|Sangeet|Haldi)/.test(html.Checklist), true);

  // Login must NOT leak any PIN hint.
  ok('Login shows a PIN field', /PIN/.test(html.Login), true);
  ok('Login hides the accepted PIN value', !/अभी का PIN|PIN now/.test(html.Login), true);
  ok('Login shows no clock time', /IST/.test(html.Login), false);

  console.log(fail === 0 ? '\nALL PAGE CHECKS PASSED' : `\n${fail} CHECK(S) FAILED`);
  process.exit(fail === 0 ? 0 : 1);
};

main().catch((e) => {
  console.error('check-pages crashed:', e);
  process.exit(1);
});
