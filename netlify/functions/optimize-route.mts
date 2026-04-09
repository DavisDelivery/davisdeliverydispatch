import type { Context, Config } from "@netlify/functions";

interface Stop {
  id: string | number;
  lat: number;
  lng: number;
  name: string;
  dueBy?: string;
  isPickup?: boolean;
}

interface RouteRequest {
  origin: { lat: number; lng: number };
  stops: Stop[];
  returnToOrigin?: boolean;
}

// Parse "By 2:00 PM" / "9:30–1:00 PM" style time constraints to minutes since midnight
function parseTimeConstraint(dueBy: string): number | null {
  if (!dueBy) return null;
  const m = dueBy.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1]);
  const min = parseInt(m[2] || "0");
  const ap = (m[3] || "").toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST required" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = Netlify.env.get("GOOGLE_MAPS_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GOOGLE_MAPS_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: RouteRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { origin, stops, returnToOrigin } = body;
  if (!origin || !stops || stops.length < 2) {
    return new Response(
      JSON.stringify({ error: "Need origin and at least 2 stops" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Separate pickups (must come first) from deliveries
  const pickups = stops.filter((s) => s.isPickup);
  const deliveries = stops.filter((s) => !s.isPickup);

  if (deliveries.length < 2) {
    return new Response(
      JSON.stringify({
        error: "Need at least 2 delivery stops to optimize",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Separate time-constrained stops from flexible ones
  const withTime = deliveries.filter(
    (s) => s.dueBy && parseTimeConstraint(s.dueBy) !== null
  );
  const noTime = deliveries.filter(
    (s) => !s.dueBy || parseTimeConstraint(s.dueBy) === null
  );

  // Sort time-constrained stops by deadline
  withTime.sort((a, b) => {
    const ta = parseTimeConstraint(a.dueBy!) || 9999;
    const tb = parseTimeConstraint(b.dueBy!) || 9999;
    return ta - tb;
  });

  // Build waypoints for Routes API: time-constrained first, then optimize the rest
  // The Routes API v2 computeRoutes endpoint
  const allDels = [...withTime, ...noTime];

  // Build the request for Google Routes API v2
  const intermediates = allDels.map((s) => ({
    location: {
      latLng: { latitude: s.lat, longitude: s.lng },
    },
  }));

  // Use the last delivery as destination, rest as intermediates
  const lastPickup =
    pickups.length > 0 ? pickups[pickups.length - 1] : null;
  const routeOrigin = lastPickup
    ? { latitude: lastPickup.lat, longitude: lastPickup.lng }
    : { latitude: origin.lat, longitude: origin.lng };

  const routesPayload: any = {
    origin: {
      location: { latLng: routeOrigin },
    },
    destination: {
      location: {
        latLng: {
          latitude: allDels[allDels.length - 1].lat,
          longitude: allDels[allDels.length - 1].lng,
        },
      },
    },
    intermediates: intermediates.slice(0, -1), // Exclude last (it's the destination)
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
    optimizeWaypointOrder: noTime.length > 0, // Only optimize if there are flexible stops
    computeAlternativeRoutes: false,
    languageCode: "en-US",
    units: "IMPERIAL",
  };

  try {
    const routesResp = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "routes.optimizedIntermediateWaypointIndex,routes.legs.duration,routes.legs.distanceMeters,routes.legs.startLocation,routes.legs.endLocation,routes.distanceMeters,routes.duration",
        },
        body: JSON.stringify(routesPayload),
      }
    );

    if (!routesResp.ok) {
      const errText = await routesResp.text();
      // Fall back to Directions API if Routes API fails
      return fallbackDirections(
        apiKey,
        origin,
        pickups,
        allDels,
        returnToOrigin
      );
    }

    const routesData = await routesResp.json();
    const route = routesData.routes?.[0];

    if (!route) {
      return fallbackDirections(
        apiKey,
        origin,
        pickups,
        allDels,
        returnToOrigin
      );
    }

    // Build optimized order
    const waypointOrder = route.optimizedIntermediateWaypointIndex;
    let orderedDels: Stop[];
    if (waypointOrder && waypointOrder.length > 0) {
      // Routes API returned an optimized order
      const intermDels = allDels.slice(0, -1); // All except last (destination)
      orderedDels = [
        ...waypointOrder.map((i: number) => intermDels[i]),
        allDels[allDels.length - 1],
      ];
    } else {
      orderedDels = allDels;
    }

    // Calculate per-leg ETAs
    const legs = route.legs || [];
    let cumulativeMinutes = 0;
    const now = new Date();
    const startHour = 7; // Assume 7 AM departure
    const startMinutes = startHour * 60;

    const stopsWithEta = [];

    // Add pickups first (no reordering)
    for (const pu of pickups) {
      stopsWithEta.push({
        id: pu.id,
        name: pu.name,
        eta: null,
        etaTime: null,
        legDistance: null,
        legDuration: null,
        isPickup: true,
      });
    }

    // Add optimized deliveries with ETAs
    for (let i = 0; i < orderedDels.length; i++) {
      const leg = legs[i];
      const durationSec = leg
        ? parseInt(leg.duration?.replace("s", "") || "0")
        : 0;
      const distanceM = leg?.distanceMeters || 0;
      const legMinutes = Math.round(durationSec / 60);
      const legMiles = Math.round((distanceM / 1609.34) * 10) / 10;

      cumulativeMinutes += legMinutes;
      // Add 5 min per stop for unloading
      const arrivalMinutes = startMinutes + cumulativeMinutes + i * 5;
      const arrHour = Math.floor(arrivalMinutes / 60);
      const arrMin = arrivalMinutes % 60;
      const ampm = arrHour >= 12 ? "PM" : "AM";
      const displayHour = arrHour > 12 ? arrHour - 12 : arrHour === 0 ? 12 : arrHour;
      const etaTime = `${displayHour}:${arrMin.toString().padStart(2, "0")} ${ampm}`;

      stopsWithEta.push({
        id: orderedDels[i].id,
        name: orderedDels[i].name,
        eta: cumulativeMinutes,
        etaTime,
        legDistance: legMiles,
        legDuration: legMinutes,
        isPickup: false,
      });

      // Add unloading time
      cumulativeMinutes += 5;
    }

    const totalDistM = route.distanceMeters || legs.reduce((s: number, l: any) => s + (l.distanceMeters || 0), 0);
    const totalDurS = parseInt((route.duration || "0s").replace("s", ""));
    const totalMiles = Math.round((totalDistM / 1609.34) * 10) / 10;
    const totalMinutes = Math.round(totalDurS / 60);

    return new Response(
      JSON.stringify({
        success: true,
        source: "routes-api-v2",
        optimizedOrder: stopsWithEta.map((s) => s.id),
        stops: stopsWithEta,
        totalMiles,
        totalMinutes,
        estimatedEnd: stopsWithEta[stopsWithEta.length - 1]?.etaTime || null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e: any) {
    // If Routes API completely fails, try Directions API fallback
    return fallbackDirections(
      apiKey,
      origin,
      pickups,
      allDels,
      returnToOrigin
    );
  }
};

// Fallback: use legacy Directions API
async function fallbackDirections(
  apiKey: string,
  origin: { lat: number; lng: number },
  pickups: Stop[],
  deliveries: Stop[],
  returnToOrigin?: boolean
) {
  try {
    const waypoints = deliveries
      .slice(0, -1)
      .map((s) => `${s.lat},${s.lng}`)
      .join("|");
    const dest = deliveries[deliveries.length - 1];
    const orgStr = pickups.length > 0
      ? `${pickups[pickups.length - 1].lat},${pickups[pickups.length - 1].lng}`
      : `${origin.lat},${origin.lng}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${orgStr}&destination=${dest.lat},${dest.lng}&waypoints=optimize:true|${waypoints}&key=${apiKey}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status !== "OK" || !data.routes?.[0]) {
      return new Response(
        JSON.stringify({
          error: "Both Routes API and Directions API failed",
          details: data.status,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const route = data.routes[0];
    const order = route.waypoint_order || [];
    const intermDels = deliveries.slice(0, -1);
    const orderedDels = [
      ...order.map((i: number) => intermDels[i]),
      deliveries[deliveries.length - 1],
    ];

    const legs = route.legs || [];
    let cumulativeMinutes = 0;
    const startMinutes = 7 * 60;

    const stopsWithEta = [];

    for (const pu of pickups) {
      stopsWithEta.push({
        id: pu.id,
        name: pu.name,
        eta: null,
        etaTime: null,
        legDistance: null,
        legDuration: null,
        isPickup: true,
      });
    }

    for (let i = 0; i < orderedDels.length; i++) {
      const leg = legs[i];
      const legMinutes = leg ? Math.round((leg.duration?.value || 0) / 60) : 0;
      const legMiles = leg
        ? Math.round(((leg.distance?.value || 0) / 1609.34) * 10) / 10
        : 0;

      cumulativeMinutes += legMinutes;
      const arrivalMinutes = startMinutes + cumulativeMinutes + i * 5;
      const arrHour = Math.floor(arrivalMinutes / 60);
      const arrMin = arrivalMinutes % 60;
      const ampm = arrHour >= 12 ? "PM" : "AM";
      const displayHour = arrHour > 12 ? arrHour - 12 : arrHour === 0 ? 12 : arrHour;
      const etaTime = `${displayHour}:${arrMin.toString().padStart(2, "0")} ${ampm}`;

      stopsWithEta.push({
        id: orderedDels[i].id,
        name: orderedDels[i].name,
        eta: cumulativeMinutes,
        etaTime,
        legDistance: legMiles,
        legDuration: legMinutes,
        isPickup: false,
      });

      cumulativeMinutes += 5;
    }

    const totalMiles = Math.round(
      legs.reduce((s: number, l: any) => s + (l.distance?.value || 0), 0) / 1609.34 * 10
    ) / 10;
    const totalMinutes = Math.round(
      legs.reduce((s: number, l: any) => s + (l.duration?.value || 0), 0) / 60
    );

    return new Response(
      JSON.stringify({
        success: true,
        source: "directions-api-fallback",
        optimizedOrder: stopsWithEta.map((s) => s.id),
        stops: stopsWithEta,
        totalMiles,
        totalMinutes,
        estimatedEnd: stopsWithEta[stopsWithEta.length - 1]?.etaTime || null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: "Route optimization failed: " + e.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const config: Config = {
  path: "/api/optimize-route",
};
