export default async (req, context) => {
  const apiKey = Netlify.env.get("MOTIVE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "MOTIVE_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";

  let r, endpoint;
  
  // Try legacy KeepTruckin endpoint first
  r = await fetch("https://api.keeptruckin.com/v1/vehicle_locations", {
    headers: { "X-Api-Key": apiKey, "Accept": "application/json" }
  });
  endpoint = "keeptruckin";

  if (!r.ok) {
    r = await fetch("https://api.gomotive.com/v1/vehicle_locations", {
      headers: { "Authorization": `Bearer ${apiKey}`, "Accept": "application/json" }
    });
    endpoint = "gomotive";
  }

  if (!r.ok) {
    const errText = await r.text();
    return new Response(JSON.stringify({ error: "Motive API error", status: r.status, endpoint, detail: errText.substring(0, 500) }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }

  const data = await r.json();

  // Debug: return raw sample so we can see the actual structure
  if (debug) {
    const raw = data.vehicle_locations || data.vehicles || [];
    return new Response(JSON.stringify({ endpoint, totalCount: raw.length, sample: raw.slice(0, 2), topKeys: Object.keys(data) }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  const vehicles = [];
  const list = data.vehicle_locations || data.vehicles || [];

  for (const item of list) {
    const vl = item.vehicle_location || item;
    const v = vl.vehicle || {};
    const loc = vl.current_location || vl.location || {};
    const driver = vl.driver || v.driver || {};

    const lat = parseFloat(loc.lat || loc.latitude || 0);
    const lng = parseFloat(loc.lon || loc.lng || loc.longitude || 0);

    vehicles.push({
      number: v.number || v.vehicle_number || vl.number || "",
      lat,
      lng,
      speed: loc.speed != null ? parseFloat(loc.speed) : null,
      bearing: loc.bearing != null ? parseFloat(loc.bearing) : null,
      state: loc.engine_state || loc.status || vl.engine_state || "",
      city: loc.city || "",
      locState: loc.state || loc.region || "",
      locatedAt: loc.located_at || loc.timestamp || vl.located_at || "",
      driver: {
        name: driver.full_name || driver.name || [driver.first_name, driver.last_name].filter(Boolean).join(" ") || ""
      }
    });
  }

  return new Response(JSON.stringify({ vehicles, fetchedAt: new Date().toISOString() }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "max-age=30" }
  });
};
