import { describe, it, expect } from "vitest";
import {
  dedupeIds,
  dedupeAutoPickups,
  dedupeGhostDeliveries,
  dedupeDeliveries,
  reapOrphanAutoPickups,
  sanitizeEntry,
  _mergeEntryDispatcher,
  _mergeEntryDriver,
  buildMergedEntries,
  entrySig,
  makeTombFilter,
  vanishedAutoPickups,
  orderByIds,
  reconcileDriverRoster,
  applyDriverRemap,
  normDriverName,
  tombListFrom,
  mergeTombstones,
  makeDocTombFilter,
  DOC_TOMBSTONE_TTL,
  manualPickupCoversDock,
} from "./manifestLogic.js";

/* Test helpers ---------------------------------------------------------- */
const del = (o = {}) => ({ id: "d_" + Math.random().toString(36).slice(2), customer: "Cust", stop: "Stop", addr: "Addr", stopType: "delivery", driverId: 5, loadNum: 1, baseRate: 100, photos: [], ...o });
const pu = (o = {}) => del({ stopType: "pickup", baseRate: 0, ...o });
const sig = (e) => [e.customer, e.stop, e.addr, e.stopType, e.driverId, e.loadNum].join("|");
const hasStop = (arr, e) => arr.some((x) => sig(x) === sig(e));

/* ====================================================================== */
describe("dedupeIds — order-independent id repair (audit FAIL #7 fix)", () => {
  it("returns the SAME array reference for clean unique-id data (no spurious change)", () => {
    const clean = [del({ id: "e_1" }), del({ id: "e_2" })];
    expect(dedupeIds(clean)).toBe(clean);
  });

  it("produces the SAME ids regardless of array order (the cross-device divergence bug)", () => {
    const A = { id: "X", customer: "Emser", stop: "Norcross", addr: "100 Main", stopType: "delivery", driverId: 5, loadNum: 1 };
    const B = { id: "X", customer: "Daltile", stop: "Kennesaw", addr: "200 Oak", stopType: "delivery", driverId: 7, loadNum: 1 };
    const devA = dedupeIds([{ ...A }, { ...B }]); // dispatcher manual order
    const devB = dedupeIds([{ ...B }, { ...A }]); // driver / FB order
    const idBySig = (arr) => Object.fromEntries(arr.map((e) => [sig(e), e.id]));
    const a = idBySig(devA), b = idBySig(devB);
    expect(a[sig(A)]).toBe(b[sig(A)]); // Emser → same id on both
    expect(a[sig(B)]).toBe(b[sig(B)]); // Daltile → same id on both
    expect(a[sig(A)]).not.toBe(a[sig(B)]); // distinct stops → distinct ids
    expect(devA).toHaveLength(2);
    expect(devB).toHaveLength(2);
  });

  it("never drops entries; preserves count", () => {
    const out = dedupeIds([del({ id: "Z" }), del({ id: "Z" }), del({ id: "Z" }), del({ id: "u" })]);
    expect(out).toHaveLength(4);
  });

  it("re-stamps null ids deterministically without dropping them", () => {
    const out = dedupeIds([del({ id: null, customer: "A" }), del({ id: null, customer: "B" })]);
    expect(out).toHaveLength(2);
    expect(out.every((e) => e.id != null)).toBe(true);
    expect(out[0].id).not.toBe(out[1].id);
  });

  it("identical duplicates get distinct ids with an order-invariant id-set", () => {
    const D = { id: "Y", customer: "Foo", stop: "Bar", addr: "1 St", stopType: "delivery", driverId: 3, loadNum: 1 };
    const r1 = dedupeIds([{ ...D }, { ...D }]).map((e) => e.id).sort();
    const r2 = dedupeIds([{ ...D }, { ...D }]).map((e) => e.id).sort();
    expect(r1).toEqual(r2);
    expect(r1[0]).not.toBe(r1[1]);
  });
});

/* ====================================================================== */
describe("dedupeAutoPickups — never touches deliveries", () => {
  it("keeps every delivery, even identical-looking ones", () => {
    const a = del({ id: "1" }), b = del({ id: "2", customer: "Cust", stop: "Stop" });
    expect(dedupeAutoPickups([a, b])).toHaveLength(2);
  });
  it("drops unassigned (driverId 0) auto-pickups", () => {
    const out = dedupeAutoPickups([del({ id: "d" }), pu({ id: "p", driverId: 0 })]);
    expect(out.map((e) => e.id)).toEqual(["d"]);
  });
  it("collapses duplicate auto-pickups by (customer, stop, driverId, loadNum) but keeps manual pickups", () => {
    const out = dedupeAutoPickups([
      pu({ id: "p1", customer: "Emser", stop: "Emser - Norcross", driverId: 5, loadNum: 1 }),
      pu({ id: "p2", customer: "Emser", stop: "Emser - Norcross", driverId: 5, loadNum: 1 }),
      pu({ id: "p3", customer: "Emser", stop: "Emser - Norcross", driverId: 5, loadNum: 1, manualPickup: true }),
    ]);
    expect(out.map((e) => e.id).sort()).toEqual(["p1", "p3"]); // p2 collapsed, manual kept
  });
});

/* ====================================================================== */
describe("sanitizeEntry", () => {
  it("returns null only for non-objects", () => {
    expect(sanitizeEntry(null)).toBeNull();
    expect(sanitizeEntry("x")).toBeNull();
    expect(sanitizeEntry(del())).not.toBeNull();
  });
  it("never drops a valid delivery and preserves its id", () => {
    const e = del({ id: "keep-me", weight: "not-a-number" });
    const s = sanitizeEntry(e);
    expect(s.id).toBe("keep-me");
    expect(s.weight).toBe(0); // coerced, not dropped
    expect(s.stopType).toBe("delivery");
  });
});

/* ====================================================================== */
describe("_mergeEntryDispatcher / _mergeEntryDriver", () => {
  it("dispatcher: local wins on dispatcher fields, FB wins on driver-stamped, status forward-only", () => {
    const local = del({ id: "1", baseRate: 200, status: "", instructions: "new" });
    const fb = del({ id: "1", baseRate: 100, status: "departed", arrivedAt: "9:00" });
    const out = _mergeEntryDispatcher(local, fb);
    expect(out).toBeTruthy();
    expect(out.baseRate).toBe(200); // dispatcher field: local wins
    expect(out.status).toBe("departed"); // driver field, forward-only: FB wins
    expect(out.arrivedAt).toBe("9:00"); // never-clobber timestamp from FB
  });
  it("dispatcher merge never returns falsy", () => {
    expect(_mergeEntryDispatcher(del({ id: "1" }), del({ id: "1" }))).toBeTruthy();
  });
  it("driver: status never advances backward (forward-only)", () => {
    const local = del({ id: "1", status: "departed" });
    const fb = del({ id: "1", status: "arrived" });
    expect(_mergeEntryDriver(local, fb).status).toBe("departed");
    // and the reverse: FB ahead of local stays ahead
    expect(_mergeEntryDriver(del({ id: "1", status: "arrived" }), del({ id: "1", status: "departed" })).status).toBe("departed");
  });
  it("driver: photos are unioned, not overwritten (concurrent uploads survive)", () => {
    const local = del({ id: "1", photos: ["https://a", "https://b"] });
    const fb = del({ id: "1", photos: ["https://a", "https://c"] });
    expect(_mergeEntryDriver(local, fb).photos.sort()).toEqual(["https://a", "https://b", "https://c"]);
  });
});

