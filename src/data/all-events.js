// All dated events in one list (plain JS so scripts/tests can use it too).
import { CHHATH_EVENTS, COUSIN_EVENTS, BRIDGE_EVENTS } from './events-a.js';
import { WEDDING_EVENTS } from './events-b.js';

export const ALL_EVENTS = [...CHHATH_EVENTS, ...COUSIN_EVENTS, ...BRIDGE_EVENTS, ...WEDDING_EVENTS];
