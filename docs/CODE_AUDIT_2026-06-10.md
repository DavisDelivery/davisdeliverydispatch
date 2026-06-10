# Code Audit — June 10, 2026

Full-repo audit looking for bugs and improper wiring. Scope: `src/App.jsx` (the live app, v3.14.1),
`src/firebase.js`, all Netlify functions, the service worker, and build/deploy config.
Line numbers refer to the current `main` (commit `e3d5306`).

Each finding lists a confidence level. High-confidence findings were verified directly in the
source; medium/low items deserve a second look before fixing.

---

## A. Data-loss / billing bugs (most severe)

### A1. Deleting the *last* stop of a day can never be saved — the stop resurrects
`src/App.jsx:411–423` (empty-save guard), `:4387–4406` (`deleteDel`), `:2918–2930` (tombstones).
`saveManifestDay` refuses any save where local has 0 entries but Firebase has more
(`[SAVE] BLOCKED`), returning before tombstones are consulted. `deleteDel` only updates local
state and tombstones the id; persistence relies on the autosave that the guard blocks. Tombstones
expire after 90 seconds, after which the next snapshot/reload re-adds the "deleted" stop. The
anti-wipe guard thus makes intentional full-day deletion impossible and recreates the
"deleted stop keeps coming back" bug the code's own comments describe. **Confidence: high.**

### A2. "Unplan quote" resurrects the delivery and never removes the pickup
`src/App.jsx:4117–4130`. `unplanQuote` filters the entry out of local state but — unlike
`deleteDel` (4404) and `reassign` (4456) — never calls `tombstone()`. The save transaction
(474–477) and subscription merge (3704–3706) re-append any Firebase entry that is missing
locally and not tombstoned, so the "unplanned" delivery reappears within seconds. Additionally,
`pushQuoteToDay` creates *two* entries when the quote has a pickup (4100–4107) but the unplan
filter only matches the delivery — the pickup card is never removed even locally. Two smaller
defects in the same function: the filter requires `|baseRate − q.rate| < 1`, so a rate-edited
entry is skipped entirely; and `q.pushedTo` stores a *relative* week key, so unplanning after
the week rolls over targets the wrong day. **Confidence: high (verified).**

### A3. Rate edits in Delivery History are silent no-ops
`src/App.jsx:6744` wires the history list's `InlineRate` to `updateRate(entry.id, r)`, which only
searches the *currently selected* day (`p[dk]`, 4532). History entries span all weeks/days, so for
nearly every entry the id is never found, nothing changes, and the typed rate snaps back. The
weekly view does it correctly with `updateRateForDay(entry.id, r, dayKey)` (6387) — history should
use `updateRateForDay(entry.id, r, \`${entry.weekOff}-${entry.dayIdx}\`)`. **Confidence: high (verified).**

### A4. Driver "Liftgate Required (+$75)" requests go to a channel nobody reads
`src/App.jsx:10363` calls `sendNotificationToDriver(0, "🔄 LIFTGATE REQUEST …")`, writing to
Firestore `notifications/0/items`. The only `subscribeNotifications` call in the app is the
driver page subscribing to its **own** driverId (9899); dispatch never subscribes to id 0.
The driver sees "request sent to dispatch", dispatch sees nothing, and the $75 charge is
silently never applied. **Confidence: high (verified).**

### A5. Nightly backup silently misses data the app actually writes
`netlify/functions/backup-nightly.js:23–38` vs. the app's real Firestore layout:

- `customStops`, `stopOverrides`, `hiddenStops` are backed up as **top-level collections**, but
  the app stores them as docs under `config/` (`src/App.jsx:721, 733, 745`). The backup reads
  empty collections and stores `{}` every night — no error, no warning.
- The `audit` collection (audit log, `:636`) and `messages/{channel}/items` (driver/dispatch
  chat, `:680`) are not in the backup list at all.
- `notifications/{driverId}/items` are subcollections; even if `notifications` were listed, a
  top-level `.get()` would not capture them.

So the backup that looks green every night is missing chat history, the audit trail, and all
custom-stop configuration. **Confidence: high.**

