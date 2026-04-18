/* Motive GPS Proxy — Netlify Serverless Function
 *
 * Fetches vehicle locations from Motive (formerly KeepTruckin) and returns
 * them normalized for the dispatch app. Called from the client every 20s.
 *
 * ENV VAR: MOTIVE_API_KEY  (Motive Fleet Dashboard → Admin → Developers)
 * ROUTE:   /api/motive-gps
 *
 * Motive's current API (v3, docs: developer-docs.gomotive.com) uses the
 * X-Api-Key header and returns { vehicles: [{ vehicle: { current_location,
 * current_driver, ... } }] }. We translate to a flat normalized list.
 *
 * Truck number → driver name mapping here is the authoritative source;
 * the client does EXACT-match name lookup to avoid substring collisions.
 */

/* Hardcoded Davis Delivery truck roster.
   Numbers should match the "number" field Motive returns for each vehicle.
   If Motive exposes current_driver on its own, we prefer that; this is
   the fallback when Motive hasn't synced the driver assignment. */
const TRUCK_DRIVER_MAP = {
  "0608": "Trevor Seyers",
  "4757": "Trevarr Howard",
  "0294": "Brent Dixon",
};

export default async (req) => {
  const apiKey = Netlify.env.get("MOTIVE_API_KEY");
  if (!apiKey) {
    return json(500, {
      error: "MOTIVE_API_KEY not configured",
      hint: "Set this in Netlify → Site configuration → Environment variables (Functions scope).",
    });
  }

  const fetchedAt = new Date().toISOString();

  try {
    /* v3 endpoint is current for vehicles with the Motive Vehicle Gateway.
       Header is X-Api-Key per Motive's API-key auth docs. */
    const resp = await fetch("https://api.gomotive.com/v3/vehicle_locations", {
      headers: {
        "X-Api-Key": apiKey,
        "Accept": "application/json",
      },
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error("[MOTIVE] API error", resp.status, errText.slice(0, 300));
      return json(resp.status, {
        error: `Motive API ${resp.status}`,
        detail: errText.slice(0, 500),
        fetchedAt,
      });
    }

    const data = await resp.json();

    /* v3 returns { vehicles: [...] } where each is wrapped in { vehicle: {...} } */
    const rawList = data.vehicles || data.vehicle_locations || [];

    const vehicles = rawList
      .map((item) => {
        const v = item.vehicle || item;
        const loc = v.current_location || v.location || {};
        const drv = v.current_driver || v.driver || {};

        const rawNumber = String(v.number || v.id || "").replace(/\D/g, "");
        const paddedNumber = rawNumber.padStart(4, "0");

        /* Only surface trucks in our roster. Filters out any other vehicles
           the Motive account may have (rentals, retired units, etc). */
        const rosterName = TRUCK_DRIVER_MAP[paddedNumber];
        if (!rosterName) return null;

        const lat = loc.lat ?? loc.latitude ?? null;
        const lng = loc.lon ?? loc.lng ?? loc.longitude ?? null;
        if (lat === null || lng === null) return null;

        /* Prefer Motive's reported driver if present, fallback to roster.
           Normalize to "First Last" so client exact-match works. */
        const motiveDriverName = (drv.first_name || drv.last_name)
          ? `${drv.first_name || ""} ${drv.last_name || ""}`.trim()
          : "";
        const driverName = motiveDriverName || rosterName;

        /* Motive v3 speed is in km/h. Convert to mph. */
        const speedKph = loc.speed ?? loc.kph ?? null;
        const speedMph = speedKph !== null ? Math.round(speedKph * 0.621371) : 0;

        return {
          number: rawNumber,
          paddedNumber,
          lat,
          lng,
          speed: speedMph,
          bearing: loc.bearing ?? loc.heading ?? 0,
          state: loc.vehicle_state || loc.engine_state || loc.movement_state || "unknown",
          city: loc.description || loc.city || "",
          locState: loc.state || "",
          locatedAt: loc.located_at || loc.updated_at || fetchedAt,
          driver: { name: driverName },
        };
      })
      .filter(Boolean);

    return json(200, { fetchedAt, vehicles }, 15);
  } catch (err) {
    console.error("[MOTIVE] Fetch exception:", err);
    return json(500, {
      error: "Motive fetch failed",
      detail: String(err?.message || err).slice(0, 300),
      fetchedAt,
    });
  }
};

function json(status, body, cacheSeconds) {
  const headers = { "Content-Type": "application/json" };
  if (cacheSeconds) headers["Cache-Control"] = `public, max-age=${cacheSeconds}`;
  return new Response(JSON.stringify(body), { status, headers });
}

export const config = {
  path: "/api/motive-gps",
};
