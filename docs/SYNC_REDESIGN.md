# Multi-Writer Sync Redesign

**Goal:** a dispatch platform where any dispatcher, on any device or browser, anywhere, sees **identical state** and can perform **any action** — and it holds up at 100+ deliveries. No divergence, no duplication, no resurrection, no "you can't do that on this machine."

This document is the design. It is grounded in the confirmed root-cause traces (see *Why it breaks today*) and is meant to be reviewed and executed in phases.

---

## 1. Why it breaks today (confirmed, adversarially verified)

The whole day is stored as **one Firestore document** — `manifests/{YYYY-MM-DD}` — holding **one big array of all stops**. Every device loads its own copy of that array, edits it locally, and then **merges arrays back together in JavaScript** on save and on every snapshot. That model cannot be made correct for multiple writers. Every symptom traces to it:

| Symptom you saw | Underlying cause |
|---|---|
| Same order shows **twice** on a route | No stable per-order identity. Split/rebuild mint **new IDs** for the same order; nothing collapses two deliveries that share (customer, stop, driver, load) under different IDs. |
| A duplicate **won't delete / comes back** (even on another driver) | Deletes are **in-memory tombstones** (90s TTL) keyed to one copy's ID. The twin (different ID) isn't matched, and the merge's "safety net" re-appends it. |
| One dispatcher's plan **doesn't appear** on another's screen | Identity includes `driverId`, so a reassign looks like a *different* stop; and the merge keeps **local** values for dispatcher fields with no timestamp, so a remote edit is treated as stale. |
| The self-healing that exists **doesn't fire** | `buildMergedEntries` can reconcile a diverged ID via a signature fallback — but only when the signature is unique on both sides. The duplicate echoing back makes the signature appear twice, which **disables the healer**. So duplicates are *sticky*. |
| Pickup card **mislabeled / missing / at the bottom** | Auto-pickups are **stored** entries, regenerated with fresh IDs on every rebuild → churn, orphans, wrong labels. |
| Gets worse with volume | Bigger array → longer saves → more overlapping edit windows → more merge collisions. At 5 stops it's rare; at 100 it's constant. |

**One sentence:** there is no stable identity for an order, and no single source of truth — the browser is left to guess whether two rows are the same order, and it guesses wrong.

---

## 2. Target architecture: one document per order

Store **each order as its own Firestore document** with a **permanent ID**, and let the database handle concurrency instead of the browser.

```
orders/{orderId}          ← one document per delivery or manual pickup
```

`orderId` is minted **once** when the order is created and **never changes** — through reassign, split, load moves, edits, anything.

```jsonc
// orders/{orderId}
{
  "id":        "o_9f3a…",          // STABLE, permanent — the whole fix hinges on this
  "date":      "2026-07-10",        // was the doc key; now a queryable field
  "customer":  "BEC",
  "stop":      "BEC - Alpharetta",
  "addr":      "1000 Union Center Drive, Suite C, Alpharetta, GA 30004",
  "stopType":  "delivery",
  "driverId":  2,                   // mutable — reassign just writes this field
  "loadNum":   2,                   // mutable
  "seq":       3000,                // ordering within (driver, load); gapped/fractional
  "baseRate":  175, "weight": 8753, // mutable dispatcher fields
  "pickupFrom":"Florida Tile",
  "status":    "pending",           // driver-stamped fields
  "arrivedAt": null, "departedAt": null, "photos": [], "signature": null,
  "splitParent": null,              // if this is a split-off half, the parent's stable id
  "updatedAt": "<serverTimestamp>", // Firestore server clock — the real tiebreaker
  "updatedBy": "chad",              // who last wrote (audit + presence)
  "deleted":   false                // soft-delete (or hard-delete the doc)
}
```

### Reads
Subscribe with a query: `orders where date == <day>` via `onSnapshot`. Firestore streams each order document and pushes only what changed. Every dispatcher subscribes to the same query → **every dispatcher sees the same documents**. The client assembles the board from the streamed docs (group by driver, then load, order by `seq`). No array to merge, nothing to guess.

### Writes — every action becomes a single-document operation
| Action | Operation | Result |
|---|---|---|
| Edit rate/weight/notes | `updateDoc(orders/{id}, {field, updatedAt})` | Only that order's doc changes; other orders untouched. |
| **Reassign** to a driver | `updateDoc(orders/{id}, {driverId})` | ID unchanged → **propagates to everyone, no duplicate.** |
| Reorder within a load | `updateDoc(orders/{id}, {seq})` | Only the moved order writes; no whole-array rewrite. |
| **Delete** | `deleteDoc(orders/{id})` (or `deleted:true`) | **Gone for everyone, permanently. No resurrection.** |
| **Split** | create a child `orders/{newId}` with `splitParent:{id}` | Deterministic; the parent keeps its ID. |
| **Un-split** | `deleteDoc(child)` | Reversible; no orphan, no churn. |
| Add | create `orders/{newId}` | Fresh stable ID. |

### Auto-pickups become *derived*, not stored
Pickups are computed from the deliveries at **render time** (the app already computes their "Load order" note live). Nothing is stored, so there are **no pickup IDs to churn, orphan, duplicate, or mislabel.** Manual pickups the dispatcher explicitly adds are stored as normal orders (`stopType:"pickup"`, `manualPickup:true`) — those are intentional and get stable IDs like everything else.

### What this eliminates — by construction, not by patch
- Duplicate deliveries — **impossible**: one order = one document = one ID.
- Divergence between dispatchers — **impossible**: single source of truth, same stream to all.
- Delete-resurrection — **impossible**: `deleteDoc` is authoritative.
- Reassign not propagating — **fixed**: it's a field write on the shared document.
- Pickup mislabel/duplicate/bottom-of-load — **gone**: derived, not stored.
- Scale to hundreds — each write is one small doc; no giant-array merge; Firestore indexes the day query.

