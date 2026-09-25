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

- [x] 🟡 **Medium · FIXED — Orphaned auto-pickup: a pickup card shown with no delivery (multi-source docks).** _Found in field use, not the original static pass — this was in code the review wrongly marked "clean."_ `reapOrphanAutoPickups` (`manifestLogic.js:69`) keyed on `[customer, driverId, loadNum]` with no dock, so a multi-source supplier's pickup (e.g. Emser – Norcross) survived after its delivery moved as long as any same-customer delivery at another dock (Roswell) remained on the load; `drvEntries` then displayed a stale "Load order" note naming the departed delivery. **Fixed:** dock-aware reaper (matches a multi-source pickup to a delivery at its own normalized `pickupFrom`, conservative on ambiguous data) threaded through all ingest + save-merge paths, plus a display-time reap & stale-note clear in `drvEntries`. Guarded by 8 regression tests in `manifestLogic.test.js`.
- [x] 🟡 **Medium · FIXED — Duplicate delivery double-billed on the weekly (reassign-race ghost).** _Found in field use._ `entrySig` keys on `driverId`, so a delivery reassigned unassigned→driver looks like a new stop to the merge; the delivery safety-net then re-appends the stale unassigned copy, and `computeDay` (`App.jsx:5114`) bills both — e.g. one EcoClean showed twice on the weekly and inflated the MM Systems fuel surcharge by $67.50. No delivery-level dedup existed (`dedupeAutoPickups` only touches pickups). **Fixed:** `dedupeGhostDeliveries` (`manifestLogic.js`) drops the driverId-0 twin of an assigned delivery (matched on customer+stop+load+rate; split halves and distinct orders preserved), threaded through every ingest + save-merge. Guarded by 7 regression tests incl. a red→green reassign-race merge test.
- [x] 🟡 **Medium · FIXED — Same pickup card shown 2–3× on a driver's load (dash-drift + un-normalized dedup key).** _Found in field use._ `dedupeAutoPickups` keyed on the **raw** `stop` string while the same dock ships as "Emser - Norcross" / "Emser – Norcross" / "Emser Tile — Norcross", so duplicates survived every layer; `_normLoc`'s split regex also **missed the en-dash** (`App.jsx:970`). **Fixed:** `dedupeAutoPickups` now keys on the normalized dock (threaded through every ingest + save-merge + render), and `_normLoc` handles hyphen/en-dash/em-dash. 5 regression tests incl. a red→green 3-format-collapse test.
- [x] 🟡 **Medium · FIXED — Auto-pickup renders at the bottom of its load (desktop RouteBuilder Apply).** _Found in field use._ RouteBuilder Apply passed a **delivery-only** id list to `reorderDriver`, so `orderByIds` stranded pickups at the end and `rebuildPickupsFor`'s anchor-null branch (`App.jsx:4480`) then re-pinned them there every rebuild. **Fixed:** anchor-null now falls through to before-first-delivery placement, and `reorderDriver` rebuilds pickups after a reorder.
- [x] 🟡 **Medium · FIXED — Driver's own phone app never self-healed.** _Found in field use._ Two app components: the dispatcher board dedupes/reaps via `drvEntries`, but the driver app rendered `dl.filter(...)` raw (`App.jsx:10177`) — showing duplicate/orphaned pickups regardless of the other fixes. **Fixed:** driver entries now run the same dedupe + dock-aware reap.
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

## 08 · 2026-09-21 audit — pickup engine, quotes, sync, backend

- **Trigger:** field report — four Emser Tile stops batch-loaded onto a driver showed "Pickup from Emser - Norcross" on every card, the Norcross pickup card carried no load order, and after a sync the card itself was gone. Asked whether a quote pushed onto the same day was involved.
- **Method:** eight parallel finders (pickup engine · quotes · sync/merge · mutations · billing · driver app · backend · UI state), 44 raw findings deduped to 39, the top 30 each handed to one or two adversarial verifiers told to refute. 29 confirmed, 1 refuted, 9 low-ranked left unverified (listed at the end). Line numbers are from commit `54122c2`; search by symbol.
- **The through-line:** three rules disagreed about which dock an Emser delivery with no chosen dock belongs to — the engine filed it under the default (Norcross) and made the card, the board's live note demanded an exact dock match and found nothing, and the save-path reaper (run without the dock list) read a free-typed origin as a dock and deleted the card. `deliveryDock` in `manifestLogic.js` is now the one resolution all of them share, and the scenario matrix holds the live note equal to the stored one on every manifest it builds.