/* ====================================================================== */
describe("buildMergedEntries — multi-writer reconciliation (the core)", () => {
  it("dispatcher: deliveries present only in local (debounced, not yet in FB) are PRESERVED", () => {
    // This is the original 'disappearing deliveries' class.
    const d1 = del({ id: "d1" }), d2 = del({ id: "d2" });
    const out = buildMergedEntries([], [d1, d2], { isDriver: false, callerDriverId: 0 });
    expect(out).toHaveLength(2);
    expect(hasStop(out, d1) && hasStop(out, d2)).toBe(true);
  });

  it("dispatcher: a concurrent writer's FB-only delivery is appended (kept)", () => {
    const d1 = del({ id: "d1" }), d2 = del({ id: "d2" });
    const out = buildMergedEntries([d1, d2], [d1], { isDriver: false, callerDriverId: 0 });
    expect(out.map((e) => e.id).sort()).toEqual(["d1", "d2"]);
  });

  it("dispatcher: a tombstoned delete is NOT resurrected by the FB-only append", () => {
    const d1 = del({ id: "d1" }), d2 = del({ id: "d2" });
    const out = buildMergedEntries([d1, d2], [d1], { isDriver: false, callerDriverId: 0, deletedIds: ["d2"] });
    expect(out.map((e) => e.id)).toEqual(["d1"]);
  });

  it("dispatcher: never drops a local delivery even when FB lacks it", () => {
    const out = buildMergedEntries([], [del({ id: "x" })], { isDriver: false, callerDriverId: 0 });
    expect(out.map((e) => e.id)).toEqual(["x"]);
  });

  it("driver: does NOT resurrect its own stop the dispatcher deleted (audit HIGH residual fix)", () => {
    // Driver holds own stop locally; FB no longer has it => dispatcher deleted it.
    const own = del({ id: "own", driverId: 5, status: "departed" });
    const out = buildMergedEntries([], [own], { isDriver: true, callerDriverId: 5 });
    expect(out).toHaveLength(0);
  });

  it("driver: keeps its own stop and merges driver-stamped fields when FB still has it", () => {
    const localOwn = del({ id: "own", driverId: 5, status: "departed" });
    const fbOwn = del({ id: "own", driverId: 5, status: "arrived", baseRate: 150 });
    const out = buildMergedEntries([fbOwn], [localOwn], { isDriver: true, callerDriverId: 5 });
    expect(out).toHaveLength(1);
    expect(out[0].status).toBe("departed"); // driver field forward-only
    expect(out[0].baseRate).toBe(150); // dispatcher field from FB
  });

  it("driver: another driver's stop takes FB's version and never resurrects a dispatcher delete", () => {
    const other = del({ id: "o", driverId: 7 });
    // FB still has it -> keep FB version
    expect(buildMergedEntries([other], [other], { isDriver: true, callerDriverId: 5 }).map((e) => e.id)).toEqual(["o"]);
    // FB dropped it (dispatcher deleted) -> driver drops it
    expect(buildMergedEntries([], [other], { isDriver: true, callerDriverId: 5 })).toHaveLength(0);
  });

  it("collapses duplicate auto-pickups produced by two writers", () => {
    const d = del({ id: "d", customer: "Emser", stop: "Emser - Roswell", driverId: 5 });
    const localPU = pu({ id: "p_local", customer: "Emser", stop: "Emser - Norcross", driverId: 5, loadNum: 1 });
    const fbPU = pu({ id: "p_fb", customer: "Emser", stop: "Emser - Norcross", driverId: 5, loadNum: 1 });
    const out = buildMergedEntries([d, fbPU], [d, localPU], { isDriver: false, callerDriverId: 0 });
    const pickups = out.filter((e) => e.stopType === "pickup");
    expect(pickups).toHaveLength(1); // duplicate auto-pickups collapsed
    expect(out.filter((e) => e.stopType === "delivery")).toHaveLength(1); // delivery untouched
  });

  it("legacy colliding ids on two devices (different order) merge without ghosts or loss", () => {
    // The audit's divergent-order scenario, end to end through the save merge.
    const A = { id: "X", customer: "Emser", stop: "Norcross", addr: "100 Main", stopType: "delivery", driverId: 5, loadNum: 1, photos: [] };
    const B = { id: "X", customer: "Daltile", stop: "Kennesaw", addr: "200 Oak", stopType: "delivery", driverId: 7, loadNum: 1, photos: [] };
    const fb = [{ ...A }, { ...B }];          // FB order
    const local = [{ ...B }, { ...A }];       // dispatcher manual order
    const out = buildMergedEntries(fb, local, { isDriver: false, callerDriverId: 0 });
    expect(out).toHaveLength(2);               // old code produced 3 (a ghost)
    expect(hasStop(out, A) && hasStop(out, B)).toBe(true); // both real stops survive
    expect(new Set(out.map((e) => e.id)).size).toBe(2);    // ids unique, no cross-merge
  });

  it("empty local against populated FB keeps all FB entries (no wipe at the merge layer)", () => {
    const out = buildMergedEntries([del({ id: "a" }), del({ id: "b" })], [], { isDriver: false, callerDriverId: 0 });
    expect(out.map((e) => e.id).sort()).toEqual(["a", "b"]);
  });
});

describe("regression: planned → delivered → reverted-to-Unassigned (the production incident)", () => {
  // Dispatcher assigned Idlewood/Floorworx to Trevor (driverId 5). A stale
  // Firebase echo for today still has them at driverId 0. The guarded
  // dispatcher merge MUST keep the local assignment. The DEPLOYED v3.14.2
  // prev-week handler blind-overwrites local with raw FB (updated[lk]=entries),
  // throwing the assignment away — that is the bug that put delivered stops
  // back in the Unassigned pile. _mergeEntryDispatcher never touches driverId,
  // so the guarded path preserves it.
  it("keeps the dispatcher's driver assignment when a stale FB copy says driverId 0", () => {
    const localAssigned = del({ id: "idlewood", customer: "Idlewood", driverId: 5 });
    const fbStaleUnassigned = del({ id: "idlewood", customer: "Idlewood", driverId: 0 });
    const out = buildMergedEntries([fbStaleUnassigned], [localAssigned], { isDriver: false, callerDriverId: 0 });
    expect(out).toHaveLength(1);
    expect(out[0].driverId).toBe(5); // preserved, NOT reverted to Unassigned
  });

  it("a driver completing the pickup does not drag their deliveries back to Unassigned", () => {
    /* Realistic shape: an auto-pickup's customer matches its deliveries' customer
       (rebuildPickupsFor derives it that way); Idlewood/Floorworx are STOPS. */
    const puDone = pu({ id: "pu", customer: "Emser", stop: "Emser - Norcross", driverId: 5, status: "departed" });
    const d1 = del({ id: "idlewood", customer: "Emser", stop: "Idlewood - Norcross", driverId: 5 });
    const d2 = del({ id: "floorworx", customer: "Emser", stop: "Floorworx - Norcross", driverId: 5 });
    const out = buildMergedEntries([puDone, d1, d2], [puDone, d1, d2], { isDriver: true, callerDriverId: 5 });
    expect(out.filter((e) => e.driverId === 0)).toHaveLength(0); // nothing fell back to Unassigned
    expect(out.find((e) => e.id === "pu").status).toBe("departed"); // pickup stays done
  });
});

/* ====================================================================== */
describe("entrySig — content identity", () => {
  it("is independent of id and addr (the volatile / normalized fields)", () => {
    const a = del({ id: "1", customer: "Emser", stop: "Roswell", addr: "100 Main", driverId: 5, loadNum: 1 });
    const b = del({ id: "2", customer: "Emser", stop: "Roswell", addr: "DIFFERENT", driverId: 5, loadNum: 1 });
    expect(entrySig(a)).toBe(entrySig(b)); // same physical stop identity
  });
  it("DISTINGUISHES different loads to the same customer+stop (prevents merge-collapse)", () => {
    const load1 = del({ customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 1 });
    const load2 = del({ customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 2 });
    expect(entrySig(load1)).not.toBe(entrySig(load2));
  });
  it("distinguishes pickup from delivery for the same customer/stop", () => {
    expect(entrySig(del({ customer: "Emser", stop: "Norcross" }))).not.toBe(entrySig(pu({ customer: "Emser", stop: "Norcross" })));
  });
  it("returns '' for non-objects (never throws)", () => {
    expect(entrySig(null)).toBe("");
    expect(entrySig("x")).toBe("");
  });
});

