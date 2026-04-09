import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  const apiKey = Netlify.env.get("MOTIVE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "MOTIVE_API_KEY not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const resp = await fetch(
      "https://api.gomotive.com/v1/vehicle_locations",
      {
        headers: {
          "X-Api-Key": apiKey,
          Accept: "application/json",
        },
      }
    );

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(
        JSON.stringify({ error: "Motive API error", status: resp.status, detail: text.slice(0, 200) }),
        { status: resp.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();
    const vehicles = (data.vehicle_locations || data.vehicles || []).map((v: any) => {
      const loc = v.current_location || v;
      const driver = v.driver || loc.driver || null;
      return {
        number: v.number || v.vehicle?.number || "",
        lat: loc.lat || loc.latitude || null,
        lng: loc.lon || loc.lng || loc.longitude || null,
        speed: loc.speed || 0,
        bearing: loc.bearing || loc.heading || 0,
        state: loc.engine_state || loc.state || "",
        city: loc.city || "",
        locState: loc.state_of_location || loc.region || "",
        locatedAt: loc.located_at || loc.timestamp || "",
        driver: driver
          ? {
              id: driver.id,
              name:
                [driver.first_name, driver.last_name].filter(Boolean).join(" ") ||
                driver.name ||
                "",
            }
          : null,
      };
    });

    return new Response(
      JSON.stringify({ vehicles, fetchedAt: new Date().toISOString() }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: "Fetch failed", message: e.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config: Config = {
  path: "/api/motive-gps",
};
