/* Pickup-dock configuration and the location normalizer.
   Split out of App.jsx so the scenario tests can drive the real dock layout
   instead of a hand-copied fixture that would drift out of sync with it. */

export const PICKUP_SOURCES=[
/* `default:true` — where this supplier ships from unless told otherwise. A
   supplier with only one dock resolves there whatever the flag says; the flag
   matters when there are several and an unspecified load must still land
   somewhere instead of demanding a dock choice on every card. Multi-dock
   suppliers without the flag (Traditions, IMETCO) still prompt. */
{customer:"Emser Tile",label:"Emser - Norcross",addr:"5470 Oakbrook Pkwy, Norcross, GA 30093",default:true},
/* Emser's Roswell branch closed — see RETIRED_PICKUPS at the bottom of this
   file. `default:true` stays on Norcross: it is inert while Emser has one dock,
   and it is the answer already written down if a second one ever opens. */
{customer:"Florida Tile",label:"Florida Tile - Norcross",addr:"1455 Oakbrook Drive, Suite 100, Norcross, GA 30093"},
{customer:"Specialty",label:"Specialty - Norcross",addr:"1275 Oakbrook Drive, Suite D, Norcross, GA 30093"},
{customer:"IMETCO",label:"IMETCO - Norcross",addr:"4648 South Old Peachtree Road, Norcross, GA 30071"},
{customer:"IMETCO",label:"Finishing Dynamics - Villa Rica",addr:"28 Andrews Way, Villa Rica, GA 30180"},
{customer:"IMETCO",label:"Perfect Edge - Doraville",addr:"4264 Winters Chapel Road, Building F, Doraville, GA 30360"},
{customer:"IMETCO",label:"Southern Aluminum - Lithia Springs",addr:"1401 Blairs Bridge Road, Lithia Springs, GA 30122"},
{customer:"MM Systems",label:"MM Systems - Pendergrass",addr:"50 MM Way, Pendergrass, GA 30567"},
{customer:"Perfect Edge",label:"Perfect Edge - Doraville",addr:"4264 Winters Chapel Road, Building F, Doraville, GA 30360"},
{customer:"Crossville Studios",label:"Crossville - Norcross",addr:"1256 Oakbrook Drive, Suite F, Norcross, GA 30093"},
{customer:"Traditions in Tile",label:"Traditions - Alpharetta",addr:"3065 Trotters Parkway, Alpharetta, GA 30004"},
{customer:"Traditions in Tile",label:"Traditions - Atlanta",addr:"1015 Chattahoochee Avenue NW, Atlanta, GA 30318"},
{customer:"Traditions in Tile",label:"Traditions - Bogart",addr:"150 Trade Street, Bogart, GA 30622"},
{customer:"Prolex Flooring",label:"Prolex - Norcross",addr:"3044 Northwoods Circle, Norcross, GA 30071"},
{customer:"Ceramic Tile Services",label:"Ceramic Tile - Gainesville",addr:"470 Woodsmill Road, Suite B, Gainesville, GA 30501"},
{customer:"Woodbury Stamping",label:"Woodbury - Woodbury",addr:"29 Durand Street, Woodbury, GA 30293"},
];

/* Customers that ship from more than one physical pickup location. For these,
   a manifest card MUST name the specific location (Alpharetta vs Atlanta,
   Norcross vs Roswell) — "pickup from Traditions in Tile" alone tells the
   driver nothing. Built from PICKUP_SOURCES so it stays in sync. */
export const MULTI_PICKUP=(()=>{
  const byCust={};
  PICKUP_SOURCES.forEach(s=>{(byCust[s.customer]=byCust[s.customer]||[]).push(s);});
  const out={};
  Object.entries(byCust).forEach(([c,arr])=>{if(arr.length>1)out[c]=arr;});
  return out;
})();

/* Normalize a pickup-location value to a canonical token so the many stored
   formats compare equal. Firestore data carries the same physical location
   written several ways: "Norcross", "Emser - Norcross", "Emser Tile —
   Norcross". They must all reduce to "norcross". Rule: take the part after
   the last " - " or " — " separator (if any), lowercase, trim. A bare
   "Norcross" stays "norcross"; "Emser - Norcross" -> "norcross". Returns ""
   for null/empty. */
export const normLoc=(v)=>{
  if(!v||typeof v!=="string")return"";
  const parts=v.split(/\s+[-–—]\s+/);/* hyphen, en-dash, em-dash — the same dock ships in all three */
  return parts[parts.length-1].trim().toLowerCase();
};


/* ── Docks a supplier has CLOSED ─────────────────────────────────────────────
   A retired dock is recorded here rather than just deleted from PICKUP_SOURCES,
   because deleting it does not delete the orders that name it. Firestore holds
   deliveries whose `pickupFrom` still reads "Emser - Roswell", auto pickup
   cards generated at that dock, and phones holding yesterday's copy of both.

   With the dock merely gone from the list, every one of those rows becomes the
   disagreement this codebase keeps getting bitten by: `deliveryDock` no longer
   recognises the name, so the engine files the delivery under the supplier's
   remaining dock and builds a card there — while the delivery's own label keeps
   printing the closed dock, and the stale card keys on a different location so
   nothing collapses it. The driver reads two pickups for one load, one of them
   at a shut building with a real address on it.

   So a retirement names its replacement, and sanitizeEntry rewrites stored rows
   to it on the way in. `movedTo` must be a label that is still in
   PICKUP_SOURCES. */
export const RETIRED_PICKUPS=[
  {customer:"Emser Tile",label:"Emser - Roswell",movedTo:"Emser - Norcross"},
];

/* The dock a retired location now resolves to, or null if nothing is retired
   for this value. Matches on the NORMALIZED location, so every stored spelling
   ("Roswell", "Emser - Roswell", "Emser Tile — Roswell") heals alike.

   It matches when the entry belongs to that supplier, OR when the stored value
   names the supplier itself — a Quote Delivery collected at "Emser - Roswell"
   carries the closed dock under a customer that owns no docks at all. A bare
   "Roswell" on some other customer is left alone: plenty of places are in
   Roswell, and only this supplier's dock is the one that shut. */
export const retiredPickup=(customer,value)=>{
  const loc=normLoc(value);
  if(!loc)return null;
  const raw=String(value==null?"":value).trim().toLowerCase();
  const hit=RETIRED_PICKUPS.find(r=>{
    if(normLoc(r.label)!==loc)return false;
    if(r.customer===customer)return true;
    const supplier=String(r.label).split(/\s+[-–—]\s+/)[0].trim().toLowerCase();
    return !!supplier&&raw.includes(supplier);
  });
  if(!hit)return null;
  return PICKUP_SOURCES.find(s=>s.label===hit.movedTo)||null;
};
