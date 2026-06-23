/**
 * Davis Delivery Dispatch — Outbound SMS gateway (SimpleTexting).
 *
 *   GET  /api/send-sms              → { configured: boolean }
 *   POST /api/send-sms { to, body } → sends an SMS, returns { ok, id } or error
 *
 * The app probes GET once on load: when the gateway is NOT configured it falls
 * back to opening the device's native sms: composer (the original behavior), so
 * this is strictly additive — nothing changes until the env vars below are set.
 *
 * ENV VARS (Netlify → Site settings → Environment variables):
 *   SIMPLETEXTING_API_TOKEN     — your SimpleTexting API token (Settings → API)
 *   SIMPLETEXTING_ACCOUNT_PHONE — the SimpleTexting number you send from
 *                                 (digits, e.g. 8005551234)
 *
 * No npm dependency — talks to the SimpleTexting v2 REST API over raw https.
 * Docs: https://api-doc.simpletexting.com/
 */
const https = require('https');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};
const json = (statusCode, obj) => ({
  statusCode,
  headers: { ...CORS, 'Content-Type': 'application/json' },
  body: JSON.stringify(obj),
});

/* SimpleTexting wants plain digits (its examples use "1234567890"). Strip a
   leading US country code so "+1 404-394-9891" and "404-394-9891" match. */
function toDigits(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.length === 11 && d[0] === '1') d = d.slice(1);
  return d;
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const token = process.env.SIMPLETEXTING_API_TOKEN;
  const accountPhone = process.env.SIMPLETEXTING_ACCOUNT_PHONE;
  const configured = !!(token && accountPhone);

  if (event.httpMethod === 'GET') return json(200, { configured });
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });
  if (!configured) return json(503, { ok: false, error: 'sms_not_configured' });

  let payload = {};
  try { payload = JSON.parse(event.body || '{}'); } catch { return json(400, { ok: false, error: 'bad_json' }); }

  const contactPhone = toDigits(payload.to);
  const text = (payload.body == null ? '' : String(payload.body)).slice(0, 1500);
  if (!contactPhone || !text) return json(400, { ok: false, error: 'missing_to_or_body' });

  const data = JSON.stringify({
    contactPhone,
    accountPhone: toDigits(accountPhone),
    mode: 'AUTO', // SimpleTexting picks SMS for plain text, splitting long messages
    text,
  });

  const result = await new Promise((resolve) => {
    const req = https.request(
      {
        method: 'POST',
        hostname: 'api-app2.simpletexting.com',
        path: '/v2/api/messages',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => resolve({ status: res.statusCode, body: buf }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: String((e && e.message) || e) }));
    req.write(data);
    req.end();
  });

  if (result.status >= 200 && result.status < 300) {
    let id = '';
    try { id = JSON.parse(result.body).id || ''; } catch { /* ignore */ }
    return json(200, { ok: true, id });
  }
  let errMsg = result.body;
  try {
    const parsed = JSON.parse(result.body);
    errMsg = parsed.message || (parsed.errors && JSON.stringify(parsed.errors)) || errMsg;
  } catch { /* ignore */ }
  return json(502, { ok: false, error: errMsg, status: result.status });
};
