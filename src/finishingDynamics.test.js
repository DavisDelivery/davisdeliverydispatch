import { describe, it, expect } from "vitest";
import {
  FD_CUTOFF_BY_DAY,
  FD_FLAG_COLORS,
  fdCutoffMins,
  fmtClock,
  touchesFinishingDynamics,
  finishingDynamicsFlag,
} from "./manifestLogic.js";
import { PICKUP_SOURCES } from "./pickupConfig.js";

/* A local-time epoch for a given weekday-of-board and clock. dayIdx is the
   board's `sd` (0=Mon … 4=Fri); we anchor on Mon 2026-08-10 so dayIdx maps
   straight onto the date. Built with the Date(y,m,d,h,mi) constructor so it is
   LOCAL time — the same basis the flag reads with getHours(). */
const at = (dayIdx, h, mi = 0) => new Date(2026, 7, 10 + dayIdx, h, mi, 0, 0).getTime();

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const fdEntry = (over = {}) => ({
  id: "e1",
  customer: "IMETCO",
  stop: "Finishing Dynamics to IMETCO",
  stopType: "delivery",
  driverId: 1,
  loadNum: 1,
  status: null,
  ...over,
});

describe("Finishing Dynamics cutoff table", () => {
  it("is 3:00 PM Monday through Thursday and 2:00 PM Friday", () => {
    expect(FD_CUTOFF_BY_DAY).toEqual([900, 900, 900, 900, 840]);
    [0, 1, 2, 3].forEach(d => expect(fmtClock(fdCutoffMins(d))).toBe("3:00 PM"));
    expect(fmtClock(fdCutoffMins(4))).toBe("2:00 PM");
  });

  it("has no cutoff outside the board's Mon–Fri range", () => {
    [-1, 5, 6, 7, null, undefined, "x", 1.5, NaN].forEach(d =>
      expect(fdCutoffMins(d)).toBeNull()
    );
  });

  it("formats clock minutes the way the badge reads them", () => {
    expect(fmtClock(0)).toBe("12:00 AM");
    expect(fmtClock(1)).toBe("12:01 AM");
    expect(fmtClock(11 * 60 + 59)).toBe("11:59 AM");
    expect(fmtClock(12 * 60)).toBe("12:00 PM");
    expect(fmtClock(13 * 60 + 5)).toBe("1:05 PM");
    expect(fmtClock(840)).toBe("2:00 PM");
    expect(fmtClock(900)).toBe("3:00 PM");
    expect(fmtClock(23 * 60 + 59)).toBe("11:59 PM");
  });

  it("names a colour for every level the flag can return", () => {
    const levels = new Set();
    for (let d = 0; d < 5; d++) {
      for (let m = 0; m < 24 * 60; m += 7) {
        const f = finishingDynamicsFlag(fdEntry(), { dayIdx: d, isToday: true, now: at(d, 0, 0) + m * 60000 });
        if (f) levels.add(f.level);
      }
    }
    levels.add(finishingDynamicsFlag(fdEntry(), { dayIdx: 0, isToday: false }).level);
    expect(levels.size).toBeGreaterThan(0);
    levels.forEach(l => expect(FD_FLAG_COLORS[l]).toBeTruthy());
  });
});

