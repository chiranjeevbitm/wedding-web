// SEASON SEED — from wedding-context-and-reasoning.md §15.1 (dossier wins over plan).
export const TRACKS = [
  { id: 'chhath', hi: 'छठ पूजा', en: 'Chhath Puja', start: '2026-11-13', end: '2026-11-16', tint: 'tint-chhath', icon: '☀',
    line: { hi: 'सूर्य और छठी मैया की उपासना — चार दिन', en: 'Four days of sun worship, fasting and ghat offerings' } },
  { id: 'cousin', hi: 'कज़न की शादी', en: "Cousin's wedding", start: '2026-11-27', end: '2026-12-03', tint: 'tint-cousin', icon: '🪔',
    line: { hi: 'मटकोर 27 नवं (मुज़फ़्फ़रपुर) · शादी 2 दिसं (दिल्ली) · वापसी 3 दिसं', en: 'Matkor 27 Nov (MFP) · wedding 2 Dec (Delhi) · return 3 Dec' } },
  { id: 'bridge', hi: 'तैयारी और सफ़र', en: 'Preparation & travel', start: '2026-12-04', end: '2026-12-06', tint: 'tint-bridge', icon: '🧳',
    line: { hi: 'सिर्फ़ 3 दिन — कोहरे का बफ़र रखें', en: 'Only three days — keep a fog buffer' } },
  { id: 'wedding', hi: 'भाई की शादी', en: "Brother's wedding", start: '2026-12-07', end: '2026-12-13', tint: 'tint-wedding', icon: '🌼',
    line: { hi: 'सात दिन · सात उत्सव · एक परिवार', en: 'Seven days, seven celebrations, one family' } },
];

export const SEASON_META = {
  title: { hi: 'घर की शादी', en: 'Ghar Ki Shaadi' },
  tagline: { hi: 'एक शादी नहीं, पूरे परिवार की कहानी।', en: "Not one wedding — a whole family's story." },
  groom: { name: 'Dr. Deepak Kumar', hi: 'डॉ. दीपक कुमार', profileUrl: 'https://doctors-profile-chi.vercel.app/' },
  bride: { name: 'Alka', hi: 'अल्का', status: 'confirmed' },
  cousinCouple: { groom: { name: 'Gurvav', hi: 'गुवाव' }, bride: { name: 'Alka', hi: 'अल्का' }, date: '2026-12-02', place: 'Delhi' },
  family: [
    { id: 'chiranjeev', name: 'Chiranjeev', hi: 'चिरंजीव', relation: { hi: 'स्वयं', en: 'Self' }, profession: { hi: 'सीनियर AI इंजीनियर', en: 'Senior AI engineer' } },
    { id: 'komal', name: 'Komal', hi: 'कोमल', relation: { hi: 'पत्नी', en: 'Wife' }, profession: { hi: 'सीनियर AI इंजीनियर', en: 'Senior AI engineer' } },
    { id: 'gauri-shankar', name: 'Gauri Shankar', hi: 'गौरी शंकर', relation: { hi: 'पिता', en: 'Father' }, profession: { hi: 'सरकारी शिक्षक', en: 'Govt. Teacher' }, staysHome: true },
    { id: 'pramila-kumari', name: 'Pramila Kumari', hi: 'प्रमिला कुमारी', relation: { hi: 'माँ', en: 'Mother' }, profession: { hi: 'सरकारी शिक्षक', en: 'Govt. Teacher' } },
    { id: 'nani', name: '', hi: 'नानी', relation: { hi: 'नानी', en: 'Nani' }, travelsDelhi: true },
    { id: 'deepak', name: 'Dr. Deepak Kumar', hi: 'डॉ. दीपक कुमार', relation: { hi: 'भाई (दूल्हा)', en: 'Brother (groom)' }, profession: { hi: 'डॉक्टर', en: 'Doctor' } },
  ],
  place: { city: 'Muzaffarpur', hi: 'मुज़फ़्फ़रपुर', note: { hi: 'तीरहुत · उत्तर बिहार · लीची की धरती', en: 'Tirhut · North Bihar · Land of Litchi' } },
  season: { start: '2026-11-13', end: '2026-12-13' },
  milestones: [
    { id: 'm1', date: '2026-11-13', label: { hi: 'छठ शुरू', en: 'Chhath begins' } },
    { id: 'm2', date: '2026-11-27', label: { hi: 'कज़न का मटकोर', en: "Cousin's Matkor" } },
    { id: 'm3', date: '2026-12-02', label: { hi: 'कज़न की शादी (दिल्ली)', en: "Cousin's wedding (Delhi)" } },
    { id: 'm4', date: '2026-12-07', label: { hi: 'गीत शुरू', en: 'Geet begins' } },
    { id: 'm5', date: '2026-12-11', label: { hi: 'शादी', en: 'The wedding' } },
    { id: 'm6', date: '2026-12-13', label: { hi: 'रिसेप्शन', en: 'Reception' } },
  ],
};

export const CRUNCH = {
  title: { hi: 'सिर्फ़ चार दिन', en: 'Only four days' },
  body: { hi: '3 दिसंबर की रात वापसी, और 7 दिसंबर से गीत शुरू। बीच में सिर्फ़ तीन दिन — सफ़र, ख़रीदारी, घर और रिहर्सल। दिसंबर में कोहरा ट्रेन लेट करता है, इसलिए बफ़र रखें।',
    en: 'Return late on 3 Dec, geet from 7 Dec. Three days between: travel, shopping, house, rehearsal. December fog delays trains — keep a buffer.' },
};

export const HOME_BASE = {
  title: { hi: 'मुज़फ़्फ़रपुर — घर', en: 'Muzaffarpur — home base' },
  body: { hi: 'परिवार ज़्यादातर यहीं है। सिर्फ़ 30 नवं–3 दिसं चार लोग दिल्ली जाएँगे।', en: 'The family is here almost the whole season. Only 30 Nov–3 Dec do four people go to Delhi.' },
};

export const SHOPPING_WEEKENDS = [
  { id: 'w1', dates: '7–8 Nov', hi: 'जल्दी ख़रीदारी (दीवाली की भीड़ से बचें)', en: 'Early shopping (avoid Diwali crowds)', level: 'early' },
  { id: 'w2', dates: '21–22 Nov', hi: 'मुख्य शादी की ख़रीदारी', en: 'Main wedding shopping', level: 'major' },
  { id: 'w3', dates: '28–29 Nov', hi: 'दिल्ली के सामान + बचा हुआ', en: 'Delhi-trip items + leftovers', level: 'important' },
  { id: 'w4', dates: '5–6 Dec', hi: 'आख़िरी ख़रीदारी — यही अंतिम मौका', en: 'Final shopping — the last window', level: 'critical' },
];

export const SHOPPING_RULE = {
  hi: 'पहले ख़रीदें → घर में रखें → दिल्ली जाएँ → लौटें → सिर्फ़ आख़िरी ख़रीदारी → शादी शुरू। ज़्यादातर सामान 22 नवंबर तक।',
  en: 'Buy early → store at home → travel to Delhi → return → only final purchases → the wedding begins. Almost everything by 22 Nov.',
};
