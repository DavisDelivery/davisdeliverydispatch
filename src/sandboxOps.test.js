import { describe, it, expect, vi } from "vitest";
import { makeSandboxOps, sandboxBlocksFetch, makeMemoryStorage, SANDBOX_ROUTE } from "./sandboxOps.js";

/* A stand-in for the real Firestore ops. Reads answer from `data`; every write
   method throws, so a single call that leaks through fails the test outright
   instead of hiding in a spy count. */
const fakeReal = (data = {}, cols = {}) => {
  const calls = [];
  const colUnsubs = [];
  const boom = (op) => (...a) => { calls.push([op, a[0]]); throw new Error("REAL " + op + " reached: " + a[0]); };
  return {
    calls, colUnsubs,
    read: vi.fn(async (p) => { calls.push(["read", p]); return p in data ? JSON.parse(JSON.stringify(data[p])) : null; }),
    onCol: vi.fn((col, cb) => {
      calls.push(["onCol", col]);
      setTimeout(() => cb((cols[col] || []).map((d) => ({ ...d }))), 0);
      const u = vi.fn();
      colUnsubs.push(u);
      return u;
    }),
    onDoc: boom("onDoc"),
    write: boom("write"), update: boom("update"), add: boom("add"),
    remove: boom("remove"), transaction: boom("transaction"), uploadFile: boom("uploadFile"),
  };
};
const tick = () => new Promise((r) => setTimeout(r, 5));
const MANIFEST = "manifests/2026-09-25";
const DAY = { entries: [{ id: "a", stop: "ProSource - Norcross", status: null }], deleted: [] };

describe("nothing the test app does reaches Firestore", () => {
  it("write, update, add, remove, transaction and upload all stay local", async () => {
    const real = fakeReal({ [MANIFEST]: DAY });
    const ops = makeSandboxOps(real);
    await ops.write(MANIFEST, { entries: [] });
    await ops.update("liftgateRequests/x", { status: "pending" });
    await ops.add("auditLog", { action: "status_change" });
    await ops.remove("liftgateRequests/x");
    await ops.transaction(MANIFEST, (cur) => ({ ...cur, entries: [] }));
    await ops.uploadFile("photos/a.jpg", null);
    const writesThatLeaked = real.calls.filter(([op]) => !["read", "onCol"].includes(op));
    expect(writesThatLeaked).toEqual([]);
  });

  it("the save path's transaction merges against the local copy, never the server", async () => {
    const real = fakeReal({ [MANIFEST]: DAY });
    const ops = makeSandboxOps(real);
    const out = await ops.transaction(MANIFEST, (cur) => {
      expect(cur.entries[0].stop).toBe("ProSource - Norcross");
      return { ...cur, entries: cur.entries.map((e) => ({ ...e, status: "arrived", arrivedAt: "8:47 AM" })) };
    });
    expect(out.entries[0].status).toBe("arrived");
    expect((await ops.read(MANIFEST)).entries[0].status).toBe("arrived");
    expect(real.calls.filter(([op]) => op === "transaction")).toEqual([]);
  });

  it("records every attempted write, so the page can say what it kept", async () => {
    const ops = makeSandboxOps(fakeReal());
    await ops.write("a/1", {});
    await ops.add("b", {});
    expect(ops.writes().map((w) => w.op)).toEqual(["write", "add"]);
    expect(ops.__sandbox).toBe(true);
  });

  it("a logger that throws can never break a tap", async () => {
    const ops = makeSandboxOps(fakeReal(), { onWrite: () => { throw new Error("bad logger"); } });
    await expect(ops.write("a/1", { x: 1 })).resolves.toBeUndefined();
    expect((await ops.read("a/1")).x).toBe(1);
  });
});

describe("it starts from the real day", () => {
  it("reads each path from the server once, then only from the local copy", async () => {
    const real = fakeReal({ [MANIFEST]: DAY });
    const ops = makeSandboxOps(real);
    await ops.read(MANIFEST);
    await ops.read(MANIFEST);
    await ops.transaction(MANIFEST, (c) => c);
    expect(real.read).toHaveBeenCalledTimes(1);
  });

  it("two first reads in flight at once still fetch once", async () => {
    const real = fakeReal({ [MANIFEST]: DAY });
    const ops = makeSandboxOps(real);
    await Promise.all([ops.read(MANIFEST), ops.read(MANIFEST), ops.read(MANIFEST)]);
    expect(real.read).toHaveBeenCalledTimes(1);
  });

  it("a local write that lands while the real read is in flight wins", async () => {
    let release;
    const real = fakeReal();
    real.read = vi.fn(() => new Promise((r) => { release = () => r(DAY); }));
    const ops = makeSandboxOps(real);
    const reading = ops.read(MANIFEST);
    await ops.write(MANIFEST, { entries: [], mine: true });
    release();
    await reading;
    expect((await ops.read(MANIFEST)).mine).toBe(true);
  });

  it("a path that doesn't exist on the server reads as absent, and a failed read does too", async () => {
    const real = fakeReal();
    const ops = makeSandboxOps(real);
    expect(await ops.read("nope/1")).toBe(null);
    real.read = vi.fn(async () => { throw new Error("offline"); });
    const ops2 = makeSandboxOps(real);
    expect(await ops2.read("nope/2")).toBe(null);
  });

  it("update merges onto the real document, not onto nothing", async () => {
    const ops = makeSandboxOps(fakeReal({ "drivers/7": { name: "TYRESE GRIFFIN", phone: "678" } }));
    await ops.update("drivers/7", { phone: "999" });
    expect(await ops.read("drivers/7")).toEqual({ name: "TYRESE GRIFFIN", phone: "999" });
  });
});

