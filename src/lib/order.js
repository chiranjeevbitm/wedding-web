// Checklist ordering — pure + testable (see scripts/check-order.mjs).
//
// Items carry a `dayId` (an event id) or nothing. We group per day and sort
// the groups chronologically by the event date, with the "anytime" bucket
// always last. Within a day we keep the order items were added/inserted.
export const ANY = 'any';

const dateOf = (dayId, events) => {
  if (dayId === ANY) return '9999-12-31';
  const e = events.find((x) => x.id === dayId);
  return (e && e.date) || '9999-12-31';
};

export const daySortKey = (dayId, events) => dateOf(dayId, events);

export const groupByDay = (items, events) => {
  const map = new Map();
  for (const it of items) {
    const key = it.dayId || ANY;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(it);
  }
  return [...map.entries()]
    .map(([day, list]) => ({ day, items: list }))
    .sort((a, b) => dateOf(a.day, events).localeCompare(dateOf(b.day, events)) || a.day.localeCompare(b.day));
};

// Progress for one group.
export const groupProgress = (list) => {
  const done = list.filter((i) => i.done).length;
  return { done, total: list.length, pct: list.length ? Math.round((done / list.length) * 100) : 0 };
};
