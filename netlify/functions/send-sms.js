/**
 * Davis Delivery Dispatch — Outbound SMS gateway (Twilio).
 *
 *   GET  /api/send-sms              → { configured: boolean }
 *   POST /api/send-sms { to, body } → sends an SMS, returns { ok, sid } or error
 *
 * The app probes GET once on load: when the gateway is NOT configured it falls
 * back to opening the device's native sms: composer (today's behavior), so this
 * is strictly additive — nothing changes until the env vars below are set.
 *
 * ENV VARS (Netlify → Site settings → Environment variables):
 *   TWILIO_ACCOUNT_SID          — Account SID (starts with "AC...")
 *   TWILIO_AUTH_TOKEN           — Auth Token
 *   TWILIO_FROM_NUMBER          — your Twilio number in E.164, e.g. +14045551234
 *                                 (or set TWILIO_MESSAGING_SERVICE_SID instead)
 *   TWILIO_MESSAGING_SERVICE_SID — optional, use a Messaging Service instead of a
 *                                 single From number
 *
 * No npm dependency — talks to the Twilio REST API over raw https.
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

/* Normalize a phone number to E.164 (US default). Accepts "404-394-9891",
   "(404) 394 9891", "+14043949891", etc. */
function toE164(raw) {
  if (!raw) return '';
  const s = String(raw).trim();
  if (s.startsWith('+')) return '+' + s.slice(1).replace(/\D/g, '');
  const d = s.replace(/\D/g, '');
  if (d.length === 10) return '+1' + d;
  if (d.length === 11 && d[0] === '1') return '+' + d;
  return d ? '+' + d : '';
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const msgService = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const configured = !!(sid && token && (from || msgService));

  if (event.httpMethod === 'GET') return json(200, { configured });
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });
  if (!configured) return json(503, { ok: false, error: 'sms_not_configured' });

  let payload = {};
  try { payload = JSON.parse(event.body || '{}'); } catch { return json(400, { ok: false, error: 'bad_json' }); }

  const to = toE164(payload.to);
  const body = (payload.body == null ? '' : String(payload.body)).slice(0, 1500);
  if (!to || !body) return json(400, { ok: false, error: 'missing_to_or_body' });

  const form = new URLSearchParams();
  form.append('To', to);
  if (msgService) form.append('MessagingServiceSid', msgService);
  else form.append('From', toE164(from));
  form.append('Body', body);
  const data = form.toString();

  const result = await new Promise((resolve) => {
    const req = https.request(
      {
        method: 'POST',
        hostname: 'api.twilio.com',
        path: `/2010-04-01/Accounts/${sid}/Messages.json`,
        auth: `${sid}:${token}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
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
    let sidOut = '';
    try { sidOut = JSON.parse(result.body).sid || ''; } catch { /* ignore */ }
    return json(200, { ok: true, sid: sidOut });
  }
  let errMsg = result.body;
  try { errMsg = JSON.parse(result.body).message || errMsg; } catch { /* ignore */ }
  return json(502, { ok: false, error: errMsg, status: result.status });
};
