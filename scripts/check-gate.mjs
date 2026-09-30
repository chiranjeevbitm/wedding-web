// Quick sanity checks for the Kolkata-time PIN gate + countdown.
// Run: node scripts/check-gate.mjs
import { checkPin, pinCandidates, currentPin, currentPin24, countdownParts, currentPinHint, kolkataClock } from '../src/lib/gate.js';

const cases = [
  ['13:23 IST', new Date('2026-09-30T13:23:00+05:30')],
  ['00:00 IST', new Date('2026-09-30T00:00:00+05:30')],
  ['00:05 IST', new Date('2026-09-30T00:05:00+05:30')],
  ['11:59 IST', new Date('2026-09-30T11:59:00+05:30')],
  ['23:59 IST', new Date('2026-09-30T23:59:00+05:30')],
  ['12:00 IST noon', new Date('2026-09-30T12:00:00+05:30')],
];

let fail = 0;
const ok = (label, got, want) => {
  const pass = got === want;
  if (!pass) fail++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}  got=${got} want=${want}`);
};

for (const [label, d] of cases) {
  const p12 = currentPin(d);
  const p24 = currentPin24(d);
  const three = p12.replace(/^0/, '');
  console.log(`\n${label}: clock=${kolkataClock(d)}  hint=${currentPinHint(d)}  12hr=${p12}  24hr=${p24}  candidates=${pinCandidates(d).join(',')}`);
  ok(`  accept 4-digit 12hr ${p12}`, checkPin(p12, d), true);
  ok(`  accept 3-digit ${three}`, checkPin(three, d), true);
  ok(`  accept 4-digit 24hr ${p24}`, checkPin(p24, d), true);
  ok('  reject 9999', checkPin('9999', d), false);
  ok('  reject "ab"', checkPin('ab', d), false);
}

// minute rollover: typed one minute ago, entered just after the minute flipped
const flip = new Date('2026-09-30T13:24:05+05:30');
ok('\nrollover tolerance (1 min ago still ok)', checkPin('1323', flip), true);

console.log('\ncountdown to 2026-12-11 from 30 Sep 2026 13:23 IST:');
console.log(JSON.stringify(countdownParts('2026-12-11', new Date('2026-09-30T13:23:00+05:30'))));
console.log('after the date:', JSON.stringify(countdownParts('2026-12-11', new Date('2027-01-01T00:00:00+05:30'))));

console.log(fail === 0 ? '\nALL GATE CHECKS PASSED' : `\n${fail} CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);
