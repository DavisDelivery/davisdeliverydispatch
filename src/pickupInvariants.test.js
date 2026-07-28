import { describe, it, expect } from "vitest";
import { rebuildPickupsForPure, orderAutoPickupsFirst, orderByIds, applyReassign, applySetLoadNum, applyMoveInDriver, applyReorderDriver, applyDropReorder, resolvePickupLabel, dedupeIds, dedupeAutoPickups, reapOrphanAutoPickups, normalizeOrder } from "./manifestLogic.js";
import { PICKUP_SOURCES, MULTI_PICKUP, normLoc } from "./pickupConfig.js";

/* ── Scenario sweep over the auto-pickup engine ───────────────────────────────
   The per-helper unit tests in manifestLogic.test.js check each rule alone.
   Every bug found on the board so far came from rules INTERACTING — a dock
   fallback firing next to a manual pickup, a manual pickup suppressing the wrong
   card, a rebuild relocating a stop someone had placed by hand. Those only show
   up on a whole manifest.

   So this file states what must be true of ANY manifest, then generates a wide
   matrix of realistic ones and asserts it after a rebuild. A failure names the
   scenario that produced it, so it can be turned into a regression test. */

let _seq = 0;
const genId = () => `t_${++_seq}`;
const deps = (over = {}) => ({
  pickupSources: PICKUP_SOURCES,
  customers: {},
  driverLoadCount: {},
  genId,
  normLoc,
  onTombstone: () => {},
  ...over,
});

const docksFor = (c) => PICKUP_SOURCES.filter((s) => s.customer === c);
const isAuto = (e) => e.stopType === "pickup" && !e.manualPickup;
const key = (e) => `${e.driverId}|${e.loadNum || 1}|${e.customer}`;

/* Run the engine for every customer present, the way the app does. */
const rebuildAll = (entries, d = deps()) => {
  let all = entries;
  [...new Set(entries.map((e) => e.customer))].forEach((c) => {
    all = rebuildPickupsForPure(all, c, d);
  });
  return all;
};

/* ── Invariants ─────────────────────────────────────────────────────────────
   Each returns a list of human-readable violations. */

/* Every assigned delivery for a docked supplier needs SOMETHING telling the
   driver where to collect — an auto dock card or a manual pickup on the same
   driver+load. Zero pickups is the "Brent had no pickup" failure. */
const vCoverage = (all) =>
  all
    .filter((e) => e.stopType === "delivery" && e.driverId > 0 && docksFor(e.customer).length)
    .filter((d) => !all.some((p) => p.stopType === "pickup" && key(p) === key(d)))
    .map((d) => `delivery "${d.stop}" (drv ${d.driverId} load ${d.loadNum || 1}, ${d.customer}) has no pickup`);

/* One dock card per dock per driver+load. Two cards for one dock is a duplicate. */
const vNoDuplicateDock = (all) => {
  const seen = new Map();
  const out = [];
  all.filter(isAuto).forEach((p) => {
    const k = `${key(p)}|${p.stop}`;
    if (seen.has(k)) out.push(`duplicate auto-pickup "${p.stop}" on drv ${p.driverId} load ${p.loadNum || 1}`);
    seen.set(k, true);
  });
  return out;
};

/* A pickup at the same address as a delivery it serves is the phantom-card
   failure: the driver is told to collect and drop at one address. */
const vNotAtOwnDelivery = (all) =>
  all
    .filter(isAuto)
    .filter((p) =>
      all.some(
        (d) => d.stopType === "delivery" && key(d) === key(p) && d.addr && p.addr && d.addr === p.addr,
      ),
    )
    .map((p) => `auto-pickup "${p.stop}" sits at the same address as its own delivery (drv ${p.driverId})`);

/* You cannot deliver freight you have not collected. */
const vPrecedence = (all) => {
  const out = [];
  all.filter(isAuto).forEach((p) => {
    const pi = all.indexOf(p);
    all.forEach((d, di) => {
      if (d.stopType === "delivery" && key(d) === key(p) && di < pi)
        out.push(`auto-pickup "${p.stop}" comes after its delivery "${d.stop}" (drv ${p.driverId})`);
    });
  });
  return out;
};

