# Davis Delivery Dispatch — Engineering Audit

**Full-repo review for correctness bugs, security exposure, UX gaps, and roadmap.**

- **Scope:** `src/App.jsx` (~10,845 lines), `src/manifestLogic.js`, the 8 Netlify functions, `src/firebase.js`
- **Method:** four parallel specialist reviewers (core logic · driver & sync · backend security · UI/UX), with the highest-severity findings independently re-verified line-by-line
- **Date:** 2026-07-07
- **How to use this doc:** tick each `- [ ]` as it's fixed. Line numbers are from the reviewed commit (`68896ec`) and will drift as code changes — search by the quoted symbol if a line has moved. `✅ verified` marks findings confirmed against the code by hand.

> **The through-line: there is no authentication anywhere** — not on the dispatcher board, the Firestore data, or any of the 8 serverless endpoints. This one gap is the root of the most serious findings below, and closing it is the highest-value work in the repo.

## Severity tally

| Severity | Count |
|---|---|
| 🔴 Critical | 1 |
| 🟠 High | 6 |
| 🟡 Medium | 13 |
| ⚪ Low / cleanup | 7 |

Suggested fix order: **(1)** endpoints + PIN backdoor → **(2)** green-toast + multi-load/hero next-stop → **(3)** sync data-loss bugs → **(4)** money/UX → **(5)** integrations & roadmap.

---

## 01 · Security & access

Every endpoint under `/api/*` maps straight to a function with no token, signature, or origin check (`netlify.toml`). CORS is wildcard on all of them.

- [ ] 🔴 **Critical · ✅ verified — Open outbound-SMS relay from the company number.** `netlify/functions/send-sms.js:21-56`. Unauthenticated `POST {to, body}` sends an SMS to any number from your SimpleTexting account; both fields attacker-controlled (body ≤1500 chars). **Fix:** require a shared-secret/JWT header on POST; lock CORS to the app origin.
- [ ] 🟠 **High — Uncapped Anthropic proxy billed to your key.** `netlify/functions/chat.js:8-45` passes attacker-chosen `model` & `max_tokens`. Free LLM / jailbreak endpoint on your key, no rate limit. **Fix:** authenticate the caller; server-side pin the model and clamp max_tokens.
- [ ] 🟠 **High — Every customer text thread is public.** `netlify/functions/st-inbox.js:81-127` (and `?debug=1` dumps a raw message). Unauthenticated GET returns customer names, phone numbers, full message bodies. **Fix:** require auth, restrict CORS, drop the debug path in production.
- [ ] 🟠 **High — Driver-message forgery + unbounded Firestore writes.** `netlify/functions/sms-inbound.js:37-85`, GET-triggerable, no webhook signature. `from=<driver phone>` writes a message that appears to come from that driver; any `from` floods the messages collection; errors swallowed (always 200). **Fix:** verify SimpleTexting's webhook signature; accept POST only.
- [ ] 🟠 **High · ✅ verified — Client-only PIN auth; phone numbers (= PINs) download before the PIN screen.** `src/App.jsx:10141,10444` (`getPin` → `"0000"` fallback), subscriptions run pre-auth at `10162-10238`. A driver with no phone is unlocked by typing `0000`; the manifest + full driver roster (including every phone number, which *is* every PIN) are readable in DevTools before the PIN is entered. **Fix:** refuse auth when phone < 4 digits; move PIN check server-side (or Firebase Auth) and gate subscriptions behind it with Firestore rules.
- [ ] 🟡 **Medium — Live driver GPS is public.** `netlify/functions/motive-gps.js` returns real-time lat/lng + driver names, unauthenticated. **Fix:** require auth on the endpoint.
- [ ] 🟡 **Medium — On-demand full-DB backup is open and leaks internals.** `netlify/functions/backup-nightly.js:224-301`. GET triggers a full Firestore read + Drive write (quota/cost) and returns internal collection names + 2000-char stack traces on error. **Fix:** gate the manual trigger behind a secret; strip stack/error detail from the response.
- [ ] 🟡 **Medium — Confirm Firestore security rules.** The client uses no Firebase Auth (`src/firebase.js` / inline config at `App.jsx:68`); all data protection rests on Firestore rules not present in the repo. **Fix:** add `firestore.rules` to the repo that denies unauthenticated access, and keep it version-controlled.

---

## 02 · Sync & data integrity

