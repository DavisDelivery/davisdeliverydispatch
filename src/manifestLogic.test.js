import { describe, it, expect } from "vitest";
import {
  dedupeIds,
  dedupeAutoPickups,
  sanitizeEntry,
  _mergeEntryDispatcher,
  _mergeEntryDriver,
  buildMergedEntries,
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