describe("subscriptions: the real value once, then only the tester's own taps", () => {
  it("delivers the seeded document, then each local write", async () => {
    const ops = makeSandboxOps(fakeReal({ [MANIFEST]: DAY }));
    const seen = [];
    ops.onDoc(MANIFEST, (d, exists) => seen.push([d && d.entries.length, exists]));
    await tick();
    await ops.write(MANIFEST, { entries: [1, 2] });
    await ops.remove(MANIFEST);
    expect(seen).toEqual([[1, true], [2, true], [null, false]]);
  });

  it("never subscribes to the real document, so a live edit can't snap a test back", () => {
    const real = fakeReal({ [MANIFEST]: DAY });
    const ops = makeSandboxOps(real);
    expect(() => ops.onDoc(MANIFEST, () => {})).not.toThrow(); /* real.onDoc throws if touched */
  });

  it("stops delivering after unsubscribe", async () => {
    const ops = makeSandboxOps(fakeReal({ [MANIFEST]: DAY }));
    const seen = [];
    const off = ops.onDoc(MANIFEST, (d) => seen.push(d));
    await tick();
    off();
    await ops.write(MANIFEST, { entries: [] });
    expect(seen).toHaveLength(1);
  });

  it("a collection is the real snapshot plus local adds, edits and deletes", async () => {
    const real = fakeReal({}, { liftgateRequests: [{ id: "r1", stop: "A" }, { id: "r2", stop: "B" }] });
    const ops = makeSandboxOps(real);
    const seen = [];
    ops.onCol("liftgateRequests", (list) => seen.push(list.map((d) => d.id + ":" + d.stop).sort().join(",")));
    await tick();
    await ops.write("liftgateRequests/r3", { stop: "ProSource" });
    await ops.write("liftgateRequests/r1", { stop: "A2" });
    await ops.remove("liftgateRequests/r2");
    expect(seen).toEqual(["r1:A,r2:B", "r1:A,r2:B,r3:ProSource", "r1:A2,r2:B,r3:ProSource", "r1:A2,r3:ProSource"]);
  });

  it("lets go of the real collection listener after the first snapshot", async () => {
    const real = fakeReal({}, { drivers: [{ id: "1" }] });
    const ops = makeSandboxOps(real);
    ops.onCol("drivers", () => {});
    await tick();
    expect(real.colUnsubs[0]).toHaveBeenCalledTimes(1);
  });

  it("a second subscriber to the same collection doesn't open a second real listener", async () => {
    const real = fakeReal({}, { drivers: [{ id: "1" }] });
    const ops = makeSandboxOps(real);
    const a = [], b = [];
    ops.onCol("drivers", (l) => a.push(l.length));
    ops.onCol("drivers", (l) => b.push(l.length));
    await tick();
    expect(real.onCol).toHaveBeenCalledTimes(1);
    expect(a).toEqual([1]);
    expect(b).toEqual([1]);
  });

  it("a write to a nested path reaches only its own collection", async () => {
    const real = fakeReal({}, { "messages/7/items": [], messages: [] });
    const ops = makeSandboxOps(real);
    const items = [], top = [];
    ops.onCol("messages/7/items", (l) => items.push(l.length));
    ops.onCol("messages", (l) => top.push(l.length));
    await tick();
    await ops.write("messages/7/items/m1", { text: "on my way" });
    expect(items).toEqual([0, 1]);
    expect(top).toEqual([0]);
  });
});

