import { useState, useCallback, useEffect, useRef } from "react";
import {
  saveManifestDay, subscribeManifests, getDayKey, getWeekKey,
  saveDrivers, subscribeDrivers,
  sendNotificationToDriver, subscribeNotifications, markNotificationRead,
  saveEmserHours, subscribeEmserHours,
  requestPushPermission, onPushMessage, saveDriverToken
} from "./firebase.js";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

/* ── SIMPLE HASH ROUTER ── */
function useHashRoute(){
const[hash,setHash]=useState(window.location.hash);
useEffect(()=>{const h=()=>setHash(window.location.hash);window.addEventListener("hashchange",h);return()=>window.removeEventListener("hashchange",h);},[]);
return hash;
}

/* Driver slug map — used for URL routing */
const DRIVER_SLUGS={"trevor":1,"brent":2,"trevarr":3};
function getDriverSlug(name){return name.toLowerCase().split(" ")[0];}


/* ── CORRECTED ADDRESSES (from spreadsheet warehouse addresses) ── */
const ADDR={
  // EMSER PICKUPS
  "Emser Norcross":"5470-G Oakbrook Parkway, Norcross, GA 30093",
  "Emser Roswell":"250 Hembree Park Drive, Roswell, GA 30076",
  // EMSER DELIVERIES
  "Advance Flooring - Mableton":"6731 Discovery Blvd #200, Mableton, GA 30126",
  "Atlanta Flooring - Suwanee":"3665 Swiftwater Park Drive, Bldg 2, Suwanee, GA 30024",
  "Atlanta West - Lithia Springs":"1850 Westford Drive, Lithia Springs, GA 30122",
  "BEC - Alpharetta":"1000 Union Center Drive, Suite C, Alpharetta, GA 30004",
  "Britts - Lawrenceville":"375 Buford Drive, Lawrenceville, GA 30046",
  "D3 - Woodstock":"103 Smokehill Lane #100, Woodstock, GA 30188",
  "Dalton Carpet Outlet - Smyrna":"3500 Highlands Parkway SE, Smyrna, GA 30082",
  "DCO Athens":"3690 Atlanta Highway #108, Athens, GA 30606",
  "DCO Eatonton":"942 Greensboro Road, Eatonton, GA 31024",
  "DCO Lakes Pkwy":"1440 Lakes Parkway, Suite 100, Lawrenceville, GA 30043",
  "DCO Smyrna":"3500 Highlands Parkway SE, Smyrna, GA 30082",
  "DCO Tech Dr":"2408 Tech Center Parkway #100, Lawrenceville, GA 30043",
  "DCO Tech Dr - Lawrenceville":"2408 Tech Center Parkway #100, Lawrenceville, GA 30043",
  "DCO Lakes Pkwy - Lawrenceville":"1440 Lakes Parkway, Suite 100, Lawrenceville, GA 30043",
  "Elite Flooring - Norcross":"3480 Green Pointe Parkway, Norcross, GA 30092",
  "Flooring Design Group - Doraville":"3230 Oakcliff Industrial Street, Doraville, GA 30340",
  "Floorworx - Norcross":"2975 Courtyard Drive, Norcross, GA 30071",
  "Gel & Associates - Atlanta":"50 East Great Southwest Parkway, Atlanta, GA 30336",
  "Hillman - Sugar Hill":"201 Peachtree Industrial Blvd, Sugar Hill, GA 30518",
  "Idlewood - Norcross":"6375 Peachtree Industrial Blvd, Norcross, GA 30071",
  "NE Corner - Flowery Branch":"5340 McEver Road, Unit G, Flowery Branch, GA 30542",
  "Precision Flooring - Norcross":"1750 Corporate Drive, Suite 740, Norcross, GA 30093",
  "Premier - Suwanee":"605 Satellite Blvd, Suite 200, Suwanee, GA 30024",
  "Premier - Norcross":"605 Satellite Blvd, Suite 200, Suwanee, GA 30024",
  "Prestigious - Alpharetta":"795 Branch Drive, Alpharetta, GA 30004",
  "ProSource - Marietta":"2260 Northwest Parkway SE, Marietta, GA 30067",
  "ProSource - Norcross":"3000 Miller Court West, Norcross, GA 30071",
  "Sherwin Williams - Norcross":"6513 Warren Drive, Norcross, GA 30071",
  "Sherwin Williams - Smyrna":"5500 South Cobb Drive SE, Bldg 100, Smyrna, GA 30080",
  "Stocco - Alpharetta":"6190 Shiloh Crossing, Suite D, Alpharetta, GA 30004",
  "Valufloor - Doraville":"4301 Pleasantdale Road, Suite A, Doraville, GA 30340",
  "Vanguard - Norcross":"1750 Corporate Drive, Suite 700, Norcross, GA 30093",
  "SE Commercial - Woodstock":"193 Stockwood Drive, Woodstock, GA 30188",
  "Construction Resources - Decatur":"196 Rio Circle, Decatur, GA 30030",
  "Madison Flooring Group":"1167 Eatonton Road, Madison, GA 30650",
  "American Flooring Services":"783 Metromont Road, Hiram, GA 30141",
  "Peachwood Floor Covering":"400 Northfield Way, Roswell, GA 30075",
  // SPECIALTY
  "Spectra":"6684 Jimmy Carter Blvd, Suite 500, Norcross, GA 30071",
  "Perimeter Floors - Marietta":"3045 Chastain Meadows Parkway, Suite 100, Marietta, GA 30066",
  "Real Floors - Marietta":"560 Webb Industrial Drive, Marietta, GA 30062",
  "ProFloors - Doraville":"5884 Peachtree Road, Atlanta, GA 30340",
  "LaVista/Waffle House":"5984 Financial Drive, Norcross, GA 30071",
  "Horizon - Alpharetta":"415 Winkler Drive #B, Alpharetta, GA 30004",
  "Vision Flooring":"1670 Oakbrook Drive, Norcross, GA 30093",
  "H&R Commercial":"1740 Cumberland Point Drive, Suite 1, Marietta, GA 30067",
  "US Pool":"1721 Oakbrook Drive, Norcross, GA 30093",
  // FLORIDA TILE
  "Florida Tile - Norcross":"1455 Oakbrook Drive, Suite 100, Norcross, GA 30093",
  "3 Little Dogs - Cumming":"2450 Freedom Parkway, Suite 207, Cumming, GA 30041",
  "Floor Works - Dallas":"309 West Avenue, Dallas, GA 30157",
  "JSJ/ProSource - Marietta":"2260 Northwest Parkway SE, Marietta, GA 30067",
  "Moda":"14147 Chattahoochee Avenue, Atlanta, GA 30318",
  "Tile House":"1328 Canton Road, Marietta, GA 30066",
  "Remodel Republic":"",
  // IMETCO
  "IMETCO Norcross":"4648 South Old Peachtree Road, Norcross, GA 30071",
  "IMETCO to Finishing Dynamics":"28 Andrews Way, Villa Rica, GA 30180",
  "Perfect Edge to IMETCO":"4648 South Old Peachtree Road, Norcross, GA 30071",
  "Southern Aluminum to IMETCO":"4648 South Old Peachtree Road, Norcross, GA 30071",
  "Finishing Dynamics to IMETCO":"4648 South Old Peachtree Road, Norcross, GA 30071",
  "Round Trip IMETCO & Finishing Dynamics":"4648 South Old Peachtree Road, Norcross, GA 30071",
  "Finishing Dynamics - Villa Rica":"28 Andrews Way, Villa Rica, GA 30180",
  "Southern Aluminum - Villa Rica":"14100 Veterans Memorial Highway, Villa Rica, GA 30180",
  "Perfect Edge - Doraville":"4264 Winters Chapel Road, Building F, Doraville, GA 30360",
  // MM SYSTEMS
  "MM Systems - Pendergrass":"50 MM Way, Pendergrass, GA 30567",
  "Alpha Insulation - Marietta":"1300 Williams Drive, Marietta, GA 30066",
  "Chambless Construction - Marietta":"1698 Sands Place A, Marietta, GA 30067",
  "EcoClean":"3094 Emery Circle, Austell, GA 30168",
  "Evans Tool & Die - Conyers":"157 North Salem Road NE, Conyers, GA 30013",
  "Holbrook Waterproofing - Decatur":"191 Rio Circle, Decatur, GA 30030",
  "Metal Plate Galvanizing - Atlanta":"505 Selig Drive, Atlanta, GA 30336",
  "Metro Waterproofing - Scottdale":"2935 Alcove Drive, Scottdale, GA 30079",
  "SE Restoration - Stone Mtn":"4598-A Stonegate Industrial Blvd, Stone Mountain, GA 30083",
  "Southern Aluminum - Lithia Springs":"1401 Blairs Bridge Road, Lithia Springs, GA 30122",
  "TCM Waterproofing - Suwanee":"3650 Burnett Park Drive #7106, Suwanee, GA 30024",
  "Thermal Products - Norcross":"4520 South Berkeley Lake Road NW, Norcross, GA 30071",
  // PERFECT EDGE
  "Cellofoam - Conyers":"Conyers, GA",
  "Certified Logistics - Tucker":"4998 South Royal Atlanta Drive, Suite C, Tucker, GA 30084",
  "IPS - Braselton":"5425 Progress Court, Braselton, GA 30517",
  "JRD Motorsport - Hoschton":"1101 GA-124, Hoschton, GA 30548",
  "Miller Powder Coating - Lilburn":"4251 Wayside Court SW, Suite B, Lilburn, GA 30047",
  "Ryerson - Norcross":"4405 South Old Peachtree Road, Norcross, GA 30071",
  "Superior Rubber - Loganville":"10 Fesco Way, Loganville, GA 30052",
  "WGI - Tucker":"2146 Flinstone Drive, Suite B, Tucker, GA 30084",
  // WOODBURY
  "Woodbury Stamping":"29 Durand Street, Woodbury, GA 30293",
  // QUOTE CUSTOMER PICKUPS
  "Crossville - Norcross":"1256 Oakbrook Drive, Suite F, Norcross, GA 30093",
  "Traditions - Alpharetta":"3065 Trotters Parkway, Alpharetta, GA 30004",
  "Traditions - Atlanta":"1015 Chattahoochee Avenue NW, Atlanta, GA 30318",
  "Prolex - Norcross":"3044 Northwoods Circle, Norcross, GA 30071",
  "Ceramic Tile - Gainesville":"470 Woodsmill Road, Suite B, Gainesville, GA 30501",
  "Gordy Tile - Covington":"3175 Highway 212, Covington, GA 30016",
  "Jill of All Trades":"11 Perimeter Center East, Atlanta, GA 30346",
  "IPS Braselton":"5425 Progress Court, Braselton, GA 30517",
  "Southern Flooring":"Lawrenceville, GA",
  "Specialty - Norcross":"1275 Oakbrook Drive, Suite D, Norcross, GA 30093",
};
const getAddr=(s)=>ADDR[s]||"";

/* ── DEFAULT INSTRUCTIONS (from spreadsheet, editable per-stop) ── */
const DEFAULT_INSTRUCTIONS={
  // EMSER
  "Atlanta West - Lithia Springs":"Product pick up at either or both Emser locations",
  "Atlanta Flooring - Suwanee":"After 9 unless requested — not after 1",
  "Elite Flooring - Norcross":"Deliveries always made here",
  "Britts - Lawrenceville":"Not before 9",
  "Stocco - Alpharetta":"Product pick up at either or both Emser locations",
  "DCO Tech Dr":"Do not deliver before 10ish",
  "DCO Tech Dr - Lawrenceville":"Do not deliver before 10ish",
  "DCO Eatonton":"ALWAYS 942 Greensboro Rd (NEVER 105 Harmony). Parking lot delivery — Forklift, no dock",
  "Madison Flooring Group":"Parking lot delivery — Forklift, no dock",
  "Advance Flooring - Mableton":"Product pick up at either or both Emser locations",
  "ProSource - Norcross":"Parking lot delivery — Forklift, no dock",
  "Prestigious - Alpharetta":"Product pick up at either or both Emser locations",
  "Peachwood Floor Covering":"Product pick up at either or both Emser locations",
  "D3 - Woodstock":"Product pick up at either or both Emser locations",
  // SPECIALTY
  "LaVista/Waffle House":"Must have appointment time — normally 10 AM",
  // FLORIDA TILE
  "BEC - Alpharetta":"Friday",
  "Floor Works - Dallas":"Tuesday & Friday",
  "Precision Flooring - Norcross":"Florida Tile has wrong address on file — no longer on Brook Hollow Pkwy",
  // IMETCO
  "IMETCO to Finishing Dynamics":"Requires Ship Plan #",
  "Perfect Edge to IMETCO":"Requires Ship Plan #",
  "Southern Aluminum to IMETCO":"Requires Ship Plan #",
  "Finishing Dynamics to IMETCO":"⚠ Get an updated Ship Plan # from driver before departing. Photo BOL required.",
  "Round Trip IMETCO & Finishing Dynamics":"Requires Ship Plan # — Get updated Ship Plan # from driver at Finishing Dynamics for return trip. Photo BOL required.",
  // MM SYSTEMS
  "MM Systems - Pendergrass":"Closed 11:45–12:30 for lunch",
  "Thermal Products - Norcross":"Closed 1–2 for lunch",
  "TCM Waterproofing - Suwanee":"No dock — Forklift on site",
  "Evans Tool & Die - Conyers":"Mike will call when orders ready — usually 1-2 barrels on a pallet",
  "SE Restoration - Stone Mtn":"No dock — Forklift on site",
  "Metal Plate Galvanizing - Atlanta":"No dock — Forklift on site",
  "EcoClean":"",
  "Chambless Construction - Marietta":"",
  // WOODBURY
  "Woodbury Stamping":"Deliver product to Innovative Metals Company (IMETCO)",
};
const getDefaultInstr=(s)=>DEFAULT_INSTRUCTIONS[s]||"";

/* ── CUSTOMERS ── */
const CUSTOMERS={
"Emser Tile":{rate_type:"hourly",rate:102.50,min_hours:4,pickup:"Norcross &/or Roswell",note:"$102.50/hr, 4hr min",
deliveries:["Advance Flooring - Mableton","American Flooring Services","Atlanta Flooring - Suwanee","Atlanta West - Lithia Springs","BEC - Alpharetta","Britts - Lawrenceville","Construction Resources - Decatur","D3 - Woodstock","Dalton Carpet Outlet - Smyrna","DCO Athens","DCO Eatonton","DCO Lakes Pkwy","DCO Smyrna","DCO Tech Dr - Lawrenceville","Drop Ship Liftgate","Elite Flooring - Norcross","Flooring Design Group - Doraville","Floorworx - Norcross","Gel & Associates - Atlanta","Hillman - Sugar Hill","Idlewood - Norcross","JSJ/ProSource - Marietta","Madison Flooring Group","NE Corner - Flowery Branch","Peachwood Floor Covering","Precision Flooring - Norcross","Premier - Suwanee","Prestigious - Alpharetta","ProSource - Marietta","ProSource - Norcross","SE Commercial - Woodstock","Sherwin Williams - Norcross","Sherwin Williams - Smyrna","Stocco - Alpharetta","Transfer","Valufloor - Doraville","Vanguard - Norcross"]},
"Florida Tile":{rate_type:"flat",pickup:"Norcross",fuel_surcharge:0.15,note:"Flat rate + 15% fuel (separate)",
deliveries:[{s:"3 Little Dogs - Cumming",r:200},{s:"Atlanta West - Lithia Springs",r:200},{s:"BEC - Alpharetta",r:175},{s:"Britts - Lawrenceville",r:125},{s:"Construction Resources - Decatur",r:175},{s:"DCO Lakes Pkwy - Lawrenceville",r:125},{s:"DCO Tech Dr - Lawrenceville",r:125},{s:"Floor Works - Dallas",r:250},{s:"Hillman - Sugar Hill",r:150},{s:"JSJ/ProSource - Marietta",r:150},{s:"Moda",r:150},{s:"NE Corner - Flowery Branch",r:150},{s:"Precision Flooring - Norcross",r:125},{s:"Premier - Suwanee",r:125},{s:"ProSource - Norcross",r:125},{s:"Remodel Republic",r:150},{s:"SE Commercial - Woodstock",r:175},{s:"Tile House",r:175},{s:"Vanguard - Norcross",r:125}]},
"Specialty":{rate_type:"flat",pickup:"Norcross",fuel_included:true,note:"Flat rate (15% fuel included)",priority:true,priorityNote:"Be on dock first thing",
deliveries:[{s:"D3 - Woodstock",r:201.25},{s:"DCO Lakes Pkwy",r:143.75},{s:"DCO Tech Dr",r:143.75},{s:"H&R Commercial",r:201.25},{s:"Hillman - Sugar Hill",r:172.50},{s:"Horizon - Alpharetta",r:201.25},{s:"LaVista/Waffle House",r:143.75},{s:"Perimeter Floors - Marietta",r:201.25},{s:"Premier - Suwanee",r:143.75},{s:"ProFloors - Doraville",r:143.75},{s:"Real Floors - Marietta",r:201.25},{s:"SE Commercial - Woodstock",r:201.25},{s:"Spectra",r:143.75},{s:"US Pool",r:143.75},{s:"Vanguard - Norcross",r:143.75},{s:"Vision Flooring",r:143.75}]},
"IMETCO":{rate_type:"flat",pickup:"Norcross",note:"All Deliveries Require a **Ship Plan #**",noteHighlight:"Ship Plan #",
deliveries:[{s:"IMETCO to Finishing Dynamics",r:250},{s:"Perfect Edge to IMETCO",r:125},{s:"Southern Aluminum to IMETCO",r:250},{s:"Finishing Dynamics to IMETCO",r:300}],roundTrip:{label:"Round Trip IMETCO & Finishing Dynamics",rate:450}},
"MM Systems":{rate_type:"flat",pickup:"Pendergrass",fuel_surcharge:0.30,note:"Flat rate + 30% fuel (separate)",
deliveries:[{s:"Alpha Insulation - Marietta",r:225},{s:"Chambless Construction - Marietta",r:225},{s:"EcoClean",r:225},{s:"Evans Tool & Die - Conyers",r:150},{s:"Holbrook Waterproofing - Decatur",r:200},{s:"Metal Plate Galvanizing - Atlanta",r:225},{s:"Metro Waterproofing - Scottdale",r:200},{s:"SE Restoration - Stone Mtn",r:200},{s:"Southern Aluminum - Lithia Springs",r:225},{s:"TCM Waterproofing - Suwanee",r:150},{s:"Thermal Products - Norcross",r:135}]},
"Perfect Edge":{rate_type:"flat",pickup:"Doraville",note:"Flat rate",
deliveries:[{s:"Cellofoam - Conyers",r:150},{s:"Certified Logistics - Tucker",r:125},{s:"IPS - Braselton",r:150},{s:"JRD Motorsport - Hoschton",r:150,n:"$75 if rides w/ IPS"},{s:"Miller Powder Coating - Lilburn",r:125},{s:"Ryerson - Norcross",r:125},{s:"Superior Rubber - Loganville",r:150},{s:"WGI - Tucker",r:150}]},
"Woodbury Stamping":{rate_type:"flat",pickup:"Woodbury",note:"Flat rate per load",deliveries:[{s:"Woodbury to IMETCO",r:500}]},
};

const QUOTE_CUSTOMERS=[
{name:"Ceramic Tile Gainesville",pickups:[{label:"Gainesville",addr:"470 Woodsmill Road, Suite B, Gainesville, GA 30501"}]},
{name:"Crossville Studios",pickups:[{label:"Norcross",addr:"1256 Oakbrook Drive, Suite F, Norcross, GA 30093"}]},
{name:"Gordy Tile",pickups:[{label:"Covington",addr:"3175 Highway 212, Covington, GA 30016"}]},
{name:"IPS Braselton",pickups:[{label:"Braselton",addr:"5425 Progress Court, Braselton, GA 30517"}]},
{name:"Jill of All Trades",pickups:[{label:"Atlanta",addr:"11 Perimeter Center East, Atlanta, GA 30346"}]},
{name:"Prolex Flooring",pickups:[{label:"Norcross",addr:"3044 Northwoods Circle, Norcross, GA 30071"}]},
{name:"Southern Flooring",pickups:[{label:"Lawrenceville",addr:"Lawrenceville, GA"}]},
{name:"Traditions in Tile",pickups:[{label:"Alpharetta",addr:"3065 Trotters Parkway, Alpharetta, GA 30004"},{label:"Atlanta",addr:"1015 Chattahoochee Avenue NW, Atlanta, GA 30318"}]},
];