/* ====================================================================== */
describe("makeTombFilter — content-aware tombstone matching", () => {
  it("legacy id-only forms (array/Set of bare ids) match by id regardless of content", () => {
    const f = makeTombFilter(["d1"]);
    expect(f.has(del({ id: "d1", customer: "Anything" }))).toBe(true);
    expect(f.has(del({ id: "d2" }))).toBe(false);
    expect(makeTombFilter(new Set(["d1"])).has(del({ id: "d1" }))).toBe(true);
  });
  it("a signature tombstone suppresses ONLY the matching content under that id", () => {
    const deleted = del({ id: "X", customer: "Emser", stop: "Roswell", stopType: "delivery" });
    const f = makeTombFilter(new Map([[deleted.id, entrySig(deleted)]]));
    // same id, DIFFERENT content (an unrelated stop that merely shares the id) -> NOT tombstoned
    expect(f.has(del({ id: "X", customer: "Daltile", stop: "Kennesaw" }))).toBe(false);
    // same id, same content (only the excluded addr differs) -> tombstoned
    expect(f.has(del({ id: "X", customer: "Emser", stop: "Roswell", stopType: "delivery", addr: "elsewhere" }))).toBe(true);
  });
  it("accepts an array of {id, sig} objects", () => {
    const f = makeTombFilter([{ id: "a", sig: entrySig(del({ customer: "C", stop: "S" })) }]);
    expect(f.has(del({ id: "a", customer: "C", stop: "S" }))).toBe(true);
    expect(f.has(del({ id: "a", customer: "OTHER", stop: "S" }))).toBe(false);
  });
  it("empty / null collection matches nothing", () => {
    expect(makeTombFilter(null).size).toBe(0);
    expect(makeTombFilter(null).has(del({ id: "x" }))).toBe(false);
  });
});

/* ====================================================================== */
describe("vanishedAutoPickups — only auto-pickups are tombstone-eligible (delivery-loss root cause)", () => {
  const surviving = (arr) => arr;
  it("NEVER returns a vanished delivery (the exact bug that erased real deliveries)", () => {
    const before = [del({ id: "d1" }), del({ id: "d2" }), pu({ id: "p1", manualPickup: false })];
    const after = [del({ id: "d1" })]; // d2 (a delivery) and p1 vanished
    const out = vanishedAutoPickups(before, after);
    expect(out.map((e) => e.id)).toEqual(["p1"]); // only the auto-pickup, NOT the delivery d2
  });
  it("never returns a manual pickup", () => {
    const before = [pu({ id: "pm", manualPickup: true }), pu({ id: "pa", manualPickup: false })];
    const out = vanishedAutoPickups(before, []);
    expect(out.map((e) => e.id)).toEqual(["pa"]);
  });
  it("returns [] when nothing vanished", () => {
    const before = [del({ id: "d1" }), pu({ id: "p1" })];
    expect(vanishedAutoPickups(before, before)).toEqual([]);
  });
});

/* ====================================================================== */
describe("orderByIds — reorder without dropping (twin-safe)", () => {
  it("orders by the id list and appends leftovers in original order", () => {
    const items = [del({ id: "a" }), del({ id: "b" }), del({ id: "c" })];
    expect(orderByIds(items, ["c", "a"]).map((e) => e.id)).toEqual(["c", "a", "b"]);
  });
  it("NEVER drops a colliding-id twin (the .find/.includes bug)", () => {
    // Two deliveries share id 'x'; the route names 'x' once. Old code
    // (ids.map(find) + filter(!includes)) returned one twin and excluded BOTH,
    // dropping the second. orderByIds conserves the full multiset.
    const items = [del({ id: "x", customer: "A" }), del({ id: "x", customer: "B" }), del({ id: "y" })];
    const out = orderByIds(items, ["y", "x"]);
    expect(out).toHaveLength(3); // nothing dropped
    expect(out.filter((e) => e.id === "x")).toHaveLength(2); // both twins survive
  });
  it("keeps entries not named in the order list (e.g. pickups never in the route)", () => {
    const items = [del({ id: "d" }), pu({ id: "p" })];
    expect(orderByIds(items, ["d"]).map((e) => e.id)).toEqual(["d", "p"]);
  });
});

/* ====================================================================== */
describe("buildMergedEntries — content-aware tombstones never erase the wrong delivery", () => {
  it("a tombstone for one stop does NOT suppress a different live FB delivery that merely shares its id", () => {
    // THE production symptom: dispatcher deletes stop A (id 'X'); a different real
    // delivery B happens to carry id 'X' in Firebase (legacy collision / synthetic
    // id reuse). Old id-only tombstone erased B from the board while it stayed on
    // the driver's card. Content-aware tombstones keep B.
    const A = del({ id: "X", customer: "Idlewood", stop: "Mableton", stopType: "delivery" });
    const B = del({ id: "X", customer: "Advanced Flooring Design", stop: "Mableton", stopType: "delivery", driverId: 5 });
    const out = buildMergedEntries([B], [], {
      isDriver: false,
      callerDriverId: 0,
      deletedIds: new Map([[A.id, entrySig(A)]]),
    });
    expect(out.some((e) => e.customer === "Advanced Flooring Design")).toBe(true); // B survives
  });

  it("an exact (id+signature) tombstone still honors a real delete", () => {
    const A = del({ id: "X", customer: "Idlewood", stop: "Mableton", stopType: "delivery" });
    const out = buildMergedEntries([A], [], {
      isDriver: false,
      callerDriverId: 0,
      deletedIds: new Map([[A.id, entrySig(A)]]),
    });
    expect(out).toHaveLength(0); // genuinely deleted -> stays deleted
  });
});

/* ====================================================================== */
describe("buildMergedEntries — id-divergence resilience (signature fallback)", () => {
  it("driver: keeps a departed stamp even when the stop's id diverged from FB's copy", () => {
    // Driver stamped a delivery 'departed'; the same physical stop carries a
    // different (legacy-collision-re-stamped) id in Firebase. Old code hit
    // `if(!fbE)return null`, dropped the local copy, and the FB-only append
    // re-added the un-stamped FB copy -> the driver's 'departed' was lost.
    const local = del({ id: "local_id", customer: "Emser", stop: "Norcross", driverId: 5, status: "departed" });
    const fb = del({ id: "fb_id", customer: "Emser", stop: "Norcross", driverId: 5, status: "" });
    const out = buildMergedEntries([fb], [local], { isDriver: true, callerDriverId: 5 });
    expect(out).toHaveLength(1); // reconciled by content, not duplicated
    expect(out[0].status).toBe("departed"); // stamp survives
  });

  it("dispatcher: an edit that diverges the id does NOT create a ghost duplicate", () => {
    const fb = del({ id: "Y", customer: "Foo", stop: "Bar", stopType: "delivery", driverId: 3 });
    const localEdited = del({ id: "Y2", customer: "Foo", stop: "Bar", stopType: "delivery", driverId: 3, addr: "1 St SUITE B" });
    const out = buildMergedEntries([fb], [localEdited], { isDriver: false, callerDriverId: 0 });
    expect(out).toHaveLength(1); // one physical stop, not two (no ghost)
  });

  it("does NOT collapse two different LOADS to the same customer+stop (the regression in the first cut of this fix)", () => {
    // FB has load 1; local has a DIFFERENT stop — load 2 — to the same
    // customer+stop, with a different id. A naive customer|stop signature merged
    // them and dropped load 1. Including loadNum in the signature keeps both.
    const fbLoad1 = del({ id: "f1", customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 1, baseRate: 300 });
    const localLoad2 = del({ id: "l2", customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 2, baseRate: 400 });
    const out = buildMergedEntries([fbLoad1], [localLoad2], { isDriver: false, callerDriverId: 0 });
    expect(out).toHaveLength(2); // BOTH loads survive
    expect(out.some((e) => e.loadNum === 1 && e.baseRate === 300)).toBe(true);
    expect(out.some((e) => e.loadNum === 2 && e.baseRate === 400)).toBe(true);
  });

  it("driver: a diverged-id stop reconciles to its OWN load, not a sibling load", () => {
    // FB holds load 1 and load 2 of the same customer+stop. The driver's local
    // copy of load 2 has a diverged id (legacy collision). It must reconcile to
    // FB's load 2 (carrying its stamp), NOT collapse into load 1 — and load 1
    // must stay intact.
    const fbLoad1 = del({ id: "f1", customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 1, baseRate: 300 });
    const fbLoad2 = del({ id: "f2", customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 2, baseRate: 400 });
    const localLoad2Diverged = del({ id: "diverged", customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 2, baseRate: 400, status: "departed" });
    const out = buildMergedEntries([fbLoad1, fbLoad2], [localLoad2Diverged], { isDriver: true, callerDriverId: 5 });
    expect(out).toHaveLength(2); // both loads survive
    expect(out.find((e) => e.loadNum === 2).status).toBe("departed"); // stamp landed on load 2
    expect(out.some((e) => e.loadNum === 1 && e.baseRate === 300)).toBe(true); // load 1 intact
  });

  it("signature fallback is skipped for true twins (same id-basis on BOTH sides)", () => {
    // Two byte-identical deliveries in FB (true twins, distinct ids) plus a local
    // orphan of the same content: ambiguous, so no silent merge — everything is
    // conserved (the safety net keeps all FB deliveries).
    const fb1 = del({ id: "f1", customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 1 });
    const fb2 = del({ id: "f2", customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 1 });
    const localOrphan = del({ id: "lo", customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 1, status: "departed" });
    const out = buildMergedEntries([fb1, fb2], [localOrphan], { isDriver: false, callerDriverId: 0 });
    expect(out.filter((e) => e.customer === "Emser").length).toBeGreaterThanOrEqual(2); // no FB delivery lost
    expect(out.some((e) => e.id === "f1")).toBe(true);
    expect(out.some((e) => e.id === "f2")).toBe(true);
  });
});

