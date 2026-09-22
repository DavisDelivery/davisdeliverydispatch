import { describe, it, expect } from "vitest";
import {
  liveLoadOrderNote, deliveryDock, rebuildPickupsForPure, buildMergedEntries,
  reapOrphanAutoPickups, applyDropReorder, dedupeIds, dedupeAutoPickups,
  sanitizeEntry, resolvePickupLabel, withLiveLoadOrder,
} from "./manifestLogic.js";
import { PICKUP_SOURCES, MULTI_PICKUP, normLoc, RETIRED_PICKUPS, retiredPickup } from "./pickupConfig.js";

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

const NORCROSS = "Emser - Norcross";
/* Emser ships from one dock now (Roswell closed), so the multi-dock rules are
   exercised against a supplier that still has several. */
const ALPHARETTA = "Traditions - Alpharetta";
const ATLANTA = "Traditions - Atlanta";

describe("deliveryDock — one rule for which card a delivery belongs to", () => {
  const dock = (pickupFrom, cust = "Emser Tile") => deliveryDock({ pickupFrom }, docks(cust), normLoc)?.label;

  it("no origin named → the supplier's nominated default", () => {
    expect(dock(undefined)).toBe(NORCROSS);
    expect(dock(null)).toBe(NORCROSS);
    expect(dock("")).toBe(NORCROSS);
  });
  it("every stored spelling of a dock resolves to it", () => {
    ["Norcross", "Emser - Norcross", "Emser – Norcross", "Emser Tile — Norcross", "norcross"].forEach((v) => expect(dock(v)).toBe(NORCROSS));
    ["Atlanta", "Traditions - Atlanta", "Traditions – Atlanta"].forEach((v) => expect(dock(v, "Traditions in Tile")).toBe(ATLANTA));
    ["Bogart", "Traditions - Bogart"].forEach((v) => expect(dock(v, "Traditions in Tile")).toBe("Traditions - Bogart"));
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
    const trad = (o) => del({ customer: "Traditions in Tile", ...o });
    const all = rebuildPickupsForPure([
      trad({ stop: "A", pickupFrom: null }),                   /* no dock named → first listed */
      trad({ stop: "B", pickupFrom: "Traditions - Alpharetta" }),
      trad({ stop: "C", pickupFrom: "Atlanta" }),
      trad({ stop: "D", pickupFrom: "Traditions in Tile" }),   /* the supplier is not a dock */
      trad({ stop: "E", pickupFrom: "Traditions – Atlanta" }), /* en-dash */
    ], "Traditions in Tile", deps());
    expect(cards(all).map((p) => p.stop).sort()).toEqual([ALPHARETTA, ATLANTA]);
    expect(live(card(all, ALPHARETTA), all)).toBe("Load order: D, B, A");
    expect(live(card(all, ATLANTA), all)).toBe("Load order: E, C");
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
      del({ stop: "A", pickupFrom: "Emser Tile" }), del({ stop: "B" }), del({ stop: "C", pickupFrom: "typed by hand" }),
    ], "Emser Tile", deps());
    const back = save(dedupeIds(built), dedupeIds(built));
    expect(back.map((e) => e.id).sort()).toEqual(built.map((e) => e.id).sort());
  });

  it("a genuinely orphaned dock card is still reaped", () => {
    /* A multi-dock supplier: a card at a dock this load collects nothing from
       has no delivery behind it and must go. */
    const built = rebuildPickupsForPure(
      [del({ customer: "Traditions in Tile", stop: "A", pickupFrom: "Alpharetta" })], "Traditions in Tile", deps());
    const atlantaDock = docks("Traditions in Tile").find((s) => s.label === ATLANTA);
    const strayCard = { ...card(built, ALPHARETTA), id: "stale_atl", stop: ATLANTA, pickupFrom: "Atlanta", addr: atlantaDock.addr };
    const out = save([...built, strayCard], [...built, strayCard]);
    expect(cards(out).map((p) => p.stop)).toEqual([ALPHARETTA]);
  });

  it("without docksFor the merge still runs (back-compat), with the old location-blind reaper", () => {
    const built = rebuildPickupsForPure([del({ stop: "A" })], "Emser Tile", deps());
    expect(cards(buildMergedEntries(built, built, { multiSource: reapOpts.multiSource, normLoc })).length).toBe(1);
    expect(cards(buildMergedEntries(built, built, {})).length).toBe(1);
  });
});

