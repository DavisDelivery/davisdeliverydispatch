/* Motive GPS Proxy — Netlify Serverless Function
   Fetches vehicle locations from Motive (KeepTruckin) API
   and returns them in a normalized format for the dispatch app.
   
   Environment variable required: MOTIVE_API_KEY
   Deploy path: netlify/functions/motive-gps.js
   App calls: /api/motive-gps (config.path handles routing)
*/

const TRUCK_DRIVER_MAP = {
  "0608": "Trevor Seyers",
  "4757": "Trevarr Howard",
  "0294": "Brent Dixon",
};

export default async (req) => {
  const apiKey = Netlify.env.get("MOTIVE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "MOTIVE_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const fetchedAt = new Date().toISOString();
    const resp = await fetch(
      "https://api.gomotive.com/v1/vehicle_locations",
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("[MOTIVE] API error:", resp.status, errText);
      return new Response(
        JSON.stringify({ error: `Motive API ${resp.status}`, detail: errText }),
        { status: resp.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();
    const rawVehicles = data.vehicle_locations || data.vehicles || [];

    const vehicles = rawVehicles.map((item) => {
      const v = item.vehicle || item;
      const loc = v.current_location || v;
      const rawNumber = String(v.number || v.id || "").replace(/\D/g, "");
      const paddedNumber = rawNumber.padStart(4, "0");

      const drvObj = v.driver || loc.driver || {};
      const driverName = (drvObj.first_name || drvObj.last_name)
        ? `${drvObj.first_name || ""} ${drvObj.last_name || ""}`.trim()
        : TRUCK_DRIVER_MAP[paddedNumber] || null;

      return {
        number: rawNumber,
        paddedNumber,
        lat: loc.lat ?? loc.latitude ?? null,
        lng: loc.lon ?? loc.lng ?? loc.longitude ?? null,
        speed: Math.round(loc.speed ?? 0),
        bearing: loc.bearing ?? loc.heading ?? 0,
        state: loc.engine_state || loc.movement_state || "unknown",
        city: loc.description || loc.city || "",
        locState: loc.state || "",
        locatedAt: loc.located_at || loc.updated_at || fetchedAt,
        driver: { name: driverName || "" },
      };
    });

    const located = vehicles.filter((v) => v.lat !== null && v.lng !== null);

    return new Response(JSON.stringify({ fetchedAt, vehicles: located }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30",
      },
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
