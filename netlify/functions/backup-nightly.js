/**
 * Davis Delivery Dispatch — Nightly Backup to Google Drive
 *
 * Runs automatically at 3 AM ET every night via Netlify scheduled functions.
 * Reads all Firebase collections, bundles into a single JSON file, uploads
 * to a Google Drive folder, and rotates old backups.
 *
 * ENV VARS REQUIRED (see docs/BACKUP_SETUP.md):
 *   FIREBASE_SERVICE_ACCOUNT   — JSON string of Firebase Admin SDK service account
 *   GDRIVE_SERVICE_ACCOUNT     — JSON string of Google Drive service account (can be same as Firebase)
 *   GDRIVE_FOLDER_ID           — Google Drive folder ID where backups go
 *
 * MANUAL TRIGGER:
 *   You can also hit GET /api/backup-nightly to run it on-demand for testing.
 */

const admin = require('firebase-admin');
const { google } = require('googleapis');
const { Readable } = require('stream');

// Collections and single-doc paths to include in the backup.
// Single docs are config entries; collections are iterated in full.
const COLLECTIONS = [
  'manifests',
  'quotes',
  'emserHours',
  'emserShifts',
  'dispatchNotes',
  'customStops',
  'stopOverrides',
  'hiddenStops',
  'invoices',
  'driverLocations',
];
const SINGLE_DOCS = [
  'config/drivers',
  'config/driverCapacity',
];

// Retention policy
const KEEP_DAILY = 14;   // last 14 days of daily backups
const KEEP_MONTHLY = 12; // last 12 months — one per month

// ─── Firebase Admin init (cached across warm invocations) ──────────────
let _fbApp = null;
function getFirebaseApp() {
  if (_fbApp) return _fbApp;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT env var not set');
  const credentials = JSON.parse(raw);
  _fbApp = admin.initializeApp({
    credential: admin.credential.cert(credentials),
  }, 'backup-' + Date.now());
  return _fbApp;
}

// ─── Google Drive init ────────────────────────────────────────────────
function getDriveClient() {
  const raw = process.env.GDRIVE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('GDRIVE_SERVICE_ACCOUNT env var not set');
  const credentials = JSON.parse(raw);
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'],
  });
  return google.drive({ version: 'v3', auth });
}

// ─── Read entire Firestore database into a plain object ───────────────
async function dumpFirestore() {
  const app = getFirebaseApp();
  const db = admin.firestore(app);
  const dump = {
    version: 'backup-v1',
    exportedAt: new Date().toISOString(),
    collections: {},
    singleDocs: {},
  };

  // Read all collections
  for (const collName of COLLECTIONS) {
    const snap = await db.collection(collName).get();
    const docs = {};
    snap.forEach(doc => { docs[doc.id] = doc.data(); });
    dump.collections[collName] = docs;
  }

  // Read single docs
  for (const path of SINGLE_DOCS) {
    const parts = path.split('/');
    const ref = db.doc(parts.join('/'));
    const snap = await ref.get();
    dump.singleDocs[path] = snap.exists ? snap.data() : null;
  }

  // Count stats for the summary
  let totalDocs = 0;
  for (const coll of Object.values(dump.collections)) totalDocs += Object.keys(coll).length;
  for (const val of Object.values(dump.singleDocs)) if (val) totalDocs++;

  dump.summary = {
    totalCollections: Object.keys(dump.collections).length,
    totalSingleDocs: Object.keys(dump.singleDocs).length,
    totalDocs,
    byCollection: Object.fromEntries(
      Object.entries(dump.collections).map(([k, v]) => [k, Object.keys(v).length])
    ),
  };

  return dump;
}

// ─── Upload JSON string to Google Drive ───────────────────────────────
async function uploadToDrive(drive, folderId, filename, jsonString) {
  const stream = Readable.from(jsonString);
  const res = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [folderId],
      mimeType: 'application/json',
    },
    media: {
      mimeType: 'application/json',
      body: stream,
    },
    fields: 'id, name, size, createdTime',
    supportsAllDrives: true,
  });
  return res.data;
}

