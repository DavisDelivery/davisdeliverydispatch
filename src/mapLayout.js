/* ═══ STOPS THAT SHARE A SPOT ═══

   Two deliveries in one building geocode to one point. Precision Flooring
   (Suite 740) and Vanguard (Suite 700) are both 1750 Corporate Drive, Norcross,
   at identical coordinates, so one pin was drawn exactly over the other: a
   routed pin is 20px across and an unassigned one 16px, so the unassigned stop
   vanished completely under the routed one — "why does this delivery have no
   pin". Moving the pins apart in latitude/longitude would only work zoomed in to
   street level; at the city zoom the board runs at they'd still be one dot. So
   the pins are fanned out in screen pixels, around the true point, at every zoom.

   Returns Map(stopId -> {dx, dy, n, i}) in pixels. A stop alone at its point
   gets {0, 0}. Deterministic: the same stops take the same slots however the
   day is ordered, so pins don't swap places on every redraw. */

/* Points closer than ~1m are the same building. */
export const spotKey = (c) => (c && Number.isFinite(Number(c.lat)) && Number.isFinite(Number(c.lng))
  ? Number(c.lat).toFixed(5) + "," + Number(c.lng).toFixed(5)
  : null);

/* Neighbouring pins on the ring stay at least this far apart, centre to centre —
   more than the widest pin (20px), so none can cover another. */
export const MIN_GAP_PX = 22;

export const ringRadius = (n) => {
  if (!(n > 1)) return 0;
  const chordFor1 = 2 * Math.sin(Math.PI / n); /* chord of a unit circle between neighbours */
  return Math.max(12, Math.ceil(MIN_GAP_PX / chordFor1));
};

export const fanOutOffsets = (stops) => {
  const groups = new Map();
  (Array.isArray(stops) ? stops : []).forEach((s) => {
    if (!s || s.id == null) return;
    const k = spotKey(s.coords);
    if (!k) return;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(String(s.id));
  });
  const out = new Map();
  groups.forEach((ids) => {
    const uniq = [...new Set(ids)].sort();
    const n = uniq.length;
    const r = ringRadius(n);
    uniq.forEach((id, i) => {
      if (n === 1) { out.set(id, { dx: 0, dy: 0, n, i }); return; }
      /* start on the left and go round, so a pair sits side by side */
      const a = Math.PI + (2 * Math.PI * i) / n;
      /* `|| 0`: sin(2π) rounds to -0, which is 0 but prints and compares oddly. */
      out.set(id, { dx: Math.round(r * Math.cos(a)) || 0, dy: Math.round(r * Math.sin(a)) || 0, n, i });
    });
  });
  return out;
};

/* Google positions a Symbol by its anchor, in the path's own units, and draws the
   path translated left and up by it — so to draw the pin (dx, dy) pixels away
   from the true point the anchor is the offset, negated, over the scale. */
export const symbolAnchorFor = (off, scale) => {
  const sc = Number(scale) > 0 ? Number(scale) : 1;
  const dx = (off && off.dx) || 0, dy = (off && off.dy) || 0;
  return { x: dx === 0 ? 0 : -dx / sc, y: dy === 0 ? 0 : -dy / sc };
};

/* An image icon's anchor is in pixels, measured from its top-left corner. */
export const imageAnchorFor = (off, w, h) => ({
  x: w / 2 - ((off && off.dx) || 0),
  y: h / 2 - ((off && off.dy) || 0),
});

/* ═══ ONE CLICK, ONE BUILDING ═══

   In click-to-assign, one click on a building takes every stop there that
   nobody has yet — the truck is going to that door anyway. The rule used to be
   "same stop name and same address", which only ever matched duplicate orders
   to one customer: Precision (Suite 740) and Vanguard (Suite 700) share 1750
   Corporate Drive, and a click took whichever pin was on top and left the other
   unassigned, hidden underneath it.

   Never taken: a stop already on a driver (a click never moves someone else's
   work), a finished stop, and an auto pickup (those follow their deliveries on
   their own). Returns the mates' ids, not the clicked stop's, in a fixed order. */
export const buildingMates = (clicked, stops, isTaken) => {
  if (!clicked) return [];
  const k = spotKey(clicked.coords);
  if (!k) return [];
  const taken = typeof isTaken === "function" ? isTaken : (s) => Number(s && s.driverId) > 0;
  return (Array.isArray(stops) ? stops : [])
    .filter((s) => s && s.id != null && String(s.id) !== String(clicked.id) && spotKey(s.coords) === k)
    .filter((s) => !taken(s) && s.status !== "departed" && !(s.stopType === "pickup" && !s.manualPickup))
    .map((s) => s.id)
    .filter((id, i, a) => a.findIndex((x) => String(x) === String(id)) === i)
    .sort((a, b) => String(a).localeCompare(String(b)));
};