---

## 3. Concurrency semantics (what "two dispatchers" now means)

| Situation | Behavior |
|---|---|
| Two dispatchers edit **different** orders | Fully independent. No conflict, ever. |
| Two edit the **same** order, **different** fields | Both apply (Firestore merges field writes). |
| Two edit the **same** order, **same** field | **Last write wins** by Firestore's server timestamp — deterministic and identical on every device. A transaction/`version` guard can be added for a few critical fields if desired. |
| Reorder races | Last write wins on `seq`; the occasional reshuffle converges to one order everyone sees. |

This is the standard, correct model real multi-user apps use. "I do something here and it's exactly the same on the other device" becomes true because there is one authoritative copy of each order and no client-side merge to disagree about.

---

## 4. Migration plan (phased, no risk to the live board)

Stable IDs are the foundation of the new model, so we build that first — it's not a throwaway patch, it's Phase 1 of the real thing — and it delivers **immediate relief** on the worst symptoms while the storage cutover is built and proven in parallel.

### Phase 1 — Stable identity + duplicate collapse (fast relief, on the real path)
- **Stop minting new IDs on split/rebuild.** Every order gets one permanent ID at creation; split creates a child with its own stable ID; add an explicit **un-split** that deletes the child. This removes the ID-churn engine.
- **Add a duplicate-delivery collapse** that merges two rows sharing (customer, stop, driver, load) into one — keeping driver-stamps, choosing a deterministic survivor — with a guard so it can **never** merge two genuinely-distinct orders (distinguished by weight/rate/refNum). Wire it into every ingest, save, and render.
- **Fix the delete** so a tombstone matches by content, not just one ID, so a twin can't survive it.
- *Result:* the BEC-Alpharetta duplicate, the resurrection, and the pickup mislabels stop — within the current storage, using the stable IDs Phase 2 also needs.
- *Tests:* replay split→un-split→re-weight (no duplicate), delete-stays-deleted, pickup-not-duplicated.

### Phase 2 — Per-order documents (the architecture)
- New `orders/{id}` collection; client subscribes to `where date == day`.
- Reassign/split/edit/delete/reorder become single-doc `updateDoc`/`deleteDoc`.
- Derive pickups at render.
- **Parallel run:** behind a flag, migrate a day's array into per-order docs (one-time, idempotent, per week), read from the new store, keep the old day-array in sync until we're confident, then cut over and retire the array docs. The nightly Firebase→Drive backup is the safety net.
- *Tests:* two dispatchers reassign the same order → converges; 100-order day → independent writes, no merge; delete propagates.

#### Phase 2 status
- **Layout (as built):** `orders/{YYYY-MM-DD}/items/{orderId}` — a day-scoped subcollection instead of a top-level collection + `where(date==)` query. Same properties (one doc per order, stable id, per-doc writes, real deletes, one shared stream per day), but it works with the app's existing Firebase adapter (`onCol`) and needs no composite index. `_date` and `_seq` (ordering within the day) are storage-only fields stripped on read.
- **Shipped — shadow mode** (`src/ordersStore.js` + wiring in `App.jsx`, staged behind the `dd_orders_v2` localStorage flag, default **off**):
  - Every array-doc save also **diff-writes** the per-order docs — only orders whose content or position changed produce a write; removed orders become real `deleteDoc`s. The first sync against an empty day seeds every order — that *is* the idempotent migration.
  - The dispatcher board streams each visible day's order docs and runs a **live parity check** (same set of orders, same content, order-insensitive) against the array board, logging drift to the console.
  - The shadow sync mirrors the **merged transaction result** (what actually landed in the array doc), is fire-and-forget, and can never fail or delay the real save.
  - Enable on a device from the console: `_ddOrdersV2.enable()` (and `.disable()` / `.mode()`).
- **Next increment — read cutover ("on" mode):** assemble the board from the order docs (per `orderDocsToEntries`), turn reassign/edit/delete into direct per-doc writes, derive auto-pickups at render. Flip only after shadow parity holds clean on the live board for a stretch of real dispatching.

### Phase 3 — Conflict polish (optional, incremental)
- `serverTimestamp` + `updatedBy` on writes; a `version` guard for the few critical same-field cases; optional presence ("Trevor is editing this stop").

---

## 5. Honest cost & risk

- **Phase 1:** moderate (days). Big immediate relief. Reversible. Reuses into Phase 2.
- **Phase 2:** significant (the core storage layer — weeks of careful work + migration + parallel-run + tests). This is the real fix and what makes the platform viable multi-user at scale. De-risked by running alongside the current model and cutting over only after verification.
- **Data migration:** a one-time, idempotent script converting `manifests/{date}.entries[]` → `orders/{id}` docs, run per week, verified against the source before cutover. Existing nightly backups provide rollback.
- Not pretending any of this is a one-line change — pretending is how the array-merge became load-bearing in the first place.

---

## 6. Recommended sequence

1. **Phase 1 now** — stop ID churn, collapse duplicates, fix delete. Ship behind a preview, verify on the live board, merge. This ends the active bleeding this week.
2. **Phase 2 next** — build `orders/{id}` + derived pickups behind a flag, parallel-run one week of data, verify identical boards across two devices, cut over.
3. **Phase 3** — polish concurrency as needed.

Each phase is independently shippable and verifiable, and every confirmed bug becomes a regression test that rides along so it cannot return.