const PICKUP_SOURCES=[
{customer:"Emser Tile",label:"Emser - Norcross",addr:"5470-G Oakbrook Parkway, Norcross, GA 30093"},
{customer:"Emser Tile",label:"Emser - Roswell",addr:"250 Hembree Park Drive, Roswell, GA 30076"},
{customer:"Florida Tile",label:"Florida Tile - Norcross",addr:"1455 Oakbrook Drive, Suite 100, Norcross, GA 30093"},
{customer:"Specialty",label:"Specialty - Norcross",addr:"1275 Oakbrook Drive, Suite D, Norcross, GA 30093"},
{customer:"IMETCO",label:"IMETCO - Norcross",addr:"4648 South Old Peachtree Road, Norcross, GA 30071"},
{customer:"MM Systems",label:"MM Systems - Pendergrass",addr:"50 MM Way, Pendergrass, GA 30567"},
{customer:"Perfect Edge",label:"Perfect Edge - Doraville",addr:"4264 Winters Chapel Road, Building F, Doraville, GA 30360"},
{customer:"Crossville Studios",label:"Crossville - Norcross",addr:"1256 Oakbrook Drive, Suite F, Norcross, GA 30093"},
{customer:"Traditions in Tile",label:"Traditions - Alpharetta",addr:"3065 Trotters Parkway, Alpharetta, GA 30004"},
{customer:"Traditions in Tile",label:"Traditions - Atlanta",addr:"1015 Chattahoochee Avenue NW, Atlanta, GA 30318"},
{customer:"Prolex Flooring",label:"Prolex - Norcross",addr:"3044 Northwoods Circle, Norcross, GA 30071"},
{customer:"Ceramic Tile Services",label:"Ceramic Tile - Gainesville",addr:"470 Woodsmill Road, Suite B, Gainesville, GA 30501"},
{customer:"Woodbury Stamping",label:"Woodbury - Woodbury",addr:"29 Durand Street, Woodbury, GA 30293"},
];

const SHARED_STOPS=["Atlanta West - Lithia Springs","BEC - Alpharetta","Britts - Lawrenceville","D3 - Woodstock","DCO Lakes Pkwy","DCO Tech Dr","Hillman - Sugar Hill","NE Corner - Flowery Branch","Precision Flooring - Norcross","Premier - Suwanee","ProSource - Norcross","SE Commercial - Woodstock","Vanguard - Norcross"];

function getBaseTier(mi){if(mi<=10)return 100;if(mi<=20)return 150;if(mi<=30)return 200;if(mi<=40)return 250;return 250+Math.ceil((mi-40)/10)*50;}

const CC={"Emser Tile":{bg:"#1e40af",accent:"#2563eb"},"Florida Tile":{bg:"#166534",accent:"#16a34a"},"Specialty":{bg:"#6b21a8",accent:"#9333ea"},"IMETCO":{bg:"#9a3412",accent:"#ea580c"},"MM Systems":{bg:"#075985",accent:"#0284c7"},"Perfect Edge":{bg:"#9f1239",accent:"#e11d48"},"Woodbury Stamping":{bg:"#3f3f46",accent:"#71717a"},"Quote Delivery":{bg:"#78350f",accent:"#d97706"},"One-Off Delivery":{bg:"#374151",accent:"#6b7280"}};
const DCOL=["#2563eb","#16a34a","#ea580c","#9333ea"];
const NB={background:"#292524",border:"1px solid #44403c",color:"#d6d3d1",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:14};
const BB={background:"none",border:"none",color:"#2563eb",fontSize:13,cursor:"pointer",padding:"16px 4px 8px",fontWeight:600};

function getWeekDates(off=0){const now=new Date();const d=now.getDay();const mon=new Date(now);mon.setDate(now.getDate()-(d===0?6:d-1)+off*7);return DAYS.map((name,i)=>{const dt=new Date(mon);dt.setDate(mon.getDate()+i);return{name,date:dt.toLocaleDateString("en-US",{month:"short",day:"numeric"})}});}
function fmt(n){return "$"+n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");}

/* ── DELIVERY CONFIRMATION (typed name) ── */
function SignaturePad({onSave,onCancel}){
const[name,setName]=useState("");
return(
<div style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:12,padding:12}}>
<p style={{fontSize:12,color:"#78716c",margin:"0 0 8px"}}>Type name of person receiving delivery</p>
<input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" autoFocus
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"10px 12px",fontSize:15,fontWeight:600,outline:"none"}}/>
<div style={{display:"flex",gap:6,marginTop:8,justifyContent:"flex-end"}}>
<button onClick={onCancel} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"6px 12px",cursor:"pointer",fontSize:12}}>Cancel</button>
<button onClick={()=>{if(name.trim())onSave(name.trim());}} disabled={!name.trim()}
style={{background:name.trim()?"#1c1917":"#e7e5e4",color:name.trim()?"#fff":"#a8a29e",border:"none",borderRadius:6,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>Confirm</button>
</div>
</div>
);
}

