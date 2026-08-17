import { MULTI_PICKUP } from "./pickupConfig.js";
/* manifestLogic.js — pure, side-effect-free manifest data logic.

   Extracted from App.jsx so it can be unit-tested in isolation (App.jsx loads
   Firebase from a CDN at import time and can't run under a test runner). This
   module is also the seam the planned per-entry storage migration will grow
   into: every rule about how two writers' versions of a day reconcile lives
   here, as plain functions of their inputs. No React, no window, no Firebase. */

/* Repair colliding / null ids DETERMINISTICALLY and — critically —
   INDEPENDENTLY OF ARRAY ORDER. The old scheme folded the array index into the
   synthetic id (and used "first occurrence in array order keeps the original
   id"). That was only deterministic if every device held the entries in the
   same order; the dispatcher preserves a manual order that differs from
   Firebase/the driver's, so two devices repairing the same colliding pair
   produced DIFFERENT ids → the id-keyed save merge then duplicated and
   cross-merged stops. Ids are now a pure function of the entry MULTISET
   (content + occurrence), never position, so every device agrees. */
export const dedupeIds=(entries)=>{
  if(!Array.isArray(entries))return entries;
  const idKey=(e)=>e.id==null?" null":String(e.id);
  const idCount=new Map();
  entries.forEach(e=>{if(e)idCount.set(idKey(e),(idCount.get(idKey(e))||0)+1);});
  const hashStr=(s)=>{let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h+s.charCodeAt(i))|0;}return Math.abs(h).toString(36);};
  const occ=new Map();
  let changed=false;
  const out=entries.map((e)=>{
    if(!e)return e;
    const k=idKey(e);
    if(e.id!=null&&idCount.get(k)===1)return e; /* unique, non-null → keep */
    changed=true;
    const basis=[e.customer||"",e.stop||"",e.addr||"",e.stopType||"",e.driverId||0,e.loadNum||1].join("|");
    const ck=k+"|"+basis;
    const n=occ.get(ck)||0;occ.set(ck,n+1);
    return{...e,id:"d_"+hashStr(ck)+"_"+n.toString(36)};
  });
  return changed?out:entries;
};

/* Collapse semantically-duplicate AUTO pickups. An auto-pickup is uniquely
   identified by (customer, stop, driverId, loadNum). Keeps the FIRST occurrence
   of each identity, drops unassigned (driverId 0) auto-pickups, and never
   touches deliveries or manual pickups. */
export const dedupeAutoPickups=(entries,opts)=>{
  if(!Array.isArray(entries))return entries;
  /* Key on the NORMALIZED dock, not the raw stop string. The same physical
     pickup dock is stored under drifting formats across the dataset ("Emser -
     Norcross", "Emser – Norcross", "Emser Tile — Norcross"), so a raw-string key
     let 2-3 copies of the same dock survive as "distinct" — the duplicate
     pickup-card bug. normLoc collapses them, matching how reapOrphanAutoPickups,
     rebuildPickupsFor and the load-order note already key. With no opts it falls
     back to a lowercased raw string (back-compatible with existing callers). */
  const normLoc=opts&&typeof opts.normLoc==="function"?opts.normLoc:(s)=>String(s||"").trim().toLowerCase();
  const dock=(e)=>normLoc(e.pickupFrom)||normLoc(e.stop);
  const seen=new Set();
  let changed=false;
  const out=entries.filter(e=>{
    if(!e||e.stopType!=="pickup"||e.manualPickup)return true;
    if(!e.driverId||e.driverId===0){changed=true;return false;}
    const key=[e.customer||"",dock(e),e.driverId,e.loadNum||1].join("|");
    if(seen.has(key)){changed=true;return false;}
    seen.add(key);
    return true;
  });
  return changed?out:entries;
};

/* Collapse a GHOST duplicate delivery: the same order present both ASSIGNED
   (driverId>0) and UNASSIGNED (driverId 0). entrySig keys on driverId, so a
   reassign race — dispatcher moves a stop to a driver while a stale Firebase
   snapshot still has it unassigned — reads as two different stops; the merge's
   delivery safety-net then re-appends the unassigned copy, and computeDay bills
   both (inflating the day total and the fuel surcharge). Drop the driverId-0
   copy ONLY when an assigned delivery with the same (customer, stop, loadNum,
   baseRate) exists. Deliberately narrow so it can never remove:
     - two distinct routed orders (both assigned)     -> different driverId path, kept
     - a genuine lone unassigned order (no assigned twin) -> kept
     - a split's load-2 half (driverId 0, baseRate 0)  -> baseRate differs from the
       full assigned stop, and it lives on its own loadNum -> kept
   Pickups and manual pickups are never touched. */
export const dedupeGhostDeliveries=(entries)=>{
  if(!Array.isArray(entries))return entries;
  const key=(e)=>[e.customer||"",e.stop||"",e.loadNum||1,e.baseRate||0].join("|");
  const assigned=new Set();
  entries.forEach(e=>{if(e&&e.stopType==="delivery"&&e.driverId>0)assigned.add(key(e));});
  if(!assigned.size)return entries;
  let changed=false;
  const out=entries.filter(e=>{
    if(!e||e.stopType!=="delivery"||e.driverId||e.wasSplit)return true; /* keep non-deliveries, assigned, split halves */
    if(assigned.has(key(e))){changed=true;return false;}                 /* unassigned ghost of an assigned stop → drop */
    return true;
  });
  return changed?out:entries;
};

/* ── The all-in billed rate ──────────────────────────────────────────────────
   `baseRate` is stored FEE-EXCLUSIVE by convention: `liftgateFee` (almost
   always $75) is a separate field, added on top whenever `liftgateApplied` is
   true and the entry isn't hourly (hourly liftgate time is billed through the
   separate Emser-hours system, not baseRate). Every live rate control in the
   app displays and edits this combined total — a sweep found 11 other places
   that had drifted to reading baseRate alone, silently dropping the fee on
   every printed/exported document and revenue rollup. These two functions are
   the single source of truth going forward; every read AND every write of an
   entry's rate should route through them so the convention can't drift apart
   again. The `||75` fallback also means a legacy/corrupted record — one with
   liftgateApplied:true but liftgateFee missing or 0 — SELF-HEALS the moment it
   is read, with no data migration required. */
export const allInRate=(entry)=>{
  if(!entry)return 0;
  const lg=entry.liftgateApplied&&!entry.isHourly?(entry.liftgateFee||75):0;
  return (entry.baseRate||0)+lg;
};

/* Inverse of allInRate. Rate-edit controls show/collect the all-in total; this
   strips the liftgate portion back out before writing baseRate. Uses the SAME
   ||75 fallback as allInRate so a read immediately followed by a write can
   never disagree — that asymmetry (display falls back to 75, save fell back to
   0) was the exact mechanism behind a real compounding-overcharge bug. */
export const stripLiftgateFee=(allInTotal,entry)=>{
  const lg=entry&&entry.liftgateApplied&&!entry.isHourly?(entry.liftgateFee||75):0;
  return Math.max(0,(parseFloat(allInTotal)||0)-lg);
};

/* Collapse DUPLICATE DELIVERIES — the same order rendered as 2+ rows under
   different ids. Root cause (verified): split/rebuild mint fresh ids for one
   logical order, and re-entering the full weight/rate makes the copies overlap;
   nothing then collapses two ASSIGNED deliveries that share their identity. This
   is the general collapse the model was missing.

   Two deliveries are the SAME order (and collapse) iff they match on
   (customer, stop, addr, driverId, loadNum, weight, baseRate) — same order, same
   driver+load, same weight AND rate. That key is deliberately strict:
   - loadNum in the key means an IN-PROGRESS split (halves on Load 1 vs Load 2)
     is never collapsed — only copies that have drifted onto the SAME load are;
   - weight+rate in the key means two genuinely-different orders (different weight
     or rate) are never merged;
   - a differing non-empty refNum or shipPlan is an explicit "these are distinct
     orders" signal and vetoes the collapse for that group.
   The survivor is the copy with the most driver progress, then the lowest id
   (deterministic across devices). It INHERITS every driver-stamp from the whole
   group (status forward-only, arrived/departed, signature, shipPlan, and the
   union of real photos) so no POD, timestamp, or rate is ever lost. */
export const dedupeDeliveries=(entries)=>{
  if(!Array.isArray(entries))return entries;
  const RANK={departed:3,arrived:2,pending:1};
  const rank=(e)=>RANK[e&&e.status]||0;
  const key=(e)=>[e.customer||"",e.stop||"",e.addr||"",e.driverId||0,e.loadNum||1,e.weight||0,e.baseRate||0].join("|");
  const groups=new Map();
  entries.forEach(e=>{
    if(!e||e.stopType!=="delivery")return;
    const k=key(e);
    if(!groups.has(k))groups.set(k,[]);
    groups.get(k).push(e);
  });
  const drop=new Set();     /* ids removed */
  const survPatch=new Map(); /* survivor id -> merged entry */
  groups.forEach(list=>{
    if(list.length<2)return;
    /* explicit distinct-order signals veto the merge */
    const refs=new Set(list.map(e=>String(e.refNum||"").trim()).filter(Boolean));
    const sps=new Set(list.map(e=>String(e.shipPlan||"").trim()).filter(Boolean));
    if(refs.size>1||sps.size>1)return;
    /* Collapse only with a real duplication SIGNAL, never merge two distinct
       line items: a shared non-zero weight (distinct shipments have distinct
       measured weights, so an exact match means one physical order) OR a split
       lineage. Two identical UNWEIGHTED deliveries could be two real orders, so
       they are left alone. (weight is in the group key, so it's shared here.) */
    const sharedWeight=Number(list[0].weight)||0;
    if(sharedWeight<=0&&!list.some(e=>e.wasSplit))return;
    const survivor=list.slice().sort((a,b)=>rank(b)-rank(a)||String(a.id).localeCompare(String(b.id)))[0];
    const merged={...survivor};
    const photos=[];const seenP=new Set();
    const addPhotos=(arr)=>{(arr||[]).forEach(p=>{const isReal=typeof p==="string"&&(p.startsWith("https://")||p.startsWith("data:"));if(isReal&&!seenP.has(p)){seenP.add(p);photos.push(p);}});};
    addPhotos(survivor.photos);
    list.forEach(e=>{
      if((RANK[e.status]||0)>(RANK[merged.status]||0))merged.status=e.status;
      if(!merged.arrivedAt&&e.arrivedAt)merged.arrivedAt=e.arrivedAt;
      if(!merged.departedAt&&e.departedAt)merged.departedAt=e.departedAt;
      if((!merged.signature||merged.signature==="signed")&&e.signature)merged.signature=e.signature;
      if(!merged.shipPlan&&e.shipPlan)merged.shipPlan=e.shipPlan;
      if(!merged.eta&&e.eta){merged.eta=e.eta;merged.etaDest=e.etaDest;merged.etaSetAt=e.etaSetAt;}
      if(!merged.pickupDueBy&&e.pickupDueBy)merged.pickupDueBy=e.pickupDueBy;
      if(!merged.dueBy&&e.dueBy)merged.dueBy=e.dueBy;
      /* A liftgate charge is never lost in a merge — forward-only, same as
         every other field above. Two copies of the same order can diverge on
         liftgate status alone (the toggle mutates an entry in place and never
         touches baseRate, so it can't affect which copies group together
         above); if the chosen survivor doesn't have it but a dropped
         duplicate does, that $75 must not silently vanish. */
      if(e.liftgateApplied&&!merged.liftgateApplied){merged.liftgateApplied=true;merged.liftgateFee=e.liftgateFee||merged.liftgateFee||75;}
      if(e.id!==survivor.id)addPhotos(e.photos);
    });
    if(photos.length)merged.photos=photos;
    survPatch.set(survivor.id,merged);
    list.forEach(e=>{if(e.id!==survivor.id)drop.add(e.id);});
  });
  if(!drop.size)return entries;
  return entries.filter(e=>!(e&&drop.has(e.id))).map(e=>(e&&survPatch.has(e.id))?survPatch.get(e.id):e);
};

