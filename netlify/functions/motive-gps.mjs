/**
 * Motive GPS proxy — called by App.jsx every 60 seconds
 * GET /api/motive-gps
 *
 * Returns:
 * {
 *   fetchedAt: ISO string,
 *   vehicles: [
 *     { number, lat, lng, speed, bearing, state, city, locState, locatedAt, driver: { name } }
 *   ]
 * }
 *
 * Truck → Driver mapping (Motive vehicle numbers):
 *   0608 → Trevor Seyers
 *   4757 → Trevarr Howard
 *   0294 → Brent Dixon
 */

const TRUCK_DRIVER_MAP = {
  "0608": "Trevor Seyers",
  "4757": "Trevarr Howard",
  "0294":  "Brent Dixon",
};

export default async (req) => {
  const apiKey = Netlify.env.get("MOTIVE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "MOTIVE_API_KEY not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Motive Fleet API v1 — vehicle locations
    const motiveRes = await fetch(
      "https://api.gomotive.com/v1/vehicle_locations?per_page=25",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    if (!motiveRes.ok) {
      const errText = await motiveRes.text();
      console.error("[MOTIVE] API error:", motiveRes.status, errText);
      return new Response(
        JSON.stringify({ error: `Motive API ${motiveRes.status}`, detail: errText }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const motiveData = await motiveRes.json();
    const fetchedAt = new Date().toISOString();

    // Normalize into the shape App.jsx expects
    const vehicles = (motiveData.vehicle_locations || []).map((vl) => {
      const v = vl.vehicle || {};
      const loc = vl.location || {};
      const drvObj = vl.driver || {};

      // Truck number — strip leading zeros for display, keep raw for mapping
      const rawNumber = String(v.number || "").trim();
      const paddedNumber = rawNumber.padStart(4, "0");

      // Fall back to truck map if Motive doesn't return a driver name
      const driverName =
        drvObj.first_name
          ? `${drvObj.first_name} ${drvObj.last_name || ""}`.trim()
          : TRUCK_DRIVER_MAP[paddedNumber] || null;

      return {
        number: rawNumber,                        // e.g. "608"
        paddedNumber,                             // e.g. "0608"
        lat: loc.lat ?? null,
        lng: loc.lon ?? null,                     // Motive uses "lon"
        speed: Math.round(loc.speed ?? 0),        // mph
        bearing: loc.bearing ?? 0,
        state: loc.engine_state || "unknown",     // "on" | "off" | "idle"
        city: loc.description || "",              // city string from Motive
        locState: loc.state || "",                // US state abbreviation
        locatedAt: loc.located_at || fetchedAt,
        driver: { name: driverName || "" },
      };
    });

    // Filter out vehicles with no coordinates
    const located = vehicles.filter((v) => v.lat !== null && v.lng !== null);

    return new Response(JSON.stringify({ fetchedAt, vehicles: located }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[MOTIVE] Fetch exception:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/motive-gps",
};