/* A dock card with nothing to collect for is a leftover. */
const vNoOrphan = (all) =>
  all
    .filter(isAuto)
    .filter((p) => !all.some((d) => d.stopType === "delivery" && key(d) === key(p)))
    .map((p) => `orphan auto-pickup "${p.stop}" on drv ${p.driverId} load ${p.loadNum || 1}`);

/* The rebuild must never touch a real delivery — that is how deliveries get
   silently erased. */
const vDeliveriesPreserved = (before, after) => {
  const b = before.filter((e) => e.stopType === "delivery").map((e) => e.id).sort();
  const a = after.filter((e) => e.stopType === "delivery").map((e) => e.id).sort();
  return JSON.stringify(b) === JSON.stringify(a) ? [] : [`deliveries changed: ${b.length} → ${a.length}`];
};

const ALL = (before, after) => [
  ...vCoverage(after),
  ...vNoDuplicateDock(after),
  ...vNotAtOwnDelivery(after),
  ...vPrecedence(after),
  ...vNoOrphan(after),
  ...vDeliveriesPreserved(before, after),
];

/* ── Scenario matrix ────────────────────────────────────────────────────────── */

const del = (o) => ({ id: genId(), stopType: "delivery", driverId: 1, loadNum: 1, baseRate: 0, ...o });
const mpu = (o) => ({ id: genId(), stopType: "pickup", manualPickup: true, driverId: 1, loadNum: 1, baseRate: 0, ...o });

/* One single-dock supplier, one multi-dock, and one that shares a dock label
   with another supplier (Southern Aluminum belongs to IMETCO — the collision
   behind the phantom MM Systems card). */
const CUSTS = ["MM Systems", "Emser Tile", "IMETCO", "Traditions in Tile"];

/* The shapes a delivery's pickupFrom actually takes in stored data. */
const PICKUP_FROMS = (cust) => {
  const d = docksFor(cust);
  return [
    ["absent", undefined],
    ["full dock label", d[0]?.label],
    ["short dock name", d[0]?.label.split(" - ").pop()],
    ["second dock", d[1]?.label],
    ["another supplier's dock", "Southern Aluminum - Lithia Springs"],
    ["unknown place", "Some Random Warehouse - Nowhere"],
  ].filter(([, v]) => v !== null);
};

const scenarios = [];
CUSTS.forEach((cust) => {
  PICKUP_FROMS(cust).forEach(([pfName, pf]) => {
    [1, 2].forEach((loads) => {
      ["none", "at dock", "off dock"].forEach((manual) => {
        const dock = docksFor(cust)[0];
        const entries = [];
        for (let ln = 1; ln <= loads; ln++) {
          entries.push(
            del({ customer: cust, stop: `${cust} drop A L${ln}`, addr: `A${ln} St`, loadNum: ln, pickupFrom: pf }),
            del({ customer: cust, stop: `${cust} drop B L${ln}`, addr: `B${ln} St`, loadNum: ln, pickupFrom: pf }),
          );
        }
        if (manual === "at dock") entries.unshift(mpu({ customer: cust, stop: dock.label, addr: dock.addr }));
        if (manual === "off dock")
          entries.unshift(mpu({ customer: cust, stop: "Southern Aluminum - Lithia Springs", addr: "1401 Blairs Bridge Road, Lithia Springs, GA 30122" }));
        scenarios.push({
          name: `${cust} | pickupFrom=${pfName} | ${loads} load(s) | manual=${manual}`,
          entries,
          driverLoadCount: loads > 1 ? { 1: loads } : {},
        });
      });
    });
  });
});

describe("auto-pickup engine — invariants across the scenario matrix", () => {
  it(`covers a broad matrix (${scenarios.length} scenarios)`, () => {
    expect(scenarios.length).toBeGreaterThan(100);
  });

  scenarios.forEach((sc) => {
    it(sc.name, () => {
      const d = deps({ driverLoadCount: sc.driverLoadCount });
      const after = rebuildAll(sc.entries, d);
      expect(ALL(sc.entries, after)).toEqual([]);
    });
  });
});

