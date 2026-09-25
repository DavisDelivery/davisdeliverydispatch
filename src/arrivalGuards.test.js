import { describe, it, expect } from "vitest";
import {
  arrivalWarnings, openStopsFor, pickupForDelivery, driversWithOverlap,
  withLiveLoadOrder, liveLoadOrderNote,
} from "./manifestLogic.js";
import { PICKUP_SOURCES, normLoc } from "./pickupConfig.js";

const DEPS = { pickupSources: PICKUP_SOURCES, normLoc };

/* The field report. Tyrese was loading at Emser - Norcross when he needed a
   liftgate approved for ProSource. The liftgate button only existed on an
   arrived stop, so he tapped Arrived on ProSource at 8:47 — a minute before he
   reached the dock and four before he left it. Precision he really did arrive
   at, and never closed. The board showed him on site at two places at once. */
const E = (o) => ({ id: "x", customer: "Emser Tile", driverId: 7, loadNum: 1, stopType: "delivery", status: null, arrivedAt: null, departedAt: null, ...o });

const DAY = [
  E({ id: "pu", stop: "Emser - Norcross", stopType: "pickup", pickupFrom: "Emser - Norcross", status: "departed", arrivedAt: "8:48 AM", departedAt: "8:51 AM" }),
  E({ id: "prec", stop: "Precision Flooring - Norcross", status: "arrived", arrivedAt: "8:54 AM" }),
  E({ id: "pros", stop: "ProSource - Norcross", status: "arrived", arrivedAt: "8:47 AM" }),
  E({ id: "van", stop: "Vanguard - Norcross", status: "departed", arrivedAt: "9:16 AM", departedAt: "9:21 AM" }),
  E({ id: "geo", stop: "Georgia Flooring/Holcomb" }),
];

describe("stops the driver has not closed", () => {
  it("finds the ones still open, and never the stop being acted on", () => {
    expect(openStopsFor(DAY, 7, "geo").map(e => e.id).sort()).toEqual(["prec", "pros"]);
    expect(openStopsFor(DAY, 7, "prec").map(e => e.id)).toEqual(["pros"]);
  });

  it("a departed stop is closed however it was stamped", () => {
    expect(openStopsFor(DAY, 7, null).map(e => e.id).sort()).toEqual(["prec", "pros"]);
  });

  it("an arrival stamp with no status still counts as open", () => {
    /* A row that lost its status field in a merge is still a truck on a kerb. */
    const legacy = [E({ id: "a", stop: "A", status: null, arrivedAt: "9:00 AM" })];
    expect(openStopsFor(legacy, 7, null).map(e => e.id)).toEqual(["a"]);
  });

  it("a departure time closes the stop even when the status disagrees", () => {
    /* The two fields can diverge across a merge: DRIVER_OWNED_FIELDS carries
       status and departedAt separately, so a row can land here stamped
       departed while status still reads arrived. The stamp is the fact. */
    const torn = [E({ id: "t", stop: "T", status: "arrived", arrivedAt: "9:00 AM", departedAt: "9:30 AM" })];
    expect(openStopsFor(torn, 7, null)).toEqual([]);
    expect(driversWithOverlap(torn.concat(E({ id: "u", status: "arrived", arrivedAt: "9:05 AM" })))).toEqual([]);
  });

  it("does not reach across drivers", () => {
    expect(openStopsFor(DAY, 2, null)).toEqual([]);
  });

  it("survives junk", () => {
    expect(openStopsFor(null, 7, null)).toEqual([]);
    expect(openStopsFor([null, undefined], 7, null)).toEqual([]);
  });
});

describe("the board flags two places at once", () => {
  it("names the driver standing in two places", () => {
    expect(driversWithOverlap(DAY)).toEqual([7]);
  });

  it("says nothing when only one stop is open", () => {
    expect(driversWithOverlap(DAY.filter(e => e.id !== "pros"))).toEqual([]);
  });

  it("says nothing on a clean day", () => {
    expect(driversWithOverlap(DAY.map(e => ({ ...e, status: "departed", departedAt: "5:00 PM" })))).toEqual([]);
  });

  it("never flags the unassigned column", () => {
    const pool = [E({ id: "a", driverId: 0, status: "arrived", arrivedAt: "9:00 AM" }),
                  E({ id: "b", driverId: 0, status: "arrived", arrivedAt: "9:01 AM" })];
    expect(driversWithOverlap(pool)).toEqual([]);
  });
});

