import { describe, it, expect } from "vitest";
import {
  GPS_FRESH_MS, mergeDriverLocs, lastKnownLoc, gpsAgeMs, gpsAgeLabel,
  gpsIsFresh, hasFix, locUpdatedAtMs,
} from "./manifestLogic.js";

const NOW = Date.parse("2026-09-22T15:00:00Z");
const ago = (ms, over = {}) => ({ lat: 33.9, lng: -84.2, updatedAt: NOW - ms, ...over });
const MIN = 60000, HR = 3600000;

describe("reading the clock on a fix", () => {
  it("takes a number or an ISO string", () => {
    expect(locUpdatedAtMs({ updatedAt: NOW })).toBe(NOW);
    expect(locUpdatedAtMs({ updatedAt: "2026-09-22T15:00:00Z" })).toBe(NOW);
  });

  it("returns null for no clock, junk, or no record at all", () => {
    [null, undefined, {}, { updatedAt: null }, { updatedAt: "not a date" }, { updatedAt: NaN }]
      .forEach(l => expect(locUpdatedAtMs(l)).toBe(null));
  });

  it("never reports a negative age when a phone's clock runs fast", () => {
    expect(gpsAgeMs({ updatedAt: NOW + 5 * MIN }, NOW)).toBe(0);
  });
});

describe("what counts as a fix", () => {
  it("needs both coordinates and they have to be numbers", () => {
    expect(hasFix({ lat: 33.9, lng: -84.2 })).toBe(true);
    expect(hasFix({ lat: 33.9 })).toBe(false);
    expect(hasFix({ lat: null, lng: -84.2 })).toBe(false);
    expect(hasFix({ lat: "nope", lng: -84.2 })).toBe(false);
    expect(hasFix(null)).toBe(false);
  });

  it("0,0 is a real coordinate, not a missing one", () => {
    /* Null Island is in the Gulf of Guinea, but lat 0 must not read as absent. */
    expect(hasFix({ lat: 0, lng: 0 })).toBe(true);
  });
});

describe("how old a fix is allowed to be", () => {
  it("a ping from this shift pins; one from last week does not", () => {
    expect(gpsIsFresh(ago(4 * MIN), NOW)).toBe(true);
    expect(gpsIsFresh(ago(11 * HR), NOW)).toBe(true);
    expect(gpsIsFresh(ago(96 * HR), NOW)).toBe(false);
    expect(gpsIsFresh(ago(258 * HR), NOW)).toBe(false);
  });

  it("the cutoff is inclusive and outlasts a full shift", () => {
    expect(GPS_FRESH_MS).toBe(12 * HR);
    expect(gpsIsFresh(ago(GPS_FRESH_MS), NOW)).toBe(true);
    expect(gpsIsFresh(ago(GPS_FRESH_MS + 1), NOW)).toBe(false);
  });

  it("a fix with no clock is still drawn — a missing field must not hide a truck", () => {
    expect(gpsIsFresh({ lat: 33.9, lng: -84.2 }, NOW)).toBe(true);
  });

  it("but it is never dated 'just now'", () => {
    expect(gpsAgeLabel({ lat: 33.9, lng: -84.2 }, NOW)).toBe("age unknown");
  });

  it("no coordinates is never fresh, however recent the write", () => {
    expect(gpsIsFresh({ updatedAt: NOW }, NOW)).toBe(false);
  });
});

describe("how an age reads", () => {
  it("counts up in the unit a dispatcher would use", () => {
    expect(gpsAgeLabel(ago(20000), NOW)).toBe("just now");
    expect(gpsAgeLabel(ago(7 * MIN), NOW)).toBe("7m ago");
    expect(gpsAgeLabel(ago(3 * HR), NOW)).toBe("3h ago");
    expect(gpsAgeLabel(ago(47 * HR), NOW)).toBe("47h ago");
  });

  it("switches to days before it reads like a defect", () => {
    /* The panel showed "258h ago". Nobody counts ten days in hours. */
    expect(gpsAgeLabel(ago(258 * HR), NOW)).toBe("11d ago");
    expect(gpsAgeLabel(ago(96 * HR), NOW)).toBe("4d ago");
  });
});