### Fixed in this pass

- [x] 🟠 **High · FIXED — Emser card shows no load order (the field report).** `_computeLiveLoadOrderNote` matched deliveries to a card by strict dock equality, so a delivery with `pickupFrom` null (every batch-added stop, defaulted to Norcross since `pickupConfig` gained `default:true`) never matched its card; the display path then cleared the good stored note as stale. Rule moved to `liveLoadOrderNote` beside the engine; both resolve through `deliveryDock`. The driver's phone reads the same live note.
- [x] 🟠 **High · FIXED — The card vanishes after a sync.** `saveManifestDay` ran `reapOrphanAutoPickups` without `docksFor`, unlike ingest and display; a free-typed `pickupFrom` was read as a dock constraint and the transaction deleted the card the engine had just made. `docksFor` threaded through `buildMergedEntries`.
- [x] 🟡 **Medium · FIXED — Two cards for one dock.** `rebuildPickupsForPure` grouped on the raw normalized `pickupFrom`; two un-docked deliveries with different free text minted two default-dock cards sharing one id. Groups are keyed on the resolved dock.
- [x] 🟠 **High · FIXED — Dragging or removing an auto pickup card strips it and nothing regenerates it.** `applyReassign` only rebuilt for deliveries/manual pickups; an auto card just took the new driverId. Auto cards are derived: `applyReassign` now refuses to move one, and `reassign` / `assignInOrder` / `reassignBulk` say so instead of moving it.
- [x] 🟡 **Medium · FIXED — A manual pickup standing in for the dock carried no load order.** A quote for Emser Tile collected at Norcross, pushed beside four hourly Emser stops, suppressed the auto card (correctly) and left one card reading only "Picking up for …". `liveLoadOrderNote` now covers a manual pickup that `manualPickupCoversDock` matches; `withLiveLoadOrder` appends it after the dispatcher's own note, idempotently. *This is the "quoted order on the same day" mechanism.*
- [x] 🟡 **Medium · FIXED — Map-assigning a quote's delivery then its pickup left two dock cards.** `assignInOrder` never rebuilt for a manual pickup. It does now, and a quote's paired pickup comes along with its delivery.
- [x] 🟠 **High · FIXED — Crossville / Prolex quote grew a second auto card beside its manual pickup.** `qualifyPickupName` only consulted `MULTI_PICKUP`, which omits single-dock suppliers, so the pickup leg's stop stayed a bare "Norcross" the engine could not see as the dock. It now checks the customer's own `PICKUP_SOURCES` first.
- [x] 🟠 **High · FIXED — `qualifyPickupName` relabelled a customer's own pickup city as a supplier branch** ("Atlanta" for Jill of All Trades → "Traditions - Atlanta", and the driver went to Traditions). The cross-supplier guess now has to match the pickup address when the caller knows it.
- [x] 🟠 **High · FIXED — A quote's pickup leg never followed its delivery.** Both legs now share a `pairId`; `applyReassign` and `assignInOrder` move a partner sitting in the same place along with the moved leg, pickup first. Assigning the delivery alone no longer conjures a supplier dock card at an address the freight isn't at.
- [x] 🟠 **High · FIXED — Unplanning a quote on a week that isn't loaded was a silent no-op** that still flipped the quote to pending, so a re-push double-booked the job. `unplanQuote` now reads that day from Firestore, removes the quote's entries, saves, and only then flips the quote.
- [x] 🟠 **High · FIXED — Unplanning the only work on a day was never saved** (the empty-write guard refused it) and the stops came back. `unplanQuote` sets the same intentional-clear flag the delete path does.
- [x] 🟡 **Medium · FIXED — Unplanning a split quote left the split-off half on the board.** Pushed entries carry `quoteId`; a split half inherits it and is removed too.
- [x] 🟠 **High · FIXED — "Manual Entry" quotes saved with the literal customer `__manual`.** Stored as "One-Off Delivery"; a legacy `__manual` quote pushes as a one-off.
- [x] 🟠 **High · FIXED — Splitting an hourly Emser delivery to a distance-bonus stop billed the +1h twice.** The continuation half is stamped `splitContinuation`; every bonus filter goes through `_hourlyBonusEligible`.
- [x] 🟠 **High · FIXED — Route Planner Apply force-unassigned every stop it was not seeded with** (day switched in the header while the planner was open, or a stop assigned by another device meanwhile). The planner records the day and stops it opened on, re-seeds on a day change, and Apply only touches seeded stops.
- [x] 🟡 **Medium · FIXED — Google-optimized sort wrote a stale, click-time stop list back** seconds later, duplicating or dropping a stop that moved in between. `_sApply` imposes the order by id against the current day.
- [x] 🟡 **Medium · FIXED — A stop pulled to Unassigned kept its old load number** and opened a lone Load 2 on the next driver. The pool resets to Load 1 (a split-off half keeps its Load 2).
- [x] 🟡 **Medium · FIXED — Driver page subscription captured a stale null `driverId`** for a driver not in the seed roster, so every snapshot overwrote their unsaved stamps. `driverId` is in the effect's dependencies.
- [x] 🟠 **High · FIXED — "Clear" on a day's dispatch note never reached Firestore** and the note came back on the next snapshot. Clearing saves an empty note.
- [x] 🟡 **Medium · FIXED — In-memory (90 s) tombstones ignored the edit clock**, so one dispatcher's delete beat another's newer edit on that screen only. `makeTombFilter` applies the same last-writer-wins rule as the doc tombstones.
- [x] 🟠 **High · FIXED — Nightly backup silently skipped custom stops, stop overrides, hidden stops, liftgate requests, the audit log, and every `items` subcollection** (messages, notifications, orders-v2). The config docs moved to `SINGLE_DOCS`, the missing collections were added, and a `collectionGroup('items')` read captures the subcollections.
- [x] 🟠 **High · FIXED — `backups/status` was never written after a clean run** (`errors: undefined` is rejected by Firestore; the throw was swallowed), so the health panel showed the last failure or "never". `errors` is always an array.
- [x] 🟠 **High · FIXED — Customer Texts marked every message outbound.** `st-inbox` never read SimpleTexting's `directionType` (MO/MT).
- [x] 🟡 **Medium · FIXED — `sms-inbound` dropped SimpleTexting webhook deliveries** (`{type:"INCOMING_MESSAGE", values:{contactPhone,text}}`) with a 200, so drivers' SMS replies never reached the chat and were never retried. The envelope is unwrapped.