/* Reap ORPHANED auto-pickups. An auto-pickup is DERIVED data — it exists only
   because rebuildPickupsFor generated it from ≥1 same-customer delivery on the
   same (driver, load). Several mutation paths historically removed deliveries
   without re-running the rebuild (or without tombstoning the removed pickup, so
   the save merge resurrected it from Firebase) — leaving a pickup card on a
   driver whose deliveries are gone, with a stale "Load order" note. Rather than
   chase every caller forever, enforce the invariant here: an auto-pickup with
   NO matching delivery (same customer, same driverId, same loadNum) is dropped.
   Manual pickups and deliveries are never touched. Safe to run at every
   merge/ingest: rebuildPickupsFor only ever creates pickups where matching
   deliveries exist, so a legitimate pickup can never be reaped. */
/* opts (optional): { multiSource(customer)->bool, normLoc(str)->str }. Supplied
   by App.jsx from MULTI_PICKUP/_normLoc. Multi-source suppliers (Emser,
   Traditions) ship from >1 dock, so a single (customer,driver,load) can carry
   one auto-pickup PER dock — and the location-blind key above kept an orphaned
   dock pickup alive as long as ANY same-customer delivery remained on the load
   (the "pickup card with no delivery" bug). When opts are given we match a
   multi-source pickup to a delivery at its OWN dock; a delivery whose dock can't
   be resolved is treated as covering every dock so messy data never over-reaps.
   With no opts the behavior is exactly the old location-blind reap (back-compat). */
export const reapOrphanAutoPickups=(entries,opts)=>{
  if(!Array.isArray(entries))return entries;
  const multiSource=opts&&typeof opts.multiSource==="function"?opts.multiSource:()=>false;
  const normLoc=opts&&typeof opts.normLoc==="function"?opts.normLoc:(s)=>String(s||"").trim().toLowerCase();
  const docksFor=opts&&typeof opts.docksFor==="function"?opts.docksFor:null;
  const gkey=(c,d,l)=>[c||"",d||0,l||1].join("|");
  /* Per (customer,driver,load): does a delivery exist, and — for multi-source —
     at which docks (wild = a delivery whose dock is unknown, covering all). */
  const groups=new Map();
  entries.forEach(e=>{
    if(!e||e.stopType!=="delivery"||!(e.driverId>0))return;
    const k=gkey(e.customer,e.driverId,e.loadNum);
    let g=groups.get(k);
    if(!g){g={docks:new Set(),wild:false};groups.set(k,g);}
    if(multiSource(e.customer)){
      const loc=normLoc(e.pickupFrom);
      /* A pickupFrom naming a place this supplier has no dock at ("Southern
         Aluminum - Lithia Springs" on an Emser stop, or anything free-typed) is
         NOT a dock constraint. rebuildPickupsFor treats it as "no dock named"
         and falls back to the supplier's first dock; if the reaper instead reads
         it as a dock, the two disagree and it deletes the very card the
         generator just made. The card is on the dispatcher's screen, then gone
         after a sync — and gone on the driver's phone, which only ever sees
         post-reap data. Treat unresolvable as wild, matching the generator.
         Without docksFor the old behavior stands. */
      const known=!loc||!docksFor||docksFor(e.customer).some(l=>normLoc(l)===loc);
      if(loc&&known)g.docks.add(loc); else g.wild=true;
    }
  });
  let changed=false;
  const out=entries.filter(e=>{
    if(!e||e.stopType!=="pickup"||e.manualPickup)return true;
    const g=groups.get(gkey(e.customer,e.driverId,e.loadNum));
    if(!g){changed=true;return false;}            /* no delivery on the load → orphan */
    if(!multiSource(e.customer))return true;       /* single-source → group presence is enough */
    if(g.wild)return true;                          /* an ambiguous delivery covers every dock */
    const puLoc=normLoc(e.pickupFrom)||normLoc(e.stop);
    if(!puLoc)return true;                          /* pickup dock unknown → keep (conservative) */
    if(g.docks.has(puLoc))return true;              /* a delivery at this pickup's dock exists */
    changed=true;return false;                      /* multi-source orphan: no delivery at its dock */
  });
  return changed?out:entries;
};

/* ── Driver-roster reconciliation ────────────────────────────────────────────
   The same physical driver must resolve to ONE id on every device. Two failure
   modes broke that: (a) addDrvr minted id:Date.now(), so two dispatchers who
   each add "Brent" get DIFFERENT ids; (b) the config/drivers doc is replaced
   wholesale on receive, so a same-name driver's id can silently change under a
   client's feet. Either way, orders assigned to a driver on one screen render
   under NO column on another ("I plan on Brent, she doesn't see it"). These
   pure helpers give every device the SAME id for a given driver and let a day's
   entries follow their driver when its id changes. */

/* Canonical name key — trim, collapse inner whitespace, lowercase. */
export const normDriverName=(name)=>String(name==null?"":name).trim().replace(/\s+/g," ").toLowerCase();

/* Reconcile the roster a client currently holds (oldDrivers) against the roster
   it is about to adopt (incoming). Returns:
     - drivers: incoming collapsed to ONE entry per name, each stamped with the
       canonical id (the SMALLEST id for that name — seed ids 1-4 beat Date.now()
       ids, and "smallest" is identical on every device because config/drivers is
       a single last-writer-wins document, so all clients converge on it);
     - remap: { [oldId]: canonicalId } for every id — whether a duplicate in
       `incoming` or the client's own current id — that resolves to a name whose
       canonical id differs. Apply it to that day's entries so assignments follow
       the driver.
   Deliberately conservative and deletion-safe: a name present in `oldDrivers`
   but ABSENT from `incoming` was really deleted — it gets no canonical and no
   remap, so its entries are left exactly as they are (a genuine removal is not
   resurrected or re-pointed). */
export const reconcileDriverRoster=(oldDrivers,incoming)=>{
  const inList=(Array.isArray(incoming)?incoming:[]).filter(d=>d&&d.id!=null&&normDriverName(d.name));
  const canon=new Map();
  inList.forEach(d=>{const k=normDriverName(d.name);const cur=canon.get(k);if(cur==null||d.id<cur)canon.set(k,d.id);});
  const drivers=[];const placed=new Set();
  inList.forEach(d=>{const k=normDriverName(d.name);if(placed.has(k))return;placed.add(k);const cid=canon.get(k);drivers.push(d.id===cid?d:{...d,id:cid});});
  const remap={};
  inList.forEach(d=>{const cid=canon.get(normDriverName(d.name));if(cid!=null&&d.id!==cid)remap[d.id]=cid;});
  (Array.isArray(oldDrivers)?oldDrivers:[]).forEach(d=>{if(!d||d.id==null)return;const k=normDriverName(d.name);if(!k)return;const cid=canon.get(k);if(cid!=null&&d.id!==cid)remap[d.id]=cid;});
  return {drivers,remap};
};

/* Apply a driverId remap ({oldId:newId}) to a day's entries. Returns the SAME
   array reference when nothing changed, so callers can skip a needless state
   update / save. Object keys are strings; a numeric driverId coerces to match. */
export const applyDriverRemap=(entries,remap)=>{
  if(!Array.isArray(entries)||!remap||!Object.keys(remap).length)return entries;
  let changed=false;
  const out=entries.map(e=>{
    if(e&&e.driverId!=null&&Object.prototype.hasOwnProperty.call(remap,e.driverId)){
      changed=true;return{...e,driverId:remap[e.driverId]};
    }
    return e;
  });
  return changed?out:entries;
};

/* Status only ever advances (null → arrived → departed), never backward. */
export const STATUS_RANK={null:0,undefined:0,"":0,"arrived":1,"departed":2};
export const DRIVER_OWNED_FIELDS=["status","arrivedAt","departedAt","photos","signature","shipPlan","eta","etaDest","etaSetAt"];

export const _mergeEntryDriver=(localE,fbE)=>{
  /* Caller is the driver assigned to this entry. Take local's driver-owned
     fields (with forward-only status) and FB's everything-else — which includes
     the ordering key: a driver never reorders stops, so FB's `seq` is taken as
     given by starting from fbE. */
  const out={...fbE};
  const localRank=STATUS_RANK[localE.status]??0;
  const fbRank=STATUS_RANK[fbE.status]??0;
  out.status=localRank>=fbRank?localE.status:fbE.status;
  if(localE.arrivedAt)out.arrivedAt=localE.arrivedAt; else if(fbE.arrivedAt)out.arrivedAt=fbE.arrivedAt;
  if(localE.departedAt)out.departedAt=localE.departedAt; else if(fbE.departedAt)out.departedAt=fbE.departedAt;
  /* Photos are an append-only set — union real Storage URLs from both sides so
     concurrent uploads can't clobber each other. */
  const lp=localE.photos||[],fp=fbE.photos||[];
  const seen=new Set();
  const merged=[];
  const real=(p)=>typeof p==="string"&&p.startsWith("https://");
  fp.forEach(p=>{if(real(p)&&!seen.has(p)){seen.add(p);merged.push(p);}});
  lp.forEach(p=>{if(real(p)&&!seen.has(p)){seen.add(p);merged.push(p);}});
  if(!fp.some(real)){lp.forEach(p=>{if(!real(p)&&!seen.has(p)){seen.add(p);merged.push(p);}});}
  out.photos=merged;
  if(localE.signature&&localE.signature!=="signed")out.signature=localE.signature;
  else if(fbE.signature)out.signature=fbE.signature;
  if(localE.shipPlan)out.shipPlan=localE.shipPlan; else if(fbE.shipPlan)out.shipPlan=fbE.shipPlan;
  if(localE.eta){out.eta=localE.eta;out.etaDest=localE.etaDest||null;out.etaSetAt=localE.etaSetAt||null;}
  else if(fbE.eta){out.eta=fbE.eta;out.etaDest=fbE.etaDest||null;out.etaSetAt=fbE.etaSetAt||null;}
  return out;
};