/* ── DRIVER VIEW ── */
function DriverView({driver,entries,dayLabel,onStatusUpdate,onPhotoUpload,onSignature,onEta,onShipPlan}){
const [sigStop,setSigStop]=useState(null);
const [shipPlanInputs,setShipPlanInputs]=useState({});
const completed=entries.filter(e=>e.status==="departed").length;
const total=entries.length;
const isImetcoReturn=(e)=>e.customer==="IMETCO"&&(e.stop.includes("to IMETCO")||e.stop.includes("Round Trip"));
const needsShipPlan=(e)=>e.customer==="IMETCO";
return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#f5f5f4",color:"#1c1917",minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
<div style={{background:"#1c1917",color:"#fff",padding:"16px 20px"}}>
<h1 style={{margin:0,fontSize:20,fontWeight:700}}>DAVIS DELIVERY</h1>
<p style={{margin:"2px 0 0",fontSize:11,color:"#a8a29e",letterSpacing:"0.08em"}}>DRIVER MANIFEST</p>
</div>
<div style={{padding:"16px 16px 0"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<div>
<h2 style={{margin:0,fontSize:18,fontWeight:700}}>{driver.name}</h2>
<p style={{margin:0,fontSize:13,color:"#78716c"}}>{dayLabel}</p>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:22,fontWeight:700,color:"#16a34a"}}>{completed}/{total}</div>
<div style={{fontSize:11,color:"#78716c"}}>completed</div>
</div>
</div>
<div style={{height:6,background:"#e7e5e4",borderRadius:3,marginBottom:16,overflow:"hidden"}}>
<div style={{height:"100%",background:"#16a34a",borderRadius:3,width:`${total?completed/total*100:0}%`,transition:"width 0.3s"}}/>
</div>
</div>
<div style={{padding:"0 16px 100px"}}>
{entries.map((entry,i)=>{
const c=CC[entry.customer]||CC["One-Off Delivery"];
const addr=entry.addr||getAddr(entry.stop);
const isPickup=entry.stopType==="pickup";
const arrived=entry.status==="arrived"||entry.status==="departed";
const departed=entry.status==="departed";
const isReturn=isImetcoReturn(entry);
const wantsShipPlan=needsShipPlan(entry);
const shipVal=shipPlanInputs[entry.id]||entry.shipPlan||"";
const canDepart=isReturn?!!shipVal.trim():true;
return(
<div key={entry.id} style={{background:"#fff",border:`1px solid ${departed?"#bbf7d0":arrived?"#fde68a":"#e7e5e4"}`,borderRadius:14,padding:"14px 16px",marginBottom:10,borderLeft:`4px solid ${departed?"#16a34a":arrived?"#f59e0b":isPickup?"#2563eb":c.accent}`,opacity:departed?0.7:1}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
<span style={{fontSize:13,fontWeight:700,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>{i+1}.</span>
{isPickup&&<span style={{fontSize:9,background:"#2563eb",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PICKUP</span>}
{entry.priority&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PRIORITY</span>}
{departed&&<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>DONE</span>}
{arrived&&!departed&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>ON SITE</span>}
{wantsShipPlan&&<span style={{fontSize:9,background:"#ea580c",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>SHIP PLAN REQ</span>}
</div>
<div style={{fontSize:16,fontWeight:700,color:"#1c1917",marginBottom:2}}>{entry.stop}</div>
<div style={{fontSize:12,color:c.accent,fontWeight:600}}>{entry.customer}</div>
{addr&&<a href={`https://maps.google.com/?q=${encodeURIComponent(addr)}`} target="_blank" rel="noopener" onClick={e=>e.stopPropagation()}
style={{fontSize:12,color:"#2563eb",textDecoration:"underline",display:"block",marginTop:2}}>{addr}</a>}
{entry.instructions&&<div style={{fontSize:12,color:"#1c1917",background:"#eff6ff",padding:"6px 10px",borderRadius:8,marginTop:6}}>📋 {entry.instructions}</div>}
{/* IMETCO Ship Plan # input */}
{wantsShipPlan&&arrived&&!departed&&(
<div style={{marginTop:8,background:isReturn?"#fef2f2":"#fff7ed",border:isReturn?"2px solid #fca5a5":"1px solid #fed7aa",borderRadius:10,padding:"10px 12px"}}>
<label style={{fontSize:11,fontWeight:700,color:isReturn?"#dc2626":"#ea580c",display:"block",marginBottom:6}}>
{isReturn?"⚠ REQUIRED: Enter Ship Plan # before departing":"Ship Plan # (if available)"}
</label>
<input value={shipVal} onChange={e=>{setShipPlanInputs(p=>({...p,[entry.id]:e.target.value}));}} placeholder="Enter Ship Plan #"
style={{width:"100%",border:isReturn&&!shipVal.trim()?"2px solid #dc2626":"1px solid #d6d3d1",borderRadius:8,padding:"10px 12px",fontSize:15,fontWeight:700,outline:"none",textAlign:"center",background:"#fff"}}/>
{isReturn&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:8,background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"8px 10px"}}>
<span style={{fontSize:18}}>📸</span>
<span style={{fontSize:12,fontWeight:600,color:"#92400e"}}>Remember to photograph the BOL</span>
</div>}
{shipVal.trim()&&<button onClick={()=>{onShipPlan(entry.id,shipVal.trim());}} style={{display:"block",width:"100%",marginTop:6,background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"8px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Save Ship Plan #{shipVal.trim()?"": " — Required"}</button>}
</div>
)}
{entry.shipPlan&&<div style={{marginTop:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"6px 12px"}}><span style={{fontSize:10,color:"#16a34a",fontWeight:600}}>Ship Plan #:</span> <span style={{fontSize:14,fontWeight:700}}>{entry.shipPlan}</span></div>}
{entry.note&&<div style={{fontSize:11,color:"#78716c",marginTop:2}}>{entry.note}</div>}
{addr&&<a href={`https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`} target="_blank" rel="noopener"
style={{display:"inline-flex",alignItems:"center",gap:6,background:"#1c1917",color:"#fff",border:"none",borderRadius:10,padding:"10px 16px",cursor:"pointer",fontSize:13,fontWeight:600,marginTop:8,textDecoration:"none",width:"100%",justifyContent:"center"}}>
🧭 Get Directions
</a>}
{entry.arrivedAt&&<div style={{fontSize:10,color:"#16a34a",marginTop:6}}>Arrived: {entry.arrivedAt}</div>}
{entry.departedAt&&<div style={{fontSize:10,color:"#16a34a"}}>Departed: {entry.departedAt}</div>}
{entry.eta&&<div style={{fontSize:10,color:"#2563eb"}}>ETA to next: {entry.eta} min</div>}
<div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
{!arrived&&<button onClick={()=>onStatusUpdate(entry.id,"arrived")} style={{flex:1,background:"#f59e0b",color:"#fff",border:"none",borderRadius:10,padding:"10px",cursor:"pointer",fontSize:13,fontWeight:600}}>Arrived</button>}
{arrived&&!departed&&<button onClick={()=>{if(!canDepart){return;}onStatusUpdate(entry.id,"departed");}} style={{flex:1,background:canDepart?"#16a34a":"#a8a29e",color:"#fff",border:"none",borderRadius:10,padding:"10px",cursor:canDepart?"pointer":"not-allowed",fontSize:13,fontWeight:600}}>{canDepart?"Departed":"Enter Ship Plan # First"}</button>}
{arrived&&(
<div style={{display:"flex",gap:6,width:"100%",marginTop:4}}>
<input placeholder="ETA mins" type="number" defaultValue={entry.eta||""} style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:13,outline:"none"}}
onBlur={e=>{if(e.target.value)onEta(entry.id,e.target.value);}}/>
<label style={{display:"flex",alignItems:"center",gap:4,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#2563eb"}}>
📷 Photo
<input type="file" accept="image/*" capture="environment" style={{display:"none"}}
onChange={e=>{if(e.target.files[0]){const r=new FileReader();r.onload=ev=>onPhotoUpload(entry.id,ev.target.result);r.readAsDataURL(e.target.files[0]);}}}/>
</label>
<button onClick={()=>setSigStop(entry.id)} style={{background:"#f3e8f9",border:"1px solid #d8b4fe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#7c3aed"}}>✍ Sign</button>
</div>
)}
</div>
{entry.photos&&entry.photos.length>0&&(
<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
{entry.photos.map((p,pi)=><img key={pi} src={p} alt="delivery" style={{width:60,height:60,objectFit:"cover",borderRadius:8,border:"1px solid #e7e5e4"}}/>)}
</div>
)}
{entry.signature&&<div style={{marginTop:8,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 12px"}}><span style={{fontSize:10,color:"#16a34a",fontWeight:600}}>Received by:</span> <span style={{fontSize:14,fontWeight:700}}>{entry.signature}</span></div>}
{sigStop===entry.id&&<div style={{marginTop:8}}><SignaturePad onSave={d=>{onSignature(entry.id,d);setSigStop(null);}} onCancel={()=>setSigStop(null)}/></div>}
</div>
);
})}
</div>
</div>
);
}

/* ── QUOTE BUILDER ── */
function QuoteBuilder({customerName,pickupOptions,onAdd,onBack,drivers,drvEntries}){
const[miles,setMiles]=useState("");const[liftgate,setLiftgate]=useState(false);const[gravel,setGravel]=useState(false);const[extraPallets,setExtraPallets]=useState(false);const[customStop,setCustomStop]=useState("");const[originAddr,setOriginAddr]=useState(pickupOptions?.[0]?.addr||"");const[selectedPickup,setSelectedPickup]=useState(pickupOptions?.[0]?.label||"custom");const[destAddr,setDestAddr]=useState("");const[calcLoading,setCalcLoading]=useState(false);const[calcError,setCalcError]=useState("");const[apiKey,setApiKey]=useState(()=>{try{return window.__gbApiKey||"AIzaSyB29mVeZXedDhLVT3eMVgl07EsOneWCUu4";}catch{return"AIzaSyB29mVeZXedDhLVT3eMVgl07EsOneWCUu4";}});const[showApiInput,setShowApiInput]=useState(false);
const mi=parseFloat(miles)||0;const baseTier=getBaseTier(mi);const fuelAmt=liftgate?0:baseTier*0.15;const total=baseTier+fuelAmt+(liftgate?75:0)+(gravel?25:0)+(extraPallets?25:0);const isOneOff=customerName==="One-Off Delivery";
const calcDistance=async()=>{if(!originAddr||!destAddr){setCalcError("Enter both addresses");return;}if(!apiKey){setShowApiInput(true);setCalcError("Set API key first");return;}setCalcLoading(true);setCalcError("");try{const svc=new window.google.maps.DistanceMatrixService();svc.getDistanceMatrix({origins:[originAddr],destinations:[destAddr],travelMode:window.google.maps.TravelMode.DRIVING,unitSystem:window.google.maps.UnitSystem.IMPERIAL},(resp,status)=>{setCalcLoading(false);if(status==="OK"&&resp.rows[0]?.elements[0]?.status==="OK")setMiles(parseFloat(resp.rows[0].elements[0].distance.text.replace(/,/g,"")).toFixed(1));else setCalcError("Could not calculate");});}catch{setCalcLoading(false);setCalcError("Maps API error");}};
const loadMaps=k=>{if(window.google?.maps?.DistanceMatrixService)return;const s=document.createElement("script");s.src=`https://maps.googleapis.com/maps/api/js?key=${k}&libraries=places`;s.async=true;document.head.appendChild(s);};
const saveKey=k=>{setApiKey(k);window.__gbApiKey=k;if(k)loadMaps(k);setShowApiInput(false);};
const addQuote=drvId=>{const stopName=isOneOff?(customStop||"One-Off"):customerName;const note=[`${mi}mi`,liftgate?"LG":"Fuel",gravel?"Gravel":"",extraPallets?"4-5 Pallets":""].filter(Boolean).join(" | ");onAdd(isOneOff?"One-Off Delivery":"Quote Delivery",stopName,total,drvId,{note,addr:destAddr,stopType:"delivery"});};
return(
<div>
<button onClick={onBack} style={BB}>← Back</button>
<div style={{padding:"0 4px"}}><h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:700,color:isOneOff?"#6b7280":"#d97706"}}>{customerName}</h2><p style={{margin:"0 0 16px",fontSize:12,color:"#78716c"}}>No liftgate = base + 15% fuel. Liftgate = base + $75, no fuel.</p></div>
{isOneOff&&<div style={{padding:"0 4px",marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Customer / Stop Name</label><input value={customStop} onChange={e=>setCustomStop(e.target.value)} placeholder="e.g. Smith Residence" style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:14,outline:"none",background:"#fff"}}/></div>}
<div style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:16,margin:"0 4px 12px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:13,fontWeight:700}}>Distance</span><button onClick={()=>setShowApiInput(!showApiInput)} style={{background:"#f5f5f4",border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,color:"#78716c",cursor:"pointer"}}>{apiKey?"API Key Set":"Set API Key"}</button></div>
{showApiInput&&<div style={{marginBottom:10}}><input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Google Maps API key" style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none",marginBottom:6}}/><button onClick={()=>saveKey(apiKey)} style={{background:"#1c1917",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Save</button></div>}
{pickupOptions&&pickupOptions.length>0&&<div style={{marginBottom:8}}><label style={{fontSize:12,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Pickup From</label><div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>{pickupOptions.map(po=><button key={po.label} onClick={()=>{setSelectedPickup(po.label);setOriginAddr(po.addr);}} style={{padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:selectedPickup===po.label?"#2563eb":"#e7e5e4",color:selectedPickup===po.label?"#fff":"#57534e"}}>{po.label}</button>)}<button onClick={()=>{setSelectedPickup("custom");setOriginAddr("");}} style={{padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:selectedPickup==="custom"?"#2563eb":"#e7e5e4",color:selectedPickup==="custom"?"#fff":"#57534e"}}>Manual</button></div>{selectedPickup!=="custom"&&<div style={{fontSize:11,color:"#78716c"}}>{originAddr}</div>}</div>}
<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>{(selectedPickup==="custom"||!pickupOptions?.length)&&<input value={originAddr} onChange={e=>setOriginAddr(e.target.value)} placeholder="Pickup address" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/>}<input value={destAddr} onChange={e=>setDestAddr(e.target.value)} placeholder="Delivery address" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/><button onClick={calcDistance} disabled={calcLoading} style={{background:"#1c1917",color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:13,fontWeight:600,cursor:"pointer",opacity:calcLoading?0.6:1}}>{calcLoading?"Calculating…":"Calculate Distance"}</button></div>
{calcError&&<p style={{fontSize:12,color:"#dc2626",margin:"0 0 8px"}}>{calcError}</p>}
<div style={{display:"flex",alignItems:"center",gap:8}}><label style={{fontSize:13,fontWeight:600,color:"#57534e"}}>Miles:</label><input value={miles} onChange={e=>setMiles(e.target.value)} placeholder="0" type="number" step="0.1" style={{width:80,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:15,fontWeight:700,outline:"none",textAlign:"center"}}/>{mi>0&&<span style={{fontSize:13,fontVariantNumeric:"tabular-nums",color:"#57534e"}}>Base: {fmt(baseTier)}</span>}</div>
</div>
<div style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:16,margin:"0 4px 12px"}}><span style={{fontSize:13,fontWeight:700,display:"block",marginBottom:10}}>Add-ons</span>
{[{label:"Liftgate (+$75, replaces fuel)",val:liftgate,set:setLiftgate,color:"#dc2626"},{label:"Gravel / Uneven Driveway (+$25)",val:gravel,set:setGravel,color:"#d97706"},{label:"4-5 Pallets (+$25)",val:extraPallets,set:setExtraPallets,color:"#7c3aed"}].map((o,i)=><button key={i} onClick={()=>o.set(!o.val)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"12px 14px",marginBottom:6,borderRadius:10,cursor:"pointer",background:o.val?`${o.color}11`:"#fafaf9",border:o.val?`2px solid ${o.color}`:"1px solid #e7e5e4"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:22,height:22,borderRadius:6,border:`2px solid ${o.val?o.color:"#d6d3d1"}`,background:o.val?o.color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700}}>{o.val?"✓":""}</div><span style={{fontSize:13,fontWeight:600}}>{o.label}</span></div></button>)}
{!liftgate&&mi>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:"#fffbeb",borderRadius:10,border:"1px solid #fde68a",marginTop:6}}><span style={{fontSize:13,color:"#92400e",fontWeight:600}}>15% Fuel</span><span style={{fontVariantNumeric:"tabular-nums",fontSize:13,fontWeight:700,color:"#d97706"}}>{fmt(fuelAmt)}</span></div>}
{liftgate&&<div style={{padding:"10px 14px",background:"#fef2f2",borderRadius:10,border:"1px solid #fecaca",marginTop:6}}><span style={{fontSize:12,color:"#991b1b"}}>Liftgate = no fuel charge</span></div>}
</div>
{mi>0&&<div style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:16,margin:"0 4px 12px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,paddingBottom:12,borderBottom:"2px solid #bbf7d0"}}><span style={{fontSize:15,fontWeight:700}}>Total</span><span style={{fontSize:22,fontWeight:700,fontVariantNumeric:"tabular-nums",color:"#16a34a"}}>{fmt(total)}</span></div>
<span style={{fontSize:13,fontWeight:600,color:"#57534e",display:"block",marginBottom:10}}>Assign Driver</span>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{drivers.map((drv,di)=><button key={drv.id} onClick={()=>addQuote(drv.id)} style={{background:"#fff",border:`3px solid ${DCOL[di]}`,borderRadius:14,padding:"14px 10px",cursor:"pointer",textAlign:"center"}}><div style={{width:40,height:40,borderRadius:12,background:DCOL[di],margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff",fontWeight:700}}>{drv.name.charAt(0)}</div><div style={{fontSize:14,fontWeight:700}}>{drv.name}</div></button>)}</div>
<button onClick={()=>addQuote(0)} style={{display:"block",width:"100%",marginTop:10,background:"#fafaf9",border:"2px dashed #d6d3d1",borderRadius:14,padding:"14px",cursor:"pointer",textAlign:"center",color:"#78716c",fontSize:14,fontWeight:600}}>Skip — Assign Later</button>
</div>}
</div>
);
}

/* ── MANIFEST STOP ── */
function ManifestStop({entry,eIdx,total,drivers,onMove,onReassign,onRemove,onUpdateInstructions,onShipPlan,onDragStart,onDragOver,onDrop,isDragOver,isDragging}){
const[expanded,setExpanded]=useState(false);const[instrText,setInstrText]=useState(entry.instructions||"");
const c=CC[entry.customer]||CC["One-Off Delivery"];const addr=entry.addr||getAddr(entry.stop);const isP=entry.priority;const isPU=entry.stopType==="pickup";const hasI=entry.instructions?.trim();const isImetco=entry.customer==="IMETCO";
return(
<div data-drv={entry.driverId} data-idx={eIdx}>
<div onDragOver={e=>{e.preventDefault();onDragOver();}} onDrop={onDrop}
style={{display:"flex",alignItems:"center",gap:6,padding:"8px",marginBottom:expanded||isImetco?0:2,background:isDragOver?"#dcfce7":isDragging?"#fef9c3":isPU?"#eff6ff":isP?"#fef3c7":"#fafaf9",border:isDragOver?"2px dashed #16a34a":`1px solid ${isPU?"#bfdbfe":isP?"#fde68a":"#e7e5e4"}`,borderRadius:expanded||isImetco?"10px 10px 0 0":10,borderLeft:`4px solid ${isPU?"#2563eb":isP?"#f59e0b":c.accent}`,opacity:isDragging?0.5:1,transition:"background 0.15s,opacity 0.15s"}}>
<div draggable onDragStart={onDragStart}
onTouchStart={e=>{e.stopPropagation();onDragStart();}}
style={{color:isDragging?"#16a34a":"#a8a29e",fontSize:20,cursor:"grab",padding:"4px 4px",touchAction:"none",lineHeight:1,userSelect:"none",flexShrink:0}}>⠿</div>
<div style={{flex:1,minWidth:0}} onClick={e=>{e.stopPropagation();setExpanded(!expanded);setInstrText(entry.instructions||"");}}>
<div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
<span style={{fontSize:11,fontVariantNumeric:"tabular-nums",color:"#a8a29e"}}>{eIdx+1}.</span>
{isPU&&<span style={{fontSize:9,background:"#2563eb",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PICKUP</span>}
{isP&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PRIORITY</span>}
{entry.status==="departed"&&<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>DONE</span>}
<span style={{fontSize:12,fontWeight:700,color:"#1c1917"}}>{entry.stop}</span>
</div>
<div style={{fontSize:10,color:c.accent,fontWeight:600}}>{entry.customer}</div>
{addr&&<div style={{fontSize:10,color:"#78716c",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{addr}</div>}
{entry.note&&<div style={{fontSize:10,color:"#a8a29e"}}>{entry.note}</div>}
{hasI&&!expanded&&<div style={{fontSize:10,color:"#2563eb",marginTop:2}}>📋 {entry.instructions}</div>}
{!hasI&&!expanded&&<div style={{fontSize:9,color:"#d6d3d1",marginTop:2}}>tap to add instructions</div>}
{entry.shipPlan&&!expanded&&<div style={{fontSize:10,color:"#ea580c",fontWeight:700,marginTop:1}}>SP# {entry.shipPlan}</div>}
</div>
<span style={{fontSize:11,fontWeight:700,fontVariantNumeric:"tabular-nums",color:"#44403c",whiteSpace:"nowrap"}}>{entry.isHourly?"HR":fmt(entry.baseRate)}</span>
<div style={{display:"flex",flexDirection:"column",gap:2}}>
<select value={entry.driverId} onChange={e=>{e.stopPropagation();onReassign(Number(e.target.value));}} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"3px 2px",fontSize:10,color:"#44403c",cursor:"pointer",maxWidth:62}}><option value={0}>None</option>{drivers.map(dd=><option key={dd.id} value={dd.id}>{dd.name}</option>)}</select>
<button onClick={e=>{e.stopPropagation();onRemove();}} style={{background:"none",border:"none",color:"#dc2626",fontSize:9,cursor:"pointer",padding:0}}>Remove</button>
</div>
</div>
{isImetco&&!expanded&&<div style={{padding:"4px 8px 6px 12px",background:"#fafaf9",border:"1px solid #e7e5e4",borderTop:"none",borderRadius:"0 0 10px 10px",borderLeft:`4px solid ${c.accent}`,marginBottom:2,display:"flex",alignItems:"center",gap:6}} onClick={e=>e.stopPropagation()}>
<span style={{fontSize:10,fontWeight:700,color:"#ea580c",flexShrink:0}}>Ship Plan #:</span>
<input value={entry.shipPlan||""} onChange={e=>onShipPlan(e.target.value)} placeholder="Enter #" onClick={e=>e.stopPropagation()}
style={{flex:1,maxWidth:120,border:entry.shipPlan?"1px solid #bbf7d0":"1px solid #fca5a5",borderRadius:6,padding:"4px 8px",fontSize:12,fontWeight:700,outline:"none",background:entry.shipPlan?"#f0fdf4":"#fff",textAlign:"center"}}/>
</div>}
{expanded&&<div style={{padding:"8px 12px 10px",marginBottom:2,background:"#fff",border:"1px solid #e7e5e4",borderTop:"none",borderRadius:"0 0 10px 10px",borderLeft:`4px solid ${isPU?"#2563eb":isP?"#f59e0b":c.accent}`}}>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Special instructions / notes</label>
<textarea value={instrText} onChange={e=>setInstrText(e.target.value)} placeholder="Phone #, gate code, dock info…" rows={2} onClick={e=>e.stopPropagation()}
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
<div style={{display:"flex",gap:6,marginTop:6,justifyContent:"flex-end"}}>
{hasI&&<button onClick={e=>{e.stopPropagation();setInstrText("");onUpdateInstructions("");setExpanded(false);}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear</button>}
<button onClick={e=>{e.stopPropagation();setExpanded(false);}} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Cancel</button>
<button onClick={e=>{e.stopPropagation();onUpdateInstructions(instrText.trim());setExpanded(false);}} style={{background:"#1c1917",color:"#fff",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:600}}>Save</button>
</div>
</div>}
</div>
);
}

/* ── PRE-GEOCODED COORDINATES (Atlanta metro area) ── */
/* These are approximate coords for map plotting. When deployed with Google Maps API, */
/* real geocoding can replace these. For now they enable the route builder UI. */
const COORDS={
"5470-G Oakbrook Parkway, Norcross, GA 30093":{lat:33.9293,lng:-84.2135},
"250 Hembree Park Drive, Roswell, GA 30076":{lat:34.0468,lng:-84.3277},
"6731 Discovery Blvd #200, Mableton, GA 30126":{lat:33.8103,lng:-84.5621},
"3665 Swiftwater Park Drive, Bldg 2, Suwanee, GA 30024":{lat:34.0432,lng:-84.0623},
"1850 Westford Drive, Lithia Springs, GA 30122":{lat:33.7715,lng:-84.6440},
"1000 Union Center Drive, Suite C, Alpharetta, GA 30004":{lat:34.1155,lng:-84.2635},
"375 Buford Drive, Lawrenceville, GA 30046":{lat:33.9535,lng:-83.9870},
"103 Smokehill Lane #100, Woodstock, GA 30188":{lat:34.1015,lng:-84.5094},
"3500 Highlands Parkway SE, Smyrna, GA 30082":{lat:33.8537,lng:-84.4865},
"3690 Atlanta Highway #108, Athens, GA 30606":{lat:33.9366,lng:-83.4460},
"942 Greensboro Road, Eatonton, GA 31024":{lat:33.3271,lng:-83.3885},
"1440 Lakes Parkway, Suite 100, Lawrenceville, GA 30043":{lat:33.9575,lng:-84.0535},
"2408 Tech Center Parkway #100, Lawrenceville, GA 30043":{lat:33.9480,lng:-84.0400},
"3480 Green Pointe Parkway, Norcross, GA 30092":{lat:33.9415,lng:-84.2015},
"3230 Oakcliff Industrial Street, Doraville, GA 30340":{lat:33.8935,lng:-84.2690},
"2975 Courtyard Drive, Norcross, GA 30071":{lat:33.9290,lng:-84.1970},
"50 East Great Southwest Parkway, Atlanta, GA 30336":{lat:33.7182,lng:-84.5617},
"201 Peachtree Industrial Blvd, Sugar Hill, GA 30518":{lat:34.1040,lng:-84.0380},
"6375 Peachtree Industrial Blvd, Norcross, GA 30071":{lat:33.9310,lng:-84.2070},
"5340 McEver Road, Unit G, Flowery Branch, GA 30542":{lat:34.3172,lng:-83.9152},
"1750 Corporate Drive, Suite 740, Norcross, GA 30093":{lat:33.9265,lng:-84.2175},
"605 Satellite Blvd, Suite 200, Suwanee, GA 30024":{lat:34.0395,lng:-84.0555},
"795 Branch Drive, Alpharetta, GA 30004":{lat:34.1125,lng:-84.2790},
"2260 Northwest Parkway SE, Marietta, GA 30067":{lat:33.9135,lng:-84.4620},
"3000 Miller Court West, Norcross, GA 30071":{lat:33.9165,lng:-84.2065},
"6513 Warren Drive, Norcross, GA 30071":{lat:33.9215,lng:-84.2165},
"5500 South Cobb Drive SE, Bldg 100, Smyrna, GA 30080":{lat:33.8395,lng:-84.5190},
"6190 Shiloh Crossing, Suite D, Alpharetta, GA 30004":{lat:34.1145,lng:-84.2415},
"4301 Pleasantdale Road, Suite A, Doraville, GA 30340":{lat:33.8875,lng:-84.2665},
"1750 Corporate Drive, Suite 700, Norcross, GA 30093":{lat:33.9265,lng:-84.2175},
"193 Stockwood Drive, Woodstock, GA 30188":{lat:34.0875,lng:-84.5010},
"196 Rio Circle, Decatur, GA 30030":{lat:33.7610,lng:-84.2810},
"1167 Eatonton Road, Madison, GA 30650":{lat:33.5775,lng:-83.4710},
"783 Metromont Road, Hiram, GA 30141":{lat:33.8510,lng:-84.7590},
"400 Northfield Way, Roswell, GA 30075":{lat:34.0395,lng:-84.3415},
"6684 Jimmy Carter Blvd, Suite 500, Norcross, GA 30071":{lat:33.9290,lng:-84.1845},
"3045 Chastain Meadows Parkway, Suite 100, Marietta, GA 30066":{lat:34.0210,lng:-84.5130},
"560 Webb Industrial Drive, Marietta, GA 30062":{lat:33.9785,lng:-84.4520},
"5884 Peachtree Road, Atlanta, GA 30340":{lat:33.8890,lng:-84.2765},
"5984 Financial Drive, Norcross, GA 30071":{lat:33.9180,lng:-84.2125},
"415 Winkler Drive #B, Alpharetta, GA 30004":{lat:34.1115,lng:-84.2505},
"1670 Oakbrook Drive, Norcross, GA 30093":{lat:33.9240,lng:-84.2090},
"1740 Cumberland Point Drive, Suite 1, Marietta, GA 30067":{lat:33.8820,lng:-84.4640},
"1721 Oakbrook Drive, Norcross, GA 30093":{lat:33.9250,lng:-84.2100},
"1455 Oakbrook Drive, Suite 100, Norcross, GA 30093":{lat:33.9230,lng:-84.2080},
"2450 Freedom Parkway, Suite 207, Cumming, GA 30041":{lat:34.1810,lng:-84.1275},
"309 West Avenue, Dallas, GA 30157":{lat:33.9215,lng:-84.8415},
"14147 Chattahoochee Avenue, Atlanta, GA 30318":{lat:33.8065,lng:-84.4240},
"1328 Canton Road, Marietta, GA 30066":{lat:34.0045,lng:-84.5365},
"4648 South Old Peachtree Road, Norcross, GA 30071":{lat:33.9310,lng:-84.1925},
"28 Andrews Way, Villa Rica, GA 30180":{lat:33.7290,lng:-84.9170},
"4264 Winters Chapel Road, Building F, Doraville, GA 30360":{lat:33.9165,lng:-84.2855},
"14100 Veterans Memorial Highway, Villa Rica, GA 30180":{lat:33.7285,lng:-84.9260},
"50 MM Way, Pendergrass, GA 30567":{lat:34.1675,lng:-83.6825},
"1300 Williams Drive, Marietta, GA 30066":{lat:34.0260,lng:-84.5295},
"1698 Sands Place A, Marietta, GA 30067":{lat:33.9295,lng:-84.4860},
"3094 Emery Circle, Austell, GA 30168":{lat:33.8195,lng:-84.6265},
"157 North Salem Road NE, Conyers, GA 30013":{lat:33.6870,lng:-84.0015},
"191 Rio Circle, Decatur, GA 30030":{lat:33.7610,lng:-84.2810},
"505 Selig Drive, Atlanta, GA 30336":{lat:33.7110,lng:-84.5620},
"2935 Alcove Drive, Scottdale, GA 30079":{lat:33.7900,lng:-84.2625},
"4598-A Stonegate Industrial Blvd, Stone Mountain, GA 30083":{lat:33.8025,lng:-84.1575},
"1401 Blairs Bridge Road, Lithia Springs, GA 30122":{lat:33.7775,lng:-84.6310},
"3650 Burnett Park Drive #7106, Suwanee, GA 30024":{lat:34.0395,lng:-84.0650},
"4520 South Berkeley Lake Road NW, Norcross, GA 30071":{lat:33.9325,lng:-84.1990},
"4998 South Royal Atlanta Drive, Suite C, Tucker, GA 30084":{lat:33.8335,lng:-84.2015},
"5425 Progress Court, Braselton, GA 30517":{lat:34.1080,lng:-83.7845},
"1101 GA-124, Hoschton, GA 30548":{lat:34.0920,lng:-83.7510},
"4251 Wayside Court SW, Suite B, Lilburn, GA 30047":{lat:33.8640,lng:-84.1175},
"4405 South Old Peachtree Road, Norcross, GA 30071":{lat:33.9285,lng:-84.1910},
"10 Fesco Way, Loganville, GA 30052":{lat:33.8305,lng:-83.8970},
"2146 Flinstone Drive, Suite B, Tucker, GA 30084":{lat:33.8415,lng:-84.2240},
"29 Durand Street, Woodbury, GA 30293":{lat:32.9795,lng:-84.5795},
"1256 Oakbrook Drive, Suite F, Norcross, GA 30093":{lat:33.9225,lng:-84.2085},
"3065 Trotters Parkway, Alpharetta, GA 30004":{lat:34.1180,lng:-84.2690},
"1015 Chattahoochee Avenue NW, Atlanta, GA 30318":{lat:33.8060,lng:-84.4245},
"3044 Northwoods Circle, Norcross, GA 30071":{lat:33.9280,lng:-84.2110},
"470 Woodsmill Road, Suite B, Gainesville, GA 30501":{lat:34.3190,lng:-83.8420},
"3175 Highway 212, Covington, GA 30016":{lat:33.5535,lng:-83.8665},
"11 Perimeter Center East, Atlanta, GA 30346":{lat:33.9275,lng:-84.3400},
"1275 Oakbrook Drive, Suite D, Norcross, GA 30093":{lat:33.9225,lng:-84.2085},
};
function getCoords(addr){return COORDS[addr]||null;}

/* ── ROUTE BUILDER COMPONENT ── */
function RouteBuilder({entries,drivers,onAssign,onReorder,onBack}){
const[activeDriver,setActiveDriver]=useState(null);
const[routeOrders,setRouteOrders]=useState({}); /* {driverId: [entryId, ...]} */
const[hoveredStop,setHoveredStop]=useState(null);
const mapRef=useState(null);

/* Geocode all entries */
const stopsWithCoords=entries.map(e=>{
const addr=e.addr||getAddr(e.stop);
const coords=getCoords(addr);
return{...e,coords,displayAddr:addr};
}).filter(e=>e.coords);

const stopsNoCoords=entries.filter(e=>{
const addr=e.addr||getAddr(e.stop);
return!getCoords(addr);
});

/* Build route order for active driver */
const driverRoute=activeDriver?routeOrders[activeDriver]||[]:[];

const handleStopClick=(entryId)=>{
if(!activeDriver)return;
const entry=entries.find(e=>e.id===entryId);
if(!entry)return;

/* If already in this driver's route, remove it */
if(driverRoute.includes(entryId)){
setRouteOrders(p=>({...p,[activeDriver]:(p[activeDriver]||[]).filter(id=>id!==entryId)}));
onAssign(entryId,0); /* unassign */
return;
}

/* If assigned to another driver, remove from that route first */
Object.entries(routeOrders).forEach(([did,ids])=>{
if(ids.includes(entryId)&&Number(did)!==activeDriver){
setRouteOrders(p=>({...p,[did]:(p[did]||[]).filter(id=>id!==entryId)}));
}
});

/* Add to active driver's route */
setRouteOrders(p=>({...p,[activeDriver]:[...(p[activeDriver]||[]),entryId]}));
onAssign(entryId,activeDriver);
};

/* Apply route orders to manifest */
const applyRoutes=()=>{
Object.entries(routeOrders).forEach(([did,ids])=>{
if(ids.length>0)onReorder(Number(did),ids);
});
onBack();
};

/* Get driver color for a stop */
const getStopDriverColor=(entryId)=>{
for(const[did,ids]of Object.entries(routeOrders)){
if(ids.includes(entryId)){
const di=drivers.findIndex(d=>d.id===Number(did));
return DCOL[di]||"#78716c";
}
}
return null;
};

const getStopOrder=(entryId)=>{
for(const[did,ids]of Object.entries(routeOrders)){
if(ids.includes(entryId))return ids.indexOf(entryId)+1;
}
return null;
};

/* Map bounds */
const allCoords=stopsWithCoords.map(s=>s.coords);
const minLat=Math.min(...allCoords.map(c=>c.lat))-0.02;
const maxLat=Math.max(...allCoords.map(c=>c.lat))+0.02;
const minLng=Math.min(...allCoords.map(c=>c.lng))-0.02;
const maxLng=Math.max(...allCoords.map(c=>c.lng))+0.02;
const mapW=460;const mapH=400;

const toXY=(coords)=>({
x:((coords.lng-minLng)/(maxLng-minLng))*mapW,
y:((maxLat-coords.lat)/(maxLat-minLat))*mapH,
});

/* Route lines for each driver */
const routeLines=[];
Object.entries(routeOrders).forEach(([did,ids])=>{
if(ids.length<2)return;
const di=drivers.findIndex(d=>d.id===Number(did));
const color=DCOL[di]||"#78716c";
const points=ids.map(id=>{
const s=stopsWithCoords.find(sw=>sw.id===id);
return s?toXY(s.coords):null;
}).filter(Boolean);
if(points.length>=2)routeLines.push({color,points});
});

const unassignedCount=stopsWithCoords.filter(s=>!getStopDriverColor(s.id)).length;
const totalAssigned=Object.values(routeOrders).reduce((s,ids)=>s+ids.length,0);

return(
<div>
<div style={{padding:"12px 4px 8px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<h2 style={{margin:0,fontSize:16,fontWeight:600}}>Build Routes — {entries.length} stops</h2>
<button onClick={onBack} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#57534e"}}>← Back</button>
</div>
<p style={{margin:"0 0 12px",fontSize:12,color:"#78716c"}}>Select a driver, then tap stops on the map in delivery order.</p>
</div>

{/* Driver selector bar */}
<div style={{display:"flex",gap:6,padding:"0 4px",marginBottom:12,overflowX:"auto"}}>
{drivers.map((drv,di)=>{
const count=(routeOrders[drv.id]||[]).length;
const isActive=activeDriver===drv.id;
return(
<button key={drv.id} onClick={()=>setActiveDriver(isActive?null:drv.id)}
style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,border:isActive?`3px solid ${DCOL[di]}`:"2px solid #e7e5e4",background:isActive?"#fff":"#fafaf9",cursor:"pointer",flexShrink:0,transition:"all 0.15s"}}>
<div style={{width:24,height:24,borderRadius:8,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",fontWeight:700}}>{drv.name.charAt(0)}</div>
<div style={{textAlign:"left"}}>
<div style={{fontSize:12,fontWeight:700,color:isActive?DCOL[di]:"#57534e"}}>{drv.name.split(" ")[0]}</div>
<div style={{fontSize:10,color:"#a8a29e"}}>{count} stop{count!==1?"s":""}</div>
</div>
</button>
);})}
</div>

{!activeDriver&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"10px 14px",margin:"0 4px 12px",fontSize:12,color:"#92400e",fontWeight:600}}>👆 Tap a driver above to start building their route</div>}

{/* MAP */}
<div style={{margin:"0 4px",background:"#e8e4df",borderRadius:14,overflow:"hidden",border:"1px solid #d6d3d1",position:"relative"}}>
{/* Map background with road grid hint */}
<svg width={mapW} height={mapH} viewBox={`0 0 ${mapW} ${mapH}`} style={{display:"block"}}>
{/* Background */}
<rect width={mapW} height={mapH} fill="#e8e4df"/>
{/* Grid lines to suggest roads */}
{Array.from({length:20}).map((_,i)=><line key={`h${i}`} x1={0} y1={i*20} x2={mapW} y2={i*20} stroke="#d6d3d1" strokeWidth={0.5} opacity={0.5}/>)}
{Array.from({length:24}).map((_,i)=><line key={`v${i}`} x1={i*20} y1={0} x2={i*20} y2={mapH} stroke="#d6d3d1" strokeWidth={0.5} opacity={0.5}/>)}

{/* Route lines */}
{routeLines.map((rl,ri)=>(
<g key={ri}>
<polyline points={rl.points.map(p=>`${p.x},${p.y}`).join(" ")} fill="none" stroke={rl.color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" opacity={0.7}/>
<polyline points={rl.points.map(p=>`${p.x},${p.y}`).join(" ")} fill="none" stroke={rl.color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6 4" opacity={0.9}/>
</g>
))}

{/* Stop dots */}
{stopsWithCoords.map(s=>{
const xy=toXY(s.coords);
const drvColor=getStopDriverColor(s.id);
const order=getStopOrder(s.id);
const isPickup=s.stopType==="pickup";
const custColor=(CC[s.customer]||CC["One-Off Delivery"]).accent;
const isHovered=hoveredStop===s.id;
const isAssignable=activeDriver&&!drvColor;
const dotSize=isHovered?14:drvColor?12:10;
return(
<g key={s.id} onClick={()=>handleStopClick(s.id)} onMouseEnter={()=>setHoveredStop(s.id)} onMouseLeave={()=>setHoveredStop(null)}
style={{cursor:activeDriver?"pointer":"default"}}>
{/* Pulse ring for unassigned when driver selected */}
{isAssignable&&<circle cx={xy.x} cy={xy.y} r={16} fill="none" stroke={DCOL[drivers.findIndex(d=>d.id===activeDriver)]} strokeWidth={1.5} opacity={0.4}>
<animate attributeName="r" from="10" to="18" dur="1.5s" repeatCount="indefinite"/>
<animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite"/>
</circle>}
{/* Dot */}
<circle cx={xy.x} cy={xy.y} r={dotSize} fill={drvColor||custColor} stroke={isHovered?"#1c1917":"#fff"} strokeWidth={isHovered?3:2}/>
{/* Pickup diamond */}
{isPickup&&<rect x={xy.x-4} y={xy.y-4} width={8} height={8} fill="#fff" transform={`rotate(45 ${xy.x} ${xy.y})`} opacity={0.9}/>}
{/* Order number */}
{order&&<text x={xy.x} y={xy.y+4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff" style={{pointerEvents:"none"}}>{order}</text>}
</g>
);})}
</svg>

{/* Hover tooltip */}
{hoveredStop&&(()=>{
const s=stopsWithCoords.find(sw=>sw.id===hoveredStop);
if(!s)return null;
const xy=toXY(s.coords);
const custColor=(CC[s.customer]||CC["One-Off Delivery"]).accent;
return(
<div style={{position:"absolute",left:Math.min(xy.x,mapW-180),top:Math.max(xy.y-65,4),background:"#1c1917",color:"#fff",padding:"8px 12px",borderRadius:10,fontSize:11,pointerEvents:"none",maxWidth:180,zIndex:10,boxShadow:"0 4px 12px rgba(0,0,0,0.3)"}}>
<div style={{fontWeight:700,fontSize:12,marginBottom:2}}>{s.stop}</div>
<div style={{color:custColor,fontWeight:600,fontSize:10}}>{s.customer}</div>
{s.priority&&<div style={{color:"#fbbf24",fontSize:9,fontWeight:600}}>⚡ PRIORITY</div>}
</div>
);
})()}
</div>

{/* Stats bar */}
<div style={{display:"flex",justifyContent:"space-between",padding:"10px 8px",margin:"8px 4px",background:"#fff",borderRadius:10,border:"1px solid #e7e5e4"}}>
<div style={{fontSize:12,color:"#57534e"}}><span style={{fontWeight:700,color:"#16a34a"}}>{totalAssigned}</span> assigned</div>
<div style={{fontSize:12,color:"#57534e"}}><span style={{fontWeight:700,color:unassignedCount>0?"#dc2626":"#16a34a"}}>{unassignedCount}</span> unassigned</div>
<div style={{fontSize:12,color:"#57534e"}}>{stopsNoCoords.length>0&&<span style={{color:"#d97706"}}>{stopsNoCoords.length} no coords</span>}</div>
</div>

{/* Route summary per driver */}
{drivers.map((drv,di)=>{
const ids=routeOrders[drv.id]||[];
if(!ids.length)return null;
return(
<div key={drv.id} style={{background:"#fff",border:`2px solid ${DCOL[di]}`,borderRadius:12,padding:"10px 14px",margin:"0 4px 8px"}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
<div style={{width:18,height:18,borderRadius:6,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700}}>{drv.name.charAt(0)}</div>
<span style={{fontSize:13,fontWeight:700}}>{drv.name}</span>
<span style={{fontSize:11,color:"#a8a29e"}}>— {ids.length} stops</span>
</div>
<div style={{display:"flex",flexWrap:"wrap",gap:4}}>
{ids.map((id,oi)=>{
const s=entries.find(e=>e.id===id);
if(!s)return null;
return(
<div key={id} style={{display:"flex",alignItems:"center",gap:4,background:"#f5f5f4",borderRadius:6,padding:"3px 8px"}}>
<span style={{fontSize:10,fontWeight:700,color:DCOL[di]}}>{oi+1}.</span>
<span style={{fontSize:10,color:"#57534e"}}>{s.stop.length>20?s.stop.slice(0,20)+"…":s.stop}</span>
<button onClick={()=>{
setRouteOrders(p=>({...p,[drv.id]:(p[drv.id]||[]).filter(x=>x!==id)}));
onAssign(id,0);
}} style={{background:"none",border:"none",color:"#dc2626",fontSize:10,cursor:"pointer",padding:0,marginLeft:2}}>✕</button>
</div>
);
})}
</div>
</div>
);})}

{/* Stops without coordinates */}
{stopsNoCoords.length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"10px 14px",margin:"0 4px 8px"}}>
<div style={{fontSize:11,fontWeight:700,color:"#d97706",marginBottom:6}}>Not on map (missing coordinates)</div>
{stopsNoCoords.map(s=><div key={s.id} style={{fontSize:11,color:"#78716c",padding:"2px 0"}}>{s.stop} — {s.customer}</div>)}
</div>}

{/* Apply button */}
{totalAssigned>0&&<button onClick={applyRoutes}
style={{display:"block",width:"calc(100% - 8px)",margin:"12px 4px",background:"#16a34a",color:"#fff",border:"none",borderRadius:12,padding:"14px",cursor:"pointer",fontSize:15,fontWeight:700,textAlign:"center"}}>
✓ Apply Routes to Manifests
</button>}

{/* Legend */}
<div style={{padding:"12px 8px",margin:"4px 4px 0"}}>
<div style={{fontSize:10,color:"#a8a29e",marginBottom:6}}>MAP LEGEND</div>
<div style={{display:"flex",flexWrap:"wrap",gap:8}}>
{Object.entries(CC).filter(([k])=>k!=="One-Off Delivery"&&k!=="Quote Delivery").map(([name,c])=>(
<div key={name} style={{display:"flex",alignItems:"center",gap:4}}>
<div style={{width:8,height:8,borderRadius:4,background:c.accent}}/>
<span style={{fontSize:10,color:"#78716c"}}>{name}</span>
</div>
))}
</div>
<div style={{display:"flex",gap:8,marginTop:6}}>
{drivers.map((d,di)=>(
<div key={d.id} style={{display:"flex",alignItems:"center",gap:4}}>
<div style={{width:8,height:8,borderRadius:4,background:DCOL[di],border:"2px solid #fff",boxShadow:"0 0 0 1px "+DCOL[di]}}/>
<span style={{fontSize:10,color:"#78716c"}}>{d.name.split(" ")[0]}</span>
</div>
))}
</div>
</div>
</div>
);
}

/* ── DELIVERY LIST ITEM (Add tab — editable instructions) ── */
function DeliveryListItem({stop,rate,note,addr,curInstr,checked,multiSelect,accent,onCheck,onAdd,onSaveInstr}){
const[expanded,setExpanded]=useState(false);
const[instrText,setInstrText]=useState(curInstr||"");
const hasInstr=curInstr?.trim();
return(
<div style={{marginBottom:6}}>
<div style={{display:"flex",width:"100%",textAlign:"left",background:checked?"#eff6ff":"#fff",border:checked?"2px solid #2563eb":"1px solid #e7e5e4",borderRadius:expanded?"12px 12px 0 0":12,padding:"12px 16px",borderLeft:`4px solid ${accent}`,alignItems:"center",gap:10}}>
{multiSelect&&<div onClick={onCheck} style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked?"#2563eb":"#d6d3d1"}`,background:checked?"#2563eb":"#fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700,flexShrink:0,cursor:"pointer"}}>{checked?"✓":""}</div>}
<div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>{if(multiSelect){onCheck();}else{onAdd();}}}>
<div style={{fontSize:14,fontWeight:600}}>{stop}</div>
{addr&&<div style={{fontSize:10,color:"#a8a29e"}}>{addr}</div>}
{note&&<div style={{fontSize:11,color:"#d97706",marginTop:2}}>{note}</div>}
{hasInstr&&!expanded&&<div style={{fontSize:10,color:"#2563eb",marginTop:2}}>📋 {curInstr}</div>}
{!hasInstr&&!expanded&&<div style={{fontSize:9,color:"#d6d3d1",marginTop:2}}>tap 📋 to add instructions</div>}
</div>
<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
<span style={{fontVariantNumeric:"tabular-nums",fontSize:17,fontWeight:700,color:accent}}>{rate?fmt(rate):"Hourly"}</span>
<button onClick={e=>{e.stopPropagation();setInstrText(curInstr||"");setExpanded(!expanded);}} style={{background:hasInstr?"#eff6ff":"#f5f5f4",border:hasInstr?"1px solid #bfdbfe":"1px solid #e7e5e4",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:hasInstr?"#2563eb":"#a8a29e"}}>📋</button>
</div>
</div>
{expanded&&<div style={{padding:"8px 12px 10px",background:"#fff",border:"1px solid #e7e5e4",borderTop:"none",borderRadius:"0 0 12px 12px",borderLeft:`4px solid ${accent}`}}>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Instructions for {stop}</label>
<textarea value={instrText} onChange={e=>setInstrText(e.target.value)} placeholder="Phone #, gate code, dock info, delivery notes…" rows={2}
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
<div style={{display:"flex",gap:6,marginTop:6,justifyContent:"flex-end"}}>
{hasInstr&&<button onClick={()=>{setInstrText("");onSaveInstr("");setExpanded(false);}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear</button>}
<button onClick={()=>setExpanded(false)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Cancel</button>
<button onClick={()=>{onSaveInstr(instrText.trim());setExpanded(false);}} style={{background:"#1c1917",color:"#fff",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:600}}>Save</button>
</div>
</div>}
</div>
);
}

/* ══════════════ DISPATCH APP (owner view) ══════════════ */
function DispatchApp(){
const[wo,setWo]=useState(0);
const[sd,setSd]=useState(()=>{const d=new Date().getDay();return d>=1&&d<=5?d-1:0;});
const[log,setLog]=useState({});
const[view,setView]=useState("manifest");
const[selCust,setSelCust]=useState(null);
const[selStop,setSelStop]=useState(null);
const[emH,setEmH]=useState({});
const[toast,setToast]=useState(null);
const[drivers,setDrivers]=useState([{id:1,name:"Trevor Seyers",phone:"404-394-9891"},{id:2,name:"Brent Dixon",phone:""},{id:3,name:"Trevarr Howard",phone:""}]);
const[showDM,setShowDM]=useState(false);
const[editDrv,setEditDrv]=useState(null);const[editNm,setEditNm]=useState("");const[editPh,setEditPh]=useState("");
const[newDN,setNewDN]=useState("");const[newDP,setNewDP]=useState("");
const[quoteMode,setQuoteMode]=useState(null);
const[showCustomHrs,setShowCustomHrs]=useState(false);const[customHrsInput,setCustomHrsInput]=useState("");
const[insertPickupFor,setInsertPickupFor]=useState(null);
const[pickupCustomer,setPickupCustomer]=useState("");const[pickupStop,setPickupStop]=useState("");const[pickupAddr,setPickupAddr]=useState("");const[pickupForDel,setPickupForDel]=useState("");const[pickupNote,setPickupNote]=useState("");
const[dragSrc,setDragSrc]=useState(null);const[dragOver,setDragOver]=useState(null);
const[showDatePicker,setShowDatePicker]=useState(false);
const[preAssignDriver,setPreAssignDriver]=useState(null);
const[multiSelect,setMultiSelect]=useState(false);const[multiChecked,setMultiChecked]=useState([]);
const[driverViewId,setDriverViewId]=useState(null);
const[customInstr,setCustomInstr]=useState({});
const[showAddCustomDel,setShowAddCustomDel]=useState(false);
const[customDelName,setCustomDelName]=useState("");
const[customDelAddr,setCustomDelAddr]=useState("");
const[customDelRate,setCustomDelRate]=useState("");
const[customDelNote,setCustomDelNote]=useState("");
const[notifyDriver,setNotifyDriver]=useState(null); /* driver id for notify modal */
const[notifyCustomMsg,setNotifyCustomMsg]=useState("");
const[notifications,setNotifications]=useState({}); /* {driverId: [{msg,time,type},...]} */
const[showChat,setShowChat]=useState(false);
const[chatMessages,setChatMessages]=useState([]);
const[chatInput,setChatInput]=useState("");
const[chatLoading,setChatLoading]=useState(false);

const wd=getWeekDates(wo);const dk=`${wo}-${sd}`;const dl=log[dk]||[];
const showToast=useCallback(m=>{setToast(m);setTimeout(()=>setToast(null),2000);},[]);
const firebaseReady=useRef(false);
const skipNextSync=useRef(false);

/* ── FIREBASE SYNC ── */
useEffect(()=>{
  const unsubDrivers=subscribeDrivers((fbDrivers)=>{
    if(fbDrivers.length>0)setDrivers(fbDrivers);
  });
  const unsubEmser=subscribeEmserHours((fbEmH)=>{setEmH(fbEmH);});
  firebaseReady.current=true;
  return()=>{unsubDrivers();unsubEmser();};
},[]);

useEffect(()=>{
  const DAYNAMES=['Mon','Tue','Wed','Thu','Fri'];
  const unsubManifests=subscribeManifests(wo,(fbData)=>{
    if(skipNextSync.current){skipNextSync.current=false;return;}
    const newLog={};
    Object.entries(fbData).forEach(([dayKey,entries])=>{
      const dayAbbr=dayKey.split('-').pop();
      const dayIdx=DAYNAMES.indexOf(dayAbbr);
      if(dayIdx>=0)newLog[`${wo}-${dayIdx}`]=entries;
    });
    setLog(prev=>({...prev,...newLog}));
  });
  return()=>unsubManifests();
},[wo]);

useEffect(()=>{
  if(!firebaseReady.current)return;
  const timer=setTimeout(()=>{
    skipNextSync.current=true;
    saveManifestDay(wo,sd,log[dk]||[]).catch(e=>console.error("Save:",e));
  },500);
  return()=>clearTimeout(timer);
},[log,dk]);

useEffect(()=>{
  if(!firebaseReady.current)return;
  const timer=setTimeout(()=>{saveDrivers(drivers).catch(e=>console.error("Drv save:",e));},500);
  return()=>clearTimeout(timer);
},[drivers]);

useEffect(()=>{
  if(!firebaseReady.current)return;
  const emKey=`${dk}-emser`;
  if(emH[emKey]!==undefined){
    saveEmserHours(emKey,emH[emKey]).catch(e=>console.error("EmH save:",e));
  }
},[emH]);

const addDel=(cust,stop,rate,drvId,ex={})=>{
const cd=CUSTOMERS[cust];
const instrForStop=customInstr[stop]!==undefined?customInstr[stop]:getDefaultInstr(stop);
const entry={id:Date.now()+Math.random(),customer:cust,stop,baseRate:rate,fuelPct:ex.fuelPct||0,isHourly:ex.isHourly||false,note:ex.note||null,driverId:drvId,addr:ex.addr||getAddr(stop),stopType:ex.stopType||"delivery",priority:ex.priority||(cd?.priority)||false,instructions:ex.instructions!==undefined?ex.instructions:instrForStop,status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null};
setLog(p=>({...p,[dk]:[...(p[dk]||[]),entry]}));showToast(`${stop} added`);if(quoteMode)setQuoteMode(null);
};
const addMulti=(cust,stops,drvId)=>{
const cd=CUSTOMERS[cust];
const newEntries=stops.map(s=>{const isStr=typeof s==="string";const stop=isStr?s:s.s;const rate=isStr?0:s.r;const instrForStop=customInstr[stop]!==undefined?customInstr[stop]:getDefaultInstr(stop);
return{id:Date.now()+Math.random(),customer:cust,stop,baseRate:rate,fuelPct:(cd.fuel_surcharge&&!cd.fuel_included)?cd.fuel_surcharge:0,isHourly:cd.rate_type==="hourly",note:isStr?null:s.n||null,driverId:drvId,addr:getAddr(stop),stopType:"delivery",priority:cd.priority||false,instructions:instrForStop,status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null};
});
setLog(p=>({...p,[dk]:[...(p[dk]||[]),...newEntries]}));showToast(`${stops.length} stops added`);setMultiSelect(false);setMultiChecked([]);
};
const rmDel=id=>setLog(p=>({...p,[dk]:(p[dk]||[]).filter(e=>e.id!==id)}));
const reassign=(eid,did)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,driverId:did}:e)}));
const updateInstructions=(eid,text)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,instructions:text}:e)}));
const updateStatus=(eid,status)=>{const now=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,status,arrivedAt:status==="arrived"?now:e.arrivedAt,departedAt:status==="departed"?now:e.departedAt}:e)}));};
const addPhoto=(eid,dataUrl)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),dataUrl]}:e)}));
const addSignature=(eid,dataUrl)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,signature:dataUrl}:e)}));
const setShipPlan=(eid,num)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,shipPlan:num}:e)}));
const setEta=(eid,mins)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,eta:mins}:e)}));

const moveInDriver=(drvId,fromIdx,dir)=>{const toIdx=fromIdx+dir;setLog(p=>{const all=[...(p[dk]||[])];const de=all.filter(e=>e.driverId===drvId);const rest=all.filter(e=>e.driverId!==drvId);if(toIdx<0||toIdx>=de.length)return p;[de[fromIdx],de[toIdx]]=[de[toIdx],de[fromIdx]];return{...p,[dk]:[...rest,...de]};});};
const insertPickup=(drvId,afterIdx)=>{if(!pickupStop)return;const forLabel=pickupForDel?` → ${pickupForDel}`:"";const entry={id:Date.now()+Math.random(),customer:pickupCustomer||"Pickup",stop:`${pickupCustomer||"Pickup"}${forLabel}`,baseRate:0,fuelPct:0,isHourly:false,note:pickupNote||(pickupForDel?`Picking up for ${pickupForDel}`:null),driverId:drvId,addr:pickupAddr||"",stopType:"pickup",priority:false,pickupFrom:pickupStop,pickupFor:pickupForDel,instructions:"",status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null};setLog(p=>{const all=[...(p[dk]||[])];const de=all.filter(e=>e.driverId===drvId);const rest=all.filter(e=>e.driverId!==drvId);de.splice(afterIdx+1,0,entry);return{...p,[dk]:[...rest,...de]};});setInsertPickupFor(null);setPickupCustomer("");setPickupStop("");setPickupAddr("");setPickupForDel("");setPickupNote("");showToast(`Pickup added`);};

const computeDay=key=>{const entries=log[key]||[];let base=0;if(entries.some(e=>e.isHourly))base+=102.50*(emH[`${key}-emser`]||4);const fBC={};entries.forEach(e=>{if(e.isHourly)return;base+=e.baseRate;if(e.fuelPct>0){if(!fBC[e.customer])fBC[e.customer]={pct:e.fuelPct,base:0};fBC[e.customer].base+=e.baseRate;}});let fuel=0;Object.values(fBC).forEach(c=>{fuel+=c.base*c.pct;});return{base,fuel,total:base+fuel,fBC};};
const dc=computeDay(dk);const wkD=DAYS.map((_,i)=>{const k=`${wo}-${i}`;return{entries:log[k]||[],calc:computeDay(k)};});const wkT=wkD.reduce((s,d)=>s+d.calc.total,0);
const wkF={};wkD.forEach(d=>{Object.entries(d.calc.fBC).forEach(([c,cf])=>{if(!wkF[c])wkF[c]={pct:cf.pct,base:0};wkF[c].base+=cf.base;});});

const addDrvr=()=>{if(!newDN.trim()||!newDP.trim()||drivers.length>=4)return;setDrivers(p=>[...p,{id:Date.now(),name:newDN.trim(),phone:newDP.trim()}]);setNewDN("");setNewDP("");};
const saveDrv=id=>{if(!editNm.trim())return;setDrivers(p=>p.map(d=>d.id===id?{...d,name:editNm.trim(),phone:editPh.trim()}:d));setEditDrv(null);};
const rmDrv=id=>{if(drivers.length<=1)return;setDrivers(p=>p.filter(d=>d.id!==id));};
const drvEntries=did=>dl.filter(e=>e.driverId===did);
const handleDrop=(drvId,toIdx)=>{if(!dragSrc||dragSrc.drvId!==drvId||dragSrc.idx===toIdx){setDragSrc(null);setDragOver(null);return;}setLog(p=>{const all=[...(p[dk]||[])];const de=all.filter(e=>e.driverId===drvId);const rest=all.filter(e=>e.driverId!==drvId);const[moved]=de.splice(dragSrc.idx,1);de.splice(toIdx,0,moved);return{...p,[dk]:[...rest,...de]};});setDragSrc(null);setDragOver(null);};
const reorderDriver=(drvId,orderedIds)=>{setLog(p=>{const all=[...(p[dk]||[])];const drvEntries2=all.filter(e=>e.driverId===drvId);const rest=all.filter(e=>e.driverId!==drvId);const ordered=orderedIds.map(id=>drvEntries2.find(e=>e.id===id)).filter(Boolean);const unordered=drvEntries2.filter(e=>!orderedIds.includes(e.id));return{...p,[dk]:[...rest,...ordered,...unordered]};});showToast("Routes applied");};
const getCustColor=cust=>CC[cust]||CC["One-Off Delivery"];

const jumpToDate=dateStr=>{const target=new Date(dateStr+"T12:00:00");const now=new Date();const tD=target.getDay();const tM=new Date(target);tM.setDate(target.getDate()-(tD===0?6:tD-1));const nD=now.getDay();const nM=new Date(now);nM.setDate(now.getDate()-(nD===0?6:nD-1));tM.setHours(0,0,0,0);nM.setHours(0,0,0,0);const diff=Math.round((tM-nM)/(7*24*60*60*1000));const dayIdx=tD===0?6:tD-1;setWo(diff);setSd(Math.min(Math.max(dayIdx,0),4));setShowDatePicker(false);setView("manifest");};

const buildManifestText=drvId=>{const drv=drivers.find(d=>d.id===drvId);const de=drvEntries(drvId);let txt=`DAVIS DELIVERY - ${drv?.name||"Unassigned"}\n${wd[sd].name} ${wd[sd].date}\n${"─".repeat(30)}\n\n`;de.forEach((e,i)=>{txt+=`${i+1}. ${e.stopType==="pickup"?"PICKUP":e.priority?"PRIORITY":"DELIVER"}\n   ${e.stop}\n`;if(e.addr)txt+=`   ${e.addr}\n`;if(e.note)txt+=`   ${e.note}\n`;if(e.instructions)txt+=`   ⚠ ${e.instructions}\n`;if(e.shipPlan)txt+=`   Ship Plan #: ${e.shipPlan}\n`;txt+="\n";});txt+=`${"─".repeat(30)}\nTotal stops: ${de.length}`;return txt;};
const copyManifest=drvId=>{const t=buildManifestText(drvId);navigator.clipboard.writeText(t).then(()=>showToast("Manifest copied")).catch(()=>{const ta=document.createElement("textarea");ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);showToast("Manifest copied");});};
const textManifest=drvId=>{const drv=drivers.find(d=>d.id===drvId);window.open(`sms:${drv?.phone||""}?&body=${encodeURIComponent(buildManifestText(drvId))}`,"_blank");};
const printContent=(title,fn)=>{const w=window.open("","_blank","width=400,height=600");if(!w){showToast("Print blocked here — works when published");return;}w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:'Segoe UI',system-ui,sans-serif;padding:20px;font-size:13px;color:#1c1917}h1{font-size:18px;margin:0 0 4px}h2{font-size:15px;margin:16px 0 8px;border-bottom:1px solid #ccc;padding-bottom:4px}.stop{padding:6px 0;border-bottom:1px dotted #e5e5e5}.addr{font-size:11px;color:#78716c}.note{font-size:11px;color:#a8a29e;font-style:italic}.instr{font-size:12px;color:#2563eb;font-weight:600}@media print{body{padding:10px}}</style></head><body>`);w.document.write(fn());w.document.write("</body></html>");w.document.close();setTimeout(()=>w.print(),300);};
const printManifest=drvId=>{const drv=drivers.find(d=>d.id===drvId);const de=drvEntries(drvId);printContent(`Manifest - ${drv?.name}`,()=>{let h=`<h1>DAVIS DELIVERY DELIVERIES</h1><div style="color:#78716c">${wd[sd].name} — ${wd[sd].date}</div><h2>${drv?.name||"Unassigned"} — ${de.length} stops</h2>`;de.forEach((e,i)=>{const tag=e.stopType==="pickup"?"<b style='color:#1e40af'>[PICKUP]</b> ":e.priority?"<b style='color:#92400e'>[PRIORITY]</b> ":"";h+=`<div class="stop"><b>${i+1}.</b> ${tag}<b>${e.stop}</b><br><span style="color:#78716c;font-size:11px">${e.customer}</span>`;if(e.addr)h+=`<br><span class="addr">${e.addr}</span>`;if(e.note)h+=`<br><span class="note">${e.note}</span>`;if(e.instructions)h+=`<br><span class="instr">📋 ${e.instructions}</span>`;h+=`</div>`;});return h;});};
const printDailyLog=()=>{printContent(`Daily Log`,()=>{let h=`<h1>DAVIS DELIVERY — Daily Log</h1><div style="color:#78716c">${wd[sd].name} — ${wd[sd].date}</div><div style="font-size:16px;font-weight:700;margin:8px 0;color:#16a34a">${fmt(dc.total)}</div>`;dl.forEach(e=>{const drv=drivers.find(d=>d.id===e.driverId);h+=`<div class="stop"><b>${e.customer}</b> — ${e.stop}`;if(drv)h+=` <span style="color:#2563eb;font-size:11px">[${drv.name}]</span>`;h+=`<br>${e.isHourly?"Hourly":fmt(e.baseRate)}`;if(e.addr)h+=`<br><span class="addr">${e.addr}</span>`;if(e.instructions)h+=`<br><span class="instr">📋 ${e.instructions}</span>`;if(e.shipPlan)h+=`<br><b style="color:#ea580c">Ship Plan #: ${e.shipPlan}</b>`;h+=`</div>`;});return h;});};
const printWeekly=()=>{printContent("Weekly",()=>{let h=`<h1>DAVIS DELIVERY — Weekly Summary</h1><div style="font-size:16px;font-weight:700;color:#16a34a">${fmt(wkT)}</div>`;DAYS.forEach((day,i)=>{const{entries,calc}=wkD[i];if(!entries.length)return;h+=`<h2>${day} — ${wd[i].date} ${fmt(calc.total)}</h2>`;entries.forEach(e=>{h+=`<div class="stop">${e.customer} — ${e.stop} ${e.isHourly?"HR":fmt(e.baseRate)}`;if(e.shipPlan)h+=` <b style="color:#ea580c">SP# ${e.shipPlan}</b>`;h+=`</div>`;});});return h;});};

/* ── NOTIFICATIONS ── */
const sendNotification=(drvId,msg,type,viaSms=true)=>{
const now=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
const notif={msg,type,time:now,id:Date.now()};
setNotifications(p=>({...p,[drvId]:[notif,...(p[drvId]||[])]}));
// Save to Firestore for driver to see
sendNotificationToDriver(drvId,msg,type).catch(e=>console.error("Notif save:",e));
const drv=drivers.find(d=>d.id===drvId);
if(viaSms&&drv?.phone){
window.open(`sms:${drv.phone}?&body=${encodeURIComponent("DAVIS DELIVERY DISPATCH\n"+msg)}`,"_blank");
}
showToast(`Sent to ${drv?.name||"driver"}`);
setNotifyDriver(null);setNotifyCustomMsg("");
};

const buildStopDetail=(entry)=>{
let txt=`${entry.stop}`;
if(entry.addr)txt+=`\n📍 ${entry.addr}`;
if(entry.instructions)txt+=`\n📋 ${entry.instructions}`;
if(entry.customer)txt+=`\n🏢 ${entry.customer}`;
return txt;
};

const getRecentStops=(drvId,type,count=1)=>{
const de=drvEntries(drvId);
if(type==="pickup")return de.filter(e=>e.stopType==="pickup").slice(-count);
return de.filter(e=>e.stopType==="delivery").slice(-count);
};

/* ── AI CHAT ── */
const buildSystemPrompt=()=>{
const drvSummary=drivers.map(d=>{const de=drvEntries(d.id);return`${d.name} (id:${d.id}, phone:${d.phone||"none"}): ${de.length} stops — ${de.map((e,i)=>`${i+1}. ${e.stop} (${e.customer}${e.addr?", "+e.addr:""})`).join("; ")||"no stops"}`;}).join("\n");
const unassigned=dl.filter(e=>e.driverId===0);
const uaSummary=unassigned.length?unassigned.map(e=>`${e.stop} (${e.customer})`).join(", "):"none";
const custList=Object.entries(CUSTOMERS).map(([name,cd])=>{
const dels=cd.deliveries.map(d=>typeof d==="string"?d:`${d.s} $${d.r}`).join(", ");
return`${name}: ${cd.rate_type==="hourly"?"$102.50/hr":cd.note}. Pickup: ${cd.pickup}. Deliveries: ${dels}`;
}).join("\n");
return`You are the AI dispatch assistant for Davis Delivery Dispatch & Delivery, a trucking company in Atlanta, GA.
You help the owner manage routes, quote deliveries, optimize stops, and answer questions about the business.

TODAY: ${wd[sd].name} ${wd[sd].date}
WEEK TOTAL: ${fmt(wkT)}
DAY TOTAL: ${fmt(dc.total)}

DRIVERS & CURRENT MANIFESTS:
${drvSummary}

UNASSIGNED STOPS: ${uaSummary}

CONTRACT CUSTOMERS & RATES:
${custList}

QUOTE CUSTOMERS: ${QUOTE_CUSTOMERS.map(q=>q.name).join(", ")}
QUOTE PRICING: ≤10mi=$100, ≤20mi=$150, ≤30mi=$200, ≤40mi=$250, then +$50/10mi. Liftgate +$75 (replaces 15% fuel). Gravel +$25. 4-5 pallets +$25.

You can help with:
- Suggesting optimal route order for a driver's stops
- Calculating quotes for deliveries
- Summarizing the day/week
- Answering questions about customer rates, addresses, instructions
- Drafting invoice summaries
- General dispatch strategy

When suggesting route orders, consider geographic proximity in the Atlanta metro.
Keep responses concise and actionable — the owner is on mobile.
Use dollar amounts with tabular formatting when discussing money.
Never make up addresses or rates — only use data provided above.`;
};

const sendChat=async()=>{
if(!chatInput.trim()||chatLoading)return;
const userMsg={role:"user",content:chatInput.trim()};
const newMessages=[...chatMessages,userMsg];
setChatMessages(newMessages);
setChatInput("");
setChatLoading(true);
try{
const response=await fetch("https://api.anthropic.com/v1/messages",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
model:"claude-sonnet-4-20250514",
max_tokens:1000,
system:buildSystemPrompt(),
messages:newMessages.map(m=>({role:m.role,content:m.content})),
}),
});
const data=await response.json();
const assistantText=data.content?.map(c=>c.type==="text"?c.text:"").join("")||"Sorry, I couldn't process that.";
setChatMessages(prev=>[...prev,{role:"assistant",content:assistantText}]);
}catch(err){
setChatMessages(prev=>[...prev,{role:"assistant",content:"Connection error — this works when deployed to Netlify with API access."}]);
}
setChatLoading(false);
};

/* ── DRIVER VIEW MODE ── */
if(driverViewId){
const drv=drivers.find(d=>d.id===driverViewId);
const de=drvEntries(driverViewId);
return(
<div>
<button onClick={()=>setDriverViewId(null)} style={{position:"fixed",top:12,right:12,zIndex:50,background:"#1c1917",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>← Dispatch View</button>
<DriverView driver={drv} entries={de} dayLabel={`${wd[sd].name} — ${wd[sd].date}`}
onStatusUpdate={updateStatus} onPhotoUpload={addPhoto} onSignature={addSignature} onEta={setEta} onShipPlan={setShipPlan}/>
</div>
);
}

return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#f5f5f4",color:"#1c1917",minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
{toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#16a34a",color:"#fff",padding:"10px 24px",borderRadius:12,fontWeight:600,fontSize:14,zIndex:999,boxShadow:"0 8px 32px rgba(22,163,74,0.3)",animation:"slideDown 0.3s ease"}}>✓ {toast}</div>}

{/* HEADER */}
<div style={{background:"#1c1917",color:"#fff",padding:"16px 20px 12px"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
<div><h1 style={{margin:0,fontSize:20,fontWeight:700}}>DAVIS DELIVERY</h1><p style={{margin:0,fontSize:11,color:"#a8a29e",letterSpacing:"0.08em"}}>DISPATCH & DELIVERY</p></div>
<div style={{display:"flex",gap:8,alignItems:"center"}}>
<button onClick={()=>setShowChat(true)} style={{background:"#d97706",border:"none",color:"#fff",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:12,fontWeight:600}}>AI</button>
<button onClick={()=>setShowDM(true)} style={{background:"#292524",border:"1px solid #44403c",color:"#d6d3d1",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:12,fontWeight:600}}>Drivers</button>
<div style={{background:"#16a34a",color:"#fff",padding:"6px 14px",borderRadius:8,fontSize:13,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{fmt(wkT)}<span style={{fontSize:10,opacity:0.7,marginLeft:3}}>wk</span></div>
</div>
</div>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
<button onClick={()=>setWo(w=>w-1)} style={NB}>◀</button>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:13,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>{wo===0?"This Week":wo===-1?"Last Week":wo===1?"Next Week":`${wo>0?"+":""}${wo}w`}</span>
<button onClick={()=>setShowDatePicker(!showDatePicker)} style={{background:showDatePicker?"#f5f5f4":"#44403c",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:showDatePicker?"#1c1917":"#d6d3d1"}}>📅</button>
{wo!==0&&<button onClick={()=>{setWo(0);setSd(()=>{const d=new Date().getDay();return d>=1&&d<=5?d-1:0;});}} style={{background:"#44403c",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#d6d3d1"}}>Today</button>}
</div>
<button onClick={()=>setWo(w=>w+1)} style={NB}>▶</button>
</div>
{showDatePicker&&<div style={{background:"#292524",borderRadius:10,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,color:"#a8a29e"}}>Jump to:</span><input type="date" onChange={e=>{if(e.target.value)jumpToDate(e.target.value);}} style={{flex:1,background:"#1c1917",border:"1px solid #44403c",borderRadius:8,padding:"8px 12px",color:"#f5f5f4",fontSize:14,outline:"none",colorScheme:"dark"}}/><button onClick={()=>setShowDatePicker(false)} style={{background:"#44403c",border:"none",borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:11,color:"#d6d3d1"}}>✕</button></div>}
<div style={{display:"flex",gap:4}}>
{wd.map((d,i)=>{const cnt=(log[`${wo}-${i}`]||[]).length;return(<button key={i} onClick={()=>{setSd(i);setView("manifest");}} style={{flex:1,border:"none",borderRadius:10,padding:"8px 2px 6px",cursor:"pointer",background:sd===i?"#f5f5f4":"#292524",color:sd===i?"#1c1917":"#78716c"}}><div style={{fontSize:10,fontWeight:600}}>{d.name.slice(0,3).toUpperCase()}</div><div style={{fontSize:11,fontVariantNumeric:"tabular-nums",marginTop:2}}>{d.date}</div>{cnt>0&&<div style={{width:6,height:6,borderRadius:3,background:sd===i?"#1c1917":"#16a34a",margin:"4px auto 0"}}/>}</button>);})}
</div>
</div>

{/* TABS */}
<div style={{display:"flex",gap:5,padding:"12px 16px",background:"#e7e5e4",borderBottom:"1px solid #d6d3d1"}}>
{[{k:"manifest",l:"Manifests"},{k:"routes",l:"Routes"},{k:"daily",l:"Daily"},{k:"weekly",l:"Weekly"},{k:"add",l:"+ Add"}].map(v=>
<button key={v.k} onClick={()=>{setView(v.k);setSelCust(null);setSelStop(null);setQuoteMode(null);setInsertPickupFor(null);setMultiSelect(false);setMultiChecked([]);if(v.k!=="add")setPreAssignDriver(null);}}
style={{flex:1,border:v.k==="add"?"2px solid #16a34a":v.k==="routes"?"2px solid #d97706":"1px solid #d6d3d1",borderRadius:10,padding:"9px 4px",cursor:"pointer",fontSize:12,fontWeight:600,background:view===v.k?(v.k==="add"?"#16a34a":v.k==="routes"?"#d97706":"#1c1917"):"#fff",color:view===v.k?"#fff":v.k==="add"?"#16a34a":v.k==="routes"?"#d97706":"#57534e"}}>{v.l}</button>
)}
</div>

{/* DRIVER MODAL */}
{showDM&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:380}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{margin:0,fontSize:18,fontWeight:700}}>Manage Drivers</h3><button onClick={()=>{setShowDM(false);setEditDrv(null);}} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#78716c"}}>✕</button></div>
{drivers.map((d,i)=><div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f5f5f4"}}>
<div style={{width:12,height:12,borderRadius:4,background:DCOL[i]||"#78716c"}}/>
{editDrv===d.id?<div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
<input value={editNm} onChange={e=>setEditNm(e.target.value)} autoFocus placeholder="Name" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:14,outline:"none"}}/>
<div style={{display:"flex",gap:6}}><input value={editPh} onChange={e=>setEditPh(e.target.value)} placeholder="Phone" onKeyDown={e=>e.key==="Enter"&&saveDrv(d.id)} style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:13,outline:"none"}}/><button onClick={()=>saveDrv(d.id)} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>Save</button></div>
</div>:<>
<div style={{flex:1}}><div style={{fontSize:15,fontWeight:600}}>{d.name}</div>{d.phone&&<div style={{fontSize:11,color:"#78716c"}}>{d.phone}</div>}</div>
<button onClick={()=>{const slug=getDriverSlug(d.name);const url=`${window.location.origin}${window.location.pathname}#/driver/${slug}`;navigator.clipboard.writeText(url).then(()=>showToast(`Link copied for ${d.name}`)).catch(()=>showToast(`Link: #/driver/${slug}`));}} style={{background:"#f0fdf4",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#16a34a"}}>Link</button>
<button onClick={()=>setDriverViewId(d.id)} style={{background:"#eff6ff",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#2563eb"}}>View</button>
<button onClick={()=>{setEditDrv(d.id);setEditNm(d.name);setEditPh(d.phone||"");}} style={{background:"#f5f5f4",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12}}>Edit</button>
{drivers.length>1&&<button onClick={()=>rmDrv(d.id)} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12,color:"#dc2626"}}>✕</button>}
</>}
</div>)}
<div style={{marginTop:12,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px"}}>
<div style={{fontSize:11,fontWeight:700,color:"#16a34a",marginBottom:6}}>DRIVER ACCESS LINKS</div>
<p style={{fontSize:11,color:"#57534e",margin:"0 0 8px"}}>Send these to drivers — they only see their own stops, no pricing.</p>
{drivers.map(d=>{const slug=getDriverSlug(d.name);return(
<div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}>
<span style={{fontSize:12,color:"#1c1917"}}>{d.name}</span>
<code style={{fontSize:10,color:"#16a34a",background:"#dcfce7",padding:"2px 6px",borderRadius:4}}>
#/driver/{slug}
</code>
</div>);})}
<p style={{fontSize:10,color:"#a8a29e",margin:"8px 0 0"}}>Driver PINs = last 4 digits of their phone number</p>
</div>
{drivers.length<4&&<div style={{marginTop:12}}><div style={{display:"flex",gap:6,marginBottom:6}}><input value={newDN} onChange={e=>setNewDN(e.target.value)} placeholder="Driver name" style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:14,outline:"none"}}/></div><div style={{display:"flex",gap:6}}><input value={newDP} onChange={e=>setNewDP(e.target.value)} placeholder="Phone number" type="tel" onKeyDown={e=>e.key==="Enter"&&addDrvr()} style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:14,outline:"none"}}/><button onClick={addDrvr} style={{background:(!newDN.trim()||!newDP.trim())?"#e7e5e4":"#1c1917",color:(!newDN.trim()||!newDP.trim())?"#a8a29e":"#fff",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:600}}>Add</button></div>{newDN.trim()&&!newDP.trim()&&<p style={{fontSize:11,color:"#dc2626",margin:"4px 0 0"}}>Phone required</p>}</div>}
</div>
</div>}

{/* INSERT PICKUP MODAL */}
{insertPickupFor&&(()=>{
const handleSelect=src=>{setPickupCustomer(src.customer);setPickupStop(src.label);setPickupAddr(src.addr);};
const allStops=new Set();Object.values(CUSTOMERS).forEach(cd=>(cd.deliveries||[]).forEach(d=>{allStops.add(typeof d==="string"?d:d.s);}));
const remaining=[...allStops].filter(s=>!SHARED_STOPS.includes(s)&&s!=="Transfer"&&s!=="Drop Ship Liftgate").sort();
return(
<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20,paddingTop:40,overflowY:"auto"}}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:400}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><h3 style={{margin:0,fontSize:18,fontWeight:700}}>Insert Pickup</h3><button onClick={()=>setInsertPickupFor(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#78716c"}}>✕</button></div>
<p style={{fontSize:12,color:"#78716c",margin:"0 0 10px"}}>Tap a customer to auto-fill, or use manual entry.</p>
<div style={{maxHeight:180,overflowY:"auto",marginBottom:12,border:"1px solid #e7e5e4",borderRadius:12,padding:4}}>
{PICKUP_SOURCES.map((src,i)=><button key={i} onClick={()=>handleSelect(src)} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 12px",marginBottom:2,borderRadius:8,cursor:"pointer",background:pickupStop===src.label?"#eff6ff":"#fafaf9",border:pickupStop===src.label?"2px solid #2563eb":"1px solid transparent"}}><div style={{fontSize:13,fontWeight:600}}>{src.label}</div><div style={{fontSize:10,color:"#a8a29e"}}>{src.addr}</div></button>)}
</div>
<details style={{marginBottom:12}}><summary style={{fontSize:13,fontWeight:600,color:"#2563eb",cursor:"pointer",padding:"4px 0"}}>Manual Entry</summary><div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}><input value={pickupCustomer} onChange={e=>setPickupCustomer(e.target.value)} placeholder="Customer" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/><input value={pickupStop} onChange={e=>setPickupStop(e.target.value)} placeholder="Location" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/><input value={pickupAddr} onChange={e=>setPickupAddr(e.target.value)} placeholder="Address" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/></div></details>
{pickupStop&&<div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:6}}>Picking up for</label>
<div style={{fontSize:10,fontWeight:600,color:"#d97706",marginBottom:4}}>Multi-customer stops</div>
<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{SHARED_STOPS.map(s=><button key={s} onClick={()=>setPickupForDel(s)} style={{padding:"5px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:pickupForDel===s?"#16a34a":"#fef3c7",color:pickupForDel===s?"#fff":"#92400e"}}>{s.split(" - ")[0]}</button>)}</div>
<details style={{marginBottom:8}}><summary style={{fontSize:11,fontWeight:600,color:"#57534e",cursor:"pointer"}}>All other ({remaining.length})</summary><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6,maxHeight:120,overflowY:"auto"}}>{remaining.map(s=><button key={s} onClick={()=>setPickupForDel(s)} style={{padding:"4px 8px",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,fontWeight:600,background:pickupForDel===s?"#16a34a":"#e7e5e4",color:pickupForDel===s?"#fff":"#57534e"}}>{s}</button>)}</div></details>
<input value={pickupForDel} onChange={e=>setPickupForDel(e.target.value)} placeholder="Or type manually..." style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/>
</div>}
{pickupStop&&<input value={pickupNote} onChange={e=>setPickupNote(e.target.value)} placeholder="Note (optional)" style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",marginBottom:12}}/>}
{pickupStop&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:12}}><div style={{fontSize:11,color:"#2563eb",fontWeight:600}}>PICKUP</div><div style={{fontSize:14,fontWeight:700}}>{pickupCustomer||"Pickup"}{pickupForDel?` → ${pickupForDel}`:""}</div>{pickupAddr&&<div style={{fontSize:11,color:"#78716c"}}>{pickupAddr}</div>}</div>}
<button onClick={()=>insertPickup(insertPickupFor.driverId,insertPickupFor.afterIdx)} disabled={!pickupStop} style={{display:"block",width:"100%",background:pickupStop?"#2563eb":"#e7e5e4",color:pickupStop?"#fff":"#a8a29e",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:600,cursor:pickupStop?"pointer":"default"}}>Insert Pickup</button>
</div>
</div>
);
})()}

{/* NOTIFY DRIVER MODAL */}
{notifyDriver&&(()=>{
const drv=drivers.find(d=>d.id===notifyDriver);
const di=drivers.findIndex(d=>d.id===notifyDriver);
const de=drvEntries(notifyDriver);
const recentPickups=de.filter(e=>e.stopType==="pickup").slice(-3);
const recentDeliveries=de.filter(e=>e.stopType!=="pickup").slice(-3);
const drvNotifs=notifications[notifyDriver]||[];
return(
<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20,paddingTop:40,overflowY:"auto"}}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:400}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<div style={{width:28,height:28,borderRadius:8,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:700}}>{drv?.name?.charAt(0)}</div>
<div><h3 style={{margin:0,fontSize:16,fontWeight:700}}>Notify {drv?.name}</h3>
<div style={{fontSize:10,color:"#78716c"}}>{drv?.phone||"No phone"} • via SMS{drv?.phone?"":" (unavailable)"}</div></div>
</div>
<button onClick={()=>setNotifyDriver(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#78716c"}}>✕</button>
</div>

{/* Quick presets */}
<div style={{fontSize:11,fontWeight:700,color:"#57534e",marginBottom:8,textTransform:"uppercase"}}>Quick Messages</div>
<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>

<button onClick={()=>sendNotification(notifyDriver,"🔄 RETURN TO YARD\nHead back to base when current stop is complete.","return")}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"2px solid #dc2626",background:"#fef2f2",cursor:"pointer"}}>
<span style={{fontSize:20}}>🔄</span>
<div><div style={{fontSize:13,fontWeight:700,color:"#dc2626"}}>Return to Yard</div><div style={{fontSize:10,color:"#78716c"}}>Head back to base</div></div>
</button>

<button onClick={()=>sendNotification(notifyDriver,"📞 CALL DISPATCH\nCall dispatch ASAP.","call")}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"1px solid #e7e5e4",background:"#fafaf9",cursor:"pointer"}}>
<span style={{fontSize:20}}>📞</span>
<div><div style={{fontSize:13,fontWeight:700}}>Call Dispatch</div><div style={{fontSize:10,color:"#78716c"}}>Driver needs to call in</div></div>
</button>

<button onClick={()=>sendNotification(notifyDriver,"⏰ SCHEDULE CHANGE\nCheck your manifest — stop times have been updated.","schedule")}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"1px solid #e7e5e4",background:"#fafaf9",cursor:"pointer"}}>
<span style={{fontSize:20}}>⏰</span>
<div><div style={{fontSize:13,fontWeight:700}}>Schedule Change</div><div style={{fontSize:10,color:"#78716c"}}>Stop times updated</div></div>
</button>

<button onClick={()=>sendNotification(notifyDriver,"⚠️ MANIFEST UPDATED\nYour route has been changed. Check your manifest for updates.\n\nCurrent stops: "+de.length,"update")}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"1px solid #e7e5e4",background:"#fafaf9",cursor:"pointer"}}>
<span style={{fontSize:20}}>⚠️</span>
<div><div style={{fontSize:13,fontWeight:700}}>Manifest Updated</div><div style={{fontSize:10,color:"#78716c"}}>General route change alert</div></div>
</button>
</div>

{/* Pickup notification with auto-attached details */}
{recentPickups.length>0&&<>
<div style={{fontSize:11,fontWeight:700,color:"#2563eb",marginBottom:6,textTransform:"uppercase"}}>New Pickup Added</div>
<div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:12}}>
{recentPickups.map(p=>(
<button key={p.id} onClick={()=>sendNotification(notifyDriver,
"📦 NEW PICKUP ADDED\n"+buildStopDetail(p)+(p.instructions?"\n⚠ "+p.instructions:""),
"pickup")}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"10px 14px",borderRadius:10,border:"2px solid #2563eb",background:"#eff6ff",cursor:"pointer"}}>
<span style={{fontSize:18}}>📦</span>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:12,fontWeight:700,color:"#2563eb"}}>Pickup: {p.stop}</div>
{p.addr&&<div style={{fontSize:10,color:"#78716c",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.addr}</div>}
{p.instructions&&<div style={{fontSize:10,color:"#1c1917"}}>📋 {p.instructions}</div>}
<div style={{fontSize:9,color:"#a8a29e"}}>{p.customer}</div>
</div>
</button>
))}
</div>
</>}

{/* Delivery notification with auto-attached details */}
{recentDeliveries.length>0&&<>
<div style={{fontSize:11,fontWeight:700,color:"#16a34a",marginBottom:6,textTransform:"uppercase"}}>New Delivery Added</div>
<div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:12}}>
{recentDeliveries.map(p=>(
<button key={p.id} onClick={()=>sendNotification(notifyDriver,
"🚚 NEW DELIVERY ADDED\n"+buildStopDetail(p)+(p.instructions?"\n⚠ "+p.instructions:""),
"delivery")}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"10px 14px",borderRadius:10,border:"2px solid #16a34a",background:"#f0fdf4",cursor:"pointer"}}>
<span style={{fontSize:18}}>🚚</span>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:12,fontWeight:700,color:"#16a34a"}}>Deliver: {p.stop}</div>
{p.addr&&<div style={{fontSize:10,color:"#78716c",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.addr}</div>}
{p.instructions&&<div style={{fontSize:10,color:"#1c1917"}}>📋 {p.instructions}</div>}
<div style={{fontSize:9,color:"#a8a29e"}}>{p.customer}</div>
</div>
</button>
))}
</div>
</>}

{/* Custom message */}
<div style={{fontSize:11,fontWeight:700,color:"#57534e",marginBottom:6,textTransform:"uppercase"}}>Custom Message</div>
<div style={{display:"flex",gap:6}}>
<textarea value={notifyCustomMsg} onChange={e=>setNotifyCustomMsg(e.target.value)} placeholder="Type a message…" rows={2}
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
<button onClick={()=>{if(notifyCustomMsg.trim())sendNotification(notifyDriver,notifyCustomMsg.trim(),"custom");}} disabled={!notifyCustomMsg.trim()}
style={{alignSelf:"flex-end",background:notifyCustomMsg.trim()?"#1c1917":"#e7e5e4",color:notifyCustomMsg.trim()?"#fff":"#a8a29e",border:"none",borderRadius:10,padding:"10px 16px",cursor:notifyCustomMsg.trim()?"pointer":"default",fontSize:13,fontWeight:600}}>Send</button>
</div>

{/* Recent notifications sent */}
{drvNotifs.length>0&&<div style={{marginTop:16}}>
<div style={{fontSize:11,fontWeight:700,color:"#a8a29e",marginBottom:6,textTransform:"uppercase"}}>Sent Today</div>
<div style={{maxHeight:120,overflowY:"auto"}}>
{drvNotifs.map(n=>(
<div key={n.id} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"6px 0",borderBottom:"1px solid #f5f5f4"}}>
<span style={{fontSize:10,color:"#a8a29e",fontVariantNumeric:"tabular-nums",flexShrink:0,marginTop:2}}>{n.time}</span>
<div style={{fontSize:11,color:"#57534e",whiteSpace:"pre-wrap",lineHeight:1.3}}>{n.msg.length>80?n.msg.slice(0,80)+"…":n.msg}</div>
</div>
))}
</div>
</div>}
</div>
</div>
);
})()}

