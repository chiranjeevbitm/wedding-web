// The shared-document sync protocol, as a pure function so it can be tested
// without a browser or a server (see scripts/check-sync.mjs).
//
// One document lives in Neon (`app_state`); every device pushes its own edits
// and pulls the newest version, so an edit made by anyone reaches everyone.
//
// decide({ remote, initial, seenTs, pushTs })
//   → 'seed'  : table is empty and we are the first device → write our state
//   → 'adopt' : a *newer* document from someone else → replace local state
//   → 'none'  : nothing to do (older version, or our own echo)
export const decide = ({ remote, initial = false, seenTs = 0, pushTs = 0 }) => {
  if (!remote) return initial ? 'seed' : 'none';
  const ts = Number(remote.updatedAt) || 0;
  if (ts !== pushTs && ts > seenTs) return 'adopt';
  return 'none';
};