/* ====================================================================== */
describe("buildMergedEntries — delivery-conservation safety net", () => {
  it("never drops an FB delivery that isn't explicitly tombstoned, even when local lacks it", () => {
    const out = buildMergedEntries(
      [del({ id: "a" }), del({ id: "b" }), del({ id: "c" })],
      [del({ id: "a" })],
      { isDriver: false, callerDriverId: 0 }
    );
    expect(out.map((e) => e.id).sort()).toEqual(["a", "b", "c"]); // b and c preserved
  });

  it("the exact screenshot scenario: an FB-only round-trip delivery survives a concurrent delete elsewhere", () => {
    // Trevor's Emser pickup + its round-trip delivery 'Advanced Flooring Design –
    // Mableton' exist in Firebase but are NOT in the caller's local copy (e.g.
    // another writer just added them). The dispatcher concurrently deletes an
    // UNRELATED stop whose id collides with the delivery's id. The delivery must
    // survive — this genuinely exercises the FB-only append + safety net.
    const puEmser = pu({ id: "pu_emser", customer: "Emser Tile", stop: "Emser - Roswell", driverId: 5 });
    const roundTripDel = del({ id: "shared", customer: "Emser Tile", stop: "Advanced Flooring Design - Mableton", driverId: 5 });
    const unrelatedDeleted = del({ id: "shared", customer: "Something Else", stop: "Decatur" });
    const out = buildMergedEntries(
      [puEmser, roundTripDel], // in Firebase
      [], // NOT in local
      { isDriver: false, callerDriverId: 0, deletedIds: new Map([["shared", entrySig(unrelatedDeleted)]]) }
    );
    expect(out.some((e) => e.stop === "Advanced Flooring Design - Mableton" && e.stopType === "delivery")).toBe(true);
    expect(out.some((e) => e.stopType === "pickup")).toBe(true);
  });

  it("reproduces the ORIGINAL bug at the merge layer: an id-only tombstone erased an unrelated delivery", () => {
    // Before the fix, tombstones were a plain Set of ids; deleting stop A (id 'X')
    // suppressed ANY incoming entry with id 'X', including a different live
    // delivery B. With an id-only tombstone this STILL matches by id (legacy
    // behavior) — the production fix is that real tombstones now always carry a
    // signature (Map), so this id-only path is no longer reachable from the app.
    const B = del({ id: "X", customer: "Advanced Flooring Design", stop: "Mableton", driverId: 5 });
    const erased = buildMergedEntries([B], [], { isDriver: false, callerDriverId: 0, deletedIds: new Set(["X"]) });
    expect(erased.some((e) => e.customer === "Advanced Flooring Design")).toBe(false); // id-only Set erases (old contract)
    // The PRODUCTION path uses a signature Map, which does NOT erase B:
    const A = del({ id: "X", customer: "Idlewood", stop: "Decatur", driverId: 5 });
    const safe = buildMergedEntries([B], [], { isDriver: false, callerDriverId: 0, deletedIds: new Map([["X", entrySig(A)]]) });
    expect(safe.some((e) => e.customer === "Advanced Flooring Design")).toBe(true);
  });
});

/* ====================================================================== */
describe("reapOrphanAutoPickups — auto-pickups are derived data (orphan self-heal)", () => {
  it("drops an auto-pickup whose driver has NO deliveries for that customer (the Brent orphan)", () => {
    const orphan = pu({ customer: "Emser Tile", stop: "Emser - Norcross", driverId: 1, note: "Load order: Idlewood, Floorworx" });
    const otherCustDel = del({ customer: "Florida Tile", driverId: 1 });
    const out = reapOrphanAutoPickups([orphan, otherCustDel]);
    expect(out).toHaveLength(1);
    expect(out[0].customer).toBe("Florida Tile");
  });

  it("keeps an auto-pickup backed by a same-customer delivery on the same driver+load", () => {
    const p1 = pu({ customer: "Emser Tile", stop: "Emser - Roswell", driverId: 2, loadNum: 2 });
    const d1 = del({ customer: "Emser Tile", stop: "D3 - Woodstock", driverId: 2, loadNum: 2 });
    expect(reapOrphanAutoPickups([p1, d1])).toHaveLength(2);
  });

  it("is load-scoped: deliveries on Load 2 do not save a Load 1 pickup (the setLoadNum ghost)", () => {
    const stale = pu({ customer: "Emser Tile", stop: "Emser - Norcross", driverId: 2, loadNum: 1 });
    const fresh = pu({ customer: "Emser Tile", stop: "Emser - Norcross", driverId: 2, loadNum: 2 });
    const d1 = del({ customer: "Emser Tile", driverId: 2, loadNum: 2 });
    const out = reapOrphanAutoPickups([stale, fresh, d1]);
    expect(out).toHaveLength(2);
    expect(out.filter((e) => e.stopType === "pickup")[0].loadNum).toBe(2);
  });

  it("is driver-scoped: another driver's delivery does not save the pickup", () => {
    const orphan = pu({ customer: "Emser Tile", driverId: 1 });
    const d1 = del({ customer: "Emser Tile", driverId: 2 });
    expect(reapOrphanAutoPickups([orphan, d1])).toHaveLength(1);
  });

  it("NEVER touches manual pickups or deliveries", () => {
    const manual = pu({ customer: "Florida Tile", driverId: 0, manualPickup: true });
    const uDel = del({ customer: "Caliber", driverId: 0 });
    const out = reapOrphanAutoPickups([manual, uDel]);
    expect(out).toHaveLength(2);
  });

  it("returns the same reference when nothing is reaped", () => {
    const arr = [del(), pu()];
    expect(reapOrphanAutoPickups(arr)).toBe(arr);
  });

  it("buildMergedEntries self-heals: an orphan pickup persisted in Firebase is dropped at merge", () => {
    const orphan = pu({ id: "PU1", customer: "Emser Tile", stop: "Emser - Norcross", driverId: 1 });
    const out = buildMergedEntries([orphan], [orphan], { isDriver: false, callerDriverId: 0 });
    expect(out).toHaveLength(0);
  });

  it("buildMergedEntries keeps a backed pickup through the merge", () => {
    const p1 = pu({ id: "PU1", customer: "Emser Tile", stop: "Emser - Norcross", driverId: 1 });
    const d1 = del({ id: "D1", customer: "Emser Tile", driverId: 1 });
    const out = buildMergedEntries([p1, d1], [p1, d1], { isDriver: false, callerDriverId: 0 });
    expect(out).toHaveLength(2);
  });

  it("a delivery rescued by the conservation safety net keeps its pickup alive", () => {
    const p1 = pu({ id: "PU1", customer: "Emser Tile", stop: "Emser - Norcross", driverId: 1 });
    const d1 = del({ id: "D1", customer: "Emser Tile", driverId: 1 });
    /* local lost the delivery (bug) but kept the pickup; FB still has both */
    const out = buildMergedEntries([p1, d1], [p1], { isDriver: false, callerDriverId: 0 });
    expect(out.some((e) => e.id === "D1")).toBe(true);
    expect(out.some((e) => e.id === "PU1")).toBe(true);
  });
});