export const _mergeEntryDispatcher=(localE,fbE)=>{
  /* Dispatcher-field conflict resolution is LAST-WRITER-WINS by `updatedAt` — a
     per-entry edit timestamp stamped whenever a dispatcher changes the entry.
     This is what makes a reassignment/rate/order edit made on ONE dispatcher's
     screen actually appear on ANOTHER's. The old code kept LOCAL dispatcher
     fields unconditionally, so a remote reassign looked stale and never
     propagated ("I plan on Brent, she doesn't see it").

     A tie (neither side stamped, or equal) keeps LOCAL — this preserves the
     prior behavior AND the "a stale FB echo must not revert my just-made local
     assignment" guarantee: the local edit is the newer one, so it wins.

     Driver-stamped fields (status / arrived / departed / photos / signature /
     shipPlan / eta) always merge FORWARD from BOTH sides regardless of who wins
     the dispatcher fields, so a driver's progress is never lost to a dispatcher
     edit. */
  const lt=Number(localE.updatedAt)||0, ft=Number(fbE.updatedAt)||0;
  const out={...(ft>lt?fbE:localE)}; /* newer editor wins dispatcher fields; tie → local */
  const localRank=STATUS_RANK[localE.status]??0;
  const fbRank=STATUS_RANK[fbE.status]??0;
  out.status = fbRank>localRank ? fbE.status : localE.status;
  out.arrivedAt = localE.arrivedAt || fbE.arrivedAt || null;
  out.departedAt = localE.departedAt || fbE.departedAt || null;
  const lp=localE.photos||[],fp=fbE.photos||[];
  const seen=new Set();
  const merged=[];
  const real=(p)=>typeof p==="string"&&p.startsWith("https://");
  fp.forEach(p=>{if(real(p)&&!seen.has(p)){seen.add(p);merged.push(p);}});
  lp.forEach(p=>{if(real(p)&&!seen.has(p)){seen.add(p);merged.push(p);}});
  if(!fp.some(real)){lp.forEach(p=>{if(!real(p)&&!seen.has(p)){seen.add(p);merged.push(p);}});}
  out.photos=merged;
  out.signature = (localE.signature&&localE.signature!=="signed") ? localE.signature : (fbE.signature||localE.signature||null);
  out.shipPlan = localE.shipPlan || fbE.shipPlan || null;
  if(localE.eta){out.eta=localE.eta;out.etaDest=localE.etaDest;out.etaSetAt=localE.etaSetAt;}
  else if(fbE.eta){out.eta=fbE.eta;out.etaDest=fbE.etaDest;out.etaSetAt=fbE.etaSetAt;}
  const mt=Math.max(lt,ft); if(mt)out.updatedAt=mt; /* carry the winning edit's stamp forward */
  /* ORDER resolves on its OWN clock (seqAt), never on updatedAt — a rate edit
     here must not drag a stale position along with it and undo somebody else's
     reorder. See the `seq` block below for the full rationale. */
  return _applySeq(out,localE,fbE);
};

/* Coerce possibly-bad Firestore data into safe types so render code that calls
   .split/.includes/.toFixed/etc. can never crash. Returns null only for
   non-objects. */
export function sanitizeEntry(e){
  if(!e||typeof e!=="object")return null;
  const safeStr=v=>typeof v==="string"?v:(v==null?"":String(v));
  const safeNum=v=>typeof v==="number"&&isFinite(v)?v:(parseFloat(v)||0);
  const safeStrOrNull=v=>typeof v==="string"?v:null;
  return{
    ...e,
    id:e.id,
    stop:safeStr(e.stop),
    customer:safeStr(e.customer),
    addr:safeStr(e.addr).replace(/5981 (Live Oak|Oakbrook) P(ark)?w(a)?y/i,"5470 Oakbrook Pkwy"),
    note:safeStrOrNull(e.note),
    instructions:safeStrOrNull(e.instructions),
    shipPlan:safeStrOrNull(e.shipPlan),
    refNum:safeStrOrNull(e.refNum),
    dueBy:safeStrOrNull(e.dueBy),
    pickupDueBy:safeStrOrNull(e.pickupDueBy),
    pickupFrom:safeStrOrNull(e.pickupFrom),
    eta:safeStrOrNull(e.eta),
    etaDest:safeStrOrNull(e.etaDest),
    stopType:safeStr(e.stopType),
    status:safeStr(e.status),
    driverId:safeNum(e.driverId),
    baseRate:safeNum(e.baseRate),
    liftgateFee:safeNum(e.liftgateFee),
    fuelPct:safeNum(e.fuelPct),
    weight:safeNum(e.weight),
    loadNum:e.loadNum==null?undefined:safeNum(e.loadNum),
    etaSetAt:e.etaSetAt==null?undefined:safeNum(e.etaSetAt),
    /* Ordering key + its edit clock. Coerced like loadNum so a string/garbage
       value out of Firestore can never poison the sort comparator. */
    seq:e.seq==null?undefined:safeNum(e.seq),
    seqAt:e.seqAt==null?undefined:safeNum(e.seqAt),
    isHourly:!!e.isHourly,
    priority:!!e.priority,
    liftgateApplied:!!e.liftgateApplied,
    knownLiftgate:!!e.knownLiftgate,
    wasSplit:!!e.wasSplit,
  };
}

/* Stable CONTENT signature of a stop — its identity independent of the volatile
   `id`. Used by two safety mechanisms:
     1. Tombstones match (id AND signature), so a delete can only ever suppress
        the SAME stop, never a different one that merely shares a (possibly
        synthetic / collided) id.
     2. The merge's signature-fallback reconciles a stop whose id diverged across
        devices (a legacy collided/null id that dedupeIds re-stamped from a
        since-edited field) by CONTENT instead of dropping it (driver-stamp loss)
        or double-counting it (ghost duplicate).
   Includes customer|stop|stopType|driverId|loadNum. addr is the ONLY dedupeIds
   basis field excluded — it is the field most often normalized differently
   between writers (IMETCO/Oakbrook rewrites), so including it would cause a
   tombstone to MISS its own stop after normalization. driverId and loadNum ARE
   included: two genuinely-distinct loads to the same customer+stop must have
   DIFFERENT signatures, or the merge's signature-fallback would collapse them
   and silently drop one (a delivery-loss path). The signature is only ever used
   with an id match (tombstones) or a both-sides-unique guard (fallback), so it
   cannot conflate two distinct stops. */
export const entrySig=(e)=>{
  if(!e||typeof e!=="object")return"";
  return[e.customer||"",e.stop||"",e.stopType||"",e.driverId||0,e.loadNum||1].join("|");
};

/* Normalize a tombstone collection into a content-aware matcher. Accepts any of:
     - a Set or array of bare ids        → legacy id-only match
     - a Map of id -> signature          → match id AND signature (sig ""/null => id-only)
     - an array of { id, sig } objects   → match id AND signature
   A tombstone with a signature suppresses an incoming entry ONLY when its id AND
   its content signature both agree, so an id collision can never silently delete
   an unrelated stop — the failure mode that erased real deliveries from the
   board. Returns { size, has(entry) }. */
export const makeTombFilter=(deletedIds)=>{
  const map=new Map(); /* String(id) -> Set<sig>; sig "" means id-only (match any content) */
  const add=(id,sig)=>{
    if(id==null)return;
    const k=String(id); /* coerce so a numeric tombstone id matches a string entry id */
    if(!map.has(k))map.set(k,new Set());
    map.get(k).add(sig==null?"":sig);
  };
  if(deletedIds instanceof Map){deletedIds.forEach((sig,id)=>add(id,sig));}
  else if(deletedIds instanceof Set){deletedIds.forEach(id=>add(id,""));}
  else if(Array.isArray(deletedIds)){deletedIds.forEach(d=>{if(d&&typeof d==="object")add(d.id,d.sig);else add(d,"");});}
  return{
    size:map.size,
    has(e){
      if(!e||e.id==null)return false;
      const sigs=map.get(String(e.id));
      if(!sigs)return false;
      if(sigs.has(""))return true;            /* id-only tombstone */
      return sigs.has(entrySig(e));           /* must also match content */
    },
  };
};

/* Does a MANUAL pickup stand in for the auto-generated dock pickup at `loc`
   (short dock label, e.g. "Norcross") for the source `srcLabel` (full label,
   e.g. "Emser - Norcross")? Only then may it suppress the auto card.

   The old rule suppressed on `!e.pickupFrom` — ANY dock-less manual pickup for
   the customer killed the real dock card for that driver+load. A return pickup
   at a store ("DCO Smyrna" scheduled for Emser Tile) silently erased the
   driver's "Emser - Norcross" card and its load order. A manual pickup
   somewhere else must COEXIST with the dock pickup, not replace it.

   Covers iff:
     - its stop IS the source label (the dispatcher manually added the dock card), or
     - its pickupFrom resolves to this dock (normalized, so "Norcross" and
       "Emser - Norcross" both match), or
     - no pickupFrom and its stop names BOTH the supplier and the dock ("Emser
       Norcross" typed by hand) — requiring the supplier name keeps a mere
       same-city location ("Elite Flooring - Norcross") from matching. */
export const manualPickupCoversDock=(e,loc,srcLabel,normLoc)=>{
  if(!e||!loc)return false;
  if(srcLabel&&e.stop===srcLabel)return true;
  const nl=typeof normLoc==="function"?normLoc:(s)=>String(s||"").trim().toLowerCase();
  if(e.pickupFrom)return nl(e.pickupFrom)===nl(loc);
  const stopL=String(e.stop||"").toLowerCase();
  const supplier=String(srcLabel||"").split(" - ")[0].trim().toLowerCase();
  return !!supplier&&stopL.includes(supplier)&&stopL.includes(String(loc).toLowerCase());
};

/* Is this delivery's freight collected somewhere that ISN'T one of the
   supplier's docks, with a manual pickup already scheduled there?

   The grouping in rebuildPickupsFor resolves a delivery's `pickupFrom` against
   PICKUP_SOURCES and, when nothing matches, falls back to puSrcs[0] — the
   supplier's default dock. That fallback is right for a delivery that never
   named a dock, and wrong for one that named a place the supplier doesn't own:
   an MM Systems load collected at Southern Aluminum got bucketed under the
   Pendergrass dock and grew a second pickup card there, on top of the manual
   Southern Aluminum card that was already covering it. Because the delivery
   itself was to Pendergrass, that phantom card told the driver to pick up and
   deliver at the same address.

   hasManualPU can't catch this: manualPickupCoversDock asks whether the manual
   pickup covers the DOCK, and a pickup at Southern Aluminum plainly doesn't.
   The question here is the other one — whether this delivery goes to a dock at
   all. manualPickupOrigin can't catch it either; it bails when an auto card
   exists on the load, which by then is the very card we should not have made.

   Narrow on purpose — it only fires when the dispatcher stated the origin twice
   over (a pickupFrom that matches no dock, AND a manual pickup sitting at that
   same place on this driver+load), so a delivery that really does come off a
   dock keeps its dock card. */
export const deliveryCollectedOffDock=(e,puSrcs,entries,normLoc)=>{
  if(!e||!e.pickupFrom||!Array.isArray(puSrcs)||!Array.isArray(entries))return false;
  const nl=typeof normLoc==="function"?normLoc:(s)=>String(s||"").trim().toLowerCase();
  const from=nl(e.pickupFrom);
  if(!from)return false;
  if(puSrcs.some(s=>s&&nl(s.label)===from))return false; /* names a real dock → normal dock flow */
  const drv=e.driverId||0,ln=e.loadNum||1;
  /* Same " → destination" suffix the insert-pickup form can leave on `stop`. */
  return entries.some(p=>p&&p.stopType==="pickup"&&p.manualPickup&&p.customer===e.customer
    &&(p.driverId||0)===drv&&(p.loadNum||1)===ln
    &&nl(String(p.stop||"").split(/\s*→\s*/)[0])===from);
};

/* Where a delivery's load actually comes from when a MANUAL pickup on the same
   (driver, load) already says so. Returns that pickup's location, or null.

   The multi-dock prompt is right to ask "Norcross or Roswell?" when the load
   comes off one of the supplier's own docks and nobody has said which. It is
   WRONG when the load doesn't come off a dock at all: a pallet collected at MTI
   in Sugar Hill and delivered to Emser Norcross has no dock to choose, so the
   card sat there demanding an answer with no correct one on offer — and one of
   the two chips would have recorded a pickup that never happened.

   The dispatcher already stated the origin by scheduling the manual pickup, so
   read it instead of asking. Manual pickups store the LOCATION in `stop` and
   the recipient in `customer` (the "For {customer}" card), so a delivery is
   matched to one by its own customer.

   Deliberately narrow, because a manual pickup elsewhere must not speak for a
   load that really does come off a dock:
     - an AUTO dock card on the same (driver, load) means the dock is knowable →
       null, leave the prompt alone;
     - two or more manual pickups → null, we genuinely can't say which supplies
       this stop;
     - a delivery that already names its dock never gets here (the caller
       resolves that first). */
