import { describe, it, expect } from "vitest";
import { fanOutOffsets, spotKey, ringRadius, symbolAnchorFor, imageAnchorFor, MIN_GAP_PX, buildingMates } from "./mapLayout.js";

/* The field report: Precision Flooring (Suite 740) and Vanguard (Suite 700) are
   both 1750 Corporate Drive, Norcross, at identical coordinates. The routed
   Vanguard pin (20px) was drawn exactly over the unassigned Precision pin (16px),
   so Precision had "no pin on my map". */
const CORP = { lat: 33.9364, lng: -84.1418 };
const S = (id, coords) => ({ id, coords });
const dist = (a, b) => Math.hypot(a.dx - b.dx, a.dy - b.dy);

describe("a stop alone at its spot stays exactly where it is", () => {
  it("gets no offset", () => {
    const m = fanOutOffsets([S("a", CORP), S("b", { lat: 33.95, lng: -84.2 })]);
    expect(m.get("a")).toEqual({ dx: 0, dy: 0, n: 1, i: 0 });
    expect(m.get("b")).toEqual({ dx: 0, dy: 0, n: 1, i: 0 });
  });
});

describe("two deliveries in one building get two pins", () => {
  it("Precision and Vanguard sit side by side instead of one on top of the other", () => {
    const m = fanOutOffsets([S("vanguard", CORP), S("precision", CORP)]);
    const a = m.get("precision"), b = m.get("vanguard");
    expect(dist(a, b)).toBeGreaterThanOrEqual(MIN_GAP_PX);
    expect(a.dy).toBe(0);
    expect(b.dy).toBe(0);
    expect(Math.sign(a.dx)).toBe(-Math.sign(b.dx));
  });

  it("the spread is centred on the true point", () => {
    const m = fanOutOffsets([S("a", CORP), S("b", CORP), S("c", CORP)]);
    const sx = [...m.values()].reduce((t, o) => t + o.dx, 0);
    const sy = [...m.values()].reduce((t, o) => t + o.dy, 0);
    expect(Math.abs(sx)).toBeLessThanOrEqual(1);
    expect(Math.abs(sy)).toBeLessThanOrEqual(1);
  });

  it("no two pins in a crowded building are closer than the widest pin", () => {
    /* A routed pin is 20px across; MIN_GAP_PX is what keeps one off another. */
    expect(MIN_GAP_PX).toBeGreaterThan(20);
    for (let n = 2; n <= 12; n++) {
      const stops = Array.from({ length: n }, (_, i) => S("s" + i, CORP));
      const offs = [...fanOutOffsets(stops).values()];
      let min = Infinity;
      for (let i = 0; i < offs.length; i++) for (let j = i + 1; j < offs.length; j++) min = Math.min(min, dist(offs[i], offs[j]));
      expect(min, "n=" + n).toBeGreaterThanOrEqual(MIN_GAP_PX - 1.5); /* rounding to whole pixels */
    }
  });

  it("points a metre apart count as the same building", () => {
    const m = fanOutOffsets([S("a", CORP), S("b", { lat: 33.936402, lng: -84.141801 })]);
    expect(m.get("a").n).toBe(2);
  });

  it("a building twenty metres down the street is its own spot", () => {
    /* ~0.0002° of latitude. Grouping at a coarser grain would fan out pins
       that aren't touching and move them off their real buildings. */
    const m = fanOutOffsets([S("a", { lat: 33.93610, lng: -84.14182 }), S("b", { lat: 33.93629, lng: -84.14182 })]);
    expect(m.get("a")).toEqual({ dx: 0, dy: 0, n: 1, i: 0 });
    expect(m.get("b")).toEqual({ dx: 0, dy: 0, n: 1, i: 0 });
  });

  it("but the building next door does not", () => {
    const m = fanOutOffsets([S("a", CORP), S("b", { lat: 33.9370, lng: -84.1418 })]);
    expect(m.get("a").n).toBe(1);
    expect(m.get("b").n).toBe(1);
  });
});

describe("pins don't swap places on every redraw", () => {
  it("the same stops take the same slots whatever order the day is in", () => {
    const one = fanOutOffsets([S("vanguard", CORP), S("precision", CORP), S("x", CORP)]);
    const two = fanOutOffsets([S("x", CORP), S("precision", CORP), S("vanguard", CORP)]);
    ["vanguard", "precision", "x"].forEach((id) => expect(two.get(id)).toEqual(one.get(id)));
  });

  it("a stop listed twice is still one pin", () => {
    const m = fanOutOffsets([S("a", CORP), S("a", CORP), S("b", CORP)]);
    expect(m.get("a").n).toBe(2);
  });

  it("numeric and string ids are the same stop", () => {
    const m = fanOutOffsets([S(7, CORP), S("8", CORP)]);
    expect(m.get("7").n).toBe(2);
    expect(m.get("8").n).toBe(2);
  });
});

describe("the ring", () => {
  it("is 12px for a pair and grows with the crowd", () => {
    expect(ringRadius(1)).toBe(0);
    expect(ringRadius(2)).toBe(12);
    expect(ringRadius(6)).toBeGreaterThan(ringRadius(3));
  });
});

