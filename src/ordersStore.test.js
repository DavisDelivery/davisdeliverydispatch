import { describe, it, expect } from "vitest";
import {
  stableStr,
  orderDocId,
  entryToOrderDoc,
  orderDocsToEntries,
  diffOrderDocs,
  ordersParity,
} from "./ordersStore.js";

const del = (o = {}) => ({ id: "d_" + Math.random().toString(36).slice(2), customer: "Cust", stop: "Stop", addr: "Addr", stopType: "delivery", driverId: 5, loadNum: 1, baseRate: 100, photos: [], ...o });
const DAY = "2026-07-10";

/* ====================================================================== */
describe("stableStr — key-order-independent content identity", () => {
  it("equal content with different key order compares equal", () => {
    expect(stableStr({ a: 1, b: { x: 1, y: 2 } })).toBe(stableStr({ b: { y: 2, x: 1 }, a: 1 }));
  });
  it("array order still matters (photos are ordered)", () => {
    expect(stableStr({ photos: ["a", "b"] })).not.toBe(stableStr({ photos: ["b", "a"] }));
  });
});

describe("orderDocId", () => {
  it("keeps normal ids and neutralizes path separators", () => {
    expect(orderDocId("e_12_ab")).toBe("e_12_ab");
    expect(orderDocId(42)).toBe("42");
    expect(orderDocId("bad/id")).toBe("bad_id");
  });
});

/* ====================================================================== */
describe("entryToOrderDoc / orderDocsToEntries — lossless round-trip", () => {
  it("adds storage fields and strips undefined values", () => {
    const doc = entryToOrderDoc(del({ id: "x", loadNum: undefined }), DAY, 3000);
    expect(doc._date).toBe(DAY);
    expect(doc._seq).toBe(3000);
    expect("loadNum" in doc).toBe(false); // Firestore rejects undefined
  });
  it("returns null for junk (no id / not an object)", () => {
    expect(entryToOrderDoc(null, DAY, 0)).toBeNull();
    expect(entryToOrderDoc({ customer: "X" }, DAY, 0)).toBeNull();
  });
  it("assembles entries sorted by _seq with storage fields stripped", () => {
    const docs = [
      entryToOrderDoc(del({ id: "b" }), DAY, 1000),
      entryToOrderDoc(del({ id: "a" }), DAY, 0),
      entryToOrderDoc(del({ id: "c" }), DAY, 2000),
    ];
    const ents = orderDocsToEntries([docs[0], docs[2], docs[1]]);
    expect(ents.map((e) => e.id)).toEqual(["a", "b", "c"]);
    expect(ents.every((e) => !("_seq" in e) && !("_date" in e))).toBe(true);
  });
  it("round-trips a day array with identical content", () => {
    const day = [del({ id: "a", note: "Friday" }), del({ id: "b", photos: ["https://x/p.jpg"] })];
    const docs = day.map((e, i) => entryToOrderDoc(e, DAY, i * 1000));
    const back = orderDocsToEntries(docs);
    expect(stableStr(back)).toBe(stableStr(JSON.parse(JSON.stringify(day))));
  });
  it("ties on _seq break deterministically by id (every device assembles the same order)", () => {
    const a = entryToOrderDoc(del({ id: "zz" }), DAY, 0);
    const b = entryToOrderDoc(del({ id: "aa" }), DAY, 0);
    expect(orderDocsToEntries([a, b]).map((e) => e.id)).toEqual(["aa", "zz"]);
    expect(orderDocsToEntries([b, a]).map((e) => e.id)).toEqual(["aa", "zz"]);
  });
});

/* ====================================================================== */
describe("diffOrderDocs — minimal per-order writes", () => {
  it("seeds every entry when the store is empty (the idempotent migration)", () => {
    const day = [del({ id: "a" }), del({ id: "b" })];
    const { sets, deletes, skipped } = diffOrderDocs([], day, DAY);
    expect(sets.map((d) => d.id)).toEqual(["a", "b"]);
    expect(deletes).toEqual([]);
    expect(skipped).toBe(0);
  });
  it("no changes → no writes, even when Firestore reordered the doc's keys", () => {
    const e = del({ id: "a", note: "n" });
    const doc = entryToOrderDoc(e, DAY, 0);
    const reordered = {}; // same content, reversed key order
    Object.keys(doc).reverse().forEach((k) => { reordered[k] = doc[k]; });
    const { sets, deletes } = diffOrderDocs([reordered], [e], DAY);
    expect(sets).toEqual([]);
    expect(deletes).toEqual([]);
  });
  it("an edit writes ONLY that order's doc", () => {
    const a = del({ id: "a" }), b = del({ id: "b" });
    const docs = [entryToOrderDoc(a, DAY, 0), entryToOrderDoc(b, DAY, 1000)];
    const { sets } = diffOrderDocs(docs, [a, { ...b, baseRate: 250 }], DAY);
    expect(sets.map((d) => d.id)).toEqual(["b"]);
  });
  it("a removed order becomes a real delete", () => {
    const a = del({ id: "a" }), b = del({ id: "b" });
    const docs = [entryToOrderDoc(a, DAY, 0), entryToOrderDoc(b, DAY, 1000)];
    const { sets, deletes } = diffOrderDocs(docs, [a], DAY);
    expect(sets).toEqual([]);
    expect(deletes).toEqual(["b"]);
  });
  it("a reorder rewrites only the displaced docs (via _seq)", () => {
    const a = del({ id: "a" }), b = del({ id: "b" }), c = del({ id: "c" });
    const docs = [a, b, c].map((e, i) => entryToOrderDoc(e, DAY, i * 1000));
    const { sets } = diffOrderDocs(docs, [b, a, c], DAY); // swap a and b; c stays at index 2
    expect(sets.map((d) => d.id).sort()).toEqual(["a", "b"]);
  });
  it("skips junk and duplicate-id entries (first occurrence wins)", () => {
    const a = del({ id: "a" });
    const { sets, skipped } = diffOrderDocs([], [a, { ...a, baseRate: 999 }, null, { customer: "no-id" }], DAY);
    expect(sets).toHaveLength(1);
    expect(sets[0].baseRate).toBe(100);
    expect(skipped).toBe(3);
  });
});

/* ====================================================================== */
describe("ordersParity — shadow store vs array board", () => {
  it("reports inSync for identical content regardless of order", () => {
    const day = [del({ id: "a" }), del({ id: "b" })];
    const docs = day.map((e, i) => entryToOrderDoc(e, DAY, i * 1000)).reverse();
    const p = ordersParity(docs, day);
    expect(p.inSync).toBe(true);
    expect(p.docCount).toBe(2);
  });
  it("flags missing, extra, and differing orders by id", () => {
    const a = del({ id: "a" }), b = del({ id: "b" }), c = del({ id: "c" });
    const docs = [entryToOrderDoc(a, DAY, 0), entryToOrderDoc({ ...b, baseRate: 999 }, DAY, 1000)];
    const p = ordersParity(docs, [a, b, c]);
    expect(p.inSync).toBe(false);
    expect(p.missing).toEqual(["c"]);
    expect(p.differing).toEqual(["b"]);
    expect(p.extra).toEqual([]);
  });
  it("undefined-vs-absent is NOT a difference (JSON normalization)", () => {
    const e = del({ id: "a", loadNum: undefined });
    const p = ordersParity([entryToOrderDoc(e, DAY, 0)], [e]);
    expect(p.inSync).toBe(true);
  });
});
