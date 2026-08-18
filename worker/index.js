// Worker: static assets + POST /api/contact
const LIMITS = { name: 120, email: 254, phone: 40, message: 4000 };
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MIN = 15;
const MAX_BODY_BYTES = 16 * 1024;
const PHONE_NOTE = '(563) 313-3019';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

function clean(v, max) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}
function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function originOk(req, env) {
  const origin = req.headers.get('Origin') || '';
  if (!origin) return true;
  const allowed = (env.ALLOWED_ORIGIN || '').replace(/\/$/, '');
  if (allowed && origin.replace(/\/$/, '') === allowed) return true;
  try {
    const host = new URL(req.url).host;
    const oHost = new URL(origin).host;
    return oHost === host || oHost.endsWith('.workers.dev');
  } catch {
    return false;
  }
}

async function handleContact(req, env) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!originOk(req, env)) return json({ error: 'Forbidden' }, 403);
  const len = Number(req.headers.get('Content-Length') || 0);
  if (len > MAX_BODY_BYTES) return json({ error: 'Payload too large' }, 413);
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  if (clean(body.website_hp, 200)) return json({ ok: true });
  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email).toLowerCase();
  const phone = clean(body.phone, LIMITS.phone);
  const message = clean(body.message, LIMITS.message);
  if (!name) return json({ error: 'Name is required' }, 400);
  if (!email || !isEmail(email)) return json({ error: 'Valid email is required' }, 400);
  if (!message || message.length < 5) return json({ error: 'Please include a short message' }, 400);
  const ip = req.headers.get('CF-Connecting-IP') || '';
  const ua = (req.headers.get('User-Agent') || '').slice(0, 300);
  if (env.DB) {
    try {
      if (ip) {
        const row = await env.DB.prepare(
          `SELECT COUNT(*) AS c FROM submissions WHERE ip_address = ? AND created_at >= datetime('now', ?)`
        )
          .bind(ip, `-${RATE_LIMIT_WINDOW_MIN} minutes`)
          .first();
        if (row && Number(row.c) >= RATE_LIMIT_MAX) {
          return json({ error: `Too many requests. Please call ${PHONE_NOTE}.` }, 429);
        }
      }
      await env.DB.prepare(
        `INSERT INTO submissions (name, email, phone, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)`
      )
        .bind(name, email, phone, message, ip, ua)
        .run();
    } catch (err) {
      console.error('D1 insert failed', err);
      return json({ ok: true, stored: false, note: `Received. If urgent, call ${PHONE_NOTE}.` });
    }
    return json({ ok: true, stored: true });
  }
  console.log('contact (no DB):', { name, email, phone, message: message.slice(0, 200) });
  return json({
    ok: true,
    stored: false,
    note: `Thanks! For the fastest help, call ${PHONE_NOTE}.`,
  });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/api/contact') return handleContact(req, env);
    if (env.ASSETS) return env.ASSETS.fetch(req);
    return new Response('Not found', { status: 404 });
  },
};