<div style={{padding:"0 16px 100px"}}>

{/* ═══ MANIFESTS ═══ */}
{view==="manifest"&&<div
onDragEnd={()=>{setDragSrc(null);setDragOver(null);}}
onTouchMove={e=>{
if(!dragSrc)return;
const touch=e.touches[0];
const els=document.querySelectorAll(`[data-drv="${dragSrc.drvId}"]`);
els.forEach(el=>{
const rect=el.getBoundingClientRect();
if(touch.clientY>=rect.top&&touch.clientY<=rect.bottom){
const idx=parseInt(el.getAttribute("data-idx"));
if(!isNaN(idx))setDragOver({drvId:dragSrc.drvId,idx});
}
});
}}
onTouchEnd={()=>{
if(dragSrc&&dragOver&&dragSrc.drvId===dragOver.drvId&&dragSrc.idx!==dragOver.idx){
handleDrop(dragSrc.drvId,dragOver.idx);
}else{setDragSrc(null);setDragOver(null);}
}}>
<div style={{padding:"16px 4px 8px"}}><h2 style={{margin:0,fontSize:16,fontWeight:600}}>Load Manifests — {wd[sd].name}</h2><p style={{margin:"4px 0 0",fontSize:12,color:"#78716c"}}>Grab ⠿ to drag and reorder. Tap stop to add instructions.</p></div>
{drivers.map((drv,di)=>{const de=drvEntries(drv.id);return(
<div key={drv.id} style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:16,marginBottom:12}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:de.length?10:0}}>
<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:14,height:14,borderRadius:4,background:DCOL[di]}}/><span style={{fontSize:15,fontWeight:700}}>{drv.name}</span><span style={{fontSize:12,color:"#a8a29e"}}>({de.length})</span></div>
<div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"flex-end"}}>
{de.length>0&&<><button onClick={()=>printManifest(drv.id)} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#57534e"}}>Print</button><button onClick={()=>copyManifest(drv.id)} style={{background:"#dcfce7",border:"none",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#16a34a"}}>Copy</button><button onClick={()=>textManifest(drv.id)} style={{background:"#dbeafe",border:"none",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#2563eb"}}>Text</button></>}
<button onClick={()=>setInsertPickupFor({driverId:drv.id,afterIdx:-1})} style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#2563eb"}}>+ Pickup</button>
<button onClick={()=>{setPreAssignDriver(drv.id);setView("add");setSelCust(null);setSelStop(null);setQuoteMode(null);}} style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#16a34a"}}>+ Delivery</button>
<button onClick={()=>setDriverViewId(drv.id)} style={{background:"#f3e8f9",border:"1px solid #d8b4fe",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#7c3aed"}}>Driver View</button>
<button onClick={()=>{setNotifyDriver(drv.id);setNotifyCustomMsg("");}} style={{background:"#fef3c7",border:"1px solid #fde68a",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#92400e"}}>Notify</button>
</div>
</div>
{de.length===0&&<p style={{fontSize:13,color:"#a8a29e",margin:"8px 0 0"}}>No stops</p>}
{de.map((entry,eIdx)=><div key={entry.id}>
<ManifestStop entry={entry} eIdx={eIdx} total={de.length} drivers={drivers} onMove={dir=>moveInDriver(drv.id,eIdx,dir)} onReassign={did=>reassign(entry.id,did)} onRemove={()=>rmDel(entry.id)} onUpdateInstructions={text=>updateInstructions(entry.id,text)} onShipPlan={val=>setShipPlan(entry.id,val)}
isDragging={dragSrc?.drvId===drv.id&&dragSrc?.idx===eIdx} isDragOver={dragOver?.drvId===drv.id&&dragOver?.idx===eIdx} onDragStart={()=>setDragSrc({drvId:drv.id,idx:eIdx})} onDragOver={()=>setDragOver({drvId:drv.id,idx:eIdx})} onDrop={()=>handleDrop(drv.id,eIdx)}/>
<button onClick={()=>setInsertPickupFor({driverId:drv.id,afterIdx:eIdx})} style={{display:"block",width:"100%",background:"none",border:"1px dashed #bfdbfe",borderRadius:6,padding:"3px",cursor:"pointer",fontSize:10,color:"#93c5fd",marginBottom:4,textAlign:"center"}}>+ insert pickup here</button>
</div>)}
</div>);})}
{(()=>{const ua=dl.filter(e=>e.driverId===0);if(!ua.length)return null;return(<div style={{background:"#fff",border:"2px dashed #d6d3d1",borderRadius:14,padding:16,marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:14,height:14,borderRadius:4,background:"#a8a29e"}}/><span style={{fontSize:15,fontWeight:700,color:"#78716c"}}>Unassigned</span><span style={{fontSize:12,color:"#a8a29e"}}>({ua.length})</span></div>{ua.map((entry,eIdx)=><ManifestStop key={entry.id} entry={entry} eIdx={eIdx} total={ua.length} drivers={drivers} onMove={dir=>moveInDriver(0,eIdx,dir)} onReassign={did=>reassign(entry.id,did)} onRemove={()=>rmDel(entry.id)} onUpdateInstructions={text=>updateInstructions(entry.id,text)} onShipPlan={val=>setShipPlan(entry.id,val)}/>)}</div>);})()}
</div>}