### Verified, still open (policy or design decisions needed)

- [ ] 🟠 **High — Weekly "Emser Week Total" block disagrees with the weekly total beside it.** `App.jsx` block near `wkShiftTotal` rounds the whole week's minutes once and adds bonus hours on days with no shifts, while `computeDay` rounds per day and bills a flat `emH||4` with no bonus when no shifts are logged. Decide which is the billing rule, then derive the block from `computeDay`.
- [ ] 🟡 **Medium — Distance bonus and the auto liftgate hour are announced but not billed on the no-shift path.** `computeDay` only adds `(lgCount+distBonus)*60` when `totalMins>0`; with manual hours the day bills `emH||4` flat while the toast says "+1h applied". Either apply the bonus in both branches or have add/delete adjust `emH` like the +1HR LG button does.
- [ ] 🟡 **Medium — `removeLiftgate` on an hourly stop subtracts an Emser hour that was never added** when the liftgate came from `approveLiftgate` or the auto-liftgate stops. Record how the hour was added (e.g. `liftgateHourAdded`) and only reverse that path.
- [ ] 🟡 **Medium — Printed daily "Revenue by Customer" rows exclude fuel and the 4 h hourly minimum**, so they do not sum to the header printed next to them (`custRevArr`). Build the rows from `computeDay`'s per-customer breakdown.
- [ ] 🟠 **High — Custom-stop edits and deletions never propagate to a device that already has that customer's list.** The receive merge (`subscribeCustomStops` handler) accepts Firebase per customer only when local is empty, identical, or Firebase is strictly longer; a rate edit keeps the length, so two boards dispatch the same stop at different rates indefinitely. Use the doc's `updatedAt` as last-writer-wins.
- [ ] 🟡 **Medium — Restoring a hidden stop never propagates** (the receive path unions the hidden-stop lists, so a removal is unrepresentable) and the next hide on another device re-hides it everywhere. Store hides with tombstones or accept Firebase by `updatedAt`.
- [ ] 🟡 **Medium — The merge's signature fallback can collapse two DISTINCT same-signature orders** (two different Emser orders to the same stop, added on two devices within one save window) into one, losing an order and its billing. Veto the fallback when `refNum`, `baseRate` or `weight` differ, or restrict it to `d_`-prefixed ids (its stated purpose).
- [ ] 🟡 **Medium — Roster snapshots dropped during the 5 s save-in-flight window are never re-delivered**, so the next local roster save can delete a driver another dispatcher just added (their stops vanish from the board). Buffer the last ignored payload, or merge rosters by id instead of overwriting.
- [x] ⚪ **Checked, clean — "Notify driver" toast before the write resolves.** Refuted: Firestore persistence queues the write offline and syncs on reconnect.

