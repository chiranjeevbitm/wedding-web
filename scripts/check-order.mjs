// Verifies checklist ordering: everything is grouped per day and sorted by date.
// Run: npm run check:order
import { ANY, groupByDay, groupProgress, daySortKey } from '../src/lib/order.js';
import { ALL_EVENTS } from '../src/data/all-events.js';

let fail = 0;
const ok = (label, got, want) => {
  const pass = got === want;
  if (!pass) fail++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}  got=${got} want=${want}`);
};

// Deliberately shuffled input: wedding days out of order, plus an "anytime" item.
const items = [
  { id: 'a', dayId: 'dec-11', done: true },
  { id: 'b', dayId: null, done: false },
  { id: 'c', dayId: 'dec-07', done: false },
  { id: 'd', dayId: 'dec-10', done: true },
  { id: 'e', dayId: 'nov-13', done: false },
  { id: 'f', dayId: 'dec-09', done: false },
];

const groups = groupByDay(items, ALL_EVENTS);
console.log('   order →', groups.map((g) => g.day).join(' , '));

ok('groups are ordered by date', groups.map((g) => g.day).join(','),
  'nov-13,dec-07,dec-09,dec-10,dec-11,' + ANY);
ok('first group is the earliest date', groups[0].day, 'nov-13');
ok('last group is the anytime bucket', groups[groups.length - 1].day, ANY);
ok('every item lands in exactly one group', groups.reduce((n, g) => n + g.items.length, 0), items.length);
ok('items keep their own order inside a day',
  groups.find((g) => g.day === 'dec-11').items.map((i) => i.id).join(','), 'a');

// The 3 season categories only ever contain their own days.
const catOfDay = (dayId) => {
  const e = ALL_EVENTS.find((x) => x.id === dayId);
  if (!e) return null;
  return e.track === 'chhath' ? 'chhath' : (e.track === 'cousin' || e.track === 'bridge') ? 'cousin' : 'wedding';
};
const chhathDays = groups.map((g) => g.day).filter((d) => catOfDay(d) === 'chhath');
ok('Chhath days are date-ordered too', chhathDays.join(','), 'nov-13');

// Progress maths
const p = groupProgress([{ done: true }, { done: true }, { done: false }, { done: false }]);
ok('progress counts done', p.done, 2);
ok('progress counts total', p.total, 4);
ok('progress percent', p.pct, 50);
ok('progress on an empty group is 0%', groupProgress([]).pct, 0);

// Anytime always sorts after every real date.
const allKeys = ALL_EVENTS.map((e) => e.date).concat('9999-12-31');
ok('anytime has the largest sort key', daySortKey(ANY, ALL_EVENTS), '9999-12-31');
ok('unknown day id does not break sorting',
  groupByDay([{ id: 'x', dayId: 'no-such-day' }], ALL_EVENTS)[0].day, 'no-such-day');

console.log(fail === 0 ? '\nALL ORDER CHECKS PASSED' : `\n${fail} CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);
