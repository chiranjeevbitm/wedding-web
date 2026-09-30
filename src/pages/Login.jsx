import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { SEASON_META } from '../data/journey.js';
import { t } from '../lib/format.js';
import { checkPin, countdownParts, isUnlocked, unlock } from '../lib/gate.js';

// Full-screen gate: login-page-video.mp4 behind, live countdown centre,
// PIN box a little above the bottom.
// NO hints anywhere: no clock, no sample PIN, no "correct PIN was …" —
// a wrong attempt only ever says it was wrong (request: never reveal PIN).
export default function Login() {
  const { state, setLang } = useStore();
  const lang = state.lang;
  const nav = useNavigate();
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [okMsg, setOkMsg] = useState('');
  const [cd, setCd] = useState(() => countdownParts('2026-12-11'));

  useEffect(() => {
    const id = setInterval(() => setCd(countdownParts('2026-12-11', new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  // Already unlocked (e.g. back button) — go straight in.
  useEffect(() => {
    if (isUnlocked()) nav('/', { replace: true });
  }, [nav]);

  const go = (value = pin) => {
    if (checkPin(value)) {
      setErr('');
      setOkMsg(lang === 'hi' ? 'सही PIN — अंदर ले जा रहे हैं… 💛' : 'Correct PIN — taking you in… 💛');
      unlock();
      setTimeout(() => nav('/', { replace: true }), 450);
    } else {
      // Deliberately opaque — never echoes the accepted value.
      setErr(lang === 'hi' ? 'गलत PIN — दोबारा कोशिश करें।' : 'Wrong PIN — please try again.');
      setPin('');
    }
  };

  return (
    <div className="gate">
      <video className="gate-video" src="/login-bg.mp4" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      <div className="gate-shade" aria-hidden="true" />

      <div className="gate-top">
        <div className="gate-om">ॐ</div>
        <h1 className="gate-title">{lang === 'hi' ? SEASON_META.title.hi : SEASON_META.title.en}</h1>
        <div className="gate-couple">
          Dr Deepak × {lang === 'hi' ? SEASON_META.bride.hi : SEASON_META.bride.name}
        </div>
        <div className="gate-place">
          {lang === 'hi' ? 'मुज़फ़्फ़रपुर · 11 दिसंबर 2026' : 'Muzaffarpur · 11 December 2026'}
        </div>
      </div>

      <div className="gate-count">
        {cd.over ? (
          <>
            <div className="gate-count-num">{lang === 'hi' ? 'आज' : 'Today'}</div>
            <div className="gate-count-label">{lang === 'hi' ? 'शादी का दिन आ गया 🌼' : "It's wedding day 🌼"}</div>
          </>
        ) : (
          <>
            <div className="gate-timer" role="timer" aria-live="off">
              <div className="gate-cell"><span className="gate-cell-num" key={`d${cd.dd}`}>{cd.dd}</span><span className="gate-cell-lab">{lang === 'hi' ? 'दिन' : 'DAYS'}</span></div>
              <span className="gate-sep">:</span>
              <div className="gate-cell"><span className="gate-cell-num" key={`h${cd.hh}`}>{cd.hh}</span><span className="gate-cell-lab">{lang === 'hi' ? 'घंटे' : 'HRS'}</span></div>
              <span className="gate-sep">:</span>
              <div className="gate-cell"><span className="gate-cell-num" key={`m${cd.mm}`}>{cd.mm}</span><span className="gate-cell-lab">{lang === 'hi' ? 'मिनट' : 'MIN'}</span></div>
              <span className="gate-sep gate-sep-blink">:</span>
              <div className="gate-cell"><span className="gate-cell-num gate-sec" key={`s${cd.ss}`}>{cd.ss}</span><span className="gate-cell-lab">{lang === 'hi' ? 'सेकंड' : 'SEC'}</span></div>
            </div>
            <div className="gate-count-label">{lang === 'hi' ? 'शादी तक — 11 दिसंबर 2026' : 'to the wedding — 11 Dec 2026'}</div>
          </>
        )}
        <div className="gate-tagline">{t(SEASON_META.tagline, lang)}</div>
      </div>

      <div className="gate-pin">
        <input
          className="gate-input"
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          value={pin}
          autoFocus
          onChange={(e) => {
            setErr('');
            setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
          }}
          onKeyDown={(e) => { if (e.key === 'Enter') go(); }}
          placeholder={lang === 'hi' ? 'PIN डालें' : 'Enter PIN'}
          aria-label={lang === 'hi' ? 'PIN डालें' : 'Enter PIN'}
        />
        <button className="btn gate-go press" onClick={() => go()}>
          {lang === 'hi' ? 'अंदर जाएँ →' : 'Enter →'}
        </button>
        {err && <p className="gate-err pop">{err}</p>}
        {okMsg && <p className="gate-ok pop">{okMsg}</p>}
        <button className="gate-lang" onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}>
          {lang === 'hi' ? 'EN' : 'हिं'}
        </button>
      </div>
    </div>
  );
}
