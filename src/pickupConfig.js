/* Pickup-dock configuration and the location normalizer.
   Split out of App.jsx so the scenario tests can drive the real dock layout
   instead of a hand-copied fixture that would drift out of sync with it. */

export const PICKUP_SOURCES=[
/* `default:true` — where this supplier ships from unless told otherwise.
   Emser runs almost everything out of Norcross, so an unspecified Emser load
   resolves there instead of demanding a dock choice on every card. Docks
   without the flag still prompt. */
{customer:"Emser Tile",label:"Emser - Norcross",addr:"5470 Oakbrook Pkwy, Norcross, GA 30093",default:true},
{customer:"Emser Tile",label:"Emser - Roswell",addr:"250 Hembree Park Drive, Roswell, GA 30076"},
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

