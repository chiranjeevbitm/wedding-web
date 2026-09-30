// Vite dev middleware for /api/* — same Neon-backed endpoints that Vercel
// serves in production, so `npm run dev` syncs globally too instead of
// silently staying "local only".
import 'dotenv/config';

const json = (res, code, obj) => {
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(obj));
};

// Wrap a Vercel-style handler (expects req.body + res.status().json()).
const wrap = (handler) => (req, res, next) => {
  let raw = '';
  req.on('data', (c) => { raw += c; });
  req.on('end', async () => {
    try {
      req.body = raw ? JSON.parse(raw) : {};
    } catch { req.body = {}; }
    const shim = {
      statusCode: 200,
      status(c) { this.statusCode = c; return this; },
      json(obj) { json(res, this.statusCode, obj); },
      setHeader(k, v) { res.setHeader(k, v); },
      end() { res.end(); },
    };
    try {
      await handler(req, shim);
    } catch (e) {
      json(res, 500, { error: String((e && e.message) || e) });
    }
  });
};

export function apiDevPlugin() {
  return {
    name: 'api-dev',
    async configureServer(server) {
      if (!process.env.DATABASE_URL) {
        server.config.logger.warn('  [api-dev] DATABASE_URL missing — /api/* stays local only');
        return;
      }
      const { default: state } = await import('../api/state.js');
      const { default: wishes } = await import('../api/wishes.js');
      const { default: feedback } = await import('../api/feedback.js');
      const { default: diag } = await import('../api/diag.js');
      server.middlewares.use('/api/state', wrap(state));
      server.middlewares.use('/api/wishes', wrap(wishes));
      server.middlewares.use('/api/feedback', wrap(feedback));
      server.middlewares.use('/api/diag', wrap(diag));
      server.config.logger.info('  [api-dev] Neon /api/* live at dev time → changes sync everywhere');
    },
  };
}