describe("auto-pickup engine — rebuilding is stable", () => {
  scenarios.forEach((sc) => {
    it(`idempotent: ${sc.name}`, () => {
      const d = deps({ driverLoadCount: sc.driverLoadCount });
      const once = rebuildAll(sc.entries, d);
      const twice = rebuildAll(once, d);
      /* Ids may not churn either — a new id every rebuild means the save layer
         sees a delete + create and can resurrect the old card. */
      expect(twice.map((e) => `${e.stopType}:${e.stop}:${e.id}`)).toEqual(
        once.map((e) => `${e.stopType}:${e.stop}:${e.id}`),
      );
    });
  });
});

describe("auto-pickup engine — multi-driver manifests", () => {
  it("keeps each driver's pickups on that driver, across customers and loads", () => {
    const entries = [];
    [1, 2, 3].forEach((drv) => {
      CUSTS.forEach((cust, ci) => {
        entries.push(
          del({ customer: cust, stop: `${cust} for drv${drv}`, addr: `d${drv}c${ci} St`, driverId: drv, loadNum: (ci % 2) + 1 }),
        );
      });
    });
    const after = rebuildAll(entries, deps({ driverLoadCount: { 1: 2, 2: 2, 3: 2 } }));
    expect(ALL(entries, after)).toEqual([]);
    after.filter(isAuto).forEach((p) => {
      expect(after.some((d) => d.stopType === "delivery" && key(d) === key(p))).toBe(true);
    });
  });
});

/* ── The save / reload round-trip ────────────────────────────────────────────
   A manifest does not stay in memory. It is normalized, saved, re-ingested,
   reaped and deduped on every device. Historically that loop is where cards
   were resurrected, dropped, or reordered — the board looking different on the
   phone than on the desktop. A manifest that satisfies the invariants must
   still satisfy them after a full trip through the pipeline, and must come back
   holding exactly the same stops. */
describe("auto-pickup engine — survives the save/reload pipeline", () => {
  const reapOpts = {
    multiSource: (c) => !!MULTI_PICKUP[c],
    normLoc,
    docksFor: (c) => docksFor(c).map((s) => s.label),
  };
  const NOW = 1_700_000_000_000;

  const roundTrip = (entries) =>
    dedupeAutoPickups(
      reapOrphanAutoPickups(normalizeOrder(dedupeIds(entries), NOW, reapOpts), reapOpts),
      reapOpts,
    );

  scenarios.forEach((sc) => {
    it(`round-trip: ${sc.name}`, () => {
      const d = deps({ driverLoadCount: sc.driverLoadCount });
      const built = rebuildAll(sc.entries, d);
      const back = roundTrip(built);

      /* Nothing invented, nothing lost. */
      expect(back.map((e) => e.id).sort()).toEqual(built.map((e) => e.id).sort());
      /* And still a manifest a driver can actually run. */
      expect(ALL(sc.entries, back)).toEqual([]);
    });
  });

  it("is stable across repeated trips — a board that keeps syncing keeps its shape", () => {
    const sc = scenarios.find((s) => s.name.includes("2 load(s)") && s.name.includes("manual=none"));
    const d = deps({ driverLoadCount: sc.driverLoadCount });
    let cur = rebuildAll(sc.entries, d);
    const first = roundTrip(cur);
    for (let i = 0; i < 5; i++) cur = roundTrip(rebuildAll(cur, d));
    expect(cur.map((e) => `${e.stopType}:${e.stop}:${e.id}`)).toEqual(
      first.map((e) => `${e.stopType}:${e.stop}:${e.id}`),
    );
  });
});

/* ── Operation sequences ─────────────────────────────────────────────────────
   A single reassign being correct says nothing about a board that has had
   twenty applied to it. Drift accumulates: a card creeps one slot per rebuild,
   a pickup is orphaned three moves after the move that stranded it. This
   replays random dispatcher sessions — reassign between drivers, move between
   loads, send back to unassigned — and checks every invariant after EVERY
   action, so a failure names the exact step that broke the board. */
