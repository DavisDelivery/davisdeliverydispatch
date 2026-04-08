import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const apiKey = Netlify.env.get("MOTIVE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "MOTIVE_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const resp = await fetch("https://api.gomotive.com/v3/vehicle_locations", {
      headers: {
        "X-Api-Key": apiKey,
        "Accept": "application/json",
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: `Motive API ${resp.status}`, detail: text }), {
        status: resp.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    
    // Extract just what we need: vehicle number, driver name, lat/lng, speed, state
    const vehicles = (data.vehicles || []).map((v: any) => {
      const veh = v.vehicle || v;
      const loc = veh.current_location || {};
      const driver = veh.current_driver || veh.driver || null;
      return {
        id: veh.id,
        number: veh.number || "",
        make: veh.make || "",
        model: veh.model || "",
        driver: driver ? {
          id: driver.id,
          firstName: driver.first_name || "",
          lastName: driver.last_name || "",
          name: `${driver.first_name || ""} ${driver.last_name || ""}`.trim(),
        } : null,
        lat: loc.lat || null,
        lng: loc.lon || loc.lng || null,
        speed: loc.kph ? Math.round(loc.kph * 0.621371) : 0, // kph to mph
        bearing: loc.bearing || null,
        state: loc.vehicle_state || "off",
        city: loc.city || "",
        locState: loc.state || "",
        locatedAt: loc.located_at || null,
      };
    });

    return new Response(JSON.stringify({ vehicles, fetchedAt: new Date().toISOString() }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "max-age=30" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Fetch failed", detail: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/motive-locations",
};