export const manualPickupOrigin=(entry,entries)=>{
  if(!entry||!Array.isArray(entries))return null;
  if(entry.stopType==="pickup")return null;
  const cust=entry.customer;
  if(!cust)return null;
  const drv=entry.driverId||0,ln=entry.loadNum||1;
  const sameLoad=(e)=>e&&e.stopType==="pickup"&&e.customer===cust&&(e.driverId||0)===drv&&(e.loadNum||1)===ln;
  if(entries.some(e=>sameLoad(e)&&!e.manualPickup))return null; /* a real dock card exists → the dock IS the origin */
  const manual=entries.filter(e=>sameLoad(e)&&e.manualPickup);
  if(manual.length!==1)return null;
  const m=manual[0];
  /* `stop` may carry a " → destination" suffix from the insert-pickup form; the
     location is the part before it. */
  const loc=String(m.stop||"").split(/\s*→\s*/)[0].trim()||String(m.pickupFrom||"").trim();
  return loc||null;
};

/* ── Durable tombstones (delete propagation) ─────────────────────────────────
   The in-memory tombstones above live 90s on ONE device — long enough to keep a
   Firestore echo from resurrecting a just-deleted stop locally, but invisible to
   every other device. The confirmed failure: A deletes X and saves; B's local
   still holds X; B's next save re-appends X → resurrected for everyone.

   Fix: the day document carries its own tombstone list — `deleted:[{id,sig,at}]`
   — written by the save transaction and honored by every device's merge and
   receive path. `at` is the delete's edit-clock: an entry whose updatedAt is
   NEWER than the tombstone survives (someone kept working on the stop after the
   delete — last writer wins, consistent with _mergeEntryDispatcher), while a
   stale copy (older or no updatedAt) is suppressed. A re-added stop always has a
   fresh id, so it can never be caught by the old id's tombstone. */
export const DOC_TOMBSTONE_TTL=48*3600*1000; /* long enough to outlive any stale tab holding the day */

/* Normalize any of the app's tombstone shapes (the activeTombstones array/Map,
   a doc's deleted list, bare ids) to [{id,sig,at}]. `now` stamps entries that
   carry no time of their own. */
export const tombListFrom=(deleted,now)=>{
  const at0=Number(now)||0;
  const out=[];
  const add=(id,sig,at)=>{if(id!=null)out.push({id:String(id),sig:sig==null?"":String(sig),at:Number(at)||at0});};
  if(deleted instanceof Map)deleted.forEach((v,id)=>{if(v&&typeof v==="object")add(id,v.sig,v.at);else add(id,v);});
  else if(deleted instanceof Set)deleted.forEach(id=>add(id,""));
  else if(Array.isArray(deleted))deleted.forEach(d=>{if(d&&typeof d==="object")add(d.id,d.sig,d.at);else add(d,"");});
  return out;
};

/* Merge the day doc's tombstones with the caller's fresh local ones: one entry
   per (id, sig) keeping the NEWEST at, pruned to the TTL. Pure and idempotent —
   the transaction can re-run it on retry and every device computes the same. */
export const mergeTombstones=(fbDeleted,localDeleted,now,ttl)=>{
  const nowTs=Number(now)||0;
  const horizon=nowTs-(Number(ttl)||DOC_TOMBSTONE_TTL);
  const byKey=new Map();
  tombListFrom(fbDeleted,nowTs).concat(tombListFrom(localDeleted,nowTs)).forEach(t=>{
    if(t.at<=horizon)return;
    const k=t.id+"|"+t.sig;
    const cur=byKey.get(k);
    if(!cur||t.at>cur.at)byKey.set(k,t);
  });
  return[...byKey.values()];
};

/* Edit-clock-aware tombstone matcher over a doc's deleted list. Suppresses an
   entry iff its id matches, its signature matches (empty sig = id-only), AND the
   delete is not older than the entry's own last edit. */
export const makeDocTombFilter=(deleted)=>{
  const list=tombListFrom(deleted,0);
  const byId=new Map();
  list.forEach(t=>{
    if(!byId.has(t.id))byId.set(t.id,[]);
    byId.get(t.id).push(t);
  });
  return{
    size:byId.size,
    has(e){
      if(!e||e.id==null)return false;
      const ts=byId.get(String(e.id));
      if(!ts)return false;
      const edited=Number(e.updatedAt)||0;
      const sig=entrySig(e);
      return ts.some(t=>(t.sig===""||t.sig===sig)&&t.at>=edited);
    },
  };
};

/* Auto-pickups removed as a SIDE EFFECT of a local mutation (rebuildPickupsFor),
   for the caller to tombstone. ONLY non-manual pickups are eligible: a delivery
   must NEVER be tombstoned by a vanished/diff heuristic, because tombstoning a
   delivery that merely fell out of an array (splice math, a transient duplicate
   id, a colliding-twin delete) is precisely what permanently and silently erased
   real deliveries across every device. Deliveries are only ever removed by an
   explicit, deliberate delete of that exact stop — never inferred from a diff. */
export const vanishedAutoPickups=(before,after)=>{
  if(!Array.isArray(before))return[];
  const surviving=new Set((after||[]).map(e=>e&&e.id));
  return before.filter(e=>e&&e.id&&e.stopType==="pickup"&&!e.manualPickup&&!surviving.has(e.id));
};

/* ── Stop ORDER as replicated data (`seq` / `seqAt`) ─────────────────────────
   THE BUG THIS FIXES: two dispatchers, same day, same load — one saw "Emser -
   Norcross" picking up first, the other saw "Emser - Roswell" first, and a
   refresh on both screens did not settle it.

   Root cause: order was NOT data. It was the position of an entry inside the
   day's array, and every reconciliation path made the LOCAL array the authority
   on it — the receive path rebuilt the day in local order and appended FB-only
   stops at the end, and buildMergedEntries started from local too. So:
     - a reorder made on screen A could never reach screen B (B's receive path
       re-imposed B's own order on every snapshot), and
     - whichever screen saved last stamped ITS order onto the day document,
       so the two screens flipped Firebase back and forth forever.
   A refresh only adopted whatever order happened to be in Firebase at that
   instant; the other tab's next save flipped it straight back. There was no
   convergence rule at all, because a drag changes no field — so unlike a rate
   or a reassign, a reorder carried no edit clock for the merge to reason about.

   Fix: give every stop an explicit ordering number, `seq`, and its own edit
   clock, `seqAt`. Order is now a FIELD that replicates and merges under the
   same last-writer-wins rule as every other dispatcher field, and every device
   renders `sort by (seq, id)` — so all devices agree by construction.

   `seqAt` is deliberately SEPARATE from `updatedAt`: a rate edit on one screen
   must not stomp a reorder made on another, and vice versa. Where neither side
   has ever explicitly reordered a stop (both numbers are merely minted from an
   array position), the FIREBASE value wins — it is the copy every device shares,
   so all devices land on it instead of each preferring its own.

   This is the `seq` field of the target architecture in docs/SYNC_REDESIGN.md
   §2, landed on today's array model: the same ordering key the per-order store
   (ordersStore.js) already writes as `_seq`. */
export const SEQ_STEP=1000; /* gapped, so an insert or a drag re-mints one number instead of renumbering the day */
export const seqOf=(e)=>{const v=e&&e.seq;return typeof v==="number"&&isFinite(v)?v:null;};
export const seqAtOf=(e)=>{const v=e&&e.seqAt;return typeof v==="number"&&isFinite(v)?v:0;};

/* Which entries may KEEP their current number: the longest strictly-increasing
   subsequence of the existing seqs, by array position. Everything else is
   re-minted between its kept neighbours. Using the LIS (rather than a
   left-to-right "is it bigger than the last kept one?" scan) is what keeps a
   drag down to ONE rewritten entry: drag a stop from the bottom of a route to
   the top and only that stop's seq changes — so only that stop claims a new
   edit clock, and only that stop can win a merge against another dispatcher. */
const _lisKeep=(seqs)=>{
  const n=seqs.length;
  const keep=new Array(n).fill(false);
  const tailSeq=[];   /* tailSeq[k] = smallest tail value of an increasing run of length k+1 */
  const tailIdx=[];   /* index that produced it */
  const prev=new Array(n).fill(-1);
  for(let i=0;i<n;i++){
    if(seqs[i]==null)continue;
    let lo=0,hi=tailSeq.length;
    while(lo<hi){const mid=(lo+hi)>>1;if(tailSeq[mid]<seqs[i])lo=mid+1;else hi=mid;}
    tailSeq[lo]=seqs[i];tailIdx[lo]=i;
    prev[i]=lo>0?tailIdx[lo-1]:-1;
  }
  let k=tailIdx.length?tailIdx[tailIdx.length-1]:-1;
  while(k>=0){keep[k]=true;k=prev[k];}
  return keep;
};

/* Make every entry's `seq` agree with its CURRENT position in `entries`.
   Returns the same array reference when nothing needed changing.

   Two modes, by `now`:
     - now = a timestamp (a LOCAL user action: drag, insert, route apply, a
       pickup rebuild) — entries that actually moved get a new seq AND
       seqAt=now, so the move replicates and beats a stale echo.
     - now = 0/omitted (INGEST / merge: we are only filling in numbers for data
       written before this field existed) — existing seqs are never rewritten
       and no edit clock is claimed, so minting can't masquerade as a reorder.
   Entries with no seq are always given one, interpolated between their
   neighbours so a brand-new stop lands exactly where the dispatcher put it. */
export const resequenceEntries=(entries,now)=>{
  if(!Array.isArray(entries)||entries.length===0)return entries;
  const nowTs=Number(now)||0;
  const n=entries.length;
  const cur=entries.map(e=>(e?seqOf(e):null));
  const keep=nowTs?_lisKeep(cur):cur.map(v=>v!=null);
  const out=entries.slice();
  let changed=false;
  const put=(i,val)=>{
    const e=entries[i];
    if(!e||typeof e!=="object")return;
    if(cur[i]===val)return;
    changed=true;
    /* An entry that already HAD a number and is being moved is a real reorder →
       stamp the order clock. A first-time mint claims no authority. */
    out[i]=(cur[i]!=null&&nowTs)?{...e,seq:val,seqAt:nowTs}:{...e,seq:val};
  };
  let i=0,prevSeq=null,exhausted=false;
  while(i<n){
    if(keep[i]){prevSeq=cur[i];i++;continue;}
    let j=i;while(j<n&&!keep[j])j++;
    const count=j-i;
    const nextSeq=j<n?cur[j]:null;
    if(prevSeq==null&&nextSeq==null){
      for(let k=0;k<count;k++)put(i+k,k*SEQ_STEP);
      prevSeq=(count-1)*SEQ_STEP;
    }else if(prevSeq==null){
      /* leading run — count back from the first kept number */
      for(let k=0;k<count;k++)put(i+k,nextSeq-(count-k)*SEQ_STEP);
      prevSeq=nextSeq-SEQ_STEP;
    }else if(nextSeq==null||nextSeq<=prevSeq){
      let last=prevSeq;
      for(let k=0;k<count;k++){last=prevSeq+(k+1)*SEQ_STEP;put(i+k,last);}
      prevSeq=last;
    }else{
      const step=(nextSeq-prevSeq)/(count+1);
      if(step<=1e-6){
        /* Gap subdivided past usefulness (thousands of inserts at one spot).
           A local action can afford to renumber the day from scratch; a MINT
           must not — rewriting numbers with no clock behind them is how two
           devices start disagreeing again. Minting instead stacks on the
           previous number and lets the id tiebreak settle it, which every
           device computes the same way. */
        if(nowTs){exhausted=true;break;}
        for(let k=0;k<count;k++)put(i+k,prevSeq);
      }else{
        let last=prevSeq;
        for(let k=0;k<count;k++){last=prevSeq+(k+1)*step;put(i+k,last);}
        prevSeq=last;
      }
    }
    i=j;
  }
  /* Numbering space exhausted between two kept stops (needs thousands of
     inserts at one spot). Renumber the whole day from position — deterministic,
     and only reachable from an explicit local action. */
  if(exhausted){
    const flat=entries.map((e,k)=>{
      if(!e||typeof e!=="object")return e;
      const val=k*SEQ_STEP;
      if(seqOf(e)===val)return e;
      return seqOf(e)!=null?{...e,seq:val,seqAt:nowTs}:{...e,seq:val};
    });
    return flat;
  }
  return changed?out:entries;
};

