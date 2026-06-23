/**
 * Davis Delivery Dispatch — Inbound SMS webhook (Twilio).
 *
 * Point your Twilio number's "A MESSAGE COMES IN" webhook at:
 *   POST https://<your-site>/api/sms-inbound
 *
 * It matches the sender's number to a driver (config/drivers) and drops the text
 * into that driver's dispatch chat thread (messages/dm-<driverId>/items), so an
 * SMS reply shows up in the same in-app conversation dispatch already uses. A
 * text from an unknown number lands in the group thread labeled with the number.
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

const twiml = () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'text/xml' },
  body: '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
});

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  let params = {};
  try { params = querystring.parse(event.body || ''); } catch { return twiml(); }
  const from = params.From || '';
  const text = (params.Body == null ? '' : String(params.Body)).trim();
  if (!from || !text) return twiml();

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
  return twiml();
};
