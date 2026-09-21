import { describe, it, expect } from "vitest";
import {
  liveLoadOrderNote, deliveryDock, rebuildPickupsForPure, buildMergedEntries,
  reapOrphanAutoPickups, applyDropReorder, dedupeIds,
} from "./manifestLogic.js";
import { PICKUP_SOURCES, MULTI_PICKUP, normLoc } from "./pickupConfig.js";

/* ── The load order a driver reads off an auto-pickup card ───────────────────
   Field report, 2026-09-21: four Emser Tile deliveries batch-loaded onto a
   driver. Each card read "Pickup from Emser - Norcross" (the nominated default,
   nothing chosen), the engine made the Norcross card — and the card showed no
   load order. Then, on a sync, the card itself could vanish. Three rules had
   drifted apart on what dock a delivery with no named origin belongs to:
     - the engine filed it under the default dock and made the card there;
     - the live note in App.jsx demanded strict dock equality, found nothing,
       and the display path wiped the stored note as "stale";
     - the save-path reaper, run without docksFor, read a free-typed origin as
       a dock constraint and deleted the card the engine had just made.
   deliveryDock is now the one resolution all of them share. */

let n = 0;
const genId = () => `lo_${++n}`;
const deps = (over = {}) => ({
  pickupSources: PICKUP_SOURCES, customers: {}, driverLoadCount: {}, genId, normLoc, onTombstone: () => {}, ...over,
});
const noteDeps = { pickupSources: PICKUP_SOURCES, normLoc };
const docks = (c) => PICKUP_SOURCES.filter((s) => s.customer === c);
const reapOpts = { multiSource: (c) => !!MULTI_PICKUP[c], normLoc, docksFor: (c) => docks(c).map((s) => s.label) };
const del = (o) => ({ id: genId(), stopType: "delivery", customer: "Emser Tile", driverId: 5, loadNum: 1, baseRate: 0, ...o });
const mpu = (o) => ({ id: genId(), stopType: "pickup", manualPickup: true, customer: "Emser Tile", driverId: 5, loadNum: 1, baseRate: 0, ...o });
const cards = (all) => all.filter((e) => e.stopType === "pickup" && !e.manualPickup);
const card = (all, label) => cards(all).find((p) => p.stop === label);
const live = (pu, all) => liveLoadOrderNote(pu, all, noteDeps);

const EMSER = docks("Emser Tile");
const NORCROSS = "Emser - Norcross";
const ROSWELL = "Emser - Roswell";

describe("deliveryDock — one rule for which card a delivery belongs to", () => {
  const dock = (pickupFrom, cust = "Emser Tile") => deliveryDock({ pickupFrom }, docks(cust), normLoc)?.label;

  it("no origin named → the supplier's nominated default", () => {
    expect(dock(undefined)).toBe(NORCROSS);
    expect(dock(null)).toBe(NORCROSS);
    expect(dock("")).toBe(NORCROSS);
  });
  it("every stored spelling of a dock resolves to it", () => {
    ["Norcross", "Emser - Norcross", "Emser – Norcross", "Emser Tile — Norcross", "norcross"].forEach((v) => expect(dock(v)).toBe(NORCROSS));
    ["Roswell", "Emser - Roswell", "Emser – Roswell"].forEach((v) => expect(dock(v)).toBe(ROSWELL));
  });
  it("the supplier's own name, or a place it doesn't own, is not a dock — default stands in", () => {
    expect(dock("Emser Tile")).toBe(NORCROSS);
    expect(dock("Some Random Warehouse - Nowhere")).toBe(NORCROSS);
    expect(dock("Southern Aluminum - Lithia Springs")).toBe(NORCROSS);
  });
  it("a single-dock supplier always resolves to its one dock", () => {
    expect(dock(undefined, "Florida Tile")).toBe("Florida Tile - Norcross");
    expect(dock("anything at all", "Florida Tile")).toBe("Florida Tile - Norcross");
  });
  it("no nominated default → the first listed dock, matching the engine's old fallback", () => {
    expect(docks("Traditions in Tile").some((s) => s.default)).toBe(false);
    expect(dock(undefined, "Traditions in Tile")).toBe("Traditions - Alpharetta");
    expect(dock("Bogart", "Traditions in Tile")).toBe("Traditions - Bogart");
  });
  it("a supplier with no docks resolves to nothing", () => {
    expect(deliveryDock({ pickupFrom: "x" }, [], normLoc)).toBe(null);
    expect(deliveryDock({ pickupFrom: "x" }, undefined, normLoc)).toBe(null);
  });
});

