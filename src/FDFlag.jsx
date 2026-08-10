import { useState, useEffect } from "react";
import { finishingDynamicsFlag, FD_FLAG_COLORS } from "./manifestLogic.js";

/* 🚩 badge for the Finishing Dynamics dock cutoff — 3:00 PM Mon–Thu, 2:00 PM
   Fri. Renders nothing for every other stop, so it is safe to drop into any
   badge row.

   day    the board's `sd` (0=Mon … 4=Fri) for the day being displayed
   today  is the displayed day the actual calendar day? Only then does a
          countdown mean anything
   now    epoch ms, ticked by useMinuteTick so the countdown moves on its own

   Sizes match the badge rows it sits in: xs for the packed route-planner and
   mobile chips, sm for the standard board card, lg for the roomy detail card. */
const SIZES={
  xs:{fontSize:8,padding:"1px 4px",borderRadius:2},
  sm:{fontSize:9,padding:"1px 5px",borderRadius:3},
  lg:{fontSize:11,padding:"2px 7px",borderRadius:5},
};

export function FDFlag({entry,day,today,now,size="sm"}){
  const f=finishingDynamicsFlag(entry,{dayIdx:day,isToday:!!today,now});
  if(!f)return null;
  const c=FD_FLAG_COLORS[f.level]||FD_FLAG_COLORS.info;
  const px=SIZES[size]||SIZES.sm;
  return(<span title={f.title} data-fd-level={f.level}
    style={{...px,background:c.bg,color:c.fg,border:"1px solid "+c.bd,fontWeight:700,display:"inline-flex",alignItems:"center",gap:2,whiteSpace:"nowrap"}}>
    {"\u{1F6A9}"} {f.text}
  </span>);
}

/* One shared clock tick, so the cutoff countdown moves without a reload. A
   single 30s timer per view beats one per card, and it only runs when the
   board is on the real calendar day — every other day's badge is static, so
   ticking there would re-render the tree for nothing. */
export function useMinuteTick(enabled){
  const[now,setNow]=useState(()=>Date.now());
  useEffect(()=>{
    if(!enabled)return;
    const id=setInterval(()=>setNow(Date.now()),30000);
    return()=>clearInterval(id);
  },[enabled]);
  return now;
}
