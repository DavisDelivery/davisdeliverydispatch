import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST required" }), {
      status: 405, headers: { "Content-Type": "application/json" }
    });
  }

  const apiKey = Netlify.env.get("GOOGLE_MAPS_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GOOGLE_MAPS_API_KEY not configured" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }

  let body: { origin: string; destination: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }

  const { origin, destination } = body;
  if (!origin || !destination) {
    return new Response(JSON.stringify({ error: "Need origin and destination addresses" }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&mode=driving&units=imperial&key=${apiKey}`;
    const r = await fetch(url);
    const data = await r.json();

    if (data.status !== "OK" || !data.rows?.[0]?.elements?.[0]) {
      return new Response(JSON.stringify({ error: "Distance Matrix API error", details: data.status }), {
        status: 502, headers: { "Content-Type": "application/json" }
      });
    }

    const el = data.rows[0].elements[0];
    if (el.status !== "OK") {
      return new Response(JSON.stringify({ error: "Route not found", details: el.status }), {
        status: 404, headers: { "Content-Type": "application/json" }
      });
    }

    const meters = el.distance.value;
    const miles = Math.round((meters / 1609.34) * 10) / 10;
    const durationSec = el.duration.value;
    const durationMin = Math.round(durationSec / 60);

    // Glory Bound liftgate rate tiers (driving distance from pickup to delivery)
    let baseRate: number;
    if (miles <= 10) baseRate = 100;
    else if (miles <= 20) baseRate = 150;
    else if (miles <= 30) baseRate = 200;
    else if (miles <= 40) baseRate = 250;
    else {
      // 40+ miles: $250 base + $25 for every 10 miles over 40
      const overMiles = miles - 40;
      const extraTiers = Math.ceil(overMiles / 10);
      baseRate = 250 + (extraTiers * 25);
    }

    return new Response(JSON.stringify({
      success: true,
      miles,
      durationMin,
      distanceText: el.distance.text,
      durationText: el.duration.text,
      baseRate,
      liftgateFee: 75,
      total: baseRate + 75,
      // Additional surcharges (user applies manually)
      notes: {
        gravel: "+$25 if gravel/new construction",
        pallets: "+$25 for 4-5 pallets",
        fuel: "15% fuel only for quoted deliveries WITHOUT liftgate"
      }
    }), {
      status: 200, headers: { "Content-Type": "application/json", "Cache-Control": "max-age=3600" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/calc-distance"
};