describe("liveLoadOrderNote — the field report", () => {
  const fourStops = () => [
    del({ stop: "DCO Smyrna" }),
    del({ stop: "Sherwin Williams - Smyrna" }),
    del({ stop: "Gel & Associates - Atlanta" }),
    del({ stop: "Atlanta West - Lithia Springs" }),
  ];

  it("four batch-added Emser stops with no dock named: one Norcross card, and its load order lists all four", () => {
    const all = rebuildPickupsForPure(fourStops(), "Emser Tile", deps());
    expect(cards(all).map((p) => p.stop)).toEqual([NORCROSS]);
    const pu = card(all, NORCROSS);
    const expected = "Load order: Atlanta West - Lithia Springs, Gel & Associates - Atlanta, Sherwin Williams - Smyrna, DCO Smyrna";
    expect(pu.note).toBe(expected);
    expect(live(pu, all)).toBe(expected);
  });

  it("the live note follows a drag reorder the engine never saw", () => {
    const built = rebuildPickupsForPure(fourStops(), "Emser Tile", deps());
    const last = built[built.length - 1];
    const dragged = applyDropReorder(built, 5, last.id, -1, 1); /* drop it right under the pickup */
    const pu = card(dragged, NORCROSS);
    expect(pu.note).toBe(card(built, NORCROSS).note); /* stored text is stale by design… */
    expect(live(pu, dragged)).toBe("Load order: Gel & Associates - Atlanta, Sherwin Williams - Smyrna, DCO Smyrna, Atlanta West - Lithia Springs"); /* …the live one is right */
  });

  it("mixed spellings and docks: each card lists exactly the deliveries it was made for", () => {
    const all = rebuildPickupsForPure([
      del({ stop: "A", pickupFrom: null }),
      del({ stop: "B", pickupFrom: "Emser - Norcross" }),
      del({ stop: "C", pickupFrom: "Roswell" }),
      del({ stop: "D", pickupFrom: "Emser Tile" }),
      del({ stop: "E", pickupFrom: "Emser – Roswell" }),
    ], "Emser Tile", deps());
    expect(cards(all).map((p) => p.stop).sort()).toEqual([NORCROSS, ROSWELL]);
    expect(live(card(all, NORCROSS), all)).toBe("Load order: D, B, A");
    expect(live(card(all, ROSWELL), all)).toBe("Load order: E, C");
    cards(all).forEach((p) => expect(live(p, all)).toBe(p.note));
  });

  it("only this driver's deliveries, on this load", () => {
    const all = rebuildPickupsForPure([
      del({ stop: "mine L1" }),
      del({ stop: "mine L2", loadNum: 2 }),
      del({ stop: "theirs", driverId: 6 }),
    ], "Emser Tile", deps({ driverLoadCount: { 5: 2 } }));
    const mine = cards(all).filter((p) => p.driverId === 5);
    expect(mine.map((p) => p.loadNum).sort()).toEqual([1, 2]);
    expect(live(mine.find((p) => p.loadNum === 1), all)).toBe("Load order: mine L1");
    expect(live(mine.find((p) => p.loadNum === 2), all)).toBe("Load order: mine L2");
    expect(live(cards(all).find((p) => p.driverId === 6), all)).toBe("Load order: theirs");
  });

  it("a single-dock supplier's card lists every delivery on the load, whatever pickupFrom says", () => {
    const all = rebuildPickupsForPure([
      del({ customer: "Florida Tile", stop: "F1", pickupFrom: null }),
      del({ customer: "Florida Tile", stop: "F2", pickupFrom: "Florida Tile - Norcross" }),
      del({ customer: "Florida Tile", stop: "F3", pickupFrom: "typed by hand" }),
    ], "Florida Tile", deps());
    const pu = cards(all)[0];
    expect(pu.stop).toBe("Florida Tile - Norcross");
    expect(live(pu, all)).toBe("Load order: F3, F2, F1");
    expect(live(pu, all)).toBe(pu.note);
  });

  it("freight collected off-dock, with a manual pickup there, is on no dock card's load order", () => {
    const all = rebuildPickupsForPure([
      mpu({ stop: "MTI - Sugar Hill", addr: "1 MTI Way" }),
      del({ stop: "from MTI", pickupFrom: "MTI - Sugar Hill" }),
      del({ stop: "from the dock" }),
    ], "Emser Tile", deps());
    expect(cards(all).map((p) => p.stop)).toEqual([NORCROSS]);
    const pu = card(all, NORCROSS);
    expect(live(pu, all)).toBe("Load order: from the dock");
    expect(live(pu, all)).toBe(pu.note);
  });

  it("nothing for a manual pickup elsewhere, a delivery, or a card with no deliveries behind it", () => {
    const manual = mpu({ stop: "DCO Smyrna", addr: "3500 Highlands Parkway SE" }); /* a return pickup at a store — not the dock */
    const d = del({ stop: "X" });
    const orphan = { id: "o", stopType: "pickup", customer: "Emser Tile", stop: NORCROSS, pickupFrom: "Norcross", driverId: 5, loadNum: 1, note: "Load order: gone" };
    expect(live(manual, [manual, d])).toBe(null);
    expect(live(d, [manual, d])).toBe(null);
    expect(live(orphan, [orphan])).toBe(null);
    expect(live(null, [])).toBe(null);
    expect(live(orphan, undefined)).toBe(null);
  });

  it("with no dock config at all it still answers by driver, load and customer", () => {
    const pu = { id: "p", stopType: "pickup", customer: "Emser Tile", stop: NORCROSS, driverId: 5, loadNum: 1 };
    const all = [pu, del({ stop: "A" }), del({ stop: "B" })];
    expect(liveLoadOrderNote(pu, all, {})).toBe("Load order: B, A");
    expect(liveLoadOrderNote(pu, all, undefined)).toBe("Load order: B, A");
  });
});

