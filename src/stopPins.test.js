import { describe, it, expect } from "vitest";
import { stopPinFill, isEmserStop, isDoneStop, doneStopSvg, DONE_GREEN, DONE_PIN_PX } from "./manifestLogic.js";

/* What a stop looks like on the map. The board has always flagged finished work
   with a green DONE tag on the card; the map showed a small faded dot, a cue
   that only reads if you already know the size means something. */

const stop = (over = {}) => ({ id: "s1", stop: "DCO Smyrna", customer: "Florida Tile", ...over });
const done = (over = {}) => stop({ status: "departed", ...over });

describe("a finished stop", () => {
  it("is green, whoever it belongs to and whatever kind of stop it is", () => {
    ["Emser Tile", "Florida Tile", "IMETCO", "Quote Delivery", "One-Off Delivery"].forEach(c => {
      expect(stopPinFill(done({ customer: c }), { done: true }), c).toBe(DONE_GREEN);
    });
    expect(stopPinFill(done({ stopType: "pickup" }), { done: true })).toBe(DONE_GREEN);
  });

  it("is green whether or not anyone was ever assigned to it", () => {
    expect(stopPinFill(done(), { done: true, unassigned: true })).toBe(DONE_GREEN);
    expect(stopPinFill(done(), { done: true, unassigned: false })).toBe(DONE_GREEN);
  });

  it("is the same green the board puts on the card", () => {
    /* #16a34a is the DONE tag, the ✅ departed stamp and the progress bar. */
    expect(DONE_GREEN).toBe("#16a34a");
  });
});

describe("what counts as finished", () => {
  it("is departed, and only departed", () => {
    expect(isDoneStop(stop({ status: "departed" }))).toBe(true);
    expect(isDoneStop(stop({ status: "arrived" }))).toBe(false);
    expect(isDoneStop(stop({ status: "pending" }))).toBe(false);
    expect(isDoneStop(stop())).toBe(false);
  });

  it("does not take a driver standing on site as finished", () => {
    /* On site is amber and pulsing — it is the stop still being worked. */
    expect(stopPinFill(stop({ status: "arrived" }), { done: false })).not.toBe(DONE_GREEN);
  });

  it("survives junk without throwing", () => {
    expect(isDoneStop(null)).toBe(false);
    expect(isDoneStop(undefined)).toBe(false);
    expect(isDoneStop({})).toBe(false);
  });
});

describe("the check mark itself", () => {
  const svg = doneStopSvg();

  it("is a check, not a dot", () => {
    expect(svg).toContain("<path");
    expect(svg).toMatch(/stroke-linecap="round"/);
  });

  it("carries a white ring so it reads over satellite imagery", () => {
    /* The map gained a satellite toggle; a green disc on green tree cover
       disappears without it. */
    expect(svg).toContain('stroke="#fff"');
  });

  it("is green by default and takes the fill it is given", () => {
    expect(doneStopSvg()).toContain(DONE_GREEN);
    expect(doneStopSvg("#123456")).toContain("#123456");
  });

  it("draws at the size the marker anchors to", () => {
    expect(DONE_PIN_PX).toBe(18);
    expect(svg).toContain('width="18"');
    expect(svg).toContain('viewBox="0 0 18 18"');
  });

  it("stays inside its own box once the ring is stroked", () => {
    /* r=8 with a 2px stroke spans 0..18 exactly; any bigger and the ring clips. */
    expect(svg).toContain('r="8"');
    expect(svg).toContain('stroke-width="2"');
  });

  it("survives being put in a data URI", () => {
    expect(() => encodeURIComponent(svg)).not.toThrow();
    expect(decodeURIComponent(encodeURIComponent(svg))).toBe(svg);
  });
});

describe("Emser keeps its blue while the work is still to be done", () => {
  const emser = { customer: "Emser Tile", stop: "DCO Smyrna" };

  it("is blue assigned and unassigned alike", () => {
    expect(stopPinFill(emser, {})).toBe("#2563eb");
    expect(stopPinFill(emser, { unassigned: true })).toBe("#2563eb");
  });

  it("but green once it is done — finished beats the customer colour", () => {
    expect(stopPinFill(emser, { done: true })).toBe(DONE_GREEN);
    expect(stopPinFill(emser, { done: true, unassigned: true })).toBe(DONE_GREEN);
  });

  it("leaves every other customer's live pin exactly as it was", () => {
    const ft = { customer: "Florida Tile", stop: "X" };
    expect(stopPinFill(ft, {})).toBe("#2563eb");
    expect(stopPinFill(ft, { unassigned: true })).toBe("#d97706");
  });

  it("matches the customer however the name was cased or padded", () => {
    expect(isEmserStop({ customer: " emser tile " })).toBe(true);
    expect(isEmserStop({ customer: "EMSER TILE" })).toBe(true);
  });

  it("does not catch a lookalike or a missing customer", () => {
    expect(isEmserStop({ customer: "Emser" })).toBe(false);
    expect(isEmserStop({ customer: "Emser Tile Warehouse" })).toBe(false);
    expect(isEmserStop({ stop: "Emser Tile" })).toBe(false);
    expect(isEmserStop({})).toBe(false);
    expect(isEmserStop(null)).toBe(false);
  });

  it("defaults are the no-flags case, so a bare call is the live colour", () => {
    expect(stopPinFill({ customer: "Florida Tile" })).toBe("#2563eb");
    expect(stopPinFill({ customer: "Emser Tile" })).toBe("#2563eb");
  });
});
