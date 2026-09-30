// Kolkata-time PIN gate.
// Password = current time in Asia/Kolkata, 12-hr clock, HHMM digits.
// Accepts: "0123" or "123" (for 01:23), "1159"/"1159" etc. — leading zero optional,
// and 3-digit input is left-padded before compare. Seconds are ignored.

export const KOLKATA_TZ = 'Asia/Kolkata';
const GATE_KEY = 'ghar-ki-shaadi-gate-v1';

const kolkataParts = (d = new Date()) => {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: KOLKATA_TZ, hour: 'numeric', minute: '2-digit', hour12: true,
  });
  const parts = fmt.formatToParts(d);
  const get = (t) => (parts.find((p) => p.type === t) || {}).value || '';
  return { hour: parseInt(get('hour'), 10), minute: get('minute'), dayPeriod: get('dayPeriod') };
};

// Canonical PIN for "now": e.g. 1:23 AM/PM -> "0123"
export const currentPin = (d = new Date()) => {
  const { hour, minute } = kolkataParts(d);
  return `${String(hour).padStart(2, '0')}${minute}`;
};

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

// Accept "0123", "123", "01:23", "1:23", "01 23" — anything whose digits,
// left-padded to 4, equal the current PIN. Rejects seconds / longer input.
export const checkPin = (input, d = new Date()) => {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.length < 3 || digits.length > 4) return false;
  return digits.padStart(4, '0') === currentPin(d);
};

export const isUnlocked = () => {
  try {
    return sessionStorage.getItem(GATE_KEY) === 'open';
  } catch {
    return false;
  }
};

export const unlock = () => {
  try {
    sessionStorage.setItem(GATE_KEY, 'open');
  } catch {
    /* private mode — gate simply re-asks next load */
  }
};

export const lock = () => {
  try {
    sessionStorage.removeItem(GATE_KEY);
  } catch {
    /* noop */
  }
};