### Unverified, low-ranked (left over from the cap of 30)

- ⚪ Driver photo upload keeps the image only in a closure; after retries fail the POD photo is discarded with no local copy (`DriverPage` upload path). *(medium, worth a look)*
- ⚪ Quote numbers are `savedQuotes.length+1`, so deleting a quote or two devices saving at once reissues a number.
- ⚪ Date picker: choosing a Sunday jumps to the Friday of the previous week (`jumpToDate`).
- ⚪ A manual backup after 8 PM ET is filed under tomorrow's date (UTC) and collides with the scheduled run.
- ⚪ Offline first load for a driver not in `DEFAULT_DRIVERS` shows "Driver not found" after 5 s.
- ⚪ `updateHistPOD`'s direct save clears the day's dirty flag, dropping an edit made while that save was in flight.
- ⚪ Changing a driver's load number mints a new pickup id and discards the pickup's arrived/departed/photos.
- ⚪ An AI quote with a currency-formatted rate string ("$250") is saved as $0.
- ⚪ AI chat "Add selected" writes the model's raw `rate`/`weight` strings into the entry with no numeric coercion.


## 09 · 2026-09-22 — truck GPS, map pins

### Why the GPS panel read 17h–258h

Four separate causes, all of them code, none of them Motive being down:

1. **`TRUCK_DRIVER_MAP` was an allowlist, not a fallback.** `motive-gps.js` dropped
   every vehicle whose padded number was absent from a three-entry map — even when
   Motive itself reported a `current_driver` for it. Three of seven drivers could
   ever show a live fix; the rest could only be located by their own phone.
2. **The Firestore snapshot replaced the whole location table.** `subscribeDriverLocations`
   did `setDriverLocs(locs)`, so every Motive fix on the board was dropped the
   moment any phone wrote, and only came back on the next 20 s poll.
3. **Nothing expires a phone ping.** `driverLocations/{id}` is written while the
   driver page is open and never removed. A driver who last opened the app ten days
   ago still had a record — so the panel dated it "258h ago" and the map still drew
   a truck pin on today's board.
4. **A failed poll returned in silence.** A rejected `MOTIVE_API_KEY` and a truck
   parked all weekend looked identical: the panel said "1 min polling" either way
   (it polls every 20 s), and the last known fix stayed on screen.

### Fixed in this pass

- [x] 🟠 **High — roster allowlist dropped named vehicles.** The map is now a fallback
      for trucks Motive hasn't synced a driver to. A vehicle with no name from either
      source is still dropped, and the client's exact-match against the app roster is
      what keeps rentals and retired units off the map.
- [x] 🟠 **High — one source clobbered the other.** The two writers are held in separate
      state (`phoneLocs`, `motiveLocs`) and merged by clock — newest fix per driver,
      the same last-writer-wins rule the manifest sync runs on (`mergeDriverLocs`).
