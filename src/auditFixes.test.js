import { describe, it, expect } from "vitest";
import {
  makeTombFilter, entrySig, qualifyPickupName, applyReassign, rebuildPickupsForPure,
  liveLoadOrderNote, withLiveLoadOrder, LOAD_ORDER_SEP, buildMergedEntries,
} from "./manifestLogic.js";
import { PICKUP_SOURCES, MULTI_PICKUP, normLoc } from "./pickupConfig.js";

/* ── Regression tests for the 2026-09-21 audit ───────────────────────────────
   Each block names the field failure it pins down. See docs/ENGINEERING_AUDIT.md
   §08 for the full list, including the findings left open. */

let n = 0;
const genId = () => `af_${++n}`;
const deps = (over = {}) => ({
  pickupSources: PICKUP_SOURCES, customers: {}, driverLoadCount: {}, genId, normLoc, onTombstone: () => {}, ...over,
});
const noteDeps = { pickupSources: PICKUP_SOURCES, normLoc };
const docks = (c) => PICKUP_SOURCES.filter((s) => s.customer === c);
const del = (o) => ({ id: genId(), stopType: "delivery", customer: "Emser Tile", driverId: 5, loadNum: 1, baseRate: 0, ...o });
const mpu = (o) => ({ id: genId(), stopType: "pickup", manualPickup: true, customer: "Emser Tile", driverId: 5, loadNum: 1, baseRate: 0, ...o });
const cards = (all) => all.filter((e) => e.stopType === "pickup" && !e.manualPickup);
const rebuildAll = (entries, d = deps()) => {
  let all = entries;
  [...new Set(entries.map((e) => e.customer))].forEach((c) => { all = rebuildPickupsForPure(all, c, d); });
  return all;
};

describe("in-memory tombstones honour the edit clock (like the doc tombstones)", () => {
  const stop = del({ id: "x", stop: "S" });
  it("a delete older than the entry's own last edit yields to the edit", () => {
    const f = makeTombFilter([{ id: "x", sig: entrySig(stop), at: 1000 }]);
    expect(f.has({ ...stop, updatedAt: 2000 })).toBe(false);
    expect(f.has({ ...stop, updatedAt: 500 })).toBe(true);
    expect(f.has(stop)).toBe(true); /* never edited → the delete stands */
  });
  it("a tombstone with no clock still matches unconditionally (legacy shapes)", () => {
    expect(makeTombFilter(["x"]).has({ ...stop, updatedAt: 9e12 })).toBe(true);
    expect(makeTombFilter(new Set(["x"])).has({ ...stop, updatedAt: 9e12 })).toBe(true);
    expect(makeTombFilter(new Map([["x", entrySig(stop)]])).has({ ...stop, updatedAt: 9e12 })).toBe(true);
  });
  it("a Map of {sig, at} objects (the tombstonesRef shape) carries its clock", () => {
    const f = makeTombFilter(new Map([["x", { sig: entrySig(stop), at: 1000 }]]));
    expect(f.has({ ...stop, updatedAt: 2000 })).toBe(false);
    expect(f.has({ ...stop, updatedAt: 999 })).toBe(true);
  });
  it("the newest delete wins when the same stop was tombstoned twice", () => {
    const f = makeTombFilter([{ id: "x", sig: entrySig(stop), at: 1000 }, { id: "x", sig: entrySig(stop), at: 3000 }]);
    expect(f.has({ ...stop, updatedAt: 2000 })).toBe(true);
  });
  it("the save merge lets a newer remote edit outlive an older local delete", () => {
    const edited = { ...stop, driverId: 0, updatedAt: 2000, baseRate: 150 };
    const out = buildMergedEntries([edited], [], { deletedIds: [{ id: "x", sig: entrySig(edited), at: 1000 }] });
    expect(out.map((e) => e.id)).toEqual(["x"]);
  });
});

