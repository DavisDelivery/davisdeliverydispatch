/**
 * Davis Delivery Dispatch — Customer Texts inbox (SimpleTexting).
 *
 *   GET /api/st-inbox            → { configured, threads, error }
 *   GET /api/st-inbox?debug=1    → also includes a raw sample message for field
 *                                  mapping if SimpleTexting's shape differs
 *
 * Pulls recent messages from SimpleTexting (GET /v2/api/messages), groups them
 * into conversation threads by the contact's phone number, and returns them
 * newest-first — the data behind the in-app "Customer Texts" inbox.
 *
 * ENV VARS:
 *   SIMPLETEXTING_API_TOKEN — your SimpleTexting API token (same one used to send)
 *
 * No npm dependency — raw https against the SimpleTexting v2 REST API.
 */
const https = require('https');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};
const json = (statusCode, obj) => ({
  statusCode,
  headers: { ...CORS, 'Content-Type': 'application/json' },
  body: JSON.stringify(obj),
});

const last10 = (s) => String(s || '').replace(/\D/g, '').slice(-10);

/* SimpleTexting paginated responses vary; find the first array we can use. */
function extractArray(body) {
  if (Array.isArray(body)) return body;
  if (body && typeof body === 'object') {
    for (const k of ['data', 'content', 'messages', 'items', 'results']) {
      if (Array.isArray(body[k])) return body[k];
    }
  }
  return [];
}

function getToken(m) {
  // recipient / other-party number on the message, regardless of direction
  const phone =
    m.contactPhone || m.phone || m.recipient || m.to || m.from || m.number || '';
  const text = m.text != null ? m.text : m.message != null ? m.message : m.body || '';
  const dir = String(m.direction || m.type || m.kind || (m.incoming ? 'IN' : '') || '');
  const inbound = m.incoming === true || /^(in|receiv)/i.test(dir);
  const when =
    m.createdAt || m.receivedAt || m.sentAt || m.timestamp || m.date || m.time || null;
  let ts = 0;
  if (when != null) {
    const n = typeof when === 'number' ? when : Date.parse(when);
    if (!isNaN(n)) ts = n;
  }
  const name = [m.firstName, m.lastName].filter(Boolean).join(' ') || m.contactName || m.name || '';
  return { phone, text: String(text), inbound, ts, name };
}

function httpGet(path, token) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        method: 'GET',
        hostname: 'api-app2.simpletexting.com',
        path,
        headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => resolve({ status: res.statusCode, body: buf }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: String((e && e.message) || e) }));
    req.end();
  });
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const token = process.env.SIMPLETEXTING_API_TOKEN;
  if (!token) return json(200, { configured: false, threads: [], error: null });

  const debug = event.queryStringParameters && event.queryStringParameters.debug;
  const res = await httpGet('/v2/api/messages?page=0&size=200', token);

  if (res.status < 200 || res.status >= 300) {
    let err = res.body;
    try { err = JSON.parse(res.body).message || err; } catch { /* ignore */ }
    return json(200, { configured: true, threads: [], error: `SimpleTexting ${res.status}: ${err}` });
  }

  let parsed;
  try { parsed = JSON.parse(res.body); } catch { return json(200, { configured: true, threads: [], error: 'Bad response from SimpleTexting' }); }

  const rows = extractArray(parsed);
  const byPhone = new Map();
  for (const m of rows) {
    const g = getToken(m);
    const key = last10(g.phone);
    if (!key) continue;
    if (!byPhone.has(key)) byPhone.set(key, { phone: key, name: '', messages: [] });
    const t = byPhone.get(key);
    if (!t.name && g.name) t.name = g.name;
    t.messages.push({ text: g.text, inbound: g.inbound, ts: g.ts });
  }

  const threads = [...byPhone.values()].map((t) => {
    t.messages.sort((a, b) => a.ts - b.ts);
    const lastMsg = t.messages[t.messages.length - 1] || {};
    return {
      phone: t.phone,
      name: t.name || '',
      messages: t.messages,
      lastText: lastMsg.text || '',
      lastTs: lastMsg.ts || 0,
      lastInbound: !!lastMsg.inbound,
    };
  });
  threads.sort((a, b) => b.lastTs - a.lastTs);

  const out = { configured: true, threads, error: null };
  if (debug) out.sample = rows[0] || null;
  return json(200, out);
};
