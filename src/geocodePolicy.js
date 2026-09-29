/* ═══ WHEN TO LOOK AN ADDRESS UP ═══

   A stop is pinned on the map only once its address has coordinates, and a
   stop without them is dropped from the map. The lookup had three ways to leave
   a valid address unpinned:

   - It ran before Google Maps had loaded — every uncached address on every page
     load — and fell straight through to OpenStreetMap's Nominatim, which can't
     parse a suite ("1750 Corporate Drive, Suite 740" finds nothing there, with
     or without the suite, while Google finds it to the rooftop). Worse, what
     Nominatim DID find was cached for good and never re-asked of Google — the
     same low-quality entries a v3.11.62 migration once had to purge.
   - A lookup that never answered left the address marked in-progress, so it was
     never asked again for the rest of the session.
   - A lookup that failed was asked again on every redraw, forever.

   These rules decide what happens instead. They are pure so they can be held to
   account; App.jsx does the talking to Google. */

/* What a Google status means for this address. */
export const classifyGoogleStatus = (status) => {
  if (status === "OK") return "ok";
  /* Google has answered and won't find it (or won't answer for this key). A
     second opinion may help; asking Google again won't. */
  if (status === "ZERO_RESULTS" || status === "NOT_FOUND" || status === "INVALID_REQUEST" || status === "REQUEST_DENIED") return "fallback";
  /* Rate limit, a server hiccup, a dropped connection: Google would likely
     answer if asked again later. Don't spend the address on a worse source. */
  return "retry";
};

/* Back off 15s, 30s, 1m, 2m … capped at 30 minutes. */
export const RETRY_BASE_MS = 15 * 1000;
export const RETRY_CAP_MS = 30 * 60 * 1000;
export const retryDelayMs = (tries) => {
  const n = Math.max(1, Math.floor(Number(tries) || 1));
  return Math.min(RETRY_CAP_MS, RETRY_BASE_MS * Math.pow(2, n - 1));
};

/* A lookup that hasn't answered in this long is treated as failed, so it can
   never lock the address out. */
export const LOOKUP_TIMEOUT_MS = 20 * 1000;

/* Should this address be looked up right now, and how?
     "google"           — ask Google now
     "wait-for-google"  — Maps is still loading; ask Google when it's ready
     "wait"             — a lookup is in flight, or this address is backing off */
export const geocodeDecision = ({ googleReady, pending, failure, now }) => {
  if (pending) return "wait";
  if (failure && Number(failure.retryAt) > Number(now)) return "wait";
  if (!googleReady) return "wait-for-google";
  return "google";
};

/* Record one more failure. */
export const nextFailure = (prev, now) => {
  const tries = ((prev && prev.tries) || 0) + 1;
  return { tries, retryAt: Number(now) + retryDelayMs(tries) };
};

/* Nominatim can't parse a unit designator, and the building is the same
   building whatever the suite. Ask it about the street address alone. */
export const nominatimQuery = (addr) => String(addr == null ? "" : addr)
  .replace(/[,\s]*\b(?:suite|ste|unit|bldg|building|apt|apartment|room|rm|fl|floor)\b\.?\s*#?\s*[\w-]+/gi, "")
  .replace(/[,\s]*#\s*[\w-]+/g, "")
  .replace(/\s*,\s*/g, ", ")
  .replace(/(?:,\s*){2,}/g, ", ")
  .replace(/\s{2,}/g, " ")
  .replace(/^[,\s]+|[,\s]+$/g, "")
  .trim();

/* What the board should say about a stop it can't pin. */
export const mapStatusLabel = (state) => {
  switch (state) {
    case "no-address": return "no address on file";
    case "waiting": return "waiting for the map to load";
    case "pending": return "locating…";
    case "failed": return "address not found";
    default: return "";
  }
};