describe("where each kind of pin is anchored", () => {
  it("a symbol is anchored by the offset, negated, over its scale", () => {
    /* Google draws the path translated left and up by the anchor, in path units. */
    expect(symbolAnchorFor({ dx: -12, dy: 0 }, 10)).toEqual({ x: 1.2, y: 0 });
    expect(symbolAnchorFor({ dx: 12, dy: -6 }, 6)).toEqual({ x: -2, y: 1 });
  });

  it("an unmoved symbol keeps its natural anchor", () => {
    expect(symbolAnchorFor({ dx: 0, dy: 0 }, 8)).toEqual({ x: 0, y: 0 });
    expect(symbolAnchorFor(undefined, 8)).toEqual({ x: 0, y: 0 });
  });

  it("a bad scale can't divide by zero", () => {
    expect(symbolAnchorFor({ dx: 12, dy: 0 }, 0)).toEqual({ x: -12, y: 0 });
  });

  it("an image is anchored in pixels from its top-left corner", () => {
    expect(imageAnchorFor({ dx: 0, dy: 0 }, 18, 18)).toEqual({ x: 9, y: 9 });
    expect(imageAnchorFor({ dx: -12, dy: 0 }, 18, 18)).toEqual({ x: 21, y: 9 });
    expect(imageAnchorFor(undefined, 18, 18)).toEqual({ x: 9, y: 9 });
  });
});

describe("junk in, nothing out", () => {
  it("skips stops with no id or no usable coordinates", () => {
    const m = fanOutOffsets([null, {}, S(null, CORP), S("a", null), S("b", { lat: "x", lng: 1 }), S("c", CORP)]);
    expect([...m.keys()]).toEqual(["c"]);
    expect(spotKey(null)).toBe(null);
    expect(spotKey({ lat: NaN, lng: 1 })).toBe(null);
  });

  it("survives no stops at all", () => {
    expect(fanOutOffsets(null).size).toBe(0);
    expect(fanOutOffsets([]).size).toBe(0);
  });
});

describe("one click on a building takes the building", () => {
  /* The follow-up report: in click-to-assign, a click on 1750 Corporate Drive
     put one stop on the driver and left the other unassigned, hidden under it. */
  const OTHER = { lat: 33.95, lng: -84.2 };
  const D = (id, o = {}) => ({ id, coords: CORP, driverId: 0, stopType: "delivery", status: null, ...o });

  it("takes the other unassigned stop at the same building", () => {
    const precision = D("precision"), vanguard = D("vanguard");
    expect(buildingMates(vanguard, [precision, vanguard])).toEqual(["precision"]);
    expect(buildingMates(precision, [precision, vanguard])).toEqual(["vanguard"]);
  });

  it("takes every unassigned stop there, in a fixed order", () => {
    const all = [D("c"), D("a"), D("b")];
    expect(buildingMates(all[0], all)).toEqual(["a", "b"]);
    expect(buildingMates(all[0], [...all].reverse())).toEqual(["a", "b"]);
  });

  it("never takes a stop another driver already has", () => {
    /* A click never moves someone else's work. */
    expect(buildingMates(D("precision"), [D("precision"), D("vanguard", { driverId: 3 })])).toEqual([]);
  });

  it("never takes a finished stop", () => {
    expect(buildingMates(D("precision"), [D("vanguard", { status: "departed" })])).toEqual([]);
  });

  it("leaves auto pickups to follow their deliveries, but takes a manual one", () => {
    const auto = D("pu", { stopType: "pickup" });
    const manual = D("mpu", { stopType: "pickup", manualPickup: true });
    expect(buildingMates(D("x"), [auto, manual])).toEqual(["mpu"]);
  });

  it("leaves the building next door alone", () => {
    expect(buildingMates(D("precision"), [D("elsewhere", { coords: OTHER })])).toEqual([]);
  });

  it("never lists the clicked stop, however its id is spelled", () => {
    expect(buildingMates(D(7), [D("7"), D(8)])).toEqual([8]);
  });

  it("lists a stop once even if the day carries it twice", () => {
    expect(buildingMates(D("x"), [D("y"), D("y")])).toEqual(["y"]);
  });

  it("uses whatever 'already assigned' means to the caller", () => {
    /* The planners keep assignment in their own route lists, not on driverId. */
    const planned = new Set(["vanguard"]);
    expect(buildingMates(D("precision"), [D("vanguard")], (s) => planned.has(s.id))).toEqual([]);
    expect(buildingMates(D("precision"), [D("vanguard")], () => false)).toEqual(["vanguard"]);
  });

  it("has nothing to say about a stop with no coordinates", () => {
    expect(buildingMates(D("x", { coords: null }), [D("y")])).toEqual([]);
    /* Two stops with no location are not one building: without the guard,
       null === null and a click on one address-less stop took all the others. */
    expect(buildingMates(D("x", { coords: null }), [D("y", { coords: null }), D("z", { coords: undefined })])).toEqual([]);
    expect(buildingMates(null, [D("y")])).toEqual([]);
    expect(buildingMates(D("x"), null)).toEqual([]);
  });
});