- [x] 🟠 **High — a stale fix drew a live pin.** A fix older than `GPS_FRESH_MS` (12 h,
      comfortably past a full shift) stops pinning and stops counting as a location.
      Nothing is deleted: `lastKnownLoc` still dates it, and the panel reads
      "Last seen 11d ago" instead of "No data yet".
- [x] 🟡 **Medium — the GPS toggle didn't hold.** Turning a driver's GPS off deleted the
      entry once; the next Firestore snapshot put the phone ping straight back.
      `gpsEnabled` is applied in the merge, so it silences both sources.
- [x] 🟡 **Medium — no failure signal.** The panel header reports the link: connecting,
      live, "Motive key rejected", "proxy unreachable", or how long since the last
      successful sync. A banner counts vehicles Motive reported that carry no driver
      the app knows, which is the number to look at when a driver reads "no GPS".
- [x] 🟡 **Medium — a fix with no clock dated itself "just now".** It now reads
      "age unknown", and an age past two days reads in days rather than "258h ago".

### Still needs a human

- [ ] Add the missing truck numbers to `TRUCK_DRIVER_MAP` in `netlify/functions/motive-gps.js`,
      or assign those drivers in the Motive dashboard. The banner says how many are unnamed.
- [ ] Confirm `MOTIVE_API_KEY` is set in Netlify → Site configuration → Environment
      variables (Functions scope). The panel now says outright when it is rejected.

### Map

- [x] **Emser keeps its blue.** An Emser Tile stop draws in the customer's own blue in
      every state, not amber when unassigned or grey when done. Finished stops stay
      legible — they draw small and faded, and that is the cue that says done.
- [x] **Satellite toggle.** Google's native map-type bar was configured at `TOP_RIGHT`,
      which is exactly where the Load 1 / Load 2 legend sits, so it was never reachable.
      Replaced with a 🛰 Satellite button in the control row. Labels carries over:
      hybrid is the photo with roads and place names, plain satellite is the photo alone.


## 10 · 2026-09-22 — the truck in two places at once

### What the board showed

TYRESE Griffin, on site at **Precision Flooring – Norcross** (arrived 8:54) and
**ProSource – Norcross** (arrived 8:47) at the same time, neither departed. The
ProSource stamp is a minute *before* he reached the Emser – Norcross pickup those
deliveries load from (8:48) and four before he left it (8:51) — the freight was
still on Emser's dock.

### Why the impossible stamp exists

**The liftgate request button only existed on an arrived stop.** In both stop
cards it sat inside the `arrived&&(…)` block, and on the driver's own page it
was further gated on `arrived&&!departed`. A liftgate is something you see from
the kerb; the only way to send the request was to stamp an arrival that had not
happened. The pending request in the queue is timed **8:47 AM** — the same
minute as the arrival. He was at the dock, saw the ProSource pallet needed a
liftgate, and the app made him lie about his position to ask for it.

Nothing else writes `arrivedAt`: it is set only by an explicit Arrived tap and
never cleared. Emser hourly billing comes from `emserShifts` clock-in/out via
`getShiftSummary`, so no money was affected — only the board's picture of where
the truck was, and the "on site 30 min+" alert, which cried wolf all morning.

### Fixed in this pass

- [x] 🟠 **High — a liftgate could not be requested without a false arrival.**
      The request, the pending notice and the approved notice moved out of the
      arrived-only block in both `DriverView` and `DriverPage`. It asks for
      nothing but the stop, and still disappears once the stop is departed.
- [x] 🟠 **High — nothing enforced that a truck is in one place at a time.**
      `updateStatus` stamps the one entry it was handed and looks at nothing
      else. Arriving somewhere while another stop is open now raises a sheet
      naming the open stops and their times, with **Depart those stops & arrive
      here**, **Arrive anyway** and **Cancel**. The app writes no timestamp the
      driver did not tap for.
- [x] 🟡 **Medium — a delivery could be arrived before its dock was left.**
      `arrivalWarnings` also reports a pickup on the same driver and load that
      has not departed. Warn, not block: a stamp entered late from memory is a
      real thing.
- [x] 🟡 **Medium — the board could not see the overlap.** The triage bar gains
      "N drivers on site at 2+ stops" and the driver row names them. The dwell
      flag only fires at thirty minutes, so a stale stamp was invisible until
      it was half an hour old.
