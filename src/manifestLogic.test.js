import { describe, it, expect } from "vitest";
import {
  dedupeIds,
  dedupeAutoPickups,
  sanitizeEntry,
  _mergeEntryDispatcher,
  _mergeEntryDriver,
  buildMergedEntries,
  entrySig,
  makeTombFilter,
  vanishedAutoPickups,
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
    const puDone = pu({ id: "pu", customer: "Emser", stop: "Emser - Norcross", driverId: 5, status: "departed" });
    const d1 = del({ id: "idlewood", customer: "Idlewood", driverId: 5 });
    const d2 = del({ id: "floorworx", customer: "Floorworx", driverId: 5 });
    const out = buildMergedEntries([puDone, d1, d2], [puDone, d1, d2], { isDriver: true, callerDriverId: 5 });
    expect(out.filter((e) => e.driverId === 0)).toHaveLength(0); // nothing fell back to Unassigned
    expect(out.find((e) => e.id === "pu").status).toBe("departed"); // pickup stays done
  });
});

/* ====================================================================== */
describe("entrySig — lean content identity", () => {
  it("is independent of id, addr, driverId and loadNum (the mutable / normalized fields)", () => {
    const a = del({ id: "1", customer: "Emser", stop: "Roswell", addr: "100 Main", driverId: 5, loadNum: 1 });
    const b = del({ id: "2", customer: "Emser", stop: "Roswell", addr: "DIFFERENT", driverId: 7, loadNum: 2 });
    expect(entrySig(a)).toBe(entrySig(b)); // same physical stop identity
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
    // same id, same content -> tombstoned
    expect(f.has(del({ id: "X", customer: "Emser", stop: "Roswell", stopType: "delivery", addr: "elsewhere", driverId: 9 }))).toBe(true);
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

  it("signature fallback is skipped when ambiguous (two FB stops share a signature)", () => {
    // Two genuinely distinct loads of the same customer/stop in FB; a local entry
    // whose id matches neither must NOT be merged into an arbitrary one of them.
    const fb1 = del({ id: "f1", customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 1 });
    const fb2 = del({ id: "f2", customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 2 });
    const localOrphan = del({ id: "lo", customer: "Emser", stop: "Norcross", driverId: 5, loadNum: 1, status: "departed" });
    const out = buildMergedEntries([fb1, fb2], [localOrphan], { isDriver: false, callerDriverId: 0 });
    // ambiguous -> local kept as-is, both FB entries preserved (no silent merge/loss)
    expect(out.filter((e) => e.customer === "Emser")).toHaveLength(3);
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

  it("the exact screenshot scenario: a paired round-trip delivery survives a concurrent delete elsewhere", () => {
    // Trevor's Emser pickup + its round-trip delivery 'Advanced Flooring Design –
    // Mableton'. The dispatcher concurrently deletes an UNRELATED stop whose id
    // collides with the delivery's id. The delivery must remain on every screen.
    const puEmser = pu({ id: "pu_emser", customer: "Emser Tile", stop: "Emser - Roswell", driverId: 5 });
    const roundTripDel = del({ id: "shared", customer: "Advanced Flooring Design", stop: "Mableton", driverId: 5 });
    const unrelatedDeleted = del({ id: "shared", customer: "Something Else", stop: "Decatur" });
    const out = buildMergedEntries(
      [puEmser, roundTripDel],
      [puEmser, roundTripDel],
      { isDriver: false, callerDriverId: 0, deletedIds: new Map([["shared", entrySig(unrelatedDeleted)]]) }
    );
    expect(out.some((e) => e.customer === "Advanced Flooring Design" && e.stopType === "delivery")).toBe(true);
    expect(out.some((e) => e.stopType === "pickup")).toBe(true);
  });
});