/* ====================================================================== */
/* Multi-source auto-pickup dock orphans — the "pickup card with no delivery"
   production bug. Emser/Traditions ship from >1 dock, so one (customer,driver,
   load) can carry a pickup PER dock. The old reaper keyed on (customer,driver,
   load) only, so a still-present delivery at ANOTHER dock kept an orphaned
   pickup alive at a dock whose delivery was moved/deleted. These exercise the
   location-aware reaper across the real data shapes. */
describe("reapOrphanAutoPickups — multi-source dock matching (pickup-without-delivery bug)", () => {
  // Mirrors App.jsx: MULTI_PICKUP membership + _normLoc.
  const MS = {
    multiSource: (c) => c === "Emser Tile" || c === "Traditions in Tile",
    normLoc: (v) => {
      if (!v || typeof v !== "string") return "";
      const p = v.split(/\s+[-–—]\s+/);
      return p[p.length - 1].trim().toLowerCase();
    },
  };
  // The screenshot: Trevor (5) Load 2 has a Norcross pickup whose delivery
  // (American Flooring Services) is gone, plus a Roswell pickup+delivery still live.
  const norcrossPU = pu({ id: "puN", customer: "Emser Tile", stop: "Emser - Norcross", pickupFrom: "Emser - Norcross", driverId: 5, loadNum: 2 });
  const roswellPU  = pu({ id: "puR", customer: "Emser Tile", stop: "Emser - Roswell",  pickupFrom: "Emser - Roswell",  driverId: 5, loadNum: 2 });
  const roswellDel = del({ id: "dR", customer: "Emser Tile", stop: "American Flooring Services", pickupFrom: "Emser - Roswell", driverId: 5, loadNum: 2 });

  it("reaps the orphaned dock pickup while a delivery at another dock survives", () => {
    const out = reapOrphanAutoPickups([norcrossPU, roswellPU, roswellDel], MS);
    expect(out.find((e) => e.id === "puN")).toBeUndefined(); // orphan Norcross pickup gone
    expect(out.find((e) => e.id === "puR")).toBeTruthy();     // legit Roswell pickup kept
    expect(out.find((e) => e.id === "dR")).toBeTruthy();      // delivery untouched
  });

  it("keeps a multi-source pickup that has a matching same-dock delivery", () => {
    const del2 = del({ id: "dN", customer: "Emser Tile", stop: "Britts", pickupFrom: "Emser - Norcross", driverId: 5, loadNum: 2 });
    expect(reapOrphanAutoPickups([norcrossPU, del2], MS).some((e) => e.id === "puN")).toBe(true);
  });

  it("still reaps a fully orphaned pickup (no delivery on the load at all)", () => {
    const out = reapOrphanAutoPickups([norcrossPU, del({ id: "x", customer: "Other", driverId: 5, loadNum: 2 })], MS);
    expect(out.find((e) => e.id === "puN")).toBeUndefined();
  });

  it("does NOT over-reap: an ambiguous multi-source delivery (no pickupFrom) covers every dock", () => {
    const ambiguous = del({ id: "dAmb", customer: "Emser Tile", stop: "Somewhere", driverId: 5, loadNum: 2 }); // dock unknown
    expect(reapOrphanAutoPickups([norcrossPU, ambiguous], MS).some((e) => e.id === "puN")).toBe(true);
  });

  it("does NOT over-reap single-source pickups whose delivery has no pickupFrom", () => {
    const p = pu({ id: "pMM", customer: "MM Systems", stop: "MM Systems - Pendergrass", pickupFrom: "MM Systems - Pendergrass", driverId: 5, loadNum: 1 });
    const d = del({ id: "dMM", customer: "MM Systems", stop: "EcoClean", driverId: 5, loadNum: 1 }); // single-source, no pickupFrom
    expect(reapOrphanAutoPickups([p, d], MS).some((e) => e.id === "pMM")).toBe(true);
  });

  it("never reaps a manual pickup, even multi-source with no delivery", () => {
    const man = pu({ id: "pm", customer: "Emser Tile", stop: "Emser - Norcross", pickupFrom: "Emser - Norcross", driverId: 5, loadNum: 2, manualPickup: true });
    expect(reapOrphanAutoPickups([man], MS).some((e) => e.id === "pm")).toBe(true);
  });

  it("is backward-compatible: with no opts it stays location-blind (documents the requirement)", () => {
    const out = reapOrphanAutoPickups([norcrossPU, roswellPU, roswellDel]); // no opts
    expect(out.find((e) => e.id === "puN")).toBeTruthy(); // old behavior: kept
  });

  it("self-heals through the save merge when opts are threaded (buildMergedEntries)", () => {
    const all = [norcrossPU, roswellPU, roswellDel];
    const out = buildMergedEntries(all, all, { isDriver: false, callerDriverId: 0, multiSource: MS.multiSource, normLoc: MS.normLoc });
    expect(out.find((e) => e.id === "puN")).toBeUndefined(); // orphan dropped by the merge
    expect(out.find((e) => e.id === "puR")).toBeTruthy();
    expect(out.find((e) => e.id === "dR")).toBeTruthy();
  });
});

/* ====================================================================== */
/* Ghost duplicate deliveries — the "one EcoClean but weekly shows two" bug.
   A reassign race leaves the same order present both assigned and unassigned;
   entrySig keys on driverId so the merge never reconciles them and computeDay
   double-bills. dedupeGhostDeliveries drops the unassigned twin — narrowly, so
   it can't remove distinct orders or split halves. */
describe("dedupeGhostDeliveries — collapse the unassigned twin of an assigned delivery", () => {
  it("drops a driverId-0 delivery when an assigned copy (same customer/stop/load/rate) exists", () => {
    const assigned = del({ id: "A", customer: "MM Systems", stop: "EcoClean", driverId: 5, loadNum: 1, baseRate: 225 });
    const ghost    = del({ id: "B", customer: "MM Systems", stop: "EcoClean", driverId: 0, loadNum: 1, baseRate: 225 });
    const out = dedupeGhostDeliveries([assigned, ghost]);
    expect(out.map((e) => e.id)).toEqual(["A"]); // Trevor's kept, ghost gone
  });

  it("keeps two DISTINCT routed orders (both assigned) — never collapses assigned copies", () => {
    const a = del({ id: "A", customer: "MM Systems", stop: "EcoClean", driverId: 5, loadNum: 1, baseRate: 225 });
    const b = del({ id: "B", customer: "MM Systems", stop: "EcoClean", driverId: 7, loadNum: 1, baseRate: 225 });
    expect(dedupeGhostDeliveries([a, b]).map((e) => e.id).sort()).toEqual(["A", "B"]);
  });

  it("keeps a genuine lone unassigned order (no assigned twin)", () => {
    const lone = del({ id: "A", customer: "MM Systems", stop: "EcoClean", driverId: 0, loadNum: 1, baseRate: 225 });
    expect(dedupeGhostDeliveries([lone]).map((e) => e.id)).toEqual(["A"]);
  });

  it("keeps a split's load-2 half (driverId 0, baseRate 0, wasSplit) alongside the full assigned stop", () => {
    const full = del({ id: "A", customer: "MM Systems", stop: "EcoClean", driverId: 5, loadNum: 1, baseRate: 225 });
    const half = del({ id: "B", customer: "MM Systems", stop: "EcoClean", driverId: 0, loadNum: 2, baseRate: 0, wasSplit: true });
    expect(dedupeGhostDeliveries([full, half]).map((e) => e.id).sort()).toEqual(["A", "B"]);
  });

  it("keeps an unassigned order at a DIFFERENT rate (a distinct order, not a ghost)", () => {
    const assigned = del({ id: "A", customer: "MM Systems", stop: "EcoClean", driverId: 5, loadNum: 1, baseRate: 225 });
    const other    = del({ id: "B", customer: "MM Systems", stop: "EcoClean", driverId: 0, loadNum: 1, baseRate: 180 });
    expect(dedupeGhostDeliveries([assigned, other]).map((e) => e.id).sort()).toEqual(["A", "B"]);
  });

  it("never touches pickups or manual pickups", () => {
    const p = pu({ id: "P", customer: "MM Systems", stop: "MM Systems - Pendergrass", driverId: 0 });
    const d = del({ id: "A", customer: "MM Systems", stop: "MM Systems - Pendergrass", driverId: 5, baseRate: 225 });
    expect(dedupeGhostDeliveries([p, d]).some((e) => e.id === "P")).toBe(true);
  });

  it("reconciles the reassign race through the save merge (buildMergedEntries)", () => {
    // Dispatcher reassigned EcoClean unassigned -> Trevor locally; a stale FB
    // snapshot still has it unassigned under a diverged id. Old merge kept both.
    const localAssigned = del({ id: "X", customer: "MM Systems", stop: "EcoClean", driverId: 5, loadNum: 1, baseRate: 225 });
    const fbStale       = del({ id: "Y", customer: "MM Systems", stop: "EcoClean", driverId: 0, loadNum: 1, baseRate: 225 });
    const out = buildMergedEntries([fbStale], [localAssigned], { isDriver: false, callerDriverId: 0 });
    const ecoCleans = out.filter((e) => e.stop === "EcoClean");
    expect(ecoCleans).toHaveLength(1);       // not two
    expect(ecoCleans[0].driverId).toBe(5);   // the assigned one won
  });
});