/* ── A dock the supplier closed ──────────────────────────────────────────────
   Emser's Roswell branch shut. Taking it out of PICKUP_SOURCES is the easy
   half; the orders already saved against it are the half that decides whether
   a driver is sent to a locked door.

   The rule those orders are judged by is whether anyone has worked them. A
   stop still to be run is a plan, and a plan pointing at a closed dock is
   simply wrong — every screen shows it at the dock that took the freight. A
   stop with a driver's stamp on it is a record of a trip that was made, and
   nothing here may restate it. Above all, none of this writes: the stored row
   is the same bytes after a read as before it, so a finished day keeps saying
   what happened. */
describe("retired dock — Emser Roswell", () => {
  const CLOSED = "Emser - Roswell";
  const HEMBREE = "250 Hembree Park Drive, Roswell, GA 30076";
  const WORKED = { status: "departed", departedAt: "10:14 AM" };
  const rosDel = (o = {}) => del({ stop: "DCO Smyrna", pickupFrom: CLOSED, addr: "3500 Highlands Pkwy", ...o });
  const rosCard = (o = {}) => ({ id: genId(), stopType: "pickup", customer: "Emser Tile", stop: CLOSED,
    pickupFrom: "Roswell", addr: HEMBREE, driverId: 5, loadNum: 1, baseRate: 0, weight: 0, ...o });
  /* The dispatcher board's own read pipeline, in order. */
  const shown = (dl) => {
    const es = reapOrphanAutoPickups(dedupeAutoPickups(dl, reapOpts), reapOpts);
    return es.map((e) => withLiveLoadOrder(e, es, noteDeps));
  };

  it("is gone from the dock list, and leaves Emser with a single dock", () => {
    expect(PICKUP_SOURCES.filter((s) => s.customer === "Emser Tile").map((s) => s.label)).toEqual([NORCROSS]);
    expect(PICKUP_SOURCES.some((s) => /roswell/i.test(s.label))).toBe(false);
    expect(MULTI_PICKUP["Emser Tile"]).toBeUndefined();
  });

  it("is recorded as retired, pointing at a dock that still exists", () => {
    const rec = RETIRED_PICKUPS.find((r) => r.label === CLOSED);
    expect(rec).toBeTruthy();
    expect(PICKUP_SOURCES.some((s) => s.label === rec.movedTo)).toBe(true);
    ["Roswell", CLOSED, "Emser Tile — Roswell", "emser – roswell"].forEach((v) =>
      expect(retiredPickup("Emser Tile", v)?.label).toBe(NORCROSS));
    /* Somewhere else that happens to be in Roswell is not this dock. */
    expect(retiredPickup("Florida Tile", "Roswell")).toBe(null);
    expect(retiredPickup("Emser Tile", "Norcross")).toBe(null);
  });

  /* ── The record is never touched ───────────────────────────────────────── */
  it("reading a stored row never moves it off the closed dock — worked or not", () => {
    /* sanitizeEntry still coerces types (an absent pickupFrom becomes null);
       what it must never do is move the stop somewhere else. */
    const where = (e) => ({ stop: e.stop, pickupFrom: e.pickupFrom ?? null, addr: e.addr });
    [rosDel(), rosDel(WORKED), rosCard(), rosCard(WORKED), mpu({ stop: CLOSED, addr: HEMBREE })].forEach((row) => {
      expect(where(sanitizeEntry(row))).toEqual(where(row));
    });
  });

  /* ── Work still to be done points at the open dock ─────────────────────── */
  it("an unworked delivery naming it collects at Norcross, and says so", () => {
    const d = rosDel();
    expect(deliveryDock(d, docks("Emser Tile"), normLoc).label).toBe(NORCROSS);
    expect(resolvePickupLabel(d, [d]).text).toBe(NORCROSS);
    expect(d.pickupFrom).toBe(CLOSED); /* the row itself is unchanged */
  });

  it("an unworked card at the closed dock is shown at Norcross, address and all", () => {
    const board = shown([rosCard(), rosDel(), del({ stop: "BEC - Alpharetta", pickupFrom: CLOSED })]);
    const pu = board.find((e) => e.stopType === "pickup");
    expect(pu.stop).toBe(NORCROSS);
    expect(pu.addr).toBe(docks("Emser Tile")[0].addr);
    expect(pu.addr).not.toContain("Hembree");
    expect(pu.note).toBe("Load order: BEC - Alpharetta, DCO Smyrna");
  });

  it("the leftover card and the open dock's card collapse into one", () => {
    const norCard = { ...rosCard(), id: "pu_nor", stop: NORCROSS, pickupFrom: "Norcross", addr: docks("Emser Tile")[0].addr };
    const board = shown([rosCard(), rosDel(), norCard, del({ stop: "B", pickupFrom: "Norcross" })]);
    expect(board.filter((e) => e.stopType === "pickup").map((p) => p.stop)).toEqual([NORCROSS]);
  });

  /* ── What already happened keeps saying so ─────────────────────────────── */
  it("a delivery already worked out of it still reads the dock it was worked from", () => {
    const d = rosDel(WORKED);
    expect(resolvePickupLabel(d, [d]).text).toBe(CLOSED);
  });

  it("a card the driver stamped there keeps its name and its address", () => {
    const board = shown([rosCard(WORKED), rosDel(WORKED)]);
    const pu = board.find((e) => e.stopType === "pickup");
    expect(pu.stop).toBe(CLOSED);
    expect(pu.addr).toBe(HEMBREE);
  });

  it("a worked card is never folded into the open dock's card", () => {
    const norCard = { ...rosCard(), id: "pu_nor", stop: NORCROSS, pickupFrom: "Norcross", addr: docks("Emser Tile")[0].addr };
    const board = shown([rosCard(WORKED), rosDel(WORKED), norCard, del({ stop: "B", pickupFrom: "Norcross" })]);
    expect(board.filter((e) => e.stopType === "pickup").map((p) => p.stop).sort()).toEqual([NORCROSS, CLOSED]);
  });

  /* ── The dispatcher's own plans are theirs to change ───────────────────── */
  it("a MANUAL pickup scheduled there is left alone, and does not stand in for the dock", () => {
    const manual = mpu({ stop: CLOSED, addr: HEMBREE, note: "Return pallets" });
    expect(sanitizeEntry(manual).stop).toBe(CLOSED);
    expect(sanitizeEntry(manual).addr).toBe(HEMBREE);
    const all = rebuildPickupsForPure([manual, del({ stop: "A" })], "Emser Tile", deps());
    const board = shown(all);
    expect(board.find((e) => e.manualPickup).stop).toBe(CLOSED); /* still visible, to be deleted */
    expect(cards(board).map((p) => p.stop)).toEqual([NORCROSS]);
    expect(live(card(board, NORCROSS), board)).toBe("Load order: A");
  });

  it("one edit rebuilds a day planned against it onto the open dock", () => {
    const rebuilt = rebuildPickupsForPure([rosCard(), rosDel(), del({ stop: "B", pickupFrom: CLOSED })], "Emser Tile", deps());
    expect(cards(rebuilt).map((p) => p.stop)).toEqual([NORCROSS]);
    expect(cards(rebuilt)[0].addr).toBe(docks("Emser Tile")[0].addr);
  });
});
