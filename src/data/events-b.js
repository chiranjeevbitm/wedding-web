// EVENTS part 2 — the seven wedding days 7–13 Dec (dossier §15.4).
export const WEDDING_EVENTS = [
  { id: 'dec-07', date: '2026-12-07', track: 'wedding', status: 'confirmed', roman: 'Shiv Charcha + Geet', geetDay: true,
    title: { hi: 'शिव चर्चा + गीत', en: 'Shiv Charcha + Geet' }, subtitle: { hi: 'सुबह शिव चर्चा · शाम गीत', en: 'Morning charcha · evening geet' },
    slots: [{ label: { hi: 'शिव चर्चा', en: 'Shiv Charcha' }, status: 'tentative' }, { label: { hi: 'गीत (शाम)', en: 'Geet' }, status: 'tentative' }], kitIds: ['shiv-kit', 'winter-kit'], ritualIds: ['shiv-charcha', 'geet'] },
  { id: 'dec-08', date: '2026-12-08', track: 'wedding', status: 'confirmed', roman: 'Hanuman Aradhana + Geet', geetDay: true,
    title: { hi: 'हनुमान आराधना + गीत', en: 'Hanuman Aradhana + Geet' }, subtitle: { hi: 'सुबह आराधना · शाम गीत', en: 'Morning aradhana · evening geet' },
    slots: [{ label: { hi: 'हनुमान आराधना', en: 'Hanuman Aradhana' }, status: 'tentative' }, { label: { hi: 'गीत (शाम)', en: 'Geet' }, status: 'tentative' }], kitIds: ['hanuman-kit'], ritualIds: ['hanuman-aradhana', 'geet'] },
  { id: 'dec-09', date: '2026-12-09', track: 'wedding', status: 'confirmed', roman: 'Haldi + Mehendi + Geet', geetDay: true,
    title: { hi: 'हल्दी + मेहंदी + गीत', en: 'Haldi + Mehendi + Geet' }, subtitle: { hi: 'हल्दी · मेहंदी · गीत · फ़ोटो', en: 'Haldi · Mehendi · Geet · photos' },
    slots: [{ label: { hi: 'हल्दी', en: 'Haldi' }, status: 'tentative' }, { label: { hi: 'मेहंदी', en: 'Mehendi' }, status: 'tentative' }, { label: { hi: 'फ़ोटो शूट', en: 'Photo shoot' }, status: 'tentative' }], kitIds: ['haldi-kit', 'mehendi-kit'], ritualIds: ['haldi', 'mehendi', 'geet'] },
  { id: 'dec-10', date: '2026-12-10', track: 'wedding', status: 'confirmed', roman: 'Sangeet + Matkor', geetDay: true,
    title: { hi: 'संगीत + मटकोर', en: 'Sangeet + Matkor' }, subtitle: { hi: 'दिन में संगीत · शाम मटकोर', en: 'Sangeet by day · Matkor evening' },
    slots: [{ label: { hi: 'संगीत — प्रस्तुतियाँ', en: 'Sangeet' }, status: 'tentative' }, { label: { hi: 'मटकोर (शाम)', en: 'Matkor' }, status: 'tentative' }], kitIds: ['sangeet-kit', 'matkor-kit', 'winter-kit'], ritualIds: ['sangeet', 'matkor'] },
  { id: 'dec-11', date: '2026-12-11', track: 'wedding', status: 'confirmed', roman: 'Shaadi · Baraat · Vivah',
    title: { hi: 'शादी · बारात · विवाह', en: 'Shaadi · Baraat · Vivah' }, subtitle: { hi: 'मुहूर्त पंडित जी से', en: 'Muhurat from the pandit' },
    slots: [{ label: { hi: 'परिच्छवन / घर की पूजा', en: 'Parichhawan' }, status: 'toVerify' }, { label: { hi: 'बारात रवाना', en: 'Baraat departs' }, status: 'toVerify' }, { label: { hi: 'जयमाला', en: 'Jaimala' }, status: 'toVerify' }, { label: { hi: 'विवाह · भँवर · सिंदूर दान', en: 'Vivah rites' }, status: 'toVerify' }], kitIds: ['baraat-kit', 'winter-kit'], ritualIds: ['parichhawan', 'jaimala', 'saptapadi', 'sindoor-daan'] },
  { id: 'dec-12', date: '2026-12-12', track: 'wedding', status: 'confirmed', roman: 'Return + Tokriwala',
    title: { hi: 'वापसी · टोकरीवाला · विदाई', en: 'Return · Tokriwala · Vidai' }, subtitle: { hi: 'टोकरी फंक्शन · मेहमानों की विदाई', en: 'Tokri function · guests depart' },
    slots: [{ label: { hi: 'टोकरीवाला', en: 'Tokriwala' }, status: 'toVerify' }, { label: { hi: 'रिश्तेदारों की विदाई', en: 'Vidai' }, status: 'tentative' }], kitIds: ['tokri-kit'], ritualIds: ['tokriwala', 'vidai'] },
  { id: 'dec-13', date: '2026-12-13', track: 'wedding', status: 'confirmed', roman: 'Reception',
    title: { hi: 'रिसेप्शन', en: 'Reception' }, subtitle: { hi: 'समापन उत्सव', en: 'Closing celebration' },
    slots: [{ label: { hi: 'स्वागत', en: 'Welcome' }, status: 'tentative' }, { label: { hi: 'स्टेज कार्यक्रम', en: 'Stage' }, status: 'tentative' }, { label: { hi: 'भोजन', en: 'Dinner' }, status: 'tentative' }], kitIds: ['reception-kit', 'winter-kit'], ritualIds: ['reception'] },
];