describe("no aliasing between the page and the store", () => {
  it("mutating what a read returned doesn't change the store", async () => {
    const ops = makeSandboxOps(fakeReal({ [MANIFEST]: DAY }));
    const d = await ops.read(MANIFEST);
    d.entries[0].status = "departed";
    expect((await ops.read(MANIFEST)).entries[0].status).toBe(null);
  });

  it("mutating what was written, after writing it, doesn't change the store", async () => {
    const ops = makeSandboxOps(fakeReal());
    const obj = { n: 1 };
    await ops.write("a/1", obj);
    obj.n = 2;
    expect((await ops.read("a/1")).n).toBe(1);
  });

  it("the transaction's merge gets a copy it can scribble on", async () => {
    const ops = makeSandboxOps(fakeReal({ [MANIFEST]: DAY }));
    await ops.transaction(MANIFEST, (cur) => { cur.entries.length = 0; return null; });
    expect((await ops.read(MANIFEST)).entries).toHaveLength(1);
  });

  it("a transaction that returns nothing writes nothing", async () => {
    const ops = makeSandboxOps(fakeReal({ [MANIFEST]: DAY }));
    const seen = [];
    ops.onDoc(MANIFEST, () => seen.push(1));
    await tick();
    expect(await ops.transaction(MANIFEST, () => undefined)).toBe(null);
    expect(seen).toHaveLength(1);
  });
});

describe("which /api calls the test app may make", () => {
  const O = "https://davisdeliverydispatch.netlify.app";

  it("sending a text is answered locally, never sent", () => {
    expect(sandboxBlocksFetch("/api/send-sms", "POST", O)).toBe(true);
    expect(sandboxBlocksFetch(O + "/api/send-sms", "post", O)).toBe(true);
    expect(sandboxBlocksFetch("/.netlify/functions/send-sms", "POST", O)).toBe(true);
  });

  it("every non-read verb is blocked, not just POST", () => {
    ["PUT", "PATCH", "DELETE"].forEach((m) => expect(sandboxBlocksFetch("/api/anything", m, O), m).toBe(true));
  });

  it("reads pass — a GET is a read by contract", () => {
    expect(sandboxBlocksFetch("/api/motive-gps", "GET", O)).toBe(false);
    expect(sandboxBlocksFetch("/api/send-sms", "GET", O)).toBe(false); /* the gateway config probe */
    expect(sandboxBlocksFetch("/api/motive-gps", undefined, O)).toBe(false);
    expect(sandboxBlocksFetch("/api/motive-gps", "HEAD", O)).toBe(false);
  });

  it("except the one GET that does something: running the backup on demand", () => {
    expect(sandboxBlocksFetch("/api/backup-nightly", "GET", O)).toBe(true);
    expect(sandboxBlocksFetch("/api/backup-nightly?force=1", "GET", O)).toBe(true);
    expect(sandboxBlocksFetch("/api/backup-nightly-report", "GET", O)).toBe(false);
  });

  it("leaves other sites alone — the maps SDK and fonts still load", () => {
    expect(sandboxBlocksFetch("https://maps.googleapis.com/maps/api/js", "GET", O)).toBe(false);
    expect(sandboxBlocksFetch("https://example.com/api/send-sms", "POST", O)).toBe(false);
    expect(sandboxBlocksFetch("/assets/index.js", "GET", O)).toBe(false);
  });
});

describe("the test app's private storage", () => {
  const realish = () => {
    const m = new Map([["dd_auto_backups", "[]"], ["gpsEnabled", "{}"]]);
    return { m, length: m.size, key: (i) => [...m.keys()][i], getItem: (k) => m.get(k) ?? null, setItem: () => { throw new Error("REAL storage written"); } };
  };

  it("starts as a copy of the real one", () => {
    const st = makeMemoryStorage(realish());
    expect(st.getItem("dd_auto_backups")).toBe("[]");
    expect(st.length).toBe(2);
  });

  it("never writes back — the board's auto-backups can't pick up a test", () => {
    const real = realish();
    const st = makeMemoryStorage(real);
    st.setItem("dd_auto_backups", JSON.stringify([{ label: "save-test" }]));
    st.removeItem("gpsEnabled");
    st.clear();
    expect(real.m.get("dd_auto_backups")).toBe("[]");
    expect(real.m.get("gpsEnabled")).toBe("{}");
  });

  it("behaves like Storage: strings in, strings out, null when absent", () => {
    const st = makeMemoryStorage(null);
    st.setItem("n", 5);
    expect(st.getItem("n")).toBe("5");
    expect(st.getItem("missing")).toBe(null);
    expect(st.key(0)).toBe("n");
    expect(st.key(9)).toBe(null);
  });

  it("starts empty rather than failing when storage is blocked", () => {
    const blocked = { get length() { throw new Error("SecurityError"); } };
    expect(makeMemoryStorage(blocked).length).toBe(0);
  });
});

describe("the route that turns it on", () => {
  it("is the sandbox driver route and nothing else", () => {
    expect(SANDBOX_ROUTE.test("#/sandbox/driver/tyrese-7")).toBe(true);
    expect(SANDBOX_ROUTE.test("#/driver/tyrese-7")).toBe(false);
    expect(SANDBOX_ROUTE.test("")).toBe(false);
    expect(SANDBOX_ROUTE.test("#/sandboxx/driver/x")).toBe(false);
  });
});