/* The one render/persist order, computed identically on every device: by `seq`,
   ties broken by id. The tiebreak uses plain string comparison, NOT
   localeCompare — locale-sensitive collation is exactly the kind of thing that
   differs between two dispatchers' browsers, which is the bug we are fixing.
   Entries with no seq at all sink to the end in their existing order (only
   reachable for junk without an id; resequenceEntries numbers everything else). */
export const sortBySeq=(entries)=>{
  if(!Array.isArray(entries)||entries.length<2)return entries;
  const seqs=entries.map(e=>(e?seqOf(e):null));
  const idx=entries.map((_e,i)=>i);
  idx.sort((a,b)=>{
    const sa=seqs[a],sb=seqs[b];
    if(sa==null&&sb==null)return a-b;
    if(sa==null)return 1;
    if(sb==null)return -1;
    if(sa!==sb)return sa-sb;
    const ia=String((entries[a]&&entries[a].id)??""),ib=String((entries[b]&&entries[b].id)??"");
    return ia<ib?-1:ia>ib?1:a-b;
  });
  for(let k=0;k<idx.length;k++){if(idx[k]!==k)return idx.map(p=>entries[p]);}
  return entries;
};

/* An auto-pickup must come BEFORE the deliveries it feeds — you cannot drop a
   pallet you have not collected yet. That was only ever enforced at WRITE time,
   by rebuildPickupsFor placing a regenerated pickup in front of its first
   delivery. Nothing enforced it at READ time, so once a day's array drifted
   into pickup-after-delivery (a route apply that stranded the pickups at the
   end, a load move, any path that didn't re-run the rebuild) it stayed that way
   on every screen: the driver's Load 1 showed "DCO Smyrna" first and the
   "Emser - Norcross" pickup that supplies it second — with a departure stamp an
   hour EARLIER, because in the real world it obviously happened first.

   Same reasoning as reapOrphanAutoPickups: rather than chase every caller
   forever, enforce the invariant here, on the read path everything shares. Each
   auto-pickup moves to just ahead of the earliest delivery it feeds; a pickup
   already ahead of its deliveries never moves.

   Only AUTO pickups are touched. A manual pickup is a deliberate dispatcher
   placement (a return pickup at the end of a route is a real thing) and is left
   exactly where it was put.

   opts (optional): { multiSource(customer)->bool, normLoc(str)->str } — same
   pair reapOrphanAutoPickups takes. Multi-source suppliers ship from >1 dock, so
   a pickup is matched to deliveries at ITS dock; a delivery whose dock can't be
   resolved counts as fed by any dock (conservative — it can only ever move the
   pickup earlier, never leave a delivery ahead of its supply). */
export const orderAutoPickupsFirst=(entries,opts)=>{
  if(!Array.isArray(entries)||entries.length<2)return entries;
  const multiSource=opts&&typeof opts.multiSource==="function"?opts.multiSource:()=>false;
  const normLoc=opts&&typeof opts.normLoc==="function"?opts.normLoc:(s)=>String(s||"").trim().toLowerCase();
  const feeds=(pu,d)=>{
    if(!d||d.stopType!=="delivery")return false;
    if(d.customer!==pu.customer)return false;
    if(d.driverId!==pu.driverId)return false;
    if((d.loadNum||1)!==(pu.loadNum||1))return false;
    if(!multiSource(pu.customer))return true;      /* single dock → every delivery on the load */
    const puLoc=normLoc(pu.pickupFrom)||normLoc(pu.stop);
    const delLoc=normLoc(d.pickupFrom);
    if(!puLoc||!delLoc)return true;                 /* dock unknown on either side → treat as fed */
    return puLoc===delLoc;
  };
  const arr=entries.slice();
  let changed=false;
  for(let i=0;i<arr.length;i++){
    const e=arr[i];
    if(!e||e.stopType!=="pickup"||e.manualPickup||!(e.driverId>0))continue;
    let first=-1;
    for(let j=0;j<i;j++){if(feeds(e,arr[j])){first=j;break;}}
    if(first<0)continue;                            /* already ahead of its deliveries */
    arr.splice(i,1);
    arr.splice(first,0,e);
    changed=true;
    /* Everything past i keeps its index (the removal and the re-insert cancel
       out above it), so the scan continues from i+1 without skipping a stop. */
  }
  return changed?arr:entries;
};

/* Number, sort, then put each auto-pickup ahead of what it supplies — the shape
   every read path wants. Idempotent: a second pass over its own output is a
   no-op, so ingest → render → save can't walk the order anywhere.

   `seq` is deliberately NOT rewritten to match a pickup this moved. Minting a
   number inside a shared read path would have every device racing to claim the
   same reorder; the invariant is a pure function of the data instead, so all
   devices land on the identical order without anyone claiming authority. The
   first local edit on the day resequences it for real (with a proper clock) and
   the stored numbers heal to match. */
export const normalizeOrder=(entries,now,opts)=>orderAutoPickupsFirst(sortBySeq(resequenceEntries(entries,now)),opts);

/* Resolve the ORDER field between two copies of one stop. Higher seqAt (a real
   reorder) wins. When neither side has ever been explicitly reordered — or the
   clocks tie — Firebase wins, because it is the copy both devices can see and
   therefore the only value they can both converge on. A side with no number
   never overrides a side that has one. */
const _pickSeq=(localE,fbE)=>{
  const ls=seqOf(localE),fs=seqOf(fbE);
  if(ls==null&&fs==null)return null;
  if(ls==null)return{seq:fs,seqAt:seqAtOf(fbE)};
  if(fs==null)return{seq:ls,seqAt:seqAtOf(localE)};
  return seqAtOf(localE)>seqAtOf(fbE)?{seq:ls,seqAt:seqAtOf(localE)}:{seq:fs,seqAt:seqAtOf(fbE)};
};
const _applySeq=(out,localE,fbE)=>{
  const r=_pickSeq(localE,fbE);
  if(!r){delete out.seq;delete out.seqAt;return out;}
  out.seq=r.seq;
  if(r.seqAt)out.seqAt=r.seqAt; else delete out.seqAt;
  return out;
};

/* Reorder `items` to follow `orderedIds`, with every item NOT named in the list
   kept (appended after, in original order). Consumes by POSITION (each id claims
   one not-yet-used matching item), so a legacy colliding-id pair can't collapse:
   `orderedIds.map(id=>items.find(e=>e.id===id))` returned the first twin for both
   slots and `items.filter(e=>!ids.includes(e.id))` then excluded BOTH — silently
   dropping the second twin (a delivery). This conserves the full multiset. */
export const orderByIds=(items,orderedIds)=>{
  if(!Array.isArray(items))return items;
  const used=new Array(items.length).fill(false);
  const ordered=[];
  (orderedIds||[]).forEach(id=>{
    const idx=items.findIndex((e,i)=>!used[i]&&e&&e.id===id);
    if(idx>=0){used[idx]=true;ordered.push(items[idx]);}
  });
  const leftover=items.filter((e,i)=>!used[i]);
  return[...ordered,...leftover];
};

/* The heart of multi-writer reconciliation, used inside saveManifestDay's
   Firestore transaction. Given the current FB array and the caller's local
   array, produce the array to persist:
     - both id-repaired first (dedupeIds);
     - start from local (preserves not-yet-synced adds; ORDER no longer rides on
       this — it is carried per stop by `seq` and re-sorted at the end);
     - per local entry, merge with FB per ownership (dispatcher vs the driver
       it's assigned to); a stop whose id diverged is reconciled by CONTENT
       (signature-fallback) rather than dropped; a driver drops any stop FB no
       longer has (honors a dispatcher delete instead of resurrecting it);
     - append FB-only entries that aren't tombstoned (genuine concurrent adds),
       so a delete the caller just made doesn't come back;
     - SAFETY NET: re-append any Firebase DELIVERY that is neither already in the
       output nor explicitly (signature-)tombstoned, so a delivery can never
       silently vanish at the merge layer regardless of id divergence, duplicate
       ids, or a future bug in a caller;
     - collapse duplicate auto-pickups.
   Pure: same inputs → same output, no I/O. This is the surface the concurrency
   test suite locks down. */
export const buildMergedEntries=(fbEntriesRaw,localEntriesRaw,{isDriver=false,callerDriverId=0,deletedIds=null,docTombstones=null,multiSource=null,normLoc=null}={})=>{
  const fbEntries=dedupeIds(fbEntriesRaw||[]);
  const localEntries=dedupeIds(localEntriesRaw||[]);
  /* Durable tombstones from the day doc (merged with the caller's fresh local
     deletes by saveManifestDay). Unlike the in-memory `deletedIds` — which only
     guards the FB-side appends — these ALSO drop the caller's own LOCAL copy of
     a stop another dispatcher deleted, killing the "B's stale copy resurrects
     A's delete" loop. Edit-clock-aware: an entry edited AFTER the delete wins. */
  const docTomb=makeDocTombFilter(docTombstones);
  const fbById={};
  fbEntries.forEach(e=>{if(e&&e.id)fbById[e.id]=e;});
  const localById={};
  localEntries.forEach(e=>{if(e&&e.id)localById[e.id]=e;});
  /* Signature index for reconciling a stop whose id diverged across devices by
     CONTENT. The fallback fires ONLY when the signature is unique on BOTH sides
     (exactly one FB entry and one local entry carry it) — an unambiguous 1:1
     content match. That double-uniqueness guard is what prevents two distinct
     stops (e.g. two different loads to the same customer+stop) from being merged
     together and one silently dropped. usedFbIds tracks every FB entry consumed
     by an id OR signature match so the FB-only-append can't re-add it as a ghost. */
  const fbBySig={};const fbSigCount={};
  fbEntries.forEach(e=>{if(e){const s=entrySig(e);fbSigCount[s]=(fbSigCount[s]||0)+1;if(!(s in fbBySig))fbBySig[s]=e;}});
  const localSigCount={};
  localEntries.forEach(e=>{if(e){const s=entrySig(e);localSigCount[s]=(localSigCount[s]||0)+1;}});
  const usedFbIds=new Set();
  const resolveFb=(localE)=>{
    let fbE=fbById[localE.id];
    if(!fbE){const s=entrySig(localE);const cand=fbBySig[s];if(cand&&fbSigCount[s]===1&&localSigCount[s]===1&&!usedFbIds.has(cand.id))fbE=cand;}
    return fbE;
  };
  const merged=localEntries.map(localE=>{
    if(!localE||!localE.id)return localE;
    if(docTomb.has(localE))return null; /* another dispatcher deleted this stop — drop our stale copy */
    const fbE=resolveFb(localE);
    if(isDriver){
      if(localE.driverId!==callerDriverId){if(fbE){usedFbIds.add(fbE.id);return fbE;}return null;}
      if(!fbE)return null;
      usedFbIds.add(fbE.id);
      return _mergeEntryDriver(localE,fbE);
    }else{
      if(!fbE)return localE;
      usedFbIds.add(fbE.id);
      return _mergeEntryDispatcher(localE,fbE);
    }
  }).filter(Boolean);
  const tomb=makeTombFilter(deletedIds);
  fbEntries.forEach(fbE=>{
    if(fbE&&fbE.id&&!localById[fbE.id]&&!usedFbIds.has(fbE.id)&&!tomb.has(fbE)&&!docTomb.has(fbE))merged.push(fbE);
  });
  /* SAFETY NET — a delivery that exists in Firebase must never silently vanish.
     The only legitimate removal of a delivery is an explicit, signature-matched
     tombstone (the dispatcher deleted exactly that stop). Anything else that
     would drop an FB delivery — id divergence, a duplicate-id map collapse, a
     future bug in a caller — is caught here and the delivery is re-appended. */
  const outIds=new Set(merged.map(e=>e&&e.id));
  fbEntries.forEach(fbE=>{
    if(!fbE||fbE.id==null||fbE.stopType!=="delivery")return;
    if(outIds.has(fbE.id)||usedFbIds.has(fbE.id))return;
    if(tomb.has(fbE)||docTomb.has(fbE))return; /* explicitly deleted — stays gone */
    merged.push(fbE);
  });
  /* Orphan reap LAST, after the delivery safety-net re-append, so a rescued
     delivery keeps its pickup. Self-heals any orphan already persisted in
     Firebase: the merge drops it, and the transaction write makes that stick. */
  const reconciled=reapOrphanAutoPickups(dedupeDeliveries(dedupeGhostDeliveries(dedupeAutoPickups(merged,normLoc?{normLoc}:undefined))),multiSource?{multiSource,normLoc}:undefined);
  /* Persist the day in `seq` order, auto-pickups ahead of what they supply, so
     the stored array itself is the agreed order — a client that loads it cold,
     an export, and the shadow order store's `_seq` all line up without
     re-deriving anything. `now` is 0 here: the merge mints numbers for stops
     written before this field existed, but it never rewrites one, so a
     transaction can't invent a reorder nobody asked for. */
  return normalizeOrder(reconciled,0,multiSource?{multiSource,normLoc}:undefined);
};

