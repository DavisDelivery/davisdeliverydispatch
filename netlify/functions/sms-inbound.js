/**
 * Davis Delivery Dispatch — Inbound SMS webhook (SimpleTexting).
 *
 * In SimpleTexting, set your incoming-message forwarding / webhook URL to:
 *   https://<your-site>/api/sms-inbound
 *
 * SimpleTexting forwards inbound texts here as:
 *   - SMS  → GET  with query params: ?from=<driver>&to=<your#>&subject=&text=<msg>
 *   - MMS  → POST with JSON body:    { from, to, subject, text, attachments }
 *
 * It matches the sender (`from`) to a driver (config/drivers, last-10-digits) and
 * drops the text into that driver's dispatch chat thread (messages/dm-<id>/items),
 * so an SMS reply shows up in the same in-app conversation. Unknown numbers land
 * in the group thread labeled with the number.
 *
 * ENV VARS:
 *   FIREBASE_SERVICE_ACCOUNT — same Admin SDK JSON the nightly backup uses.
 */
const admin = require('firebase-admin');
const querystring = require('querystring');

let _app = null;
function firestore() {
  if (!_app) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not set');
    _app = admin.initializeApp({ credential: admin.credential.cert(JSON.parse(raw)) }, 'sms-inbound');
  }
  return admin.firestore(_app);
}

/* Last 10 digits, so "404-394-9891" and "+14043949891" compare equal. */
const digits10 = (s) => String(s || '').replace(/\D/g, '').slice(-10);

/* SimpleTexting sends SMS as GET query params and MMS as a JSON (or form) POST. */
function parseInbound(event) {
  if (event.httpMethod === 'GET') return event.queryStringParameters || {};
  const headers = event.headers || {};
  const ct = (headers['content-type'] || headers['Content-Type'] || '').toLowerCase();
  const raw = event.body || '';
  if (ct.includes('application/json')) {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return querystring.parse(raw);
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const params = parseInbound(event);
  const from = params.from || params.From || '';
  const text = (params.text == null ? (params.Body || '') : String(params.text)).trim();
  if (!from || !text) return { statusCode: 200, body: '' };

  try {
    const db = firestore();
    const fromKey = digits10(from);
    let driverId = null;
    let driverName = null;
    const snap = await db.doc('config/drivers').get();
    const list = (snap.exists && snap.data().drivers) || [];
    const match = fromKey.length === 10 ? list.find((d) => digits10(d.phone) === fromKey) : null;
    if (match) { driverId = match.id; driverName = match.name; }

    const time = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York',
    });

    if (driverId != null) {
      await db.collection('messages/dm-' + driverId + '/items').add({
        from: 'driver-' + driverId, fromName: driverName || 'Driver',
        text, time, read: false, timestamp: Date.now(), viaSms: true,
      });
    } else {
      await db.collection('messages/group/items').add({
        from: 'sms-unknown', fromName: 'SMS ' + from,
        text, time, read: false, timestamp: Date.now(), viaSms: true,
      });
    }
  } catch (e) {
    console.error('[SMS-INBOUND]', (e && e.message) || e);
  }
  return { statusCode: 200, body: '' };
};
