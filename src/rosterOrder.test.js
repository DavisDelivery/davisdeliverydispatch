import { describe, it, expect } from "vitest";
import { orderRosterRows } from "./manifestLogic.js";

/* The Manage Drivers list. Actives first in roster order (that order picks each
   driver's colour and board column), hidden drivers after them in alpha order. */

const d = (id, name, active) => (active === undefined ? { id, name } : { id, name, active });

/* The roster from the screenshot, in the insertion order it actually had. */
const ROSTER = [
  d(1, "Trevor Syers", true),
  d(2, "Brent Dixon", true),
  d(3, "Trevarr Howard", true),
  d(4, "Chad Davis", false),
  d(5, "Bill Tillery", false),
  d(6, "Gary Pitts", false),
  d(7, "Chris Head", false),
  d(8, "Michael Tharp", false),
  d(9, "Jim Pallette", false),
  d(10, "Marcus Crumpton", false),
  d(11, "Darvin Rodriguez", true),
  d(12, "Brian Worley", false),
  d(13, "Joe Gibbs", false),
  d(14, "Rasko", false),
  d(15, "Brent Byrd", false),
  d(16, "Che Roberts", false),
  d(17, "Michael Frye", false),
  d(18, "Seymour Watts", false),
  d(19, "Anthony Kostner", false),
];

const names = rows => rows.map(r => r.d.name);

describe("Manage Drivers display order", () => {
  it("puts every active driver ahead of every hidden one", () => {
    const rows = orderRosterRows(ROSTER);
    const lastActive = rows.map(r => r.d.active !== false).lastIndexOf(true);
    const firstHidden = rows.map(r => r.d.active !== false).indexOf(false);
    expect(firstHidden).toBe(lastActive + 1);
  });

  it("lifts Darvin out of the middle of the hidden block", () => {
    /* He was ON but sat 11th, buried between Marcus Crumpton and Brian Worley. */
    expect(names(orderRosterRows(ROSTER)).slice(0, 4)).toEqual([
      "Trevor Syers", "Brent Dixon", "Trevarr Howard", "Darvin Rodriguez",
    ]);
  });

  it("keeps the actives in roster order — colour and column depend on it", () => {
    const active = orderRosterRows(ROSTER).filter(r => r.d.active !== false);
    expect(active.map(r => r.i)).toEqual([0, 1, 2, 10]);
  });

  it("alphabetises the hidden drivers", () => {
    const hidden = names(orderRosterRows(ROSTER)).slice(4);
    expect(hidden).toEqual([
      "Anthony Kostner", "Bill Tillery", "Brent Byrd", "Brian Worley",
      "Chad Davis", "Che Roberts", "Chris Head", "Gary Pitts",
      "Jim Pallette", "Joe Gibbs", "Marcus Crumpton", "Michael Frye",
      "Michael Tharp", "Rasko", "Seymour Watts",
    ]);
    expect(hidden).toEqual([...hidden].sort((a, b) => a.localeCompare(b)));
  });

  it("carries the canonical roster index on every row", () => {
    const rows = orderRosterRows(ROSTER);
    rows.forEach(r => expect(ROSTER[r.i]).toBe(r.d));
  });

  it("loses nobody and duplicates nobody", () => {
    const rows = orderRosterRows(ROSTER);
    expect(rows).toHaveLength(ROSTER.length);
    expect(new Set(rows.map(r => r.d.id)).size).toBe(ROSTER.length);
  });

  it("treats a missing active field as active, like the rest of the app", () => {
    const roster = [d(1, "Zeb Legacy"), d(2, "Amy Hidden", false), d(3, "Bob On", true)];
    expect(names(orderRosterRows(roster))).toEqual(["Zeb Legacy", "Bob On", "Amy Hidden"]);
  });

  it("sorts case- and whitespace-insensitively", () => {
    const roster = [d(1, "  zeta  ", false), d(2, "Alpha", false), d(3, "beta", false)];
    expect(names(orderRosterRows(roster)).map(n => n.trim())).toEqual(["Alpha", "beta", "zeta"]);
  });

  it("is stable for duplicate names — the list never jitters", () => {
    const roster = [d(1, "Sam Same", false), d(2, "Sam Same", false), d(3, "Sam Same", false)];
    expect(orderRosterRows(roster).map(r => r.i)).toEqual([0, 1, 2]);
    expect(orderRosterRows(roster).map(r => r.i)).toEqual([0, 1, 2]);
  });

  it("does not mutate the roster it was handed", () => {
    const before = ROSTER.map(x => x.name);
    orderRosterRows(ROSTER);
    expect(ROSTER.map(x => x.name)).toEqual(before);
  });

  it("survives junk", () => {
    expect(orderRosterRows(null)).toEqual([]);
    expect(orderRosterRows(undefined)).toEqual([]);
    expect(orderRosterRows([])).toEqual([]);
    const messy = orderRosterRows([null, d(1, "A", false), undefined, d(2, "B", true)]);
    expect(messy).toHaveLength(4);
    expect(messy[0].d.name).toBe("B"); /* null/undefined rows count as hidden, sort last */
  });

  it("is idempotent — re-ordering an ordered list changes nothing", () => {
    const once = orderRosterRows(ROSTER);
    const twice = orderRosterRows(once.map(r => r.d));
    expect(names(twice)).toEqual(names(once));
  });
});