The multi-device Firestore merge is mostly sound (tombstones, signature fallback, per-driver ownership all check out) — but a few paths lose or resurrect data.

- [ ] 🟠 **High · ✅ verified — Deleted stops come back to life.** `App.jsx:2832` (90s tombstone TTL), `2921-2929`; `manifestLogic.js:322-336`; `prevLogRef` written (`2906/3738/3801`) but never read. (a) Delete on bad signal → save throws with no auto-retry → later edit runs the retry with an expired tombstone → the delete safety-net re-appends the stop permanently. (b) A delete on one dispatcher device is never detected as a remote delete by another, which re-writes the stop back for everyone. **Fix:** persist tombstones and expire them only after a confirmed successful save; use the last-synced snapshot (`prevLogRef`) to detect remote deletes.
- [ ] 🟠 **High · ✅ verified — Driver corrections to ETA / ship-plan / signature never converge.** `manifestLogic.js:134-136` — `if(fbE.eta && !localE.eta)` (fill-only-when-empty). Only the *first* value propagates; a driver's later correction is ignored and then overwritten back to the stale value on the next dispatcher save. **Fix:** make these fields last-writer-wins via a per-field timestamp (`etaSetAt` already exists) instead of "fill only when missing".
- [ ] 🟡 **Medium · ✅ verified — Splitting a shipment is silently undone (both halves onto one truck).** `App.jsx:4772-4777` (split leaves both halves same stop/addr, `driverId:0`); sibling match at `4647` ignores `wasSplit`/`loadNum`. Assigning one half via the map grabs both and stamps them the same load. **Fix:** exclude `wasSplit` entries from sibling capture, or require matching `loadNum`.
- [ ] 🟡 **Medium · ✅ verified — Route Builder rips a stop off another driver's route.** `App.jsx:6120` — sibling capture has no `driverId` scope (the exact bug already fixed in `assignInOrder` at `4643-4647`). **Fix:** scope the Route Builder sibling filter by `driverId`.
- [ ] 🟡 **Medium — Unassigned-panel drop is double-handled.** `App.jsx:8737` lacks the emptiness guard/`stopPropagation` the driver columns have; the card handler (`1963`) never stops propagation. Reordering splices the card to the bottom; cross-column drops write a duplicate `reassign` audit row. **Fix:** guard the container with `!ua.length` or `stopPropagation()` in the card handler.
- [ ] 🟡 **Medium — Base64 fallback POD photos silently destroyed by the merge.** `manifestLogic.js:104-106,130-132` keep non-`https://` photos only when the FB side has zero real photos; `App.jsx:324-331` turns over-budget base64 into `photo_…` placeholders the driver page then renders as broken `<img>` (`10721-10723`). A photo that fell back to base64 (Storage upload failed) is dropped on the next merge — POD evidence gone. **Fix:** union base64 photos by value + queue failed uploads for retry; filter `photo_` placeholders in the DriverPage renderer.
- [ ] 🟡 **Medium — Stale `ManifestStop` editor clobbers a concurrent note edit.** `App.jsx:1952` (editor state seeded once at mount), `1988` (blur writes whenever text differs). A card showing old text can, on a stray focus+blur, overwrite another device's just-typed instructions with an empty string; a remote `dueBy` change can flip After→By. **Fix:** re-sync all editor fields from `entry` on focus/expand.
- [ ] ⚪ **Low — A driver's stamp save can revert a concurrent dispatcher reorder.** `manifestLogic.js:307-320` emits entries in local order; a driver "Arrived" that races a reorder rewrites the old order until the dispatcher's next save. **Fix:** in the `isDriver` branch, emit entries in FB order (drivers never own ordering).

---

## 03 · Money & billing

