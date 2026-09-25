/* Imported FIRST by main.jsx, so this runs before App.jsx is evaluated and
   before anything touches storage, the network or Firebase. It does nothing
   unless the page was loaded at a #/sandbox/ route — the test driver app's
   frame — and once it has run it cannot be undone without a reload. App.jsx
   refuses to render a sandbox route in a page this did not fence. */
import { makeSandboxOps, sandboxBlocksFetch, makeMemoryStorage, SANDBOX_ROUTE } from "./sandboxOps.js";

const isSandbox = typeof window !== "undefined" && SANDBOX_ROUTE.test(window.location.hash || "");

if (isSandbox) {
  const log = (...a) => { try { console.info("[SANDBOX]", ...a); } catch {} };

  /* Same origin means the same storage as the board beside it, and every save
     snapshots the manifest into dd_auto_backups, which the board can restore
     from. The test app gets a private copy, seeded from the real one so cached
     drivers and stops still load. */
  for (const name of ["localStorage", "sessionStorage"]) {
    try {
      const real = window[name];
      Object.defineProperty(window, name, { value: makeMemoryStorage(real), configurable: true });
    } catch (e) {
      /* Without a private storage the frame could leak into the board's; stop. */
      window.__ddSandboxBroken = "storage: " + (e && e.message);
    }
  }

  const realFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : (input && input.url) || "";
    const method = (init && init.method) || (input && typeof input === "object" && input.method) || "GET";
    if (sandboxBlocksFetch(url, method, window.location.origin)) {
      log("answered locally, not sent:", String(method).toUpperCase(), url);
      return new Response(JSON.stringify({ ok: true, sandbox: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return realFetch(input, init);
  };

  /* The Firebase bootstrap calls this on the ops it builds, before it marks
     Firebase ready, so nothing in the page ever holds the real ones. */
  window.__ddSandbox = true;
  window.__ddSandboxWrap = (realOps) => {
    const ops = makeSandboxOps(realOps, { onWrite: (w) => log("kept in the test app:", w.op, w.path) });
    window.__ddSandboxOps = ops;
    return ops;
  };
}

export const SANDBOXED = isSandbox;