describe("recognising a Finishing Dynamics stop", () => {
  it("catches every shape the board actually produces", () => {
    const shapes = [
      { stop: "Finishing Dynamics - Villa Rica", customer: "IMETCO", stopType: "pickup" },
      { stop: "IMETCO to Finishing Dynamics", customer: "IMETCO" },
      { stop: "Finishing Dynamics to IMETCO", customer: "IMETCO" },
      { stop: "Round Trip IMETCO & Finishing Dynamics", customer: "IMETCO" },
      { stop: "Quote Delivery", customer: "Quote Delivery", pickupFrom: "Finishing Dynamics - Villa Rica" },
      { stop: "Quote Delivery", customer: "Quote Delivery", addr: "28 Andrews Way, Villa Rica, GA 30180" },
      { stop: "Quote Delivery", customer: "Quote Delivery", pickupAddr: "28 Andrews Way, Villa Rica, GA 30180" },
      { stop: "Some Run", customer: "IMETCO", pickupFrom: "Villa Rica" },
      { stop: "finishing dynamics to imetco", customer: "IMETCO" },
    ];
    shapes.forEach(s => expect(touchesFinishingDynamics(s), JSON.stringify(s)).toBe(true));
  });

  it("does not drag in stops that never see the Villa Rica dock", () => {
    const nope = [
      null,
      undefined,
      {},
      { stop: "Emser Tile - Norcross", customer: "Emser Tile" },
      { stop: "Perfect Edge to IMETCO", customer: "IMETCO", pickupFrom: "Doraville" },
      { stop: "IMETCO Delivery", customer: "IMETCO", pickupFrom: "Norcross" },
      /* another customer happening to sit in Villa Rica does NOT inherit
         IMETCO's dock hours */
      { stop: "Random Jobsite", customer: "Quote Delivery", pickupFrom: "Villa Rica" },
      { stop: "Random Jobsite", customer: "Quote Delivery", addr: "12 Other St, Villa Rica, GA 30180" },
    ];
    nope.forEach(s => expect(touchesFinishingDynamics(s), JSON.stringify(s)).toBe(false));
  });

  it("matches the dock as it is actually spelled in pickupConfig", () => {
    const dock = PICKUP_SOURCES.find(p => p.label.includes("Finishing Dynamics"));
    expect(dock).toBeTruthy();
    expect(touchesFinishingDynamics({ stop: dock.label, customer: dock.customer })).toBe(true);
    expect(touchesFinishingDynamics({ stop: "X", customer: "IMETCO", addr: dock.addr })).toBe(true);
  });
});

describe("the flag through a working day", () => {
  it("stays quiet for stops that aren't Finishing Dynamics", () => {
    const f = finishingDynamicsFlag({ stop: "Emser Tile - Norcross", customer: "Emser Tile" }, { dayIdx: 0, isToday: true, now: at(0, 16) });
    expect(f).toBeNull();
  });

  it("stays quiet once the stop is departed — it made it", () => {
    const done = fdEntry({ status: "departed", departedAt: "2:40 PM" });
    expect(finishingDynamicsFlag(done, { dayIdx: 0, isToday: true, now: at(0, 16) })).toBeNull();
    expect(finishingDynamicsFlag(done, { dayIdx: 4, isToday: false })).toBeNull();
  });

  it("still flags a stop the driver is ON SITE for", () => {
    const onSite = fdEntry({ status: "arrived", arrivedAt: "2:55 PM" });
    expect(finishingDynamicsFlag(onSite, { dayIdx: 0, isToday: true, now: at(0, 8) }).level).toBe("info");
  });

  DAY_NAMES.forEach((name, d) => {
    const cut = FD_CUTOFF_BY_DAY[d];
    const cutText = d === 4 ? "2:00 PM" : "3:00 PM";

    it(`${name}: info early, soon inside the lead, late after ${cutText}`, () => {
      const e = fdEntry();
      const ctx = mins => ({ dayIdx: d, isToday: true, now: at(d, 0, 0) + mins * 60000 });

      const early = finishingDynamicsFlag(e, ctx(8 * 60));
      expect(early.level).toBe("info");
      expect(early.cutoff).toBe(cut);
      expect(early.text).toBe(`FD CLOSES ${cutText}`);

      const soon = finishingDynamicsFlag(e, ctx(cut - 30));
      expect(soon.level).toBe("soon");
      expect(soon.minsLeft).toBe(30);
      expect(soon.text).toBe(`FD CLOSES ${cutText} · 30m`);

      const onTheMinute = finishingDynamicsFlag(e, ctx(cut));
      expect(onTheMinute.level).toBe("late");
      expect(onTheMinute.text).toBe(`PAST FD ${cutText} CUTOFF`);

      const after = finishingDynamicsFlag(e, ctx(cut + 45));
      expect(after.level).toBe("late");
      expect(after.minsLeft).toBe(-45);
    });

    it(`${name}: level only ever gets worse as the day runs on`, () => {
      const rank = { info: 0, soon: 1, late: 2 };
      let last = -1;
      for (let m = 0; m < 24 * 60; m++) {
        const f = finishingDynamicsFlag(fdEntry(), { dayIdx: d, isToday: true, now: at(d, 0, 0) + m * 60000 });
        expect(f).toBeTruthy();
        expect(rank[f.level]).toBeGreaterThanOrEqual(last);
        last = rank[f.level];
      }
      expect(last).toBe(2);
    });
  });

  it("Friday goes red a full hour before Monday would", () => {
    const e = fdEntry();
    const monAt230 = finishingDynamicsFlag(e, { dayIdx: 0, isToday: true, now: at(0, 14, 30) });
    const friAt230 = finishingDynamicsFlag(e, { dayIdx: 4, isToday: true, now: at(4, 14, 30) });
    expect(monAt230.level).toBe("soon");
    expect(friAt230.level).toBe("late");
  });

  it("respects a custom warn lead", () => {
    const e = fdEntry();
    const ctx = (mins, warnLead) => ({ dayIdx: 0, isToday: true, now: at(0, 0, 0) + mins * 60000, warnLead });
    expect(finishingDynamicsFlag(e, ctx(900 - 100, 90)).level).toBe("info");
    expect(finishingDynamicsFlag(e, ctx(900 - 100, 120)).level).toBe("soon");
    expect(finishingDynamicsFlag(e, ctx(900 - 1, 0)).level).toBe("info");
  });
});