describe("manifest mutations — invariants hold across random dispatcher sessions", () => {
  /* Deterministic PRNG: a failure is reproducible from its seed. */
  const rng = (seed) => () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const reapOpts = {
    multiSource: (c) => !!MULTI_PICKUP[c],
    normLoc,
    docksFor: (c) => docksFor(c).map((s) => s.label),
  };

  const startingBoard = () => {
    const entries = [];
    CUSTS.forEach((cust, ci) => {
      [1, 2].forEach((drv) => {
        entries.push(
          del({ customer: cust, stop: `${cust} A d${drv}`, addr: `${cust}-A-${drv} St`, driverId: drv, loadNum: 1 }),
          del({ customer: cust, stop: `${cust} B d${drv}`, addr: `${cust}-B-${drv} St`, driverId: drv, loadNum: (ci % 2) + 1 }),
        );
      });
    });
    return entries;
  };

  for (let seed = 1; seed <= 25; seed++) {
    it(`session seed ${seed}`, () => {
      const rand = rng(seed);
      const d = deps({ driverLoadCount: { 1: 2, 2: 2, 3: 2 } });
      const rebuildPickups = (all, cust) => rebuildPickupsForPure(all, cust, d);
      /* Every mutation in the app goes through setLog, which applies
         orderAutoPickupsFirst before the state lands. Model that here or the
         harness reports precedence violations the app fixes in the same tick. */
      const commit = (b) => orderAutoPickupsFirst(b, reapOpts);
      let board = commit(rebuildAll(startingBoard(), d));
      const log = [];

      for (let step = 0; step < 20; step++) {
        const movable = board.filter((e) => e.stopType === "delivery");
        if (!movable.length) break;
        const target = movable[Math.floor(rand() * movable.length)];
        const pick = rand();
        let action;
        if (pick < 0.45) {
          const drv = [0, 1, 2, 3][Math.floor(rand() * 4)];
          action = `reassign "${target.stop}" → drv ${drv}`;
          board = commit(applyReassign(board, target.id, drv, undefined, { rebuildPickups }));
        } else if (pick < 0.8) {
          const ln = 1 + Math.floor(rand() * 2);
          const drv = target.driverId || 1;
          action = `move "${target.stop}" → drv ${drv} load ${ln}`;
          board = commit(applyReassign(board, target.id, drv, ln, { rebuildPickups }));
        } else {
          const ln = 1 + Math.floor(rand() * 2);
          action = `setLoad "${target.stop}" → ${ln}`;
          board = commit(applySetLoadNum(board, target.id, ln, { rebuildPickups }));
        }
        log.push(action);

        const violations = ALL(board, board);
        expect(violations, `after step ${step + 1}: ${action}\nsession:\n  ${log.join("\n  ")}`).toEqual([]);
      }

      /* And the finished board must survive a sync like any other. */
      const back = dedupeAutoPickups(
        reapOrphanAutoPickups(normalizeOrder(dedupeIds(board), 1_700_000_000_000, reapOpts), reapOpts),
        reapOpts,
      );
      expect(ALL(back, back), `sync after session:\n  ${log.join("\n  ")}`).toEqual([]);
    });
  }
});

/* ── Full-board sessions, every operation ────────────────────────────────────
   Adds the reorder paths — the ▲▼ nudges, drag reorder, and route-planner Apply
   — to the mutation mix, and adds the invariant those paths can break that the
   others cannot: a stop must never be LOST or DUPLICATED. reorderDriverBlock's
   length-mismatch fallback rebuilds the driver's block from a list it was
   handed, so a caller that passes a partial list silently drops the rest. */