- [x] 🟠 **High — the Daily Log rendered a stale load order.** §08 made the
      board's note live, but the Daily Log maps the raw day and rendered the
      stored `note`, so the same pickup read two different ways in two columns
      of one screen after any route reorder. It runs the same rule now, and a
      test holds the whole day and one driver's slice to the same answer.

### Note on the earlier reading

The 8:47 stamp was first read here as a mis-tap on the wrong card. It was not —
the liftgate gate above forced it. The fix follows the cause, not the symptom.


## 11 · 2026-09-25 — a test copy of the driver app

**More ⋯ → Driver App (test)** opens the real driver app in a phone-sized frame,
loaded from the real day for whichever driver you pick, so driver-side features
can be tried and developed against real work. Reset reloads the frame; Open in
new tab gives the same fenced app full size. The route is `#/sandbox/driver/<slug>`.

### The one rule: it never writes

A tap on Arrived there, landing on the real manifest, would stamp a real
driver's real record. So the fence sits at the lowest layers, where every write
already has to pass, not at each button — a feature added to the driver app
later is fenced the day it is written, without anyone remembering to fence it.

- **Firestore** — `src/sandboxOps.js` replaces `window._fbOps` with an in-memory
  copy of the documents the page touches, seeded from one real read of each.
  Subscriptions deliver the real value once, then only local writes, so a tap
  sticks and a live edit on the board can't snap a test back. The Firebase
  bootstrap wraps the ops *before* marking Firebase ready, so nothing in the page
  ever holds the real ones.
- **Storage** — same origin means the same `localStorage` as the board, and every
  save snapshots the manifest into `dd_auto_backups`, which the board can restore
  from. The frame gets a private copy, seeded from the real one.
- **Network** — non-GET requests to our functions (`/api/*`, `/.netlify/functions/*`)
  are answered locally, as is the one side-effecting GET (`/api/backup-nightly`).
  A text message cannot be sent from it.
- **Browser** — no push-permission prompt, no location watch (it would report the
  dispatcher's desk as the truck), no IndexedDB persistence lease taken from the
  board, and no PIN, since the board it opens from has no login of its own.

`src/sandboxBoot.js` installs all of this and is the first import in `main.jsx`,
so it runs before `App.jsx` is evaluated. It keys off the URL at load and cannot be
undone without a reload. The router refuses to render the sandbox route on a page
it did not fence: arriving there by a hash change on the board reloads instead.

### Proof

- 30 unit tests on the firewall; all 26 mutations caught.
- Driven in a real browser with a fake Firebase SDK served *through the app's real
  bootstrap*, every write primitive recording itself: Arrived, Arrive anyway,
  Departed, Liftgate and a direct `POST /api/send-sms`, both opened directly and in
  the board's frame — zero writes reached Firebase, zero non-GET requests left the
  page, and the board's `dd_auto_backups` and GPS toggles were untouched. 19/19.
- **Negative control:** with the Firestore and storage fences removed, the same run
  catches the test taps writing `manifests/2026-09-25` and a real
  `liftgateRequests/…` document, and overwriting the board's auto-backups with a
  snapshot carrying the test's fake stamps — which a restore would have put into
  production.

### When developing in it

Anything written through `_fbOps`, `fetch` to our functions, or `localStorage` is
fenced automatically. A new write path that bypasses all three — the Firestore REST
API called directly, say — would not be. Keep writes on `_fbOps`.

---

## Dead code / cleanup (not counted in the tally)

- [ ] Delete unreferenced `netlify/functions/calc-distance.mts` and `optimize-route.mts` (no callers in `src/`) — or wire optimize-route per §6.
- [ ] Remove dead `src/firebase.js` (nothing imports it; live Firebase logic is inlined in `App.jsx`) — or switch `App.jsx` to import from it.
- [ ] Remove or wire `copyManifest` (`App.jsx:5369`, zero call sites).
- [ ] **Backup completeness:** `backup-nightly.js` omits the `drivers`, `notifications`, `fcmTokens`, and `messages/*` collections, and treats a partial/failed read as `success` — a "successful" backup silently excludes all chat/SMS/notification history. Enumerate all collections and flag failed reads.
