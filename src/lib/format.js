// Tiny bilingual helper + date helpers. No deps.
export const t = (obj, lang) => {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.hi || obj.en || '';
};
export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const daysUntil = (iso) => {
  const a = new Date(todayISO() + 'T00:00:00');
  const b = new Date(iso + 'T00:00:00');
  return Math.round((b - a) / 86400000);
};
export const fmtDate = (iso, lang) => {
  try {
    return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso + 'T00:00:00'));
  } catch { return iso; }
};
export const STATUS_LABEL = { confirmed: { hi: 'पक्का', en: 'Confirmed' }, tentative: { hi: 'लगभग तय', en: 'Tentative' }, toVerify: { hi: 'पुष्टि बाक़ी', en: 'To confirm' }, suggested: { hi: 'सुझाव', en: 'Suggestion' }, context: { hi: 'जानकारी', en: 'Info' } };