/* ====================================================================== */
/* dedupeDeliveries — collapse the same order shown as two rows (the BEC
   duplicate / split-churn / delete-resurrection family). */
describe("dedupeDeliveries — collapse duplicate deliveries (Phase 1)", () => {
  const bec = (o = {}) => del({ customer: "BEC", stop: "BEC - Alpharetta", addr: "1000 Union Center Dr", driverId: 2, loadNum: 2, weight: 8753, baseRate: 175, ...o });

  it("collapses the exact production case (same order, one copy diverged on pickupDueBy)", () => {
    const a = bec({ id: "A" });
    const b = bec({ id: "B", pickupDueBy: "After 9:30 AM" }); // diverged copy
    const out = dedupeDeliveries([a, b]);
    expect(out).toHaveLength(1);
    expect(out[0].pickupDueBy).toBe("After 9:30 AM"); // the diverged field is preserved on the survivor
  });

  it("collapses two re-weighted split halves that drifted onto the SAME load", () => {
    const a = bec({ id: "A", wasSplit: true });
    const b = bec({ id: "B", wasSplit: true });
    expect(dedupeDeliveries([a, b])).toHaveLength(1);
  });

  it("NEVER collapses an in-progress split (halves on Load 1 vs Load 2)", () => {
    const l1 = bec({ id: "A", loadNum: 1, weight: 5000, baseRate: 175, wasSplit: true });
    const l2 = bec({ id: "B", loadNum: 2, weight: 3753, baseRate: 0, wasSplit: true });
    expect(dedupeDeliveries([l1, l2])).toHaveLength(2);
  });

  it("NEVER merges two genuinely-distinct orders (different weight or rate)", () => {
    expect(dedupeDeliveries([bec({ id: "A", weight: 8753 }), bec({ id: "B", weight: 4000 })])).toHaveLength(2);
    expect(dedupeDeliveries([bec({ id: "A", baseRate: 175 }), bec({ id: "B", baseRate: 250 })])).toHaveLength(2);
  });

  it("respects an explicit distinct-order signal (different non-empty refNum)", () => {
    expect(dedupeDeliveries([bec({ id: "A", refNum: "PO-1" }), bec({ id: "B", refNum: "PO-2" })])).toHaveLength(2);
  });

  it("preserves the POD: survivor inherits a departed stamp + photo from the dropped copy", () => {
    const pending = bec({ id: "A", status: "pending" });
    const done = bec({ id: "B", status: "departed", departedAt: "8:02 AM", photos: ["https://x/pod.jpg"], signature: "John" });
    const out = dedupeDeliveries([pending, done]);
    expect(out).toHaveLength(1);
    expect(out[0].status).toBe("departed");
    expect(out[0].departedAt).toBe("8:02 AM");
    expect(out[0].photos).toContain("https://x/pod.jpg");
    expect(out[0].signature).toBe("John");
  });

  it("SAFETY: leaves two identical UNWEIGHTED deliveries alone (could be two real line items)", () => {
    const a = bec({ id: "A", weight: 0 });
    const b = bec({ id: "B", weight: 0 });
    expect(dedupeDeliveries([a, b])).toHaveLength(2); // no weight signal, no split lineage -> not merged
  });

  it("collapses unweighted copies when they carry a split lineage", () => {
    const a = bec({ id: "A", weight: 0, wasSplit: true });
    const b = bec({ id: "B", weight: 0, wasSplit: true });
    expect(dedupeDeliveries([a, b])).toHaveLength(1);
  });

  it("leaves pickups and non-duplicates alone", () => {
    const d = bec({ id: "A" });
    const p = pu({ id: "P", customer: "Emser Tile", stop: "Emser - Norcross", driverId: 2 });
    expect(dedupeDeliveries([d, p]).map(e => e.id).sort()).toEqual(["A", "P"]);
  });

  it("persists the collapse through the save merge (buildMergedEntries) — kills the sticky duplicate", () => {
    const a = bec({ id: "A" });
    const b = bec({ id: "B", pickupDueBy: "After 9:30 AM" });
    const out = buildMergedEntries([a, b], [a, b], { isDriver: false, callerDriverId: 0 });
    expect(out.filter(e => e.stop === "BEC - Alpharetta")).toHaveLength(1);
  });
});

/* ====================================================================== */
/* _mergeEntryDispatcher — last-writer-wins so reassigns propagate between
   dispatchers ("I plan on Brent, she doesn't see it"). */
describe("_mergeEntryDispatcher — last-writer-wins on dispatcher fields (Phase 1)", () => {
  it("a reassign made on ANOTHER dispatcher (newer updatedAt) propagates", () => {
    const local = del({ id: "x", driverId: 0, updatedAt: 1000 });      // my stale copy: unassigned
    const fb    = del({ id: "x", driverId: 2, updatedAt: 2000 });      // her newer edit: assigned to Brent
    expect(_mergeEntryDispatcher(local, fb).driverId).toBe(2);          // I now see Brent
  });

  it("a stale FB echo does NOT revert my just-made local assignment", () => {
    const local = del({ id: "x", driverId: 2, updatedAt: 2000 });      // I just assigned to Brent
    const fb    = del({ id: "x", driverId: 0, updatedAt: 1000 });      // stale echo still unassigned
    expect(_mergeEntryDispatcher(local, fb).driverId).toBe(2);          // preserved
  });

  it("a tie (no timestamps) keeps LOCAL — backward compatible", () => {
    const local = del({ id: "x", driverId: 2 });
    const fb    = del({ id: "x", driverId: 0 });
    expect(_mergeEntryDispatcher(local, fb).driverId).toBe(2);
  });

  it("newer remote rate/loadNum win too", () => {
    const local = del({ id: "x", baseRate: 175, loadNum: 1, updatedAt: 1000 });
    const fb    = del({ id: "x", baseRate: 250, loadNum: 2, updatedAt: 2000 });
    const out = _mergeEntryDispatcher(local, fb);
    expect(out.baseRate).toBe(250);
    expect(out.loadNum).toBe(2);
  });

  it("driver progress is NEVER lost even when the remote dispatcher edit wins", () => {
    // Her newer reassign wins the driver field, but my copy has the POD — keep both.
    const local = del({ id: "x", driverId: 2, updatedAt: 1000, status: "departed", departedAt: "8:02 AM", photos: ["https://x/pod.jpg"], signature: "Jane" });
    const fb    = del({ id: "x", driverId: 3, updatedAt: 2000, status: "pending" });
    const out = _mergeEntryDispatcher(local, fb);
    expect(out.driverId).toBe(3);                 // newer dispatcher edit wins the assignment
    expect(out.status).toBe("departed");           // driver progress preserved (forward-only)
    expect(out.departedAt).toBe("8:02 AM");
    expect(out.photos).toContain("https://x/pod.jpg");
    expect(out.signature).toBe("Jane");
  });
});