/* ── The auto-pickup engine ───────────────────────────────────────────────────
   Lifted out of App.jsx verbatim so it can be driven by tests. It was the one
   piece of genuinely intricate logic — dock matching, multi-load, manual-pickup
   suppression, anchor-preserving placement, id reuse, tombstoning — with no
   direct test coverage, because it closed over component state and could only
   be reached by clicking. Both of the bugs found on 2026-07-28 lived in here.

   The three closure dependencies are now injected via `deps`:
     pickupSources   PICKUP_SOURCES (module constant in App.jsx)
     customers       CUSTOMERS (module constant)
     driverLoadCount component state: {driverId: loadCount}
     genId           id minter (injectable so tests get stable ids)
     normLoc         dock-label normalizer
     onTombstone     side effect for auto-pickups that vanish in the rebuild

   Behavior is unchanged — App.jsx keeps a thin wrapper that binds the deps. */
export const rebuildPickupsForPure=(all,cust,deps)=>{
const {pickupSources:PICKUP_SOURCES,customers:CUSTOMERS,driverLoadCount,genId,normLoc:_normLoc,onTombstone:tombstone}=deps;

const makeNote=(dels)=>{
  if(!dels.length)return"";
  /* Reverse to LIFO load order. Full list — no truncation. */
  const names=dels.slice().reverse().map(e=>e.stop);
  return "Load order: "+names.join(", ");
};
const puSrcs=PICKUP_SOURCES.filter(s=>s.customer===cust);
if(!puSrcs.length)return all;
const removedPUs=all.filter(e=>e.customer===cust&&e.stopType==="pickup"&&!e.manualPickup);
/* Before removing the auto-pickups, remember WHERE each one sat so a rebuild
   triggered by an unrelated change (e.g. adding a stop to another driver)
   doesn't relocate a pickup the dispatcher manually positioned. For each
   removed pickup, record the id of the very next entry after it in the array
   (its "anchor"). On re-insert we place the reused pickup right before that
   same anchor, preserving the manual order. Falls back to delivery-based
   placement only for genuinely new pickups or when the anchor is gone. */
const _puAnchorById={};
const _removedIdSet=new Set(removedPUs.map(p=>p.id));
removedPUs.forEach(p=>{
  const idx=all.findIndex(e=>e.id===p.id);
  if(idx>=0){
    /* Anchor = next entry that is NOT itself an auto-pickup being removed in
       this pass, so the anchor is a stable delivery (or other kept entry)
       that will still be present after regeneration. */
    const next=all.slice(idx+1).find(e=>e.id&&!_removedIdSet.has(e.id));
    _puAnchorById[p.id]=next?next.id:null; /* null => was at end */
  }
});
all=all.filter(e=>!(e.customer===cust&&e.stopType==="pickup"&&!e.manualPickup));
/* Track which removed-pickup ids get reused by a regenerated pickup. Any
   removed pickup whose id is NOT reused is genuinely gone — it must be
   tombstoned, or the next transactional save sees it FB-only and resurrects
   it as an orphan card. */
const _reusedPuIds=new Set();
const custDels=all.filter(e=>e.customer===cust&&e.stopType==="delivery");
const byDriver={};
custDels.forEach(e=>{if(e.driverId>0){if(!byDriver[e.driverId])byDriver[e.driverId]=[];byDriver[e.driverId].push(e);}});
const cd=CUSTOMERS[cust];
const puDueBy=(cust==="Specialty")?"Pickup 7:30 AM — Specialty":null;
Object.entries(byDriver).forEach(([drvIdStr,dels])=>{
const dId=Number(drvIdStr);
const byLocLoad={};
dels.forEach(e=>{
  /* Freight collected off-dock (pickupFrom names somewhere the supplier doesn't
     own, and a manual pickup is already scheduled there) needs no dock card —
     without this the puSrcs[0] fallback below buckets it under the supplier's
     default dock and generates a SECOND pickup for a delivery the manual card
     already covers. See deliveryCollectedOffDock. */
  if(deliveryCollectedOffDock(e,puSrcs,all,_normLoc))return;
  /* Group deliveries under a pickup location deterministically, keyed on the
     NORMALIZED location. A delivery's location is its own pickupFrom; when
     absent, fall back to the first source label. selPickup (the volatile UI
     toggle) is never used — that spawned ghost duplicates.

     Critically the key uses _normLoc: the stored pickupFrom comes in several
     formats for the same dock ("Norcross", "Emser - Norcross", "Emser Tile —
     Norcross"). Keying on the raw string put those in different groups and
     created a separate pickup card for each variant — more ghosts. _normLoc
     collapses them to one. We still keep a clean display label (prefer the
     matching source's short label) for the pickup's pickupFrom. */
  /* Fall back to the nominated default dock rather than whichever happens to be
     listed first, so the generated card names the same dock the label shows. */
  const _defSrc=puSrcs.find(s=>s.default)||puSrcs[0];
  const rawLoc=e.pickupFrom||_defSrc.label.split(" - ").pop();
  const normLoc=_normLoc(rawLoc);
  const matchSrc=puSrcs.find(s=>_normLoc(s.label)===normLoc)||_defSrc;
  const loc=matchSrc.label.split(" - ").pop();
  const ln=e.loadNum||1;
  const key=normLoc+"::"+ln;
  if(!byLocLoad[key])byLocLoad[key]={loc,loadNum:ln,dels:[]};
  byLocLoad[key].dels.push(e);
});
/* hasMultiLoads should reflect this DRIVER's overall load usage, not just
   this customer's. Otherwise a Florida Tile delivery on Load 2 would get a
   Load 1 pickup if Brent's other Load 2 stops were for different customers.
   Combines: (a) loads present in the new `all` state for this driver, and
   (b) the explicit driverLoadCount setting (user may have added Load 2 via
   the + Load button before moving any stops into it). */
const loadsInAll=new Set(all.filter(e=>e.driverId===dId).map(e=>e.loadNum||1));
const explicitLoads=driverLoadCount[dId]||1;
const maxLoadSeen=loadsInAll.size>0?Math.max(...loadsInAll):1;
const hasMultiLoads=loadsInAll.size>1||maxLoadSeen>1||explicitLoads>1;
Object.values(byLocLoad).forEach(({loc,loadNum:ln,dels:locDels})=>{
const puSrc=puSrcs.find(s=>s.label.includes(loc))||puSrcs[0];
/* Scope the manual-pickup check to the same load AND the same dock. A manual
   pickup only suppresses the auto dock card when it actually covers this dock
   (manualPickupCoversDock) — a manual pickup somewhere else entirely (e.g. a
   return pickup at "DCO Smyrna" scheduled for Emser Tile) must coexist with
   the dock pickup. The old `!e.pickupFrom` clause let any dock-less manual
   pickup silently erase the driver's real "Emser - Norcross" card and its
   load-order note. */
const hasManualPU=all.some(e=>e.customer===cust&&e.stopType==="pickup"&&e.manualPickup&&e.driverId===dId&&(e.loadNum||1)===ln&&manualPickupCoversDock(e,loc,puSrc.label,_normLoc));
if(hasManualPU)return;
const delWithPuDue=locDels.find(e=>e.pickupDueBy);
const effectivePuDue=delWithPuDue?delWithPuDue.pickupDueBy:puDueBy;
const existingPU=removedPUs.find(p=>p.driverId===dId&&p.stop===puSrc.label&&(p.loadNum||1)===(hasMultiLoads?ln:1));
const puId=existingPU?existingPU.id:genId();
if(existingPU)_reusedPuIds.add(existingPU.id);
const puEntry={id:puId,customer:cust,stop:puSrc.label,baseRate:0,fuelPct:0,isHourly:false,
note:makeNote(locDels),driverId:dId,addr:puSrc.addr,stopType:"pickup",priority:cd?.priority||false,
instructions:existingPU?.instructions||"",status:existingPU?.status||null,arrivedAt:existingPU?.arrivedAt||null,departedAt:existingPU?.departedAt||null,eta:existingPU?.eta||null,photos:existingPU?.photos||[],signature:existingPU?.signature||null,
dueBy:effectivePuDue,weight:0,loadNum:hasMultiLoads?ln:1,pickupFrom:loc};
/* Placement priority:
   1. If this pickup existed before (reused id) and we recorded an anchor,
      re-insert it right before that same anchor entry — this preserves a
      position the dispatcher set manually, so a rebuild caused by an
      unrelated change elsewhere doesn't shuffle it.
   2. Otherwise (new pickup, or anchor no longer present) fall back to
      placing it before the first delivery from this location/load. */
let placed=false;
/* Anchor lookup is INDEPENDENT of the existingPU match. existingPU also gates
   on loadNum (hasMultiLoads?ln:1); if that gate fails (e.g. load bookkeeping
   shifted) we'd otherwise skip the anchor entirely and fall through to
   firstDelIdx, snapping a manually-placed pickup back in front of its first
   delivery — exactly the 'I moved them back to back and it reverted' bug.
   Match the prior pickup by (driver, stop) so the recorded position is honored
   regardless of the loadNum gate. */
/* Same load first. Matching on (driver, stop) alone means the Load 2 dock card
   finds LOAD 1's pickup here and inherits its anchor — a Load 1 delivery — so
   every rebuild splices Load 2's card into the Load 1 block, and the board
   rearranges itself again on the next rebuild. Any two-load day with a docked
   supplier hits it. The unfiltered match still stands as the FALLBACK, which is
   what the paragraph above is about: when the loadNum gate on existingPU fails,
   a manually-placed pickup must still be found rather than snapping back in
   front of its first delivery. */
const priorPU=removedPUs.find(p=>p.driverId===dId&&p.stop===puSrc.label&&(p.loadNum||1)===ln)
            ||removedPUs.find(p=>p.driverId===dId&&p.stop===puSrc.label);
if(priorPU&&Object.prototype.hasOwnProperty.call(_puAnchorById,priorPU.id)){
  const anchorId=_puAnchorById[priorPU.id];
  if(anchorId===null){/* pickup was at the array end — but an auto-pickup must
    precede its own deliveries; leave it unplaced so the delivery-based fallback
    below inserts it before its first delivery, instead of re-pinning it to the
    bottom forever (the desktop RouteBuilder-Apply "pickup at bottom" bug). */}
  else{
    const ai=all.findIndex(e=>e.id===anchorId);
    if(ai>=0){all.splice(ai,0,puEntry);placed=true;}
  }
}
if(!placed){
  const firstDelIdx=all.findIndex(e=>e.customer===cust&&e.stopType==="delivery"&&e.driverId===dId&&_normLoc(e.pickupFrom||loc)===_normLoc(loc)&&(e.loadNum||1)===ln);
  if(firstDelIdx>=0){all.splice(firstDelIdx,0,puEntry);}
  else{
    const anyDelIdx=all.findIndex(e=>e.customer===cust&&e.stopType==="delivery"&&e.driverId===dId&&(e.loadNum||1)===ln);
    if(anyDelIdx>=0)all.splice(anyDelIdx,0,puEntry);
    else all.push(puEntry);
  }
}
});
});
/* Tombstone any auto-pickup that was removed and not regenerated. Prevents
   the transactional save's FB-only-append from resurrecting an orphan
   pickup card after a reassign/delete/load-change empties a driver. */
const _orphanPus=removedPUs.filter(p=>!_reusedPuIds.has(p.id));
if(_orphanPus.length)tombstone(_orphanPus); /* auto-pickups only; pass entries for signatures */
return all;
};


