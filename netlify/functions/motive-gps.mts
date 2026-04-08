export default async (req, context) => {
  const apiKey = Netlify.env.get("MOTIVE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "MOTIVE_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Try new Motive API endpoint first
    let r = await fetch("https://api.gomotive.com/v1/vehicle_locations", {
      headers: { "Authorization": `Bearer ${apiKey}`, "Accept": "application/json" }
    });

    // Fallback to legacy KeepTruckin endpoint
    if (!r.ok) {
      r = await fetch("https://api.keeptruckin.com/v1/vehicle_locations", {
        headers: { "X-Api-Key": apiKey, "Accept": "application/json" }
      });
    }

    if (!r.ok) {
      const errText = await r.text();
      return new Response(JSON.stringify({ error: "Motive API error", status: r.status, detail: errText }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await r.json();
    const vehicles = [];
    const list = data.vehicle_locations || data.vehicles || [];

    for (const item of list) {
      const vl = item.vehicle_location || item;
      const v = vl.vehicle || {};
      const loc = vl.current_location || vl.location || vl;
      const driver = vl.driver || v.driver || {};

      vehicles.push({
        number: v.number || v.vehicle_number || "",
        lat: parseFloat(loc.lat || loc.latitude || 0),
        lng: parseFloat(loc.lon || loc.lng || loc.longitude || 0),
        speed: loc.speed != null ? parseFloat(loc.speed) : null,
        bearing: loc.bearing != null ? parseFloat(loc.bearing) : null,
        state: loc.engine_state || loc.status || "",
        city: loc.city || "",
        locState: loc.state || "",
        locatedAt: loc.located_at || loc.timestamp || "",
        driver: {
          name: driver.full_name || driver.name || [driver.first_name, driver.last_name].filter(Boolean).join(" ") || ""
        }
      });
    }

    return new Response(JSON.stringify({ vehicles, fetchedAt: new Date().toISOString() }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "max-age=30" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
