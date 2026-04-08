import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const apiKey = Netlify.env.get("MOTIVE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "MOTIVE_API_KEY not configured" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }

  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";

  try {
    // Try GoMotive API with Bearer auth
    let r = await fetch("https://api.gomotive.com/v1/vehicle_locations", {
      headers: { "Authorization": `Bearer ${apiKey}`, "Accept": "application/json" }
    });

    // Fallback to legacy KeepTruckin with X-Api-Key
    if (!r.ok) {
      r = await fetch("https://api.keeptruckin.com/v1/vehicle_locations", {
        headers: { "X-Api-Key": apiKey, "Accept": "application/json" }
      });
    }

    if (!r.ok) {
      const errText = await r.text();
      return new Response(JSON.stringify({ error: "Motive API error", status: r.status, body: errText.substring(0, 500) }), {
        status: 502, headers: { "Content-Type": "application/json" }
      });
    }

    const raw = await r.json();

    // Debug mode: return raw first 2 items
    if (debug) {
      const list = raw.vehicle_locations || raw.vehicles || [];
      return new Response(JSON.stringify({
        topLevelKeys: Object.keys(raw),
        totalItems: list.length,
        sample: list.slice(0, 2),
        apiUsed: r.url
      }, null, 2), {
        status: 200, headers: { "Content-Type": "application/json" }
      });
    }

    // Parse vehicles
    const vehicles: any[] = [];
    const list = raw.vehicle_locations || raw.vehicles || [];

    for (const item of list) {
      const vl = item.vehicle_location || item;
      const v = vl.vehicle || {};
      const loc = vl.current_location || vl.location || {};
      const driver = vl.driver || v.driver || {};

      const lat = parseFloat(loc.lat || loc.latitude || v.current_location?.lat || 0);
      const lng = parseFloat(loc.lon || loc.lng || loc.longitude || v.current_location?.lon || 0);

      // Skip vehicles with no position
      if (lat === 0 && lng === 0) continue;

      vehicles.push({
        number: v.number || v.vehicle_number || vl.number || "",
        lat,
        lng,
        speed: loc.speed != null ? parseFloat(loc.speed) : null,
        bearing: loc.bearing != null ? parseFloat(loc.bearing) : null,
        state: loc.engine_state || loc.status || "",
        city: loc.city || "",
        locState: loc.state || "",
        locatedAt: loc.located_at || loc.timestamp || "",
        driver: {
          name: driver.full_name || driver.name ||
            [driver.first_name, driver.last_name].filter(Boolean).join(" ") || ""
        }
      });
    }

    return new Response(JSON.stringify({ vehicles, fetchedAt: new Date().toISOString() }), {
      status: 200, headers: { "Content-Type": "application/json", "Cache-Control": "max-age=30" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/motive-gps"
};
