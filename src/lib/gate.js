// Kolkata-time PIN gate.
// Password = current time in Asia/Kolkata, 12-hr clock, HHMM digits.
// Accepts: "0123" or "123" (for 01:23), "1323" (24-hr), leading zero optional.
//
// Session rules (requested):
//   * in-memory only — a page refresh ALWAYS asks for the PIN again
//   * idle timeout — 4 minutes without activity locks the app again

export const KOLKATA_TZ = 'Asia/Kolkata';
export const SESSION_IDLE_MS = 4 * 60 * 1000;

// Module-level state = wiped by any reload, so refresh always re-asks.
let unlockedAt = 0;
let lastActivity = 0;

const kolkataParts = (d = new Date()) => {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: KOLKATA_TZ, hour: 'numeric', minute: '2-digit', hour12: true,
  });
  const parts = fmt.formatToParts(d);
  const get = (t) => (parts.find((p) => p.type === t) || {}).value || '';

  const fmt24 = new Intl.DateTimeFormat('en-GB', {
    timeZone: KOLKATA_TZ, hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const p24 = fmt24.formatToParts(d);
  const get24 = (t) => (p24.find((p) => p.type === t) || {}).value || '';

  return {
    hour: parseInt(get('hour'), 10),
    minute: get('minute'),
    dayPeriod: get('dayPeriod'),
    hour24: parseInt(get24('hour'), 10) % 24,
  };
};

// Canonical 12-hr PIN: 1:23 AM/PM -> "0123", noon -> "1200"
export const currentPin = (d = new Date()) => {
  const { hour, minute } = kolkataParts(d);
  return `${String(hour).padStart(2, '0')}${minute}`;
};

// 24-hr PIN: 1:23 PM -> "1323". Accepted too, because many phones show 24-hr time.
export const currentPin24 = (d = new Date()) => {
  const { hour24, minute } = kolkataParts(d);
  return `${String(hour24).padStart(2, '0')}${minute}`;
};

// Both accepted forms, minus duplicates (e.g. 12:00 and 12:00).
export const pinCandidates = (d = new Date()) => [...new Set([currentPin(d), currentPin24(d)])];

// Human hint shown on the login screen, e.g. "01:23"
export const currentPinHint = (d = new Date()) => {
  const pin = currentPin(d);
  return `${pin.slice(0, 2)}:${pin.slice(2)}`;
};

export const kolkataDayPeriod = (d = new Date()) => kolkataParts(d).dayPeriod; // "AM" | "PM"
export const kolkataClock = (d = new Date()) => {
  const { hour, minute, dayPeriod } = kolkataParts(d);
  return `${String(hour).padStart(2, '0')}:${minute} ${dayPeriod}`;
};

// Accept the 12-hr form ("0123" for 01:23) OR the 24-hr form ("1323"),
// with or without the leading zero, and with a ±1 minute tolerance so a
// minute rollover while typing doesn't reject a correct entry.
export const checkPin = (input, d = new Date()) => {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.length < 3 || digits.length > 4) return false;
  const typed = digits.padStart(4, '0');
  const windows = [0, -60000, 60000].map((off) => pinCandidates(new Date(d.getTime() + off)));
  return windows.some((list) => list.includes(typed));
};

// Live countdown to a date (Kolkata wall-clock): DD : HH : MM : SS.
export const countdownParts = (targetISO, d = new Date()) => {
  const tzNow = new Date(d.toLocaleString('en-US', { timeZone: KOLKATA_TZ }));
  const target = new Date(`${targetISO}T00:00:00+05:30`);
  let ms = target.getTime() - tzNow.getTime();
  if (ms <= 0) return { over: true, dd: '00', hh: '00', mm: '00', ss: '00' };
  const s = Math.floor(ms / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return {
    over: false,
    dd: pad(Math.floor(s / 86400)),
    hh: pad(Math.floor((s % 86400) / 3600)),
    mm: pad(Math.floor((s % 3600) / 60)),
    ss: pad(s % 60),
  };
};

// ---- session (in-memory, idle-limited) ----

export const unlock = (now = Date.now()) => {
  unlockedAt = now;
  lastActivity = now;
};

export const touch = (now = Date.now()) => {
  if (unlockedAt) lastActivity = now;
};

export const isUnlocked = (now = Date.now()) => {
  if (!unlockedAt) return false;
  if (now - lastActivity >= SESSION_IDLE_MS) {
    unlockedAt = 0;
    lastActivity = 0;
    return false;
  }
  return true;
};

// Milliseconds left before the idle timeout (0 when locked).
export const msLeft = (now = Date.now()) =>
  unlockedAt ? Math.max(0, SESSION_IDLE_MS - (now - lastActivity)) : 0;

export const lock = () => {
  unlockedAt = 0;
  lastActivity = 0;
};