/* ── Manifest mutations ──────────────────────────────────────────────────────
   The operations a dispatcher performs on a board. Extracted from App.jsx so
   SEQUENCES of them can be fuzzed against the manifest invariants — a single
   reassign being correct says nothing about a board that has had twenty
   applied to it, and drift only shows up over a sequence. */

/* Find the array index to splice-insert a new entry so that it lands at the
   BOTTOM of the specified (driver, loadNum). If the load is empty for this
   driver, inserts after the last stop of any lower load (keeps loads ordered).
   If driver has no stops yet, inserts after the last entry of any driver.
   Used by addDel, addQuoteWithPickup, assignInOrder so inserts are consistent
   and never land in the middle or top of a load unexpectedly. */
export const insertIdxForLoad=(arr,drvId,loadNum)=>{
  const ln=loadNum||1;
  /* Prefer: last entry of (drvId, same loadNum) */
  for(let i=arr.length-1;i>=0;i--){
    if(arr[i].driverId===drvId&&(arr[i].loadNum||1)===ln)return i+1;
  }
  /* Fallback: last entry of (drvId, any smaller loadNum) — keeps loads in order */
  for(let i=arr.length-1;i>=0;i--){
    if(arr[i].driverId===drvId&&(arr[i].loadNum||1)<ln)return i+1;
  }
  /* Fallback: last entry of drvId on any load (new load above existing ones — rare) */
  for(let i=arr.length-1;i>=0;i--){
    if(arr[i].driverId===drvId)return i+1;
  }
  /* Driver has no entries yet — append at the end */
  return arr.length;
};
/* `toLoad` — the load number of whatever was dropped ON (a stop, or an empty
   load's placeholder). Without it a drop could only ever permute array
   positions, and a load is a FIELD (`loadNum`), not a position: a stop dragged
   from Load 1 onto Load 2 silently stayed on Load 1, and the empty-load box
   reading "drag or assign stops here" wasn't a drop target at all — it had no
   onDragOver, so the browser never fired a drop on it. Both now route through
   reassign(), which already owns this move: it sets driver and load together,
   lands the stop at the bottom of the target load, and rebuilds the auto-pickups
   both loads need afterwards. */

/* Move an entry to a driver and (optionally) a load. `deps.rebuildPickups` is
   the bound auto-pickup engine; it runs only when the move actually changed
   something that invalidates a pickup, matching the original. */
export const applyReassign=(all,eid,did,newLoadNum,deps)=>{
  if(!Array.isArray(all))return all;
  const {rebuildPickups}=deps||{};
  const out=[...all];
  const idx=out.findIndex(e=>e&&e.id===eid);
  if(idx<0)return all;
  const cur=out[idx];
  /* Old driver/load read from the array being edited. The component version
     read them off the display list, which is the same for these two fields and
     one less thing to go stale mid-edit. */
  const oldDid=cur.driverId,oldLoad=cur.loadNum||1;
  const targetLoad=newLoadNum||oldLoad;
  const driverChanged=did!==oldDid;
  const loadChanged=!!newLoadNum&&newLoadNum!==oldLoad;
  const updated={...cur,driverId:did,...(newLoadNum?{loadNum:newLoadNum}:{})};
  if(driverChanged||loadChanged){
    /* Splice out and reinsert at the bottom of the target (driver, load) — the
       'new stops land at the bottom' contract shared with addDel. */
    out.splice(idx,1);
    if(did>0)out.splice(insertIdxForLoad(out,did,targetLoad),0,updated);
    else out.push(updated);
  }else{
    out[idx]=updated;
  }
  if((driverChanged||loadChanged)&&(updated.stopType==="delivery"||(updated.stopType==="pickup"&&updated.manualPickup))
     &&typeof rebuildPickups==="function"){
    return rebuildPickups(out,updated.customer);
  }
  return out;
};

/* Change only an entry's load, in place. */
export const applySetLoadNum=(all,eid,n,deps)=>{
  if(!Array.isArray(all))return all;
  const {rebuildPickups}=deps||{};
  const out=all.map(e=>(e&&e.id===eid?{...e,loadNum:n}:e));
  const entry=out.find(e=>e&&e.id===eid);
  if(entry&&entry.stopType==="delivery"&&typeof rebuildPickups==="function")
    return rebuildPickups(out,entry.customer);
  return out;
};

/* Replace a driver's stops with `nextOrder`, in their existing array slots so
   other drivers' stops never shift. The length-mismatch fallback rebuilds the
   list instead — it is the one path here that can change WHICH stops exist, so
   the invariant suite checks stop conservation over every reorder. */
export const reorderDriverBlock=(all,drvId,nextOrder)=>{
  const slots=[];
  all.forEach((e,i)=>{if(e&&e.driverId===drvId)slots.push(i);});
  if(slots.length!==nextOrder.length)return[...all.filter(e=>!(e&&e.driverId===drvId)),...nextOrder];
  const out=all.slice();
  slots.forEach((idx,k)=>{out[idx]=nextOrder[k];});
  return out;
};

/* The ▲▼ buttons: swap a stop with its neighbour inside the same (driver, load)
   group, so a nudge can never jump a stop into another load. */
export const applyMoveInDriver=(all,drvId,entryId,dir)=>{
  if(!Array.isArray(all))return all;
  const out=[...all];
  const fromIdx=out.findIndex(e=>e&&e.id===entryId);
  if(fromIdx<0)return all;
  const moving=out[fromIdx];
  if(moving.driverId!==drvId)return all;
  const moveLoad=moving.loadNum||1;
  /* Moving a DELIVERY swaps it with the next delivery, stepping over any pickup
     between them. Swapping with a pickup instead made the arrow look broken: the
     swap happened, then the ordering pass put the pickup back above the
     deliveries it supplies, and the stop had not moved. Pickups are placed by
     the engine, so they are not the dispatcher's to reorder — nudging a manual
     pickup still walks the whole group. */
  const stepOverPickups=moving.stopType==="delivery";
  const neighbors=[];
  for(let i=0;i<out.length;i++){
    const e=out[i];
    if(!e||e.driverId!==drvId||(e.loadNum||1)!==moveLoad)continue;
    if(stepOverPickups&&e.stopType!=="delivery")continue;
    neighbors.push(i);
  }
  const targetPos=neighbors.indexOf(fromIdx)+dir;
  if(targetPos<0||targetPos>=neighbors.length)return all;
  const toIdx=neighbors[targetPos];
  [out[fromIdx],out[toIdx]]=[out[toIdx],out[fromIdx]];
  return out;
};

/* Route-planner Apply: impose an explicit order on a driver's stops. The id list
   from the desktop RouteBuilder holds DELIVERIES only, so orderByIds strands the
   auto-pickups at the end; rebuilding each affected customer puts them back in
   front of their first delivery. */
export const applyReorderDriver=(all,drvId,orderedIds,deps)=>{
  if(!Array.isArray(all))return all;
  const {rebuildPickups,orderByIds:obi}=deps||{};
  if(typeof obi!=="function")return all;
  const drvEntries=all.filter(e=>e&&e.driverId===drvId);
  let out=reorderDriverBlock(all,drvId,obi(drvEntries,orderedIds));
  if(typeof rebuildPickups==="function"){
    [...new Set(drvEntries.filter(e=>e.stopType==="delivery").map(e=>e.customer))]
      .forEach(c=>{out=rebuildPickups(out,c);});
  }
  return out;
};

/* Same-driver drag reorder: lift the grabbed stop out of the driver's block and
   drop it at `toIdx`. Resolved by id, not the drag-start index, which can go
   stale if a sync reorders the list mid-drag. */
export const applyDropReorder=(all,drvId,srcId,srcIdxFallback,toIdx)=>{
  if(!Array.isArray(all))return all;
  const de=all.filter(e=>e&&e.driverId===drvId);
  const srcIdx=srcId!=null?de.findIndex(e=>e.id===srcId):srcIdxFallback;
  if(srcIdx<0||srcIdx>=de.length)return all;
  const[moved]=de.splice(srcIdx,1);
  de.splice(Math.min(Math.max(toIdx,0),de.length),0,moved);
  return reorderDriverBlock(all,drvId,de);
};

/* ── What the driver actually reads ──────────────────────────────────────────
   The text under a stop's address. Correct underlying data still misleads if
   this renders the wrong origin, or demands a dock choice the board already
   answers — the "⚠ pick location" prompt with no right answer. Extracted so the
   label can be checked against the pickup cards on the same board. */