describe("merging the truck gateway and the driver's phone", () => {
  const phone = { 1: ago(30 * MIN, { source: "phone" }) };
  const motive = { 1: ago(2 * MIN, { source: "motive" }) };

  it("the newer fix wins, whichever source wrote it", () => {
    expect(mergeDriverLocs(phone, motive, {}, NOW)[1].source).toBe("motive");
    expect(mergeDriverLocs(motive, phone, {}, NOW)[1].source).toBe("motive");
  });

  it("a fresh phone ping beats a Motive fix the gateway logged hours ago", () => {
    const old = { 1: ago(5 * HR, { source: "motive" }) };
    const now = { 1: ago(1 * MIN, { source: "phone" }) };
    expect(mergeDriverLocs(now, old, {}, NOW)[1].source).toBe("phone");
  });

  it("a Firestore snapshot no longer drops every Motive fix on the board", () => {
    /* The reported symptom: the map replaced its whole location table each time
       any phone wrote, so trucks vanished until the next poll twenty seconds on. */
    const merged = mergeDriverLocs({ 2: ago(1 * MIN) }, { 1: ago(1 * MIN) }, {}, NOW);
    expect(Object.keys(merged).sort()).toEqual(["1", "2"]);
  });

  it("drops a fix too old to pin, from either side", () => {
    const merged = mergeDriverLocs({ 3: ago(96 * HR) }, { 4: ago(258 * HR) }, {}, NOW);
    expect(merged).toEqual({});
  });

  it("keeps the newest of two stale fixes out just the same", () => {
    const merged = mergeDriverLocs({ 1: ago(20 * HR) }, { 1: ago(13 * HR) }, {}, NOW);
    expect(merged[1]).toBeUndefined();
  });

  it("GPS off silences both sources, not just the poll", () => {
    /* The toggle used to delete the entry once; the next Firestore snapshot put
       the phone ping straight back and the pin returned on its own. */
    expect(mergeDriverLocs(phone, motive, { 1: false }, NOW)).toEqual({});
    expect(mergeDriverLocs(phone, motive, { 1: true }, NOW)[1]).toBeTruthy();
    expect(mergeDriverLocs(phone, motive, {}, NOW)[1]).toBeTruthy();
  });

  it("only active===false silences a driver — an absent entry is on", () => {
    expect(mergeDriverLocs(phone, motive, { 1: undefined }, NOW)[1]).toBeTruthy();
    expect(mergeDriverLocs(phone, motive, { 2: false }, NOW)[1]).toBeTruthy();
  });

  it("ignores a record with no coordinates", () => {
    expect(mergeDriverLocs({ 1: { updatedAt: NOW } }, {}, {}, NOW)).toEqual({});
  });

  it("survives junk without throwing", () => {
    expect(mergeDriverLocs(null, null, null, NOW)).toEqual({});
    expect(mergeDriverLocs(undefined, undefined, undefined, NOW)).toEqual({});
    expect(mergeDriverLocs({ 1: null }, { 2: undefined }, {}, NOW)).toEqual({});
  });
});

describe("what the panel can still say once the pin is gone", () => {
  it("reports the newest fix on record however old it is", () => {
    const phone = { 1: ago(258 * HR, { source: "phone" }) };
    const motive = { 1: ago(300 * HR, { source: "motive" }) };
    expect(lastKnownLoc(phone, motive, 1).source).toBe("phone");
    expect(gpsAgeLabel(lastKnownLoc(phone, motive, 1), NOW)).toBe("11d ago");
  });

  it("is null for a driver who has never pinged at all", () => {
    expect(lastKnownLoc({}, {}, 7)).toBe(null);
    expect(lastKnownLoc(null, null, 7)).toBe(null);
    expect(lastKnownLoc({ 7: { updatedAt: NOW } }, {}, 7)).toBe(null);
  });

  it("does not resurrect the record the merge rejected — it only dates it", () => {
    const phone = { 1: ago(96 * HR) };
    expect(mergeDriverLocs(phone, {}, {}, NOW)[1]).toBeUndefined();
    expect(lastKnownLoc(phone, {}, 1)).toBeTruthy();
  });
});