export const CLUSTERS = [{
  id: 'cousin-wedding', track: 'cousin', status: 'confirmed',
  title: { hi: 'कज़न की शादी — पूरी कहानी', en: "Cousin's wedding — full story" },
  startDate: '2026-11-27', endDate: '2026-12-03',
  known: [
    { date: '2026-11-27', status: 'confirmed', label: { hi: 'मटकोर — मुज़फ़्फ़रपुर', en: 'Matkor — Muzaffarpur' } },
    { date: '2026-12-02', status: 'confirmed', label: { hi: 'शादी — दिल्ली (गुवाव × अल्का)', en: 'Wedding — Delhi' } },
    { date: '2026-12-03', status: 'tentative', label: { hi: 'रात में वापसी', en: 'Night return' } },
  ],
}];

export const TRAVEL_LEGS = [
  { id: 'leg_blr_mfp', from: 'Bengaluru', to: 'Muzaffarpur', departAt: '2026-11-05', status: 'confirmed', personIds: ['chiranjeev'], label: { hi: 'बेंगलुरु → मुज़फ़्फ़रपुर', en: 'Bengaluru → Muzaffarpur' } },
  { id: 'leg_mfp_delhi', from: 'Muzaffarpur', to: 'Delhi', departAt: '2026-11-30', status: 'toVerify', personIds: ['chiranjeev', 'komal', 'pramila-kumari', 'nani'], label: { hi: 'मुज़फ़्फ़रपुर → दिल्ली', en: 'Muzaffarpur → Delhi' } },
  { id: 'leg_delhi_mfp', from: 'Delhi', to: 'Muzaffarpur', departAt: '2026-12-03', status: 'toVerify', personIds: ['chiranjeev', 'komal', 'pramila-kumari', 'nani'], label: { hi: 'दिल्ली → मुज़फ़्फ़रपुर', en: 'Delhi → Muzaffarpur' } },
];

export const EXCURSION = { from: '2026-11-30', to: '2026-12-03', personIds: ['chiranjeev', 'komal', 'pramila-kumari', 'nani'],
  note: { hi: 'घर गौरी शंकर जी सँभालेंगे।', en: 'Gauri Shankar holds the house.' } };