// ─── List existing backups in folder ──────────────────────────────────
async function listBackups(drive, folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false and name contains 'davis-delivery-backup-'`,
    fields: 'files(id, name, createdTime, size)',
    orderBy: 'createdTime desc',
    pageSize: 200,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  return res.data.files || [];
}

// ─── Rotate (delete) old backups per retention policy ─────────────────
async function rotateBackups(drive, files) {
  // Parse dates from filenames like "davis-delivery-backup-2026-04-16.json"
  const parsed = files
    .map(f => {
      const m = f.name.match(/davis-delivery-backup-(\d{4})-(\d{2})-(\d{2})\.json/);
      if (!m) return null;
      return {
        ...f,
        year: parseInt(m[1]),
        month: parseInt(m[2]),
        day: parseInt(m[3]),
        ym: `${m[1]}-${m[2]}`,
        date: `${m[1]}-${m[2]}-${m[3]}`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first

  const keep = new Set();

  // Keep last 14 daily (newest 14 regardless of month)
  parsed.slice(0, KEEP_DAILY).forEach(f => keep.add(f.id));

  // Keep ONE per month for the last 12 distinct months (the newest-in-month)
  const seenMonths = new Set();
  for (const f of parsed) {
    if (!seenMonths.has(f.ym)) {
      seenMonths.add(f.ym);
      keep.add(f.id);
      if (seenMonths.size >= KEEP_MONTHLY) break;
    }
  }

  const toDelete = parsed.filter(f => !keep.has(f.id));
  const deleted = [];
  for (const f of toDelete) {
    try {
      await drive.files.delete({ fileId: f.id, supportsAllDrives: true });
      deleted.push(f.name);
    } catch (e) {
      console.warn('[BACKUP] Failed to delete', f.name, e.message);
    }
  }

  return { kept: keep.size, deleted: deleted.length, deletedNames: deleted };
}

// ─── Write a status doc back to Firebase so the app can show health ──
async function writeStatus(status) {
  try {
    const app = getFirebaseApp();
    const db = admin.firestore(app);
    await db.doc('backups/status').set({
      ...status,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.warn('[BACKUP] Failed to write status:', e.message);
  }
}

// ─── Main handler ─────────────────────────────────────────────────────
exports.handler = async (event) => {
  const startedAt = Date.now();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `davis-delivery-backup-${today}.json`;
  const log = [];
  const logLine = (msg) => { console.log('[BACKUP]', msg); log.push(msg); };

  try {
    logLine(`Starting backup ${filename}`);

    // 1. Dump Firestore
    const dump = await dumpFirestore();
    logLine(`Dumped ${dump.summary.totalDocs} docs across ${dump.summary.totalCollections} collections`);

    // 2. Serialize
    const jsonString = JSON.stringify(dump, null, 2);
    const sizeKB = Math.round(jsonString.length / 1024);
    logLine(`Serialized ${sizeKB} KB`);

    // 3. Check folder ID
    const folderId = process.env.GDRIVE_FOLDER_ID;
    if (!folderId) throw new Error('GDRIVE_FOLDER_ID env var not set');

    // 4. Upload
    const drive = getDriveClient();
    const uploaded = await uploadToDrive(drive, folderId, filename, jsonString);
    logLine(`Uploaded to Drive: ${uploaded.name} (id=${uploaded.id})`);

    // 5. Rotate
    const allFiles = await listBackups(drive, folderId);
    const rotation = await rotateBackups(drive, allFiles);
    logLine(`Rotation: kept ${rotation.kept}, deleted ${rotation.deleted}`);

    // 6. Write status
    const durationMs = Date.now() - startedAt;
    const status = {
      success: true,
      lastRun: new Date().toISOString(),
      filename,
      fileId: uploaded.id,
      sizeKB,
      durationMs,
      totalDocs: dump.summary.totalDocs,
      byCollection: dump.summary.byCollection,
      rotation,
      log,
    };
    await writeStatus(status);
    logLine(`Done in ${durationMs}ms`);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(status, null, 2),
    };
  } catch (err) {
    console.error('[BACKUP] FAILED:', err);
    const status = {
      success: false,
      lastRun: new Date().toISOString(),
      error: String(err.message || err),
      stack: String(err.stack || '').substring(0, 2000),
      durationMs: Date.now() - startedAt,
      log,
    };
    await writeStatus(status);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(status, null, 2),
    };
  }
};

// ─── Netlify scheduled function config ────────────────────────────────
// Runs at 07:00 UTC = 3:00 AM ET (during standard time) / 2:00 AM ET (during DST).
// Netlify uses standard cron syntax. This runs every day.
exports.config = {
  schedule: '0 7 * * *',
};
