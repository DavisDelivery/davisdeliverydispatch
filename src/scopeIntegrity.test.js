import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";

/* App.jsx is one ~10k-line module where a component's JSX often sits thousands
   of lines from the state it reads. That makes it easy to hand a prop-less
   component a variable that only exists in a *sibling* scope: it parses, it
   builds, it ships, and then it throws "Can't find variable: x" the first time
   a user opens that view.

   Two of those actually shipped — `fdCtx` inside RouteBuilder's map (the FD
   cutoff work), and `printPOD` on the photo-lightbox Print button, which had
   been dead on click since May. Neither was reachable from a unit test,
   because neither view was ever rendered by one.

   So this walks the real scope chain instead: every identifier that is *read*
   must resolve to a binding — a param, a local, an import, or a known global.
   Anything else is a crash waiting for the user who opens that screen. */

const traverse = _traverse.default ?? _traverse;
const SRC = join(dirname(fileURLToPath(import.meta.url)));

/* Globals the app legitimately reaches for. Deliberately a closed list: an
   unrecognised bare name is far more likely to be a scope bug than a browser
   API this app has not used in 10k lines. Add to it consciously. */
const GLOBALS = new Set([
  // ECMAScript
  "Array", "Boolean", "Date", "Error", "Infinity", "JSON", "Map", "Math",
  "NaN", "Number", "Object", "Promise", "RegExp", "Set", "String", "Symbol",
  "WeakMap", "WeakSet", "BigInt", "parseFloat", "parseInt", "isFinite",
  "isNaN", "undefined", "globalThis", "decodeURIComponent", "encodeURIComponent",
  // Browser
  "window", "document", "navigator", "location", "localStorage",
  "sessionStorage", "console", "fetch", "alert", "confirm", "prompt",
  "setTimeout", "clearTimeout", "setInterval", "clearInterval",
  "requestAnimationFrame", "cancelAnimationFrame", "Blob", "File",
  "FileReader", "FormData", "Headers", "Request", "Response", "URL",
  "URLSearchParams", "Image", "Audio", "AbortController", "IntersectionObserver",
  "ResizeObserver", "MutationObserver", "CustomEvent", "Event", "Notification",
  "structuredClone", "btoa", "atob", "crypto", "performance", "matchMedia",
  "print", "open", "close", "scrollTo", "getComputedStyle",
  // Build-time
  "process", "import",
]);

const FILES = ["App.jsx", "FDFlag.jsx", "manifestLogic.js", "pickupConfig.js"];

function unresolvedIn(file) {
  const code = readFileSync(join(SRC, file), "utf8");
  const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
  const bad = [];
  traverse(ast, {
    ReferencedIdentifier(path) {
      const name = path.node.name;
      if (GLOBALS.has(name)) return;
      /* second arg = noGlobals: do not let Babel's own global list paper over
         a name this app never actually defines. */
      if (path.scope.hasBinding(name, true)) return;
      bad.push(`${file}:${path.node.loc.start.line}  ${name}`);
    },
  });
  return bad;
}

describe("scope integrity", () => {
  for (const file of FILES) {
    it(`${file} references no variable that is out of scope`, () => {
      expect(unresolvedIn(file)).toEqual([]);
    });
  }

  /* The two regressions above, named, so a failure says which bug came back
     rather than just "array not empty". */
  it("RouteBuilder can read fdCtx (PR #40 crash)", () => {
    const code = readFileSync(join(SRC, "App.jsx"), "utf8");
    const decl = code.match(/function RouteBuilder\(\{([^}]*)\}/);
    expect(decl, "RouteBuilder signature not found").toBeTruthy();
    expect(decl[1].split(",").map((s) => s.trim().split(":")[0]))
      .toContain("fdCtx");
  });

  it("printPOD is reachable from the photo lightbox, not trapped in the photos tab", () => {
    expect(unresolvedIn("App.jsx").filter((l) => l.endsWith("printPOD"))).toEqual([]);
  });
});
