import { createBrowserRouter, Navigate } from 'react-router-dom';
import Shell from '../components/Shell.jsx';
import Home from '../pages/Home.jsx';
import Journey from '../pages/Journey.jsx';
import Calendar from '../pages/Calendar.jsx';
import Day from '../pages/Day.jsx';
import Checklist from '../pages/Checklist.jsx';
import People from '../pages/People.jsx';
import Travel from '../pages/Travel.jsx';
import Guide from '../pages/Guide.jsx';
import About from '../pages/About.jsx';
import More from '../pages/More.jsx';
import Login from '../pages/Login.jsx';
import { isUnlocked } from '../lib/gate.js';

const wrap = (el) => <Shell>{el}</Shell>;
const guard = (el) => (isUnlocked() ? wrap(el) : <Navigate to="/login" replace />);

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/', element: guard(<Home />) },
  { path: '/journey', element: guard(<Journey />) },
  { path: '/calendar', element: guard(<Calendar />) },
  { path: '/day/:id', element: guard(<Day />) },
  { path: '/checklist', element: guard(<Checklist />) },
  { path: '/people', element: guard(<People />) },
  { path: '/travel', element: guard(<Travel />) },
  { path: '/guide', element: guard(<Guide />) },
  { path: '/about', element: guard(<About />) },
  { path: '/more', element: guard(<More />) },
  { path: '*', element: <Navigate to="/login" replace /> },
]);
