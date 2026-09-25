/* ═══ THE TEST DRIVER APP'S FIREWALL ═══

   More ⋯ → Driver App (test) opens the real driver app in a frame so it can be
   tried and developed against real days. The one thing it must never do is
   write: a tap on Arrived there, landing on the real manifest, would stamp a
   real driver's real record.

   So the fence sits at the lowest layer, where every write already has to
   pass, rather than at each button. Firestore (`window._fbOps`) is replaced by
   an in-memory copy of the documents the page touches, seeded from ONE real
   read of each. POSTs to our own functions are answered locally. localStorage
   is a private copy. A feature added to the driver app later is fenced the day
   it is written, without anyone remembering to fence it.

   Subscriptions deliver the real value once and then only local writes: a tap
   in the test app sticks, and a live edit on the board can't snap it back in
   the middle of a test. Reset is a reload. */

const clone = (v) => {
  if (v == null) return v;
  try { return typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v)); }
  catch { return JSON.parse(JSON.stringify(v)); }
};

const colOf = (path) => String(path).split("/").slice(0, -1).join("/");
const idOf = (path) => String(path).split("/").pop();
const later = (fn) => setTimeout(fn, 0);

export const makeSandboxOps = (real, { onWrite } = {}) => {
  const docs = new Map();         /* path -> data | null (null = absent or deleted locally) */
  const seeding = new Map();      /* path -> Promise, so two first reads fetch once */
  const docSubs = new Map();      /* path -> Set(cb) */
  const colBase = new Map();      /* colPath -> Map(id -> doc), the real snapshot */
  const colSeeding = new Set();   /* colPaths whose real snapshot is in flight */
  const colSubs = new Map();      /* colPath -> Set(cb) */
  const writes = [];
  let addSeq = 0;

  const note = (op, path) => {
    const e = { op, path: String(path), at: Date.now() };
    writes.push(e);
    if (onWrite) { try { onWrite(e); } catch { /* a logger must never break a tap */ } }
  };

  const subsOf = (m, k) => { if (!m.has(k)) m.set(k, new Set()); return m.get(k); };

  const colList = (col) => {
    const out = new Map();
    (colBase.get(col) || new Map()).forEach((d, id) => out.set(id, d));
    docs.forEach((d, p) => {
      if (colOf(p) !== col) return;
      const id = idOf(p);
      if (d == null) out.delete(id); else out.set(id, { ...d, id });
    });
    return [...out.values()].map(clone);
  };

  const emitDoc = (path) => {
    const d = docs.get(path);
    (docSubs.get(path) || []).forEach((cb) => { try { cb(clone(d ?? null), d != null); } catch {} });
  };
  const emitCol = (col) => {
    const subs = colSubs.get(col);
    if (!subs || !subs.size || !colBase.has(col)) return;
    const list = colList(col);
    subs.forEach((cb) => { try { cb(list); } catch {} });
  };
  const changed = (path) => { emitDoc(path); emitCol(colOf(path)); };

  /* One real read per path, ever. A local write that lands while the read is
     in flight wins — the real value never overwrites something the tester did. */
  const seed = (path) => {
    if (docs.has(path)) return Promise.resolve(docs.get(path));
    if (seeding.has(path)) return seeding.get(path);
    const p = Promise.resolve()
      .then(() => (real && typeof real.read === "function" ? real.read(path) : null))
      .catch(() => null)
      .then((d) => {
        if (!docs.has(path)) docs.set(path, d == null ? null : clone(d));
        seeding.delete(path);
        return docs.get(path);
      });
    seeding.set(path, p);
    return p;
  };

  return {
    __sandbox: true,
    writes: () => writes.slice(),

    read: async (path) => clone(await seed(path)),

    onDoc: (path, cb) => {
      const subs = subsOf(docSubs, path);
      subs.add(cb);
      if (docs.has(path)) later(() => { if (subs.has(cb)) { const d = docs.get(path); cb(clone(d ?? null), d != null); } });
      else seed(path).then(() => { if (subs.has(cb)) { const d = docs.get(path); cb(clone(d ?? null), d != null); } });
      return () => subs.delete(cb);
    },

    onCol: (col, cb, errCb) => {
      const subs = subsOf(colSubs, col);
      subs.add(cb);
      if (colBase.has(col)) {
        later(() => { if (subs.has(cb)) cb(colList(col)); });
      } else if (!colSeeding.has(col)) {
        colSeeding.add(col);
        let done = false;
        let unsub = null;
        const finish = (list) => {
          if (done) return;
          done = true;
          colSeeding.delete(col);
          colBase.set(col, new Map((Array.isArray(list) ? list : []).filter(Boolean).map((d) => [String(d.id), clone(d)])));
          if (typeof unsub === "function") unsub();
          emitCol(col);
        };
        try {
          unsub = real && typeof real.onCol === "function" ? real.onCol(col, finish, (e) => { finish([]); if (errCb) errCb(e); }) : null;
        } catch { finish([]); }
        if (!unsub && !done) finish([]);
        if (done && typeof unsub === "function") unsub();
      }
      return () => subs.delete(cb);
    },

    write: async (path, data) => { note("write", path); docs.set(path, clone(data)); changed(path); },

    /* update merges onto the real document, so it has to have been read. */
    update: async (path, data) => {
      note("update", path);
      const cur = await seed(path);
      docs.set(path, { ...(cur || {}), ...clone(data) });
      changed(path);
    },

    add: async (col, data) => {
      note("add", col);
      addSeq += 1;
      const path = col + "/sbx_" + Date.now().toString(36) + "_" + addSeq;
      docs.set(path, clone(data));
      changed(path);
    },

    remove: async (path) => { note("remove", path); docs.set(path, null); changed(path); },

    transaction: async (path, mergeFn) => {
      note("transaction", path);
      const cur = await seed(path);
      const next = await mergeFn(cur == null ? null : clone(cur));
      if (next === null || next === undefined) return null;
      docs.set(path, clone(next));
      changed(path);
      return clone(next);
    },

    /* A photo taken in the test app stays in the page and dies with it. */
    uploadFile: async (path, blob) => {
      note("uploadFile", path);
      try { if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function" && blob) return URL.createObjectURL(blob); }
      catch { /* fall through */ }
      return "sandbox://" + path;
    },
  };
};

/* Which /api calls the test app may make. A GET is a read by contract; the one
   GET that does something (running the nightly backup on demand) is named.
   Anything that is not a read is answered here and never sent. */
const SIDE_EFFECT_GETS = [/\/api\/backup-nightly(?:[/?#]|$)/];

export const sandboxBlocksFetch = (url, method, origin) => {
  const u = String(url || "");
  const m = String(method || "GET").toUpperCase();
  let path = u;
  try { const parsed = new URL(u, origin || "http://localhost"); if (origin && parsed.origin !== new URL(origin).origin) return false; path = parsed.pathname; }
  catch { /* relative or malformed: judge it as a path */ }
  if (!/^\/api\//.test(path) && !/\/\.netlify\/functions\//.test(path)) return false;
  if (m !== "GET" && m !== "HEAD") return true;
  return SIDE_EFFECT_GETS.some((re) => re.test(path));
};

/* A private localStorage: a copy of the real one taken once at load. */
export const makeMemoryStorage = (seedFrom) => {
  const mem = new Map();
  try {
    if (seedFrom) for (let i = 0; i < seedFrom.length; i++) { const k = seedFrom.key(i); if (k != null) mem.set(k, seedFrom.getItem(k)); }
  } catch { /* storage blocked: start empty */ }
  return {
    getItem: (k) => (mem.has(String(k)) ? mem.get(String(k)) : null),
    setItem: (k, v) => { mem.set(String(k), String(v)); },
    removeItem: (k) => { mem.delete(String(k)); },
    clear: () => { mem.clear(); },
    key: (i) => [...mem.keys()][i] ?? null,
    get length() { return mem.size; },
  };
};

export const SANDBOX_ROUTE = /^#\/sandbox\//;
