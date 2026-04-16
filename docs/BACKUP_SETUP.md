# Backup Setup

This document describes the backup configuration and procedures for the Davis Delivery Dispatch application.

## Overview

Regular backups ensure that application data, configuration, and critical files can be restored in the event of data loss or system failure.

## What Gets Backed Up

- Firebase Firestore data (orders, drivers, routes)
- Environment configuration files (`.env`)
- Netlify function configurations
- Application source code (via GitHub)

## Backup Schedule

| Data Type | Frequency | Retention |
|-----------|-----------|-----------|
| Firestore exports | Daily | 30 days |
| Config files | On change | 90 days |
| Source code | Every commit | Indefinite (GitHub) |

## Firebase Firestore Backup

Firestore exports can be triggered manually or on a schedule via Google Cloud:

```bash
gcloud firestore export gs://<YOUR_BUCKET>/firestore-backup-$(date +%Y%m%d)
```

Automated daily exports should be configured via **Google Cloud Scheduler** pointing to a Cloud Function or the Firestore export API.

## Environment Variables

Back up the `.env` file securely — **never commit it to the repository**. Store a copy in a password manager or a secrets manager such as:

- [Doppler](https://doppler.com)
- [1Password Secrets Automation](https://1password.com)
- Google Secret Manager

## Restoration

To restore from a Firestore backup:

```bash
gcloud firestore import gs://<YOUR_BUCKET>/firestore-backup-<DATE>
```

Verify the restored data in the Firebase Console under **Firestore Database**.

## Notes

- Always test restores periodically to confirm backup integrity.
- Keep at least one offsite/cold copy of critical backups.
- Notify the team before performing a production restore.
