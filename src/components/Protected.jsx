import { Navigate } from 'react-router-dom';
import { isUnlocked } from '../lib/gate.js';
import Shell from './Shell.jsx';

// Reactive guard: checks the gate on mount AND on every navigation,
// so a correct PIN actually lets you through (the old eager guard
// froze the redirect at startup and bounced users back to /login).
export default function Protected({ children }) {
  if (!isUnlocked()) return <Navigate to="/login" replace />;
  return <Shell>{children}</Shell>;
}
