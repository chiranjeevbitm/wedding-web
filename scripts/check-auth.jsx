// Verifies the login gate really lets a correct PIN through.
// Bug we are guarding against: the route guard was evaluated ONCE at startup,
// so it kept a frozen <Navigate to="/login"> and bounced users back even
// after a correct PIN. Run: npm run check:auth
import React from 'react';

globalThis.sessionStorage = {
  _s: new Map(),
  getItem(k) { return this._s.has(k) ? this._s.get(k) : null; },
  setItem(k, v) { this._s.set(k, String(v)); },
  removeItem(k) { this._s.delete(k); },
};
globalThis.localStorage = globalThis.sessionStorage;

const gate = await import('../src/lib/gate.js');
const { default: Protected } = await import('../src/components/Protected.jsx');

const nameOf = (el) => (typeof el.type === 'string' ? el.type : el.type?.name || 'unknown');
const isRedirect = (el) => nameOf(el).includes('Navigate');

let fail = 0;
const ok = (label, got, want) => {
  const pass = got === want;
  if (!pass) fail++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}  got=${got} want=${want}`);
};

// --- gate state machine ---
gate.lock();
ok('locked: route redirects to /login', isRedirect(Protected({ children: 'x' })), true);
ok('locked: isUnlocked() is false', gate.isUnlocked(), false);

gate.unlock();
ok('after correct PIN: isUnlocked() is true', gate.isUnlocked(), true);
ok('after correct PIN: route renders the app (Shell)', nameOf(Protected({ children: 'x' })), 'Shell');
ok('after correct PIN: route does NOT redirect', isRedirect(Protected({ children: 'x' })), false);

gate.lock();
ok('after lock: route redirects again', isRedirect(Protected({ children: 'x' })), true);

gate.unlock();

// --- PIN acceptance (Kolkata time) ---
const t = new Date('2026-09-30T13:23:00+05:30'); // 1:23 PM IST
for (const input of ['0123', '123', '1323', '01:23', '1:23']) {
  ok(`accepts "${input}" for 13:23 IST`, gate.checkPin(input, t), true);
}
// ±1 minute grace: the minute may flip while you are typing
ok('accepts previous minute "0122"', gate.checkPin('0122', t), true);
ok('accepts next minute "0124"', gate.checkPin('0124', t), true);
for (const input of ['0126', '9999', 'ab', '1', '012345', '323']) {
  ok(`rejects "${input}"`, gate.checkPin(input, t), false);
}
// the 3-digit shortcut only exists when the PIN has a leading zero
ok('accepts 3-digit "123" but not "323"', gate.checkPin('123', t) && !gate.checkPin('323', t), true);

// --- countdown ---
const cd = gate.countdownParts('2026-12-11', t);
ok('countdown is live (not over)', cd.over, false);
ok('countdown uses tabular 2-digit fields', [cd.dd, cd.hh, cd.mm, cd.ss].every((v) => /^\d{2,}$/.test(v)), true);
console.log(`      countdown at 30 Sep 2026 13:23 IST = ${cd.dd}d ${cd.hh}h ${cd.mm}m ${cd.ss}s`);
ok('countdown is over after the date', gate.countdownParts('2026-12-11', new Date('2027-01-01T00:00:00+05:30')).over, true);

console.log(fail === 0 ? '\nALL AUTH CHECKS PASSED' : `\n${fail} CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);