describe("qualifyPickupName — the customer's own docks, and no guessing past an address", () => {
  const opts = { pickupSources: PICKUP_SOURCES };
  it("a single-dock supplier's bare dock name is qualified (MULTI_PICKUP never lists them)", () => {
    expect(MULTI_PICKUP["Crossville Studios"]).toBeUndefined();
    expect(qualifyPickupName("Norcross", "Crossville Studios", MULTI_PICKUP, opts)).toBe("Crossville - Norcross");
    expect(qualifyPickupName("Norcross", "Prolex Flooring", MULTI_PICKUP, opts)).toBe("Prolex - Norcross");
    expect(qualifyPickupName("Norcross", "Emser Tile", MULTI_PICKUP, opts)).toBe("Emser - Norcross");
  });
  it("another supplier's branch is only borrowed when the address says so", () => {
    const traditionsAtlanta = docks("Traditions in Tile").find((s) => s.label === "Traditions - Atlanta").addr;
    expect(qualifyPickupName("Atlanta", "Jill of All Trades", MULTI_PICKUP, { ...opts, addr: "11 Perimeter Center East, Atlanta, GA 30346" })).toBe("Atlanta");
    expect(qualifyPickupName("Atlanta", "Quote Delivery", MULTI_PICKUP, { ...opts, addr: traditionsAtlanta })).toBe("Traditions - Atlanta");
    expect(qualifyPickupName("Atlanta", "Quote Delivery", MULTI_PICKUP, { ...opts, addr: "1015 chattahoochee avenue nw atlanta ga 30318" })).toBe("Traditions - Atlanta");
  });
  it("with no address the old name-only guess still applies", () => {
    expect(qualifyPickupName("Atlanta", "Quote Delivery", MULTI_PICKUP, opts)).toBe("Traditions - Atlanta");
    expect(qualifyPickupName("Atlanta", "Quote Delivery", MULTI_PICKUP)).toBe("Traditions - Atlanta");
  });
  it("a Crossville quote's pickup leg, once qualified, covers the dock: one pickup card, not two", () => {
    const stopLabel = qualifyPickupName("Norcross", "Crossville Studios", MULTI_PICKUP, opts);
    const all = rebuildAll([
      mpu({ customer: "Crossville Studios", stop: stopLabel, addr: docks("Crossville Studios")[0].addr, weight: 4000 }),
      del({ customer: "Crossville Studios", stop: "Smith Residence", pickupFrom: stopLabel, weight: 4000 }),
    ]);
    expect(cards(all)).toEqual([]);
    expect(all.filter((e) => e.stopType === "pickup").length).toBe(1);
  });
});

describe("applyReassign — auto cards stay put, pairs travel together, the pool resets the load", () => {
  it("moving an auto pickup card is a no-op — the driver keeps their pickup", () => {
    const all = rebuildAll([del({ stop: "A" }), del({ stop: "B" })]);
    const pu = cards(all)[0];
    expect(applyReassign(all, pu.id, 0, undefined, { rebuildPickups: (x) => x })).toBe(all);
    expect(applyReassign(all, pu.id, 7, undefined, { rebuildPickups: (x) => x })).toBe(all);
  });

  it("assigning only the delivery brings the quote's pickup leg along, pickup first, and no dock card is conjured", () => {
    const pu = mpu({ customer: "Florida Tile", stop: "ABC Warehouse", addr: "1 ABC St, Duluth", driverId: 0, pairId: "pair1", weight: 900 });
    const d = del({ customer: "Florida Tile", stop: "Smith Residence", pickupFrom: "ABC Warehouse", driverId: 0, pairId: "pair1", weight: 900 });
    const other = del({ customer: "Florida Tile", stop: "Elsewhere", driverId: 3 });
    const rebuild = (all, c) => rebuildPickupsForPure(all, c, deps());
    const out = applyReassign([other, pu, d], d.id, 3, undefined, { rebuildPickups: rebuild });
    const onThree = out.filter((e) => e.driverId === 3);
    expect(onThree.map((e) => e.stop)).toContain("ABC Warehouse");
    expect(onThree.map((e) => e.stop)).toContain("Smith Residence");
    expect(onThree.findIndex((e) => e.id === pu.id)).toBeLessThan(onThree.findIndex((e) => e.id === d.id));
    expect(out.filter((e) => e.driverId === 0)).toEqual([]);
    /* the freight is at ABC Warehouse — no "Florida Tile - Norcross" card for it */
    const dockCards = cards(out).filter((p) => p.driverId === 3);
    expect(dockCards.map((p) => p.note)).toEqual(["Load order: Elsewhere"]);
  });

  it("sending the delivery back to the pool takes its pickup leg with it", () => {
    const pu = mpu({ customer: "Florida Tile", stop: "ABC Warehouse", driverId: 3, pairId: "p2" });
    const d = del({ customer: "Florida Tile", stop: "Smith Residence", pickupFrom: "ABC Warehouse", driverId: 3, pairId: "p2" });
    const out = applyReassign([pu, d], d.id, 0, undefined, {});
    expect(out.every((e) => e.driverId === 0)).toBe(true);
  });

  it("a partner already somewhere else is left alone", () => {
    const pu = mpu({ customer: "Florida Tile", stop: "ABC Warehouse", driverId: 2, pairId: "p3" });
    const d = del({ customer: "Florida Tile", stop: "Smith Residence", driverId: 0, pairId: "p3" });
    const out = applyReassign([pu, d], d.id, 3, undefined, {});
    expect(out.find((e) => e.id === pu.id).driverId).toBe(2);
    expect(out.find((e) => e.id === d.id).driverId).toBe(3);
  });

  it("a stop pulled to Unassigned, then dropped on another driver, lands on Load 1", () => {
    const d = del({ stop: "DCO Eatonton", driverId: 4, loadNum: 2 });
    const pooled = applyReassign([d], d.id, 0, undefined, {});
    expect(pooled[0].loadNum).toBe(1);
    const again = applyReassign([{ ...d, driverId: 0 }], d.id, 6, undefined, {});
    expect(again[0].loadNum).toBe(1);
    expect(again[0].driverId).toBe(6);
  });

  it("an explicit load, and a split-off half's Load 2, are respected", () => {
    const d = del({ stop: "X", driverId: 0, loadNum: 1 });
    expect(applyReassign([d], d.id, 6, 2, {})[0].loadNum).toBe(2);
    const half = del({ stop: "Y", driverId: 0, loadNum: 2, wasSplit: true, splitContinuation: true });
    expect(applyReassign([half], half.id, 6, undefined, {})[0].loadNum).toBe(2);
    const back = applyReassign([{ ...half, driverId: 6 }], half.id, 0, undefined, {})[0];
    expect(back.loadNum).toBe(2);
  });

  it("a move between two drivers keeps the load it was on", () => {
    const d = del({ stop: "X", driverId: 4, loadNum: 2 });
    expect(applyReassign([d], d.id, 6, undefined, {})[0].loadNum).toBe(2);
  });
});