/* ====================================================================== */
/* Dash-drift duplicate pickups — the "same pickup card 3× on one load" bug.
   The same dock is stored under drifting dash formats; dedupeAutoPickups must
   key on the normalized dock, not the raw stop string. */
describe("dedupeAutoPickups — normalized-dock key collapses dash-drift duplicates", () => {
  const NL = { normLoc: (v) => {
    if (!v || typeof v !== "string") return "";
    const p = v.split(/\s+[-–—]\s+/);
    return p[p.length - 1].trim().toLowerCase();
  } };
  it("collapses the same dock stored under 3 different dash formats", () => {
    const a = pu({ id: "a", customer: "Emser Tile", stop: "Emser - Norcross",       driverId: 5, loadNum: 1 });
    const b = pu({ id: "b", customer: "Emser Tile", stop: "Emser – Norcross",   driverId: 5, loadNum: 1 }); // en-dash
    const c = pu({ id: "c", customer: "Emser Tile", stop: "Emser Tile — Norcross", driverId: 5, loadNum: 1 }); // em-dash + prefix
    const out = dedupeAutoPickups([a, b, c], NL);
    const pickups = out.filter((e) => e.stopType === "pickup");
    expect(pickups).toHaveLength(1); // one dock, one card
  });
  it("keeps genuinely different docks for the same customer (Norcross vs Roswell)", () => {
    const nor = pu({ id: "n", customer: "Emser Tile", stop: "Emser - Norcross", driverId: 5, loadNum: 1 });
    const ros = pu({ id: "r", customer: "Emser Tile", stop: "Emser - Roswell",  driverId: 5, loadNum: 1 });
    expect(dedupeAutoPickups([nor, ros], NL).filter((e) => e.stopType === "pickup")).toHaveLength(2);
  });
  it("prefers pickupFrom over stop when resolving the dock", () => {
    const a = pu({ id: "a", customer: "Emser Tile", stop: "Emser - Norcross", pickupFrom: "Norcross", driverId: 5, loadNum: 1 });
    const b = pu({ id: "b", customer: "Emser Tile", stop: "legacy label",      pickupFrom: "Emser - Norcross", driverId: 5, loadNum: 1 });
    expect(dedupeAutoPickups([a, b], NL).filter((e) => e.stopType === "pickup")).toHaveLength(1);
  });
  it("still keeps distinct loads apart (load 1 vs load 2 same dock)", () => {
    const l1 = pu({ id: "1", customer: "Emser Tile", stop: "Emser - Norcross", driverId: 5, loadNum: 1 });
    const l2 = pu({ id: "2", customer: "Emser Tile", stop: "Emser - Norcross", driverId: 5, loadNum: 2 });
    expect(dedupeAutoPickups([l1, l2], NL).filter((e) => e.stopType === "pickup")).toHaveLength(2);
  });
  it("still drops driver-0 auto-pickups and never touches manual pickups/deliveries", () => {
    const out = dedupeAutoPickups([
      del({ id: "d", customer: "Emser Tile" }),
      pu({ id: "u", customer: "Emser Tile", stop: "Emser - Norcross", driverId: 0, loadNum: 1 }),
      pu({ id: "m", customer: "Emser Tile", stop: "Emser – Norcross", driverId: 5, loadNum: 1, manualPickup: true }),
    ], NL);
    expect(out.some((e) => e.id === "d")).toBe(true);  // delivery kept
    expect(out.some((e) => e.id === "u")).toBe(false); // driver-0 dropped
    expect(out.some((e) => e.id === "m")).toBe(true);  // manual kept
  });
});

/* ====================================================================== */
/* Driver-roster reconciliation — the same driver must be ONE id everywhere,
   and a day's entries must follow their driver when its id changes
   ("I plan on Brent, my dispatcher doesn't see it"). */
describe("normDriverName", () => {
  it("normalizes case, surrounding and inner whitespace", () => {
    expect(normDriverName("  Brent   Dixon ")).toBe("brent dixon");
    expect(normDriverName("BRENT DIXON")).toBe(normDriverName("brent dixon"));
  });
  it("is safe for null/undefined/non-strings", () => {
    expect(normDriverName(null)).toBe("");
    expect(normDriverName(undefined)).toBe("");
    expect(normDriverName(42)).toBe("42");
  });
});

describe("reconcileDriverRoster — one id per driver, deterministic across devices", () => {
  it("collapses two ids for the same name to the smallest id and remaps the rest", () => {
    const old = [{ id: 2, name: "Brent Dixon" }];
    const incoming = [{ id: 2, name: "Brent Dixon" }, { id: 1720000000001, name: "Brent Dixon" }];
    const { drivers, remap } = reconcileDriverRoster(old, incoming);
    expect(drivers).toHaveLength(1);
    expect(drivers[0].id).toBe(2);                 // seed id wins
    expect(remap[1720000000001]).toBe(2);          // the Date.now() twin remaps to it
  });

  it("remaps a client whose driver's id changed under it (wholesale-replace clobber)", () => {
    // My roster had Brent@2; the incoming (FB) roster now only has Brent@999.
    const old = [{ id: 2, name: "Brent Dixon" }];
    const incoming = [{ id: 999, name: "Brent Dixon" }];
    const { drivers, remap } = reconcileDriverRoster(old, incoming);
    expect(drivers[0].id).toBe(999);               // follow the shared FB roster
    expect(remap[2]).toBe(999);                     // my entries on @2 follow to @999
  });

  it("two devices that see the SAME incoming roster pick the SAME canonical id", () => {
    const incoming = [{ id: 900, name: "Brent" }, { id: 100, name: "Brent" }];
    const a = reconcileDriverRoster([{ id: 900, name: "Brent" }], incoming);
    const b = reconcileDriverRoster([{ id: 100, name: "Brent" }], incoming);
    expect(a.drivers[0].id).toBe(b.drivers[0].id); // both -> 100
    expect(a.drivers[0].id).toBe(100);
    expect(a.remap[900]).toBe(100);
    expect(b.remap[900]).toBe(100);
  });

  it("steady state (rosters already match) produces NO remap and no churn", () => {
    const roster = [{ id: 1, name: "Trevor" }, { id: 2, name: "Brent" }];
    const { drivers, remap } = reconcileDriverRoster(roster, roster);
    expect(Object.keys(remap)).toHaveLength(0);
    expect(drivers).toHaveLength(2);
  });

  it("is deletion-safe: a name removed from the incoming roster is NOT remapped or resurrected", () => {
    const old = [{ id: 2, name: "Brent" }, { id: 5, name: "Carl" }];
    const incoming = [{ id: 2, name: "Brent" }]; // Carl was deleted
    const { drivers, remap } = reconcileDriverRoster(old, incoming);
    expect(drivers.some((d) => normDriverName(d.name) === "carl")).toBe(false);
    expect(remap[5]).toBeUndefined(); // Carl's entries are left as-is (genuine deletion)
  });

  it("never merges two genuinely different names", () => {
    const roster = [{ id: 1, name: "Trevor" }, { id: 2, name: "Trevarr" }];
    const { drivers, remap } = reconcileDriverRoster(roster, roster);
    expect(drivers).toHaveLength(2);
    expect(Object.keys(remap)).toHaveLength(0);
  });

  it("tolerates junk incoming (null / missing id / blank name)", () => {
    const { drivers, remap } = reconcileDriverRoster([], [null, { name: "x" }, { id: 3, name: "  " }, { id: 4, name: "Al" }]);
    expect(drivers).toHaveLength(1);
    expect(drivers[0].id).toBe(4);
    expect(Object.keys(remap)).toHaveLength(0);
  });
});

