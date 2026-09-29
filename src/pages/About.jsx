import { useStore } from '../lib/store.jsx';
import { SEASON_META } from '../data/journey.js';
import { t } from '../lib/format.js';

export default function About() {
  const { state } = useStore();
  const lang = state.lang;
  return (
    <div className="wrap">
      <h2>🙏 {lang === 'hi' ? 'हमारे बारे में' : 'About'}</h2>
      <div className="card tint-wedding">
        <div style={{ fontSize: 44, textAlign: 'center' }}>🤵👰</div>
        <h3 style={{ textAlign: 'center' }}>Dr. Deepak Kumar × Alka</h3>
        <p style={{ textAlign: 'center' }} className="muted">{lang === 'hi' ? 'आज वे डॉक्टर नहीं, दूल्हा हैं।' : 'Today he is not the doctor — he is the groom.'}</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <a className="btn small ghost" href={SEASON_META.groom.profileUrl} target="_blank" rel="noreferrer">{lang === 'hi' ? 'दूल्हे की प्रोफ़ाइल' : "Groom's profile"}</a>
        </div>
      </div>
      <div className="card tint-cousin">
        <h3>🪔 Guvav × Alka · 2 Dec · Delhi</h3>
        <p className="small muted">{lang === 'hi' ? 'ममेरे भाई की शादी — मौसम का दूसरा उत्सव।' : "The cousin's wedding — the season's other celebration."}</p>
      </div>
      <div className="card">
        <h3>📍 Muzaffarpur · {lang === 'hi' ? 'हमारी जगह' : 'Our place'}</h3>
        <p className="small">{lang === 'hi' ? 'तीरहुत · उत्तर बिहार · बज्जिका क्षेत्र · लीची की धरती · उत्तर बिहार की राजधानी। बूढ़ी गंडक · बाबा गरीबनाथ मंदिर।' : 'Tirhut · North Bihar · Bajjika zone · Land of Litchi · Capital of North Bihar. Budhi Gandak · Baba Garibnath Mandir.'}</p>
      </div>
      <div className="card">
        <h3>{lang === 'hi' ? 'यह ऐप' : 'This app'}</h3>
        <p className="small">{t(SEASON_META.tagline, lang)}</p>
        <p className="small muted">{lang === 'hi' ? 'बदलाव इसी फ़ोन में सेव होते हैं; Neon उपलब्ध हो तो साझा भी होते हैं। परंपरा हर परिवार में अलग — पंडित जी और बड़ों से पुष्टि करें।' : 'Changes save on this phone; shared via Neon when available. Traditions differ — confirm with pandit/elders.'}</p>
      </div>
    </div>
  );
}
