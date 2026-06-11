/**
 * Davis Delivery Dispatch — Send FCM web push to a driver's device
 *
 * POST /api/send-push
 * Body: { driverId, title, body, data? }
 *   - data is an optional string→string map (values are coerced to strings —
 *     FCM rejects non-string data values).
 *   - data.slug (driver name slug) makes the notification deep-link to
 *     /#/driver/{slug} when clicked.
 *
 * Token registry: Firestore doc fcmTokens/{driverId} = {driverId, token, updatedAt}
 * written by the driver page when the driver grants notification permission.
 *
 * Responses:
 *   200 {success:true, messageId}
 *   404 {error} — driver has no registered device (never enabled notifications)
 *   410 {error} — token was stale; doc deleted, driver must re-enable
 *
 * ENV VARS:
 *   FIREBASE_SERVICE_ACCOUNT — JSON string of Firebase Admin SDK service account (required)
 *   PUSH_SECRET              — optional; if set, requests must send a matching
 *                              x-push-secret header
 */

const admin = require('firebase-admin');

// ─── Firebase Admin init (cached across warm invocations) ──────────────
let _fbApp = null;
function getFirebaseApp() {
  if (_fbApp) return _fbApp;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT env var not set');
  const credentials = JSON.parse(raw);
  _fbApp = admin.initializeApp({
    credential: admin.credential.cert(credentials),
  }, 'send-push-' + Date.now());
  return _fbApp;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-push-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (statusCode, obj) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  body: JSON.stringify(obj),
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  // Optional shared-secret auth — only enforced when PUSH_SECRET is set,
  // consistent with the app's other functions.
  if (process.env.PUSH_SECRET) {
    const provided = (event.headers && (event.headers['x-push-secret'] || event.headers['X-Push-Secret'])) || '';
    if (provided !== process.env.PUSH_SECRET) {
      return json(401, { error: 'Unauthorized' });
    }
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'Invalid JSON body' });
  }

  const { driverId, title } = body;
  const msgBody = body.body;
  if (driverId === undefined || driverId === null || driverId === '' || !title || !msgBody) {
    return json(400, { error: 'driverId, title and body are required' });
  }

  // FCM requires every data value to be a string — coerce, drop null/undefined.
  const data = {};
  if (body.data && typeof body.data === 'object') {
    for (const [k, v] of Object.entries(body.data)) {
      if (v !== null && v !== undefined) data[k] = String(v);
    }
  }

  let app;
  try {
    app = getFirebaseApp();
  } catch (e) {
    return json(500, { error: String(e.message || e) });
  }
  const db = admin.firestore(app);
  const tokenRef = db.doc('fcmTokens/' + String(driverId));

  try {
    const snap = await tokenRef.get();
    const token = snap.exists ? snap.data().token : null;
    if (!token) {
      return json(404, { error: 'No device registered for this driver' });
    }

    const message = {
      token,
      notification: { title, body: msgBody },
      data,
    };
    // Deep-link to the driver's page on click. firebase-admin requires the
    // webpush link to be an absolute URL, so build it from the request origin
    // (falls back to the Host header). The service worker also handles
    // notificationclick via data.slug, so omitting the link is non-fatal.
    if (data.slug) {
      const origin = (event.headers && (event.headers.origin || (event.headers.host ? 'https://' + event.headers.host : null))) || null;
      if (origin) {
        message.webpush = { fcmOptions: { link: origin + '/#/driver/' + data.slug } };
      }
    }

    const messageId = await admin.messaging(app).send(message);
    return json(200, { success: true, messageId });
  } catch (err) {
    const code = err && err.code;
    if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token') {
      // Stale token — clean it up so the UI can prompt re-registration.
      try {
        await tokenRef.delete();
      } catch (e) {
        console.warn('[PUSH] Failed to delete stale token doc:', e.message);
      }
      return json(410, { error: 'Device token expired — driver must re-enable notifications' });
    }
    console.error('[PUSH] Send failed:', err);
    return json(500, { error: String((err && err.message) || err) });
  }
};