describe("manifest — every operation, invariants plus stop conservation", () => {
  const rng = (seed) => () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const reapOpts = {
    multiSource: (c) => !!MULTI_PICKUP[c],
    normLoc,
    docksFor: (c) => docksFor(c).map((s) => s.label),
  };

  const board0 = () => {
    const entries = [];
    CUSTS.forEach((cust, ci) => {
      [1, 2].forEach((drv) =>
        entries.push(
          del({ customer: cust, stop: `${cust} A d${drv}`, addr: `${cust}-A-${drv} St`, driverId: drv, loadNum: 1 }),
          del({ customer: cust, stop: `${cust} B d${drv}`, addr: `${cust}-B-${drv} St`, driverId: drv, loadNum: (ci % 2) + 1 }),
        ),
      );
    });
    return entries;
  };

  /* Deliveries are real work — they may move, but they may never disappear or
     double. Auto-pickups are derived, so they legitimately come and go. */
  const delIds = (b) => b.filter((e) => e.stopType === "delivery").map((e) => e.id).sort();

  for (let seed = 101; seed <= 130; seed++) {
    it(`full session seed ${seed}`, () => {
      const rand = rng(seed);
      const d = deps({ driverLoadCount: { 1: 2, 2: 2, 3: 2 } });
      const rebuildPickups = (all, cust) => rebuildPickupsForPure(all, cust, d);
      const commit = (b) => orderAutoPickupsFirst(b, reapOpts);
      let board = commit(rebuildAll(board0(), d));
      const expected = delIds(board);
      const log = [];

      for (let step = 0; step < 25; step++) {
        const stops = board.filter((e) => e.stopType === "delivery");
        if (!stops.length) break;
        const t = stops[Math.floor(rand() * stops.length)];
        const drv = t.driverId || 1;
        const r = rand();
        let action;
        if (r < 0.25) {
          const to = [0, 1, 2, 3][Math.floor(rand() * 4)];
          action = `reassign "${t.stop}" → drv ${to}`;
          board = commit(applyReassign(board, t.id, to, undefined, { rebuildPickups }));
        } else if (r < 0.45) {
          const ln = 1 + Math.floor(rand() * 2);
          action = `move "${t.stop}" → drv ${drv} load ${ln}`;
          board = commit(applyReassign(board, t.id, drv, ln, { rebuildPickups }));
        } else if (r < 0.6) {
          const dir = rand() < 0.5 ? -1 : 1;
          action = `nudge "${t.stop}" ${dir < 0 ? "up" : "down"}`;
          /* EFFICACY: a nudge must actually move the stop one place within the
             group the driver SEES — its own (driver, load). Checking only the
             correctness invariants misses a nudge that swaps across a load
             boundary: nothing breaks, but the stop doesn't move in its own group
             and the button reads as dead. Position is measured in the rendered
             group, so this catches "I clicked it and nothing happened". */
          const groupOf = (b) =>
            b.filter((e) => e.driverId === drv && (e.loadNum || 1) === (t.loadNum || 1)).map((e) => e.id);
          const beforeG = groupOf(board);
          const wasAt = beforeG.indexOf(t.id);
          const partner = board.find((e) => e.id === beforeG[wasAt + dir]);
          board = commit(applyMoveInDriver(board, drv, t.id, dir));
          const nowAt = groupOf(board).indexOf(t.id);
          const atEdge = (dir < 0 && wasAt === 0) || (dir > 0 && wasAt === beforeG.length - 1);
          /* Swapping with an auto-pickup is legitimately undone by commit(): a
             delivery cannot climb above the pickup that supplies it. Only assert
             efficacy when the neighbour is another delivery. (The button doing
             nothing in the pickup case is real, but it is a UX gap, not a
             correctness one — flagged separately, not silently redefined here.) */
          const partnerIsPickup = partner && partner.stopType === "pickup" && !partner.manualPickup;
          if (!atEdge && wasAt >= 0 && !partnerIsPickup)
            expect(nowAt, `nudge did not move the stop in its own load group — ${action}`).not.toBe(wasAt);
        } else if (r < 0.8) {
          const de = board.filter((e) => e.driverId === drv);
          const toIdx = Math.floor(rand() * Math.max(de.length, 1));
          action = `drag "${t.stop}" → slot ${toIdx} of drv ${drv}`;
          board = commit(applyDropReorder(board, drv, t.id, 0, toIdx));
        } else {
          /* Route-planner Apply: a DELIVERY-ONLY id list, the shape that strands
             auto-pickups and exercises the mismatch fallback. */
          const ids = board.filter((e) => e.driverId === drv && e.stopType === "delivery").map((e) => e.id).reverse();
          action = `route-apply drv ${drv} (${ids.length} deliveries, reversed)`;
          board = commit(applyReorderDriver(board, drv, ids, { rebuildPickups, orderByIds }));
        }
        log.push(action);
        const ctx = `after step ${step + 1}: ${action}\nsession:\n  ${log.join("\n  ")}`;
        expect(delIds(board), `LOST/DUPLICATED STOP — ${ctx}`).toEqual(expected);
        expect(ALL(board, board), ctx).toEqual([]);
      }

      const back = dedupeAutoPickups(
        reapOrphanAutoPickups(normalizeOrder(dedupeIds(board), 1_700_000_000_000, reapOpts), reapOpts),
        reapOpts,
      );
      expect(delIds(back), `stops lost in sync\n  ${log.join("\n  ")}`).toEqual(expected);
      expect(ALL(back, back), `sync after session\n  ${log.join("\n  ")}`).toEqual([]);
    });
  }
});