### A6. In-app "Restore Backup" restores only half of what "Export Backup" saves
`src/App.jsx:5279–5329`. The export includes `emserShifts`, `stopOverrides`, `hiddenStops`,
`driverCapacity`, and `drivers`, but `importBackup` restores only `manifests`, `emserHours`,
`dispatchNotes`, `customStops`, and `savedQuotes`. After a real data loss, shift history (which
drives Emser hourly billing), overrides, hidden stops, and capacity settings would silently not
come back. **Confidence: medium-high.**

### A7. Edits made in the first 5 seconds after load are dropped from the save queue
`src/App.jsx:2932–2954`. During the 5-second startup window the autosave effect does
`dirtyDaysRef.current.clear()` and returns. Subscription updates bypass the dirty tracking
(`_rawSetLog`, 3642), so the only flags being wiped belong to genuine user edits. The edit
survives in local state but is never saved unless the user touches that day again; refresh
before then and it's gone. **Confidence: medium.**

### A8. Desktop "+1h LG" removal leaves Emser billing one hour too high
`src/App.jsx:7327` inlines `setLog(... liftgateApplied:false ...)` instead of calling
`removeLiftgate(le.id)` (4569–4577). The add path increments `emH` by +1h; the proper remover
decrements it; the desktop ✕ skips the decrement. On days with no logged shifts (where billing
falls back to `emH`, 7305) the day stays +1h (~$102.50) after the liftgate hour is "removed."
**Confidence: medium-high.**

### A9. Two competing effects compute Emser hours; the orphan-inflated one wins
`src/App.jsx:3878–3887` (uses `getShiftSummary()`, which excludes shifts of unknown drivers) vs.
`:4744–4755` (sums all shifts raw). Both run on the same deps and write the same `emH` key; the
raw sum runs last and wins, so orphan shifts inflate stored hours — the exact problem the UI's
own "Orphan Shifts" warning panel (6484) exists to flag. Also causes flip-flop Firebase writes.
**Confidence: medium.**

---

## B. Features wired to nothing (look like they work, don't)

### B1. Push notifications are entirely dead
- `src/App.jsx:804`: `requestPushPermission=async()=>null; onPushMessage=()=>{}; saveDriverToken=async()=>{}` —
  all stubs. The driver-page registration effect (9909–9915) therefore never registers the
  service worker or saves an FCM token.
- The real implementations live in `src/firebase.js`, which is **imported by nothing**
  (see C2 below).
- Even if a push arrived, `public/firebase-messaging-sw.js:33` deep-links to
  `/#/driver/${driverId}` (numeric id), but the router (10490, `resolveDriverSlug` 846–851)
  only resolves *name slugs* — `#/driver/2` renders "Driver not found."

**Confidence: high (verified).**

### B2. The "Road Routes / Straight Lines" map toggle does nothing
`src/App.jsx:1324–1330`. The redraw effect includes `useRoadRoutes` in its deps, but its first
action is an early return when the stops/drivers keys are unchanged (1328) — and toggling the
mode changes neither key. The button changes color; the map doesn't change until an unrelated
stop/driver edit forces a redraw. **Confidence: high (verified).**

### B3. Even when road routes do render, Load-1 polylines are invisible
`src/App.jsx:1481`: `strokeOpacity: isLoad1 ? 0 : 0` — both branches are 0 (the straight-line
branch uses 0.85/0.75). Load-1 also gets `icons: []` unless arrows are needed (1472), so a
Load-1 road route is a fully transparent line: nothing visible at all. **Confidence: high (verified).**

### B4. Geocode-completion notify is wired to a no-op
`src/App.jsx:3257`: `_geocodeNotify = () => {}`. The async geocoder (2382–2436) calls
`_geocodeNotify()` to trigger a re-render when a new address resolves; since the installed
callback does nothing, new/custom stops stay in "Not on map (missing coordinates)" until an
unrelated state change happens to re-render. **Confidence: high (verified).**

