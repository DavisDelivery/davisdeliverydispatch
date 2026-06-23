# SMS Texting Setup (Twilio)

The dispatch app can send and receive real text messages once a Twilio account
is connected. **Until the environment variables below are set, nothing changes**
— "Text manifest" and "Notify" keep opening your phone's native SMS app exactly
like before. The moment the variables are present, those actions send
automatically (from any device, server-side) and driver replies flow back into
the in-app chat.

## What you get

| Feature | Before | After Twilio is connected |
|---|---|---|
| **Text manifest / Notify** | Opens your phone's SMS app, you tap send | Sends automatically, server-side, from any device |
| **Dispatch → driver chat (DM)** | In-app only | Also delivered to the driver's phone as a text |
| **Driver replies by text** | — | Land in that driver's in-app chat thread |
| **Texts from unknown numbers** | — | Land in the group chat, labeled with the number |

Group chat messages stay in-app (they are not mass-texted).

## 1. Twilio account

1. Create a Twilio account and buy an SMS-capable phone number (or set up a
   Messaging Service).
2. From the Twilio Console grab your **Account SID** and **Auth Token**.

## 2. Netlify environment variables

Netlify → your site → **Site configuration → Environment variables**. Add:

| Variable | Value |
|---|---|
| `TWILIO_ACCOUNT_SID` | Account SID (starts with `AC…`) |
| `TWILIO_AUTH_TOKEN` | Auth Token |
| `TWILIO_FROM_NUMBER` | your Twilio number in E.164, e.g. `+14045551234` |
| `TWILIO_MESSAGING_SERVICE_SID` | *(optional)* use a Messaging Service instead of `TWILIO_FROM_NUMBER` |

`FIREBASE_SERVICE_ACCOUNT` is already set for the nightly backup — the inbound
webhook reuses it, so no new Firebase setup is needed.

Redeploy (or trigger a deploy) so the functions pick up the new variables.

## 3. Inbound replies (two-way)

In the Twilio Console, open your number's **Messaging configuration** and set
**"A message comes in"** to **Webhook / HTTP POST**:

```
https://<your-site>/api/sms-inbound
```

Driver numbers are matched against the phone numbers saved in **Manage Drivers**
(last 10 digits), so make sure each driver's number is filled in.

## 4. Verify

- Visit `https://<your-site>/api/send-sms` in a browser — it should return
  `{"configured":true}`.
- Open the dispatcher board, hit **Notify** on a driver — the modal footer should
  read *"auto-sends via SMS gateway"*. Send a test; you should see "Text sent ✓".
- Text the Twilio number from a driver's phone — it should appear in that
  driver's chat thread.

## Endpoints (reference)

- `GET  /api/send-sms` → `{ configured: boolean }`
- `POST /api/send-sms` `{ to, body }` → `{ ok, sid }`
- `POST /api/sms-inbound` → Twilio inbound webhook (returns empty TwiML)

## Notes

- US numbers default to `+1`; numbers already in `+E.164` are used as-is.
- Standard Twilio carrier compliance applies (A2P 10DLC registration for US
  long-code traffic, and honoring STOP/HELP keywords). Twilio handles STOP/HELP
  opt-out automatically at the account level.
