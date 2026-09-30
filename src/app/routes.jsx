import { createBrowserRouter, Navigate } from 'react-router-dom';
import Protected from '../components/Protected.jsx';
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

const P = (el) => <Protected>{el}</Protected>;

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/', element: P(<Home />) },
  { path: '/journey', element: P(<Journey />) },
  { path: '/calendar', element: P(<Calendar />) },
  { path: '/day/:id', element: P(<Day />) },
  { path: '/checklist', element: P(<Checklist />) },
  { path: '/people', element: P(<People />) },
  { path: '/travel', element: P(<Travel />) },
  { path: '/guide', element: P(<Guide />) },
  { path: '/about', element: P(<About />) },
  { path: '/more', element: P(<More />) },
  { path: '*', element: <Navigate to="/login" replace /> },
]);