{/* ═══ ROUTES ═══ */}
{view==="routes"&&<div>
{dl.length===0?<div style={{textAlign:"center",padding:"48px 20px",color:"#a8a29e"}}><div style={{fontSize:48,marginBottom:12}}>🗺️</div><p style={{fontSize:16,fontWeight:600,margin:"0 0 8px"}}>No stops to route</p><p style={{fontSize:13,margin:0}}>Add deliveries first via the + Add tab,<br/>then come here to build routes on the map.</p></div>
:<RouteBuilder entries={dl} drivers={drivers}
onAssign={(eid,did)=>reassign(eid,did)}
onReorder={(drvId,orderedIds)=>reorderDriver(drvId,orderedIds)}
onBack={()=>setView("manifest")}/>}
</div>}

{/* ═══ DAILY ═══ */}
{view==="daily"&&<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 4px 8px"}}><h2 style={{margin:0,fontSize:16,fontWeight:600}}>{wd[sd].name} — {wd[sd].date}</h2><div style={{display:"flex",alignItems:"center",gap:8}}>{dl.length>0&&<button onClick={printDailyLog} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600,color:"#57534e"}}>Print</button>}<span style={{fontVariantNumeric:"tabular-nums",fontSize:15,fontWeight:700,color:"#16a34a"}}>{fmt(dc.total)}</span></div></div>
{dl.some(e=>e.isHourly)&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:"12px 16px",marginBottom:12}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,color:"#2563eb",fontWeight:600}}>Emser Hours</span><span style={{fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{fmt(102.50*(emH[`${dk}-emser`]||4))}</span></div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:"#64748b",fontVariantNumeric:"tabular-nums"}}>{emH[`${dk}-emser`]||4}h x $102.50</span><div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>{[4,5,6,7,8,9,10].map(h=><button key={h} onClick={()=>{setEmH(p=>({...p,[`${dk}-emser`]:h}));setShowCustomHrs(false);}} style={{width:30,height:30,borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:!showCustomHrs&&(emH[`${dk}-emser`]||4)===h?"#2563eb":"#e7e5e4",color:!showCustomHrs&&(emH[`${dk}-emser`]||4)===h?"#fff":"#78716c"}}>{h}</button>)}<button onClick={()=>setShowCustomHrs(!showCustomHrs)} style={{height:30,borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,padding:"0 8px",background:showCustomHrs?"#2563eb":"#dbeafe",color:showCustomHrs?"#fff":"#2563eb"}}>Other</button></div></div>
{showCustomHrs&&<div style={{display:"flex",gap:6,alignItems:"center",marginTop:8}}><input value={customHrsInput} onChange={e=>setCustomHrsInput(e.target.value)} placeholder="e.g. 4.5" type="number" step="0.25" min="1" style={{width:80,border:"1px solid #bfdbfe",borderRadius:8,padding:"6px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center",background:"#fff"}}/><span style={{fontSize:12,color:"#64748b"}}>hrs</span><button onClick={()=>{const v=parseFloat(customHrsInput);if(v>0){setEmH(p=>({...p,[`${dk}-emser`]:v}));setShowCustomHrs(false);setCustomHrsInput("");}}} style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Set</button></div>}
</div>}
{dl.length===0?<div style={{textAlign:"center",padding:"48px 20px",color:"#a8a29e"}}><div style={{fontSize:36,marginBottom:12}}>🚚</div><p style={{fontSize:14,margin:0}}>No deliveries logged</p></div>:<>
{dl.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di=drivers.findIndex(d=>d.id===entry.driverId);const isImetco=entry.customer==="IMETCO";return(
<div key={entry.id} style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:"12px 16px",marginBottom:8,borderLeft:`4px solid ${entry.priority?"#f59e0b":entry.stopType==="pickup"?"#2563eb":c.accent}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div style={{flex:1}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
<span style={{fontSize:11,fontWeight:600,color:c.accent,textTransform:"uppercase"}}>{entry.customer}</span>
{entry.stopType==="pickup"&&<span style={{fontSize:9,background:"#2563eb",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PICKUP</span>}
{entry.priority&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PRIORITY</span>}
<span style={{fontSize:10,background:drv?(DCOL[di]||"#78716c"):"#a8a29e",color:"#fff",padding:"1px 6px",borderRadius:4,fontWeight:600}}>{drv?.name||"Unassigned"}</span>
</div>
<div style={{fontSize:14,fontWeight:600}}>{entry.stop}</div>
{entry.addr&&<div style={{fontSize:11,color:"#78716c",marginTop:1}}>{entry.addr}</div>}
{entry.instructions&&<div style={{fontSize:11,color:"#2563eb",marginTop:2}}>📋 {entry.instructions}</div>}
</div>
<div style={{textAlign:"right",marginLeft:12}}>
<div style={{fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{entry.isHourly?"Hourly":fmt(entry.baseRate)}</div>
<button onClick={()=>rmDel(entry.id)} style={{background:"none",border:"none",color:"#dc2626",fontSize:11,cursor:"pointer",padding:"4px 0 0",opacity:0.7}}>Remove</button>
</div>
</div>
{isImetco&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:11,fontWeight:700,color:"#ea580c",flexShrink:0}}>Ship Plan #:</span>
<input value={entry.shipPlan||""} onChange={e=>setShipPlan(entry.id,e.target.value)} placeholder="Enter #"
style={{flex:1,border:entry.shipPlan?"1px solid #bbf7d0":"1px solid #fca5a5",borderRadius:8,padding:"6px 10px",fontSize:13,fontWeight:700,outline:"none",background:entry.shipPlan?"#f0fdf4":"#fff7ed",textAlign:"center"}}/>
</div>}
</div>);})}
{Object.keys(dc.fBC).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:"14px 16px",marginTop:12}}><div style={{fontSize:12,fontWeight:700,color:"#d97706",textTransform:"uppercase",marginBottom:8}}>Fuel Surcharges</div>{Object.entries(dc.fBC).map(([cu,cf])=><div key={cu} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:13}}>{cu} <span style={{fontSize:11,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base)} x {Math.round(cf.pct*100)}%</span></span><span style={{fontSize:14,fontWeight:700,color:"#d97706",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base*cf.pct)}</span></div>)}</div>}
<div style={{display:"flex",justifyContent:"space-between",padding:"16px 4px 0",borderTop:"2px solid #bbf7d0",marginTop:16}}><span style={{fontSize:15,fontWeight:700,color:"#57534e"}}>Day Total</span><span style={{fontSize:20,fontWeight:700,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(dc.total)}</span></div>
</>}
</div>}

{/* ═══ WEEKLY ═══ */}
{view==="weekly"&&<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 4px 12px"}}><h2 style={{margin:0,fontSize:16,fontWeight:600}}>Weekly Summary</h2><div style={{display:"flex",alignItems:"center",gap:8}}><button onClick={printWeekly} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600,color:"#57534e"}}>Print</button><span style={{fontVariantNumeric:"tabular-nums",fontSize:18,fontWeight:700,color:"#16a34a"}}>{fmt(wkT)}</span></div></div>
{DAYS.map((day,i)=>{const{entries,calc}=wkD[i];const wk2=`${wo}-${i}`;if(!entries.length)return null;return(<div key={day} style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",padding:"8px 4px",borderBottom:"1px solid #e7e5e4"}}><span style={{fontSize:14,fontWeight:700}}>{day} — {wd[i].date}</span><span style={{fontVariantNumeric:"tabular-nums",fontWeight:700,color:"#16a34a",fontSize:14}}>{fmt(calc.total)}</span></div>{entries.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di2=drivers.findIndex(d=>d.id===entry.driverId);const isImetco=entry.customer==="IMETCO";return(<div key={entry.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 8px 6px 16px",borderLeft:`3px solid ${c.accent}`,marginTop:4,background:"#fff",borderRadius:isImetco?"0 8px 0 0":"0 8px 8px 0"}}><div style={{display:"flex",alignItems:"center",gap:4,flex:1,minWidth:0}}><span style={{fontSize:11,color:c.accent,fontWeight:600}}>{entry.customer}</span><span style={{fontSize:12,color:"#57534e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.stop}</span>{drv&&<span style={{fontSize:9,background:DCOL[di2]||"#78716c",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:600,flexShrink:0}}>{drv.name.charAt(0)}</span>}</div><span style={{fontVariantNumeric:"tabular-nums",fontSize:12,fontWeight:600,color:"#44403c",flexShrink:0,marginLeft:4}}>{entry.isHourly?"HR":fmt(entry.baseRate)}</span></div>
{isImetco&&<div style={{padding:"4px 8px 6px 16px",borderLeft:`3px solid ${c.accent}`,background:"#fff",borderRadius:"0 0 8px 0",display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:10,fontWeight:700,color:"#ea580c",flexShrink:0}}>SP#:</span>
<input value={entry.shipPlan||""} onChange={e=>{const eid=entry.id;const val=e.target.value;setLog(p=>({...p,[wk2]:(p[wk2]||[]).map(en=>en.id===eid?{...en,shipPlan:val}:en)}));}} placeholder="—"
style={{width:80,border:"1px solid #e7e5e4",borderRadius:6,padding:"3px 6px",fontSize:11,fontWeight:700,outline:"none",background:entry.shipPlan?"#f0fdf4":"#fff",textAlign:"center"}}/>
</div>}
</div>);})}</div>);})}
{wkD.every(d=>!d.entries.length)&&<div style={{textAlign:"center",padding:"48px 20px",color:"#a8a29e"}}><p>No deliveries this week</p></div>}
{Object.keys(wkF).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:"14px 16px",marginBottom:12}}><div style={{fontSize:12,fontWeight:700,color:"#d97706",textTransform:"uppercase",marginBottom:8}}>Week Fuel</div>{Object.entries(wkF).map(([cu,cf])=><div key={cu} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:13}}>{cu} <span style={{fontSize:11,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base)} x {Math.round(cf.pct*100)}%</span></span><span style={{fontSize:14,fontWeight:700,color:"#d97706",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base*cf.pct)}</span></div>)}</div>}
</div>}

{/* ═══ ADD ═══ */}
{view==="add"&&!selCust&&!quoteMode&&<div>
{preAssignDriver&&(()=>{const drv=drivers.find(d=>d.id===preAssignDriver);const di=drivers.findIndex(d=>d.id===preAssignDriver);return(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",margin:"12px 0 8px",background:"#f0fdf4",border:`2px solid ${DCOL[di]||"#16a34a"}`,borderRadius:12}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:8,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:700}}>{drv?.name?.charAt(0)}</div><div><div style={{fontSize:13,fontWeight:700}}>Adding for {drv?.name}</div><div style={{fontSize:10,color:"#16a34a"}}>Auto-assigned</div></div></div><button onClick={()=>setPreAssignDriver(null)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,color:"#57534e"}}>Clear</button></div>);})()}
<h2 style={{margin:0,fontSize:16,fontWeight:600,padding:"16px 4px 8px"}}>Contract Customers</h2>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
{Object.keys(CUSTOMERS).map(cust=>{const c=CC[cust];const cd=CUSTOMERS[cust];return(<button key={cust} onClick={()=>setSelCust(cust)} style={{background:c.bg,border:"none",borderRadius:14,padding:"16px 14px",cursor:"pointer",textAlign:"left",position:"relative"}}>{cd.priority&&<span style={{position:"absolute",top:8,right:8,fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:4,fontWeight:700}}>PRIORITY</span>}<div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{cust}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:4}}>{cd.rate_type==="hourly"?"$102.50/hr":`from ${cd.pickup}`}</div></button>);})}
</div>
<h2 style={{margin:0,fontSize:16,fontWeight:600,padding:"0 4px 8px"}}>Quote Customers</h2>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
{QUOTE_CUSTOMERS.map(qc=><button key={qc.name} onClick={()=>setQuoteMode(qc)} style={{background:"#78350f",border:"none",borderRadius:14,padding:"16px 14px",cursor:"pointer",textAlign:"left"}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{qc.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:4}}>{qc.pickups.map(p=>p.label).join(" / ")}</div></button>)}
</div>
<button onClick={()=>setQuoteMode({name:"One-Off Delivery",pickups:[]})} style={{display:"block",width:"calc(100% - 8px)",margin:"0 4px",background:"#374151",border:"none",borderRadius:14,padding:"18px 14px",cursor:"pointer",textAlign:"left"}}><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>New Customer / One-Off</div><div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:4}}>Mileage calculator + add-ons</div></button>
</div>}

{/* ═══ ADD — Delivery List ═══ */}
{view==="add"&&selCust&&<div>
<button onClick={()=>{setSelCust(null);setMultiSelect(false);setMultiChecked([]);setShowAddCustomDel(false);}} style={BB}>← Back</button>
{preAssignDriver&&(()=>{const drv=drivers.find(d=>d.id===preAssignDriver);const di=drivers.findIndex(d=>d.id===preAssignDriver);return(<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",margin:"0 4px 8px",background:"#f0fdf4",border:`1px solid ${DCOL[di]||"#bbf7d0"}`,borderRadius:10}}><div style={{width:20,height:20,borderRadius:6,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>{drv?.name?.charAt(0)}</div><span style={{fontSize:12,fontWeight:600,color:"#16a34a"}}>Auto-adding to {drv?.name}</span></div>);})()}
<div style={{padding:"0 4px"}}>
<h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:700,color:CC[selCust].accent}}>{selCust}</h2>
<p style={{margin:"0 0 4px",fontSize:12,color:"#78716c"}}>{CUSTOMERS[selCust].noteHighlight?<>{CUSTOMERS[selCust].note.split("**"+CUSTOMERS[selCust].noteHighlight+"**")[0]}<span style={{background:"#fef3c7",color:"#92400e",fontWeight:700,padding:"1px 6px",borderRadius:4,border:"1px solid #fde68a"}}>{CUSTOMERS[selCust].noteHighlight}</span>{CUSTOMERS[selCust].note.split("**"+CUSTOMERS[selCust].noteHighlight+"**")[1]}</>:CUSTOMERS[selCust].note}</p>
{CUSTOMERS[selCust].priority&&<p style={{margin:"0 0 4px",fontSize:12,color:"#f59e0b",fontWeight:600}}>⚡ {CUSTOMERS[selCust].priorityNote||"Priority"}</p>}
</div>
{CUSTOMERS[selCust].fuel_surcharge&&!CUSTOMERS[selCust].fuel_included&&<p style={{fontSize:12,color:"#d97706",margin:"0 4px 8px",padding:"8px 12px",background:"#fffbeb",borderRadius:8,borderLeft:"3px solid #d97706"}}>⛽ {Math.round(CUSTOMERS[selCust].fuel_surcharge*100)}% fuel added separately</p>}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px",marginBottom:8}}>
<button onClick={()=>{setMultiSelect(!multiSelect);setMultiChecked([]);}} style={{background:multiSelect?"#2563eb":"#e7e5e4",color:multiSelect?"#fff":"#57534e",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>
{multiSelect?"Cancel Multi-Select":"Select Multiple"}
</button>
{multiSelect&&multiChecked.length>0&&<button onClick={()=>{const stops=CUSTOMERS[selCust].deliveries.filter((_,i)=>multiChecked.includes(i));addMulti(selCust,stops,preAssignDriver||0);}} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>Add {multiChecked.length} stops</button>}
</div>
{CUSTOMERS[selCust].roundTrip&&<button onClick={()=>{const cd=CUSTOMERS[selCust];addDel(selCust,CUSTOMERS[selCust].roundTrip.label,CUSTOMERS[selCust].roundTrip.rate,preAssignDriver||0,{fuelPct:(cd.fuel_surcharge&&!cd.fuel_included)?cd.fuel_surcharge:0,priority:cd.priority});}} style={{display:"block",width:"100%",textAlign:"left",background:"#fef3c7",border:"2px solid #fbbf24",borderRadius:12,padding:"14px 16px",marginBottom:12,cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:700,color:"#92400e"}}>🔄 {CUSTOMERS[selCust].roundTrip.label}</div></div><span style={{fontVariantNumeric:"tabular-nums",fontSize:17,fontWeight:700,color:"#ea580c"}}>{fmt(CUSTOMERS[selCust].roundTrip.rate)}</span></div></button>}
{CUSTOMERS[selCust].deliveries.map((d,idx)=>{const isStr=typeof d==="string";const stop=isStr?d:d.s;const rate=isStr?0:d.r;const note=isStr?null:d.n;const addr=getAddr(stop);const curInstr=customInstr[stop]!==undefined?customInstr[stop]:getDefaultInstr(stop);const checked=multiChecked.includes(idx);
return(<DeliveryListItem key={idx} stop={stop} rate={rate} note={note} addr={addr} curInstr={curInstr} checked={checked} multiSelect={multiSelect} accent={CC[selCust].accent}
onCheck={()=>setMultiChecked(p=>p.includes(idx)?p.filter(x=>x!==idx):[...p,idx])}
onAdd={()=>{const cd=CUSTOMERS[selCust];addDel(selCust,stop,rate||0,preAssignDriver||0,{isHourly:cd.rate_type==="hourly",fuelPct:(cd.fuel_surcharge&&!cd.fuel_included)?cd.fuel_surcharge:0,note:note||null,addr,priority:cd.priority});}}
onSaveInstr={text=>setCustomInstr(p=>({...p,[stop]:text}))}
/>);})}
{/* Add new delivery location for this customer */}
{!showAddCustomDel?<button onClick={()=>{setShowAddCustomDel(true);setCustomDelName("");setCustomDelAddr("");setCustomDelRate("");setCustomDelNote("");}} style={{display:"block",width:"100%",marginTop:8,background:"#fafaf9",border:"2px dashed #d6d3d1",borderRadius:12,padding:"14px 16px",cursor:"pointer",textAlign:"center",color:"#78716c",fontSize:13,fontWeight:600}}>+ Add New Delivery Location</button>
:<div style={{marginTop:8,background:"#fff",border:`2px solid ${CC[selCust].accent}`,borderRadius:14,padding:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<span style={{fontSize:13,fontWeight:700,color:CC[selCust].accent}}>New {selCust} Delivery</span>
<button onClick={()=>setShowAddCustomDel(false)} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#78716c"}}>✕</button>
</div>
<div style={{display:"flex",flexDirection:"column",gap:8}}>
<input value={customDelName} onChange={e=>setCustomDelName(e.target.value)} placeholder="Stop name (e.g. Smith Flooring - Kennesaw)" autoFocus
style={{border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:14,outline:"none"}}/>
<input value={customDelAddr} onChange={e=>setCustomDelAddr(e.target.value)} placeholder="Full address"
style={{border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:13,outline:"none"}}/>
<div style={{display:"flex",gap:8}}>
<div style={{flex:1}}>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Rate ($)</label>
<input value={customDelRate} onChange={e=>setCustomDelRate(e.target.value)} placeholder={CUSTOMERS[selCust].rate_type==="hourly"?"Hourly":"0.00"} type="number" step="0.01"
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:14,fontWeight:700,outline:"none"}}/>
</div>
<div style={{flex:1}}>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Note (optional)</label>
<input value={customDelNote} onChange={e=>setCustomDelNote(e.target.value)} placeholder="Gate code, hours…"
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:13,outline:"none"}}/>
</div>
</div>
<button onClick={()=>{
if(!customDelName.trim())return;
const cd=CUSTOMERS[selCust];
const rate=parseFloat(customDelRate)||0;
addDel(selCust,customDelName.trim(),rate,preAssignDriver||0,{
isHourly:cd.rate_type==="hourly",
fuelPct:(cd.fuel_surcharge&&!cd.fuel_included)?cd.fuel_surcharge:0,
note:customDelNote.trim()||null,
addr:customDelAddr.trim(),
priority:cd.priority,
});
setShowAddCustomDel(false);setCustomDelName("");setCustomDelAddr("");setCustomDelRate("");setCustomDelNote("");
}} disabled={!customDelName.trim()}
style={{background:customDelName.trim()?CC[selCust].accent:"#e7e5e4",color:customDelName.trim()?"#fff":"#a8a29e",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:600,cursor:customDelName.trim()?"pointer":"default"}}>
Add {customDelName.trim()||"Delivery"} to {selCust}
</button>
</div>
</div>}
</div>}

{/* ═══ QUOTE BUILDER ═══ */}
{view==="add"&&quoteMode&&<QuoteBuilder customerName={quoteMode.name} pickupOptions={quoteMode.pickups} onAdd={addDel} onBack={()=>setQuoteMode(null)} drivers={drivers} drvEntries={drvEntries}/>}
</div>

{/* ═══ AI CHAT DRAWER ═══ */}
{showChat&&<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column"}}>
<div onClick={()=>setShowChat(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
<div style={{position:"relative",marginTop:"auto",background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column",zIndex:1}}>
{/* Chat header */}
<div style={{padding:"16px 20px 12px",borderBottom:"1px solid #e7e5e4",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<div style={{width:36,height:36,borderRadius:12,background:"linear-gradient(135deg, #d97706, #ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🤖</div>
<div><div style={{fontSize:15,fontWeight:700}}>Dispatch AI</div><div style={{fontSize:10,color:"#78716c"}}>Knows your routes, rates & customers</div></div>
</div>
<button onClick={()=>setShowChat(false)} style={{background:"#f5f5f4",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:14,color:"#78716c"}}>✕</button>
</div>

{/* Chat messages */}
<div style={{flex:1,overflowY:"auto",padding:"16px 16px 8px",display:"flex",flexDirection:"column",gap:10,minHeight:200,maxHeight:"55vh"}}>
{chatMessages.length===0&&<div style={{textAlign:"center",padding:"32px 16px",color:"#a8a29e"}}>
<div style={{fontSize:32,marginBottom:8}}>🤖</div>
<p style={{fontSize:14,fontWeight:600,margin:"0 0 8px",color:"#57534e"}}>What can I help with?</p>
<div style={{display:"flex",flexDirection:"column",gap:6}}>
{["Optimize Trevor's route","Summarize today's revenue","Quote 25 miles to Woodstock","What's Specialty's rate to DCO Tech?"].map((s,i)=>
<button key={i} onClick={()=>{setChatInput(s);}} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:10,padding:"10px 14px",cursor:"pointer",fontSize:12,fontWeight:500,color:"#57534e",textAlign:"left"}}>{s}</button>
)}
</div>
</div>}
{chatMessages.map((msg,i)=>(
<div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start"}}>
<div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:msg.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:msg.role==="user"?"#1c1917":"#f5f5f4",color:msg.role==="user"?"#fff":"#1c1917",fontSize:13,lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
{msg.content}
</div>
</div>
))}
{chatLoading&&<div style={{display:"flex",justifyContent:"flex-start"}}>
<div style={{padding:"10px 14px",borderRadius:"14px 14px 14px 4px",background:"#f5f5f4",fontSize:13,color:"#a8a29e"}}>
<span style={{animation:"pulse 1s infinite"}}>Thinking…</span>
</div>
</div>}
</div>

{/* Chat input */}
<div style={{padding:"8px 16px 20px",borderTop:"1px solid #e7e5e4",display:"flex",gap:8,flexShrink:0}}>
<input value={chatInput} onChange={e=>setChatInput(e.target.value)}
onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
placeholder="Ask about routes, quotes, revenue…"
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:12,padding:"12px 16px",fontSize:14,outline:"none",background:"#fafaf9",fontFamily:"inherit"}}/>
<button onClick={sendChat} disabled={!chatInput.trim()||chatLoading}
style={{background:chatInput.trim()&&!chatLoading?"#d97706":"#e7e5e4",color:chatInput.trim()&&!chatLoading?"#fff":"#a8a29e",border:"none",borderRadius:12,padding:"12px 16px",cursor:chatInput.trim()&&!chatLoading?"pointer":"default",fontSize:14,fontWeight:700,flexShrink:0}}>
{chatLoading?"…":"↑"}
</button>
</div>
</div>
</div>}

<style>{`@keyframes slideDown{from{transform:translate(-50%,-20px);opacity:0}to{transform:translate(-50%,0);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}button:active{transform:scale(0.97)}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}select{-webkit-appearance:none}`}</style>
</div>
);
}

/* ══════════════ STANDALONE DRIVER PAGE ══════════════ */
/* No pricing. No other drivers. No dispatch controls. Just their stops. */
function DriverPage({driverSlug}){
const[wo]=useState(0);
const[sd]=useState(()=>{const d=new Date().getDay();return d>=1&&d<=5?d-1:0;});
const[log,setLog]=useState({});
const[toast,setToast]=useState(null);
const[pinEntry,setPinEntry]=useState("");
const[authenticated,setAuthenticated]=useState(false);
const getPin=(phone)=>{const digits=(phone||"").replace(/\D/g,"");return digits.length>=4?digits.slice(-4):"0000";};
const[sigStop,setSigStop]=useState(null);
const[shipPlanInputs,setShipPlanInputs]=useState({});
const[allDrivers,setAllDrivers]=useState([{id:1,name:"Trevor Seyers",phone:"404-394-9891"},{id:2,name:"Brent Dixon",phone:""},{id:3,name:"Trevarr Howard",phone:""}]);
const[driverNotifs,setDriverNotifs]=useState([]);

const wd=getWeekDates(wo);const dk=`${wo}-${sd}`;const dl=log[dk]||[];
const showToast=useCallback(m=>{setToast(m);setTimeout(()=>setToast(null),2000);},[]);

/* Resolve driver from slug */
const driverId=DRIVER_SLUGS[driverSlug];
const driver=allDrivers.find(d=>d.id===driverId);
const entries=dl.filter(e=>e.driverId===driverId);

/* Firebase sync for driver page */
useEffect(()=>{
  const unsubDrivers=subscribeDrivers((fbDrivers)=>{
    if(fbDrivers.length>0)setAllDrivers(fbDrivers);
  });
  const DAYNAMES=['Mon','Tue','Wed','Thu','Fri'];
  const unsubManifests=subscribeManifests(wo,(fbData)=>{
    const newLog={};
    Object.entries(fbData).forEach(([dayKey,ents])=>{
      const dayAbbr=dayKey.split('-').pop();
      const dayIdx=DAYNAMES.indexOf(dayAbbr);
      if(dayIdx>=0)newLog[`${wo}-${dayIdx}`]=ents;
    });
    setLog(prev=>({...prev,...newLog}));
  });
  return()=>{unsubDrivers();unsubManifests();};
},[wo]);

/* Subscribe to notifications for this driver */
useEffect(()=>{
  if(!driverId)return;
  const unsub=subscribeNotifications(driverId,(notifs)=>{setDriverNotifs(notifs);});
  return()=>unsub();
},[driverId]);

/* Request push permission after auth */
useEffect(()=>{
  if(authenticated&&driverId){
    requestPushPermission().then(token=>{
      if(token)saveDriverToken(driverId,token);
    });
  }
},[authenticated,driverId]);

/* Save driver status updates back to Firestore */
const saveDriverLog=useCallback((newLog)=>{
  const entries2=newLog[dk]||[];
  saveManifestDay(wo,sd,entries2).catch(e=>console.error("Driver save:",e));
},[dk,wo,sd]);

const updateStatus=(eid,status)=>{const now=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,status,arrivedAt:status==="arrived"?now:e.arrivedAt,departedAt:status==="departed"?now:e.departedAt}:e)};saveDriverLog(n);return n;});};
const addPhoto=(eid,dataUrl)=>setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),dataUrl]}:e)};saveDriverLog(n);return n;});
const addSignature=(eid,sig)=>setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,signature:sig}:e)};saveDriverLog(n);return n;});
const setShipPlanD=(eid,num)=>setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,shipPlan:num}:e)};saveDriverLog(n);return n;});
const setEtaD=(eid,mins)=>setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,eta:mins}:e)};saveDriverLog(n);return n;});

if(!driver){
return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#1c1917",color:"#fff",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:40}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<h1 style={{fontSize:24,fontWeight:700,margin:"0 0 8px"}}>DAVIS DELIVERY</h1>
<p style={{color:"#a8a29e",fontSize:14,margin:0}}>Driver not found</p>
<p style={{color:"#78716c",fontSize:12,marginTop:12}}>Check your link or contact dispatch</p>
</div>
);
}

/* PIN screen — simple gate before showing route */
if(!authenticated){
return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#1c1917",color:"#fff",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<div style={{textAlign:"center",width:"100%",maxWidth:320}}>
<h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px"}}>DAVIS DELIVERY</h1>
<p style={{color:"#a8a29e",fontSize:11,letterSpacing:"0.08em",margin:"0 0 32px"}}>DRIVER ACCESS</p>
<div style={{width:56,height:56,borderRadius:16,background:"#292524",margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,color:"#16a34a"}}>{driver.name.charAt(0)}</div>
<p style={{fontSize:16,fontWeight:600,margin:"0 0 24px"}}>{driver.name}</p>
<p style={{fontSize:13,color:"#78716c",margin:"0 0 12px"}}>Enter your PIN</p>
<div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16}}>
{[0,1,2,3].map(i=>(
<div key={i} style={{width:48,height:56,borderRadius:12,border:`2px solid ${pinEntry.length>i?"#16a34a":"#44403c"}`,background:"#292524",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,color:"#fff"}}>{pinEntry[i]?"•":""}</div>
))}
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,maxWidth:240,margin:"0 auto"}}>
{[1,2,3,4,5,6,7,8,9,null,0,"⌫"].map((n,i)=>(
<button key={i} onClick={()=>{
if(n===null)return;
if(n==="⌫"){setPinEntry(p=>p.slice(0,-1));return;}
const next=pinEntry+n;
if(next.length<=4)setPinEntry(next);
if(next.length===4){
if(getPin(driver.phone)===next){setAuthenticated(true);}
else{setPinEntry("");showToast("Wrong PIN");}
}
}} style={{height:52,borderRadius:12,border:"none",background:n===null?"transparent":"#292524",color:"#fff",fontSize:20,fontWeight:600,cursor:n===null?"default":"pointer",opacity:n===null?0:1}}>
{n==="⌫"?"←":n}
</button>
))}
</div>
{toast&&<div style={{marginTop:20,background:"#dc2626",color:"#fff",padding:"8px 16px",borderRadius:8,fontSize:13,fontWeight:600}}>✕ {toast}</div>}
{!driver.phone&&<p style={{fontSize:12,color:"#fca5a5",marginTop:20}}>No phone number on file — contact dispatch to set one up</p>}
{driver.phone&&<p style={{fontSize:11,color:"#57534e",marginTop:24}}>PIN is the last 4 digits of your phone number</p>}
</div>
</div>
);
}

/* Authenticated — show driver manifest (NO pricing) */
const completed=entries.filter(e=>e.status==="departed").length;
const total=entries.length;
const isImetcoReturn=(e)=>e.customer==="IMETCO"&&(e.stop.includes("to IMETCO")||e.stop.includes("Round Trip"));
const needsShipPlan=(e)=>e.customer==="IMETCO";

return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#f5f5f4",color:"#1c1917",minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
{toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#16a34a",color:"#fff",padding:"10px 24px",borderRadius:12,fontWeight:600,fontSize:14,zIndex:999,boxShadow:"0 8px 32px rgba(22,163,74,0.3)",animation:"slideDown 0.3s ease"}}>✓ {toast}</div>}

<div style={{background:"#1c1917",color:"#fff",padding:"16px 20px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<h1 style={{margin:0,fontSize:20,fontWeight:700}}>DAVIS DELIVERY</h1>
<p style={{margin:"2px 0 0",fontSize:11,color:"#a8a29e",letterSpacing:"0.08em"}}>DRIVER MANIFEST</p>
</div>
<button onClick={()=>{setAuthenticated(false);setPinEntry("");}} style={{background:"#292524",border:"1px solid #44403c",color:"#a8a29e",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11}}>Lock</button>
</div>
</div>

<div style={{padding:"16px 16px 0"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<div>
<h2 style={{margin:0,fontSize:18,fontWeight:700}}>{driver.name}</h2>
<p style={{margin:0,fontSize:13,color:"#78716c"}}>{wd[sd].name} — {wd[sd].date}</p>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:22,fontWeight:700,color:"#16a34a"}}>{completed}/{total}</div>
<div style={{fontSize:11,color:"#78716c"}}>completed</div>
</div>
</div>
<div style={{height:6,background:"#e7e5e4",borderRadius:3,marginBottom:16,overflow:"hidden"}}>
<div style={{height:"100%",background:"#16a34a",borderRadius:3,width:`${total?completed/total*100:0}%`,transition:"width 0.3s"}}/>
</div>
</div>

{/* Driver notifications from dispatch */}
{driverNotifs.filter(n=>!n.read).length>0&&<div style={{padding:"0 16px",marginBottom:4}}>
{driverNotifs.filter(n=>!n.read).slice(0,3).map(n=>(
<div key={n.id} style={{background:"#fef3c7",border:"1px solid #fde68a",borderRadius:10,padding:"10px 14px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
<div style={{flex:1}}>
<div style={{fontSize:12,fontWeight:700,color:"#92400e"}}>📢 Dispatch</div>
<div style={{fontSize:12,color:"#1c1917",whiteSpace:"pre-wrap",marginTop:2}}>{n.message}</div>
<div style={{fontSize:10,color:"#a8a29e",marginTop:4}}>{n.time}</div>
</div>
<button onClick={()=>markNotificationRead(n.id)} style={{background:"#f59e0b",color:"#fff",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,flexShrink:0}}>Got it</button>
</div>
))}
</div>}

{total===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"#a8a29e"}}><div style={{fontSize:48,marginBottom:12}}>🚚</div><p style={{fontSize:16,fontWeight:600,margin:"0 0 4px"}}>No stops yet</p><p style={{fontSize:13,margin:0}}>Dispatch hasn't loaded your manifest yet.<br/>Pull down to refresh.</p></div>}

<div style={{padding:"0 16px 100px"}}>
{entries.map((entry,i)=>{
const c=CC[entry.customer]||CC["One-Off Delivery"];
const addr=entry.addr||getAddr(entry.stop);
const isPickup=entry.stopType==="pickup";
const arrived=entry.status==="arrived"||entry.status==="departed";
const departed=entry.status==="departed";
const isReturn=isImetcoReturn(entry);
const wantsShipPlan=needsShipPlan(entry);
const shipVal=shipPlanInputs[entry.id]||entry.shipPlan||"";
const canDepart=isReturn?!!shipVal.trim():true;
return(
<div key={entry.id} style={{background:"#fff",border:`1px solid ${departed?"#bbf7d0":arrived?"#fde68a":"#e7e5e4"}`,borderRadius:14,padding:"14px 16px",marginBottom:10,borderLeft:`4px solid ${departed?"#16a34a":arrived?"#f59e0b":isPickup?"#2563eb":c.accent}`,opacity:departed?0.7:1}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
<span style={{fontSize:13,fontWeight:700,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>{i+1}.</span>
{isPickup&&<span style={{fontSize:9,background:"#2563eb",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PICKUP</span>}
{entry.priority&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PRIORITY</span>}
{departed&&<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>DONE</span>}
{arrived&&!departed&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>ON SITE</span>}
{wantsShipPlan&&<span style={{fontSize:9,background:"#ea580c",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>SHIP PLAN REQ</span>}
</div>
<div style={{fontSize:16,fontWeight:700,color:"#1c1917",marginBottom:2}}>{entry.stop}</div>
{/* Customer name shown but NO pricing */}
<div style={{fontSize:12,color:c.accent,fontWeight:600}}>{entry.customer}</div>
{addr&&<a href={`https://maps.google.com/?q=${encodeURIComponent(addr)}`} target="_blank" rel="noopener" onClick={e=>e.stopPropagation()}
style={{fontSize:12,color:"#2563eb",textDecoration:"underline",display:"block",marginTop:2}}>{addr}</a>}
{entry.instructions&&<div style={{fontSize:12,color:"#1c1917",background:"#eff6ff",padding:"6px 10px",borderRadius:8,marginTop:6}}>📋 {entry.instructions}</div>}
{/* IMETCO Ship Plan # input */}
{wantsShipPlan&&arrived&&!departed&&(
<div style={{marginTop:8,background:isReturn?"#fef2f2":"#fff7ed",border:isReturn?"2px solid #fca5a5":"1px solid #fed7aa",borderRadius:10,padding:"10px 12px"}}>
<label style={{fontSize:11,fontWeight:700,color:isReturn?"#dc2626":"#ea580c",display:"block",marginBottom:6}}>
{isReturn?"⚠ REQUIRED: Enter Ship Plan # before departing":"Ship Plan # (if available)"}
</label>
<input value={shipVal} onChange={e=>{setShipPlanInputs(p=>({...p,[entry.id]:e.target.value}));}} placeholder="Enter Ship Plan #"
style={{width:"100%",border:isReturn&&!shipVal.trim()?"2px solid #dc2626":"1px solid #d6d3d1",borderRadius:8,padding:"10px 12px",fontSize:15,fontWeight:700,outline:"none",textAlign:"center",background:"#fff"}}/>
{isReturn&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:8,background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"8px 10px"}}>
<span style={{fontSize:18}}>📸</span>
<span style={{fontSize:12,fontWeight:600,color:"#92400e"}}>Remember to photograph the BOL</span>
</div>}
{shipVal.trim()&&<button onClick={()=>{setShipPlanD(entry.id,shipVal.trim());showToast("Ship Plan # saved");}} style={{display:"block",width:"100%",marginTop:6,background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"8px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Save Ship Plan #</button>}
</div>
)}
{entry.shipPlan&&<div style={{marginTop:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"6px 12px"}}><span style={{fontSize:10,color:"#16a34a",fontWeight:600}}>Ship Plan #:</span> <span style={{fontSize:14,fontWeight:700}}>{entry.shipPlan}</span></div>}
{/* NO note shown — notes often contain pricing info */}
{addr&&<a href={`https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`} target="_blank" rel="noopener"
style={{display:"inline-flex",alignItems:"center",gap:6,background:"#1c1917",color:"#fff",border:"none",borderRadius:10,padding:"10px 16px",cursor:"pointer",fontSize:13,fontWeight:600,marginTop:8,textDecoration:"none",width:"100%",justifyContent:"center"}}>
🧭 Get Directions
</a>}
{entry.arrivedAt&&<div style={{fontSize:10,color:"#16a34a",marginTop:6}}>Arrived: {entry.arrivedAt}</div>}
{entry.departedAt&&<div style={{fontSize:10,color:"#16a34a"}}>Departed: {entry.departedAt}</div>}
{entry.eta&&<div style={{fontSize:10,color:"#2563eb"}}>ETA to next: {entry.eta} min</div>}
<div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
{!arrived&&<button onClick={()=>{updateStatus(entry.id,"arrived");showToast("Arrived ✓");}} style={{flex:1,background:"#f59e0b",color:"#fff",border:"none",borderRadius:10,padding:"10px",cursor:"pointer",fontSize:13,fontWeight:600}}>Arrived</button>}
{arrived&&!departed&&<button onClick={()=>{if(!canDepart)return;updateStatus(entry.id,"departed");showToast("Departed ✓");}} style={{flex:1,background:canDepart?"#16a34a":"#a8a29e",color:"#fff",border:"none",borderRadius:10,padding:"10px",cursor:canDepart?"pointer":"not-allowed",fontSize:13,fontWeight:600}}>{canDepart?"Departed":"Enter Ship Plan # First"}</button>}
{arrived&&(
<div style={{display:"flex",gap:6,width:"100%",marginTop:4}}>
<input placeholder="ETA mins" type="number" defaultValue={entry.eta||""} style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:13,outline:"none"}}
onBlur={e=>{if(e.target.value)setEtaD(entry.id,e.target.value);}}/>
<label style={{display:"flex",alignItems:"center",gap:4,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#2563eb"}}>
📷 Photo
<input type="file" accept="image/*" capture="environment" style={{display:"none"}}
onChange={e=>{if(e.target.files[0]){const r=new FileReader();r.onload=ev=>addPhoto(entry.id,ev.target.result);r.readAsDataURL(e.target.files[0]);}}}/>
</label>
<button onClick={()=>setSigStop(entry.id)} style={{background:"#f3e8f9",border:"1px solid #d8b4fe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#7c3aed"}}>✍ Sign</button>
</div>
)}
</div>
{entry.photos&&entry.photos.length>0&&(
<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
{entry.photos.map((p,pi)=><img key={pi} src={p} alt="delivery" style={{width:60,height:60,objectFit:"cover",borderRadius:8,border:"1px solid #e7e5e4"}}/>)}
</div>
)}
{entry.signature&&<div style={{marginTop:8,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 12px"}}><span style={{fontSize:10,color:"#16a34a",fontWeight:600}}>Received by:</span> <span style={{fontSize:14,fontWeight:700}}>{entry.signature}</span></div>}
{sigStop===entry.id&&<div style={{marginTop:8}}><SignaturePad onSave={d=>{addSignature(entry.id,d);setSigStop(null);showToast("Signature saved");}} onCancel={()=>setSigStop(null)}/></div>}
</div>
);
})}
</div>
<style>{`@keyframes slideDown{from{transform:translate(-50%,-20px);opacity:0}to{transform:translate(-50%,0);opacity:1}}button:active{transform:scale(0.97)}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}`}</style>
</div>
);
}

/* ══════════════ ROUTER — export default ══════════════ */
export default function App(){
const hash=useHashRoute();

/* Check for driver route: #/driver/trevor, #/driver/brent, #/driver/trevarr */
const driverMatch=hash.match(/^#\/driver\/([a-z]+)$/i);
if(driverMatch){
const slug=driverMatch[1].toLowerCase();
return <DriverPage driverSlug={slug}/>;
}

/* Default: full dispatch app */
return <DispatchApp/>;
}
