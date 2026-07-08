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
      if(loc)g.docks.add(loc); else g.wild=true;
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
     - start from local (preserves dispatcher order + not-yet-synced adds);
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
export const buildMergedEntries=(fbEntriesRaw,localEntriesRaw,{isDriver=false,callerDriverId=0,deletedIds=null,multiSource=null,normLoc=null}={})=>{
  const fbEntries=dedupeIds(fbEntriesRaw||[]);
  const localEntries=dedupeIds(localEntriesRaw||[]);
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
    if(fbE&&fbE.id&&!localById[fbE.id]&&!usedFbIds.has(fbE.id)&&!tomb.has(fbE))merged.push(fbE);
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
    if(tomb.has(fbE))return; /* explicitly deleted — stays gone */
    merged.push(fbE);
  });
  /* Orphan reap LAST, after the delivery safety-net re-append, so a rescued
     delivery keeps its pickup. Self-heals any orphan already persisted in
     Firebase: the merge drops it, and the transaction write makes that stick. */
  return reapOrphanAutoPickups(dedupeAutoPickups(merged),multiSource?{multiSource,normLoc}:undefined);
};
