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
export const dedupeAutoPickups=(entries)=>{
  if(!Array.isArray(entries))return entries;
  const seen=new Set();
  let changed=false;
  const out=entries.filter(e=>{
    if(!e||e.stopType!=="pickup"||e.manualPickup)return true;
    if(!e.driverId||e.driverId===0){changed=true;return false;}
    const key=[e.customer||"",e.stop||"",e.driverId,e.loadNum||1].join("|");
    if(seen.has(key)){changed=true;return false;}
    seen.add(key);
    return true;
  });
  return changed?out:entries;
};

/* Status only ever advances (null → arrived → departed), never backward. */
export const STATUS_RANK={null:0,undefined:0,"":0,"arrived":1,"departed":2};
export const DRIVER_OWNED_FIELDS=["status","arrivedAt","departedAt","photos","signature","shipPlan","eta","etaDest","etaSetAt"];

export const _mergeEntryDriver=(localE,fbE)=>{
  /* Caller is the driver assigned to this entry. Take local's driver-owned
     fields (with forward-only status) and FB's everything-else. */
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
  /* Caller is dispatcher. Local wins on dispatcher fields (rate, instructions,
     addr, order, etc.), FB wins on driver-stamped fields. Forward-only for
     status and never-clobber for timestamps. */
  const out={...localE};
  const localRank=STATUS_RANK[localE.status]??0;
  const fbRank=STATUS_RANK[fbE.status]??0;
  if(fbRank>localRank)out.status=fbE.status;
  if(!localE.arrivedAt&&fbE.arrivedAt)out.arrivedAt=fbE.arrivedAt;
  if(!localE.departedAt&&fbE.departedAt)out.departedAt=fbE.departedAt;
  const lp=localE.photos||[],fp=fbE.photos||[];
  const seen=new Set();
  const merged=[];
  const real=(p)=>typeof p==="string"&&p.startsWith("https://");
  fp.forEach(p=>{if(real(p)&&!seen.has(p)){seen.add(p);merged.push(p);}});
  lp.forEach(p=>{if(real(p)&&!seen.has(p)){seen.add(p);merged.push(p);}});
  if(!fp.some(real)){lp.forEach(p=>{if(!real(p)&&!seen.has(p)){seen.add(p);merged.push(p);}});}
  out.photos=merged;
  if(fbE.signature&&(!localE.signature||localE.signature==="signed"))out.signature=fbE.signature;
  if(fbE.shipPlan&&!localE.shipPlan)out.shipPlan=fbE.shipPlan;
  if(fbE.eta&&!localE.eta){out.eta=fbE.eta;out.etaDest=fbE.etaDest;out.etaSetAt=fbE.etaSetAt;}
  return out;
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
    isHourly:!!e.isHourly,
    priority:!!e.priority,
    liftgateApplied:!!e.liftgateApplied,
    knownLiftgate:!!e.knownLiftgate,
    wasSplit:!!e.wasSplit,
  };
}

/* The heart of multi-writer reconciliation, used inside saveManifestDay's
   Firestore transaction. Given the current FB array and the caller's local
   array, produce the array to persist:
     - both id-repaired first (dedupeIds);
     - start from local (preserves dispatcher order + not-yet-synced adds);
     - per local entry, merge with FB per ownership (dispatcher vs the driver
       it's assigned to); a driver drops any stop FB no longer has (honors a
       dispatcher delete instead of resurrecting it);
     - append FB-only entries that aren't tombstoned (genuine concurrent adds),
       so a delete the caller just made doesn't come back;
     - collapse duplicate auto-pickups.
   Pure: same inputs → same output, no I/O. This is the surface the concurrency
   test suite locks down. */
export const buildMergedEntries=(fbEntriesRaw,localEntriesRaw,{isDriver=false,callerDriverId=0,deletedIds=null}={})=>{
  const fbEntries=dedupeIds(fbEntriesRaw||[]);
  const localEntries=dedupeIds(localEntriesRaw||[]);
  const fbById={};
  fbEntries.forEach(e=>{if(e&&e.id)fbById[e.id]=e;});
  const localById={};
  localEntries.forEach(e=>{if(e&&e.id)localById[e.id]=e;});
  const merged=localEntries.map(localE=>{
    if(!localE||!localE.id)return localE;
    const fbE=fbById[localE.id];
    if(isDriver){
      if(localE.driverId!==callerDriverId){return fbE?fbE:null;}
      if(!fbE)return null;
      return _mergeEntryDriver(localE,fbE);
    }else{
      if(!fbE)return localE;
      return _mergeEntryDispatcher(localE,fbE);
    }
  }).filter(Boolean);
  const tomb=deletedIds instanceof Set?deletedIds:new Set(deletedIds||[]);
  fbEntries.forEach(fbE=>{
    if(fbE&&fbE.id&&!localById[fbE.id]&&!tomb.has(fbE.id))merged.push(fbE);
  });
  return dedupeAutoPickups(merged);
};
