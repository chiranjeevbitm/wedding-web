// RITUALS part 2 — wedding rites + songs + decisions.
import { RITUALS_A } from './rituals-a.js';
export const RITUALS_B = [
  { id: 'haldi', name: { hi: 'हल्दी', en: 'Haldi' },
    when: { hi: 'शादी से 2–3 दिन पहले', en: '2–3 days before' },
    context: { hi: 'परंपरा में: हल्दी लेप + गीत।', en: 'Traditionally: paste with songs.' }, family: { hi: '', en: '' } },
  { id: 'mehendi', name: { hi: 'मेहंदी', en: 'Mehendi' },
    when: { hi: 'हल्दी के साथ', en: 'With haldi' },
    context: { hi: 'परंपरा में: हाथों पर मेहंदी।', en: 'Traditionally: henna on hands.' }, family: { hi: '', en: '' } },
  { id: 'sangeet', name: { hi: 'संगीत', en: 'Sangeet' },
    when: { hi: '10 दिसंबर, दिन में', en: '10 Dec daytime' },
    context: { hi: 'परंपरा में: परिवार की प्रस्तुतियाँ।', en: 'Traditionally: family performances.' }, family: { hi: '', en: '' } },
  { id: 'matkor', name: { hi: 'मटकोर', en: 'Matkor' },
    when: { hi: 'शादी से 2–3 दिन पहले', en: '2–3 days before' },
    context: { hi: 'परंपरा में: महिलाएँ पवित्र मिट्टी लाती हैं। हर परिवार में अलग।', en: 'Traditionally: women fetch soil; varies.' }, family: { hi: '', en: '' } },
  { id: 'parichhawan', name: { hi: 'परिच्छवन', en: 'Parichhawan' },
    when: { hi: 'बारात से पहले', en: 'Before baraat' },
    context: { hi: 'परंपरा में: घर की पूजा।', en: 'Traditionally: house puja.' }, family: { hi: '', en: '' } },
  { id: 'jaimala', name: { hi: 'जयमाला', en: 'Jaimala' },
    when: { hi: 'विवाह की शुरुआत', en: 'Start' },
    context: { hi: 'परंपरा में: माला अदला-बदली।', en: 'Traditionally: garland exchange.' }, family: { hi: '', en: '' } },
  { id: 'saptapadi', name: { hi: 'भँवर / सप्तपदी', en: 'Saptapadi' },
    when: { hi: 'मुख्य विवाह', en: 'Main ceremony' },
    context: { hi: 'परंपरा में: अग्नि की सात परिक्रमाएँ।', en: 'Traditionally: seven rounds.' }, family: { hi: '', en: '' } },
  { id: 'sindoor-daan', name: { hi: 'सिंदूर दान', en: 'Sindoor Daan' },
    when: { hi: 'मुख्य विवाह', en: 'Main ceremony' },
    context: { hi: 'परंपरा में: मांग में सिंदूर।', en: 'Traditionally: vermillion.' }, family: { hi: '', en: '' } },
  { id: 'tokriwala', name: { hi: 'टोकरीवाला', en: 'Tokriwala' },
    when: { hi: '12 दिसंबर', en: '12 Dec' },
    context: { hi: 'परंपरा में: टोकरी का लेन-देन — परिवार से पूछें। विदाई से अलग।', en: 'Ask the family; not the vidai.' }, family: { hi: '', en: '' } },
  { id: 'vidai', name: { hi: 'विदाई', en: 'Vidai' },
    when: { hi: '12 दिसंबर', en: '12 Dec' },
    context: { hi: 'परंपरा में: मेहमानों को विदा।', en: 'Traditionally: seeing off guests.' }, family: { hi: '', en: '' } },
  { id: 'reception', name: { hi: 'रिसेप्शन', en: 'Reception' },
    when: { hi: '13 दिसंबर', en: '13 Dec' },
    context: { hi: 'परंपरा में: समापन उत्सव।', en: 'Traditionally: closing event.' }, family: { hi: '', en: '' } },
  { id: 'dwar-puja', name: { hi: 'द्वार पूजा', en: 'Dwar Puja' },
    when: { hi: 'विवाह स्थल पर', en: 'At venue' },
    context: { hi: 'परंपरा में: दूल्हे का स्वागत।', en: 'Traditionally: greeting groom.' }, family: { hi: '', en: '' } },
];

export const RITUALS = [...RITUALS_A, ...RITUALS_B];

export const SONGS = [
  { id: 'g1', title: 'कहवां के पियर माटी (मटकोर गीत)', occasions: ['matkor'] },
  { id: 'g2', title: 'छठी मैया के गीत', occasions: ['chhath'] },
  { id: 'g3', title: 'हल्दी के गीत', occasions: ['haldi'] },
];

export const DECISIONS = [
  { id: 'd1', status: 'confirmed', text: { hi: 'गीत 7 दिसंबर से — पाँच दिन।', en: 'Geet from 7 Dec.' } },
  { id: 'd2', status: 'confirmed', text: { hi: 'हल्दी 9 दिसंबर को।', en: 'Haldi on 9 Dec.' } },
  { id: 'd3', status: 'tentative', text: { hi: '10 दिसं: संगीत दिन में, मटकोर शाम।', en: '10 Dec split day.' } },
  { id: 'd4', status: 'confirmed', text: { hi: 'रिसेप्शन 13 दिसंबर।', en: 'Reception 13 Dec.' } },
  { id: 'd5', status: 'confirmed', text: { hi: 'कज़न शादी 2 दिसं, दिल्ली।', en: 'Cousin wedding 2 Dec.' } },
  { id: 'd6', status: 'toVerify', text: { hi: 'बारात रवाना — 30 नवं या 1 दिसं?', en: 'Depart 30 Nov or 1 Dec?' } },
  { id: 'd7', status: 'toVerify', text: { hi: 'मुहूर्त — पंडित जी से।', en: 'Muhurat — pandit.' } },
  { id: 'd8', status: 'toVerify', text: { hi: 'टोकरीवाला में क्या होता है?', en: 'What is tokriwala?' } },
];

export const QUESTIONS = [
  { id: 'q1', text: { hi: 'हमारा घाट कौन सा है?', en: 'Which ghat?' } },
  { id: 'q2', text: { hi: 'कौन व्रत रखेगा?', en: 'Who fasts?' } },
  { id: 'q3', text: { hi: 'मुहूर्त क्या है?', en: 'Muhurat?' } },
  { id: 'q4', text: { hi: 'मटकोर में फावड़ा कौन?', en: 'Who digs?' } },
  { id: 'q5', text: { hi: 'हल्दी कौन लगाएगा?', en: 'Who applies haldi?' } },
];

export const TASKS = [
  { id: 't_tickets', due: '2026-11-29', status: 'toVerify', category: 'travel', title: { hi: '4 टिकट: MFP ↔ दिल्ली', en: '4 tickets MFP ↔ Delhi' } },
  { id: 't_leave', due: '2026-11-15', status: 'toVerify', category: 'docs', title: { hi: '16 नवं छुट्टी', en: 'Leave 16 Nov' } },
  { id: 't_shop', due: '2026-11-22', status: 'suggested', category: 'gifts', title: { hi: 'ख़रीदारी 22 नवं तक', en: 'Shopping by 22 Nov' } },
];
