// Motive GPS Proxy — fetches vehicle locations
// MOTIVE_API_KEY env var must be set on Netlify (site: a95319bb-cd0c-4e47-9b89-34dd8a9c3f8e)
export default async (req) => {
  const apiKey = process.env.MOTIVE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "MOTIVE_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    const r = await fetch("https://api.gomotive.com/v1/vehicle_locations", {
      headers: { "Authorization": `Bearer ${apiKey}`, "Accept": "application/json" }
    });

    if (!r.ok) {
      // Try legacy endpoint
      const r2 = await fetch("https://api.keeptruckin.com/v1/vehicle_locations", {
        headers: { "X-Api-Key": apiKey, "Accept": "application/json" }
      });
      if (!r2.ok) {
        return new Response(JSON.stringify({ error: "Motive API error", status: r2.status }), {
          status: 502,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
      const data2 = await r2.json();
      return formatResponse(data2);
    }

    const data = await r.json();
    return formatResponse(data);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
};

function formatResponse(data) {
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
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "max-age=30" }
  });
}