describe("engine — one card per resolved dock", () => {
  it("two unresolvable origins on one load make ONE default-dock card, not two with a shared id", () => {
    const all = rebuildPickupsForPure([
      del({ stop: "A", pickupFrom: "Emser Tile" }),
      del({ stop: "B", pickupFrom: null }),
      del({ stop: "C", pickupFrom: "Some Random Warehouse - Nowhere" }),
    ], "Emser Tile", deps());
    expect(cards(all).map((p) => p.stop)).toEqual([NORCROSS]);
    expect(card(all, NORCROSS).note).toBe("Load order: C, B, A");
    const again = rebuildPickupsForPure(all, "Emser Tile", deps());
    expect(cards(again).map((p) => p.id)).toEqual(cards(all).map((p) => p.id));
    expect(new Set(again.map((e) => e.id)).size).toBe(again.length);
  });
});

describe("save merge — the reaper agrees with the engine", () => {
  const save = (fb, local) => buildMergedEntries(fb, local, { multiSource: reapOpts.multiSource, normLoc, docksFor: reapOpts.docksFor });

  it("a card made for a free-typed origin survives the save it used to die in", () => {
    const built = rebuildPickupsForPure([del({ stop: "A", pickupFrom: "Emser Tile" })], "Emser Tile", deps());
    expect(cards(built).map((p) => p.stop)).toEqual([NORCROSS]);
    expect(cards(reapOrphanAutoPickups(built, reapOpts)).length).toBe(1);   /* display and ingest kept it… */
    expect(cards(save(built, built)).length).toBe(1);                       /* …and now so does the save */
    expect(cards(save([], built)).length).toBe(1);                          /* first save of a new day too */
  });

  it("the same manifest comes back from the save with exactly the same stops", () => {
    const built = rebuildPickupsForPure([
      del({ stop: "A", pickupFrom: "Emser Tile" }), del({ stop: "B" }), del({ stop: "C", pickupFrom: "Roswell" }),
    ], "Emser Tile", deps());
    const back = save(dedupeIds(built), dedupeIds(built));
    expect(back.map((e) => e.id).sort()).toEqual(built.map((e) => e.id).sort());
  });

  it("a genuinely orphaned dock card is still reaped", () => {
    const built = rebuildPickupsForPure([del({ stop: "A", pickupFrom: "Norcross" })], "Emser Tile", deps());
    const roswellCard = { ...card(built, NORCROSS), id: "stale_roswell", stop: ROSWELL, pickupFrom: "Roswell", addr: EMSER[1].addr };
    const out = save([...built, roswellCard], [...built, roswellCard]);
    expect(cards(out).map((p) => p.stop)).toEqual([NORCROSS]);
  });

  it("without docksFor the merge still runs (back-compat), with the old location-blind reaper", () => {
    const built = rebuildPickupsForPure([del({ stop: "A" })], "Emser Tile", deps());
    expect(cards(buildMergedEntries(built, built, { multiSource: reapOpts.multiSource, normLoc })).length).toBe(1);
    expect(cards(buildMergedEntries(built, built, {})).length).toBe(1);
  });
});