describe("which dock a delivery loads from", () => {
  it("finds the pickup on the same driver and load", () => {
    expect(pickupForDelivery(DAY[1], DAY, DEPS).id).toBe("pu");
  });

  it("a paired quote leg names its partner outright", () => {
    /* The partner is deliberately NOT first: without the pairId branch the
       fallback would pick the other yard and nobody would notice. */
    const day = [
      E({ id: "p2", customer: "Quote Delivery", stop: "Other Yard", stopType: "pickup", pairId: "zz" }),
      E({ id: "p1", customer: "Quote Delivery", stop: "Some Yard", stopType: "pickup", pairId: "q9" }),
      E({ id: "d1", customer: "Quote Delivery", stop: "Site", pairId: "q9" }),
    ];
    expect(pickupForDelivery(day[2], day, DEPS).id).toBe("p1");
    expect(pickupForDelivery(day[2], day, DEPS).stop).toBe("Some Yard");
  });

  it("is null when the day carries no pickup for it", () => {
    expect(pickupForDelivery(DAY[1], DAY.filter(e => e.id !== "pu"), DEPS)).toBe(null);
  });

  it("a pickup is never its own pickup", () => {
    expect(pickupForDelivery(DAY[0], DAY, DEPS)).toBe(null);
  });

  it("does not match a pickup on another driver or another load", () => {
    const other = DAY.map(e => (e.id === "pu" ? { ...e, driverId: 3 } : e));
    expect(pickupForDelivery(other[1], other, DEPS)).toBe(null);
    const load2 = DAY.map(e => (e.id === "pu" ? { ...e, loadNum: 2 } : e));
    expect(pickupForDelivery(load2[1], load2, DEPS)).toBe(null);
  });
});

describe("what an Arrived tap would contradict", () => {
  it("catches the stop he is still standing at", () => {
    const w = arrivalWarnings(DAY[4], DAY, DEPS);
    const open = w.find(x => x.kind === "open-stop");
    expect(open.stops.map(s => s.id).sort()).toEqual(["prec", "pros"]);
  });

  it("catches an arrival before the dock was left — the 8:47 stamp", () => {
    /* Replay the moment: the pickup is arrived, not yet departed. */
    const atDock = DAY.map(e => (e.id === "pu" ? { ...e, status: "arrived", departedAt: null } : e))
                      .map(e => (e.id === "pros" ? { ...e, status: null, arrivedAt: null } : e));
    const w = arrivalWarnings(atDock.find(e => e.id === "pros"), atDock, DEPS);
    expect(w.some(x => x.kind === "before-pickup")).toBe(true);
    expect(w.find(x => x.kind === "before-pickup").pickup.stop).toBe("Emser - Norcross");
  });

  it("says nothing once the dock has been left and nothing is open", () => {
    const clean = DAY.map(e => (e.status === "arrived" ? { ...e, status: "departed", departedAt: "9:30 AM" } : e));
    expect(arrivalWarnings(clean.find(e => e.id === "geo"), clean, DEPS)).toEqual([]);
  });

  it("reports both at once when both are true", () => {
    const atDock = DAY.map(e => (e.id === "pu" ? { ...e, status: "arrived", departedAt: null } : e));
    const kinds = arrivalWarnings(atDock.find(e => e.id === "geo"), atDock, DEPS).map(w => w.kind).sort();
    expect(kinds).toEqual(["before-pickup", "open-stop"]);
  });

  it("never warns about a stop against itself", () => {
    const w = arrivalWarnings(DAY.find(e => e.id === "prec"), DAY, DEPS);
    expect(w.find(x => x.kind === "open-stop").stops.map(s => s.id)).toEqual(["pros"]);
  });

  it("writes nothing — the day it was handed is untouched", () => {
    const before = JSON.stringify(DAY);
    arrivalWarnings(DAY[4], DAY, DEPS);
    expect(JSON.stringify(DAY)).toBe(before);
  });

  it("survives junk", () => {
    expect(arrivalWarnings(null, DAY, DEPS)).toEqual([]);
    expect(arrivalWarnings(DAY[4], null, DEPS)).toEqual([]);
    expect(arrivalWarnings(DAY[4], DAY, null)).toBeInstanceOf(Array);
  });
});

describe("every panel reads the same load order", () => {
  /* The Daily Log mapped the raw day and rendered the STORED note while the
     board computed it live, so one pickup read two different ways in two
     columns of the same screen. The note must not depend on which slice of the
     day it was handed. */
  const stored = DAY.map(e => (e.id === "pu" ? { ...e, note: "Load order: yesterday's order" } : e));

  it("the whole day and one driver's slice agree", () => {
    const whole = withLiveLoadOrder(stored.find(e => e.id === "pu"), stored, DEPS);
    const slice = stored.filter(e => e.driverId === 7);
    const perDriver = withLiveLoadOrder(slice.find(e => e.id === "pu"), slice, DEPS);
    expect(whole.note).toBe(perDriver.note);
  });

  it("and neither of them is the stale stored note", () => {
    const live = withLiveLoadOrder(stored.find(e => e.id === "pu"), stored, DEPS);
    expect(live.note).not.toContain("yesterday");
    expect(live.note).toBe(liveLoadOrderNote(stored[0], stored, DEPS));
  });

  it("a day holding two drivers' work does not leak across them", () => {
    const mixed = stored.concat([
      E({ id: "o1", driverId: 3, stop: "Someone Else's Stop" }),
      E({ id: "o2", driverId: 3, stop: "Emser - Norcross", stopType: "pickup", pickupFrom: "Emser - Norcross" }),
    ]);
    const mine = withLiveLoadOrder(mixed.find(e => e.id === "pu"), mixed, DEPS);
    expect(mine.note).not.toContain("Someone Else");
  });
});
