// Verifies the shared-document sync protocol that makes edits reach everyone.
// Run: npm run check:sync
import { decide } from '../src/lib/sync.js';

let fail = 0;
const ok = (label, got, want) => {
  const pass = got === want;
  if (!pass) fail++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}  got=${got} want=${want}`);
};

const NOW = 1_760_000_000_000;

// --- first ever device: seed the row so sync can start at all ---
ok('empty table + initial pull → seed', decide({ remote: null, initial: true }), 'seed');
ok('empty table + later poll → nothing', decide({ remote: null, initial: false }), 'none');

// --- someone else edited → adopt ---
ok('newer document from another phone → adopt',
  decide({ remote: { updatedAt: NOW }, initial: true, seenTs: NOW - 5000, pushTs: 0 }), 'adopt');
ok('newer document on a later poll → adopt',
  decide({ remote: { updatedAt: NOW }, initial: false, seenTs: 0, pushTs: 0 }), 'adopt');

// --- our own write echoed back → ignore (no ping-pong) ---
ok('our own echo → none',
  decide({ remote: { updatedAt: NOW }, initial: false, seenTs: NOW - 1000, pushTs: NOW }), 'none');

// --- stale server copy must not overwrite newer local state ---
ok('older document → none',
  decide({ remote: { updatedAt: NOW - 9000 }, initial: false, seenTs: NOW, pushTs: 0 }), 'none');
ok('same stamp already seen → none',
  decide({ remote: { updatedAt: NOW }, initial: false, seenTs: NOW, pushTs: 0 }), 'none');

// --- a document without a stamp is treated as the oldest ---
ok('document with no updatedAt → none (never clobbers)',
  decide({ remote: { items: [] }, initial: false, seenTs: 5, pushTs: 0 }), 'none');

// --- the two-device story: A edits, B polls and receives it ---
let seenB = 0;                       // B has pulled nothing yet
const editA = { updatedAt: NOW, items: [{ id: 'x', name: { hi: 'नया', en: 'new' } }] };
ok('device B adopts device A\'s edit', decide({ remote: editA, initial: false, seenTs: seenB, pushTs: 0 }), 'adopt');
seenB = editA.updatedAt;             // B accepts it
ok('B does not re-adopt the same edit', decide({ remote: editA, initial: false, seenTs: seenB, pushTs: 0 }), 'none');

console.log(fail === 0 ? '\nALL SYNC CHECKS PASSED' : `\n${fail} CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);
