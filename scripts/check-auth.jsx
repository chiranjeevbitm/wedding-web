// Verifies the login gate: reactive route guard + PIN + session rules.
// Run: npm run check:auth
//
// Session rules under test:
//   * starts locked (a page refresh re-creates the module → PIN asked again)
//   * 4 minutes of inactivity locks it again
//   * activity (touch) extends it
import React from 'react';

const gate = await import('../src/lib/gate.js');
const { default: Protected } = await import('../src/components/Protected.jsx');

const nameOf = (el) => (typeof el.type === 'string' ? el.type : el.type?.name || 'unknown');
const isRedirect = (el) => nameOf(el).includes('Navigate');
const t0 = Date.now(); // real clock: Protected() also checks Date.now()
const MIN = 60000;

let fail = 0;
const ok = (label, got, want) => {
  const pass = got === want;
  if (!pass) fail++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}  got=${got} want=${want}`);
};

// --- fresh module = locked (this is what a refresh does) ---
gate.lock();
ok('fresh start: session locked', gate.isUnlocked(t0), false);
ok('fresh start: route redirects to /login', isRedirect(Protected({ children: 'x' })), true);

// --- session rules ---
gate.unlock(t0);
ok('after correct PIN: unlocked', gate.isUnlocked(t0), true);
ok('after correct PIN: route renders the app (Shell)', nameOf(Protected({ children: 'x' })), 'Shell');
ok('after correct PIN: route does NOT redirect', isRedirect(Protected({ children: 'x' })), false);
ok('session gives ~4 min', Math.round(gate.msLeft(t0) / MIN), 4);
ok('still open at 3 min idle', gate.isUnlocked(t0 + 3 * MIN), true);
ok('locked at exactly 4 min idle', gate.isUnlocked(t0 + 4 * MIN), false);
ok('msLeft is 0 once expired', gate.msLeft(t0 + 5 * MIN), 0);

gate.unlock(t0);
gate.touch(t0 + 3 * MIN); // user interacts at minute 3
ok('activity at 3 min extends the session', gate.isUnlocked(t0 + 3.5 * MIN), true);
ok('expires 4 min AFTER the activity', gate.isUnlocked(t0 + 7 * MIN), false);
ok('expires at 4 min + 1s after activity', gate.isUnlocked(t0 + 7.1 * MIN), false);

gate.unlock(t0);
gate.lock();
ok('explicit lock works', gate.isUnlocked(t0), false);
ok('explicit lock: route redirects', isRedirect(Protected({ children: 'x' })), true);
gate.unlock(t0);

// --- PIN acceptance (Kolkata time) ---
const d = new Date('2026-09-30T13:23:00+05:30'); // 1:23 PM IST
for (const input of ['0123', '123', '1323', '01:23', '1:23']) {
  ok(`accepts "${input}" for 13:23 IST`, gate.checkPin(input, d), true);
}
ok('accepts previous minute "0122"', gate.checkPin('0122', d), true);
ok('accepts next minute "0124"', gate.checkPin('0124', d), true);
for (const input of ['0126', '9999', 'ab', '1', '012345', '323']) {
  ok(`rejects "${input}"`, gate.checkPin(input, d), false);
}
ok('3-digit works only with a leading zero', gate.checkPin('123', d) && !gate.checkPin('323', d), true);

// --- countdown ---
const cd = gate.countdownParts('2026-12-11', d);
ok('countdown is live (not over)', cd.over, false);
ok('countdown uses 2+ digit fields', [cd.dd, cd.hh, cd.mm, cd.ss].every((v) => /^\d{2,}$/.test(v)), true);
console.log(`      countdown at 30 Sep 2026 13:23 IST = ${cd.dd}d ${cd.hh}h ${cd.mm}m ${cd.ss}s`);
ok('countdown is over after the date', gate.countdownParts('2026-12-11', new Date('2027-01-01T00:00:00+05:30')).over, true);

console.log(fail === 0 ? '\nALL AUTH CHECKS PASSED' : `\n${fail} CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);
