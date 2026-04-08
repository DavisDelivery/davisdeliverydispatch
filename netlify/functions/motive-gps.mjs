export default async (req, context) => {
  const apiKey = Netlify.env.get("MOTIVE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "no key" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";

  let r = await fetch("https://api.keeptruckin.com/v1/vehicle_locations", {
    headers: { "X-Api-Key": apiKey, "Accept": "application/json" }
  });
  if (!r.ok) {
    r = await fetch("https://api.gomotive.com/v1/vehicle_locations", {
      headers: { "Authorization": "Bearer " + apiKey, "Accept": "application/json" }
    });
  }
  if (!r.ok) {
    return new Response(JSON.stringify({ error: "api_fail", status: r.status }), { status: 502, headers: { "Content-Type": "application/json" } });
  }

  const data = await r.json();
  const list = data.vehicle_locations || data.vehicles || [];

  if (debug) {
    return new Response(JSON.stringify({ count: list.length, keys: Object.keys(data), itemKeys: list[0] ? Object.keys(list[0]) : [], inner: list[0] ? Object.keys(list[0].vehicle_location || list[0]) : [], raw: list.slice(0, 2) }, null, 2), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  const vehicles = [];
  for (const item of list) {
    const vl = item.vehicle_location || item;
    const v = vl.vehicle || {};
    const cl = vl.current_location || {};
    const drv = vl.driver || v.driver || {};

    vehicles.push({
      number: v.number || vl.number || "",
      lat: parseFloat(cl.lat || vl.lat || vl.latitude || 0),
      lng: parseFloat(cl.lon || cl.lng || vl.lon || vl.lng || vl.longitude || 0),
      speed: parseFloat(cl.speed || vl.speed || 0) || null,
      bearing: parseFloat(cl.bearing || vl.bearing || 0) || null,
      state: cl.engine_state || vl.engine_state || "",
      city: cl.city || vl.city || "",
      locState: cl.state || vl.state || "",
      locatedAt: cl.located_at || vl.located_at || "",
      driver: { name: drv.full_name || drv.name || [drv.first_name, drv.last_name].filter(Boolean).join(" ") || "" }
    });
  }

  return new Response(JSON.stringify({ vehicles, fetchedAt: new Date().toISOString() }), { status: 200, headers: { "Content-Type": "application/json", "Cache-Control": "max-age=30" } });
};