export const resolvePickupLabel=(entry,siblings)=>{
  const pf=entry.pickupFrom;
  const cust=entry.customer;
  /* Which multi-pickup customer is this stop tied to? It can be named either
     in `customer` (e.g. a Traditions delivery) or carried in `pickupFrom`
     (e.g. a Quote Delivery whose load originates at Traditions). */
  let multiCust=null;
  if(cust&&MULTI_PICKUP[cust])multiCust=cust;
  else if(pf&&MULTI_PICKUP[pf])multiCust=pf;
  if(multiCust){
    const locs=MULTI_PICKUP[multiCust];
    /* A specific location is present if pickupFrom names one of the source
       labels, or the short location word inside them (Alpharetta/Atlanta). */
    const specific=pf&&pf!==multiCust&&locs.some(l=>{
      const shortLoc=l.label.split(" - ").pop();
      return pf===l.label||pf===shortLoc||pf.includes(shortLoc);
    });
    if(specific)return{text:pf.includes(" - ")?pf:(multiCust+" — "+pf),ambiguous:false};
    /* No dock named — but a MANUAL pickup on this load may already say where the
       load comes from (e.g. collected at MTI in Sugar Hill, delivered to Emser
       Norcross). Asking "Norcross or Roswell?" there offers no correct answer,
       and either chip would record a pickup that never happened. */
    const manualSrc=manualPickupOrigin(entry,siblings);
    if(manualSrc)return{text:manualSrc,ambiguous:false};
    /* A supplier may nominate a default dock. `defaulted` marks the difference
       between "resolved because someone chose" and "resolved because this is
       where it usually comes from" — the card still offers the dock chips on a
       defaulted stop so switching to the other dock stays one click. */
    const def=locs.find(l=>l.default);
    if(def)return{text:def.label,ambiguous:false,defaulted:true};
    return{text:multiCust+" — ⚠ pick location",ambiguous:true};
  }
  /* Single-location or no special handling — original behavior. */
  if(pf&&pf.includes(" - "))return{text:pf,ambiguous:false};
  return{text:cust+(pf?" — "+pf:""),ambiguous:false};
};


/* Turn a bare pickup location into one that names its supplier: "Alpharetta" ->
   "Traditions - Alpharetta". A history row reading "from Traditions In Tile"
   cannot tell you which of Alpharetta / Atlanta / Bogart the freight came off.

   Both call sites used to resolve against MULTI_PICKUP[the DELIVERY's customer].
   That works for a Traditions delivery and fails for a Quote Delivery collected
   at Traditions: its customer is "Quote Delivery", which owns no docks, so the
   lookup missed and the bare name was stored. Hence the same board showing
   "from Traditions - Atlanta" on one row and "from Traditions In Tile" on the
   next.

   Order matters. The delivery's OWN customer wins first, so a short name
   resolves to their branch. Only then do we look across suppliers, and only
   when exactly one owns a location by that name — "Norcross" belongs to Emser,
   Florida Tile, Specialty, IMETCO, Crossville and Prolex alike, and guessing
   between them would put a confident wrong address on a driver's card. */
export const qualifyPickupName=(rawPU,customerName,multiPickup)=>{
  const raw=String(rawPU==null?"":rawPU).trim();
  if(!raw||raw.includes(" - "))return raw;
  const hit=(locs)=>Array.isArray(locs)?locs.find(l=>l&&(l.label===raw||String(l.label||"").split(" - ").pop()===raw)):null;
  const mine=hit(multiPickup&&multiPickup[customerName]);
  if(mine)return mine.label;
  let found=null,owners=0;
  Object.values(multiPickup||{}).forEach(locs=>{const m=hit(locs);if(m){owners++;if(!found)found=m;}});
  return owners===1?found.label:raw;
};

/* ── Finishing Dynamics dock cutoff ─────────────────────────────────────────
   Villa Rica stops taking and releasing freight at 3:00 PM Monday–Thursday and
   2:00 PM on Friday. A truck that rolls up after that gets turned away and the
   load rides back to the yard, so the board flags any Finishing Dynamics stop
   with the day's cutoff instead of letting the dispatcher hear about it from
   the driver at 3:15.

   The index is the board's own `sd` — 0=Mon … 4=Fri. The board never renders a
   weekend, so there is no Sat/Sun entry and no invented weekend policy: an
   index outside 0–4 simply has no cutoff and raises no flag. */
export const FD_CUTOFF_BY_DAY=[15*60,15*60,15*60,15*60,14*60];

export const fdCutoffMins=(dayIdx)=>{
  /* Strictly a number: Number(null) and Number("") are both 0, and coercing a
     missing day into Monday would quietly stamp the wrong cutoff. */
  if(typeof dayIdx!=="number"||!Number.isInteger(dayIdx))return null;
  return dayIdx>=0&&dayIdx<FD_CUTOFF_BY_DAY.length?FD_CUTOFF_BY_DAY[dayIdx]:null;
};

/* 900 → "3:00 PM". Kept here so the badge, the tooltip and the AI prompt all
   spell the cutoff the same way. */
export const fmtClock=(mins)=>{
  const m=Math.max(0,Math.round(Number(mins)||0));
  const h24=Math.floor(m/60)%24,mm=m%60;
  const ap=h24>=12?"PM":"AM";
  const h12=h24%12===0?12:h24%12;
  return h12+":"+String(mm).padStart(2,"0")+" "+ap;
};

/* Does this stop actually put a truck at the Villa Rica dock?

   Four shapes reach the board and all four count:
     - the auto pickup dock  "Finishing Dynamics - Villa Rica"
     - IMETCO's named runs   "IMETCO to Finishing Dynamics" (delivering INTO the
       dock), "Finishing Dynamics to IMETCO" and "Round Trip IMETCO &
       Finishing Dynamics" (collecting FROM it)
     - a delivery whose pickupFrom points at the dock
     - a one-off/quote typed with the Villa Rica address

   IMETCO's board shortens the dock to its city ("Villa Rica" via
   IMETCO_PICKUP_MAP), so that spelling is matched too — but only for IMETCO, so
   an unrelated customer with a Villa Rica address doesn't inherit IMETCO's
   dock hours. */
const _fdName=(v)=>typeof v==="string"&&v.toLowerCase().includes("finishing dynamics");
export const touchesFinishingDynamics=(entry)=>{
  if(!entry)return false;
  if(_fdName(entry.stop)||_fdName(entry.pickupFrom))return true;
  const addr=(String(entry.addr||"")+" "+String(entry.pickupAddr||"")).toLowerCase();
  if(addr.includes("28 andrews way"))return true;
  if(entry.customer==="IMETCO"&&String(entry.pickupFrom||"").trim().toLowerCase()==="villa rica")return true;
  return false;
};

/* The flag itself. Pure: everything time-dependent arrives as an argument so
   the suite can drive it to any minute of any weekday.

   opts.dayIdx   the board's `sd` for the day being displayed (0=Mon … 4=Fri)
   opts.now      epoch ms, only consulted when isToday
   opts.isToday  is the displayed day the actual calendar day? A Thursday board
                 opened on Tuesday still shows the 3:00 PM cutoff, but "you have
                 40 minutes" would be a lie, so urgency is today-only.
   opts.warnLead minutes before the cutoff that "info" escalates to "soon"

   Returns null when there is nothing to say — not a Finishing Dynamics stop, no
   cutoff for that day, or the stop is already departed (it made it; a red badge
   on a finished stop is just noise). */
export const finishingDynamicsFlag=(entry,opts)=>{
  const o=opts||{};
  if(!touchesFinishingDynamics(entry))return null;
  const cutoff=fdCutoffMins(o.dayIdx);
  if(cutoff==null)return null;
  if(entry&&entry.status==="departed")return null;
  const cutoffText=fmtClock(cutoff);
  const base={cutoff,cutoffText};
  if(!o.isToday)return{...base,level:"info",text:"FD CLOSES "+cutoffText,minsLeft:null,
    title:"Finishing Dynamics closes at "+cutoffText+" on this day (3:00 PM Mon–Thu, 2:00 PM Fri)."};
  const nowMs=typeof o.now==="number"?o.now:Date.now();
  const nowD=new Date(nowMs);
  const nowMins=nowD.getHours()*60+nowD.getMinutes();
  const minsLeft=cutoff-nowMins;
  if(minsLeft<=0)return{...base,level:"late",minsLeft,text:"PAST FD "+cutoffText+" CUTOFF",
    title:"Finishing Dynamics closed at "+cutoffText+". This stop will not be worked today."};

  /* A live ETA can miss the cutoff while the clock still looks fine — a 3:20
     arrival at 2:35 is the case worth catching, because it is still early
     enough to resequence the load. */
  const etaMins=parseInt(entry&&entry.eta,10);
  if(Number.isFinite(etaMins)&&etaMins>0){
    const setAt=typeof entry.etaSetAt==="number"?entry.etaSetAt:nowMs;
    const arrD=new Date(setAt+etaMins*60000);
    const arrMins=arrD.getHours()*60+arrD.getMinutes();
    const sameDay=arrD.getFullYear()===nowD.getFullYear()&&arrD.getMonth()===nowD.getMonth()&&arrD.getDate()===nowD.getDate();
    if(sameDay&&arrMins>cutoff)return{...base,level:"late",minsLeft,etaMins:arrMins,
      text:"ETA "+fmtClock(arrMins)+" — MISSES FD "+cutoffText,
      title:"ETA is "+fmtClock(arrMins)+", after the "+cutoffText+" Finishing Dynamics cutoff. Reorder the load or it comes back."};
  }

  const warnLead=Number.isFinite(o.warnLead)?o.warnLead:90;
  if(minsLeft<=warnLead)return{...base,level:"soon",minsLeft,
    text:"FD CLOSES "+cutoffText+" · "+minsLeft+"m",
    title:minsLeft+" minutes left before Finishing Dynamics closes at "+cutoffText+"."};
  return{...base,level:"info",minsLeft,text:"FD CLOSES "+cutoffText,
    title:"Finishing Dynamics closes at "+cutoffText+" (3:00 PM Mon–Thu, 2:00 PM Fri)."};
};

/* Badge palette, kept next to the levels that name it so a new level can't
   silently render untinted. */
export const FD_FLAG_COLORS={
  info:{bg:"#fef3c7",fg:"#92400e",bd:"#fde68a"},
  soon:{bg:"#f59e0b",fg:"#fff",bd:"#d97706"},
  late:{bg:"#dc2626",fg:"#fff",bd:"#b91c1c"},
};

/* Which drivers get a live truck pin on the map.

   Same rule the rest of the board runs on (see `visibleDrivers` in App.jsx): a
   driver toggled OFF in Manage Drivers is out of the current fleet, UNLESS
   they are carrying stops on the board being shown — hiding the truck of
   someone who is actually out running stops would be worse than showing one
   too many.

   `active===false` is the only value that hides. undefined and true both count
   as active, so drivers on the roster before the field existed keep working.

   Motive reports the whole fleet, and every vehicle whose driver name matches
   anyone on the roster used to paint a pin. That is how a four-driver day ended
   up with seven trucks on the map. */
export const visibleTruckDriverIds=(drivers,stops)=>{
  const onBoard=new Set();
  (stops||[]).forEach(s=>{const id=s&&s.driverId;if(typeof id==="number"&&id>0)onBoard.add(id);});
  const out=new Set();
  (drivers||[]).forEach(d=>{if(d&&(d.active!==false||onBoard.has(d.id)))out.add(d.id);});
  return out;
};

/* Display order for the Manage Drivers list.

   The current fleet comes first, in roster order — that order is meaningful, it
   picks each driver's colour (DCOL[i]) and their column on the board, so it is
   never re-sorted. Everyone hidden follows, alphabetically by the name as
   displayed. On a twenty-name roster with three actives, insertion order means
   reading the whole list to find someone.

   Returns {d, i} pairs, NOT a reordered driver array: `i` is the driver's
   canonical index in `drivers`, and the colour swatch has to keep using it or
   the modal would show a different colour than the board. */
export const orderRosterRows=(drivers)=>{
  const rows=(drivers||[]).map((d,i)=>({d,i}));
  const isActive=(r)=>!!r.d&&r.d.active!==false;
  const nameOf=(r)=>String((r.d&&r.d.name)||"");
  const hidden=rows.filter(r=>!isActive(r));
  hidden.sort((a,b)=>{
    const c=nameOf(a).trim().localeCompare(nameOf(b).trim(),undefined,{sensitivity:"base",numeric:true});
    return c!==0?c:a.i-b.i; /* same name twice — fall back to roster order so it never jitters */
  });
  return rows.filter(isActive).concat(hidden);
};
