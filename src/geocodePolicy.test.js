import { describe, it, expect } from "vitest";
import {
  classifyGoogleStatus, geocodeDecision, nextFailure, retryDelayMs, nominatimQuery, mapStatusLabel,
  RETRY_BASE_MS, RETRY_CAP_MS, LOOKUP_TIMEOUT_MS,
} from "./geocodePolicy.js";

/* The field report: Precision Flooring - Norcross, at 1750 Corporate Drive,
   Suite 740 — an address Google finds to the rooftop and OpenStreetMap's
   Nominatim can't find at all — had no pin on the board. */
const PRECISION = "1750 Corporate Drive, Suite 740, Norcross, GA 30093";
const NOW = 1_790_000_000_000;

describe("never spend an address on a worse source because Maps is still loading", () => {
  it("waits for Google when it hasn't loaded — the first look at every uncached address on every page load", () => {
    expect(geocodeDecision({ googleReady: false, pending: false, failure: null, now: NOW })).toBe("wait-for-google");
  });

  it("asks Google once it's ready", () => {
    expect(geocodeDecision({ googleReady: true, pending: false, failure: null, now: NOW })).toBe("google");
  });

  it("never asks twice at once", () => {
    expect(geocodeDecision({ googleReady: true, pending: true, failure: null, now: NOW })).toBe("wait");
    expect(geocodeDecision({ googleReady: false, pending: true, failure: null, now: NOW })).toBe("wait");
  });
});

describe("what a Google answer means", () => {
  it("OK is an answer", () => {
    expect(classifyGoogleStatus("OK")).toBe("ok");
  });

  it("'no such place' is worth a second opinion, not a second ask", () => {
    ["ZERO_RESULTS", "NOT_FOUND", "INVALID_REQUEST", "REQUEST_DENIED"].forEach((st) =>
      expect(classifyGoogleStatus(st), st).toBe("fallback"));
  });

  it("a rate limit or a hiccup means ask Google again later — not Nominatim now", () => {
    /* Nominatim finds nothing at 1750 Corporate Drive; a throttled Google
       would, a minute later. */
    ["OVER_QUERY_LIMIT", "UNKNOWN_ERROR", "ERROR", undefined, null, "SOMETHING_NEW"].forEach((st) =>
      expect(classifyGoogleStatus(st), String(st)).toBe("retry"));
  });
});

describe("a failure backs off instead of retrying every redraw", () => {
  it("doubles from 15 seconds and stops at half an hour", () => {
    expect(RETRY_BASE_MS).toBe(15000);
    expect([1, 2, 3, 4].map(retryDelayMs)).toEqual([15000, 30000, 60000, 120000]);
    expect(retryDelayMs(20)).toBe(RETRY_CAP_MS);
    expect(RETRY_CAP_MS).toBe(30 * 60 * 1000);
  });

  it("treats a missing or junk count as the first try", () => {
    [0, -3, undefined, null, "x"].forEach((n) => expect(retryDelayMs(n), String(n)).toBe(15000));
  });

  it("counts failures up and schedules the next try", () => {
    const f1 = nextFailure(null, NOW);
    expect(f1).toEqual({ tries: 1, retryAt: NOW + 15000 });
    const f2 = nextFailure(f1, NOW + 20000);
    expect(f2).toEqual({ tries: 2, retryAt: NOW + 20000 + 30000 });
  });

  it("holds off inside the window and asks again once it has passed", () => {
    const f = nextFailure(null, NOW);
    expect(geocodeDecision({ googleReady: true, pending: false, failure: f, now: NOW + 14999 })).toBe("wait");
    expect(geocodeDecision({ googleReady: true, pending: false, failure: f, now: NOW + 15000 })).toBe("google");
  });

  it("a lookup that never answers is given up on well inside a minute", () => {
    /* Before, a hung request left the address marked in-progress for the rest
       of the session — never looked up again. */
    expect(LOOKUP_TIMEOUT_MS).toBeLessThanOrEqual(30000);
    expect(LOOKUP_TIMEOUT_MS).toBeGreaterThanOrEqual(5000);
  });
});

describe("what Nominatim is asked", () => {
  it("drops the suite — the building is the same building", () => {
    expect(nominatimQuery(PRECISION)).toBe("1750 Corporate Drive, Norcross, GA 30093");
  });

  it("handles every way a unit gets written", () => {
    const cases = {
      "1750 Corporate Dr Ste 700, Norcross, GA 30093": "1750 Corporate Dr, Norcross, GA 30093",
      "1750 Corporate Dr #740, Norcross, GA 30093": "1750 Corporate Dr, Norcross, GA 30093",
      "1275 Oakbrook Drive, Suite D, Norcross, GA 30093": "1275 Oakbrook Drive, Norcross, GA 30093",
      "4301 Pleasantdale Road, Suite A, Doraville, GA 30340": "4301 Pleasantdale Road, Doraville, GA 30340",
      "100 Main St, Unit 4-B, Buford, GA 30518": "100 Main St, Buford, GA 30518",
      "5 Peachtree Pl, Bldg 3, Atlanta, GA": "5 Peachtree Pl, Atlanta, GA",
      "5 Peachtree Pl, Building C, Atlanta, GA": "5 Peachtree Pl, Atlanta, GA",
      "9 Elm St Apt. 12, Decatur, GA": "9 Elm St, Decatur, GA",
      "9 Elm St, Floor 2, Decatur, GA": "9 Elm St, Decatur, GA",
    };
    Object.entries(cases).forEach(([a, want]) => expect(nominatimQuery(a), a).toBe(want));
  });

  it("tidies a stray doubled comma from a hand-typed address", () => {
    expect(nominatimQuery("100 Main St,, Buford, GA 30518")).toBe("100 Main St, Buford, GA 30518");
    expect(nominatimQuery("100 Main St , , Buford, GA")).toBe("100 Main St, Buford, GA");
  });

  it("leaves a plain address exactly as it was", () => {
    ["2900 Highlands Pkwy SE, Smyrna, GA 30082", "5470 Oakbrook Pkwy, Norcross, GA 30093"].forEach((a) =>
      expect(nominatimQuery(a)).toBe(a));
  });

  it("does not eat a street whose name merely contains a unit word", () => {
    /* 'Suite' only as its own word: Sweetwater, Stewart, Aptos all survive. */
    expect(nominatimQuery("1 Sweetwater Rd, Lawrenceville, GA")).toBe("1 Sweetwater Rd, Lawrenceville, GA");
    expect(nominatimQuery("40 Stewart Ave, Atlanta, GA")).toBe("40 Stewart Ave, Atlanta, GA");
    expect(nominatimQuery("12 Aptos Way, Duluth, GA")).toBe("12 Aptos Way, Duluth, GA");
  });

  it("survives junk", () => {
    expect(nominatimQuery(null)).toBe("");
    expect(nominatimQuery(undefined)).toBe("");
    expect(nominatimQuery("")).toBe("");
    expect(nominatimQuery("Suite 5")).toBe("");
  });
});

describe("what the board says about a stop it can't pin", () => {
  it("names each state in plain words", () => {
    expect(mapStatusLabel("no-address")).toBe("no address on file");
    expect(mapStatusLabel("waiting")).toBe("waiting for the map to load");
    expect(mapStatusLabel("pending")).toBe("locating…");
    expect(mapStatusLabel("failed")).toBe("address not found");
  });

  it("says nothing for a stop that is on the map", () => {
    expect(mapStatusLabel("ok")).toBe("");
    expect(mapStatusLabel(undefined)).toBe("");
  });
});