### B5. Driver page "Get ETA to next stop" uses the wrong index on multi-load days
`src/App.jsx:10240, 10290–10291, 10347` (and the dispatcher preview at 1827). Stops render per
load group (`loadStops.map((entry, i) => …)`), but the ETA logic indexes the **full** `entries`
array with the load-local `i` (`entries.slice(i+1)…`, `entries.filter((_,ei)=>ei>i…)`). With a
single load they coincide; with 2+ loads, Load 2's first stop has `i=0` and "next stop" resolves
to a Load-1 stop the driver already passed. Should use `entries.indexOf(entry)`. **Confidence: high.**

### B6. Unassigning a stop via the map leaves the driver's auto-pickup card behind
`src/App.jsx:4506–4510`. `assignInOrder`'s toggle-off branch sets `driverId: 0` and returns
without calling `rebuildPickupsFor` (the assign branch at 4523–4526 and `reassign` both do).
If that was the driver's last delivery for that customer, the orphaned auto-pickup stays on
their manifest until something else triggers a rebuild. **Confidence: medium.**

### B7. Message popups use a stale closure; driver swaps lose DM subscriptions
`src/App.jsx:4772–4788`, deps `[drivers.length]`. The callbacks read `showMsgPanel` from the
mount-time closure (almost always `false`), so popup toasts fire even while the dispatcher has
that exact thread open. And because only the *count* is a dependency, removing one driver and
adding another (count unchanged) never subscribes to the new driver's DM channel until reload.
**Confidence: high.**

### B8. Desktop Emser hour preset buttons are dead once shifts are logged
`src/App.jsx:7305, 7330`. When `totalMins > 0` the display and billing are shift-derived, so
clicking the 4–10h presets writes `emH` that nothing reads — a silent no-op. The mobile
counterpart correctly hides the presets behind `hasShifts` (8507–8513). **Confidence: medium.**

### B9. GPS panel hard-codes `drivers.filter(d => d.id <= 3)`
`src/App.jsx:7242`, while `addDrvr` assigns `id: Date.now()` (4982). Any driver added through
the app's own driver management can never appear in the GPS panel, even though the Motive
polling loop matches all drivers by name. (Cosmetic: panel copy says "1 min polling"; the poll
is 20s, 7637.) **Confidence: medium.**

### B10. The chat's direct-Anthropic fallback can never succeed
`src/App.jsx:5556`. The browser fallback to `api.anthropic.com` sends no `x-api-key` header, so
it 401s every time — dead code that adds latency and a misleading "Direct API:" error line.
**Confidence: high (verified).**

---

## C. Dead code / repo hygiene

### C1. Root `App.jsx` (8,047 lines) is a stale orphan — delete it
It's v3.11.77; the live `src/App.jsx` is v3.14.1 and 27 commits ahead (audit log, backup status,
merge-conflict resolution, Revenue History, etc. all missing from the root copy). Nothing
imports it (`src/main.jsx` → `src/App.jsx`). It's a trap for grep/future edits. **Confidence: high.**

### C2. `src/firebase.js` is dead code with *divergent* schemas — delete or reconcile
Nothing imports it. The app instead injects a CDN `<script type="module">` (gstatic Firebase
10.12.2) and talks to Firestore through `window._fbOps` (`src/App.jsx:69–140`). Dangerous trap:
the dead file's helpers use **different document layouts** than the live code (week-keyed
manifest docs, flat `notifications` collection with `message` field vs. live
`notifications/{id}/items` with `msg`). Anyone "fixing" code against this file would corrupt
expectations. It also holds the only real push-notification implementation (see B1).
**Confidence: high (verified).**

### C3. Missing `public/manifest.json` and `public/favicon.svg`
`index.html` references both; `public/` contains only the service worker. The PWA manifest 404s
(breaking Add-to-Home-Screen metadata) and the favicon — also used as the notification icon in
the SW — 404s. **Confidence: high (verified).**

### C4. `package-lock.json` is gitignored
`.gitignore` excludes the lockfile, so every Netlify build resolves dependencies fresh —
unpinned, unreproducible builds. Note the `firebase` client SDK is *not* in `package.json`
(harmless today because `src/firebase.js` is dead, but re-enabling it would break the build).
**Confidence: high.**

