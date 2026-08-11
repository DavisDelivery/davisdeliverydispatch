import { describe, it, expect } from "vitest";
import { visibleTruckDriverIds } from "./manifestLogic.js";

/* Motive reports the whole fleet. The map should only pin the trucks of the
   crew actually being dispatched — the same "current fleet" rule every other
   driver list in the app runs on. */

const drv = (id, name, over = {}) => ({ id, name, phone: "", ...over });
const stop = (driverId, over = {}) => ({ id: "s" + driverId, driverId, stop: "X", ...over });

const ROSTER = [
  drv(1, "Trevor Davis"),
  drv(2, "Brent Dunn"),
  drv(3, "Trevarr Mills"),
  drv(4, "Darvin Rodriguez"),
  drv(5, "Gary Pitts", { active: false }),
  drv(6, "Marcus Crumpton", { active: false }),
  drv(7, "Seymour Watts", { active: false }),
];

describe("which trucks get a pin", () => {
  it("pins the active crew and leaves the retired trucks off the map", () => {
    const ids = visibleTruckDriverIds(ROSTER, []);
    expect([...ids].sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
  });

  it("is exactly the fleet size, not the Motive fleet size", () => {
    /* The reported symptom: four drivers on the board, seven trucks on the map. */
    expect(visibleTruckDriverIds(ROSTER, []).size).toBe(4);
  });

  it("treats a missing active field as active — pre-existing drivers keep working", () => {
    const legacy = [{ id: 1, name: "Trevor Davis" }, { id: 2, name: "Brent Dunn", active: true }];
    expect(visibleTruckDriverIds(legacy, []).size).toBe(2);
  });

  it("only active===false hides — no other falsy value counts", () => {
    [undefined, true, 1, "yes", null, 0, ""].forEach(v => {
      const hidden = visibleTruckDriverIds([drv(9, "X", { active: v })], []).has(9);
      expect(hidden, String(v)).toBe(v !== false);
    });
    expect(visibleTruckDriverIds([drv(9, "X", { active: false })], []).has(9)).toBe(false);
  });

  it("still pins a hidden driver who is out running stops today", () => {
    /* Hiding the truck of someone actively working is worse than one extra pin. */
    const ids = visibleTruckDriverIds(ROSTER, [stop(5)]);
    expect(ids.has(5)).toBe(true);
    expect(ids.has(6)).toBe(false);
    expect(ids.has(7)).toBe(false);
  });

  it("does not resurrect a hidden driver from unassigned stops", () => {
    /* driverId 0 is the unassigned column, not a driver. */
    const ids = visibleTruckDriverIds(ROSTER, [stop(0), { id: "z", driverId: null }, { id: "y" }]);
    expect([...ids].sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
  });

  it("a corrupt driver record isn't rescued by a corrupt stop", () => {
    /* Both sides missing an id must not collide into "this driver is on the
       board". Without the id>0 guard, onBoard picks up undefined from the
       stop, and a hidden driver whose id is also undefined gets pinned. */
    const roster = [{ name: "Ghost", active: false }, { id: undefined, name: "Ghost2", active: false }];
    const ids = visibleTruckDriverIds(roster, [{ id: "s", stop: "X" }, { id: "t", driverId: undefined }]);
    expect(ids.size).toBe(0);
  });

  it("does not pin a stop's driver who isn't on the roster at all", () => {
    const ids = visibleTruckDriverIds(ROSTER, [stop(999)]);
    expect(ids.has(999)).toBe(false);
  });

  it("survives junk without throwing", () => {
    expect(visibleTruckDriverIds(null, null).size).toBe(0);
    expect(visibleTruckDriverIds(undefined, undefined).size).toBe(0);
    expect(visibleTruckDriverIds([], []).size).toBe(0);
    expect(visibleTruckDriverIds([null, undefined, drv(1, "A")], [null, undefined]).size).toBe(1);
  });

  it("hiding a driver removes their pin; unhiding brings it back", () => {
    const on = ROSTER.map(d => (d.id === 4 ? { ...d, active: true } : d));
    const off = ROSTER.map(d => (d.id === 4 ? { ...d, active: false } : d));
    expect(visibleTruckDriverIds(on, []).has(4)).toBe(true);
    expect(visibleTruckDriverIds(off, []).has(4)).toBe(false);
    expect(visibleTruckDriverIds(on, []).has(4)).toBe(true);
  });

  it("the dep key the map builds is stable across identical rosters", () => {
    /* The effect keys off a sorted id string; equal input must give an equal
       key or the markers would tear down and rebuild on every render. */
    const key = (ds, ss) => [...visibleTruckDriverIds(ds, ss)].sort((a, b) => a - b).join(",");
    expect(key(ROSTER, [stop(1)])).toBe(key([...ROSTER], [stop(1)]));
    expect(key(ROSTER, [stop(1), stop(2)])).toBe(key(ROSTER, [stop(2), stop(1)]));
    expect(key(ROSTER, [])).not.toBe(key(ROSTER, [stop(5)]));
  });
});