Several paths price or total the same job differently. Not catastrophic today (invoicing isn't wired up), but will bite once billing moves into the app.

- [ ] 🟡 **Medium — Three different quote price tables.** `App.jsx:948` (real calc) vs `5735` (chat prompt) vs `4260` (AI-quote prompt — a different table + "liftgate replaces fuel"). AI rates are saved directly (`4273`), so the same job prices differently by path. **Fix:** generate the rate-table text in both prompts from `getBaseTier`/`calcQuoteRate`.
- [ ] 🟡 **Medium · ✅ verified — Invoice feature is dead code, and its math drops the liftgate fee.** `App.jsx:5129-5161` (zero call sites); `generateInvoice` bills `baseRate`+fuel, never adds `liftgateFee` (`5144-5147`). A $500 liftgate quote (stored as baseRate 425) would invoice $425. **Fix:** add `(e.liftgateApplied ? e.liftgateFee||0 : 0)` into the line base, then wire the UI (see §5.10).
- [ ] 🟡 **Medium — Revenue History money math diverges + is unsanitized.** `App.jsx:3027-3028` (fuel on base+liftgate, rounded) vs `5109` (board: base only); `3008-3012` reads Firestore without `sanitizeEntry`, so one legacy entry with a string `baseRate` turns the week total into string concatenation. **Fix:** reuse `computeDay`'s formula and map through `sanitizeEntry`.
- [ ] 🟡 **Medium — Pickup legs double-count weight against capacity.** `App.jsx:4189,4285` (manual pickup gets full delivery weight) vs `4456` (auto-pickups correctly 0). A 6,000 lb order counts as 12,000 → false "OVER" + false "over capacity" triage flags. **Fix:** set pickup-leg weight to 0, or exclude pickups in `getLoadWeight`.
- [ ] ⚪ **Low — Revenue History UTC date drift.** `App.jsx:3020` uses `toISOString().slice(0,10)` (UTC), so after ~8 PM ET the Monday date serializes as Tuesday; also anchors on live `new Date()` instead of the frozen `_weekRefNow()`. **Fix:** build `weekStart` from local Y/M/D parts and anchor on `_weekRefNow()`.

---

## 04 · Driver app & field use

- [ ] 🟠 **High · ✅ verified — Failure messages render as green success toasts.** `App.jsx:5905/10467` — toast hardcoded `#16a34a` with a `✓`; failures route through it, so "⚠ Photo save failed" shows as green "✓ ⚠ Photo save failed". A driver glances at green and drives off believing the POD saved. **Fix:** add a level to `showToast(msg, level)` and branch color/icon (three renderers).
- [ ] 🟡 **Medium · ✅ verified — GPS writes to Firestore on every fix, unthrottled.** `App.jsx:10263-10273` — `watchPosition` (~1-2s) + a redundant 60s interval, each an unconditional `setDoc`. ≈15-30k writes/driver/day; four drivers can exhaust the free-tier 20k daily quota by mid-morning, at which point manifest saves also start failing. **Fix:** write only when >60s or >200m moved; drop the watch or the interval.
- [ ] 🟡 **Medium · ✅ verified — Multi-load "Get ETA to next stop" targets the wrong stop.** `App.jsx:10587/10637` — a within-load loop index is used against the whole-day `entries` array (same bug in embedded DriverView at `1756`). Can point at the stop the driver is already at. **Fix:** use the global index (`entries.indexOf(entry)`) for both the slice and the dropdown filter.
- [ ] 🟡 **Medium · ✅ verified — Driver hero "Next stop" ignores load order.** `App.jsx:10511` uses raw array order (`entries.find`) while the list renders load-grouped + sorted; after a split/reassign the hero's Navigate can send the driver to a Load-2 stop first. *(Introduced by the driver-hero change — owned.)* **Fix:** derive the hero's next stop from the same load-sorted sequence the list uses.
- [ ] ⚪ **Low — Time-only arrive/depart stamps break on-site math across days.** `App.jsx:10309` stores "3:42 PM"; `_onSiteMins` (`1052-1053`) only wraps +1440. Yesterday's un-departed stop shows a fabricated "on site 660 min". **Fix:** store an epoch-ms stamp alongside (`arrivedAtTs`) and derive display strings.
- [ ] ⚪ **Low — DriverPage never re-anchors the week across midnight/weekend.** `App.jsx:10134+` has no rollover watcher (only DispatchApp does, `3810-3821`); a PWA tab resumed Monday shows last week. **Fix:** add the `_weekDayRolled()` check to DriverPage.
- [ ] ⚪ **Low — "Pull down to refresh" instructs a gesture that doesn't exist.** `App.jsx:10526`. **Fix:** replace with a real Refresh button that re-runs the subscription.
- [ ] ⚪ **Low — `_whenFB` gives up after 15s with no recovery.** `App.jsx:183-189` — if Firebase load exceeds 15s, `subscribeManifests` never attaches and the board stays blank until manual reload. **Fix:** surface an error + retry (like `loadRevenueHistory` at `2983-2992`).

---

## 05 · UX fixes (ranked by dispatcher time saved × frequency)

- [ ] **1 · Undo-in-toast** for delete / reassign / route-sort. Data to reverse is already captured. Extend toast state (`App.jsx:2948`); render Undo (`5905`). *(M)*
- [ ] **2 · Board-level stop search/filter** — dim non-matching cards. Header (`7198`), reuse history predicate (`5179`). *(S)*
- [ ] **3 · Edit "Deliver By" on the desktop board** — the due-by editor exists only in the mobile card. Port block (`2093`) → desktop card; `setDueBy` (`4829`). *(S-M)*
- [ ] **4 · Keyboard shortcuts** (days, today, search, views). One `useEffect` (~`3404`). *(S)*
- [ ] **5 · Sticky next-stop action bar** on the driver page (one-handed Arrived/Departed). Page already pads 100px; `_next` (`10511`). *(M)*
- [ ] **6 · Week-switch loading state** — skeleton vs "No stops" (`7262`) keyed on `wo`. *(S)*
- [ ] **7 · History rate edit that actually saves** — swap `updateRate` → `updateRateForDay` (`App.jsx:7053`). *(S · ✅ verified no-op today)*
- [ ] **8 · Offline banner on the driver page** — `navigator.onLine` + `fbLoaded` (`10146`). *(S)*
- [ ] **9 · Accessibility for the field** — raise driver-page tap targets ≥44px (Lock, week-nav, Refresh GPS, "Got it"); stop signalling status by color alone; keep the outdoor screen ≥12px; reserve green strictly for success. *(S-M)*
- [ ] **10 · Wire up the invoice UI** — all plumbing exists (see §3); add an "Invoice" action per customer group in Daily view (`~6554`) rendering from the already-subscribed `invoices`. *(M)*

---

## 06 · Integrations worth adding (reuse what's already paid for)

- [ ] **Automatic customer delivery texts** — "on the way / arriving in ~20 min / delivered ✓ + POD photo," triggered off arrive/depart stamps + ETA. *Reuses the SimpleTexting gateway.*
- [ ] **QuickBooks Online invoice sync** — wire the dead invoice generator, push finished invoices to QBO. *Reuses existing invoice plumbing + `googleapis`.*
- [ ] **Geofence auto-arrive from Motive GPS** — auto-stamp "arrived" on geofence entry; same signal fires the customer ETA text. *Reuses the live Motive feed.*
- [ ] **Email / PDF order ingestion** — parse emailed/PDF orders (Emser, IMETCO, Crossville) into manifest entries. *Reuses the AI `parseStops` flow + a mailbox webhook.*
- [ ] **Real multi-stop route optimization** — wire `optimize-route.mts` (deployed but never called) or Google Routes into the ⚡ Route button.
- [ ] **Payment links on invoices** — Stripe/QBO links on the customer invoice/POD text.

---

## 07 · Roadmap — next level

- [ ] **Phase 0 · foundation — Authentication & roles, then Firestore rules.** Dispatcher / driver / admin identities with server-verified access. The gate for everything below.
- [ ] **Phase 1 · quick, high-trust wins — kill the data-loss & billing bugs.** Toast severity, converging ETA/ship-plan sync, tombstone persistence, GPS throttling, quote/invoice price divergence.
- [ ] **Phase 2 · the differentiator — the automation loop:** geofence → ETA text → POD text → QuickBooks invoice. Built on infrastructure you already have.
- [ ] **Phase 3 · visibility — customer portal + operations analytics** (on-time %, cost-per-mile, driver productivity; Revenue History is the seed).
- [ ] **Phase 4 · optional ambition — multi-tenant product** for other small carriers. A business decision, not just engineering.

---

## Dead code / cleanup (not counted in the tally)

- [ ] Delete unreferenced `netlify/functions/calc-distance.mts` and `optimize-route.mts` (no callers in `src/`) — or wire optimize-route per §6.
- [ ] Remove dead `src/firebase.js` (nothing imports it; live Firebase logic is inlined in `App.jsx`) — or switch `App.jsx` to import from it.
- [ ] Remove or wire `copyManifest` (`App.jsx:5369`, zero call sites).
- [ ] **Backup completeness:** `backup-nightly.js` omits the `drivers`, `notifications`, `fcmTokens`, and `messages/*` collections, and treats a partial/failed read as `success` — a "successful" backup silently excludes all chat/SMS/notification history. Enumerate all collections and flag failed reads.