### C5. `src/Screenshot 2026-04-01 at 6.05.43 PM.png` is unreferenced repo bloat.

---

## D. Netlify functions

### D1. All API endpoints are unauthenticated (deliberate exposure check recommended)
- `/api/chat` — open proxy to the Anthropic API: anyone on the internet can spend the API key.
- `/api/motive-gps` — publicly exposes real-time truck GPS positions and driver names.
- `/api/calc-distance`, `/api/optimize-route` — anyone can burn Google Maps quota on the key.
- `/api/backup-nightly` — anyone can trigger full Firestore dumps + Drive writes on demand.

Even a shared static token header checked by each function would close the casual-abuse hole.
Related: there is no Firebase Auth anywhere in the app — driver "login" is a client-side PIN
check (fallback PIN `"0000"` when a driver has no phone, `src/App.jsx:10814`), so Firestore
security rules are presumably wide open. Worth confirming the rules in the Firebase console.
**Confidence: high on the facts; severity depends on your threat model.**

### D2. `optimize-route` can reorder time-constrained stops it just sorted
`netlify/functions/optimize-route.mts:87–130`. Deadline stops are carefully sorted first, but
when any flexible stops exist, `optimizeWaypointOrder: true` lets Google reorder **all**
intermediates — including the deadline ones — defeating the deadline-first ordering. The
optimized result is applied via `optimizedIntermediateWaypointIndex` with no re-check of
`dueBy`. Also: ETAs assume a hard-coded 7 AM departure, and arrivals past midnight render as
hours > 12 (e.g. "13:05 PM"). **Confidence: medium.**

### D3. Mobile "Add Driver" looks disabled without a phone but isn't
`src/App.jsx:8169` styles the button gray when the phone is empty and shows "Phone required",
but there's no `disabled` attribute and `addDrvr` (4982) only validates the name — tapping it
creates a phoneless driver whose PIN becomes `"0000"`. **Confidence: medium.**

---

## E. Minor (cosmetic / low impact)

- **E1.** History range off by one: `getHistoryEntries` loops inclusively (`w >= wo - maxWks`,
  `src/App.jsx:4974`), so "2 weeks" returns 3 weeks of data. Loader matches, so it's consistent —
  just mislabeled.
- **E2.** Photos tab sort tiebreaker compares `b.dayIdx - a.dayIdx` but `dayIdx` is never copied
  into the photo objects (8802/8805) — `NaN` comparator, same-week photos in arbitrary order.
- **E3.** Accepted-quote "✓ Pushed to {day}" label parses the day with `split("-")[1]` (8960),
  which breaks for negative week keys like `"-1-2"` (shows "Tuesday" always). The save path
  correctly uses `lastIndexOf("-")` (2966).
- **E4.** `makeDueLabel` operator-precedence bug (1290): `a || b && c` — and the regex requires an
  en-dash — so hyphen windows like "9-12" are styled as red deadlines on the map while other
  badges style the same string as a purple window.
- **E5.** "Run backup now" (4661) HTTP-invokes a *scheduled* function; depending on Netlify plan
  behavior this may 4xx in production even though the nightly schedule works.
- **E6.** `subscribeDrivers` in the dead `src/firebase.js` ignores empty snapshots
  (`if (drivers.length > 0)`) — moot while dead, but don't resurrect it as-is.

---

## Suggested priorities

1. **A1–A4** — active data-loss/billing bugs dispatchers will hit (last-stop deletion,
   unplan resurrection, history rate edits, lost liftgate requests).
2. **A5/A6** — fix backup coverage *before* you need a restore.
3. **B1** — decide whether push notifications should work or be removed (currently half-built
   infrastructure that silently does nothing).
4. **D1** — add at least a shared-secret check to the Netlify functions; verify Firestore rules.
5. **C1/C2** — delete the two dead files; they're the most likely source of future
   "fixed the wrong file" incidents.