describe("applyDriverRemap — entries follow their driver", () => {
  it("repoints driverId per the remap and preserves everything else", () => {
    const entries = [del({ id: "a", driverId: 2 }), del({ id: "b", driverId: 999 }), del({ id: "c", driverId: 3 })];
    const out = applyDriverRemap(entries, { 999: 2 });
    expect(out.find((e) => e.id === "b").driverId).toBe(2);
    expect(out.find((e) => e.id === "a").driverId).toBe(2); // untouched
    expect(out.find((e) => e.id === "c").driverId).toBe(3); // untouched
  });
  it("returns the SAME array reference when nothing matches (no needless save)", () => {
    const entries = [del({ id: "a", driverId: 2 })];
    expect(applyDriverRemap(entries, { 999: 2 })).toBe(entries);
    expect(applyDriverRemap(entries, {})).toBe(entries);
  });
  it("leaves unassigned (driverId 0) entries alone", () => {
    const entries = [del({ id: "a", driverId: 0 })];
    expect(applyDriverRemap(entries, { 999: 2 })).toBe(entries);
  });
});

/* ====================================================================== */
/* Durable tombstones — deletes propagate to every device instead of being
   resurrected by another dispatcher's stale local copy. */
describe("tombListFrom / mergeTombstones", () => {
  it("normalizes Map / Set / arrays / bare ids to {id,sig,at}", () => {
    expect(tombListFrom(new Set(["x"]), 5)).toEqual([{ id: "x", sig: "", at: 5 }]);
    expect(tombListFrom([{ id: 1, sig: "s", at: 9 }], 5)).toEqual([{ id: "1", sig: "s", at: 9 }]);
    expect(tombListFrom(["y"], 7)).toEqual([{ id: "y", sig: "", at: 7 }]);
    expect(tombListFrom(null, 7)).toEqual([]);
  });
  it("merges doc + local keeping the newest at per (id,sig)", () => {
    const out = mergeTombstones([{ id: "x", sig: "s", at: 100 }], [{ id: "x", sig: "s", at: 200 }, { id: "y", sig: "", at: 150 }], 1000);
    const x = out.find((t) => t.id === "x");
    expect(x.at).toBe(200);
    expect(out).toHaveLength(2);
  });
  it("prunes tombstones older than the TTL (list can never grow forever)", () => {
    const now = DOC_TOMBSTONE_TTL + 1000000;
    const out = mergeTombstones([{ id: "old", sig: "", at: 1 }], [{ id: "fresh", sig: "", at: now - 5 }], now);
    expect(out.map((t) => t.id)).toEqual(["fresh"]);
  });
  it("is idempotent (transaction retries compute the same list)", () => {
    const fb = [{ id: "x", sig: "s", at: 100 }];
    const once = mergeTombstones(fb, [], 1000);
    expect(mergeTombstones(once, [], 1000)).toEqual(once);
  });
});

describe("makeDocTombFilter — edit-clock-aware suppression", () => {
  const X = () => del({ id: "x", customer: "BEC", stop: "BEC - Alpharetta", driverId: 2, loadNum: 2 });
  it("suppresses a stale copy (no updatedAt, or older than the delete)", () => {
    const f = makeDocTombFilter([{ id: "x", sig: entrySig(X()), at: 2000 }]);
    expect(f.has(X())).toBe(true);
    expect(f.has({ ...X(), updatedAt: 1000 })).toBe(true);
  });
  it("an entry edited AFTER the delete survives (last writer wins)", () => {
    const f = makeDocTombFilter([{ id: "x", sig: entrySig(X()), at: 2000 }]);
    expect(f.has({ ...X(), updatedAt: 3000 })).toBe(false);
  });
  it("a signature mismatch is NOT suppressed (a reassigned/changed stop is a different thing)", () => {
    const f = makeDocTombFilter([{ id: "x", sig: entrySig(X()), at: 2000 }]);
    expect(f.has({ ...X(), driverId: 7 })).toBe(false);
  });
  it("a re-added stop (fresh id, same content) is never caught by the old tombstone", () => {
    const f = makeDocTombFilter([{ id: "x", sig: entrySig(X()), at: 2000 }]);
    expect(f.has({ ...X(), id: "brand-new" })).toBe(false);
  });
});

describe("buildMergedEntries + docTombstones — the resurrection kill", () => {
  const X = (o = {}) => del({ id: "x", customer: "BEC", stop: "BEC - Alpharetta", driverId: 2, loadNum: 2, updatedAt: 1000, ...o });
  const tombX = () => [{ id: "x", sig: entrySig(X()), at: 2000 }];

  it("B's stale LOCAL copy of a stop A deleted is dropped (was: resurrected on B's save)", () => {
    // FB no longer has X (A's delete landed); B's local still does.
    const out = buildMergedEntries([], [X()], { isDriver: false, callerDriverId: 0, docTombstones: tombX() });
    expect(out.some((e) => e.id === "x")).toBe(false);
  });

  it("a stale FB copy (third device re-added it) is dropped from append AND the safety net", () => {
    const out = buildMergedEntries([X()], [], { isDriver: false, callerDriverId: 0, docTombstones: tombX() });
    expect(out.some((e) => e.id === "x")).toBe(false);
  });

  it("delete-vs-edit: a copy edited AFTER the delete survives", () => {
    const edited = X({ updatedAt: 3000, baseRate: 250 });
    const out = buildMergedEntries([], [edited], { isDriver: false, callerDriverId: 0, docTombstones: tombX() });
    expect(out.some((e) => e.id === "x" && e.baseRate === 250)).toBe(true);
  });

  it("a re-added stop under a fresh id is untouched by the tombstone", () => {
    const readd = X({ id: "fresh-id" });
    const out = buildMergedEntries([], [readd], { isDriver: false, callerDriverId: 0, docTombstones: tombX() });
    expect(out.some((e) => e.id === "fresh-id")).toBe(true);
  });

  it("without docTombstones behavior is unchanged (stale local copy is preserved)", () => {
    const out = buildMergedEntries([], [X()], { isDriver: false, callerDriverId: 0 });
    expect(out.some((e) => e.id === "x")).toBe(true);
  });
});

/* ====================================================================== */
/* Manual-pickup dock coverage — a manual pickup only suppresses the auto
   dock card when it is actually AT that dock (the "DCO Smyrna manual pickup
   erased Trevor's Emser - Norcross card" bug). */
describe("manualPickupCoversDock", () => {
  const NL = (v) => {
    if (!v || typeof v !== "string") return "";
    const p = v.split(/\s+[-–—]\s+/);
    return p[p.length - 1].trim().toLowerCase();
  };
  const SRC = "Emser - Norcross";
  const mpu = (o = {}) => ({ id: "m", customer: "Emser Tile", stopType: "pickup", manualPickup: true, driverId: 1, loadNum: 1, ...o });

  it("the production case: a return pickup at a store does NOT suppress the dock card", () => {
    expect(manualPickupCoversDock(mpu({ stop: "DCO Smyrna" }), "Norcross", SRC, NL)).toBe(false);
  });
  it("a manually-added dock card DOES suppress (stop equals the source label, any dash format)", () => {
    expect(manualPickupCoversDock(mpu({ stop: "Emser - Norcross" }), "Norcross", SRC, NL)).toBe(true);
    expect(manualPickupCoversDock(mpu({ stop: "Emser – Norcross" }), "Norcross", SRC, NL)).toBe(true); // en-dash → supplier+dock heuristic
  });
  it("pickupFrom decides when present: same dock covers, other dock does not", () => {
    expect(manualPickupCoversDock(mpu({ stop: "anything", pickupFrom: "Norcross" }), "Norcross", SRC, NL)).toBe(true);
    expect(manualPickupCoversDock(mpu({ stop: "anything", pickupFrom: "Emser - Norcross" }), "Norcross", SRC, NL)).toBe(true);
    expect(manualPickupCoversDock(mpu({ stop: "anything", pickupFrom: "Roswell" }), "Norcross", SRC, NL)).toBe(false);
  });
  it("a hand-typed supplier+dock name covers; a mere same-city location does not", () => {
    expect(manualPickupCoversDock(mpu({ stop: "Emser Norcross" }), "Norcross", SRC, NL)).toBe(true);
    expect(manualPickupCoversDock(mpu({ stop: "Elite Flooring - Norcross" }), "Norcross", SRC, NL)).toBe(false);
  });
  it("is safe on junk", () => {
    expect(manualPickupCoversDock(null, "Norcross", SRC, NL)).toBe(false);
    expect(manualPickupCoversDock(mpu({ stop: "" }), "Norcross", SRC, NL)).toBe(false);
  });
});
