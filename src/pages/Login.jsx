import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { SEASON_META } from '../data/journey.js';
import { daysUntil, t } from '../lib/format.js';
import { checkPin, currentPinHint, kolkataClock, unlock } from '../lib/gate.js';

// Full-screen gate: login-page-video.mp4 behind, live countdown centre,
// PIN pad a little above the bottom. Password = current Kolkata time (12-hr).
export default function Login() {
  const { state } = useStore();
  const lang = state.lang;
  const nav = useNavigate();
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [now, setNow] = useState(() => new Date());
  const [left, setLeft] = useState(() => daysUntil('2026-12-11'));

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
      setLeft(daysUntil('2026-12-11'));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const press = (d) => {
    setErr('');
    setPin((p) => (p + d).slice(0, 4));
  };
  const back = () => {
    setErr('');
    setPin((p) => p.slice(0, -1));
  };
  const go = (value = pin) => {
    if (checkPin(value)) {
      unlock();
      nav('/', { replace: true });
    } else {
      setErr(
        lang === 'hi'
          ? `गलत PIN — अभी कोलकाता समय ${kolkataClock()} है, उसी के 4 अंक (जैसे ${currentPinHint()}) डालें।`
          : `Wrong PIN — Kolkata time now is ${kolkataClock()}; enter its 4 digits (e.g. ${currentPinHint()}).`
      );
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
        <div className="gate-count-num">{left <= 0 ? (lang === 'hi' ? 'आज' : 'Today') : left}</div>
        <div className="gate-count-label">
          {left <= 0
            ? lang === 'hi'
              ? 'शादी का दिन आ गया 🌼'
              : "It's wedding day 🌼"
            : lang === 'hi'
              ? 'दिन बाक़ी — शादी तक'
              : 'days to the wedding'}
        </div>
        <div className="gate-tagline">{t(SEASON_META.tagline, lang)}</div>
      </div>

      <div className="gate-pin">
        <div className="gate-pin-title">
          {lang === 'hi' ? '🔑 अभी का समय = PIN' : '🔑 Current time = PIN'}
          <span className="gate-clock">{kolkataClock(now)} IST</span>
        </div>
        <div className="gate-dots" aria-live="polite">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`gate-dot ${pin.length > i ? 'on' : ''}`} />
          ))}
        </div>
        <div className="gate-keys">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫'].map((k) => (
            <button
              key={k}
              className="gate-key press"
              onClick={() => (k === '⌫' ? back() : press(k))}
              aria-label={k === '⌫' ? 'backspace' : `digit ${k}`}
            >
              {k}
            </button>
          ))}
        </div>
        <button className="btn gate-go press" onClick={() => go()}>
          {lang === 'hi' ? 'अंदर जाएँ →' : 'Enter →'}
        </button>
        <p className="gate-hint">
          {lang === 'hi'
            ? `जैसे अभी ${currentPinHint(now)} बज रहा है → ${currentPinHint(now).replace(':', '')} या ${currentPinHint(now).replace(/^0/, '')} डालें`
            : `If it is ${currentPinHint(now)} now → enter ${currentPinHint(now).replace(':', '')} or ${currentPinHint(now).replace(/^0/, '')}`}
        </p>
        {err && <p className="gate-err pop">{err}</p>}
        <button className="gate-lang" onClick={() => (window.location.hash = '#lang', window.dispatchEvent(new Event('shaadi:lang')))}>
          {lang === 'hi' ? 'EN' : 'हिं'}
        </button>
      </div>
    </div>
  );
}