describe("a board opened for another day", () => {
  it("shows the cutoff but never a countdown or a red flag", () => {
    for (let d = 0; d < 5; d++) {
      const f = finishingDynamicsFlag(fdEntry(), { dayIdx: d, isToday: false, now: at(d, 23, 59) });
      expect(f.level).toBe("info");
      expect(f.minsLeft).toBeNull();
      expect(f.cutoff).toBe(FD_CUTOFF_BY_DAY[d]);
    }
  });

  it("reads the cutoff off the DISPLAYED day, not the wall clock", () => {
    /* Friday's board opened on a Monday must say 2:00 PM. */
    const f = finishingDynamicsFlag(fdEntry(), { dayIdx: 4, isToday: false, now: at(0, 10) });
    expect(f.cutoffText).toBe("2:00 PM");
  });
});

describe("ETA that overruns the cutoff", () => {
  const etaEntry = (setAtMs, mins) => fdEntry({ eta: String(mins), etaSetAt: setAtMs });

  it("goes red at 2:35 when the ETA lands at 3:20", () => {
    const now = at(0, 14, 35);
    const f = finishingDynamicsFlag(etaEntry(now, 45), { dayIdx: 0, isToday: true, now });
    expect(f.level).toBe("late");
    expect(f.text).toBe("ETA 3:20 PM — MISSES FD 3:00 PM");
    expect(f.minsLeft).toBe(25); /* clock still says 25 minutes — that's the point */
  });

  it("leaves an ETA that beats the cutoff alone", () => {
    const now = at(0, 14, 0);
    const f = finishingDynamicsFlag(etaEntry(now, 30), { dayIdx: 0, isToday: true, now });
    expect(f.level).toBe("soon");
  });

  it("uses the ETA's own timestamp, not now, so a stale ETA doesn't drift", () => {
    /* Friday, cutoff 2:00 PM. Driver reported 90 min out at 1:00 PM, so the
       arrival is pinned at 2:30 PM no matter when the dispatcher looks. Anchor
       it off `now` instead and the projected arrival would slide to 3:00 PM. */
    const setAt = at(4, 13, 0);
    const now = at(4, 13, 30);
    const f = finishingDynamicsFlag(etaEntry(setAt, 90), { dayIdx: 4, isToday: true, now });
    expect(f.level).toBe("late");
    expect(f.text).toBe("ETA 2:30 PM — MISSES FD 2:00 PM");
  });

  it("ignores an ETA that resolves onto a different calendar day", () => {
    const setAt = at(0, 22, 0);
    const now = at(0, 22, 0);
    const f = finishingDynamicsFlag(etaEntry(setAt, 300), { dayIdx: 0, isToday: true, now });
    expect(f.level).toBe("late"); /* late because 10 PM > 3 PM, not because of the ETA */
    expect(f.text).toBe("PAST FD 3:00 PM CUTOFF");
  });

  it("shrugs off junk ETAs instead of flagging on them", () => {
    const now = at(0, 8, 0);
    ["", null, undefined, "abc", "0", "-30", 0].forEach(eta => {
      const f = finishingDynamicsFlag(fdEntry({ eta, etaSetAt: now }), { dayIdx: 0, isToday: true, now });
      expect(f.level, String(eta)).toBe("info");
    });
  });
});

