import type { Context, Config } from "@netlify/functions";

const GLORY_BOUND_TRUCKS: Record<string, string> = {
  "0608": "Trevor Seyers",
  "4757": "Trevarr Howard",
  "0294": "Brent Dixon",
};

export default async (req: Request, context: Context) => {
  const apiKey = Netlify.env.get("MOTIVE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "MOTIVE_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const fetchedAt = new Date().toISOString();

    const resp = await fetch("https://api.gomotive.com/v1/vehicle_locations", {
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(
        JSON.stringify({ error: `Motive API ${resp.status}`, detail: errText.substring(0, 200) }),
        { status: resp.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();

    // Motive v1 returns: { vehicle_locations: [ { vehicle: { ... } }, ... ] }
    const rawList = data.vehicle_locations || data.vehicles || [];

    const vehicles = rawList
      .map((item: any) => {
        const v = item.vehicle || item;
        const loc = v.current_location || {};
        const drv = v.current_driver || {};

        const rawNumber = String(v.number || "").replace(/\D/g, "");
        const paddedNumber = rawNumber.padStart(4, "0");

        // Only process Glory Bound trucks
        if (!GLORY_BOUND_TRUCKS[paddedNumber]) return null;

        const driverName =
          (drv.first_name || drv.last_name)
            ? `${drv.first_name || ""} ${drv.last_name || ""}`.trim()
            : GLORY_BOUND_TRUCKS[paddedNumber];

        return {
          number: v.number || rawNumber,
          paddedNumber,
          lat: loc.lat ?? null,
          lng: loc.lon ?? loc.lng ?? null,
          speed: loc.speed != null ? Math.round(loc.speed) : null,
          bearing: loc.bearing ?? 0,
          state: loc.engine_state || "",
          city: loc.description || "",
          locState: loc.state || "",
          locatedAt: loc.located_at || "",
          driver: { name: driverName || "" },
        };
      })
      .filter((v: any) => v !== null);

    return new Response(JSON.stringify({ fetchedAt, vehicles }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/motive-gps",
};
