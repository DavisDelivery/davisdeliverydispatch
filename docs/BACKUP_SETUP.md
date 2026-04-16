# Nightly Backup Setup Guide

This guide walks through setting up automatic nightly backups of your Firebase data to a Google Drive folder. Once set up, it runs forever with no maintenance.

**Time to complete:** ~20 minutes, done once.

**What you'll end up with:**
- Every night at 3 AM ET, a complete copy of your Firebase database gets saved to a Google Drive folder
- Files are named `davis-delivery-backup-YYYY-MM-DD.json`
- Keeps last 14 daily backups + last 12 monthly backups, auto-deletes older
- You can browse these from the Google Drive app on your iPhone anytime
- Status of each backup run is saved to Firebase at `backups/status`, so the app can show a health indicator

---

## Step 1 — Create a Google Cloud Service Account

A "service account" is a robot Google identity. The robot will have permission to read your Firebase data AND to write files to one specific Drive folder.

**You probably already have one for Firebase** — the Firebase Admin SDK uses service accounts. We'll reuse it.

1. Go to **[Firebase Console](https://console.firebase.google.com/)** → select your `glorybounddispatch` project
2. Click the ⚙️ gear icon (top left) → **Project settings**
3. Click the **Service accounts** tab
4. Scroll down. Click **Generate new private key**
5. Click **Generate key** in the popup
6. A JSON file downloads — name it something like `firebase-service-account.json` and save it somewhere safe on your computer

**⚠️ Treat this file like a password.** It grants full admin access to your Firebase project. Don't commit it to GitHub, don't email it, don't paste it into a public place.

---

## Step 2 — Create the Google Drive backup folder

1. Go to **[drive.google.com](https://drive.google.com/)**
2. Create a new folder, name it something like `Davis Delivery Backups`
3. Click into the folder
4. Look at the URL. It'll look like:
   ```
   https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
   ```
   The part after `folders/` is your **folder ID**. Copy it — you'll need it shortly.

---

## Step 3 — Share the folder with the service account

The service account can't see your Drive unless you explicitly share folders with it.

1. Open the JSON file from Step 1 in a text editor
2. Find the field `"client_email"`. It'll look like:
   ```
   firebase-adminsdk-xxxxx@glorybounddispatch.iam.gserviceaccount.com
   ```
   Copy that entire email address
3. Back in Google Drive, right-click the `Davis Delivery Backups` folder → **Share**
4. Paste the `client_email` into the "Add people" box
5. Set the permission to **Editor** (so it can upload AND delete old files for rotation)
6. **Uncheck** "Notify people" (no point emailing a robot)
7. Click **Share**

---

## Step 4 — Enable the Google Drive API

The service account exists but needs permission to actually *use* the Drive API.

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**
2. Top-left, make sure your project is `glorybounddispatch` (click the project dropdown if not)
3. In the search bar at the top, type `Google Drive API` and click the result
4. Click **Enable**
5. Wait ~30 seconds for it to activate

---

## Step 5 — Add the env vars to Netlify

Now we give the scheduled function the credentials it needs.

1. Go to **[Netlify dashboard](https://app.netlify.com/)** → your `davisdeliverydispatch` site
2. **Site configuration** → **Environment variables** (in the sidebar)
3. Click **Add a variable** → **Add a single variable**

Add these three:

### Variable 1: `FIREBASE_SERVICE_ACCOUNT`

- **Key:** `FIREBASE_SERVICE_ACCOUNT`
- **Value:** Open the JSON file from Step 1, copy the ENTIRE contents (including the outer `{ }`), paste as the value
- **Scopes:** Functions (check this box), uncheck Runtime/Build if present — this secret should only be visible to server-side functions, not the client bundle
- Click **Create variable**

### Variable 2: `GDRIVE_FOLDER_ID`

- **Key:** `GDRIVE_FOLDER_ID`
- **Value:** The folder ID from Step 2 (the long string after `folders/` in the URL)
- **Scopes:** Functions
- Click **Create variable**

### Variable 3 (optional): `GDRIVE_SERVICE_ACCOUNT`

Only set this if you want to use a *different* service account for Drive than for Firebase. If you're reusing the Firebase service account (recommended), **skip this** — the function falls back to `FIREBASE_SERVICE_ACCOUNT`.

---

## Step 6 — Deploy the code

The backup code lives in `netlify/functions/backup-nightly.js`. You also need the updated `package.json` (with `firebase-admin` and `googleapis` dependencies) and updated `netlify.toml` (with the schedule config).

1. Commit all three files to your GitHub repo
2. Netlify will auto-deploy
3. Watch the deploy log — it should finish successfully. First deploy takes a bit longer because it installs `firebase-admin` and `googleapis` for the first time.

---

## Step 7 — Test it manually

Before waiting until 3 AM, trigger a test run.

In your browser, visit:

```
https://davisdeliveryrouting.netlify.app/api/backup-nightly
```

You should see a JSON response within 10-30 seconds that looks like:

```json
{
  "success": true,
  "lastRun": "2026-04-17T15:23:41.000Z",
  "filename": "davis-delivery-backup-2026-04-17.json",
  "fileId": "1AbCdEfG...",
  "sizeKB": 248,
  "durationMs": 8341,
  "totalDocs": 312,
  "byCollection": {
    "manifests": 87,
    "quotes": 42,
    "emserHours": 60,
    ...
  },
  "rotation": { "kept": 1, "deleted": 0, "deletedNames": [] },
  "log": ["Starting backup...", "Dumped 312 docs...", "..."]
}
```

**If you see `"success": true`, it worked.** Go check your Google Drive folder — the JSON file should be there.

**If you see an error,** the JSON response will tell you what went wrong. Most common issues:
- `"FIREBASE_SERVICE_ACCOUNT env var not set"` → env var missing or typo
- `"File not found: <folder ID>"` → folder ID wrong, or folder not shared with service account
- `"The caller does not have permission"` → Drive API not enabled (Step 4), or service account doesn't have Editor access to the folder (Step 3)

---

## Step 8 — Verify the schedule

Go to Netlify → **Functions** tab. You should see `backup-nightly` with a **Scheduled** badge and a "Next run" timestamp.

That's it. You're done. Every night at 3 AM ET, a backup runs automatically.

---

## How to restore from a Drive backup

If something goes catastrophically wrong and you need to restore:

1. Open Google Drive on your phone or computer
2. Navigate to `Davis Delivery Backups`
3. Download the JSON file for the date you want
4. In the Davis Delivery app, tap **More menu → Restore Backup**
5. Select the downloaded JSON file

**Important:** The existing `Restore Backup` in the app is additive — it only fills *empty* days. To do a full replacement, you'd need to either clear Firebase first (dangerous) or manually overwrite day by day.

For a true "rollback to yesterday," the safer path is to:
1. Download yesterday's backup from Drive
2. Open the Firebase Console, manually delete the broken day from `manifests/{date}`
3. Then Restore Backup will fill that empty day with the backup data

This is intentionally a bit of friction — it prevents accidental mass overwrites.

---

## Monitoring: is it working?

Three ways to check:

1. **Browse the folder:** Every day around 3:30 AM ET, a new file should appear. If the newest file is more than 36 hours old, something's wrong.

2. **Check Firebase:** The function writes `backups/status` in Firestore with details of the last run. You can view this in the Firebase Console → Firestore Database → `backups` → `status`.

3. **Check Netlify:** Netlify dashboard → Functions → `backup-nightly` → Logs. Shows the history of every run.

---

## Troubleshooting

**"Function timed out"**
The default Netlify function timeout is 10 seconds on free plans, 26s on paid. If your backup takes longer, you need to upgrade to a paid plan (Pro is $19/mo) OR split the backup into multiple functions. At current data size you should be well under 10 seconds.

**"Quota exceeded" errors from Drive**
Google Drive has a daily API quota per service account of 1 billion requests. You'd need to run this thousands of times a second to hit it. If you genuinely see this error, something is stuck in a loop — kill the Netlify function invocations.

**Backups are huge**
If backups start getting enormous (>10MB), it's probably because photos are being stored as base64 data URLs in manifest entries instead of as Firebase Storage URLs. The `saveManifestDay` function in `App.jsx` already strips these — but if something slipped through, look at the entries.photos arrays.

**Service account key compromise**
If you accidentally leaked the service account JSON (e.g. committed to a public repo):
1. Go to [Google Cloud Console → IAM → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Find the account, click into it
3. Keys tab → find the leaked key → Delete
4. Generate a new key (Step 1 of this guide again)
5. Update the `FIREBASE_SERVICE_ACCOUNT` env var in Netlify
6. Redeploy

---

## Cost

- Netlify function invocations: 1 per day × 30 = 30/month. Free tier is 125,000/month. You're 0.02% of the limit.
- Google Drive storage: Each backup is ~200KB. After a year (26 files: 14 daily + 12 monthly), ~5MB total. You have 15GB free. 0.03% usage.
- Google Drive API calls: 3 per backup (upload + list + delete). ~90/month. Free tier is 1 billion/day.

**Total cost: $0/month.**

---

## What this backup system does NOT protect against

- **Corrupted data that gets backed up successfully.** If something writes garbage to Firebase and we back it up, we have garbage backed up. Real-time data integrity is a separate concern. That's what the change-log / audit trail Tier 2 design would address.
- **Catastrophic Google account loss.** If your Google account is compromised or suspended, both Firebase AND Drive go away. A truly paranoid setup would have a copy on another provider (AWS S3, Backblaze). For your size of business, Google account loss is extremely unlikely — but if you want to worry about it, we can add a second destination.
- **Photo/signature loss.** Backups reference photo URLs, not the image blobs. Photos are in Firebase Storage which has its own retention. If Firebase Storage gets deleted, photos are gone even if JSON backups survive. For a second copy of photos, we'd need a separate backup job targeting Storage.