/* ── The badge itself ───────────────────────────────────────────────────────
   The logic above is pure; these render it through react-dom/server so a
   wiring mistake (wrong prop name, colour that never reaches the span, a level
   with no palette entry) fails here rather than on the dispatcher's screen. */
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { FDFlag } from "./FDFlag.jsx";

const render = props => renderToStaticMarkup(createElement(FDFlag, props));

describe("FDFlag badge", () => {
  it("renders nothing at all for an ordinary stop", () => {
    expect(render({ entry: { stop: "Emser Tile - Norcross", customer: "Emser Tile" }, day: 0, today: true, now: at(0, 16) })).toBe("");
  });

  it("renders nothing when no day context reached it", () => {
    expect(render({ entry: fdEntry() })).toBe("");
  });

  it("paints the info badge amber with the day's cutoff", () => {
    const html = render({ entry: fdEntry(), day: 0, today: true, now: at(0, 9) });
    expect(html).toContain("FD CLOSES 3:00 PM");
    expect(html).toContain("🚩");
    expect(html).toContain(FD_FLAG_COLORS.info.bg);
    expect(html).toContain('data-fd-level="info"');
  });

  it("paints the late badge red once the dock is shut", () => {
    const html = render({ entry: fdEntry(), day: 4, today: true, now: at(4, 14, 30) });
    expect(html).toContain("PAST FD 2:00 PM CUTOFF");
    expect(html).toContain(FD_FLAG_COLORS.late.bg);
    expect(html).toContain('data-fd-level="late"');
  });

  it("counts down in the warning window", () => {
    const html = render({ entry: fdEntry(), day: 2, today: true, now: at(2, 14, 25) });
    expect(html).toContain("FD CLOSES 3:00 PM · 35m");
    expect(html).toContain('data-fd-level="soon"');
  });

  it("carries the explanation in a title attribute for hover", () => {
    const html = render({ entry: fdEntry(), day: 0, today: true, now: at(0, 15, 30) });
    expect(html).toMatch(/title="[^"]*3:00 PM[^"]*"/);
  });

  it("honours every size without dropping the text", () => {
    ["xs", "sm", "lg", "nonsense"].forEach(size => {
      const html = render({ entry: fdEntry(), day: 0, today: true, now: at(0, 9), size });
      expect(html, size).toContain("FD CLOSES 3:00 PM");
    });
  });

  it("colours every level it can ever reach", () => {
    const seen = new Set();
    for (let d = 0; d < 5; d++) {
      for (let m = 6 * 60; m < 20 * 60; m += 5) {
        const html = render({ entry: fdEntry(), day: d, today: true, now: at(d, 0) + m * 60000 });
        const level = /data-fd-level="(\w+)"/.exec(html)[1];
        seen.add(level);
        expect(html, `${d} ${m}`).toContain(FD_FLAG_COLORS[level].bg);
      }
    }
    expect([...seen].sort()).toEqual(["info", "late", "soon"]);
  });
});
