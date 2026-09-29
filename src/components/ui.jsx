export function Chip({ status }) {
  if (!status) return null;
  return <span className={`chip ${status}`}>{status === 'confirmed' ? '✓ पक्का' : status === 'tentative' ? '◌ लगभग तय' : status === 'toVerify' ? '⚠ पुष्टि बाक़ी' : status === 'suggested' ? '✎ सुझाव' : status}</span>;
}

export function Motif({ children }) {
  return <div className="motif" aria-hidden="true" style={{ fontSize: 72, textAlign: 'center', lineHeight: 1 }}>{children}</div>;
}

// Hand-drawn-feel inline SVG border (Madhubani influence, light touch).
export function FolkBorder() {
  return (
    <svg width="100%" height="14" viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block', opacity: .5 }}>
      <path d="M0 7 Q 12 0 24 7 T 48 7 T 72 7 T 96 7 T 120 7 T 144 7 T 168 7 T 192 7 T 216 7 T 240 7 T 264 7 T 288 7 T 312 7 T 336 7 T 360 7 T 384 7 T 408 7" fill="none" stroke="#D89B32" strokeWidth="2" />
      <circle cx="24" cy="7" r="2.4" fill="#7A2633" /><circle cx="120" cy="7" r="2.4" fill="#7A2633" /><circle cx="216" cy="7" r="2.4" fill="#7A2633" /><circle cx="312" cy="7" r="2.4" fill="#7A2633" />
    </svg>
  );
}
