// EVENTS part 1 — Chhath + cousin + bridge (dossier §15.2–15.4).
export const CHHATH_EVENTS = [
  { id: 'nov-13', date: '2026-11-13', track: 'chhath', status: 'confirmed', roman: 'Nahay Khay',
    title: { hi: 'नहाय-खाय', en: 'Nahay Khay' }, subtitle: { hi: 'छठ का पहला दिन', en: 'Day 1 of Chhath' },
    slots: [{ label: { hi: 'सात्विक भोजन (कद्दू-भात)', en: 'Sattvik meal' }, status: 'tentative' }], kitIds: ['prasad-kit'], ritualIds: ['nahay-khay'] },
  { id: 'nov-14', date: '2026-11-14', track: 'chhath', status: 'confirmed', roman: 'Kharna',
    title: { hi: 'खरना (लोहंडा)', en: 'Kharna (Lohanda)' }, subtitle: { hi: 'गुड़ की खीर — फिर 36 घंटे व्रत', en: 'Kheer, then the 36-hour fast' },
    slots: [{ label: { hi: 'प्रसाद बनाना व बाँटना', en: 'Making prasad' }, status: 'tentative' }, { label: { hi: 'निर्जला व्रत शुरू', en: 'Fast begins' }, status: 'confirmed' }], kitIds: ['prasad-kit'], ritualIds: ['kharna'] },
  { id: 'nov-15', date: '2026-11-15', track: 'chhath', status: 'confirmed', roman: 'Sandhya Arghya',
    title: { hi: 'संध्या अर्घ्य', en: 'Sandhya Arghya' }, subtitle: { hi: 'सूर्यास्त पर घाट पर अर्घ्य', en: 'Evening offering at the ghat' },
    slots: [{ label: { hi: 'घाट के लिए निकलना', en: 'Leave for ghat' }, status: 'toVerify' }, { label: { hi: 'संध्या अर्घ्य', en: 'Sandhya Arghya' }, status: 'toVerify' }], kitIds: ['prasad-kit', 'ghat-kit'], ritualIds: ['sandhya-arghya'] },
  { id: 'nov-16', date: '2026-11-16', track: 'chhath', status: 'confirmed', roman: 'Usha Arghya + Parana',
    title: { hi: 'उषा अर्घ्य + पारण', en: 'Usha Arghya + Parana' }, subtitle: { hi: 'सूर्योदय अर्घ्य, फिर पारण', en: 'Sunrise offering, then parana' },
    slots: [{ label: { hi: 'उषा अर्घ्य', en: 'Usha Arghya' }, status: 'toVerify' }, { label: { hi: 'पारण', en: 'Parana' }, status: 'tentative' }], kitIds: ['prasad-kit', 'ghat-kit'], ritualIds: ['usha-arghya', 'parana'] },
];

export const COUSIN_EVENTS = [
  { id: 'nov-27', date: '2026-11-27', track: 'cousin', status: 'confirmed', roman: "Cousin's Matkor (MFP)",
    title: { hi: 'कज़न का मटकोर', en: "Cousin's Matkor" }, subtitle: { hi: 'मुज़फ़्फ़रपुर — सब शाम तक', en: 'Muzaffarpur — all by evening' },
    slots: [{ label: { hi: 'मटकोर', en: 'Matkor' }, status: 'confirmed' }], ritualIds: ['matkor'] },
  { id: 'dec-02', date: '2026-12-02', track: 'cousin', status: 'confirmed', roman: "Cousin's wedding (Delhi)",
    title: { hi: 'गुवाव × अल्का — शादी (दिल्ली)', en: 'Gurvav × Alka — Delhi' }, subtitle: { hi: 'बारात और विवाह', en: 'Baraat and vivah' },
    slots: [{ label: { hi: 'शादी / बारात', en: 'Wedding / baraat' }, status: 'confirmed' }], ritualIds: ['saptapadi'] },
];

export const BRIDGE_EVENTS = [
  { id: 'dec-04', date: '2026-12-04', track: 'bridge', status: 'suggested', roman: 'Reset',
    title: { hi: 'आराम और वापसी', en: 'Rest and reset' }, subtitle: { hi: 'रात की यात्रा के बाद आराम', en: 'Recover after night travel' },
    slots: [{ label: { hi: 'आराम', en: 'Rest' }, status: 'suggested' }] },
  { id: 'dec-05', date: '2026-12-05', track: 'bridge', status: 'suggested', roman: 'Shopping',
    title: { hi: 'ख़रीदारी', en: 'Shopping' }, subtitle: { hi: 'कपड़े, उपहार, सामान', en: 'Clothes, gifts, items' },
    slots: [{ label: { hi: 'कपड़े / उपहार', en: 'Clothes / gifts' }, status: 'suggested' }], kitIds: ['winter-kit'] },
  { id: 'dec-06', date: '2026-12-06', track: 'bridge', status: 'suggested', roman: 'House prep',
    title: { hi: 'घर और मंडप की तैयारी', en: 'House and mandap prep' }, subtitle: { hi: 'घर फंक्शन के लिए तैयार', en: 'Getting the house ready' },
    slots: [{ label: { hi: 'सजावट / मंडप', en: 'Decoration' }, status: 'suggested' }], kitIds: ['winter-kit'] },
];
