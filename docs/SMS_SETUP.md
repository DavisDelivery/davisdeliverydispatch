# SMS Texting Setup (SimpleTexting)

The dispatch app sends and receives real text messages through your existing
**SimpleTexting** account. **Until the environment variables below are set,
nothing changes** — "Text manifest" and "Notify" keep opening your phone's
native SMS app exactly like before. Once the variables are present, those
actions send automatically (server-side, from any device) and driver replies
flow back into the in-app chat.

## What you get

| Feature | Before | After SimpleTexting is connected |
|---|---|---|
| **Text manifest / Notify** | Opens your phone's SMS app, you tap send | Sends automatically, server-side, from any device |
| **Dispatch → driver chat (DM)** | In-app only | Also delivered to the driver's phone as a text |
| **Driver replies by text** | — | Land in that driver's in-app chat thread |
| **Texts from unknown numbers** | — | Land in the group chat, labeled with the number |

Group chat messages stay in-app (they are not mass-texted).

## 1. SimpleTexting credentials

1. Log in to SimpleTexting.
2. Go to **Settings → API** and create / copy your **API token**.
3. Note the **phone number** your account sends from (your SimpleTexting number).

## 2. Netlify environment variables

Netlify → your site → **Site configuration → Environment variables**. Add:

| Variable | Value |
|---|---|
| `SIMPLETEXTING_API_TOKEN` | your SimpleTexting API token |
| `SIMPLETEXTING_ACCOUNT_PHONE` | your SimpleTexting sending number, digits only, e.g. `8005551234` |

`FIREBASE_SERVICE_ACCOUNT` is already set for the nightly backup — the inbound
webhook reuses it, so no new Firebase setup is needed.

Redeploy (or trigger a deploy) so the functions pick up the new variables.

## 3. Inbound replies (two-way)

In SimpleTexting, set the **incoming-message forwarding / webhook URL** to:

```
https://<your-site>/api/sms-inbound
```

SimpleTexting forwards inbound texts there (SMS as a `GET`, MMS as a `POST`).
Driver numbers are matched against the numbers saved in **Manage Drivers** (last
10 digits), so make sure each driver's number is filled in.

## 4. Verify

- Visit `https://<your-site>/api/send-sms` in a browser — it should return
  `{"configured":true}`.
- Open the dispatcher board, hit **Notify** on a driver — the modal footer should
  read *"auto-sends via SMS gateway"*. Send a test; you should see "Text sent ✓".
- Text your SimpleTexting number from a driver's phone — it should appear in that
  driver's chat thread.

## Endpoints (reference)

- `GET  /api/send-sms` → `{ configured: boolean }`
- `POST /api/send-sms` `{ to, body }` → `{ ok, id }`
  - Calls `POST https://api-app2.simpletexting.com/v2/api/messages` with
    `{ contactPhone, accountPhone, mode: "AUTO", text }` and
    `Authorization: Bearer <token>`.
- `GET|POST /api/sms-inbound` → SimpleTexting incoming-message webhook (returns 200)

## Notes

- US numbers are sent as plain digits (a leading `1` country code is stripped),
  matching SimpleTexting's API examples.
- `mode: "AUTO"` lets SimpleTexting send plain text as SMS and split long
  manifests across segments automatically.
- SimpleTexting handles carrier compliance (10DLC / toll-free verification) and
  STOP/HELP opt-out at the account level.
- The inbound webhook only writes chat messages. If you want to harden it, you
  can later verify SimpleTexting's `x-simpletexting-signature` (HMAC-SHA256)
  header — not required for it to work.

## Switching providers

The app talks only to `/api/send-sms` and `/api/sms-inbound`. To swap to a
different SMS provider later, change just those two Netlify functions — no app
changes needed.