describe("a manual pickup standing in for the dock carries the load order", () => {
  const NORCROSS = "Emser - Norcross";
  const quoteDay = () => [
    del({ stop: "DCO Smyrna" }),
    del({ stop: "Sherwin Williams - Smyrna" }),
    del({ stop: "Gel & Associates - Atlanta" }),
    del({ stop: "Atlanta West - Lithia Springs" }),
    mpu({ stop: NORCROSS, addr: docks("Emser Tile")[0].addr, note: "Picking up for Smith Residence", quoteId: "q1", pairId: "pp" }),
    del({ stop: "Smith Residence", pickupFrom: NORCROSS, quoteId: "q1", pairId: "pp" }),
  ];

  it("the Emser quote on the same day: no auto card, and the manual card lists all five stops", () => {
    const all = rebuildAll(quoteDay());
    expect(cards(all)).toEqual([]);
    const manual = all.find((e) => e.manualPickup);
    expect(liveLoadOrderNote(manual, all, noteDeps)).toBe(
      "Load order: Smith Residence, Atlanta West - Lithia Springs, Gel & Associates - Atlanta, Sherwin Williams - Smyrna, DCO Smyrna",
    );
    const shown = withLiveLoadOrder(manual, all, noteDeps);
    expect(shown.note).toBe("Picking up for Smith Residence" + LOAD_ORDER_SEP + liveLoadOrderNote(manual, all, noteDeps));
  });

  it("is idempotent — a displayed copy fed back in does not stack a second load order", () => {
    const all = rebuildAll(quoteDay());
    const manual = all.find((e) => e.manualPickup);
    const once = withLiveLoadOrder(manual, all, noteDeps);
    const twice = withLiveLoadOrder(once, all.map((e) => (e.id === once.id ? once : e)), noteDeps);
    expect(twice).toBe(once);
    expect((twice.note.match(/Load order:/g) || []).length).toBe(1);
  });

  it("a manual pickup somewhere else is left exactly as written", () => {
    const ret = mpu({ stop: "DCO Smyrna", addr: "3500 Highlands Parkway SE", note: "Return pallets" });
    const all = rebuildAll([del({ stop: "A" }), ret]);
    expect(withLiveLoadOrder(ret, all, noteDeps)).toBe(ret);
    expect(cards(all).length).toBe(1); /* the dock card is still there for A */
  });

  it("when the deliveries go, the appended load order goes and the dispatcher's note stays", () => {
    const manual = mpu({ stop: NORCROSS, note: "Picking up for Smith" + LOAD_ORDER_SEP + "Load order: A, B" });
    expect(withLiveLoadOrder(manual, [manual], noteDeps).note).toBe("Picking up for Smith");
    const bare = mpu({ stop: NORCROSS, note: "Load order: A, B" });
    expect(withLiveLoadOrder(bare, [bare], noteDeps).note).toBe(null);
  });

  it("an auto card's note is replaced outright, and a stale one cleared", () => {
    const all = rebuildAll([del({ stop: "A" }), del({ stop: "B" })]);
    const pu = cards(all)[0];
    expect(withLiveLoadOrder({ ...pu, note: "Load order: old" }, all, noteDeps).note).toBe("Load order: B, A");
    expect(withLiveLoadOrder({ ...pu, note: "Load order: old" }, [pu], noteDeps).note).toBe(null);
    expect(withLiveLoadOrder(pu, all, noteDeps)).toBe(pu);
  });
});