/* ── The text on the card ────────────────────────────────────────────────────
   Correct data still misleads if the label under the address names the wrong
   origin. But a first pass at these invariants asserted something false — that a
   pickup card on the load means the dock is DECIDED, so the delivery should
   never still show "⚠ pick location". It isn't: when nobody names a dock, the
   engine falls back to the supplier's first one, and that card is a GUESS. The
   warning is what tells the dispatcher the guess is unconfirmed; silencing it
   would send a driver to the wrong building with false confidence. Those 49
   "failures" were the test being wrong, and the app was right.

   What follows is what the label genuinely owes the reader. */
describe("pickup label — the contracts it actually owes", () => {
  const labelChecks = (board) => {
    const out = [];
    board
      .filter((e) => e.stopType === "delivery" && e.driverId > 0)
      .forEach((d) => {
        const siblings = board.filter(
          (e) => e.driverId === d.driverId && (e.loadNum || 1) === (d.loadNum || 1),
        );
        const { text, ambiguous } = resolvePickupLabel(d, siblings);
        const docks = docksFor(d.customer);

        /* Never blank, never a stray "undefined" on a driver's card. */
        if (!text || !String(text).trim() || /undefined|null|NaN/.test(text))
          out.push(`"${d.stop}" renders a broken label: ${JSON.stringify(text)}`);

        /* A supplier with ONE dock has nothing to choose — it must never prompt. */
        if (docks.length === 1 && ambiguous)
          out.push(`"${d.stop}" prompts for a dock but ${d.customer} only has one`);

        /* When the delivery NAMES one of its supplier's docks, that is a
           decision, and the label must show it rather than prompt. */
        const named = docks.find(
          (s) =>
            d.pickupFrom &&
            (d.pickupFrom === s.label || normLoc(d.pickupFrom) === normLoc(s.label)),
        );
        if (named) {
          if (ambiguous) out.push(`"${d.stop}" names dock "${named.label}" yet still prompts`);
          else if (normLoc(text) !== normLoc(named.label))
            out.push(`"${d.stop}" names dock "${named.label}" but reads "${text}"`);
        }

        /* If it IS prompting, it must look like a prompt — a half-formed label
           that merely looks like an address is the dangerous version. */
        if (ambiguous && !/pick location/.test(text))
          out.push(`"${d.stop}" is ambiguous but reads "${text}", which does not read as a prompt`);
      });
    return out;
  };

  scenarios.forEach((sc) => {
    it(`label: ${sc.name}`, () => {
      const d = deps({ driverLoadCount: sc.driverLoadCount });
      const board = orderAutoPickupsFirst(rebuildAll(sc.entries, d), {
        multiSource: (c) => !!MULTI_PICKUP[c],
        normLoc,
        docksFor: (c) => docksFor(c).map((s) => s.label),
      });
      expect(labelChecks(board)).toEqual([]);
    });
  });
});
