import { createBrowserRouter } from 'react-router-dom';
import Shell from '../components/Shell.jsx';
import Home from '../pages/Home.jsx';
import Journey from '../pages/Journey.jsx';
import Calendar from '../pages/Calendar.jsx';
import Day from '../pages/Day.jsx';
import Checklist from '../pages/Checklist.jsx';
import People from '../pages/People.jsx';
import Travel from '../pages/Travel.jsx';
import Guide from '../pages/Guide.jsx';
import Rsvp from '../pages/Rsvp.jsx';
import About from '../pages/About.jsx';
import More from '../pages/More.jsx';

const wrap = (el) => <Shell>{el}</Shell>;

export const router = createBrowserRouter([
  { path: '/', element: wrap(<Home />) },
  { path: '/journey', element: wrap(<Journey />) },
  { path: '/calendar', element: wrap(<Calendar />) },
  { path: '/day/:id', element: wrap(<Day />) },
  { path: '/checklist', element: wrap(<Checklist />) },
  { path: '/people', element: wrap(<People />) },
  { path: '/travel', element: wrap(<Travel />) },
  { path: '/guide', element: wrap(<Guide />) },
  { path: '/rsvp', element: wrap(<Rsvp />) },
  { path: '/about', element: wrap(<About />) },
  { path: '/more', element: wrap(<More />) },
  { path: '*', element: wrap(<div className="wrap"><div className="card"><h2>यह पेज बारात में चला गया</h2><p className="muted">This page went to the baraat.</p><a className="btn" href="/">घर लौटें</a></div></div>) },
]);
