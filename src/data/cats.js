// The 3 season categories — single source of truth (date-based).
// chhath: 13–16 Nov · cousin: 27 Nov–3 Dec (incl. bridge/prep 4–6 Dec) · wedding: 7–13 Dec
export const CATS = [
  { id: 'chhath', hi: 'छठ पूजा', en: 'Chhath Puja', icon: '☀', tint: 'tint-chhath', tracks: ['chhath'], range: '13–16 Nov' },
  { id: 'cousin', hi: 'कज़न की शादी', en: "Cousin's wedding", icon: '🪔', tint: 'tint-cousin', tracks: ['cousin', 'bridge'], range: '27 Nov–6 Dec' },
  { id: 'wedding', hi: 'भाई की शादी', en: "Brother's wedding", icon: '🌼', tint: 'tint-wedding', tracks: ['wedding'], range: '7–13 Dec' },
];
export const catOf = (track) => (track === 'chhath' ? 'chhath' : track === 'cousin' || track === 'bridge' ? 'cousin' : 'wedding');
export const catById = (id) => CATS.find(c => c.id === id);
