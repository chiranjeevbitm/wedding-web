// Smoke test for the login-free diagnostics endpoint.
// Fails loudly if the API cannot reach Neon; run before any deploy.
// Run: npm run check:api
const base = process.argv[2] || process.env.API_BASE || 'http://localhost:5173';

let fail = 0;
const ok = (label, got, want) => {
  const pass = got === want;
  if (!pass) fail++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}  got=${got} want=${want}`);
};

const main = async () => {
  console.log(`   probing ${base} …`);
  let diag;
  try {
    const r = await fetch(`${base}/api/diag`);
    diag = { http: r.status, body: await r.json().catch(() => null) };
  } catch (e) {
    ok('api/diag reachable', `THREW: ${String(e).slice(0, 80)}`, 200);
    process.exit(1);
  }
  console.log(`   diag →`, JSON.stringify(diag.body));
  ok('/api/diag is 200', diag.http, 200);
  ok('diag says hasDbUrl=true', diag.body && diag.body.hasDbUrl, true);
  ok('diag can SELECT 1', diag.body && diag.body.canQuery, true);
  ok('diag reaches all 3 tables', diag.body && diag.body.tablesOk, true);
  if (diag.body && !diag.body.hasDbUrl) {
    console.log('\n   ⚠ DATABASE_URL is missing where the API runs. Fix:');
    console.log('   Vercel → Project → Settings → Environment Variables → add DATABASE_URL → Redeploy.');
  }
  console.log(fail === 0 ? '\nALL API CHECKS PASSED' : `\n${fail} CHECK(S) FAILED`);
  process.exit(fail === 0 ? 0 : 1);
};

main().catch((e) => {
  console.error('check-api crashed:', e && e.message);
  process.exit(1);
});
