/* ordersStore.js — Phase 2 of the sync redesign (docs/SYNC_REDESIGN.md §2/§4):
   one Firestore document per order, so the DATABASE handles concurrency instead
   of a client-side array merge.

   Layout: orders/{YYYY-MM-DD}/items/{orderId} — a day-scoped subcollection
   rather than the doc's original top-level `orders` + where(date==) query. Same
   properties (one doc per order, stable id, per-doc writes, real deletes, one
   shared stream per day), but it works with the app's existing Firebase adapter
   (`onCol` subscribes a collection; there is no query op) and needs no index.

   This module is PURE (no Firebase, no React) so the conversion, diffing, and
   parity rules are unit-testable — same seam as manifestLogic.js. The App wires
   these into _fbOps behind the dd_orders_v2 flag:
     off    → nothing happens (default; this code is dark in production)
     shadow → every array-doc save also diff-writes the per-order docs, and a
              live parity check reports drift; the board still reads the array
   Read cutover ("on") is the next increment, once shadow parity holds live. */

/* Deterministic stringify — recursively sorts object keys so two copies of the
   same order compare equal regardless of key insertion order (a doc read back
   from Firestore vs a local entry). Arrays keep their order (photos, etc.). */
const _sorted=(v)=>{
  if(Array.isArray(v))return v.map(_sorted);
  if(v&&typeof v==="object"){
    const o={};
    Object.keys(v).sort().forEach(k=>{o[k]=_sorted(v[k]);});
    return o;
  }
  return v;
};
export const stableStr=(v)=>JSON.stringify(_sorted(v));

/* Firestore path segment for an order id. Entry ids are genId()/dedupeIds
   strings (base36, path-safe); "/" is impossible from those generators but a
   legacy id must never split the path. */
export const orderDocId=(id)=>String(id).replace(/\//g,"_");

/* Entry → order document. Adds the storage-only fields (_date for provenance,
   _seq for ordering within the day) and strips undefined values (Firestore
   rejects them) via a JSON round-trip. Returns null for an entry with no id —
   ids are guaranteed by ingest (dedupeIds), so that only guards junk. */
export const entryToOrderDoc=(entry,dateKey,seq)=>{
  if(!entry||typeof entry!=="object"||entry.id==null)return null;
  let clean;
  try{clean=JSON.parse(JSON.stringify(entry));}catch(e){return null;}
  return{...clean,_date:String(dateKey||""),_seq:typeof seq==="number"?seq:0};
};

/* Order documents → the day's entries array: sort by _seq (stable tiebreak on
   id so every device assembles the identical order), strip the storage-only
   fields. This is the future read path; today it powers the parity check. */
export const orderDocsToEntries=(docs)=>{
  return(Array.isArray(docs)?docs:[])
    .filter(d=>d&&typeof d==="object"&&d.id!=null)
    .slice()
    .sort((a,b)=>{
      const sa=typeof a._seq==="number"?a._seq:Infinity;
      const sb=typeof b._seq==="number"?b._seq:Infinity;
      return sa-sb||String(a.id).localeCompare(String(b.id));
    })
    .map(d=>{const e={...d};delete e._date;delete e._seq;return e;});
};

/* Diff the day's saved entries against the order docs currently in the store.
   Returns {sets, deletes, skipped}:
     sets    — full docs to write (new orders + orders whose content or position
               changed). _seq is the array index ×1000; an insert/reorder only
               rewrites the displaced docs, and writes are one small doc each.
     deletes — ids present in the store but no longer in the day (real deletes —
               the array's tombstone dance becomes deleteDoc).
     skipped — entries with no id or a duplicate id (first occurrence wins; the
               dedupe layers own collapsing those upstream).
   Content comparison uses stableStr, so an unchanged order NEVER produces a
   write no matter how Firestore ordered its keys. */
export const diffOrderDocs=(currentDocs,entries,dateKey)=>{
  const curById=new Map();
  (Array.isArray(currentDocs)?currentDocs:[]).forEach(d=>{
    if(d&&typeof d==="object"&&d.id!=null)curById.set(String(d.id),d);
  });
  const sets=[];const seen=new Set();let skipped=0;
  (Array.isArray(entries)?entries:[]).forEach((e,i)=>{
    const doc=entryToOrderDoc(e,dateKey,i*1000);
    if(!doc){skipped++;return;}
    const key=String(doc.id);
    if(seen.has(key)){skipped++;return;}
    seen.add(key);
    const cur=curById.get(key);
    if(!cur||stableStr(cur)!==stableStr(doc))sets.push(doc);
  });
  const deletes=[];
  curById.forEach((_d,key)=>{if(!seen.has(key))deletes.push(key);});
  return{sets,deletes,skipped};
};

/* Parity between the shadow store and the array-doc board: are they the same
   set of orders with the same content? Order-insensitive, ignores the storage
   fields, and normalizes both sides through JSON (undefined vs absent is not a
   difference). Transient mismatches while an edit is mid-debounce are expected;
   persistent ones mean the dual-write missed something. */
export const ordersParity=(docs,entries)=>{
  const docsById=new Map();
  orderDocsToEntries(docs).forEach(e=>{docsById.set(String(e.id),e);});
  const entsById=new Map();
  (Array.isArray(entries)?entries:[]).forEach(e=>{
    if(!e||e.id==null)return;
    const k=String(e.id);
    if(!entsById.has(k)){
      try{entsById.set(k,JSON.parse(JSON.stringify(e)));}catch(err){/* junk entry — parity can't compare it */}
    }
  });
  const missing=[];const differing=[];
  entsById.forEach((e,k)=>{
    const d=docsById.get(k);
    if(!d){missing.push(k);return;}
    if(stableStr(d)!==stableStr(e))differing.push(k);
  });
  const extra=[];
  docsById.forEach((_d,k)=>{if(!entsById.has(k))extra.push(k);});
  return{
    inSync:!missing.length&&!extra.length&&!differing.length,
    missing,extra,differing,
    docCount:docsById.size,entryCount:entsById.size,
  };
};
