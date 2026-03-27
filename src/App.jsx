import { useState, useCallback, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════
   FIREBASE — glorybounddispatch project
   Loaded via CDN so no npm install needed on Netlify.
   All data syncs in real-time across every device.
══════════════════════════════════════════════════════════════ */
const _fbCfg={apiKey:"AIzaSyB29mVeZXedDhLVT3eMVgl07EsOneWCUu4",authDomain:"glorybounddispatch.firebaseapp.com",projectId:"glorybounddispatch",storageBucket:"glorybounddispatch.appspot.com",messagingSenderId:"",appId:""};

/* Lazy-load Firebase SDK from CDN — resolves once loaded */
let _fbResolve,_fbReject;
const _fbReady=new Promise((res,rej)=>{_fbResolve=res;_fbReject=rej;});
(()=>{
  if(window._fbLoaded){_fbResolve();return;}
  const s=document.createElement("script");
  s.type="module";
  s.textContent=`
    import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import{getFirestore,doc,setDoc,getDoc,onSnapshot,collection,addDoc,updateDoc,deleteDoc,serverTimestamp,query,orderBy}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
    const app=initializeApp(${JSON.stringify(_fbCfg)});
    const db=getFirestore(app);
    window._fb={db,doc,setDoc,getDoc,onSnapshot,collection,addDoc,updateDoc,deleteDoc,serverTimestamp,query,orderBy};
    window._fbLoaded=true;
    window.dispatchEvent(new Event("fb_ready"));
  `;
  document.head.appendChild(s);
  window.addEventListener("fb_ready",()=>_fbResolve(),{once:true});
  setTimeout(()=>_fbReject("Firebase load timeout"),10000);
})();

const _db=()=>window._fb?.db;
const _col=(...args)=>window._fb?.collection(...args);
const _doc=(...args)=>window._fb?.doc(...args);
const DAYNAMES_FB=["Mon","Tue","Wed","Thu","Fri"];

/* ── Manifest ── */
const saveManifestDay=async(wo,sd,entries)=>{
  await _fbReady.catch(()=>{});
  if(!_db())return;
  const key=`${wo}-${DAYNAMES_FB[sd]}`;
  /* Strip base64 photos before saving to Firestore (keep refs only) */
  const safe=entries.map(e=>({...e,photos:(e.photos||[]).map((_,i)=>`photo_${e.id}_${i}`),signature:e.signature?"signed":null}));
  await window._fb.setDoc(window._fb.doc(_db(),"manifests",key),{entries:safe,updatedAt:Date.now()});
};
const subscribeManifests=(wo,cb)=>{
  if(!window._fbLoaded){
    const h=()=>{
      const unsubs=DAYNAMES_FB.map((abbr,i)=>{
        const key=`${wo}-${abbr}`;
        return window._fb.onSnapshot(window._fb.doc(_db(),"manifests",key),snap=>{
          if(snap.exists())cb({[key]:snap.data().entries||[]});
        });
      });
      window._fbManifestUnsubs=window._fbManifestUnsubs||[];
      window._fbManifestUnsubs.push(...unsubs);
    };
    window.addEventListener("fb_ready",h,{once:true});
    return()=>{window.removeEventListener("fb_ready",h);};
  }
  const unsubs=DAYNAMES_FB.map((abbr)=>{
    const key=`${wo}-${abbr}`;
    return window._fb.onSnapshot(window._fb.doc(_db(),"manifests",key),snap=>{
      if(snap.exists())cb({[key]:snap.data().entries||[]});
    });
  });
  return()=>unsubs.forEach(u=>u());
};

/* ── Drivers ── */
const saveDrivers=async(drivers)=>{
  await _fbReady.catch(()=>{});
  if(!_db())return;
  await window._fb.setDoc(window._fb.doc(_db(),"config","drivers"),{drivers,updatedAt:Date.now()});
};
const subscribeDrivers=(cb)=>{
  const run=()=>{
    return window._fb.onSnapshot(window._fb.doc(_db(),"config","drivers"),snap=>{
      if(snap.exists()&&snap.data().drivers?.length)cb(snap.data().drivers);
    });
  };
  if(window._fbLoaded)return run();
  let unsub=()=>{};
  window.addEventListener("fb_ready",()=>{unsub=run();},{once:true});
  return()=>unsub();
};

/* ── Emser hours ── */
const saveEmserHours=async(key,hours)=>{
  await _fbReady.catch(()=>{});
  if(!_db())return;
  await window._fb.setDoc(window._fb.doc(_db(),"emserHours",key),{hours,updatedAt:Date.now()});
};
const subscribeEmserHours=(cb)=>{
  const run=()=>{
    return window._fb.onSnapshot(window._fb.collection(_db(),"emserHours"),snap=>{
      const data={};snap.forEach(d=>{data[d.id]=d.data().hours;});cb(data);
    });
  };
  if(window._fbLoaded)return run();
  let unsub=()=>{};
  window.addEventListener("fb_ready",()=>{unsub=run();},{once:true});
  return()=>unsub();
};

/* ── Emser shifts ── */
const saveEmserShifts=async(dayKey,shifts)=>{
  await _fbReady.catch(()=>{});
  if(!_db())return;
  await window._fb.setDoc(window._fb.doc(_db(),"emserShifts",dayKey),{shifts,updatedAt:Date.now()});
};
const subscribeEmserShifts=(cb)=>{
  const run=()=>{
    return window._fb.onSnapshot(window._fb.collection(_db(),"emserShifts"),snap=>{
      const data={};snap.forEach(d=>{data[d.id]=d.data().shifts||[];});cb(data);
    });
  };
  if(window._fbLoaded)return run();
  let unsub=()=>{};
  window.addEventListener("fb_ready",()=>{unsub=run();},{once:true});
  return()=>unsub();
};

/* ── Dispatch notes ── */
const saveDispatchNote=async(dayKey,note)=>{
  await _fbReady.catch(()=>{});
  if(!_db())return;
  await window._fb.setDoc(window._fb.doc(_db(),"dispatchNotes",dayKey),{note,updatedAt:Date.now()});
};
const subscribeDispatchNotes=(cb)=>{
  const run=()=>{
    return window._fb.onSnapshot(window._fb.collection(_db(),"dispatchNotes"),snap=>{
      const data={};snap.forEach(d=>{data[d.id]=d.data().note||"";});cb(data);
    });
  };
  if(window._fbLoaded)return run();
  let unsub=()=>{};
  window.addEventListener("fb_ready",()=>{unsub=run();},{once:true});
  return()=>unsub();
};

/* ── Notifications ── */
const sendNotificationToDriver=async(driverId,msg,type)=>{
  await _fbReady.catch(()=>{});
  if(!_db())return;
  const col=window._fb.collection(_db(),"notifications",String(driverId),"items");
  await window._fb.addDoc(col,{msg,type,time:Date.now(),read:false});
};
const subscribeNotifications=(driverId,cb)=>{
  const run=()=>{
    const col=window._fb.collection(_db(),"notifications",String(driverId),"items");
    return window._fb.onSnapshot(col,snap=>{
      cb(snap.docs.map(d=>({id:d.id,...d.data()})));
    });
  };
  if(window._fbLoaded)return run();
  let unsub=()=>{};
  window.addEventListener("fb_ready",()=>{unsub=run();},{once:true});
  return()=>unsub();
};
const markNotificationRead=async(driverId,notifId)=>{
  await _fbReady.catch(()=>{});
  if(!_db())return;
  await window._fb.updateDoc(window._fb.doc(_db(),"notifications",String(driverId),"items",notifId),{read:true});
};

/* ── Quotes ── */
const saveQuoteToFB=async(quote)=>{
  await _fbReady.catch(()=>{});
  if(!_db())return;
  await window._fb.setDoc(window._fb.doc(_db(),"quotes",String(quote.id)),{...quote,updatedAt:Date.now()});
};
const deleteQuoteFromFB=async(quoteId)=>{
  await _fbReady.catch(()=>{});
  if(!_db())return;
  await window._fb.deleteDoc(window._fb.doc(_db(),"quotes",String(quoteId)));
};
const subscribeQuotes=(cb)=>{
  const run=()=>{
    const col=window._fb.collection(_db(),"quotes");
    return window._fb.onSnapshot(col,snap=>{
      const quotes=[];
      snap.forEach(d=>{quotes.push({id:d.id,...d.data()});});
      /* Sort by quote number descending (newest first) */
      quotes.sort((a,b)=>(b.num||0)-(a.num||0));
      cb(quotes);
    });
  };
  if(window._fbLoaded)return run();
  let unsub=()=>{};
  window.addEventListener("fb_ready",()=>{unsub=run();},{once:true});
  return()=>unsub();
};

const getDayKey=()=>{};const getWeekKey=()=>{};
const requestPushPermission=async()=>null;const onPushMessage=()=>{};const saveDriverToken=async()=>{};

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

/* -- BRAND COLORS -- */
const BRAND={main:"#1e5b92",dark:"#134b7f",light:"#357bb7",pale:"#e8f0f8",bg:"#f0f5fa"};
const LOGO_URI="data:image/png;base64,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";
const LOGO_WHITE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAAAcCAYAAAAOa8NNAAAMqklEQVR4nM2aeZBV1RHGf/3mDQzIgIALiwyLS8AlqIlbxCWZuEdNsNRQJqgkMVZcKkVMDJpKRVO4o6i4lHEJMWU0KhIhoqBGLUzUcosGEVkElOCSUXAYZnvvffmj+/IOz3kDWhUrp+rWve/ec/p09+n+ztdnxviCmyQzM0kaCNwF9AZqgBJQiG5F4F3gWWCumTVJyplZqYqsvsC9QK+QY8AZZrY6+p0FnAJ0RJ9bzew+STVmVow+NWZWlHQ2cDLQGbpdBLwMzAUUut5jZrdJqjWzzrBlCvAdoCH6NAOLgFnA7Wa2bmsdVCMpX+WqkZSTZFspKxf3odq6tlrSednYdB5J+bhP7GLclKTfYRXfnk91yRYu7Fma9CtI2kHS4Irx0xK/jJD0RvKtVHFXyDxhSw7OVe1QZcxncPYQSc2SimFUV60zeb69co5E1nMhp11SRzwvlVSb9H0+6VOSNDaxsyaevx5ztUbfO+L9qHjXGe+vTuTOizHtVWzoiPsx+WrOSNKrFjgR2B3YDmjD070N+AhYi6f8kq1OlXLLxSXgFeDx+F0PjIs5i3H9QNIrZnZT5pxI+wOAA3D46BFyS8AuQKOkx8xMwExg/9C9B3Aa8E8cchTjJsa9JvSYKc8kJbrmgCyjRgGNoV8t8BIwGWgBRgOnAscD15nZvNTJVhE14yU9JenaWJmPJD0k6QlJ50o6QtL3JZ0n6RJJt0j6WSKrS1ipiOwWldNtWkW/GkkXJxFelLRWUp+Qnxl8Z/QpRBS1qZwpDyb67BjfsrZSUl2mp6T+kpoSfV5TOeKHR+QW49tV8T7LhCyqb+jC3uMlDdzkD22OXYdImiPpGUkfhIM741oq6XRJEyTtUCG0Rzj+Ojm2dgkp3Tj7Fjlm1sU96ze7wqAjEwcOkvRJ4tyZkmaoDBetknZN5r5E0uPxXpKOSb5luJ8tyOTkW0OFs6+M92NUhsFszjslnSBpSIXdlv4YLekaSfdIOi7ezZH0l5ggm2ilHMN2quLM8ZImZdH5GZx9Q7zPIrY2Fu2U+N4afS9IZF1Q4aDDJY1VuXVKmhRz7Sepl6S/Jrbck8hakNjZImloN86+IlnwbFz6XXIkmCvp1ExOXtIA4HBgT2C2mS1MVqIHsCH6rgc+wDHuDqBJUh2OTx3xfT2wApgkx8o1CnrW1cJUtELF75KZlSQ1xe9czN039OsJ/DDG1QL/Bl4ws43hxPXAx8BhwM7APTiWj6W8T3xLUj0wIPoVcbx+OHSvNbPOLnTN7MkBk4AHgf0qbOkPHAccJ+kUYGIeGAm8ZmazwogckDOzgqTWMIS450PwBGAe8HooV4/z1wHAKKAV2BtYEwoVqzi4u2ahS338LoWRbfG7EfhS0n96OHoEvtl+D3gHWADMM7OlYd9NwGVAe8g+At/4a/GgqQHu0NZR2ZyZvSPpEJzHjwcOBraP78XQezzw3qZRkbJZimebxixJD0RaNEu6Ld7frG54o6RdJV0UMmsrvlWDkenaHLMzOLk7SVMpcFbSiwETd0k6RlKjHLOzNlnSoZKWSLo/mX+4ytSuJGmhpJcSPRbH/NlidwUjl8f7zWyLdztIOlLSH1TG8oKkDbkQamZWqqzQ8JXO3omgPDjFOUG+gw+RNEzSLnENwdN3cMjs1NYVPRvNrGBmbXEvSDoTz6JizP0h8JSkBjyzRuOQdiZOGycCf8Oza0087wYcIWlHADNbBczHM66ER+K+lLNvppkV8AjvtoVt4+Sb+Kh494GZzTezicDTMQ/ANvkt4GkB2DaeW4BDJD2Ep9xRcb2Nl6VL8dTsEWN2lnQO8KSZLd6S4sDhkn4O9MTT+2s41xa+6D2Bq82sFVgtaSZwFZ6i4I670MyuAQhZORzS+uFpfmMs+p1AlpmiXIa34tieyavWsswfANwM7BW+uRN4BN8/9gL2SOR80qWkBEbuljMSyTloc5KmpUjjFfIq6gZJZ0gansgZK+l8OV9uUMLlVa4gC9q8UkxbR/J8f4zrKWmqNq8610pqjO/5yKRRKleUBUmvJHbVyVlVMb5nEJHx8kzHFEY2JrIynp3VICl/V4U9GfzN6KqCNHxzqgU2Uq7K8hEBRcqQkm2wI/EoN+AySZ14dK/HN7RB+K59aRYVce9TPXgAz6AWYIaZ/VLS/sAfgV2TPsuA483sTUn5gJ+cma2QtBD4RvTbO3R81MzaJN0LXEg5zQFuVddwZzgByFrmt+uBgZQrz8rv4P57ApiSz4RncBJ3AR2S2uO5FIbnEmFFfKd/Cy+DD4xvbcBvKoz4GC9ZS9Im1OoAngHqYo7UyALOJJ7DadgKOcu4FE/1Zymn/SQzW5k5OnNO2HUtvqAdYfRXgEejz0yc8mYQshZ4KuyvZE/tMWc+9FwWvloFnC4nDhNw+jg0fNUOLAf+DNxgZp3pCVoNsA1O34bgR4UTYuCmSivaGuAxYAywEngYOBTnvdNxfBycOPH9mHiqmT2uLo5Lu2uhW64K502LJ6PsqJrE+Zv1zc59qsjKMlgRHPl4Llb0q4l+uWyeeJfRyI1m9lG8zwHKSxqEk/5RwPDo3AvfkF6J50H4+W4LHonLcOcuwRfkE3yTbMLho5Yy/BCyegDnS3oBP+utNHKzBUh/h6FVHVTFeZ9ydNpXVYqtygVKf6t8fm7JnKX4lmXW+13ILIGnxU14Cu2PO9Uow4aAOfG9gDt8PR7pzTgetuMLshB4CE+jp3BYKeJwshp4Eq/+djWzl+Tl8KX4ItxnZnMlnYhXXUVgiqTD8Kh6WF4xXgjMwE/WrsDZynbA3/FD/nbgNrzqvTj0nx73b+IF2Y+BX7t/VAtcgLOG34eO14fOzwN3x3z1eCbfL+kKM5ssaWL4pROnuX+SdDKe3W+F3FNxatkKXJ7DqdOx+DHpm3E14DCwAS9Dj8Wp0knAkTjNG4PTvgK+8TyI07WdcGi5D3ggrsXAd8PQLJoawlkPAjPkPPireDn9YSh4OHBgpGFdGNKKZ+LZwHnAfwguHfp+FHJGAquAG3EIOymcuSb4v/AsvDhkvINTxNNwjP8wvh8Tjp4WQbCvpDOAc2PMOGDvCJ5r8OBdFHYeh1e57wEb8sAv8IhrjUl6h5F5/Ey4JZzzTjzvjG+MioUZg0dCXxzvS6FIR4yrCUe1RZ+UjSw3s9mSpuIR2opHZ5uZtUvqANYFdpbCkT2BXwH/AhaZ2aOSTgpHG7AOh7WROCxebmatsYn91sxuyTA0+k2OhfhRyF0fctbjUVsAfgo8E+fnU/FsXxAMqCcOn9sDzZGFfc2sQ1JL2NRqZi15PE2OxynVupgoOwOZE0LqwlF1eAYMC+waHI7Lh1K9KR+wp+xCONQ8CywPpvAJsJekp4FXzWyRpNNCxu7yKvE9/I8Go3AIaQPqzWy5pCXAvIyq4rA3CNgHh6b5OAsaEzq8C7we/bPzmgF4VtbhNDc7f9keOAiHg1U4xJwjaVu8Kn0fmB2yCkBfM3tVXuq/ALRIOhoPuHpgrKQGC6OGAiPiGoqzkVKsSp8wpncM7oNTnPk4pAC8huNbMx79zSHnRsoU8DEzO3qT933nHoHv5tkhUd+YuxfwRizisHDMcmAHPOWLeMq3R9T2xGGpDw5tbUAvM/tY0i5mtiz69DOzD9LNUVJ/HHPfCOc14Cd2683sbUmDzWytpJ3DyS2xSM2hRz1gZvZxyBuNQ1WzvMIcFHYsqXpeEak2EE/vwcmCDMOjfI9wynZheJHyUWsrHrn1lAuThTh7WQ68HBw1m2uLx7AZOwm9UjZQlc6p/Bfz9K/om1hO5TOUmcPnaVuyIyP/WWptGtcdF02NwVd5IGWM3hj3Er76wnG4jjLcdGaVXsyVRVmmC4RDJY0DGs3skoq5++IQcQpeNKzaWv4e0XeQmd0Vv/c1s5er9B2E72EdYctSnGE8gxOCxcA/Qt9SalNqj5mVuj2JS0pXSy5i0tKWovHztmTe/jh1ewTH3w34pt2E4/np+EJPx/+wsQZnVytx5/TDoaUXflK5J47dZwFX44EifDPdBj+f34agc3ixdjDORGbhe8HQ0GMVnulTcWhjS/741NlI2pLBXQqpWAy66/sZFyYXUb0P7vCjKB/I98ahqQmHqjXAJfhJXiNOt4bhm30zvge0x1WKa12Mn4zTxjW4E/vgtcKhuGMX4NT3JzhnbsAX7cs4zZsGbG9mHyYMp2rbqn+s+aJbgrVX4nvBEjwKF+Ob1D74ftCEG94IfBuP+p74njEaT/mNuMOH4NHfD99D5uMcuj8eyS/iZydNeHQ34fy6MeYdGfKOwIu0ofhiz+F/mOVfWJP0O0m7baHPTMVf3P/f238BpIIp8JGmKPgAAAAASUVORK5CYII=";

/* ── SIMPLE HASH ROUTER ── */
function useHashRoute(){
const[hash,setHash]=useState(window.location.hash);
useEffect(()=>{const h=()=>setHash(window.location.hash);window.addEventListener("hashchange",h);return()=>window.removeEventListener("hashchange",h);},[]);
return hash;
}

function useIsDesktop(){
const getWidth=()=>{try{return Math.max(window.innerWidth,window.screen?.width||0,window.top?.innerWidth||0);}catch(e){return Math.max(window.innerWidth,window.screen?.width||0);}};
const[isD,setIsD]=useState(getWidth()>=768);
useEffect(()=>{const h=()=>setIsD(getWidth()>=768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
return isD;
}

/* Driver slug map — populated dynamically at runtime from the drivers array.
   The slug is always the driver's first name lowercased.
   Falls back to a static map for the initial load before drivers are known. */
const DRIVER_SLUGS={"trevor":1,"brent":2,"trevarr":3};
function getDriverSlug(name){return name.toLowerCase().split(" ")[0].replace(/[^a-z0-9]/g,"");}

/* Resolve a slug to a driver ID — checks live drivers array first, then static map */
function resolveDriverSlug(slug,driversArr){
  if(!slug)return null;
  const found=driversArr.find(d=>getDriverSlug(d.name)===slug.toLowerCase());
  if(found)return found.id;
  return DRIVER_SLUGS[slug.toLowerCase()]||null;
}


/* ── CORRECTED ADDRESSES (from spreadsheet warehouse addresses) ── */
const ADDR={
  // EMSER PICKUPS
  "Emser Norcross":"5470-G Oakbrook Parkway, Norcross, GA 30093",
  "Emser Roswell":"250 Hembree Park Drive, Roswell, GA 30076",
  "Transfer - Norcross":"5470-G Oakbrook Parkway, Norcross, GA 30093",
  "Transfer - Roswell":"250 Hembree Park Drive, Roswell, GA 30076",
  // EMSER DELIVERIES
  "Advanced Flooring Design - Mableton":"6731 Discovery Blvd #200, Mableton, GA 30126",
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
  "NOCO Contracting":"1028 Branch Dr, Alpharetta, GA 30004",
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
  "Atlanta Flooring - Suwanee":"Must deliver between 9:30 AM – 1:00 PM",
  "Elite Flooring - Norcross":"Deliveries always made here",
  "Britts - Lawrenceville":"Not before 9",
  "Stocco - Alpharetta":"Product pick up at either or both Emser locations",
  "DCO Tech Dr":"Do not deliver before 10ish",
  "DCO Tech Dr - Lawrenceville":"Do not deliver before 10ish",
  "DCO Eatonton":"ALWAYS 942 Greensboro Rd (NEVER 105 Harmony). Parking lot delivery — Forklift, no dock",
  "Madison Flooring Group":"Parking lot delivery — Forklift, no dock",
  "Advanced Flooring Design - Mableton":"Product pick up at either or both Emser locations",
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
deliveries:["Advanced Flooring Design - Mableton","American Flooring Services","Atlanta Flooring - Suwanee","Atlanta West - Lithia Springs","BEC - Alpharetta","Britts - Lawrenceville","Construction Resources - Decatur","D3 - Woodstock","Dalton Carpet Outlet - Smyrna","DCO Athens","DCO Eatonton","DCO Lakes Pkwy","DCO Smyrna","DCO Tech Dr - Lawrenceville","Drop Ship Liftgate","Elite Flooring - Norcross","Flooring Design Group - Doraville","Floorworx - Norcross","Gel & Associates - Atlanta","Hillman - Sugar Hill","Idlewood - Norcross","JSJ/ProSource - Marietta","Madison Flooring Group","NE Corner - Flowery Branch","NOCO Contracting","Peachwood Floor Covering","Precision Flooring - Norcross","Premier - Suwanee","Prestigious - Alpharetta","ProSource - Marietta","ProSource - Norcross","SE Commercial - Woodstock","Sherwin Williams - Norcross","Sherwin Williams - Smyrna","Stocco - Alpharetta","Transfer - Norcross","Transfer - Roswell","Valufloor - Doraville","Vanguard - Norcross"]},
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
const NB={background:BRAND.dark,border:"1px solid "+BRAND.main,color:"#93c5fd",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:14};
const BB={background:"none",border:"none",color:"#2563eb",fontSize:13,cursor:"pointer",padding:"16px 4px 8px",fontWeight:600};

function getWeekDates(off=0){const now=new Date();const d=now.getDay();const mon=new Date(now);mon.setDate(now.getDate()-(d===0?6:d-1)+off*7);return DAYS.map((name,i)=>{const dt=new Date(mon);dt.setDate(mon.getDate()+i);return{name,date:dt.toLocaleDateString("en-US",{month:"short",day:"numeric"})}});}
function fmt(n){return "$"+n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");}

/* ── DELIVERY CONFIRMATION (typed name) ── */
/* ── INLINE RATE EDITOR ── */
function InlineRate({value,isHourly,onSave,accent}){
const[editing,setEditing]=useState(false);
const[val,setVal]=useState("");
const inputRef=useRef(null);
const start=(e)=>{if(isHourly)return;e.stopPropagation();setVal(value.toFixed(2));setEditing(true);};
const commit=()=>{const n=parseFloat(val);if(!isNaN(n)&&n>=0)onSave(n);setEditing(false);};
if(editing)return(
<input ref={inputRef} value={val} onChange={e=>setVal(e.target.value)} onBlur={commit}
autoFocus
inputMode="decimal"
onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();commit();}if(e.key==="Escape")setEditing(false);}}
onClick={e=>e.stopPropagation()}
style={{width:80,border:"2px solid "+(accent||"#2563eb"),borderRadius:6,padding:"4px 8px",fontSize:13,fontWeight:700,outline:"none",textAlign:"right",fontVariantNumeric:"tabular-nums",background:"#fffbeb",WebkitAppearance:"none"}}/>
);
return(
<span onClick={start} title={isHourly?"Hourly rate":"Tap to edit price"}
style={{fontVariantNumeric:"tabular-nums",fontSize:12,fontWeight:700,color:isHourly?"#44403c":"#1e5b92",cursor:isHourly?"default":"pointer",borderBottom:isHourly?"none":"1px dashed #93c5fd",paddingBottom:1,WebkitTapHighlightColor:"rgba(0,0,0,0.1)"}}>
{isHourly?"HR":"$"+value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")}
</span>
);
}

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

/* ── ADDRESS AUTOCOMPLETE INPUT ── */
/* Uses Google Places API when available, falls back to plain input gracefully */
let _gmpState="idle"; /* idle | loading | ready | failed */
function loadGoogleMaps(){
if(_gmpState==="ready"||window.google?.maps?.places){_gmpState="ready";return;}
if(_gmpState==="loading"||_gmpState==="failed")return;
_gmpState="loading";
try{
const s=document.createElement("script");
s.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB29mVeZXedDhLVT3eMVgl07EsOneWCUu4&libraries=places,geometry";
s.async=true;
s.onload=()=>{_gmpState="ready";};
s.onerror=()=>{_gmpState="failed";};
document.head.appendChild(s);
}catch(e){_gmpState="failed";}
}

/* ── INTERACTIVE GOOGLE MAP COMPONENT ── */
function GoogleMapView({stops,drivers,height,onStopClick,activeDriver,showSearch,searchLabel,onAssignStop}){
const containerRef=useRef(null);
const mapInstanceRef=useRef(null);
const markersRef=useRef([]);       /* [{marker, infoWindow, labelOverlay, stopId}] */
const polylinesRef=useRef([]);
const labelsRef=useRef([]);
const searchInputRef=useRef(null);
const openInfoRef=useRef(null);    /* currently open InfoWindow */
const [mapReady,setMapReady]=useState(false);
const stopsJsonRef=useRef("");     /* track last rendered stops to avoid needless redraws */
const driversJsonRef=useRef("");
const activeDriverRef=useRef(activeDriver);
const onAssignStopRef=useRef(onAssignStop);
useEffect(()=>{activeDriverRef.current=activeDriver;},[activeDriver]);
useEffect(()=>{onAssignStopRef.current=onAssignStop;},[onAssignStop]);

/* Initialize map ONCE */
useEffect(()=>{
loadGoogleMaps();
const tryInit=()=>{
if(!containerRef.current)return;
if(!window.google?.maps?.Map){setTimeout(tryInit,200);return;}
if(mapInstanceRef.current)return;
const map=new window.google.maps.Map(containerRef.current,{
center:{lat:33.92,lng:-84.25},
zoom:10,
mapTypeControl:false,
streetViewControl:false,
fullscreenControl:true,
zoomControl:true,
gestureHandling:"greedy",
styles:[
{featureType:"poi",stylers:[{visibility:"off"}]},
{featureType:"transit",stylers:[{visibility:"off"}]},
{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#c9e4f5"}]},
{featureType:"landscape",elementType:"geometry.fill",stylers:[{color:"#f0efe9"}]},
{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#fcd34d"}]},
{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#fbbf24"}]},
{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{color:"#ffffff"}]},
{featureType:"road.local",elementType:"geometry.fill",stylers:[{color:"#f5f5f4"}]},
{featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#1e5b92"}]},
]
});
mapInstanceRef.current=map;

/* Close open info window when clicking map background */
map.addListener("click",()=>{
if(openInfoRef.current){openInfoRef.current.close();openInfoRef.current=null;}
});

/* Search box */
if(showSearch&&searchInputRef.current){
const sb=new window.google.maps.places.SearchBox(searchInputRef.current);
map.addListener("bounds_changed",()=>{sb.setBounds(map.getBounds());});
sb.addListener("places_changed",()=>{
const places=sb.getPlaces();
if(!places||!places.length)return;
const place=places[0];
if(!place.geometry||!place.geometry.location)return;
map.panTo(place.geometry.location);
map.setZoom(14);
new window.google.maps.Marker({
position:place.geometry.location,map,
icon:{path:window.google.maps.SymbolPath.CIRCLE,scale:8,fillColor:"#dc2626",fillOpacity:1,strokeColor:"#fff",strokeWeight:2},
title:place.name||place.formatted_address,
});
});
}
setMapReady(true);
};
tryInit();
return()=>{
markersRef.current.forEach(({marker,infoWindow,labelDiv})=>{marker.setMap(null);if(labelDiv&&labelDiv.parentNode)labelDiv.parentNode.removeChild(labelDiv);});
polylinesRef.current.forEach(p=>p.setMap(null));
};
},[]);/* eslint-disable-line react-hooks/exhaustive-deps */

/* Helper — build a DOM-based label overlay above a marker for dueBy */
const makeDueLabel=(map,pos,text)=>{
if(!window.google?.maps?.OverlayView)return null;
/* Determine color and display text based on format */
const isWindow=text.includes("–")||text.includes("-")&&text.match(/\d.*–.*\d/);
const isPickup=text.toLowerCase().startsWith("pickup");
const isAfter=text.toLowerCase().startsWith("after");
const bg=isWindow?"#7c3aed":isPickup?"#16a34a":isAfter?"#2563eb":"#dc2626";
const display=text.replace(/^(By|After)\s*/i,"");
class DueLabel extends window.google.maps.OverlayView{
constructor(){super();this.pos=pos;this.div=null;}
onAdd(){
const d=document.createElement("div");
d.style.cssText=`position:absolute;white-space:nowrap;font-family:'DM Sans',system-ui,sans-serif;font-size:10px;font-weight:700;color:#fff;padding:2px 6px;border-radius:4px;pointer-events:none;background:${bg};box-shadow:0 1px 4px rgba(0,0,0,0.3);`;
d.textContent=display;
this.div=d;
this.getPanes().floatPane.appendChild(d);
}
draw(){
if(!this.div)return;
const proj=this.getProjection();
const pt=proj.fromLatLngToDivPixel(new window.google.maps.LatLng(this.pos.lat,this.pos.lng));
if(!pt)return;
const w=this.div.offsetWidth||60;
this.div.style.left=(pt.x-w/2)+"px";
this.div.style.top=(pt.y-32)+"px";
}
onRemove(){if(this.div&&this.div.parentNode){this.div.parentNode.removeChild(this.div);this.div=null;}}
}
const overlay=new DueLabel();
overlay.setMap(map);
return overlay;
};

/* Update markers & routes — only when stops/drivers actually change */
useEffect(()=>{
if(!mapReady||!mapInstanceRef.current||!window.google?.maps)return;
const stopsKey=JSON.stringify((stops||[]).map(s=>({id:s.id,driverId:s.driverId,status:s.status,dueBy:s.dueBy,coords:s.coords})));
const driversKey=JSON.stringify((drivers||[]).map(d=>d.id));
if(stopsKey===stopsJsonRef.current&&driversKey===driversJsonRef.current)return;
stopsJsonRef.current=stopsKey;
driversJsonRef.current=driversKey;

const map=mapInstanceRef.current;
/* Clear */
markersRef.current.forEach(({marker,labelOverlay})=>{
marker.setMap(null);
if(labelOverlay)labelOverlay.setMap(null);
});
polylinesRef.current.forEach(p=>p.setMap(null));
markersRef.current=[];
polylinesRef.current=[];
if(openInfoRef.current){openInfoRef.current.close();openInfoRef.current=null;}

if(!stops||stops.length===0)return;

const bounds=new window.google.maps.LatLngBounds();
const drvStops={};

stops.forEach(s=>{
if(!s.coords)return;
const pos={lat:s.coords.lat,lng:s.coords.lng};
bounds.extend(pos);

const di=drivers.findIndex(d=>d.id===s.driverId);
const col=di>=0?DCOL[di]:(CC[s.customer]||CC["One-Off Delivery"]).accent;
const done=s.status==="departed";
const onSite=s.status==="arrived";
const isPU=s.stopType==="pickup";
const isP=s.priority;
const hasActive=!!activeDriverRef.current;
const isAssigned=s.driverId>0;
const isActiveDriverStop=activeDriverRef.current&&s.driverId===activeDriverRef.current;

const scale=done?5:onSite?11:isActiveDriverStop?11:8;
const fillColor=done?"#a8a29e":col;
const strokeColor=onSite?"#f59e0b":isActiveDriverStop?"#1c1917":isP?"#f59e0b":"#fff";
const strokeWeight=onSite?3:isActiveDriverStop?3:2;
const fillOpacity=done?0.4:hasActive&&!isActiveDriverStop&&isAssigned?0.5:1;

const marker=new window.google.maps.Marker({
position:pos,map,
icon:{
path:isPU?'M -5,-5 L 0,-9 L 5,-5 L 5,5 L -5,5 Z':window.google.maps.SymbolPath.CIRCLE,
scale,fillColor,fillOpacity,strokeColor,strokeWeight,
},
zIndex:done?1:onSite?10:isActiveDriverStop?9:isP?8:5,
title:s.stop,
cursor:onAssignStop?"pointer":"default",
});

/* dueBy label above marker */
let labelOverlay=null;
if(s.dueBy){
labelOverlay=makeDueLabel(map,pos,s.dueBy);
}

/* Build rich info window */
const addr=s.addr||getAddr(s.stop);
const drvName=drivers.find(d=>d.id===s.driverId)?.name?.split(" ")[0]||"";
const badges=[];
if(isPU)badges.push('<span style="background:#2563eb;color:#fff;padding:1px 5px;border-radius:3px;font-size:9px;font-weight:700">PICKUP</span>');
if(isP)badges.push('<span style="background:#f59e0b;color:#fff;padding:1px 5px;border-radius:3px;font-size:9px;font-weight:700">PRIORITY</span>');
if(done)badges.push('<span style="background:#16a34a;color:#fff;padding:1px 5px;border-radius:3px;font-size:9px;font-weight:700">DONE</span>');
if(onSite&&!done)badges.push('<span style="background:#f59e0b;color:#fff;padding:1px 5px;border-radius:3px;font-size:9px;font-weight:700">ON SITE</span>');
if(s.dueBy){const bg=s.dueBy.includes("-")?"#7c3aed":s.dueBy.startsWith("After")?"#2563eb":"#dc2626";badges.push(`<span style="background:${bg};color:#fff;padding:1px 5px;border-radius:3px;font-size:9px;font-weight:700">⏰ ${s.dueBy}</span>`);}
if(s.shipPlan)badges.push(`<span style="background:#ea580c;color:#fff;padding:1px 5px;border-radius:3px;font-size:9px;font-weight:700">SP# ${s.shipPlan}</span>`);

const infoContent=`<div style="font-family:DM Sans,system-ui,sans-serif;max-width:240px;padding:2px">
${badges.length?`<div style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:6px">${badges.join("")}</div>`:""}
<div style="font-size:14px;font-weight:700;color:#1c1917;margin-bottom:1px">${s.stop}</div>
<div style="font-size:11px;color:${col};font-weight:600;margin-bottom:4px">${s.customer}</div>
${drvName?`<div style="font-size:10px;color:#78716c;margin-bottom:2px">🚚 ${drvName}</div>`:""}
${addr?`<div style="font-size:10px;color:#78716c;margin-bottom:4px">${addr}</div>`:""}
${s.instructions?`<div style="font-size:10px;color:#1d4ed8;background:#eff6ff;padding:5px 8px;border-radius:5px;margin-bottom:4px;line-height:1.4">📋 ${s.instructions}</div>`:""}
${s.weight?`<div style="font-size:10px;color:#1e5b92;font-weight:700;margin-bottom:2px">${s.weight.toLocaleString()} lbs</div>`:""}
${s.eta?`<div style="font-size:10px;color:#2563eb;margin-bottom:2px">ETA: ${s.eta} min${s.etaDest?" → "+s.etaDest:""}</div>`:""}
${addr?`<a href="https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}" target="_blank" style="display:inline-block;margin-top:6px;background:#1e5b92;color:#fff;padding:5px 12px;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none">🧭 Directions</a>`:""}
</div>`;

const infoWindow=new window.google.maps.InfoWindow({content:infoContent,maxWidth:260});

marker.addListener("click",()=>{
const curActive=activeDriverRef.current;
const curAssign=onAssignStopRef.current;
if(curActive&&curAssign){
/* Assign mode — click assigns stop to active driver, no info window */
curAssign(s.id,curActive);
return;
}
/* Info mode — show info window */
if(openInfoRef.current){openInfoRef.current.close();}
infoWindow.open(map,marker);
openInfoRef.current=infoWindow;
if(onStopClick)onStopClick(s.id);
});

/* On-site pulse ring — static, no animation to avoid flashing */
if(onSite&&!done){
const pulse=new window.google.maps.Marker({
position:pos,map,
icon:{path:window.google.maps.SymbolPath.CIRCLE,scale:20,fillColor:"#f59e0b",fillOpacity:0.12,strokeColor:"#f59e0b",strokeWeight:1.5,strokeOpacity:0.4},
zIndex:0,clickable:false,
});
markersRef.current.push({marker:pulse,labelOverlay:null});
}

markersRef.current.push({marker,infoWindow,labelOverlay});

if(s.driverId&&s.driverId>0){
if(!drvStops[s.driverId])drvStops[s.driverId]=[];
drvStops[s.driverId].push(pos);
}
});

/* Polylines */
Object.entries(drvStops).forEach(([did,positions])=>{
if(positions.length<2)return;
const di=drivers.findIndex(d=>d.id===Number(did));
const col=DCOL[di]||"#78716c";
const line=new window.google.maps.Polyline({
path:positions,geodesic:true,strokeColor:col,strokeOpacity:0.75,strokeWeight:4,map,
icons:[{icon:{path:'M 0,-1 L 2,0 L 0,1',scale:3,fillColor:col,fillOpacity:1,strokeWeight:0},offset:'100%',repeat:'80px'}],
});
polylinesRef.current.push(line);
});

if(stops.filter(s=>s.coords).length>0){
map.fitBounds(bounds,{top:60,bottom:20,left:20,right:20});
}
},[stops,drivers,mapReady]);/* activeDriver handled via ref — no flicker on driver select */

return(
<div style={{position:"relative",borderRadius:14,overflow:"hidden",border:"1px solid #d6d3d1",boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
{showSearch&&(
<div style={{position:"absolute",top:10,left:10,right:60,zIndex:5}}>
<input ref={searchInputRef} type="text" placeholder={searchLabel||"Search address…"}
style={{width:"100%",padding:"10px 14px 10px 36px",border:"none",borderRadius:10,fontSize:13,fontWeight:500,outline:"none",boxShadow:"0 2px 12px rgba(0,0,0,0.15)",background:"#fff",fontFamily:"'DM Sans',system-ui,sans-serif"}}/>
<span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none",opacity:0.5}}>🔍</span>
</div>
)}
{/* Assign-mode banner */}
{activeDriver&&onAssignStop&&(()=>{
const drv=drivers.find(d=>d.id===activeDriver);
const di=drivers.findIndex(d=>d.id===activeDriver);
return(<div style={{position:"absolute",bottom:12,left:12,right:12,zIndex:5,background:DCOL[di]||BRAND.main,color:"#fff",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.2)"}}>
<span>🖱 Tap stops to add to {drv?.name?.split(" ")[0]}'s route</span>
</div>);
})()}
<div ref={containerRef} style={{width:"100%",height:height||380,background:"#e8e4df"}}/>
{!mapReady&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#e8e4df"}}>
<div style={{textAlign:"center"}}>
<div style={{fontSize:28,marginBottom:8}}>🗺️</div>
<div style={{fontSize:13,color:"#78716c",fontWeight:500}}>Loading map…</div>
</div>
</div>}
</div>
);}


function AddressInput({value,onChange,placeholder,style:customStyle}){
const inputRef=useRef(null);
const acRef=useRef(null);
const[suggestions,setSuggestions]=useState([]);
const[focused,setFocused]=useState(false);
const timerRef=useRef(null);

useEffect(()=>{loadGoogleMaps();},[]);

const doSearch=useCallback((q)=>{
if(!q||q.length<3||_gmpState!=="ready")return;
try{
if(!window.google?.maps?.places)return;
if(!acRef.current)acRef.current=new window.google.maps.places.AutocompleteService();
acRef.current.getPlacePredictions({
input:q,
componentRestrictions:{country:"us"},
locationBias:{center:{lat:33.88,lng:-84.28},radius:80000},
types:["address"]
},(results,status)=>{
if(status==="OK"&&results)setSuggestions(results.slice(0,5));
else setSuggestions([]);
});
}catch(e){setSuggestions([]);}
},[]);

const handleChange=(val)=>{
onChange(val);
clearTimeout(timerRef.current);
timerRef.current=setTimeout(()=>doSearch(val),350);
};

const pick=(pred)=>{
onChange(pred.description);
setSuggestions([]);
};

const base={border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",width:"100%"};
const merged=customStyle?{...base,...customStyle}:base;

return(
<div style={{position:"relative"}}>
<input ref={inputRef} value={value} onChange={e=>handleChange(e.target.value)} placeholder={placeholder||"Address"} onFocus={()=>setFocused(true)} onBlur={()=>setTimeout(()=>{setFocused(false);setSuggestions([]);},250)} style={merged} autoComplete="off"/>
{focused&&suggestions.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:60,background:"#fff",border:"1px solid #d6d3d1",borderTop:"none",borderRadius:"0 0 10px 10px",boxShadow:"0 8px 24px rgba(0,0,0,0.15)",maxHeight:220,overflowY:"auto"}}>
{suggestions.map((p,i)=><div key={p.place_id||i} onMouseDown={e=>{e.preventDefault();pick(p);}} style={{padding:"10px 12px",cursor:"pointer",borderBottom:i<suggestions.length-1?"1px solid #f5f5f4":"none",fontSize:12,color:"#1c1917"}}>
<div style={{fontWeight:600}}>{p.structured_formatting?p.structured_formatting.main_text:p.description}</div>
{p.structured_formatting&&p.structured_formatting.secondary_text&&<div style={{fontSize:10,color:"#a8a29e",marginTop:1}}>{p.structured_formatting.secondary_text}</div>}
</div>)}
</div>}
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
<div style={{background:BRAND.dark,color:"#fff",padding:"16px 20px"}}>
<img src={LOGO_WHITE} alt="Davis Delivery" style={{height:26,objectFit:"contain",marginBottom:2,display:"block"}}/>
<p style={{margin:"2px 0 0",fontSize:11,color:"#93c5fd",letterSpacing:"0.08em"}}>DRIVER MANIFEST</p>
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
{/* Leaving warehouse ETA - shows when no stops started yet */}
{entries.length>0&&!entries.some(e=>e.status==="arrived"||e.status==="departed")&&(
<div style={{background:"#fff",border:"2px solid "+BRAND.main,borderRadius:14,padding:"14px 16px",marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
<span style={{fontSize:18}}>{"🏠"}</span>
<div>
<div style={{fontSize:14,fontWeight:700,color:BRAND.main}}>Leaving Warehouse</div>
<div style={{fontSize:11,color:"#78716c"}}>ETA to first stop: {entries[0].stop}</div>
</div>
</div>
<div style={{display:"flex",gap:6,alignItems:"center"}}>
<input placeholder="mins" type="number" defaultValue={entries[0].eta||""} style={{width:70,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}
onBlur={e=>{if(e.target.value)onEta(entries[0].id,e.target.value,entries[0].stop);}}/>
<span style={{fontSize:12,color:"#78716c"}}>min to</span>
<span style={{fontSize:12,fontWeight:700,color:BRAND.main,flex:1}}>{entries[0].stop}</span>
</div>
{entries[0].eta&&entries[0].etaDest&&<div style={{marginTop:6,fontSize:11,color:BRAND.main,fontWeight:600}}>{"🚚"} ETA: {entries[0].eta} min → {entries[0].etaDest}</div>}
</div>
)}
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
{entry.dueBy&&<span style={{fontSize:9,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700,display:"inline-flex",alignItems:"center",gap:2}}>{"\u23F0"} {entry.dueBy}</span>}
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
style={{display:"inline-flex",alignItems:"center",gap:6,background:BRAND.main,color:"#fff",border:"none",borderRadius:10,padding:"10px 16px",cursor:"pointer",fontSize:13,fontWeight:600,marginTop:8,textDecoration:"none",width:"100%",justifyContent:"center"}}>
🧭 Get Directions
</a>}
{entry.arrivedAt&&<div style={{fontSize:10,color:"#16a34a",marginTop:6}}>Arrived: {entry.arrivedAt}</div>}
{entry.departedAt&&<div style={{fontSize:10,color:"#16a34a"}}>Departed: {entry.departedAt}</div>}
{entry.eta&&<div style={{fontSize:10,color:"#2563eb"}}>ETA: {entry.eta} min{entry.etaDest?" → "+entry.etaDest:""}</div>}
<div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
{!arrived&&<button onClick={()=>onStatusUpdate(entry.id,"arrived")} style={{flex:1,background:"#f59e0b",color:"#fff",border:"none",borderRadius:10,padding:"10px",cursor:"pointer",fontSize:13,fontWeight:600}}>Arrived</button>}
{arrived&&!departed&&<button onClick={()=>{if(!canDepart){return;}onStatusUpdate(entry.id,"departed");}} style={{flex:1,background:canDepart?"#16a34a":"#a8a29e",color:"#fff",border:"none",borderRadius:10,padding:"10px",cursor:canDepart?"pointer":"not-allowed",fontSize:13,fontWeight:600}}>{canDepart?"Departed":"Enter Ship Plan # First"}</button>}
{arrived&&(
<div style={{width:"100%",marginTop:4}}>
<div style={{display:"flex",gap:6,marginBottom:4}}>
<select defaultValue={entry.etaDest||""} onChange={e=>{const dest=e.target.value;const curMins=entry.eta||"";if(dest&&curMins)onEta(entry.id,curMins,dest);else if(dest){/* store dest, wait for mins */const el=e.target;el._dest=dest;}}} ref={el=>{if(el)el._dest=entry.etaDest||"";}}
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:12,outline:"none",background:"#fff",color:entry.etaDest?"#1c1917":"#a8a29e"}}>
<option value="">ETA to where?</option>
{entries.filter((_,ei)=>ei>i&&_.status!=="departed").map(ne=><option key={ne.id} value={ne.stop}>{ne.stop}</option>)}
<option value="Davis Warehouse">{"🏠 Davis Warehouse"}</option>
</select>
<input placeholder="mins" type="number" defaultValue={entry.eta||""} style={{width:70,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}
onBlur={e=>{if(e.target.value){const select=e.target.parentElement.querySelector("select");const dest=select?select.value:"";onEta(entry.id,e.target.value,dest||entry.etaDest);}}}/>
</div>
<div style={{display:"flex",gap:6}}>
<label style={{display:"flex",alignItems:"center",gap:4,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#2563eb",flex:1,justifyContent:"center"}}>
{"📷"} Photo
<input type="file" accept="image/*" capture="environment" style={{display:"none"}}
onChange={e=>{if(e.target.files[0]){const r=new FileReader();r.onload=ev=>onPhotoUpload(entry.id,ev.target.result);r.readAsDataURL(e.target.files[0]);}}}/>
</label>
<button onClick={()=>setSigStop(entry.id)} style={{background:"#f3e8f9",border:"1px solid #d8b4fe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#7c3aed",flex:1}}>{"✍"} Sign</button>
</div>
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
<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>{(selectedPickup==="custom"||!pickupOptions?.length)&&<AddressInput value={originAddr} onChange={setOriginAddr} placeholder="Pickup address"/>}<AddressInput value={destAddr} onChange={setDestAddr} placeholder="Delivery address"/><button onClick={calcDistance} disabled={calcLoading} style={{background:"#1c1917",color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:13,fontWeight:600,cursor:"pointer",opacity:calcLoading?0.6:1}}>{calcLoading?"Calculating…":"Calculate Distance"}</button></div>
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
function ManifestStop({entry,eIdx,total,drivers,onMove,onReassign,onRemove,onUpdateInstructions,onShipPlan,onDueBy,onWeight,onLoadNum,onRate,maxLoad,onDragStart,onDragOver,onDrop,isDragOver,isDragging}){
const[expanded,setExpanded]=useState(false);const[instrText,setInstrText]=useState(entry.instructions||"");const[dueByInput,setDueByInput]=useState(entry.dueBy||"");const[dueType,setDueType]=useState(entry.dueBy?(entry.dueBy.startsWith("After")?"after":"by"):"by");const[lastHour,setLastHour]=useState(()=>{if(entry.dueBy){const m=entry.dueBy.match(/(\d+(?::\d+)?\s*[AP]M)/);return m?m[1].replace(/:\d+/,""):""}return "";});
const buildTime=(hour,mins)=>{if(!hour)return "";const[h,period]=hour.split(" ");return mins===":00"?`${h} ${period}`:`${h}${mins} ${period}`;};
const applyHour=(hour)=>{const mins=dueByInput?dueByInput.match(/:\d+/)?.[0]||":00":":00";const t=buildTime(hour,mins);setLastHour(hour);setDueByInput(dueType==="by"?"By "+t:"After "+t);};
const applyMins=(mins)=>{const hour=lastHour;if(!hour)return;const t=buildTime(hour,mins);setDueByInput(dueType==="by"?"By "+t:"After "+t);};
const c=CC[entry.customer]||CC["One-Off Delivery"];const addr=entry.addr||getAddr(entry.stop);const isP=entry.priority;const isPU=entry.stopType==="pickup";const hasI=entry.instructions?.trim();const isImetco=entry.customer==="IMETCO";const hasDue=!!entry.dueBy;
return(
<div data-drv={entry.driverId} data-idx={eIdx}>
<div onDragOver={e=>{e.preventDefault();onDragOver();}} onDrop={onDrop}
style={{display:"flex",alignItems:"center",gap:6,padding:"8px",marginBottom:expanded||isImetco?0:2,background:isDragOver?"#dcfce7":isDragging?"#fef9c3":hasDue?"#fef2f2":isPU?"#eff6ff":isP?"#fef3c7":"#fafaf9",border:isDragOver?"2px dashed #16a34a":`1px solid ${hasDue?"#fca5a5":isPU?"#bfdbfe":isP?"#fde68a":"#e7e5e4"}`,borderRadius:expanded||isImetco?"10px 10px 0 0":10,borderLeft:`4px solid ${isPU?"#2563eb":isP?"#f59e0b":c.accent}`,opacity:isDragging?0.5:1,transition:"background 0.15s,opacity 0.15s"}}>
<div draggable onDragStart={onDragStart}
onTouchStart={e=>{e.stopPropagation();onDragStart();}}
style={{color:isDragging?"#16a34a":"#a8a29e",fontSize:20,cursor:"grab",padding:"4px 4px",touchAction:"none",lineHeight:1,userSelect:"none",flexShrink:0}}>⠿</div>
<div style={{flex:1,minWidth:0}} onClick={e=>{e.stopPropagation();setExpanded(!expanded);setInstrText(entry.instructions||"");setDueByInput(entry.dueBy||"");}}>
<div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
<span style={{fontSize:11,fontVariantNumeric:"tabular-nums",color:"#a8a29e"}}>{eIdx+1}.</span>
{isPU&&<span style={{fontSize:9,background:"#2563eb",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PICKUP</span>}
{isP&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PRIORITY</span>}
{entry.status==="departed"&&<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>DONE</span>}
{hasDue&&<span style={{fontSize:9,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700,display:"inline-flex",alignItems:"center",gap:2}}>{"\u23F0"} {entry.dueBy}</span>}
<span style={{fontSize:12,fontWeight:700,color:"#1c1917"}}>{entry.stop}</span>
</div>
<div style={{fontSize:10,color:c.accent,fontWeight:600}}>{entry.customer}</div>
{addr&&<div style={{fontSize:10,color:"#78716c",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{addr}</div>}
{entry.note&&<div style={{fontSize:10,color:"#a8a29e"}}>{entry.note}</div>}
{hasI&&!expanded&&<div style={{fontSize:10,color:"#2563eb",marginTop:2}}>📋 {entry.instructions}</div>}
{!hasI&&!expanded&&<div style={{fontSize:9,color:"#d6d3d1",marginTop:2}}>tap to add instructions</div>}
{entry.shipPlan&&!expanded&&<div style={{fontSize:10,color:"#ea580c",fontWeight:700,marginTop:1}}>SP# {entry.shipPlan}</div>}
{entry.weight>0&&!expanded&&<div style={{fontSize:10,color:BRAND.main,fontWeight:700,marginTop:1}}>{entry.weight.toLocaleString()} lbs {(entry.loadNum||1)>1?"(Load "+(entry.loadNum||1)+")":""}</div>}
</div>
<span onClick={e=>e.stopPropagation()}><InlineRate value={entry.baseRate} isHourly={entry.isHourly} onSave={r=>onRate&&onRate(r)}/></span>
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
<div style={{marginTop:8,background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:10,padding:"8px 10px"}}>
<div style={{display:"flex",gap:4,marginBottom:8}}>
<button onClick={e=>{e.stopPropagation();setDueType("by");if(dueByInput)setDueByInput("By "+dueByInput.replace(/^(By |After )/,""));}} style={{flex:1,padding:"6px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:dueType==="by"?"#dc2626":"#e7e5e4",color:dueType==="by"?"#fff":"#57534e"}}>{"\u23F0"} Due By</button>
<button onClick={e=>{e.stopPropagation();setDueType("after");if(dueByInput)setDueByInput("After "+dueByInput.replace(/^(By |After )/,""));}} style={{flex:1,padding:"6px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:dueType==="after"?"#2563eb":"#e7e5e4",color:dueType==="after"?"#fff":"#57534e"}}>Deliver After</button>
</div>
<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
{["8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM"].map(t=>{
const sel=lastHour===t&&!!dueByInput;
return(<button key={t} onClick={e=>{e.stopPropagation();if(sel&&!dueByInput.match(/:\d+/)){setLastHour("");setDueByInput("");}else{applyHour(t);}}}
style={{padding:"6px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:sel?(dueType==="by"?"#dc2626":"#2563eb"):"#fff",color:sel?"#fff":"#1c1917",minWidth:44,textAlign:"center"}}>{t}</button>);
})}
</div>
<div style={{display:"flex",gap:4,marginBottom:2}}>
{[":00",":15",":30",":45"].map(m=>{
const curMins=dueByInput.match(/:\d+/)?.[0]||":00";
const sel=!!lastHour&&!!dueByInput&&curMins===m;
const disabled=!lastHour;
return(<button key={m} onClick={e=>{e.stopPropagation();if(!disabled)applyMins(m);}}
style={{flex:1,padding:"5px 2px",borderRadius:6,border:"none",cursor:disabled?"default":"pointer",fontSize:11,fontWeight:700,background:sel?(dueType==="by"?"#dc2626":"#2563eb"):disabled?"#f5f5f4":"#e7e5e4",color:sel?"#fff":disabled?"#c4c4c4":"#44403c",opacity:disabled?0.5:1}}>{m}</button>);
})}
</div>
{dueByInput&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
<span style={{fontSize:12,fontWeight:700,color:dueType==="by"?"#dc2626":"#2563eb"}}>{dueByInput}</span>
<button onClick={e=>{e.stopPropagation();setDueByInput("");setLastHour("");}} style={{background:"#fff",border:"1px solid #d6d3d1",borderRadius:5,padding:"2px 8px",cursor:"pointer",fontSize:10,color:"#78716c"}}>Clear</button>
</div>}
</div>
{/* Weight & Load */}
<div style={{marginTop:8,background:"#f0f5fa",border:"1px solid "+BRAND.light+"44",borderRadius:10,padding:"8px 10px"}}>
<div style={{display:"flex",gap:8,alignItems:"center"}}>
<div style={{flex:1}}>
<label style={{fontSize:10,fontWeight:600,color:"#57534e",display:"block",marginBottom:3}}>Weight (lbs)</label>
<input type="number" value={entry.weight||""} onChange={e=>{e.stopPropagation();if(onWeight)onWeight(e.target.value);}} onClick={e=>e.stopPropagation()} placeholder="0"
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
</div>
<div style={{flex:1}}>
<label style={{fontSize:10,fontWeight:600,color:"#57534e",display:"block",marginBottom:3}}>Load #</label>
<div style={{display:"flex",gap:3}}>
{[1,2,3].filter(n=>n<=(Math.max(maxLoad||1,entry.loadNum||1)+1)&&n<=3).map(n=><button key={n} onClick={e=>{e.stopPropagation();if(onLoadNum)onLoadNum(n);}} style={{flex:1,padding:"6px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:(entry.loadNum||1)===n?BRAND.main:"#e7e5e4",color:(entry.loadNum||1)===n?"#fff":"#57534e"}}>{n}</button>)}
</div>
</div>
</div>
</div>
<div style={{display:"flex",gap:6,marginTop:8,justifyContent:"flex-end"}}>
{hasI&&<button onClick={e=>{e.stopPropagation();setInstrText("");onUpdateInstructions("");setExpanded(false);}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear All</button>}
<button onClick={e=>{e.stopPropagation();setExpanded(false);}} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Cancel</button>
<button onClick={e=>{e.stopPropagation();onUpdateInstructions(instrText.trim());if(onDueBy)onDueBy(dueByInput||null);setExpanded(false);}} style={{background:BRAND.main,color:"#fff",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:600}}>Save</button>
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
"1028 Branch Dr, Alpharetta, GA 30004":{lat:34.1132,lng:-84.2798},
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
<div style={{margin:"0 4px"}}>
<GoogleMapView stops={stopsWithCoords} drivers={drivers} height={400} onStopClick={handleStopClick} activeDriver={activeDriver} showSearch={true} searchLabel="Search address…"
onAssignStop={activeDriver?(stopId,drvId)=>handleStopClick(stopId):null}/>
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
const[dueVal,setDueVal]=useState("");
const[dueType,setDueType]=useState("by");
const[weightVal,setWeightVal]=useState("");
const hasInstr=curInstr?.trim();
const HOURS=["8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM"];
const dueLabel=dueVal?(dueType==="by"?"By "+dueVal:"After "+dueVal):"";
const addWithExtras=()=>{onAdd(dueLabel||null,parseFloat(weightVal)||0);setDueVal("");setWeightVal("");};
return(
<div style={{marginBottom:6}}>
<div style={{display:"flex",width:"100%",textAlign:"left",background:checked?"#eff6ff":dueLabel?"#fef2f2":"#fff",border:checked?"2px solid #2563eb":dueLabel?"1px solid #fca5a5":"1px solid #e7e5e4",borderRadius:expanded?"12px 12px 0 0":12,padding:"12px 16px",borderLeft:`4px solid ${accent}`,alignItems:"center",gap:10}}>
{multiSelect&&<div onClick={onCheck} style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked?"#2563eb":"#d6d3d1"}`,background:checked?"#2563eb":"#fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700,flexShrink:0,cursor:"pointer"}}>{checked?"✓":""}</div>}
<div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>{if(multiSelect){onCheck();}else{addWithExtras();}}}>
<div style={{fontSize:14,fontWeight:600}}>{stop}</div>
{addr&&<div style={{fontSize:10,color:"#a8a29e"}}>{addr}</div>}
{note&&<div style={{fontSize:11,color:"#d97706",marginTop:2}}>{note}</div>}
{dueLabel&&<div style={{fontSize:10,color:dueType==="by"?"#dc2626":"#2563eb",fontWeight:700,marginTop:2}}>{"\u23F0"} {dueLabel}</div>}
{weightVal&&<div style={{fontSize:10,color:BRAND.main,fontWeight:700,marginTop:2}}>{parseFloat(weightVal).toLocaleString()} lbs</div>}
{hasInstr&&!expanded&&<div style={{fontSize:10,color:"#2563eb",marginTop:2}}>{"📋"} {curInstr}</div>}
{!hasInstr&&!expanded&&!dueLabel&&!weightVal&&<div style={{fontSize:9,color:"#d6d3d1",marginTop:2}}>tap to add</div>}
</div>
<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
<span style={{fontVariantNumeric:"tabular-nums",fontSize:17,fontWeight:700,color:accent}}>{rate?fmt(rate):"Hourly"}</span>
<div style={{display:"flex",gap:3}}>
<button onClick={e=>{e.stopPropagation();setInstrText(curInstr||"");setExpanded(!expanded);}} style={{background:hasInstr||dueLabel||weightVal?"#eff6ff":"#f5f5f4",border:hasInstr||dueLabel||weightVal?"1px solid #bfdbfe":"1px solid #e7e5e4",borderRadius:6,padding:"3px 6px",cursor:"pointer",fontSize:9,fontWeight:600,color:hasInstr||dueLabel||weightVal?"#2563eb":"#a8a29e"}}>{"⚙"}</button>
</div>
</div>
</div>
{expanded&&<div style={{padding:"8px 12px 10px",background:"#fff",border:"1px solid #e7e5e4",borderTop:"none",borderRadius:"0 0 12px 12px",borderLeft:`4px solid ${accent}`}}>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Instructions for {stop}</label>
<textarea value={instrText} onChange={e=>setInstrText(e.target.value)} placeholder="Phone #, gate code, dock info…" rows={2}
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
{/* Time constraint */}
<div style={{marginTop:8,background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:10,padding:"8px 10px"}}>
<div style={{display:"flex",gap:4,marginBottom:6}}>
<button onClick={e=>{e.stopPropagation();setDueType("by");}} style={{flex:1,padding:"5px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:dueType==="by"?"#dc2626":"#e7e5e4",color:dueType==="by"?"#fff":"#57534e"}}>{"\u23F0"} Due By</button>
<button onClick={e=>{e.stopPropagation();setDueType("after");}} style={{flex:1,padding:"5px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:dueType==="after"?"#2563eb":"#e7e5e4",color:dueType==="after"?"#fff":"#57534e"}}>Deliver After</button>
</div>
<div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
{HOURS.map(t=>{const sel=dueVal===t;return(<button key={t} onClick={e=>{e.stopPropagation();setDueVal(sel?"":t);}} style={{padding:"5px 8px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:sel?(dueType==="by"?"#dc2626":"#2563eb"):"#fff",color:sel?"#fff":"#1c1917"}}>{t}</button>);})}
{dueVal&&<button onClick={e=>{e.stopPropagation();setDueVal("");}} style={{padding:"5px 8px",borderRadius:6,border:"1px solid #d6d3d1",cursor:"pointer",fontSize:10,background:"#fff",color:"#78716c"}}>Clear</button>}
</div>
</div>
{/* Weight */}
<div style={{marginTop:8,background:"#f0f5fa",border:"1px solid "+BRAND.light+"44",borderRadius:10,padding:"8px 10px"}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<label style={{fontSize:11,fontWeight:600,color:BRAND.main,flexShrink:0}}>Weight:</label>
<input type="number" value={weightVal} onChange={e=>setWeightVal(e.target.value)} onClick={e=>e.stopPropagation()} placeholder="lbs"
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center",maxWidth:120}}/>
<span style={{fontSize:11,color:"#78716c"}}>lbs</span>
{weightVal&&<button onClick={e=>{e.stopPropagation();setWeightVal("");}} style={{background:"#fff",border:"1px solid #d6d3d1",borderRadius:5,padding:"2px 6px",cursor:"pointer",fontSize:10,color:"#78716c"}}>Clear</button>}
</div>
</div>
<div style={{display:"flex",gap:6,marginTop:8,justifyContent:"flex-end"}}>
<button onClick={()=>setExpanded(false)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Cancel</button>
<button onClick={()=>{onSaveInstr(instrText.trim());setExpanded(false);}} style={{background:BRAND.main,color:"#fff",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:600}}>Save</button>
</div>
</div>}
</div>
);
}

/* ── LOCALSTORAGE HELPERS (offline persistence until Firebase connected) ── */
const LS_DRIVERS="dd_drivers";
const LS_LOG="dd_log";
const LS_CUSTOM_INSTR="dd_custom_instr";
const LS_DISP_NOTES="dd_disp_notes";
const LS_EMH="dd_emh";
const DEFAULT_DRIVERS=[{id:1,name:"Trevor Seyers",phone:"404-394-9891"},{id:2,name:"Brent Dixon",phone:""},{id:3,name:"Trevarr Howard",phone:""}];
function lsGet(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}}
function lsSet(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch{}}

/* ══════════════ DISPATCH APP (owner view) ══════════════ */
function DispatchApp(){
const isDesktop=useIsDesktop();
const[wo,setWo]=useState(0);
const[sd,setSd]=useState(()=>{const d=new Date().getDay();return d>=1&&d<=5?d-1:0;});
const[log,setLog]=useState(()=>lsGet(LS_LOG,{}));
const[view,setView]=useState("manifest");
const[selCust,setSelCust]=useState(null);
const[selStop,setSelStop]=useState(null);
const[emH,setEmH]=useState(()=>lsGet(LS_EMH,{}));
const[toast,setToast]=useState(null);
const[drivers,setDrivers]=useState(()=>lsGet(LS_DRIVERS,DEFAULT_DRIVERS));
const[showDM,setShowDM]=useState(false);
const[showLinkModal,setShowLinkModal]=useState(null); /* {name, url, phone} */
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
const[customInstr,setCustomInstr]=useState(()=>lsGet(LS_CUSTOM_INSTR,{}));
const[showAddCustomDel,setShowAddCustomDel]=useState(false);
const[mapActiveDrv,setMapActiveDrv]=useState(null); /* driver selected for click-to-assign on Live Routes map */
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
/* 2-Way Messaging */
const[showMsgPanel,setShowMsgPanel]=useState(false);
const[msgChannel,setMsgChannel]=useState(null); /* null=group, driverId=private */
const[msgInput,setMsgInput]=useState("");
const[allMessages,setAllMessages]=useState({}); /* {channelKey: [{id,from,text,time,fromName},...]} */
const[histSearch,setHistSearch]=useState("");
const[histCustFilter,setHistCustFilter]=useState("");
const[histDrvFilter,setHistDrvFilter]=useState("");
const[histWeekRange,setHistWeekRange]=useState(4);
const[histMode,setHistMode]=useState("deliveries"); /* deliveries | photos | emser */
const[lightboxPhoto,setLightboxPhoto]=useState(null);
const[emserShifts,setEmserShifts]=useState(()=>lsGet("dd_emser_shifts",{})); /* {dayKey: [{id,driverId,start,end},...]} */
const[dispNotes,setDispNotes]=useState(()=>lsGet(LS_DISP_NOTES,{}));
const[editingNote,setEditingNote]=useState(false);
const[noteText,setNoteText]=useState("");
const[showCustPickup,setShowCustPickup]=useState(false);
const[custPUFrom,setCustPUFrom]=useState("");
const[custPUAddr,setCustPUAddr]=useState("");
const[custPUNote,setCustPUNote]=useState("");
/* ── QUOTES ── */
const[savedQuotes,setSavedQuotes]=useState(()=>lsGet("dd_quotes",[]));
const[quoteFormOpen,setQuoteFormOpen]=useState(false);
const[qCust,setQCust]=useState("");
const[qStop,setQStop]=useState("");
const[qAddr,setQAddr]=useState("");
const[qRate,setQRate]=useState("");
const[qNote,setQNote]=useState("");
const[qMiles,setQMiles]=useState("");
const[qLiftgate,setQLiftgate]=useState(false);
const[qGravel,setQGravel]=useState(false);
const[qExtraPallets,setQExtraPallets]=useState(false);
const[qPushDay,setQPushDay]=useState(null); /* {quoteId, targetDk} */

const wd=getWeekDates(wo);const dk=`${wo}-${sd}`;const dl=log[dk]||[];
const showToast=useCallback(m=>{setToast(m);setTimeout(()=>setToast(null),2000);},[]);
const firebaseReady=useRef(false);
const skipNextSync=useRef(false);

/* ── FIREBASE SYNC ── */
useEffect(()=>{
  const unsubDrivers=subscribeDrivers((fbDrivers)=>{
    if(fbDrivers&&fbDrivers.length>0)setDrivers(fbDrivers);
  });
  const unsubEmser=subscribeEmserHours((fbEmH)=>{setEmH(fbEmH);});
  const unsubNotes=subscribeDispatchNotes((fbNotes)=>{setDispNotes(p=>({...p,...fbNotes}));});
  const unsubShifts=subscribeEmserShifts((fbShifts)=>{setEmserShifts(p=>({...p,...fbShifts}));});
  const unsubQuotes=subscribeQuotes((fbQuotes)=>{setSavedQuotes(fbQuotes);});
  firebaseReady.current=true;
  return()=>{unsubDrivers();unsubEmser();unsubNotes();unsubShifts();unsubQuotes();};
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
  const timer=setTimeout(()=>{
    const emKey=`${dk}-emser`;
    if(emH[emKey]!==undefined){
      saveEmserHours(emKey,emH[emKey]).catch(e=>console.error("EmH save:",e));
    }
  },500);
  return()=>clearTimeout(timer);
},[emH,dk]);

useEffect(()=>{
  if(!firebaseReady.current)return;
  const timer=setTimeout(()=>{
    if(dispNotes[dk]!==undefined){
      saveDispatchNote(dk,dispNotes[dk]||"").catch(e=>console.error("Note save:",e));
    }
  },500);
  return()=>clearTimeout(timer);
},[dispNotes,dk]);

useEffect(()=>{
  if(!firebaseReady.current)return;
  const timer=setTimeout(()=>{
    const shifts=emserShifts[dk];
    if(shifts!==undefined){
      saveEmserShifts(dk,shifts||[]).catch(e=>console.error("Shifts save:",e));
    }
  },500);
  return()=>clearTimeout(timer);
},[emserShifts,dk]);

/* ── LOCALSTORAGE PERSISTENCE (offline fallback — active until Firebase connected) ── */
useEffect(()=>{lsSet(LS_DRIVERS,drivers);},[drivers]);
useEffect(()=>{lsSet(LS_LOG,log);},[log]);
useEffect(()=>{lsSet(LS_CUSTOM_INSTR,customInstr);},[customInstr]);
useEffect(()=>{lsSet(LS_DISP_NOTES,dispNotes);},[dispNotes]);
useEffect(()=>{lsSet(LS_EMH,emH);},[emH]);
useEffect(()=>{lsSet("dd_emser_shifts",emserShifts);},[emserShifts]);
useEffect(()=>{
  if(!firebaseReady.current)return;
  const timer=setTimeout(()=>{
    /* Save each changed day's shifts */
    Object.entries(emserShifts).forEach(([dayKey,shifts])=>{
      saveEmserShifts(dayKey,shifts).catch(e=>console.error("Shifts save:",e));
    });
  },500);
  return()=>clearTimeout(timer);
},[emserShifts]);
useEffect(()=>{lsSet("dd_quotes",savedQuotes);},[savedQuotes]);

/* ── QUOTE HELPERS ── */
const calcQuoteRate=(miles,liftgate,gravel,extraPallets)=>{
let base=getBaseTier(parseFloat(miles)||0);
let fuel=0;
if(liftgate){fuel=75;}else{fuel=Math.round(base*0.15);}
if(gravel)base+=25;
if(extraPallets)base+=25;
return{base,fuel,total:base+fuel};
};
const saveQuote=()=>{
const miles=parseFloat(qMiles)||0;
const manualRate=parseFloat(qRate)||0;
const calc=miles>0?calcQuoteRate(miles,qLiftgate,qGravel,qExtraPallets):null;
const finalRate=manualRate||calc?.total||0;
const q={id:Date.now()+Math.random(),num:savedQuotes.length+1,customer:qCust,stop:qStop,addr:qAddr,rate:finalRate,miles:miles||null,liftgate:qLiftgate,gravel:qGravel,extraPallets:qExtraPallets,note:qNote,calc,createdAt:new Date().toISOString(),status:"pending"};
setSavedQuotes(p=>[q,...p]);
saveQuoteToFB(q).catch(e=>console.error("Quote save:",e));
setQCust("");setQStop("");setQAddr("");setQRate("");setQNote("");setQMiles("");setQLiftgate(false);setQGravel(false);setQExtraPallets(false);setQuoteFormOpen(false);
showToast("Quote #"+q.num+" saved");
};
const pushQuoteToDay=(quoteId,targetDk)=>{
const q=savedQuotes.find(x=>x.id===quoteId);
if(!q)return;
const cust=q.customer||"Quote Delivery";
const entry={id:Date.now()+Math.random(),customer:cust,stop:q.stop||"Quote Delivery",baseRate:q.rate||0,fuelPct:0,isHourly:false,note:q.note||(q.miles?q.miles+"mi":""),driverId:0,addr:q.addr||"",stopType:"delivery",priority:false,instructions:"",status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null,dueBy:null,weight:0,loadNum:1};
setLog(p=>({...p,[targetDk]:[...(p[targetDk]||[]),entry]}));
setSavedQuotes(p=>p.map(x=>x.id===quoteId?{...x,status:"accepted",pushedTo:targetDk}:x));
const updated={...q,status:"accepted",pushedTo:targetDk};
saveQuoteToFB(updated).catch(e=>console.error("Quote update:",e));
showToast("Quote pushed to manifest");
setQPushDay(null);
};

const addDel=(cust,stop,rate,drvId,ex={})=>{
const cd=CUSTOMERS[cust];
const instrForStop=customInstr[stop]!==undefined?customInstr[stop]:getDefaultInstr(stop);
/* Auto time constraints for specific stops */
const autoDueBy=ex.dueBy||(stop==="Atlanta Flooring - Suwanee"?"9:30–1:00 PM"
:cust==="IMETCO"&&stop==="IMETCO to Finishing Dynamics"?"By 2:00 PM"
:cust==="IMETCO"&&stop==="Perfect Edge to IMETCO"?"By 3:30 PM"
:cust==="IMETCO"&&stop==="Southern Aluminum to IMETCO"?"By 3:30 PM"
:cust==="IMETCO"&&stop==="Finishing Dynamics to IMETCO"?"By 3:30 PM"
:cust==="IMETCO"&&stop==="Round Trip IMETCO & Finishing Dynamics"?"By 3:30 PM"
:null);
const autoDeliverAfter=(cust==="Specialty"&&!ex.dueBy)?"Pickup 7:30 AM — Specialty":null;
const entry={id:Date.now()+Math.random(),customer:cust,stop,baseRate:rate,fuelPct:ex.fuelPct||0,isHourly:ex.isHourly||false,note:ex.note||null,driverId:drvId,addr:ex.addr||getAddr(stop),stopType:ex.stopType||"delivery",priority:ex.priority||(cd?.priority)||false,instructions:ex.instructions!==undefined?ex.instructions:instrForStop,status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null,dueBy:autoDueBy||autoDeliverAfter||null,weight:ex.weight||0,loadNum:ex.loadNum||1};
setLog(p=>({...p,[dk]:[...(p[dk]||[]),entry]}));
/* DCO Eatonton: auto-add 1 bonus hour to Emser billing (long-distance run) */
if(stop==="DCO Eatonton"&&cust==="Emser Tile"){
setEmH(p=>{const key=`${dk}-emser`;const cur=p[key]||4;return{...p,[key]:cur+1,[`${dk}-eatonton-bonus`]:true};});
showToast("DCO Eatonton added — +1 bonus hr applied");
}else if(stop==="Atlanta Flooring - Suwanee"){
showToast("Atlanta Flooring added — 9:30 AM–1 PM window");
}else{
showToast(`${stop} added`);
}
if(quoteMode)setQuoteMode(null);
};
const addMulti=(cust,stops,drvId)=>{
const cd=CUSTOMERS[cust];
const isSpecialty=cust==="Specialty";
const newEntries=stops.map(s=>{const isStr=typeof s==="string";const stop=isStr?s:s.s;const rate=isStr?0:s.r;const instrForStop=customInstr[stop]!==undefined?customInstr[stop]:getDefaultInstr(stop);
const autoDue=isSpecialty?"Pickup 7:30 AM — Specialty"
:cust==="IMETCO"&&(stop==="IMETCO to Finishing Dynamics"||stop==="Finishing Dynamics to IMETCO"||stop==="Round Trip IMETCO & Finishing Dynamics")?"By 2:00 PM"
:cust==="IMETCO"&&(stop==="Perfect Edge to IMETCO"||stop==="Southern Aluminum to IMETCO")?"By 3:00 PM"
:null;
return{id:Date.now()+Math.random(),customer:cust,stop,baseRate:rate,fuelPct:(cd.fuel_surcharge&&!cd.fuel_included)?cd.fuel_surcharge:0,isHourly:cd.rate_type==="hourly",note:isStr?null:s.n||null,driverId:drvId,addr:getAddr(stop),stopType:"delivery",priority:cd.priority||false,instructions:instrForStop,status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null,dueBy:autoDue,weight:0,loadNum:1};
});
setLog(p=>({...p,[dk]:[...(p[dk]||[]),...newEntries]}));showToast(`${stops.length} stops added`);setMultiSelect(false);setMultiChecked([]);
};
const rmDel=id=>setLog(p=>({...p,[dk]:(p[dk]||[]).filter(e=>e.id!==id)}));
/* Remove from driver → unassign back to pool; remove from unassigned → delete entirely */
const rmFromDriver=(id)=>{const entry=dl.find(e=>e.id===id);if(!entry)return;if(entry.driverId===0){rmDel(id);}else{reassign(id,0);showToast("Moved to Unassigned");}};

const reassign=(eid,did)=>{
const entry=dl.find(e=>e.id===eid);
const oldDid=entry?.driverId;
setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,driverId:did}:e)}));
if(entry&&did>0&&did!==oldDid){
const newDrv=drivers.find(d=>d.id===did);
const oldDrv=oldDid?drivers.find(d=>d.id===oldDid):null;
sendNotificationToDriver(did,"🔄 ROUTE CHANGED\nNew stop added to your route:\n"+entry.stop+(entry.customer?" ("+entry.customer+")":"")+(entry.addr?"\n📍 "+entry.addr:""),"route_change").catch(()=>{});
if(oldDrv&&oldDid>0)sendNotificationToDriver(oldDid,"🔄 ROUTE CHANGED\nStop removed from your route:\n"+entry.stop+(entry.customer?" ("+entry.customer+")":""),"route_change").catch(()=>{});
}
};
const updateInstructions=(eid,text)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,instructions:text}:e)}));
const updateRate=(eid,rate)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,baseRate:parseFloat(rate)||0}:e)}));
const updateStatus=(eid,status)=>{const now=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,status,arrivedAt:status==="arrived"?now:e.arrivedAt,departedAt:status==="departed"?now:e.departedAt}:e)}));};
const addPhoto=(eid,dataUrl)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),dataUrl]}:e)}));
const addSignature=(eid,dataUrl)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,signature:dataUrl}:e)}));
const setShipPlan=(eid,num)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,shipPlan:num}:e)}));
const setEta=(eid,mins,dest)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,eta:mins,etaDest:dest||null}:e)}));
const setDueBy=(eid,time)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,dueBy:time||null}:e)}));
const setWeight=(eid,w)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,weight:parseFloat(w)||0}:e)}));
const setLoadNum=(eid,n)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,loadNum:n}:e)}));

/* ── TRUCK WEIGHT LIMITS ── */
const TRUCK_LIMITS={default:10000,heavy:14000};
const getLoadWeight=(drvId,loadN)=>dl.filter(e=>e.driverId===drvId&&(e.loadNum||1)===loadN).reduce((s,e)=>s+(e.weight||0),0);
const getDriverLoads=(drvId)=>{const loads=new Set();dl.filter(e=>e.driverId===drvId).forEach(e=>loads.add(e.loadNum||1));return[...loads].sort((a,b)=>a-b);};
const getMaxLoad=(drvId)=>{const loads=getDriverLoads(drvId);return loads.length>0?Math.max(...loads):1;};
const weightPct=(w)=>Math.min((w/TRUCK_LIMITS.default)*100,100);
const weightColor=(w)=>w>TRUCK_LIMITS.default?"#dc2626":w>TRUCK_LIMITS.default*0.85?"#d97706":"#16a34a";

/* ── EMSER SHIFT HELPERS ── */
/* parseTime accepts both "14:30" (from <input type=time>) and "2:30 PM" (legacy) */
const parseTime=(str)=>{
  if(!str)return null;
  const m24=str.match(/^(\d{1,2}):(\d{2})$/);
  if(m24)return parseInt(m24[1])*60+parseInt(m24[2]);
  const m12=str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if(!m12)return null;
  let h=parseInt(m12[1]);const min=parseInt(m12[2]);const ap=m12[3].toUpperCase();
  if(ap==="PM"&&h!==12)h+=12;
  if(ap==="AM"&&h===12)h=0;
  return h*60+min;
};
const presetTo24=(t)=>{const m=t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);if(!m)return t;let h=parseInt(m[1]);const min=m[2];const ap=m[3].toUpperCase();if(ap==="PM"&&h!==12)h+=12;if(ap==="AM"&&h===12)h=0;return String(h).padStart(2,"0")+":"+min;};
const formatMins=(totalMins)=>{const h=Math.floor(totalMins/60);const m=totalMins%60;return m>0?`${h}h ${m}m`:`${h}h`;};
const calcShiftMins=(shift)=>{const s=parseTime(shift.start);const e=parseTime(shift.end);if(s===null||e===null||e<=s)return 0;return e-s;};
const getEmserDayShifts=()=>emserShifts[dk]||[];

/* Returns {byDriver:{driverId:mins}, totalMins} for any dayKey */
const getShiftSummary=(dayKey)=>{
  const shifts=emserShifts[dayKey]||[];
  const byDriver={};
  let totalMins=0;
  shifts.forEach(s=>{
    const m=calcShiftMins(s);
    if(m>0){byDriver[s.driverId]=(byDriver[s.driverId]||0)+m;totalMins+=m;}
  });
  return{byDriver,totalMins};
};

const addEmserShift=(driverId)=>{const shifts=getEmserDayShifts();setEmserShifts(p=>({...p,[dk]:[...shifts,{id:Date.now()+Math.random(),driverId,start:"",end:""}]}));};
const updateEmserShift=(shiftId,field,val)=>{setEmserShifts(p=>({...p,[dk]:(p[dk]||[]).map(s=>s.id===shiftId?{...s,[field]:val}:s)}));};
const removeEmserShift=(shiftId)=>{setEmserShifts(p=>({...p,[dk]:(p[dk]||[]).filter(s=>s.id!==shiftId)}));};
const calcAndApplyEmserHours=useCallback(()=>{const shifts=emserShifts[dk]||[];const totalMins=shifts.reduce((sum,s)=>sum+calcShiftMins(s),0);const hours=Math.round(totalMins/15)*15/60;if(hours>0){setEmH(p=>({...p,[`${dk}-emser`]:hours}));return hours;}return emH[`${dk}-emser`]||4;},[emserShifts,dk,emH]);

/* Auto-apply shift totals to emH whenever shifts change for this day */
useEffect(()=>{
  const shifts=emserShifts[dk]||[];
  if(!shifts.length)return;
  const totalMins=shifts.reduce((sum,s)=>sum+calcShiftMins(s),0);
  if(totalMins>0){
    const hours=Math.round(totalMins/15)*15/60;
    setEmH(p=>{if(p[`${dk}-emser`]===hours)return p;return{...p,[`${dk}-emser`]:hours};});
  }
},[emserShifts,dk]);

/* ── 2-WAY MESSAGING ── */
const getMsgKey=(ch)=>ch?"dm-"+ch:"group";
const getMessages=(ch)=>allMessages[getMsgKey(ch)]||[];
const sendMsg=(ch)=>{
if(!msgInput.trim())return;
const key=getMsgKey(ch);
const now=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
const msg={id:Date.now()+Math.random(),from:"dispatch",fromName:"Dispatch",text:msgInput.trim(),time:now,read:false};
setAllMessages(p=>({...p,[key]:[...(p[key]||[]),msg]}));
setMsgInput("");
/* In production, save to Firestore for real-time sync */
};
const getUnreadCount=(ch)=>{const msgs=getMessages(ch);return msgs.filter(m=>m.from!=="dispatch"&&!m.read).length;};
const getTotalUnread=()=>{let c=getUnreadCount(null);drivers.forEach(d=>{c+=getUnreadCount(d.id);});return c;};
const markMsgsRead=(ch)=>{const key=getMsgKey(ch);setAllMessages(p=>({...p,[key]:(p[key]||[]).map(m=>m.from!=="dispatch"?{...m,read:true}:m)}));};

const moveInDriver=(drvId,fromIdx,dir)=>{const toIdx=fromIdx+dir;setLog(p=>{const all=[...(p[dk]||[])];const de=all.filter(e=>e.driverId===drvId);const rest=all.filter(e=>e.driverId!==drvId);if(toIdx<0||toIdx>=de.length)return p;[de[fromIdx],de[toIdx]]=[de[toIdx],de[fromIdx]];return{...p,[dk]:[...rest,...de]};});};
const insertPickup=(drvId,afterIdx)=>{if(!pickupStop)return;const forLabel=pickupForDel?` → ${pickupForDel}`:"";const entry={id:Date.now()+Math.random(),customer:pickupCustomer||"Pickup",stop:`${pickupCustomer||"Pickup"}${forLabel}`,baseRate:0,fuelPct:0,isHourly:false,note:pickupNote||(pickupForDel?`Picking up for ${pickupForDel}`:null),driverId:drvId,addr:pickupAddr||"",stopType:"pickup",priority:false,pickupFrom:pickupStop,pickupFor:pickupForDel,instructions:"",status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null};setLog(p=>{const all=[...(p[dk]||[])];const de=all.filter(e=>e.driverId===drvId);const rest=all.filter(e=>e.driverId!==drvId);de.splice(afterIdx+1,0,entry);return{...p,[dk]:[...rest,...de]};});setInsertPickupFor(null);setPickupCustomer("");setPickupStop("");setPickupAddr("");setPickupForDel("");setPickupNote("");showToast(`Pickup added`);};

const computeDay=key=>{const entries=log[key]||[];let base=0;if(entries.some(e=>e.isHourly))base+=102.50*(emH[`${key}-emser`]||4);const fBC={};entries.forEach(e=>{if(e.isHourly)return;base+=e.baseRate;if(e.fuelPct>0){if(!fBC[e.customer])fBC[e.customer]={pct:e.fuelPct,base:0};fBC[e.customer].base+=e.baseRate;}});let fuel=0;Object.values(fBC).forEach(c=>{fuel+=c.base*c.pct;});return{base,fuel,total:base+fuel,fBC};};
const dc=computeDay(dk);const wkD=DAYS.map((_,i)=>{const k=`${wo}-${i}`;return{entries:log[k]||[],calc:computeDay(k)};});const wkT=wkD.reduce((s,d)=>s+d.calc.total,0);
const wkF={};wkD.forEach(d=>{Object.entries(d.calc.fBC).forEach(([c,cf])=>{if(!wkF[c])wkF[c]={pct:cf.pct,base:0};wkF[c].base+=cf.base;});});
const prevWkD=DAYS.map((_,i)=>{const k=`${wo-1}-${i}`;return{entries:log[k]||[],calc:computeDay(k)};});
const prevWkT=prevWkD.reduce((s,d)=>s+d.calc.total,0);
const wowDelta=wkT-prevWkT;
const wowPct=prevWkT>0?((wowDelta/prevWkT)*100):0;
const getHistoryEntries=()=>{const all=[];for(let w=wo;w>=wo-histWeekRange;w--){const wdates=getWeekDates(w);for(let d=0;d<5;d++){const k=`${w}-${d}`;(log[k]||[]).forEach(e=>all.push({...e,weekOff:w,dayIdx:d,dayName:DAYS[d],dayDate:wdates[d].date}));}}return all;};
const histAll=getHistoryEntries();
const histFiltered=histAll.filter(e=>{const q=histSearch.toLowerCase();return(!q||e.stop.toLowerCase().includes(q)||e.customer.toLowerCase().includes(q)||(e.addr||"").toLowerCase().includes(q))&&(!histCustFilter||e.customer===histCustFilter)&&(!histDrvFilter||e.driverId===Number(histDrvFilter));});

const addDrvr=()=>{if(!newDN.trim()||drivers.length>=4)return;setDrivers(p=>[...p,{id:Date.now(),name:newDN.trim(),phone:newDP.trim()}]);setNewDN("");setNewDP("");};
const saveDrv=id=>{if(!editNm.trim())return;setDrivers(p=>p.map(d=>d.id===id?{...d,name:editNm.trim(),phone:editPh.trim()}:d));setEditDrv(null);};
const rmDrv=id=>{if(drivers.length<=1)return;setDrivers(p=>p.filter(d=>d.id!==id));};
const drvEntries=did=>dl.filter(e=>e.driverId===did);
const handleDrop=(drvId,toIdx)=>{
if(!dragSrc){setDragSrc(null);setDragOver(null);return;}
if(dragSrc.drvId===drvId&&dragSrc.idx===toIdx){setDragSrc(null);setDragOver(null);return;}
if(dragSrc.drvId===drvId){
/* Same driver — reorder */
setLog(p=>{const all=[...(p[dk]||[])];const de=all.filter(e=>e.driverId===drvId);const rest=all.filter(e=>e.driverId!==drvId);const[moved]=de.splice(dragSrc.idx,1);de.splice(toIdx,0,moved);return{...p,[dk]:[...rest,...de]};});
}else{
/* Cross-driver — reassign */
const srcEntries=dl.filter(e=>e.driverId===dragSrc.drvId);
const entry=srcEntries[dragSrc.idx];
if(entry){
reassign(entry.id,drvId);
showToast("Moved to "+((drivers.find(d=>d.id===drvId))?.name||"driver"));
}
}
setDragSrc(null);setDragOver(null);
};
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
const drvSummary=drivers.map(d=>{const de=drvEntries(d.id);return`${d.name} (id:${d.id}, phone:${d.phone||"none"}): ${de.length} stops — ${de.map((e,i)=>{let s=`${i+1}. ${e.stop} (${e.customer}${e.addr?", "+e.addr:""})`;if(e.dueBy)s+=` [⏰ ${e.dueBy}]`;if(e.instructions)s+=` [📋 ${e.instructions}]`;return s;}).join("; ")||"no stops"}`;}).join("\n");
const unassigned=dl.filter(e=>e.driverId===0);
const uaSummary=unassigned.length?unassigned.map(e=>{let s=`${e.stop} (${e.customer})`;if(e.dueBy)s+=` [⏰ ${e.dueBy}]`;return s;}).join(", "):"none";
const custList=Object.entries(CUSTOMERS).map(([name,cd])=>{
const dels=cd.deliveries.map(d=>typeof d==="string"?d:`${d.s} $${d.r}`).join(", ");
return`${name}: ${cd.rate_type==="hourly"?"$102.50/hr":cd.note}. Pickup: ${cd.pickup}. Deliveries: ${dels}`;
}).join("\n");
/* Build time constraints summary from active stops */
const allStopsWithTimes=dl.filter(e=>e.dueBy);
const timeConstraintLines=allStopsWithTimes.length?allStopsWithTimes.map(e=>{const drv=drivers.find(d=>d.id===e.driverId);return`- ${e.stop}: ${e.dueBy}${drv?" (assigned to "+drv.name+")":"  (unassigned)"}`;}).join("\n"):"None today";
return`You are the AI dispatch assistant for Davis Delivery Dispatch & Delivery, a trucking company in Atlanta, GA.
You help the owner manage routes, quote deliveries, optimize stops, and answer questions about the business.

TODAY: ${wd[sd].name} ${wd[sd].date}
WEEK TOTAL: ${fmt(wkT)}
DAY TOTAL: ${fmt(dc.total)}

DRIVERS & CURRENT MANIFESTS:
${drvSummary}

UNASSIGNED STOPS: ${uaSummary}

TIME CONSTRAINTS ON TODAY'S STOPS:
${timeConstraintLines}

STANDING TIME RULES (always apply these when routing):
- Specialty (ALL stops): Pickup at Specialty dock by 7:30 AM — must be FIRST stop of the day
- Atlanta Flooring - Suwanee: Deliver between 9:30 AM and 1:00 PM only
- IMETCO to Finishing Dynamics: Must be delivered by 2:00 PM
- All deliveries TO IMETCO (Perfect Edge, Southern Aluminum, Finishing Dynamics, Round Trip): Must arrive by 3:30 PM
- DCO Eatonton: Long-distance run — schedule early, allow 2+ hours travel
- LaVista/Waffle House (Specialty): Must have appointment time, normally 10 AM
- MM Systems - Pendergrass: Closed 11:45 AM–12:30 PM for lunch
- Thermal Products - Norcross: Closed 1:00–2:00 PM for lunch
- Britts - Lawrenceville: Not before 9 AM
- DCO Tech Dr: Not before 10 AM

ROUTING RULES — ALWAYS FOLLOW THESE:
1. Any stop with a time constraint (shown as ⏰ in manifests) must be scheduled to meet that window
2. Specialty pickup is ALWAYS first — driver must be at Specialty dock at 7:30 AM
3. "Pickup X:XX AM" tags mean the driver must arrive at pickup no later than that time
4. "By X:XX PM" tags mean delivery must be COMPLETED before that time
5. "X:XX–X:XX" window tags mean delivery must happen within that window
6. After meeting time-constrained stops, optimize remaining stops by geography
7. Never suggest a route that violates a time constraint — flag conflicts explicitly

CONTRACT CUSTOMERS & RATES:
${custList}

QUOTE CUSTOMERS: ${QUOTE_CUSTOMERS.map(q=>q.name).join(", ")}
QUOTE PRICING: ≤10mi=$100, ≤20mi=$150, ≤30mi=$200, ≤40mi=$250, then +$50/10mi. Liftgate +$75 (replaces 15% fuel). Gravel +$25. 4-5 pallets +$25.

You can help with:
- Suggesting optimal route order respecting all time constraints
- Calculating quotes for deliveries
- Summarizing the day/week
- Answering questions about customer rates, addresses, instructions
- Flagging scheduling conflicts between time-constrained stops
- Drafting invoice summaries

When suggesting route orders, ALWAYS show time constraints first, then order remaining stops by geographic proximity in the Atlanta metro.
If two stops have conflicting time windows, flag the conflict clearly before suggesting a route.
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
const payload={
model:"claude-haiku-4-5-20251001",
max_tokens:1024,
system:buildSystemPrompt(),
messages:newMessages.map(m=>({role:m.role,content:m.content})),
};
let data=null;
let errDetails="";
/* Attempt 1: Netlify function */
try{
const r=await fetch("/.netlify/functions/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
const txt=await r.text();
if(r.ok){try{data=JSON.parse(txt);if(!data?.content)data=null;}catch(e){data=null;}}
if(!data)errDetails="Netlify function returned: "+txt.slice(0,300);
}catch(e){errDetails="Netlify function unreachable: "+e.message;}
/* Attempt 2: Direct Anthropic API (works from deployed site with CORS header) */
if(!data){
try{
const r2=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify(payload)});
if(r2.ok){data=await r2.json();if(!data?.content)data=null;}
else{const t2=await r2.text();errDetails+="\nDirect API: "+t2.slice(0,200);}
}catch(e2){errDetails+="\nDirect API error: "+e2.message;}
}
if(data&&data.content){
const assistantText=data.content.map(c=>c.type==="text"?c.text:"").join("")||"No response.";
setChatMessages(prev=>[...prev,{role:"assistant",content:assistantText}]);
}else{
setChatMessages(prev=>[...prev,{role:"assistant",content:"AI unavailable.\n\n"+errDetails+"\n\nTo fix:\n1. Set ANTHROPIC_API_KEY in Netlify env vars\n2. Redeploy the site\n3. Ensure the API key has credits"}]);
}
}catch(err){
setChatMessages(prev=>[...prev,{role:"assistant",content:"Connection error: "+err.message}]);
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

/* ═══════════════ DESKTOP LAYOUT ═══════════════ */
/* For add/selCust/quoteMode on desktop, fall through to the shared mobile layout below */
if(isDesktop&&view!=="add"&&!selCust&&!quoteMode){
const dkNote=dispNotes[dk]||"";
const allDriverEntries=drivers.map((drv,di)=>({drv,di,entries:drvEntries(drv.id)}));
const uaEntries=dl.filter(e=>e.driverId===0);
const custRevenue={};dl.forEach(e=>{if(!e.isHourly){if(!custRevenue[e.customer])custRevenue[e.customer]=0;custRevenue[e.customer]+=e.baseRate;}});
if(dl.some(e=>e.isHourly)){custRevenue["Emser Tile"]=(custRevenue["Emser Tile"]||0)+102.50*(emH[`${dk}-emser`]||4);}
const custRevArr=Object.entries(custRevenue).sort((a,b)=>b[1]-a[1]);
const maxCustRev=Math.max(...custRevArr.map(c=>c[1]),1);
const statusCounts={pending:0,arrived:0,departed:0};
dl.forEach(e=>{if(e.status==="departed")statusCounts.departed++;else if(e.status==="arrived")statusCounts.arrived++;else statusCounts.pending++;});

return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#f8f7f5",color:"#1c1917",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
{toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#16a34a",color:"#fff",padding:"10px 24px",borderRadius:12,fontWeight:600,fontSize:14,zIndex:1000,boxShadow:"0 8px 32px rgba(22,163,74,0.3)",animation:"slideDown 0.3s ease"}}>{"\u2713 "+toast}</div>}

{/* \u2500\u2500 TOP BAR \u2500\u2500 */}
<div style={{background:"#f7f7f6",borderBottom:"1px solid #e7e5e4",padding:"8px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
<div style={{display:"flex",alignItems:"center",gap:24}}>
<img src={LOGO_URI} alt="Davis Delivery Service" style={{height:38,objectFit:"contain"}}/>
<div style={{display:"flex",gap:3,background:"#fff",borderRadius:10,padding:3,border:"1px solid #e7e5e4"}}>
<button onClick={()=>setWo(w=>w-1)} style={{background:"transparent",border:"none",color:"#78716c",borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:12}}>{"\u25C0"}</button>
{wd.map((d,i)=>{const cnt=(log[`${wo}-${i}`]||[]).length;return(<button key={i} onClick={()=>setSd(i)} style={{border:"none",borderRadius:7,padding:"6px 14px",cursor:"pointer",background:sd===i?BRAND.main:"transparent",color:sd===i?"#fff":"#78716c",fontSize:12,fontWeight:sd===i?700:500,position:"relative"}}>
{d.name.slice(0,3)} <span style={{fontSize:10,opacity:0.7}}>{d.date}</span>
{cnt>0&&<span style={{position:"absolute",top:2,right:4,width:5,height:5,borderRadius:3,background:sd===i?"#fff":"#16a34a"}}/>}
</button>);})}
<button onClick={()=>setWo(w=>w+1)} style={{background:"transparent",border:"none",color:"#78716c",borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:12}}>{"\u25B6"}</button>
{wo!==0&&<button onClick={()=>{setWo(0);setSd(()=>{const d=new Date().getDay();return d>=1&&d<=5?d-1:0;});}} style={{background:"#16a34a",border:"none",borderRadius:7,padding:"4px 14px",cursor:"pointer",fontSize:11,fontWeight:600,color:"#fff",marginLeft:2}}>Today</button>}
</div>
</div>
<div style={{display:"flex",alignItems:"center",gap:10}}>
{view!=="manifest"&&<button onClick={()=>{setView("manifest");setSelCust(null);setQuoteMode(null);}} style={{background:BRAND.main,border:"none",color:"#fff",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:700}}>{"← Dashboard"}</button>}
{[{k:"daily",l:"Daily"},{k:"weekly",l:"Weekly"},{k:"history",l:"History"},{k:"routes",l:"Routes"},{k:"add",l:"+ Add"}].map(v=><button key={v.k} onClick={()=>{setView(v.k);setSelCust(null);setQuoteMode(null);}} style={{background:view===v.k?(v.k==="add"?"#16a34a":v.k==="routes"?"#d97706":BRAND.main):v.k==="add"?"#f0fdf4":v.k==="routes"?"#fffbeb":"#fff",border:view===v.k?"none":v.k==="add"?"1px solid #bbf7d0":v.k==="routes"?"1px solid #fde68a":"1px solid #e7e5e4",color:view===v.k?"#fff":v.k==="add"?"#16a34a":v.k==="routes"?"#d97706":"#57534e",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>{v.l}</button>)}
<button onClick={()=>setShowDatePicker(!showDatePicker)} style={{background:"#fff",border:"1px solid #e7e5e4",color:"#57534e",borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:13}}>📅</button>
{showDatePicker&&<div style={{position:"fixed",top:52,right:220,zIndex:200,background:"#fff",border:"1px solid #e7e5e4",borderRadius:12,padding:"10px 14px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:12,color:"#78716c"}}>Jump to:</span>
<input type="date" onChange={e=>{if(e.target.value)jumpToDate(e.target.value);}} style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:13,outline:"none"}}/>
<button onClick={()=>setShowDatePicker(false)} style={{background:"#f5f5f4",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:11,color:"#57534e"}}>✕</button>
</div>}
<button onClick={()=>{setShowMsgPanel(true);setMsgChannel(null);markMsgsRead(null);}} style={{background:"#fff",border:"1px solid #e7e5e4",color:"#57534e",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:600,position:"relative"}}>{"💬"} Messages{getTotalUnread()>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#dc2626",color:"#fff",fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:8,minWidth:16,textAlign:"center"}}>{getTotalUnread()}</span>}</button>
<button onClick={()=>setShowChat(true)} style={{background:BRAND.main,border:"none",color:"#fff",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:600}}>{"\uD83E\uDD16 AI"}</button>
<button onClick={()=>setShowDM(true)} style={{background:"#fff",border:"1px solid #e7e5e4",color:"#57534e",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:600}}>Drivers</button>
<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",color:"#16a34a",padding:"7px 18px",borderRadius:10,fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{fmt(dc.total)}<span style={{fontSize:10,opacity:0.6,marginLeft:4}}>today</span></div>
<div style={{background:"#fff",border:"1px solid #e7e5e4",color:"#57534e",padding:"7px 18px",borderRadius:10,fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{fmt(wkT)}<span style={{fontSize:10,opacity:0.6,marginLeft:4}}>week</span></div>
</div>
</div>

{/* ── NON-MANIFEST DESKTOP VIEWS (full width, scrollable) ── */}
{(view==="routes"||view==="daily"||view==="weekly"||view==="history")&&(
<div style={{flex:1,overflowY:"auto",padding:"24px 40px",background:"#f8f7f5"}}>
{/* Routes */}
{view==="routes"&&(dl.length===0
?<div style={{textAlign:"center",padding:"80px 20px",color:"#a8a29e"}}><div style={{fontSize:48,marginBottom:12}}>🗺️</div><p style={{fontSize:16,fontWeight:600,margin:"0 0 8px"}}>No stops to route</p><p style={{fontSize:13,margin:0}}>Add deliveries via + Add, then build routes here.</p></div>
:<RouteBuilder entries={dl} drivers={drivers} onAssign={(eid,did)=>reassign(eid,did)} onReorder={(drvId,orderedIds)=>reorderDriver(drvId,orderedIds)} onBack={()=>setView("manifest")}/>
)}

{/* Daily */}
{view==="daily"&&<div style={{maxWidth:900,margin:"0 auto"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<h2 style={{margin:0,fontSize:18,fontWeight:700}}>{wd[sd].name} — {wd[sd].date}</h2>
<div style={{display:"flex",alignItems:"center",gap:10}}>
{dl.length>0&&<button onClick={printDailyLog} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#57534e"}}>Print</button>}
<span style={{fontSize:18,fontWeight:700,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(dc.total)}</span>
</div>
</div>
{/* Dispatcher notes */}
{!editingNote?<div onClick={()=>{setEditingNote(true);setNoteText(dispNotes[dk]||"");}} style={{background:dispNotes[dk]?"#faf5ff":"#fafaf9",border:dispNotes[dk]?"2px solid #d8b4fe":"1px dashed #d6d3d1",borderRadius:12,padding:"12px 16px",marginBottom:16,cursor:"pointer",display:"flex",alignItems:"flex-start",gap:10}}>
<span style={{fontSize:16}}>📝</span>
{dispNotes[dk]?<div><div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",marginBottom:2}}>Dispatcher Notes</div><div style={{fontSize:13,color:"#1c1917",whiteSpace:"pre-wrap",lineHeight:1.4}}>{dispNotes[dk]}</div></div>
:<div style={{fontSize:12,color:"#a8a29e",paddingTop:2}}>Click to add dispatcher notes for this day</div>}
</div>
:<div style={{background:"#fff",border:"2px solid #7c3aed",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
<div style={{fontSize:11,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",marginBottom:6}}>Dispatcher Notes</div>
<textarea value={noteText} onChange={e=>setNoteText(e.target.value)} autoFocus placeholder="Route changes, special instructions, notes for the day…" rows={3} style={{width:"100%",border:"1px solid #d8b4fe",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit",background:"#faf5ff"}}/>
<div style={{display:"flex",gap:6,marginTop:6,justifyContent:"flex-end"}}>
{dispNotes[dk]&&<button onClick={()=>{setDispNotes(p=>{const n={...p};delete n[dk];return n;});setEditingNote(false);setNoteText("");}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear</button>}
<button onClick={()=>setEditingNote(false)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Cancel</button>
<button onClick={()=>{setDispNotes(p=>({...p,[dk]:noteText.trim()}));setEditingNote(false);showToast("Notes saved");}} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:600}}>Save</button>
</div>
</div>}
{/* Emser hours */}
{dl.some(e=>e.isHourly)&&(()=>{
const {byDriver,totalMins}=getShiftSummary(dk);
const hasEatontonBonus=!!emH[`${dk}-eatonton-bonus`];
const hoursUsed=totalMins>0?Math.round(totalMins/15)*15/60:(emH[`${dk}-emser`]||4);
/* Find which driver has DCO Eatonton */
const eatontonEntry=dl.find(e=>e.stop==="DCO Eatonton"&&e.customer==="Emser Tile");
const eatontonDrv=eatontonEntry?drivers.find(d=>d.id===eatontonEntry.driverId):null;
const eatontonInitials=eatontonDrv?eatontonDrv.name.split(" ").map(n=>n[0]).join(""):"";
const eatontonDi=eatontonDrv?drivers.findIndex(d=>d.id===eatontonDrv.id):-1;
return(<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<span style={{fontSize:14,color:"#2563eb",fontWeight:600}}>Emser Hours</span>
<span style={{fontSize:18,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{fmt(102.50*hoursUsed)}</span>
</div>
{/* Per-driver breakdown from shift tracker */}
{totalMins>0&&<div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
{Object.entries(byDriver).map(([did,mins])=>{const drv=drivers.find(d=>d.id===Number(did));const di=drivers.findIndex(d=>d.id===Number(did));if(!drv)return null;const initials=drv.name.split(" ").map(n=>n[0]).join("");return(<div key={did} style={{display:"flex",alignItems:"center",gap:5,background:"#fff",border:`1px solid ${DCOL[di]||"#2563eb"}`,borderRadius:8,padding:"4px 10px"}}>
<div style={{width:20,height:20,borderRadius:5,background:DCOL[di]||"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700}}>{initials}</div>
<span style={{fontSize:12,fontWeight:700}}>{formatMins(mins)}</span>
</div>);})}
<div style={{display:"flex",alignItems:"center",gap:5,background:"#dbeafe",border:"1px solid #2563eb",borderRadius:8,padding:"4px 10px",marginLeft:"auto"}}>
<span style={{fontSize:12,fontWeight:700,color:"#1e40af"}}>⏱ {formatMins(totalMins)} total</span>
</div>
</div>}
{/* Eatonton bonus hour badge */}
{hasEatontonBonus&&<div style={{display:"flex",alignItems:"center",gap:6,background:"#fef3c7",border:"1px solid #fde68a",borderRadius:8,padding:"5px 10px",marginBottom:8}}>
{eatontonDi>=0&&<div style={{width:20,height:20,borderRadius:5,background:DCOL[eatontonDi],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700}}>{eatontonInitials}</div>}
<span style={{fontSize:11,fontWeight:700,color:"#92400e"}}>+1h Eatonton Bonus</span>
<span style={{fontSize:10,color:"#78716c",marginLeft:"auto"}}>Long-distance run</span>
</div>}
{!totalMins&&<div style={{fontSize:11,color:"#64748b",marginBottom:8}}>💡 Log shifts in History → ⏱ Emser Hrs for auto-calculation</div>}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:12,color:"#64748b"}}>{hoursUsed}h × $102.50</span>
<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
{[4,5,6,7,8,9,10].map(h=><button key={h} onClick={()=>setEmH(p=>({...p,[`${dk}-emser`]:h}))} style={{width:32,height:30,borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:hoursUsed===h&&!totalMins?"#2563eb":"#e7e5e4",color:hoursUsed===h&&!totalMins?"#fff":"#78716c"}}>{h}</button>)}
<button onClick={()=>setShowCustomHrs(!showCustomHrs)} style={{height:30,borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,padding:"0 10px",background:showCustomHrs?"#2563eb":"#dbeafe",color:showCustomHrs?"#fff":"#2563eb"}}>Other</button>
</div></div>
{showCustomHrs&&<div style={{display:"flex",gap:6,alignItems:"center",marginTop:8}}><input value={customHrsInput} onChange={e=>setCustomHrsInput(e.target.value)} placeholder="e.g. 4.5" type="number" step="0.25" min="1" style={{width:80,border:"1px solid #bfdbfe",borderRadius:8,padding:"6px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/><span style={{fontSize:12,color:"#64748b"}}>hrs</span><button onClick={()=>{const v=parseFloat(customHrsInput);if(v>0){setEmH(p=>({...p,[`${dk}-emser`]:v}));setShowCustomHrs(false);setCustomHrsInput("");}}} style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Set</button></div>}
</div>);})()}
{/* Entry list */}
{dl.length===0?<div style={{textAlign:"center",padding:"60px 20px",color:"#a8a29e"}}><div style={{fontSize:40,marginBottom:12}}>🚚</div><p style={{fontSize:14,margin:0}}>No deliveries logged for this day</p></div>
:<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
{dl.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di=drivers.findIndex(d=>d.id===entry.driverId);const done=entry.status==="departed";const onSite=entry.status==="arrived";const isImetco=entry.customer==="IMETCO";return(
<div key={entry.id} style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:12,padding:"12px 16px",borderLeft:`4px solid ${entry.priority?"#f59e0b":entry.stopType==="pickup"?"#2563eb":c.accent}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div style={{flex:1}}>
<div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3,flexWrap:"wrap"}}>
<span style={{fontSize:11,fontWeight:600,color:c.accent,textTransform:"uppercase"}}>{entry.customer}</span>
{entry.stopType==="pickup"&&<span style={{fontSize:9,background:"#2563eb",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PICKUP</span>}
{entry.priority&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PRIORITY</span>}
{done&&<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>DONE</span>}
{onSite&&!done&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>ON SITE</span>}
{entry.dueBy&&<span style={{fontSize:9,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>⏰ {entry.dueBy}</span>}
{drv&&<span style={{fontSize:9,background:DCOL[di]||"#78716c",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:600}}>{drv.name.split(" ")[0]}</span>}
</div>
<div style={{fontSize:14,fontWeight:600}}>{entry.stop}</div>
{entry.addr&&<div style={{fontSize:11,color:"#78716c",marginTop:1}}>{entry.addr}</div>}
{entry.instructions&&<div style={{fontSize:11,color:"#2563eb",marginTop:3,background:"#eff6ff",padding:"4px 8px",borderRadius:6}}>📋 {entry.instructions}</div>}
{entry.shipPlan&&<div style={{fontSize:11,color:"#ea580c",fontWeight:700,marginTop:2}}>SP# {entry.shipPlan}</div>}
</div>
<div style={{textAlign:"right",marginLeft:10,flexShrink:0}}>
<div style={{fontSize:15,fontWeight:700,fontVariantNumeric:"tabular-nums"}}><InlineRate value={entry.baseRate} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/></div>
<button onClick={()=>rmFromDriver(entry.id)} style={{background:"none",border:"none",color:"#dc2626",fontSize:10,cursor:"pointer",padding:"4px 0 0",opacity:0.7}}>Remove</button>
</div>
</div>
{isImetco&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:11,fontWeight:700,color:"#ea580c",flexShrink:0}}>Ship Plan #:</span>
<input value={entry.shipPlan||""} onChange={e=>setShipPlan(entry.id,e.target.value)} placeholder="Enter #" style={{flex:1,border:entry.shipPlan?"1px solid #bbf7d0":"1px solid #fca5a5",borderRadius:8,padding:"5px 10px",fontSize:13,fontWeight:700,outline:"none",background:entry.shipPlan?"#f0fdf4":"#fff7ed",textAlign:"center"}}/>
</div>}
</div>);})}
</div>}
{Object.keys(dc.fBC).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"14px 16px",marginTop:12}}><div style={{fontSize:12,fontWeight:700,color:"#d97706",textTransform:"uppercase",marginBottom:8}}>Fuel Surcharges</div>{Object.entries(dc.fBC).map(([cu,cf])=><div key={cu} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:13}}>{cu} <span style={{fontSize:11,color:"#a8a29e"}}>{fmt(cf.base)} × {Math.round(cf.pct*100)}%</span></span><span style={{fontSize:14,fontWeight:700,color:"#d97706",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base*cf.pct)}</span></div>)}</div>}
<div style={{display:"flex",justifyContent:"space-between",padding:"16px 4px 0",borderTop:"2px solid #bbf7d0",marginTop:16}}><span style={{fontSize:15,fontWeight:700,color:"#57534e"}}>Day Total</span><span style={{fontSize:22,fontWeight:700,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(dc.total)}</span></div>
</div>}

{/* Weekly */}
{view==="weekly"&&<div style={{maxWidth:860,margin:"0 auto"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
<h2 style={{margin:0,fontSize:18,fontWeight:700}}>Weekly Summary</h2>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<button onClick={printWeekly} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#57534e"}}>Print</button>
<span style={{fontSize:20,fontWeight:700,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(wkT)}</span>
</div>
</div>
{/* WoW comparison card + bar chart */}
<div style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:20,marginBottom:20}}>
<div style={{fontSize:12,fontWeight:700,color:"#57534e",textTransform:"uppercase",marginBottom:14}}>Week-over-Week</div>
<div style={{display:"flex",gap:14,marginBottom:14}}>
<div style={{flex:1,background:"#f5f5f4",borderRadius:10,padding:"12px 16px",textAlign:"center"}}>
<div style={{fontSize:11,color:"#a8a29e",marginBottom:4}}>Last Week</div>
<div style={{fontSize:20,fontWeight:700,fontVariantNumeric:"tabular-nums",color:prevWkT>0?"#57534e":"#a8a29e"}}>{prevWkT>0?fmt(prevWkT):"—"}</div>
</div>
<div style={{flex:1,background:"#f0fdf4",borderRadius:10,padding:"12px 16px",textAlign:"center",border:"1px solid #bbf7d0"}}>
<div style={{fontSize:11,color:"#16a34a",marginBottom:4}}>This Week</div>
<div style={{fontSize:20,fontWeight:700,fontVariantNumeric:"tabular-nums",color:"#16a34a"}}>{fmt(wkT)}</div>
</div>
{prevWkT>0&&<div style={{flex:1,background:wowDelta>=0?"#f0fdf4":"#fef2f2",borderRadius:10,padding:"12px 16px",textAlign:"center",border:`1px solid ${wowDelta>=0?"#bbf7d0":"#fca5a5"}`}}>
<div style={{fontSize:11,color:wowDelta>=0?"#16a34a":"#dc2626",marginBottom:4}}>Change</div>
<div style={{fontSize:20,fontWeight:700,fontVariantNumeric:"tabular-nums",color:wowDelta>=0?"#16a34a":"#dc2626"}}>{wowDelta>=0?"+":""}{fmt(wowDelta)}</div>
<div style={{fontSize:12,color:wowDelta>=0?"#16a34a":"#dc2626"}}>{wowPct>=0?"+":""}{wowPct.toFixed(1)}%</div>
</div>}
</div>
{/* Bar chart */}
<div style={{display:"flex",gap:6,alignItems:"flex-end",height:80,marginTop:8}}>
{DAYS.map((day,i)=>{const cur=wkD[i].calc.total;const prev=prevWkD[i].calc.total;const maxVal=Math.max(...DAYS.map((_,j)=>Math.max(wkD[j].calc.total,prevWkD[j].calc.total)),1);const curH=Math.max((cur/maxVal)*68,cur>0?4:0);const prevH=Math.max((prev/maxVal)*68,prev>0?4:0);return(<div key={day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
<div style={{display:"flex",alignItems:"flex-end",gap:2,height:68}}>
<div style={{width:12,height:prevH,background:"#d6d3d1",borderRadius:"3px 3px 0 0"}} title={`Last wk: ${fmt(prev)}`}/>
<div style={{width:12,height:curH,background:cur>=prev?"#16a34a":"#f59e0b",borderRadius:"3px 3px 0 0"}} title={`This wk: ${fmt(cur)}`}/>
</div>
<div style={{fontSize:10,color:"#a8a29e",fontWeight:600}}>{day.slice(0,2)}</div>
{cur>0&&<div style={{fontSize:9,color:"#57534e",fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{fmt(cur)}</div>}
</div>);})}
</div>
<div style={{display:"flex",justifyContent:"center",gap:14,marginTop:8}}>
<div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:2,background:"#d6d3d1"}}/><span style={{fontSize:10,color:"#a8a29e"}}>Last week</span></div>
<div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:2,background:"#16a34a"}}/><span style={{fontSize:10,color:"#a8a29e"}}>This week</span></div>
</div>
</div>
{/* Week fuel */}
{Object.keys(wkF).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:"14px 16px",marginBottom:16}}><div style={{fontSize:12,fontWeight:700,color:"#d97706",textTransform:"uppercase",marginBottom:8}}>Week Fuel Surcharges</div>{Object.entries(wkF).map(([cu,cf])=><div key={cu} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:13}}>{cu} <span style={{fontSize:11,color:"#a8a29e"}}>{fmt(cf.base)} × {Math.round(cf.pct*100)}%</span></span><span style={{fontSize:14,fontWeight:700,color:"#d97706",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base*cf.pct)}</span></div>)}</div>}
{/* Day-by-day breakdown */}
{DAYS.map((day,i)=>{const{entries,calc}=wkD[i];const dayKey=`${wo}-${i}`;const{byDriver:shiftByDrv,totalMins:shiftMins}=getShiftSummary(dayKey);if(!entries.length&&!shiftMins)return null;return(<div key={day} style={{marginBottom:14}}>
<div style={{display:"flex",justifyContent:"space-between",padding:"8px 4px",borderBottom:"1px solid #e7e5e4",marginBottom:6}}><span style={{fontSize:14,fontWeight:700}}>{day} — {wd[i].date}</span><span style={{fontVariantNumeric:"tabular-nums",fontWeight:700,color:"#16a34a",fontSize:14}}>{fmt(calc.total)}</span></div>
{shiftMins>0&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px 5px 14px",borderLeft:"3px solid #2563eb",marginBottom:3,background:"#eff6ff",borderRadius:"0 8px 8px 0",flexWrap:"wrap"}}>
<span style={{fontSize:11,color:"#2563eb",fontWeight:700,flexShrink:0}}>⏱ Emser</span>
{drivers.map((drv,di)=>{const mins=shiftByDrv[drv.id]||0;if(!mins)return null;const initials=drv.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();return(<span key={drv.id} style={{fontSize:11,background:DCOL[di],color:"#fff",padding:"1px 6px",borderRadius:4,fontWeight:600}}>{initials} {formatMins(mins)}</span>);})}
<span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:"#1d4ed8",fontVariantNumeric:"tabular-nums"}}>{formatMins(shiftMins)} total</span>
</div>}
{entries.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di2=drivers.findIndex(d=>d.id===entry.driverId);return(<div key={entry.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px 5px 14px",borderLeft:`3px solid ${c.accent}`,marginBottom:3,background:"#fff",borderRadius:"0 8px 8px 0"}}>
<div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:0}}>
<span style={{fontSize:11,color:c.accent,fontWeight:600,flexShrink:0}}>{entry.customer}</span>
<span style={{fontSize:12,color:"#57534e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.stop}</span>
{entry.shipPlan&&<span style={{fontSize:10,color:"#ea580c",fontWeight:700,flexShrink:0}}>SP#{entry.shipPlan}</span>}
{drv&&<span style={{fontSize:9,background:DCOL[di2]||"#78716c",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:600,flexShrink:0}}>{drv.name.split(" ")[0]}</span>}
</div>
<InlineRate value={entry.baseRate} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/>
</div>);})}
</div>);})}
{wkD.every(d=>!d.entries.length)&&<div style={{textAlign:"center",padding:"60px 20px",color:"#a8a29e"}}><p>No deliveries this week</p></div>}
{(()=>{const wkShiftByDrv={};let wkShiftTotal=0;DAYS.forEach((_,i)=>{const{byDriver,totalMins}=getShiftSummary(`${wo}-${i}`);wkShiftTotal+=totalMins;Object.entries(byDriver).forEach(([did,mins])=>{wkShiftByDrv[did]=(wkShiftByDrv[did]||0)+mins;});});if(!wkShiftTotal)return null;const wkShiftHrs=Math.round(wkShiftTotal/15)*15/60;return(<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:14,padding:"16px 18px",marginBottom:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<span style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>⏱ Week Emser Hours</span>
<span style={{fontSize:18,fontWeight:700,fontVariantNumeric:"tabular-nums",color:"#1d4ed8"}}>{fmt(102.50*wkShiftHrs)}</span>
</div>
<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:6}}>
{drivers.map((drv,di)=>{const mins=wkShiftByDrv[drv.id]||0;if(!mins)return null;const initials=drv.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();const hrs=Math.round(mins/15)*15/60;return(<div key={drv.id} style={{display:"flex",alignItems:"center",gap:6,background:"#fff",border:`1px solid ${DCOL[di]}`,borderRadius:8,padding:"5px 12px"}}>
<div style={{width:22,height:22,borderRadius:6,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700}}>{initials}</div>
<div><div style={{fontSize:13,fontWeight:700}}>{formatMins(mins)}</div><div style={{fontSize:10,color:"#64748b"}}>{fmt(102.50*hrs)}</div></div>
</div>);})}
</div>
<div style={{fontSize:12,color:"#64748b"}}>{formatMins(wkShiftTotal)} total · $102.50/hr</div>
</div>);})()} 
{Object.keys(wkF).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:"14px 16px",marginBottom:16}}><div style={{fontSize:12,fontWeight:700,color:"#d97706",textTransform:"uppercase",marginBottom:8}}>Week Fuel Surcharges</div>{Object.entries(wkF).map(([cu,cf])=><div key={cu} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:13}}>{cu} <span style={{fontSize:11,color:"#a8a29e"}}>{fmt(cf.base)} × {Math.round(cf.pct*100)}%</span></span><span style={{fontSize:14,fontWeight:700,color:"#d97706",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base*cf.pct)}</span></div>)}</div>}
</div>}
{view==="history"&&<div style={{maxWidth:1000,margin:"0 auto"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<h2 style={{margin:0,fontSize:18,fontWeight:700}}>Delivery History</h2>
</div>
{/* Mode toggle */}
<div style={{display:"flex",gap:3,marginBottom:16,background:"#f5f5f4",borderRadius:10,padding:3,width:"fit-content"}}>
{[{k:"deliveries",l:"Deliveries"},{k:"photos",l:"📷 Photos"},{k:"emser",l:"⏱ Emser Hrs"},{k:"quotes",l:"💰 Quotes"}].map(m=>(
<button key={m.k} onClick={()=>setHistMode(m.k)} style={{padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:histMode===m.k?"#fff":"transparent",color:histMode===m.k?BRAND.main:"#78716c",boxShadow:histMode===m.k?"0 1px 3px rgba(0,0,0,0.08)":"none"}}>{m.l}</button>
))}
</div>

{/* Emser Shift Tracker */}
{histMode==="emser"&&(()=>{
const shifts=getEmserDayShifts();
const totalMins=shifts.reduce((sum,s)=>sum+calcShiftMins(s),0);
const totalHrs=Math.round(totalMins/15)*15/60;
const perDriver={};shifts.forEach(s=>{if(!perDriver[s.driverId])perDriver[s.driverId]=0;perDriver[s.driverId]+=calcShiftMins(s);});
const TIME_PRESETS=["7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
return(<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<span style={{fontSize:15,fontWeight:700}}>{wd[sd].name} — {wd[sd].date}</span>
<div style={{textAlign:"right"}}>
<div style={{fontSize:22,fontWeight:800,color:BRAND.main,fontVariantNumeric:"tabular-nums"}}>{totalMins>0?formatMins(totalMins):(emH[`${dk}-emser`]||4)+"h"}</div>
<div style={{fontSize:12,color:"#78716c"}}>{totalMins>0?fmt(102.50*totalHrs):fmt(102.50*(emH[`${dk}-emser`]||4))}</div>
</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
{drivers.map((drv,di)=>{
const drvShifts=shifts.filter(s=>s.driverId===drv.id);
const drvMins=perDriver[drv.id]||0;
return(<div key={drv.id} style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:"14px 16px",borderLeft:`3px solid ${DCOL[di]}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:drvShifts.length?10:0}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<div style={{width:24,height:24,borderRadius:7,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",fontWeight:700}}>{drv.name.charAt(0)}</div>
<span style={{fontSize:14,fontWeight:700}}>{drv.name}</span>
{drvMins>0&&<span style={{fontSize:13,fontWeight:700,color:BRAND.main}}>{formatMins(drvMins)}</span>}
</div>
<button onClick={()=>addEmserShift(drv.id)} style={{background:BRAND.pale,border:"1px solid "+BRAND.light,borderRadius:6,padding:"4px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:BRAND.main}}>+ Shift</button>
</div>
{drvShifts.map((shift,si)=>{
const mins=calcShiftMins(shift);
const HOURS=["7","8","9","10","11","12","1","2","3","4","5"];
const AMPM=(h)=>parseInt(h)>=7&&parseInt(h)<=11?"AM":"PM";
const hourTo24=(h)=>{let n=parseInt(h);const ap=AMPM(h);if(ap==="PM"&&n!==12)n+=12;if(ap==="AM"&&n===12)n=0;return String(n).padStart(2,"0");};
const h24ToDisplay=(h24)=>{if(!h24)return"";const n=parseInt(h24);if(n===0)return"12";if(n>12)return String(n-12);return String(n);};
const startDispHour=shift.start?h24ToDisplay(shift.start.split(":")[0]):"";
const endDispHour=shift.end?h24ToDisplay(shift.end.split(":")[0]):"";
const setHour=(field,h)=>{const h24=hourTo24(h);const curVal=field==="start"?shift.start:shift.end;const curMin=curVal?curVal.split(":")[1]:"00";updateEmserShift(shift.id,field,h24+":"+curMin);};
const setMin=(field,v)=>{const curVal=field==="start"?shift.start:shift.end;if(!curVal)return;updateEmserShift(shift.id,field,curVal.split(":")[0]+":"+v);};
const MINS=[{l:":00",v:"00"},{l:":15",v:"15"},{l:":30",v:"30"},{l:":45",v:"45"}];
const btnBase={padding:"3px 0",borderRadius:4,border:"none",cursor:"pointer",fontSize:9,fontWeight:700,textAlign:"center"};
return(
<div key={shift.id} style={{background:"#fafaf9",border:"1px solid #e7e5e4",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<span style={{fontSize:11,fontWeight:600,color:"#57534e"}}>Shift {si+1}</span>
<div style={{display:"flex",alignItems:"center",gap:6}}>
{mins>0&&<span style={{fontSize:12,fontWeight:700,color:BRAND.main}}>{formatMins(mins)}</span>}
<button onClick={()=>removeEmserShift(shift.id)} style={{background:"#fef2f2",border:"none",borderRadius:5,padding:"2px 7px",cursor:"pointer",fontSize:10,color:"#dc2626"}}>✕</button>
</div>
</div>
<div style={{display:"flex",gap:12}}>
{/* Start column */}
<div style={{flex:1}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
<label style={{fontSize:10,fontWeight:700,color:BRAND.main,width:28,flexShrink:0}}>Start</label>
<input type="time" value={shift.start} onChange={e=>updateEmserShift(shift.id,"start",e.target.value)} style={{flex:1,border:"1px solid #bfdbfe",borderRadius:7,padding:"4px 8px",fontSize:13,fontWeight:700,outline:"none",background:shift.start?"#eff6ff":"#fafaf9"}}/>
</div>
<div style={{display:"flex",gap:2,paddingLeft:34}}>
{HOURS.map(h=>{const sel=startDispHour===h&&!!shift.start;return(<button key={h} onClick={()=>setHour("start",h)} style={{...btnBase,flex:1,background:sel?BRAND.main:"#e7e5e4",color:sel?"#fff":"#44403c"}}>{h}</button>);})}
</div>
<div style={{display:"flex",gap:2,paddingLeft:34,marginTop:2}}>
{MINS.map(({l,v})=>{const sel=shift.start&&shift.start.split(":")[1]===v;const dis=!shift.start;return(<button key={v} onClick={()=>setMin("start",v)} style={{...btnBase,flex:1,background:sel?BRAND.main:dis?"#f5f5f4":"#dbeafe",color:sel?"#fff":dis?"#ccc":"#1d4ed8",opacity:dis?0.4:1,cursor:dis?"default":"pointer"}}>{l}</button>);})}
</div>
</div>
{/* End column */}
<div style={{flex:1}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
<label style={{fontSize:10,fontWeight:700,color:"#16a34a",width:28,flexShrink:0}}>End</label>
<input type="time" value={shift.end} onChange={e=>updateEmserShift(shift.id,"end",e.target.value)} style={{flex:1,border:"1px solid #bbf7d0",borderRadius:7,padding:"4px 8px",fontSize:13,fontWeight:700,outline:"none",background:shift.end?"#f0fdf4":"#fafaf9"}}/>
</div>
<div style={{display:"flex",gap:2,paddingLeft:34}}>
{HOURS.map(h=>{const sel=endDispHour===h&&!!shift.end;return(<button key={h} onClick={()=>setHour("end",h)} style={{...btnBase,flex:1,background:sel?"#16a34a":"#e7e5e4",color:sel?"#fff":"#44403c"}}>{h}</button>);})}
</div>
<div style={{display:"flex",gap:2,paddingLeft:34,marginTop:2}}>
{MINS.map(({l,v})=>{const sel=shift.end&&shift.end.split(":")[1]===v;const dis=!shift.end;return(<button key={v} onClick={()=>setMin("end",v)} style={{...btnBase,flex:1,background:sel?"#16a34a":dis?"#f5f5f4":"#dcfce7",color:sel?"#fff":dis?"#ccc":"#15803d",opacity:dis?0.4:1,cursor:dis?"default":"pointer"}}>{l}</button>);})}
</div>
</div>
</div>
</div>);})}
</div>);})}
</div>
{totalMins>0&&<div style={{marginTop:16,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:14,fontWeight:700,color:"#16a34a"}}>Total shift time</span>
<div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:800,color:"#16a34a"}}>{formatMins(totalMins)}</div><div style={{fontSize:12,color:"#16a34a"}}>{fmt(102.50*totalHrs)}</div></div>
</div>}
</div>);}
)()}

{/* Photo gallery */}
{histMode==="photos"&&(()=>{
const photosAll=[];
histFiltered.forEach(e=>{if(e.photos&&e.photos.length>0){e.photos.forEach((p,pi)=>photosAll.push({src:p,stop:e.stop,customer:e.customer,dayName:e.dayName,dayDate:e.dayDate,signature:e.signature,id:e.id+"-"+pi}));}});
return(<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
<span style={{fontSize:13,color:"#78716c"}}>{photosAll.length} photo{photosAll.length!==1?"s":""}</span>
{(histSearch||histCustFilter||histDrvFilter)&&<button onClick={()=>{setHistSearch("");setHistCustFilter("");setHistDrvFilter("");}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear filters</button>}
</div>
{/* Filters */}
<div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
<input value={histSearch} onChange={e=>setHistSearch(e.target.value)} placeholder="Search stops…" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 12px",fontSize:13,outline:"none",minWidth:200}}/>
<select value={histCustFilter} onChange={e=>setHistCustFilter(e.target.value)} style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,outline:"none",background:"#fff"}}>
<option value="">All customers</option>{Object.keys(CUSTOMERS).map(c=><option key={c} value={c}>{c}</option>)}
</select>
<select value={histWeekRange} onChange={e=>setHistWeekRange(Number(e.target.value))} style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,outline:"none",background:"#fff"}}>
<option value={2}>2 weeks</option><option value={4}>4 weeks</option><option value={8}>8 weeks</option><option value={12}>12 weeks</option>
</select>
</div>
{photosAll.length===0?<div style={{textAlign:"center",padding:"60px 20px",color:"#a8a29e"}}><div style={{fontSize:40,marginBottom:12}}>📷</div><p style={{fontSize:14,fontWeight:600,margin:"0 0 4px"}}>No photos found</p></div>
:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
{photosAll.map(photo=>{const c=CC[photo.customer]||CC["One-Off Delivery"];return(
<div key={photo.id} onClick={()=>setLightboxPhoto(photo)} style={{cursor:"pointer",borderRadius:10,overflow:"hidden",border:"1px solid #e7e5e4",background:"#fff"}}>
<div style={{position:"relative",paddingTop:"100%",background:"#f5f5f4"}}>
<img src={photo.src} alt={photo.stop} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/>
{photo.signature&&<div style={{position:"absolute",bottom:4,right:4,background:"#16a34a",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4}}>✓ POD</div>}
</div>
<div style={{padding:"8px 10px"}}>
<div style={{fontSize:11,fontWeight:600,color:"#1c1917",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{photo.stop}</div>
<div style={{fontSize:10,color:c.accent}}>{photo.customer}</div>
<div style={{fontSize:10,color:"#a8a29e"}}>{photo.dayName} {photo.dayDate}</div>
</div>
</div>);})}
</div>}
</div>);
})()}

{/* Quotes */}
{histMode==="quotes"&&(()=>{
const allCustNames=[...Object.keys(CUSTOMERS),...QUOTE_CUSTOMERS.map(q=>q.name),"One-Off Delivery"];
const getDeliveries=(custName)=>{const cd=CUSTOMERS[custName];if(!cd)return[];return cd.deliveries.map(d=>typeof d==="string"?{s:d,r:0}:d);};
return(<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<div><span style={{fontSize:15,fontWeight:700}}>Saved Quotes</span><span style={{fontSize:12,color:"#a8a29e",marginLeft:8}}>{savedQuotes.length} total</span></div>
<button onClick={()=>setQuoteFormOpen(!quoteFormOpen)} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",cursor:"pointer",fontSize:13,fontWeight:700}}>{quoteFormOpen?"Cancel":"+ New Quote"}</button>
</div>
{quoteFormOpen&&<div style={{background:"#fff",border:"2px solid #16a34a",borderRadius:16,padding:"18px 20px",marginBottom:20}}>
<div style={{fontSize:14,fontWeight:700,color:"#16a34a",marginBottom:14}}>New Quote</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
<div>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Customer</label>
<select value={qCust} onChange={e=>{setQCust(e.target.value);setQStop("");}} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff"}}>
<option value="">Select customer...</option>{allCustNames.map(c=><option key={c} value={c}>{c}</option>)}<option value="__manual">Manual Entry</option>
</select>
</div>
<div>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Delivery To</label>
{qCust&&qCust!=="__manual"&&getDeliveries(qCust).length>0?
<select value={qStop} onChange={e=>setQStop(e.target.value)} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff"}}>
<option value="">Select stop...</option>{getDeliveries(qCust).map(d=><option key={d.s} value={d.s}>{d.s}{d.r?" — $"+d.r:""}</option>)}<option value="__custom">Custom location...</option>
</select>
:<input value={qStop} onChange={e=>setQStop(e.target.value)} placeholder="Delivery location" style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none"}}/>}
</div>
</div>
<div style={{marginBottom:12}}>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Address</label>
<AddressInput value={qAddr} onChange={setQAddr} placeholder="Delivery address" style={{fontSize:13}}/>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
<div>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Distance (miles)</label>
<input type="number" value={qMiles} onChange={e=>setQMiles(e.target.value)} placeholder="e.g. 25" style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}/>
{qMiles&&<div style={{fontSize:11,color:"#16a34a",fontWeight:700,marginTop:4}}>Auto: {fmt(calcQuoteRate(qMiles,qLiftgate,qGravel,qExtraPallets).total)}</div>}
</div>
<div>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Rate Override</label>
<input type="number" value={qRate} onChange={e=>setQRate(e.target.value)} placeholder={qMiles?"Auto-calculated":"Manual rate"} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}/>
</div>
</div>
<div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
<label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,fontWeight:600,color:qLiftgate?"#d97706":"#78716c",background:qLiftgate?"#fef3c7":"#f5f5f4",padding:"6px 12px",borderRadius:8,border:qLiftgate?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qLiftgate} onChange={e=>setQLiftgate(e.target.checked)} style={{accentColor:"#d97706"}}/> Liftgate +$75</label>
<label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,fontWeight:600,color:qGravel?"#d97706":"#78716c",background:qGravel?"#fef3c7":"#f5f5f4",padding:"6px 12px",borderRadius:8,border:qGravel?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qGravel} onChange={e=>setQGravel(e.target.checked)} style={{accentColor:"#d97706"}}/> Gravel +$25</label>
<label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,fontWeight:600,color:qExtraPallets?"#d97706":"#78716c",background:qExtraPallets?"#fef3c7":"#f5f5f4",padding:"6px 12px",borderRadius:8,border:qExtraPallets?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qExtraPallets} onChange={e=>setQExtraPallets(e.target.checked)} style={{accentColor:"#d97706"}}/> 4-5 Pallets +$25</label>
</div>
<div style={{marginBottom:12}}>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Notes</label>
<textarea value={qNote} onChange={e=>setQNote(e.target.value)} placeholder="Additional details..." rows={2} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
</div>
<div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
<button onClick={()=>setQuoteFormOpen(false)} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:12,fontWeight:600}}>Cancel</button>
<button onClick={saveQuote} disabled={!qStop.trim()} style={{background:qStop.trim()?"#16a34a":"#a8a29e",color:"#fff",border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:12,fontWeight:700}}>Save Quote</button>
</div>
</div>}
{savedQuotes.length===0&&!quoteFormOpen&&<div style={{textAlign:"center",padding:"60px 20px",color:"#a8a29e"}}><div style={{fontSize:40,marginBottom:12}}>💰</div><p style={{fontSize:14,fontWeight:600,margin:"0 0 4px"}}>No quotes yet</p><p style={{fontSize:12,margin:0}}>Create your first quote above</p></div>}
{savedQuotes.map((q,qi)=>{const c=CC[q.customer]||CC["Quote Delivery"]||CC["One-Off Delivery"];const accepted=q.status==="accepted";return(
<div key={q.id} style={{background:accepted?"#f0fdf4":"#fff",border:`1px solid ${accepted?"#bbf7d0":"#e7e5e4"}`,borderRadius:14,padding:"14px 18px",marginBottom:8,borderLeft:`4px solid ${accepted?"#16a34a":c.accent}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div style={{flex:1}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
<span style={{fontSize:12,fontWeight:800,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>#{q.num}</span>
<span style={{fontSize:11,fontWeight:600,color:c.accent}}>{q.customer}</span>
{accepted&&<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"1px 6px",borderRadius:3,fontWeight:700}}>ACCEPTED</span>}
{!accepted&&<span style={{fontSize:9,background:"#fef3c7",color:"#92400e",padding:"1px 6px",borderRadius:3,fontWeight:700}}>PENDING</span>}
{q.miles&&<span style={{fontSize:10,color:"#78716c"}}>{q.miles}mi</span>}
{q.liftgate&&<span style={{fontSize:9,background:"#fef3c7",color:"#92400e",padding:"1px 4px",borderRadius:3}}>LG</span>}
{q.gravel&&<span style={{fontSize:9,background:"#fef3c7",color:"#92400e",padding:"1px 4px",borderRadius:3}}>GRV</span>}
{q.extraPallets&&<span style={{fontSize:9,background:"#fef3c7",color:"#92400e",padding:"1px 4px",borderRadius:3}}>4-5P</span>}
</div>
<div style={{fontSize:15,fontWeight:700}}>{q.stop}</div>
{q.addr&&<div style={{fontSize:11,color:"#78716c",marginTop:1}}>{q.addr}</div>}
{q.note&&<div style={{fontSize:11,color:"#57534e",marginTop:2}}>{q.note}</div>}
<div style={{fontSize:10,color:"#a8a29e",marginTop:4}}>{new Date(q.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})} at {new Date(q.createdAt).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}</div>
</div>
<div style={{textAlign:"right",marginLeft:14,flexShrink:0}}>
<div style={{fontSize:20,fontWeight:800,color:accepted?"#16a34a":"#1c1917",fontVariantNumeric:"tabular-nums"}}>{fmt(q.rate)}</div>
{q.calc&&<div style={{fontSize:10,color:"#78716c"}}>{fmt(q.calc.base)}+{fmt(q.calc.fuel)} fuel</div>}
{!accepted&&<div style={{display:"flex",flexDirection:"column",gap:4,marginTop:8}}>
{qPushDay&&qPushDay.quoteId===q.id?<div style={{display:"flex",flexDirection:"column",gap:4}}>
<select onChange={e=>{if(e.target.value)pushQuoteToDay(q.id,e.target.value);}} defaultValue="" style={{border:"1px solid #16a34a",borderRadius:6,padding:"4px 6px",fontSize:10,outline:"none",background:"#f0fdf4"}}>
<option value="">Pick day...</option>{DAYS.map((day,i)=><option key={i} value={`${wo}-${i}`}>{day} {wd[i].date}</option>)}<option value={`${wo+1}-0`}>Next Mon</option>
</select>
<button onClick={()=>setQPushDay(null)} style={{background:"none",border:"none",fontSize:9,color:"#78716c",cursor:"pointer"}}>Cancel</button>
</div>
:<button onClick={()=>setQPushDay({quoteId:q.id})} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:10,fontWeight:700}}>Push to Day</button>}
<button onClick={()=>{setSavedQuotes(p=>p.filter(x=>x.id!==q.id));deleteQuoteFromFB(q.id).catch(e=>console.error("Quote del:",e));showToast("Quote deleted");}} style={{background:"none",border:"none",color:"#dc2626",fontSize:9,cursor:"pointer",padding:"2px 0"}}>Delete</button>
</div>}
{accepted&&q.pushedTo&&<div style={{fontSize:10,color:"#16a34a",fontWeight:600,marginTop:4}}>→ {DAYS[parseInt(q.pushedTo.split("-")[1])]||""}</div>}
</div>
</div>
</div>);})}
</div>);
})()}

{/* Deliveries list */}
{histMode==="deliveries"&&<div>
<div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
<input value={histSearch} onChange={e=>setHistSearch(e.target.value)} placeholder="Search stops, customers, addresses…" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 12px",fontSize:13,outline:"none",flex:1,minWidth:200}}/>
<select value={histCustFilter} onChange={e=>setHistCustFilter(e.target.value)} style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,outline:"none",background:"#fff"}}>
<option value="">All customers</option>{Object.keys(CUSTOMERS).map(c=><option key={c} value={c}>{c}</option>)}
</select>
<select value={histDrvFilter} onChange={e=>setHistDrvFilter(e.target.value)} style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,outline:"none",background:"#fff"}}>
<option value="">All drivers</option>{drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
</select>
<select value={histWeekRange} onChange={e=>setHistWeekRange(Number(e.target.value))} style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,outline:"none",background:"#fff"}}>
<option value={2}>2 wks</option><option value={4}>4 wks</option><option value={8}>8 wks</option><option value={12}>12 wks</option>
</select>
{(histSearch||histCustFilter||histDrvFilter)&&<button onClick={()=>{setHistSearch("");setHistCustFilter("");setHistDrvFilter("");}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"7px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear</button>}
<span style={{fontSize:12,color:"#78716c"}}>{histFiltered.length} deliveries</span>
</div>
{histFiltered.length===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"#a8a29e"}}><div style={{fontSize:40,marginBottom:12}}>🔍</div><p style={{fontSize:14,margin:0}}>{histAll.length===0?"No delivery data yet":"No matches"}</p></div>}
{histFiltered.length>0&&(()=>{const grouped={};histFiltered.forEach(e=>{const gk=`${e.weekOff}-${e.dayIdx}`;if(!grouped[gk])grouped[gk]={dayName:e.dayName,dayDate:e.dayDate,weekOff:e.weekOff,dayIdx:e.dayIdx,entries:[]};grouped[gk].entries.push(e);});return Object.values(grouped).sort((a,b)=>a.weekOff!==b.weekOff?b.weekOff-a.weekOff:b.dayIdx-a.dayIdx).map((grp,gi)=>{const dayTotal=grp.entries.reduce((s,e)=>s+e.baseRate,0);const isCur=grp.weekOff===wo;return(<div key={gi} style={{marginBottom:14}}>
<div style={{display:"flex",justifyContent:"space-between",padding:"6px 4px",borderBottom:"1px solid #e7e5e4",marginBottom:6}}>
<span style={{fontSize:13,fontWeight:700,color:isCur?"#1c1917":"#78716c"}}>{grp.dayName} — {grp.dayDate}{!isCur&&<span style={{fontSize:10,color:"#a8a29e",fontWeight:500,marginLeft:4}}>{grp.weekOff===wo-1?"last wk":(wo-grp.weekOff)+"w ago"}</span>}</span>
<span style={{fontSize:12,fontWeight:600,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(dayTotal)}</span>
</div>
{grp.entries.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di=drivers.findIndex(d=>d.id===entry.driverId);const hasPhotos=entry.photos&&entry.photos.length>0;return(
<div key={entry.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 10px 7px 16px",borderLeft:`3px solid ${entry.stopType==="pickup"?"#2563eb":c.accent}`,marginBottom:4,background:"#fff",borderRadius:"0 8px 8px 0"}}>
<div style={{flex:1,minWidth:0}}>
<div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
{entry.stopType==="pickup"&&<span style={{fontSize:8,background:"#2563eb",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:700}}>PU</span>}
<span style={{fontSize:11,color:c.accent,fontWeight:600}}>{entry.customer}</span>
<span style={{fontSize:12,color:"#57534e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.stop}</span>
{hasPhotos&&<span style={{fontSize:9,background:"#dbeafe",color:"#2563eb",padding:"1px 4px",borderRadius:3,fontWeight:600}}>📷 {entry.photos.length}</span>}
{entry.signature&&<span style={{fontSize:9,background:"#dcfce7",color:"#16a34a",padding:"1px 4px",borderRadius:3,fontWeight:600}}>✓ POD</span>}
</div>
{entry.addr&&<div style={{fontSize:10,color:"#a8a29e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.addr}</div>}
{hasPhotos&&<div style={{display:"flex",gap:4,marginTop:4}}>{entry.photos.slice(0,5).map((p,pi)=><img key={pi} src={p} alt="" onClick={()=>setLightboxPhoto({src:p,stop:entry.stop,customer:entry.customer,dayName:entry.dayName,dayDate:entry.dayDate,signature:entry.signature})} style={{width:40,height:40,objectFit:"cover",borderRadius:6,border:"1px solid #e7e5e4",cursor:"pointer"}}/>)}{entry.photos.length>5&&<div style={{width:40,height:40,borderRadius:6,background:"#f5f5f4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#78716c"}}>+{entry.photos.length-5}</div>}</div>}
</div>
<div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:8}}>
{drv&&<span style={{fontSize:9,background:DCOL[di]||"#78716c",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:600}}>{drv.name.split(" ")[0]}</span>}
<InlineRate value={entry.baseRate} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/>
</div>
</div>);})}
</div>);});})()}
</div>}
{/* Lightbox */}
{lightboxPhoto&&<div onClick={()=>setLightboxPhoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
<button onClick={()=>setLightboxPhoto(null)} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:16,color:"#fff"}}>✕</button>
<img src={lightboxPhoto.src} alt={lightboxPhoto.stop} style={{maxWidth:"100%",maxHeight:"70vh",borderRadius:12,objectFit:"contain"}} onClick={e=>e.stopPropagation()}/>
<div style={{marginTop:12,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
<div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{lightboxPhoto.stop}</div>
<div style={{fontSize:13,color:"#a8a29e",marginTop:2}}>{lightboxPhoto.customer}</div>
{lightboxPhoto.signature&&<div style={{marginTop:8,background:"#16a34a",color:"#fff",display:"inline-block",padding:"4px 14px",borderRadius:6,fontSize:12,fontWeight:600}}>✓ Received by: {lightboxPhoto.signature}</div>}
</div>
</div>}
</div>}

{/* Add — handled by shared mobile layout (desktop falls through) */}
</div>
)}

{/* \u2500\u2500 MAIN 3-COLUMN \u2500\u2500 */}
{(view==="manifest")&&<div style={{flex:1,display:"grid",gridTemplateColumns:"minmax(240px,1fr) minmax(300px,2fr) minmax(240px,1fr)",gap:0,overflow:"hidden"}}>

{/* LEFT \u2500 Kanban Manifests */}
<div style={{background:"#fff",borderRight:"1px solid #e7e5e4",overflowY:"auto",padding:"16px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
<h2 style={{margin:0,fontSize:15,fontWeight:700}}>Manifests</h2>
<button onClick={()=>{setView("add");setSelCust(null);setQuoteMode(null);}} style={{background:"#16a34a",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:600,color:"#fff"}}>+ Add</button>
</div>

{!editingNote?<div onClick={()=>{setEditingNote(true);setNoteText(dispNotes[dk]||"");}} style={{background:dispNotes[dk]?"#faf5ff":"#fafaf9",border:dispNotes[dk]?"1px solid #d8b4fe":"1px dashed #d6d3d1",borderRadius:10,padding:"8px 12px",marginBottom:12,cursor:"pointer",minHeight:32,display:"flex",alignItems:"flex-start",gap:8}}>
<span style={{fontSize:13,flexShrink:0}}>{"📝"}</span>
{dispNotes[dk]?<div style={{flex:1}}><div style={{fontSize:9,fontWeight:700,color:"#7c3aed",textTransform:"uppercase"}}>Notes</div><div style={{fontSize:12,color:"#57534e",whiteSpace:"pre-wrap",marginTop:2}}>{dispNotes[dk]}</div></div>
:<div style={{fontSize:11,color:"#a8a29e",paddingTop:2}}>Click to add dispatcher notes</div>}
</div>
:<div style={{background:"#fff",border:"2px solid #7c3aed",borderRadius:10,padding:"10px 12px",marginBottom:12}}>
<div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",marginBottom:4}}>Dispatcher Notes</div>
<textarea value={noteText} onChange={e=>setNoteText(e.target.value)} autoFocus placeholder="Route changes, special instructions…" rows={2}
style={{width:"100%",border:"1px solid #d8b4fe",borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none",resize:"vertical",fontFamily:"inherit",background:"#faf5ff"}}/>
<div style={{display:"flex",gap:6,marginTop:6,justifyContent:"flex-end"}}>
{dispNotes[dk]&&<button onClick={()=>{setDispNotes(p=>{const n={...p};delete n[dk];return n;});setEditingNote(false);setNoteText("");}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,color:"#dc2626",fontWeight:600}}>Clear</button>}
<button onClick={()=>setEditingNote(false)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600}}>Cancel</button>
<button onClick={()=>{setDispNotes(p=>({...p,[dk]:noteText.trim()}));setEditingNote(false);showToast("Notes saved");}} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:6,padding:"4px 12px",cursor:"pointer",fontSize:10,fontWeight:600}}>Save</button>
</div>
</div>}

{allDriverEntries.map(({drv,di,entries:de})=>(
<div key={drv.id} style={{marginBottom:12}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:"#f5f5f4",borderRadius:"10px 10px 0 0",borderLeft:`3px solid ${DCOL[di]}`}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<div style={{width:24,height:24,borderRadius:8,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",fontWeight:700}}>{drv.name.charAt(0)}</div>
<span style={{fontSize:13,fontWeight:700}}>{drv.name}</span>
<span style={{fontSize:11,color:"#a8a29e"}}>({de.length})</span>
</div>
<div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
{de.length>0&&<><button onClick={()=>printManifest(drv.id)} style={{background:"#e7e5e4",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#57534e",fontWeight:600}}>Print</button><button onClick={()=>copyManifest(drv.id)} style={{background:"#dcfce7",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#16a34a",fontWeight:600}}>Copy</button><button onClick={()=>textManifest(drv.id)} style={{background:"#dbeafe",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#2563eb",fontWeight:600}}>Text</button></>}
<button onClick={()=>setInsertPickupFor({driverId:drv.id,afterIdx:-1})} style={{background:"#eff6ff",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#2563eb",fontWeight:600}}>+PU</button>
<button onClick={()=>{setNotifyDriver(drv.id);setNotifyCustomMsg("");}} style={{background:"#fef3c7",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#92400e",fontWeight:600}}>Notify</button>
<button onClick={()=>setDriverViewId(drv.id)} style={{background:"#f3e8f9",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#7c3aed",fontWeight:600}}>View</button>
<button onClick={()=>{setPreAssignDriver(drv.id);setView("add");setSelCust(null);setQuoteMode(null);}} style={{background:"#dcfce7",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#16a34a",fontWeight:600}}>+</button>
</div>
</div>
<div style={{background:"#fafaf9",border:"1px solid #e7e5e4",borderTop:"none",borderRadius:"0 0 10px 10px",padding:de.length?"6px 6px 2px":"8px 10px",minHeight:40}}>
{de.length===0&&<div style={{fontSize:11,color:"#a8a29e",textAlign:"center",padding:4}}>No stops</div>}
{de.length>0&&(()=>{const loads=getDriverLoads(drv.id);return loads.map(loadN=>{const w=getLoadWeight(drv.id,loadN);const pct=weightPct(w);const col=weightColor(w);const over=w>TRUCK_LIMITS.default;return w>0||loads.length>1?(<div key={loadN} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 4px",marginBottom:2}}>
<span style={{fontSize:9,fontWeight:700,color:"#78716c",flexShrink:0}}>L{loadN}</span>
<div style={{flex:1,height:6,background:"#e7e5e4",borderRadius:3,overflow:"hidden"}}>
<div style={{height:"100%",width:pct+"%",background:col,borderRadius:3,transition:"width 0.3s"}}/>
</div>
<span style={{fontSize:9,fontWeight:700,color:col,fontVariantNumeric:"tabular-nums",flexShrink:0}}>{w.toLocaleString()}<span style={{fontSize:7,color:"#a8a29e"}}>/{(TRUCK_LIMITS.default/1000).toFixed(0)}k</span></span>
{over&&<span style={{fontSize:7,background:"#dc2626",color:"#fff",padding:"0px 3px",borderRadius:2,fontWeight:700}}>OVER</span>}
</div>):null;});})()}
{de.map((entry,eIdx)=>{const c=CC[entry.customer]||CC["One-Off Delivery"];const isPU=entry.stopType==="pickup";const done=entry.status==="departed";const onSite=entry.status==="arrived";const hasDue=!!entry.dueBy;const addr=entry.addr||getAddr(entry.stop);const isP=entry.priority;const hasInstr=entry.instructions?.trim();const isImetco=entry.customer==="IMETCO";
return(<div key={entry.id} style={{background:done?"#f0fdf4":onSite?"#fffbeb":hasDue?"#fef2f2":isP?"#fef3c7":isPU?"#eff6ff":"#fff",border:`1px solid ${done?"#bbf7d0":onSite?"#fde68a":hasDue?"#fca5a5":"#e7e5e4"}`,borderRadius:8,padding:"8px 10px",marginBottom:4,borderLeft:`3px solid ${isPU?"#2563eb":isP?"#f59e0b":c.accent}`,opacity:done?0.6:1}}>
<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2,flexWrap:"wrap"}}>
<span style={{fontSize:10,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>{eIdx+1}.</span>
{isPU&&<span style={{fontSize:8,background:"#2563eb",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>PU</span>}
{isP&&<span style={{fontSize:8,background:"#f59e0b",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>PRIORITY</span>}
{done&&<span style={{fontSize:8,background:"#16a34a",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>DONE</span>}
{onSite&&!done&&<span style={{fontSize:8,background:"#f59e0b",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>ON SITE</span>}
{hasDue&&<span style={{fontSize:8,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700,display:"inline-flex",alignItems:"center",gap:1}}>{"\u23F0"}{entry.dueBy}</span>}
{isImetco&&<span style={{fontSize:8,background:"#ea580c",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>SHIP PLAN REQ</span>}
<span style={{fontSize:11,fontWeight:600,color:"#1c1917",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.stop}</span>
</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{fontSize:10,color:c.accent,fontWeight:600}}>{entry.customer}</div>
<InlineRate value={entry.baseRate} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/>
</div>
{addr&&<div style={{fontSize:9,color:"#78716c",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{addr}</div>}
{entry.note&&<div style={{fontSize:9,color:"#a8a29e",marginTop:1}}>{entry.note}</div>}
{hasInstr&&<div style={{fontSize:9,color:"#2563eb",marginTop:2,background:"#eff6ff",padding:"3px 6px",borderRadius:4}}>📋 {entry.instructions}</div>}
{entry.shipPlan&&<div style={{fontSize:9,color:"#ea580c",fontWeight:700,marginTop:1}}>SP# {entry.shipPlan}</div>}
{entry.weight>0&&<div style={{fontSize:9,color:BRAND.main,fontWeight:700,marginTop:1}}>{entry.weight.toLocaleString()} lbs{(entry.loadNum||1)>1?" (Load "+(entry.loadNum||1)+")":""}</div>}
{entry.eta&&<div style={{fontSize:9,color:"#2563eb",marginTop:1}}>ETA: {entry.eta} min{entry.etaDest?" → "+entry.etaDest:""}</div>}
{entry.arrivedAt&&<div style={{fontSize:9,color:"#16a34a",marginTop:1}}>Arrived: {entry.arrivedAt}</div>}
{entry.departedAt&&<div style={{fontSize:9,color:"#16a34a"}}>Departed: {entry.departedAt}</div>}
{entry.signature&&<div style={{fontSize:9,color:"#16a34a",marginTop:1}}>✍ {entry.signature}</div>}
{entry.photos&&entry.photos.length>0&&<div style={{display:"flex",gap:3,marginTop:3}}>{entry.photos.map((p,pi)=><img key={pi} src={p} alt="" style={{width:24,height:24,objectFit:"cover",borderRadius:4,border:"1px solid #e7e5e4"}}/>)}</div>}
<div style={{display:"flex",gap:3,marginTop:4,flexWrap:"wrap"}}>
<select value={entry.driverId} onChange={e=>{e.stopPropagation();reassign(entry.id,Number(e.target.value));}} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:5,padding:"2px 4px",fontSize:9,color:"#57534e",cursor:"pointer",maxWidth:70}}><option value={0}>Assign</option>{drivers.map(dd=><option key={dd.id} value={dd.id}>{dd.name}</option>)}</select>
<button onClick={()=>moveInDriver(drv.id,eIdx,-1)} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:4,padding:"1px 5px",cursor:"pointer",fontSize:9,color:"#78716c"}} title="Move up">▲</button>
<button onClick={()=>moveInDriver(drv.id,eIdx,1)} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:4,padding:"1px 5px",cursor:"pointer",fontSize:9,color:"#78716c"}} title="Move down">▼</button>
<button onClick={()=>rmFromDriver(entry.id)} style={{background:"none",border:"none",color:"#dc2626",fontSize:9,cursor:"pointer",padding:"1px 4px"}}>✕</button>
</div>
</div>);})}
</div>
</div>
))}

{uaEntries.length>0&&<div style={{marginBottom:12}}>
<div style={{padding:"8px 12px",background:"#f5f5f4",borderRadius:"10px 10px 0 0",borderLeft:"3px solid #a8a29e"}}>
<span style={{fontSize:13,fontWeight:700,color:"#78716c"}}>Unassigned ({uaEntries.length})</span>
</div>
<div style={{background:"#fafaf9",border:"1px solid #e7e5e4",borderTop:"none",borderRadius:"0 0 10px 10px",padding:"6px 6px 2px"}}>
{uaEntries.map(entry=>{const c=CC[entry.customer]||CC["One-Off Delivery"];const addr=entry.addr||getAddr(entry.stop);const hasInstr=entry.instructions?.trim();return(
<div key={entry.id} style={{background:entry.priority?"#fef3c7":"#fff",border:`1px solid ${entry.priority?"#fde68a":"#e7e5e4"}`,borderRadius:8,padding:"8px 10px",marginBottom:4,borderLeft:`3px solid ${entry.stopType==="pickup"?"#2563eb":c.accent}`}}>
<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2,flexWrap:"wrap"}}>
{entry.stopType==="pickup"&&<span style={{fontSize:8,background:"#2563eb",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>PU</span>}
{entry.priority&&<span style={{fontSize:8,background:"#f59e0b",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>PRIORITY</span>}
{entry.dueBy&&<span style={{fontSize:8,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>{"\u23F0"}{entry.dueBy}</span>}
<span style={{fontSize:11,fontWeight:600}}>{entry.stop}</span>
</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{fontSize:10,color:c.accent}}>{entry.customer}</div>
<InlineRate value={entry.baseRate} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/>
</div>
{addr&&<div style={{fontSize:9,color:"#78716c",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{addr}</div>}
{entry.note&&<div style={{fontSize:9,color:"#a8a29e",marginTop:1}}>{entry.note}</div>}
{hasInstr&&<div style={{fontSize:9,color:"#2563eb",marginTop:2,background:"#eff6ff",padding:"3px 6px",borderRadius:4}}>📋 {entry.instructions}</div>}
{entry.weight>0&&<div style={{fontSize:9,color:BRAND.main,fontWeight:700,marginTop:1}}>{entry.weight.toLocaleString()} lbs</div>}
<select value={entry.driverId} onChange={e=>reassign(entry.id,Number(e.target.value))} style={{marginTop:4,background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:5,padding:"3px 6px",fontSize:10,color:"#57534e",cursor:"pointer"}}>
<option value={0}>Assign...</option>{drivers.map(dd=><option key={dd.id} value={dd.id}>{dd.name}</option>)}
</select>
</div>);})}
</div>
</div>}
</div>

{/* CENTER \u2500 Map + Revenue */}
<div style={{background:"#f8f7f5",overflowY:"auto",display:"flex",flexDirection:"column"}}>

<div style={{padding:"16px 20px 0"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<h2 style={{margin:0,fontSize:15,fontWeight:700}}>Live Routes</h2>
<div style={{display:"flex",gap:10}}>
{drivers.map((d,di)=><div key={d.id} style={{display:"flex",alignItems:"center",gap:4}}>
<div style={{width:8,height:8,borderRadius:4,background:DCOL[di]}}/>
<span style={{fontSize:10,color:"#78716c"}}>{d.name.split(" ")[0]}</span>
</div>)}
</div>
</div>
</div>
{(()=>{
const stopsWithCoords2=dl.map(e=>{const addr=e.addr||getAddr(e.stop);const coords=getCoords(addr);return coords?{...e,coords}:null;}).filter(Boolean);
return(
<div style={{margin:"0 20px"}}>
{/* Driver selector for click-to-assign */}
<div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
<span style={{fontSize:10,color:"#78716c",fontWeight:600,marginRight:2}}>Assign to:</span>
{drivers.map((d,di)=>(
<button key={d.id} onClick={()=>setMapActiveDrv(mapActiveDrv===d.id?null:d.id)}
style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,border:`2px solid ${mapActiveDrv===d.id?DCOL[di]:"#e7e5e4"}`,background:mapActiveDrv===d.id?DCOL[di]:"#fff",cursor:"pointer",transition:"all 0.15s"}}>
<div style={{width:10,height:10,borderRadius:3,background:mapActiveDrv===d.id?"#fff":DCOL[di]}}/>
<span style={{fontSize:11,fontWeight:700,color:mapActiveDrv===d.id?"#fff":"#57534e"}}>{d.name.split(" ")[0]}</span>
</button>
))}
{mapActiveDrv&&<button onClick={()=>setMapActiveDrv(null)} style={{fontSize:10,color:"#78716c",background:"none",border:"none",cursor:"pointer",padding:"4px 6px"}}>✕ Clear</button>}
{!mapActiveDrv&&<span style={{fontSize:10,color:"#a8a29e",fontStyle:"italic"}}>or click any stop to see details</span>}
</div>
<GoogleMapView stops={stopsWithCoords2} drivers={drivers} height={380} showSearch={true} searchLabel="Search address on map…"
activeDriver={mapActiveDrv}
onAssignStop={mapActiveDrv?(stopId,drvId)=>{reassign(stopId,drvId);showToast("Stop assigned");}:null}/>
</div>);
})()}

{/* Revenue Dashboard */}
<div style={{padding:"16px 20px"}}>
<h2 style={{margin:"0 0 12px",fontSize:15,fontWeight:700}}>Today's Revenue</h2>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
<div style={{background:"#fff",borderRadius:12,padding:"14px 16px",textAlign:"center",border:"1px solid #e7e5e4"}}>
<div style={{fontSize:10,color:"#a8a29e",textTransform:"uppercase",marginBottom:4}}>Deliveries</div>
<div style={{fontSize:24,fontWeight:800,fontVariantNumeric:"tabular-nums"}}>{dl.length}</div>
</div>
<div style={{background:"#f0fdf4",borderRadius:12,padding:"14px 16px",textAlign:"center",border:"1px solid #bbf7d0"}}>
<div style={{fontSize:10,color:"#16a34a",textTransform:"uppercase",marginBottom:4}}>Completed</div>
<div style={{fontSize:24,fontWeight:800,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{statusCounts.departed}</div>
</div>
<div style={{background:"#fffbeb",borderRadius:12,padding:"14px 16px",textAlign:"center",border:"1px solid #fde68a"}}>
<div style={{fontSize:10,color:"#d97706",textTransform:"uppercase",marginBottom:4}}>In Progress</div>
<div style={{fontSize:24,fontWeight:800,color:"#d97706",fontVariantNumeric:"tabular-nums"}}>{statusCounts.arrived}</div>
</div>
</div>

{custRevArr.length>0&&<div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #e7e5e4"}}>
<div style={{fontSize:11,fontWeight:700,color:"#a8a29e",textTransform:"uppercase",marginBottom:12}}>Revenue by Customer</div>
{custRevArr.map(([cust,rev])=>{const c=CC[cust]||CC["One-Off Delivery"];return(
<div key={cust} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
<div style={{width:100,fontSize:11,fontWeight:600,color:c.accent,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flexShrink:0}}>{cust}</div>
<div style={{flex:1,height:22,background:"#f5f5f4",borderRadius:6,overflow:"hidden"}}>
<div style={{height:"100%",width:(rev/maxCustRev*100)+"%",background:c.accent,borderRadius:6,opacity:0.8,transition:"width 0.5s"}}/>
</div>
<div style={{width:70,textAlign:"right",fontSize:12,fontWeight:700,fontVariantNumeric:"tabular-nums",flexShrink:0}}>{fmt(rev)}</div>
</div>);})}
</div>}

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
<div style={{background:"#f0fdf4",borderRadius:14,padding:"14px 16px",border:"1px solid #bbf7d0"}}>
<div style={{fontSize:10,color:"#16a34a",textTransform:"uppercase",marginBottom:6}}>This Week</div>
<div style={{fontSize:22,fontWeight:800,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(wkT)}</div>
</div>
<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",border:"1px solid #e7e5e4"}}>
<div style={{fontSize:10,color:"#78716c",textTransform:"uppercase",marginBottom:6}}>vs Last Week</div>
<div style={{fontSize:22,fontWeight:800,color:wowDelta>=0?"#16a34a":"#dc2626",fontVariantNumeric:"tabular-nums"}}>{wowDelta>=0?"+":""}{prevWkT>0?fmt(wowDelta):"\u2014"}</div>
{prevWkT>0&&<div style={{fontSize:11,color:wowDelta>=0?"#16a34a":"#dc2626",marginTop:2}}>{wowPct>=0?"+":""}{wowPct.toFixed(1)}%</div>}
</div>
</div>
</div>
</div>

{/* RIGHT \u2500 Daily Log */}
<div style={{background:"#fff",borderLeft:"1px solid #e7e5e4",overflowY:"auto",padding:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
<h2 style={{margin:0,fontSize:15,fontWeight:700}}>Daily Log</h2>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<button onClick={printDailyLog} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#78716c"}}>Print</button>
<span style={{fontVariantNumeric:"tabular-nums",fontSize:16,fontWeight:700,color:"#16a34a"}}>{fmt(dc.total)}</span>
</div>
</div>

{dl.some(e=>e.isHourly)&&(()=>{const {byDriver,totalMins}=getShiftSummary(dk);const hoursUsed=totalMins>0?Math.round(totalMins/15)*15/60:(emH[`${dk}-emser`]||4);return(<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:12}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<span style={{fontSize:12,color:"#2563eb",fontWeight:600}}>Emser Hours</span>
<span style={{fontSize:14,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{fmt(102.50*hoursUsed)}</span>
</div>
{totalMins>0&&<div style={{display:"flex",gap:4,marginBottom:6,flexWrap:"wrap"}}>
{Object.entries(byDriver).map(([did,mins])=>{const drv=drivers.find(d=>d.id===Number(did));const di=drivers.findIndex(d=>d.id===Number(did));if(!drv)return null;const hrs=Math.round(mins/15)*15/60;const initials=drv.name.split(" ").map(n=>n[0]).join("");return(<div key={did} style={{display:"flex",alignItems:"center",gap:4,background:"#fff",border:`1px solid ${DCOL[di]||"#2563eb"}`,borderRadius:6,padding:"3px 8px"}}>
<div style={{width:16,height:16,borderRadius:4,background:DCOL[di]||"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700}}>{initials}</div>
<span style={{fontSize:11,fontWeight:700,color:"#1c1917"}}>{formatMins(mins)}</span>
</div>);})}
<div style={{display:"flex",alignItems:"center",gap:4,background:"#dbeafe",border:"1px solid #2563eb",borderRadius:6,padding:"3px 8px",marginLeft:"auto"}}>
<span style={{fontSize:11,fontWeight:700,color:"#1e40af"}}>Total: {formatMins(totalMins)}</span>
</div>
</div>}
<div style={{display:"flex",gap:3}}>
{[4,5,6,7,8,9,10].map(h=><button key={h} onClick={()=>setEmH(p=>({...p,[`${dk}-emser`]:h}))} style={{width:28,height:26,borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:hoursUsed===h?"#2563eb":"#e7e5e4",color:hoursUsed===h?"#fff":"#78716c"}}>{h}</button>)}
</div>
</div>);})()}

{dl.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:"#a8a29e"}}><div style={{fontSize:28,marginBottom:8}}>{"\uD83D\uDE9A"}</div><div style={{fontSize:13}}>No deliveries yet</div></div>
:dl.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di=drivers.findIndex(d=>d.id===entry.driverId);const done=entry.status==="departed";const onSite=entry.status==="arrived";const addr=entry.addr||getAddr(entry.stop);const hasInstr=entry.instructions?.trim();return(
<div key={entry.id} style={{background:done?"#f0fdf4":onSite?"#fffbeb":"#fafaf9",borderRadius:10,padding:"10px 14px",marginBottom:6,borderLeft:`3px solid ${entry.priority?"#f59e0b":entry.stopType==="pickup"?"#2563eb":c.accent}`,border:`1px solid ${done?"#bbf7d0":onSite?"#fde68a":"#e7e5e4"}`,opacity:done?0.7:1}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div style={{flex:1,minWidth:0}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
<span style={{fontSize:10,fontWeight:600,color:c.accent,textTransform:"uppercase"}}>{entry.customer}</span>
{entry.stopType==="pickup"&&<span style={{fontSize:8,background:"#2563eb",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>PU</span>}
{entry.priority&&<span style={{fontSize:8,background:"#f59e0b",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>PRIORITY</span>}
{done&&<span style={{fontSize:8,background:"#16a34a",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>DONE</span>}
{onSite&&!done&&<span style={{fontSize:8,background:"#f59e0b",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>ON SITE</span>}
{entry.dueBy&&<span style={{fontSize:8,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700,display:"inline-flex",alignItems:"center",gap:1}}>{"\u23F0"}{entry.dueBy}</span>}
{drv&&<span style={{fontSize:9,background:DCOL[di]||"#78716c",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:600}}>{drv.name.split(" ")[0]}</span>}
</div>
<div style={{fontSize:13,fontWeight:600}}>{entry.stop}</div>
{addr&&<div style={{fontSize:10,color:"#a8a29e",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{addr}</div>}
{entry.note&&<div style={{fontSize:10,color:"#a8a29e",marginTop:1}}>{entry.note}</div>}
{hasInstr&&<div style={{fontSize:10,color:"#2563eb",marginTop:2,background:"#eff6ff",padding:"3px 6px",borderRadius:4}}>📋 {entry.instructions}</div>}
{entry.shipPlan&&<div style={{fontSize:10,color:"#ea580c",fontWeight:700,marginTop:1}}>SP# {entry.shipPlan}</div>}
{entry.weight>0&&<div style={{fontSize:10,color:BRAND.main,fontWeight:700,marginTop:1}}>{entry.weight.toLocaleString()} lbs{(entry.loadNum||1)>1?" (Load "+(entry.loadNum||1)+")":""}</div>}
{entry.eta&&<div style={{fontSize:10,color:"#2563eb",marginTop:1}}>ETA: {entry.eta} min{entry.etaDest?" → "+entry.etaDest:""}</div>}
{entry.arrivedAt&&<div style={{fontSize:9,color:"#16a34a",marginTop:1}}>Arrived: {entry.arrivedAt}</div>}
{entry.departedAt&&<div style={{fontSize:9,color:"#16a34a"}}>Departed: {entry.departedAt}</div>}
{entry.signature&&<div style={{fontSize:9,color:"#16a34a",marginTop:1}}>✍ {entry.signature}</div>}
{entry.photos&&entry.photos.length>0&&<div style={{display:"flex",gap:3,marginTop:3}}>{entry.photos.map((p,pi)=><img key={pi} src={p} alt="" style={{width:24,height:24,objectFit:"cover",borderRadius:4,border:"1px solid #e7e5e4"}}/>)}</div>}
</div>
<InlineRate value={entry.baseRate} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/>
</div>
</div>);})}

{Object.keys(dc.fBC).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"10px 14px",marginTop:8}}>
<div style={{fontSize:10,fontWeight:700,color:"#d97706",textTransform:"uppercase",marginBottom:6}}>Fuel Surcharges</div>
{Object.entries(dc.fBC).map(([cu,cf])=><div key={cu} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}>
<span style={{fontSize:12,color:"#92400e"}}>{cu} <span style={{fontSize:10,color:"#a8a29e"}}>{Math.round(cf.pct*100)}%</span></span>
<span style={{fontSize:12,fontWeight:700,color:"#d97706",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base*cf.pct)}</span>
</div>)}
</div>}

<div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 0",borderTop:"2px solid #e7e5e4",marginTop:12}}>
<span style={{fontSize:14,fontWeight:700,color:"#78716c"}}>Day Total</span>
<span style={{fontSize:18,fontWeight:800,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(dc.total)}</span>
</div>
</div>
</div>
}

{showDM&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>{setShowDM(false);setEditDrv(null);}}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:420}} onClick={e=>e.stopPropagation()}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{margin:0,fontSize:18,fontWeight:700}}>Manage Drivers</h3><button onClick={()=>{setShowDM(false);setEditDrv(null);}} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#78716c"}}>{"\u2715"}</button></div>
{drivers.map((d,i)=><div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f5f5f4"}}>
<div style={{width:12,height:12,borderRadius:4,background:DCOL[i]||"#78716c",flexShrink:0}}/>
{editDrv===d.id?<div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
<input value={editNm} onChange={e=>setEditNm(e.target.value)} autoFocus placeholder="Name" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:14,outline:"none"}}/>
<div style={{display:"flex",gap:6}}><input value={editPh} onChange={e=>setEditPh(e.target.value)} placeholder="Phone (optional)" onKeyDown={e=>e.key==="Enter"&&saveDrv(d.id)} style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:13,outline:"none"}}/><button onClick={()=>saveDrv(d.id)} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>Save</button></div>
</div>:<>
<div style={{flex:1}}><div style={{fontSize:15,fontWeight:600}}>{d.name}</div>{d.phone&&<div style={{fontSize:11,color:"#78716c"}}>{d.phone}</div>}</div>
<button onClick={()=>{const slug=getDriverSlug(d.name);const url=`${window.location.origin}${window.location.pathname}#/driver/${slug}`;setShowLinkModal({name:d.name,url,phone:d.phone||""});}} style={{background:"#f0fdf4",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#16a34a"}}>🔗 Link</button>
<button onClick={()=>setDriverViewId(d.id)} style={{background:"#eff6ff",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#2563eb"}}>View</button>
<button onClick={()=>{setEditDrv(d.id);setEditNm(d.name);setEditPh(d.phone||"");}} style={{background:"#f5f5f4",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12}}>Edit</button>
{drivers.length>1&&<button onClick={()=>rmDrv(d.id)} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12,color:"#dc2626"}}>✕</button>}
</>}
</div>)}
<div style={{marginTop:12,padding:"10px 14px",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10}}>
<div style={{fontSize:11,fontWeight:700,color:"#16a34a",marginBottom:6}}>Add Driver</div>
<div style={{display:"flex",gap:6,alignItems:"center"}}>
<input value={newDN} onChange={e=>setNewDN(e.target.value)} placeholder="Name" style={{flex:2,border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:13,outline:"none"}}/>
<input value={newDP} onChange={e=>setNewDP(e.target.value)} placeholder="Phone (opt)" style={{flex:2,border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:13,outline:"none"}}/>
<button onClick={addDrvr} disabled={!newDN.trim()||drivers.length>=4} style={{background:newDN.trim()&&drivers.length<4?"#16a34a":"#d6d3d1",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:newDN.trim()&&drivers.length<4?"pointer":"default",fontSize:12,fontWeight:600,flexShrink:0}}>Add</button>
</div>
{drivers.length>=4&&<p style={{fontSize:10,color:"#a8a29e",margin:"6px 0 0"}}>Max 4 drivers reached</p>}
</div>
</div>
</div>}

{/* Driver Link Modal */}
{showLinkModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowLinkModal(null)}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<h3 style={{margin:0,fontSize:17,fontWeight:700}}>🔗 {showLinkModal.name}'s Link</h3>
<button onClick={()=>setShowLinkModal(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#78716c",lineHeight:1}}>✕</button>
</div>
<p style={{fontSize:12,color:"#78716c",margin:"0 0 10px"}}>Send this link to {showLinkModal.name.split(" ")[0]} — they'll see only their stops, no pricing.</p>
{/* URL display box */}
<div style={{background:"#f5f5f4",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
<span style={{flex:1,fontSize:12,color:"#1c1917",wordBreak:"break-all",fontFamily:"monospace"}}>{showLinkModal.url}</span>
</div>
{/* Action buttons */}
<div style={{display:"flex",flexDirection:"column",gap:8}}>
<button onClick={()=>{navigator.clipboard.writeText(showLinkModal.url).then(()=>{showToast(`Link copied for ${showLinkModal.name}`);setShowLinkModal(null);}).catch(()=>{const ta=document.createElement("textarea");ta.value=showLinkModal.url;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);showToast("Link copied");setShowLinkModal(null);});}}
style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",background:BRAND.main,color:"#fff",border:"none",borderRadius:12,padding:"13px 16px",cursor:"pointer",fontSize:14,fontWeight:700}}>
📋 Copy Link
</button>
{showLinkModal.phone&&<button onClick={()=>{window.open(`sms:${showLinkModal.phone}?&body=${encodeURIComponent(`Here's your Davis Delivery driver link:\n${showLinkModal.url}`)}`,`_blank`);setShowLinkModal(null);}}
style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",background:"#16a34a",color:"#fff",border:"none",borderRadius:12,padding:"13px 16px",cursor:"pointer",fontSize:14,fontWeight:700}}>
💬 Text to {showLinkModal.name.split(" ")[0]}
</button>}
{!showLinkModal.phone&&<p style={{fontSize:11,color:"#a8a29e",textAlign:"center",margin:0}}>No phone number saved — add one in Drivers to enable texting.</p>}
</div>
</div>
</div>}

{/* AI Chat - Desktop */}
{showChat&&<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowChat(false)}>
<div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:520,maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 64px rgba(0,0,0,0.2)"}}>
<div style={{padding:"16px 20px 12px",borderBottom:"1px solid #e7e5e4",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<div style={{width:36,height:36,borderRadius:12,background:"linear-gradient(135deg, #d97706, #ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{"🤖"}</div>
<div><div style={{fontSize:15,fontWeight:700}}>Dispatch AI</div><div style={{fontSize:10,color:"#78716c"}}>Knows your routes, rates & customers</div></div>
</div>
<button onClick={()=>setShowChat(false)} style={{background:"#f5f5f4",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:14,color:"#78716c"}}>{"✕"}</button>
</div>
<div style={{flex:1,overflowY:"auto",padding:"16px 16px 8px",display:"flex",flexDirection:"column",gap:10,minHeight:200}}>
{chatMessages.length===0&&<div style={{textAlign:"center",padding:"32px 16px",color:"#a8a29e"}}>
<div style={{fontSize:32,marginBottom:8}}>{"🤖"}</div>
<p style={{fontSize:14,fontWeight:600,margin:"0 0 8px",color:"#57534e"}}>What can I help with?</p>
<div style={{display:"flex",flexDirection:"column",gap:6}}>
{["Optimize Trevor's route","Summarize today's revenue","Quote 25 miles to Woodstock","What's Specialty's rate to DCO Tech?"].map((s,i)=>
<button key={i} onClick={()=>setChatInput(s)} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:10,padding:"10px 14px",cursor:"pointer",fontSize:12,fontWeight:500,color:"#57534e",textAlign:"left"}}>{s}</button>
)}
</div>
</div>}
{chatMessages.map((msg,i)=>(
<div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start"}}>
<div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:msg.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:msg.role==="user"?BRAND.main:"#f5f5f4",color:msg.role==="user"?"#fff":"#1c1917",fontSize:13,lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
{msg.content}
</div>
</div>
))}
{chatLoading&&<div style={{display:"flex",justifyContent:"flex-start"}}>
<div style={{padding:"10px 14px",borderRadius:"14px 14px 14px 4px",background:"#f5f5f4",fontSize:13,color:"#a8a29e"}}>
<span style={{animation:"pulse 1s infinite"}}>Thinking...</span>
</div>
</div>}
</div>
<div style={{padding:"8px 16px 16px",borderTop:"1px solid #e7e5e4",display:"flex",gap:8,flexShrink:0}}>
<input value={chatInput} onChange={e=>setChatInput(e.target.value)}
onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
placeholder="Ask about routes, quotes, revenue..."
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:12,padding:"12px 16px",fontSize:14,outline:"none",background:"#fafaf9",fontFamily:"inherit"}}/>
<button onClick={sendChat} disabled={!chatInput.trim()||chatLoading}
style={{background:chatInput.trim()&&!chatLoading?BRAND.main:"#e7e5e4",color:chatInput.trim()&&!chatLoading?"#fff":"#a8a29e",border:"none",borderRadius:12,padding:"12px 16px",cursor:chatInput.trim()&&!chatLoading?"pointer":"default",fontSize:14,fontWeight:700,flexShrink:0}}>
{chatLoading?"...":"\u2191"}
</button>
</div>
</div>
</div>}

{/* Notify Driver Modal - Desktop */}
{notifyDriver&&(()=>{
const drv=drivers.find(d=>d.id===notifyDriver);
const di=drivers.findIndex(d=>d.id===notifyDriver);
const de=drvEntries(notifyDriver);
return(
<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setNotifyDriver(null)}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:420}} onClick={e=>e.stopPropagation()}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<div style={{width:28,height:28,borderRadius:8,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:700}}>{drv?.name?.charAt(0)}</div>
<h3 style={{margin:0,fontSize:16,fontWeight:700}}>{"Notify "+drv?.name}</h3>
</div>
<button onClick={()=>setNotifyDriver(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#78716c"}}>{"\u2715"}</button>
</div>
<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
<button onClick={()=>sendNotification(notifyDriver,"🔄 RETURN TO YARD\nHead back to base when current stop is complete.","return")} style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"2px solid #dc2626",background:"#fef2f2",cursor:"pointer"}}>
<span style={{fontSize:20}}>{"🔄"}</span><div><div style={{fontSize:13,fontWeight:700,color:"#dc2626"}}>Return to Yard</div></div></button>
<button onClick={()=>sendNotification(notifyDriver,"📞 CALL DISPATCH\nCall dispatch ASAP.","call")} style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"1px solid #e7e5e4",background:"#fafaf9",cursor:"pointer"}}>
<span style={{fontSize:20}}>{"📞"}</span><div><div style={{fontSize:13,fontWeight:700}}>Call Dispatch</div></div></button>
<button onClick={()=>sendNotification(notifyDriver,"⚠️ MANIFEST UPDATED\nYour route has been changed. Check your manifest.\nCurrent stops: "+de.length,"update")} style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"1px solid #e7e5e4",background:"#fafaf9",cursor:"pointer"}}>
<span style={{fontSize:20}}>{"⚠️"}</span><div><div style={{fontSize:13,fontWeight:700}}>Manifest Updated</div></div></button>
</div>
<div style={{display:"flex",gap:6}}>
<textarea value={notifyCustomMsg} onChange={e=>setNotifyCustomMsg(e.target.value)} placeholder="Custom message..." rows={2} style={{flex:1,border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
<button onClick={()=>{if(notifyCustomMsg.trim())sendNotification(notifyDriver,notifyCustomMsg.trim(),"custom");}} disabled={!notifyCustomMsg.trim()} style={{alignSelf:"flex-end",background:notifyCustomMsg.trim()?BRAND.main:"#e7e5e4",color:notifyCustomMsg.trim()?"#fff":"#a8a29e",border:"none",borderRadius:10,padding:"10px 16px",cursor:notifyCustomMsg.trim()?"pointer":"default",fontSize:13,fontWeight:600}}>Send</button>
</div>
</div>
</div>);
})()}

<style>{`@keyframes slideDown{from{transform:translate(-50%,-20px);opacity:0}to{transform:translate(-50%,0);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}button:active{transform:scale(0.98)}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#f5f5f4}::-webkit-scrollbar-thumb{background:#d6d3d1;border-radius:3px}::-webkit-scrollbar-thumb:hover{background:#a8a29e}`}</style>
</div>
);
}
/* ═══════════════ END DESKTOP ═══════════════ */

return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#f5f5f4",color:"#1c1917",minHeight:"100vh",maxWidth:isDesktop?900:480,margin:"0 auto"}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
{toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#16a34a",color:"#fff",padding:"10px 24px",borderRadius:12,fontWeight:600,fontSize:14,zIndex:999,boxShadow:"0 8px 32px rgba(22,163,74,0.3)",animation:"slideDown 0.3s ease"}}>{"✓ "+toast}</div>}

{/* Desktop: back to dashboard bar */}
{isDesktop&&<div style={{background:"#fff",borderBottom:"1px solid #e7e5e4",padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<button onClick={()=>setView("manifest")} style={{background:BRAND.main,border:"none",color:"#fff",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:600}}>{"← Dashboard"}</button>
<div style={{display:"flex",gap:6}}>
{[{k:"daily",l:"Daily"},{k:"weekly",l:"Weekly"},{k:"history",l:"History"},{k:"add",l:"+ Add"}].map(v=><button key={v.k} onClick={()=>{setView(v.k);setSelCust(null);setQuoteMode(null);}} style={{background:view===v.k?BRAND.main:"#f5f5f4",border:view===v.k?"none":"1px solid #e7e5e4",color:view===v.k?"#fff":"#57534e",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>{v.l}</button>)}
</div>
</div>}

{/* HEADER */}
<div style={{background:BRAND.dark,color:"#fff",padding:"16px 20px 12px"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
<img src={LOGO_WHITE} alt="Davis Delivery" style={{height:28,objectFit:"contain"}}/>
<div style={{display:"flex",gap:8,alignItems:"center"}}>
<button onClick={()=>{setShowMsgPanel(true);setMsgChannel(null);markMsgsRead(null);}} style={{background:"#292524",border:"1px solid #44403c",color:"#d6d3d1",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:12,fontWeight:600,position:"relative"}}>{"💬"}{getTotalUnread()>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#dc2626",color:"#fff",fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:8,minWidth:14,textAlign:"center"}}>{getTotalUnread()}</span>}</button>
<button onClick={()=>setShowChat(true)} style={{background:"#d97706",border:"none",color:"#fff",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:12,fontWeight:600}}>AI</button>
<button onClick={()=>setShowDM(true)} style={{background:"#292524",border:"1px solid #44403c",color:"#d6d3d1",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:12,fontWeight:600}}>Drivers</button>
<div style={{background:BRAND.main,color:"#fff",padding:"6px 14px",borderRadius:8,fontSize:13,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{fmt(wkT)}<span style={{fontSize:10,opacity:0.7,marginLeft:3}}>wk</span></div>
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
{wd.map((d,i)=>{const cnt=(log[`${wo}-${i}`]||[]).length;return(<button key={i} onClick={()=>{setSd(i);setView("manifest");}} style={{flex:1,border:"none",borderRadius:10,padding:"8px 2px 6px",cursor:"pointer",background:sd===i?"#fff":BRAND.dark+"dd",color:sd===i?BRAND.main:"#93c5fd"}}><div style={{fontSize:10,fontWeight:600}}>{d.name.slice(0,3).toUpperCase()}</div><div style={{fontSize:11,fontVariantNumeric:"tabular-nums",marginTop:2}}>{d.date}</div>{cnt>0&&<div style={{width:6,height:6,borderRadius:3,background:sd===i?"#1c1917":"#16a34a",margin:"4px auto 0"}}/>}</button>);})}
</div>
</div>

{/* TABS */}
<div style={{display:"flex",gap:5,padding:"12px 16px",background:"#e7e5e4",borderBottom:"1px solid #d6d3d1"}}>
{[{k:"manifest",l:"Manifests"},{k:"routes",l:"Routes"},{k:"daily",l:"Daily"},{k:"weekly",l:"Weekly"},{k:"history",l:"History"},{k:"add",l:"+ Add"}].map(v=>
<button key={v.k} onClick={()=>{setView(v.k);setSelCust(null);setSelStop(null);setQuoteMode(null);setInsertPickupFor(null);setMultiSelect(false);setMultiChecked([]);setShowCustPickup(false);if(v.k!=="add")setPreAssignDriver(null);}}
style={{flex:1,border:v.k==="add"?"2px solid #16a34a":v.k==="routes"?"2px solid #d97706":v.k==="history"?"2px solid #7c3aed":"1px solid #d6d3d1",borderRadius:10,padding:"9px 2px",cursor:"pointer",fontSize:11,fontWeight:600,background:view===v.k?(v.k==="add"?"#16a34a":v.k==="routes"?"#d97706":v.k==="history"?"#7c3aed":BRAND.main):"#fff",color:view===v.k?"#fff":v.k==="add"?"#16a34a":v.k==="routes"?"#d97706":v.k==="history"?"#7c3aed":"#57534e"}}>{v.l}</button>
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
<button onClick={()=>{const slug=getDriverSlug(d.name);const url=`${window.location.origin}${window.location.pathname}#/driver/${slug}`;setShowLinkModal({name:d.name,url,phone:d.phone||""});}} style={{background:"#f0fdf4",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#16a34a"}}>🔗 Link</button>
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
const remaining=[...allStops].filter(s=>!SHARED_STOPS.includes(s)&&!s.startsWith("Transfer")&&s!=="Drop Ship Liftgate").sort();
return(
<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20,paddingTop:40,overflowY:"auto"}}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:400}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><h3 style={{margin:0,fontSize:18,fontWeight:700}}>Insert Pickup</h3><button onClick={()=>setInsertPickupFor(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#78716c"}}>✕</button></div>
<p style={{fontSize:12,color:"#78716c",margin:"0 0 10px"}}>Tap a customer to auto-fill, or use manual entry.</p>
<div style={{maxHeight:180,overflowY:"auto",marginBottom:12,border:"1px solid #e7e5e4",borderRadius:12,padding:4}}>
{PICKUP_SOURCES.map((src,i)=><button key={i} onClick={()=>handleSelect(src)} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 12px",marginBottom:2,borderRadius:8,cursor:"pointer",background:pickupStop===src.label?"#eff6ff":"#fafaf9",border:pickupStop===src.label?"2px solid #2563eb":"1px solid transparent"}}><div style={{fontSize:13,fontWeight:600}}>{src.label}</div><div style={{fontSize:10,color:"#a8a29e"}}>{src.addr}</div></button>)}
</div>
<details style={{marginBottom:12}}><summary style={{fontSize:13,fontWeight:600,color:"#2563eb",cursor:"pointer",padding:"4px 0"}}>Manual Entry</summary><div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}><input value={pickupCustomer} onChange={e=>setPickupCustomer(e.target.value)} placeholder="Customer" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/><input value={pickupStop} onChange={e=>setPickupStop(e.target.value)} placeholder="Location" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/><AddressInput value={pickupAddr} onChange={v=>setPickupAddr(v)} placeholder="Address"/></div></details>
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
/* Search ALL driver sections, not just the source driver */
const els=document.querySelectorAll("[data-drv]");
els.forEach(el=>{
const rect=el.getBoundingClientRect();
if(touch.clientY>=rect.top&&touch.clientY<=rect.bottom){
const drvId=parseInt(el.getAttribute("data-drv"));
const idx=parseInt(el.getAttribute("data-idx"));
if(!isNaN(idx)&&!isNaN(drvId))setDragOver({drvId,idx});
}
});
}}
onTouchEnd={()=>{
if(dragSrc&&dragOver){
handleDrop(dragOver.drvId,dragOver.idx);
}else{setDragSrc(null);setDragOver(null);}
}}>
<div style={{padding:"16px 4px 8px"}}><h2 style={{margin:0,fontSize:16,fontWeight:600}}>Load Manifests — {wd[sd].name}</h2><p style={{margin:"4px 0 0",fontSize:12,color:"#78716c"}}>Drag stops to reorder or move between drivers. Tap for details.</p></div>
{dispNotes[dk]&&<div onClick={()=>{setView("daily");setEditingNote(true);setNoteText(dispNotes[dk]);}} style={{background:"#faf5ff",border:"1px solid #d8b4fe",borderRadius:10,padding:"8px 12px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"flex-start",gap:6}}>
<span style={{fontSize:12,flexShrink:0}}>📝</span>
<div style={{flex:1}}><div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textTransform:"uppercase"}}>Day Notes</div><div style={{fontSize:12,color:"#57534e",whiteSpace:"pre-wrap",lineHeight:1.3}}>{dispNotes[dk].length>120?dispNotes[dk].slice(0,120)+"…":dispNotes[dk]}</div></div>
</div>}
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
{de.length>0&&(()=>{const loads=getDriverLoads(drv.id);return loads.map(loadN=>{const w=getLoadWeight(drv.id,loadN);const pct=weightPct(w);const col=weightColor(w);const over=w>TRUCK_LIMITS.default;return w>0||loads.length>1?(<div key={loadN} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",marginBottom:2}}>
<span style={{fontSize:10,fontWeight:700,color:"#78716c",flexShrink:0}}>Load {loadN}</span>
<div style={{flex:1,height:8,background:"#e7e5e4",borderRadius:4,overflow:"hidden"}}>
<div style={{height:"100%",width:pct+"%",background:col,borderRadius:4,transition:"width 0.3s"}}/>
</div>
<span style={{fontSize:10,fontWeight:700,color:col,fontVariantNumeric:"tabular-nums",flexShrink:0}}>{w.toLocaleString()}<span style={{fontSize:8,color:"#a8a29e"}}>/{(TRUCK_LIMITS.default/1000).toFixed(0)}k</span></span>
{over&&<span style={{fontSize:8,background:"#dc2626",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:700}}>OVER</span>}
</div>):null;});})()}
{de.map((entry,eIdx)=><div key={entry.id}>
<ManifestStop entry={entry} eIdx={eIdx} total={de.length} drivers={drivers} onMove={dir=>moveInDriver(drv.id,eIdx,dir)} onReassign={did=>reassign(entry.id,did)} onRemove={()=>rmFromDriver(entry.id)} onUpdateInstructions={text=>updateInstructions(entry.id,text)} onShipPlan={val=>setShipPlan(entry.id,val)} onDueBy={time=>setDueBy(entry.id,time)} onWeight={w=>setWeight(entry.id,w)} onLoadNum={n=>setLoadNum(entry.id,n)} onRate={r=>updateRate(entry.id,r)} maxLoad={getMaxLoad(drv.id)}
isDragging={dragSrc?.drvId===drv.id&&dragSrc?.idx===eIdx} isDragOver={dragOver?.drvId===drv.id&&dragOver?.idx===eIdx} onDragStart={()=>setDragSrc({drvId:drv.id,idx:eIdx})} onDragOver={()=>setDragOver({drvId:drv.id,idx:eIdx})} onDrop={()=>handleDrop(drv.id,eIdx)}/>
<button onClick={()=>setInsertPickupFor({driverId:drv.id,afterIdx:eIdx})} style={{display:"block",width:"100%",background:"none",border:"1px dashed #bfdbfe",borderRadius:6,padding:"3px",cursor:"pointer",fontSize:10,color:"#93c5fd",marginBottom:4,textAlign:"center"}}>+ insert pickup here</button>
</div>)}
</div>);})}
{(()=>{const ua=dl.filter(e=>e.driverId===0);if(!ua.length)return null;return(<div style={{background:"#fff",border:"2px dashed #d6d3d1",borderRadius:14,padding:16,marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:14,height:14,borderRadius:4,background:"#a8a29e"}}/><span style={{fontSize:15,fontWeight:700,color:"#78716c"}}>Unassigned</span><span style={{fontSize:12,color:"#a8a29e"}}>({ua.length})</span></div>{ua.map((entry,eIdx)=><ManifestStop key={entry.id} entry={entry} eIdx={eIdx} total={ua.length} drivers={drivers} onMove={dir=>moveInDriver(0,eIdx,dir)} onReassign={did=>reassign(entry.id,did)} onRemove={()=>rmDel(entry.id)} onUpdateInstructions={text=>updateInstructions(entry.id,text)} onShipPlan={val=>setShipPlan(entry.id,val)} onDueBy={time=>setDueBy(entry.id,time)} onWeight={w=>setWeight(entry.id,w)} onLoadNum={n=>setLoadNum(entry.id,n)} onRate={r=>updateRate(entry.id,r)} maxLoad={1}/>)}</div>);})()}
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
{!editingNote?<div onClick={()=>{setEditingNote(true);setNoteText(dispNotes[dk]||"");}} style={{background:"#fff",border:dispNotes[dk]?"2px solid #7c3aed":"1px solid #e7e5e4",borderRadius:12,padding:"10px 14px",marginBottom:12,cursor:"pointer",minHeight:28,display:"flex",alignItems:"flex-start",gap:8}}>
<span style={{fontSize:14,flexShrink:0}}>{"📝"}</span>
{dispNotes[dk]?<div style={{flex:1}}><div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",marginBottom:2}}>Dispatcher Notes</div><div style={{fontSize:13,color:"#1c1917",whiteSpace:"pre-wrap",lineHeight:1.4}}>{dispNotes[dk]}</div></div>
:<div style={{fontSize:12,color:"#a8a29e",paddingTop:2}}>Tap to add dispatcher notes for this day</div>}
</div>
:<div style={{background:"#fff",border:"2px solid #7c3aed",borderRadius:12,padding:"10px 14px",marginBottom:12}}>
<div style={{fontSize:11,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",marginBottom:6}}>Dispatcher Notes</div>
<textarea value={noteText} onChange={e=>setNoteText(e.target.value)} autoFocus placeholder="Route changes, special instructions, notes for the day…" rows={3}
style={{width:"100%",border:"1px solid #d8b4fe",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit",background:"#faf5ff"}}/>
<div style={{display:"flex",gap:6,marginTop:6,justifyContent:"flex-end"}}>
{dispNotes[dk]&&<button onClick={()=>{setDispNotes(p=>{const n={...p};delete n[dk];return n;});setEditingNote(false);setNoteText("");}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear</button>}
<button onClick={()=>setEditingNote(false)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Cancel</button>
<button onClick={()=>{setDispNotes(p=>({...p,[dk]:noteText.trim()}));setEditingNote(false);showToast("Notes saved");}} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:600}}>Save</button>
</div>
</div>}
{dl.some(e=>e.isHourly)&&(()=>{
const{byDriver,totalMins}=getShiftSummary(dk);
const hasShifts=totalMins>0;
const hrs=emH[`${dk}-emser`]||4;
return(<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:"12px 16px",marginBottom:12}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<span style={{fontSize:13,color:"#2563eb",fontWeight:600}}>Emser Hours</span>
<span style={{fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{fmt(102.50*hrs)}</span>
</div>
{hasShifts?(<>
<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
{drivers.map((drv,di)=>{const mins=byDriver[drv.id]||0;if(!mins)return null;const initials=drv.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();return(<div key={drv.id} style={{display:"flex",alignItems:"center",gap:4,background:"#fff",border:`1px solid ${DCOL[di]}`,borderRadius:8,padding:"4px 10px"}}>
<div style={{width:20,height:20,borderRadius:6,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700}}>{initials}</div>
<span style={{fontSize:12,fontWeight:700,color:DCOL[di]}}>{formatMins(mins)}</span>
</div>);})}
<div style={{display:"flex",alignItems:"center",gap:4,background:"#dbeafe",borderRadius:8,padding:"4px 10px",marginLeft:"auto"}}>
<span style={{fontSize:11,color:"#1d4ed8",fontWeight:600}}>Total:</span>
<span style={{fontSize:13,fontWeight:800,color:"#1d4ed8"}}>{formatMins(totalMins)}</span>
</div>
</div>
<div style={{fontSize:11,color:"#64748b"}}>{hrs}h billed × $102.50 — auto-updated from shifts</div>
</>):(<>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:"#64748b"}}>{hrs}h × $102.50</span>
<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
{[4,5,6,7,8,9,10].map(h=><button key={h} onClick={()=>{setEmH(p=>({...p,[`${dk}-emser`]:h}));setShowCustomHrs(false);}} style={{width:30,height:30,borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:!showCustomHrs&&hrs===h?"#2563eb":"#e7e5e4",color:!showCustomHrs&&hrs===h?"#fff":"#78716c"}}>{h}</button>)}
<button onClick={()=>setShowCustomHrs(!showCustomHrs)} style={{height:30,borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,padding:"0 8px",background:showCustomHrs?"#2563eb":"#dbeafe",color:showCustomHrs?"#fff":"#2563eb"}}>Other</button>
</div></div>
{showCustomHrs&&<div style={{display:"flex",gap:6,alignItems:"center",marginTop:8}}><input value={customHrsInput} onChange={e=>setCustomHrsInput(e.target.value)} placeholder="e.g. 4.5" type="number" step="0.25" min="1" style={{width:80,border:"1px solid #bfdbfe",borderRadius:8,padding:"6px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center",background:"#fff"}}/><span style={{fontSize:12,color:"#64748b"}}>hrs</span><button onClick={()=>{const v=parseFloat(customHrsInput);if(v>0){setEmH(p=>({...p,[`${dk}-emser`]:v}));setShowCustomHrs(false);setCustomHrsInput("");}}} style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Set</button></div>}
<div style={{fontSize:11,color:"#64748b",marginTop:6}}>💡 Log shifts in History → ⏱ Emser Hrs for auto-calculation</div>
</>)}
</div>);
})()}
{dl.length===0?<div style={{textAlign:"center",padding:"48px 20px",color:"#a8a29e"}}><div style={{fontSize:36,marginBottom:12}}>🚚</div><p style={{fontSize:14,margin:0}}>No deliveries logged</p></div>:<>
{dl.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di=drivers.findIndex(d=>d.id===entry.driverId);const isImetco=entry.customer==="IMETCO";return(
<div key={entry.id} style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:"12px 16px",marginBottom:8,borderLeft:`4px solid ${entry.priority?"#f59e0b":entry.stopType==="pickup"?"#2563eb":c.accent}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div style={{flex:1}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
<span style={{fontSize:11,fontWeight:600,color:c.accent,textTransform:"uppercase"}}>{entry.customer}</span>
{entry.stopType==="pickup"&&<span style={{fontSize:9,background:"#2563eb",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PICKUP</span>}
{entry.priority&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PRIORITY</span>}
{entry.dueBy&&<span style={{fontSize:9,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700,display:"inline-flex",alignItems:"center",gap:2}}>{"\u23F0"} {entry.dueBy}</span>}
<span style={{fontSize:10,background:drv?(DCOL[di]||"#78716c"):"#a8a29e",color:"#fff",padding:"1px 6px",borderRadius:4,fontWeight:600}}>{drv?.name||"Unassigned"}</span>
</div>
<div style={{fontSize:14,fontWeight:600}}>{entry.stop}</div>
{entry.addr&&<div style={{fontSize:11,color:"#78716c",marginTop:1}}>{entry.addr}</div>}
{entry.instructions&&<div style={{fontSize:11,color:"#2563eb",marginTop:2}}>📋 {entry.instructions}</div>}
</div>
<div style={{textAlign:"right",marginLeft:12}}>
<div style={{fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums"}}><InlineRate value={entry.baseRate} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/></div>
<button onClick={()=>rmFromDriver(entry.id)} style={{background:"none",border:"none",color:"#dc2626",fontSize:11,cursor:"pointer",padding:"4px 0 0",opacity:0.7}}>Remove</button>
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
<div style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
<div style={{fontSize:11,fontWeight:700,color:"#57534e",textTransform:"uppercase",marginBottom:10}}>Week-over-Week</div>
<div style={{display:"flex",gap:12,marginBottom:10}}>
<div style={{flex:1,background:"#f5f5f4",borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
<div style={{fontSize:10,color:"#a8a29e",marginBottom:2}}>Last Week</div>
<div style={{fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums",color:prevWkT>0?"#57534e":"#a8a29e"}}>{prevWkT>0?fmt(prevWkT):"—"}</div>
</div>
<div style={{flex:1,background:"#f0fdf4",borderRadius:10,padding:"10px 12px",textAlign:"center",border:"1px solid #bbf7d0"}}>
<div style={{fontSize:10,color:"#16a34a",marginBottom:2}}>This Week</div>
<div style={{fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums",color:"#16a34a"}}>{fmt(wkT)}</div>
</div>
</div>
{prevWkT>0?<div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8}}>
<div style={{fontSize:14,fontWeight:700,fontVariantNumeric:"tabular-nums",color:wowDelta>=0?"#16a34a":"#dc2626"}}>{wowDelta>=0?"\u25B2":"\u25BC"} {fmt(Math.abs(wowDelta))}</div>
<div style={{fontSize:12,fontWeight:600,color:wowDelta>=0?"#16a34a":"#dc2626",background:wowDelta>=0?"#dcfce7":"#fef2f2",padding:"2px 8px",borderRadius:6}}>{wowPct>=0?"+":""}{wowPct.toFixed(1)}%</div>
</div>:<div style={{textAlign:"center",fontSize:12,color:"#a8a29e"}}>No previous week data to compare</div>}
<div style={{display:"flex",gap:4,marginTop:12}}>
{DAYS.map((day,i)=>{const cur=wkD[i].calc.total;const prev=prevWkD[i].calc.total;const maxVal=Math.max(...DAYS.map((_2,j)=>Math.max(wkD[j].calc.total,prevWkD[j].calc.total)),1);const curH=Math.max((cur/maxVal)*60,2);const prevH=Math.max((prev/maxVal)*60,prev>0?2:0);return(<div key={day} style={{flex:1,textAlign:"center"}}>
<div style={{height:68,display:"flex",alignItems:"flex-end",justifyContent:"center",gap:2,marginBottom:4}}>
<div style={{width:10,height:prevH,background:"#d6d3d1",borderRadius:"3px 3px 0 0"}}/>
<div style={{width:10,height:curH,background:cur>=prev?"#16a34a":"#f59e0b",borderRadius:"3px 3px 0 0"}}/>
</div>
<div style={{fontSize:9,color:"#a8a29e",fontWeight:600}}>{day.slice(0,2)}</div>
</div>);})}
</div>
<div style={{display:"flex",justifyContent:"center",gap:12,marginTop:6}}>
<div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:2,background:"#d6d3d1"}}/><span style={{fontSize:9,color:"#a8a29e"}}>Last wk</span></div>
<div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:2,background:"#16a34a"}}/><span style={{fontSize:9,color:"#a8a29e"}}>This wk</span></div>
</div>
</div>
{DAYS.map((day,i)=>{const{entries,calc}=wkD[i];const wk2=`${wo}-${i}`;const{byDriver:shiftByDrv,totalMins:shiftMins}=getShiftSummary(`${wo}-${i}`);if(!entries.length&&!shiftMins)return null;return(<div key={day} style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",padding:"8px 4px",borderBottom:"1px solid #e7e5e4"}}><span style={{fontSize:14,fontWeight:700}}>{day} — {wd[i].date}</span><span style={{fontVariantNumeric:"tabular-nums",fontWeight:700,color:"#16a34a",fontSize:14}}>{fmt(calc.total)}</span></div>
{shiftMins>0&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 8px 5px 14px",borderLeft:"3px solid #2563eb",marginTop:4,background:"#eff6ff",borderRadius:"0 8px 8px 0",flexWrap:"wrap"}}>
<span style={{fontSize:11,color:"#2563eb",fontWeight:700,flexShrink:0}}>⏱ Emser</span>
{drivers.map((drv,di)=>{const mins=shiftByDrv[drv.id]||0;if(!mins)return null;const initials=drv.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();return(<span key={drv.id} style={{fontSize:11,background:DCOL[di],color:"#fff",padding:"1px 6px",borderRadius:4,fontWeight:600}}>{initials} {formatMins(mins)}</span>);})}
<span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:"#1d4ed8",fontVariantNumeric:"tabular-nums"}}>{formatMins(shiftMins)}</span>
</div>}
{entries.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di2=drivers.findIndex(d=>d.id===entry.driverId);const isImetco=entry.customer==="IMETCO";return(<div key={entry.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 8px 6px 16px",borderLeft:`3px solid ${c.accent}`,marginTop:4,background:"#fff",borderRadius:isImetco?"0 8px 0 0":"0 8px 8px 0"}}><div style={{display:"flex",alignItems:"center",gap:4,flex:1,minWidth:0}}><span style={{fontSize:11,color:c.accent,fontWeight:600}}>{entry.customer}</span><span style={{fontSize:12,color:"#57534e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.stop}</span>{drv&&<span style={{fontSize:9,background:DCOL[di2]||"#78716c",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:600,flexShrink:0}}>{drv.name.charAt(0)}</span>}</div><InlineRate value={entry.baseRate} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/></div>
{isImetco&&<div style={{padding:"4px 8px 6px 16px",borderLeft:`3px solid ${c.accent}`,background:"#fff",borderRadius:"0 0 8px 0",display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:10,fontWeight:700,color:"#ea580c",flexShrink:0}}>SP#:</span>
<input value={entry.shipPlan||""} onChange={e=>{const eid=entry.id;const val=e.target.value;setLog(p=>({...p,[wk2]:(p[wk2]||[]).map(en=>en.id===eid?{...en,shipPlan:val}:en)}));}} placeholder="—"
style={{width:80,border:"1px solid #e7e5e4",borderRadius:6,padding:"3px 6px",fontSize:11,fontWeight:700,outline:"none",background:entry.shipPlan?"#f0fdf4":"#fff",textAlign:"center"}}/>
</div>}
</div>);})}</div>);})}
{wkD.every(d=>!d.entries.length)&&<div style={{textAlign:"center",padding:"48px 20px",color:"#a8a29e"}}><p>No deliveries this week</p></div>}
{(()=>{const wkShiftByDrv={};let wkShiftTotal=0;DAYS.forEach((_,i)=>{const{byDriver,totalMins}=getShiftSummary(`${wo}-${i}`);wkShiftTotal+=totalMins;Object.entries(byDriver).forEach(([did,mins])=>{wkShiftByDrv[did]=(wkShiftByDrv[did]||0)+mins;});});if(!wkShiftTotal)return null;const wkShiftHrs=Math.round(wkShiftTotal/15)*15/60;return(<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<span style={{fontSize:13,fontWeight:700,color:"#2563eb"}}>⏱ Week Emser Hours</span>
<span style={{fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums",color:"#1d4ed8"}}>{fmt(102.50*wkShiftHrs)}</span>
</div>
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>
{drivers.map((drv,di)=>{const mins=wkShiftByDrv[drv.id]||0;if(!mins)return null;const initials=drv.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();const hrs=Math.round(mins/15)*15/60;return(<div key={drv.id} style={{display:"flex",alignItems:"center",gap:5,background:"#fff",border:`1px solid ${DCOL[di]}`,borderRadius:8,padding:"4px 10px"}}>
<div style={{width:18,height:18,borderRadius:5,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700}}>{initials}</div>
<span style={{fontSize:12,fontWeight:700}}>{formatMins(mins)}</span>
<span style={{fontSize:10,color:"#64748b"}}>{fmt(102.50*hrs)}</span>
</div>);})}
</div>
<div style={{fontSize:11,color:"#64748b",fontVariantNumeric:"tabular-nums"}}>{formatMins(wkShiftTotal)} total across all drivers</div>
</div>);})()} 
{Object.keys(wkF).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:"14px 16px",marginBottom:12}}><div style={{fontSize:12,fontWeight:700,color:"#d97706",textTransform:"uppercase",marginBottom:8}}>Week Fuel</div>{Object.entries(wkF).map(([cu,cf])=><div key={cu} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:13}}>{cu} <span style={{fontSize:11,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base)} x {Math.round(cf.pct*100)}%</span></span><span style={{fontSize:14,fontWeight:700,color:"#d97706",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base*cf.pct)}</span></div>)}</div>}
</div>}

{/* ═══ HISTORY ═══ */}
{view==="history"&&<div>
<div style={{padding:"16px 4px 8px"}}><h2 style={{margin:0,fontSize:16,fontWeight:600}}>Delivery History</h2><p style={{margin:"4px 0 0",fontSize:12,color:"#78716c"}}>{histMode==="emser"?"Track Emser driver hours":"Search deliveries and proof of delivery photos"}</p></div>

{/* Mode toggle - 4 options */}
<div style={{display:"flex",gap:3,marginBottom:10,background:"#f5f5f4",borderRadius:10,padding:3}}>
{[{k:"deliveries",l:"Deliveries"},{k:"photos",l:"📷 Photos"},{k:"emser",l:"⏱ Emser"},{k:"quotes",l:"💰 Quotes"}].map(m=>(
<button key={m.k} onClick={()=>setHistMode(m.k)} style={{flex:1,padding:"8px 4px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:histMode===m.k?"#fff":"transparent",color:histMode===m.k?BRAND.main:"#78716c",boxShadow:histMode===m.k?"0 1px 3px rgba(0,0,0,0.08)":"none"}}>{m.l}</button>
))}
</div>

{/* EMSER HOURS CALCULATOR MODE */}
{histMode==="emser"&&(()=>{
const shifts=getEmserDayShifts();
const totalMins=shifts.reduce((sum,s)=>sum+calcShiftMins(s),0);
const totalHrs=Math.round(totalMins/15)*15/60;
const perDriver={};shifts.forEach(s=>{if(!perDriver[s.driverId])perDriver[s.driverId]=0;perDriver[s.driverId]+=calcShiftMins(s);});
const TIME_PRESETS=["7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
return(<div>
{/* Day header */}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px",marginBottom:12}}>
<span style={{fontSize:14,fontWeight:700}}>{wd[sd].name} — {wd[sd].date}</span>
<div style={{textAlign:"right"}}>
<div style={{fontSize:18,fontWeight:800,color:BRAND.main,fontVariantNumeric:"tabular-nums"}}>{totalMins>0?formatMins(totalMins):(emH[`${dk}-emser`]||4)+"h"}</div>
<div style={{fontSize:10,color:"#78716c"}}>{totalMins>0?fmt(102.50*totalHrs):fmt(102.50*(emH[`${dk}-emser`]||4))}</div>
</div>
</div>

{/* Per-driver sections */}
{drivers.map((drv,di)=>{
const drvShifts=shifts.filter(s=>s.driverId===drv.id);
const drvMins=perDriver[drv.id]||0;
return(<div key={drv.id} style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:"12px 14px",marginBottom:10,borderLeft:`3px solid ${DCOL[di]}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:drvShifts.length?8:0}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<div style={{width:22,height:22,borderRadius:7,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>{drv.name.charAt(0)}</div>
<span style={{fontSize:14,fontWeight:700}}>{drv.name}</span>
{drvMins>0&&<span style={{fontSize:12,fontWeight:700,color:BRAND.main,fontVariantNumeric:"tabular-nums"}}>{formatMins(drvMins)}</span>}
</div>
<button onClick={()=>addEmserShift(drv.id)} style={{background:BRAND.pale,border:"1px solid "+BRAND.light,borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:600,color:BRAND.main}}>+ Shift</button>
</div>

{drvShifts.map((shift,si)=>{
const mins=calcShiftMins(shift);
const HOURS=["7","8","9","10","11","12","1","2","3","4","5"];
const AMPM=(h)=>parseInt(h)>=7&&parseInt(h)<=11?"AM":"PM";
const hourTo24=(h)=>{let n=parseInt(h);const ap=AMPM(h);if(ap==="PM"&&n!==12)n+=12;if(ap==="AM"&&n===12)n=0;return String(n).padStart(2,"0");};
const curStartHour=shift.start?String(parseInt(shift.start.split(":")[0])||""):"";
const curStartMin=shift.start?":"+shift.start.split(":")[1]||":00":":00";
const curEndHour=shift.end?String(parseInt(shift.end.split(":")[0])||""):"";
const curEndMin=shift.end?":"+shift.end.split(":")[1]||":00":":00";
/* Map 24h back to display hour */
const h24ToDisplay=(h24)=>{if(!h24)return"";const n=parseInt(h24);if(n===0)return"12";if(n>12)return String(n-12);return String(n);};
const startDispHour=shift.start?h24ToDisplay(shift.start.split(":")[0]):"";
const endDispHour=shift.end?h24ToDisplay(shift.end.split(":")[0]):"";
const setHour=(field,h)=>{const ap=AMPM(h);const h24=hourTo24(h);const curVal=field==="start"?shift.start:shift.end;const curMin=curVal?curVal.split(":")[1]:"00";updateEmserShift(shift.id,field,h24+":"+curMin);};
const setMin=(field,m)=>{const curVal=field==="start"?shift.start:shift.end;if(!curVal)return;const h24=curVal.split(":")[0];updateEmserShift(shift.id,field,h24+":"+m);};
const MINS=[{l:":00",v:"00"},{l:":15",v:"15"},{l:":30",v:"30"},{l:":45",v:"45"}];
const btnBase={padding:"4px 0",borderRadius:5,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,textAlign:"center"};
return(
<div key={shift.id} style={{background:"#fafaf9",border:"1px solid #e7e5e4",borderRadius:10,padding:"10px 12px",marginBottom:6}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<span style={{fontSize:11,fontWeight:600,color:"#57534e"}}>Shift {si+1}</span>
<div style={{display:"flex",alignItems:"center",gap:6}}>
{mins>0&&<span style={{fontSize:12,fontWeight:700,color:BRAND.main}}>{formatMins(mins)}</span>}
<button onClick={()=>removeEmserShift(shift.id)} style={{background:"#fef2f2",border:"none",borderRadius:5,padding:"2px 6px",cursor:"pointer",fontSize:10,color:"#dc2626"}}>✕</button>
</div>
</div>
{/* Start row */}
<div style={{marginBottom:8}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
<label style={{fontSize:10,fontWeight:700,color:BRAND.main,width:30,flexShrink:0}}>Start</label>
<input type="time" value={shift.start} onChange={e=>updateEmserShift(shift.id,"start",e.target.value)} style={{flex:1,border:"1px solid #bfdbfe",borderRadius:7,padding:"5px 8px",fontSize:13,fontWeight:700,outline:"none",background:shift.start?"#eff6ff":"#fafaf9"}}/>
</div>
<div style={{display:"flex",gap:2,paddingLeft:36}}>
{HOURS.map(h=>{const sel=startDispHour===h&&!!shift.start;return(<button key={h} onClick={()=>setHour("start",h)} style={{...btnBase,flex:1,background:sel?BRAND.main:"#e7e5e4",color:sel?"#fff":"#44403c"}}>{h}</button>);})}
</div>
<div style={{display:"flex",gap:2,paddingLeft:36,marginTop:2}}>
{MINS.map(({l,v})=>{const sel=shift.start&&shift.start.split(":")[1]===v;const dis=!shift.start;return(<button key={v} onClick={()=>setMin("start",v)} style={{...btnBase,flex:1,background:sel?BRAND.main:dis?"#f5f5f4":"#dbeafe",color:sel?"#fff":dis?"#ccc":"#1d4ed8",opacity:dis?0.4:1,cursor:dis?"default":"pointer"}}>{l}</button>);})}
</div>
</div>
{/* End row */}
<div>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
<label style={{fontSize:10,fontWeight:700,color:"#16a34a",width:30,flexShrink:0}}>End</label>
<input type="time" value={shift.end} onChange={e=>updateEmserShift(shift.id,"end",e.target.value)} style={{flex:1,border:"1px solid #bbf7d0",borderRadius:7,padding:"5px 8px",fontSize:13,fontWeight:700,outline:"none",background:shift.end?"#f0fdf4":"#fafaf9"}}/>
</div>
<div style={{display:"flex",gap:2,paddingLeft:36}}>
{HOURS.map(h=>{const sel=endDispHour===h&&!!shift.end;return(<button key={h} onClick={()=>setHour("end",h)} style={{...btnBase,flex:1,background:sel?"#16a34a":"#e7e5e4",color:sel?"#fff":"#44403c"}}>{h}</button>);})}
</div>
<div style={{display:"flex",gap:2,paddingLeft:36,marginTop:2}}>
{MINS.map(({l,v})=>{const sel=shift.end&&shift.end.split(":")[1]===v;const dis=!shift.end;return(<button key={v} onClick={()=>setMin("end",v)} style={{...btnBase,flex:1,background:sel?"#16a34a":dis?"#f5f5f4":"#dcfce7",color:sel?"#fff":dis?"#ccc":"#15803d",opacity:dis?0.4:1,cursor:dis?"default":"pointer"}}>{l}</button>);})}
</div>
</div>
</div>);})}

{drvShifts.length===0&&<div style={{fontSize:12,color:"#a8a29e",padding:"4px 0"}}>No shifts logged — tap + Shift to add</div>}
</div>);})}

{/* Apply button */}
{totalMins>0&&<div style={{background:BRAND.pale,border:"2px solid "+BRAND.main,borderRadius:14,padding:"14px 16px",marginTop:8}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<div>
<div style={{fontSize:13,fontWeight:700,color:BRAND.dark}}>Total Emser Time</div>
<div style={{fontSize:11,color:"#78716c"}}>Across all drivers</div>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:20,fontWeight:800,color:BRAND.main,fontVariantNumeric:"tabular-nums"}}>{formatMins(totalMins)}</div>
<div style={{fontSize:12,fontWeight:700,color:"#16a34a"}}>{fmt(102.50*totalHrs)}</div>
</div>
</div>
{Object.entries(perDriver).map(([did,mins])=>{const drv=drivers.find(d=>d.id===Number(did));const di=drivers.findIndex(d=>d.id===Number(did));return drv?(<div key={did} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0"}}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<div style={{width:14,height:14,borderRadius:4,background:DCOL[di]}}/>
<span style={{fontSize:12,color:"#57534e"}}>{drv.name}</span>
</div>
<span style={{fontSize:12,fontWeight:700,color:"#57534e",fontVariantNumeric:"tabular-nums"}}>{formatMins(mins)}</span>
</div>):null;})}
<button onClick={()=>{const hrs=calcAndApplyEmserHours();showToast("Emser hours set to "+hrs+"h");}} style={{display:"block",width:"100%",marginTop:10,background:BRAND.main,color:"#fff",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:700}}>{"Apply "+totalHrs+"h to Today's Billing"}</button>
</div>}
</div>);
})()}

{histMode!=="emser"&&<div>
<input value={histSearch} onChange={e=>setHistSearch(e.target.value)} placeholder={histMode==="photos"?"Search photos by stop, customer…":"Search stops, customers, addresses…"} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:14,outline:"none",background:"#fff",marginBottom:10}}/>
<div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
<select value={histCustFilter} onChange={e=>setHistCustFilter(e.target.value)} style={{flex:1,minWidth:120,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none",background:"#fff",color:histCustFilter?"#1c1917":"#a8a29e"}}>
<option value="">All Customers</option>
{Object.keys(CUSTOMERS).map(c=><option key={c} value={c}>{c}</option>)}
</select>
<select value={histDrvFilter} onChange={e=>setHistDrvFilter(e.target.value)} style={{flex:1,minWidth:100,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none",background:"#fff",color:histDrvFilter?"#1c1917":"#a8a29e"}}>
<option value="">All Drivers</option>
{drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
</select>
<select value={histWeekRange} onChange={e=>setHistWeekRange(Number(e.target.value))} style={{minWidth:80,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none",background:"#fff"}}>
<option value={2}>2 wks</option><option value={4}>4 wks</option><option value={8}>8 wks</option><option value={12}>12 wks</option>
</select>
</div>
</div>}

{/* PHOTO GALLERY MODE */}
{histMode==="photos"&&(()=>{
const photosAll=[];
histFiltered.forEach(e=>{
if(e.photos&&e.photos.length>0){
e.photos.forEach((p,pi)=>photosAll.push({src:p,stop:e.stop,customer:e.customer,dayName:e.dayName,dayDate:e.dayDate,weekOff:e.weekOff,signature:e.signature,addr:e.addr,driverId:e.driverId,id:e.id+"-"+pi}));
}
});
const photoCount=photosAll.length;
return(<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px",marginBottom:8}}>
<span style={{fontSize:12,color:"#78716c"}}>{photoCount} photo{photoCount!==1?"s":""}</span>
{(histSearch||histCustFilter||histDrvFilter)&&<button onClick={()=>{setHistSearch("");setHistCustFilter("");setHistDrvFilter("");}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear</button>}
</div>
{photoCount===0?<div style={{textAlign:"center",padding:"48px 20px",color:"#a8a29e"}}><div style={{fontSize:36,marginBottom:12}}>{"📷"}</div><p style={{fontSize:14,fontWeight:600,margin:"0 0 4px"}}>No photos found</p><p style={{fontSize:12,margin:0}}>{histFiltered.length>0?"No photos on these deliveries":"Try adjusting your filters"}</p></div>
:<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
{photosAll.map(photo=>{const c=CC[photo.customer]||CC["One-Off Delivery"];const drv=drivers.find(d=>d.id===photo.driverId);return(
<div key={photo.id} onClick={()=>setLightboxPhoto(photo)} style={{cursor:"pointer",borderRadius:10,overflow:"hidden",border:"1px solid #e7e5e4",background:"#fff"}}>
<div style={{position:"relative",paddingTop:"100%",background:"#f5f5f4"}}>
<img src={photo.src} alt={photo.stop} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/>
{photo.signature&&<div style={{position:"absolute",bottom:4,right:4,background:"#16a34a",color:"#fff",fontSize:8,fontWeight:700,padding:"2px 5px",borderRadius:4}}>{"✓ POD"}</div>}
</div>
<div style={{padding:"6px 8px"}}>
<div style={{fontSize:10,fontWeight:600,color:"#1c1917",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{photo.stop}</div>
<div style={{fontSize:9,color:c.accent}}>{photo.customer}</div>
<div style={{fontSize:9,color:"#a8a29e"}}>{photo.dayName} {photo.dayDate}</div>
</div>
</div>);})}
</div>}
</div>);
})()}

{/* QUOTES MODE */}
{histMode==="quotes"&&(()=>{
const allCustNames=[...Object.keys(CUSTOMERS),...QUOTE_CUSTOMERS.map(q=>q.name),"One-Off Delivery"];
const getDeliveries2=(custName)=>{const cd=CUSTOMERS[custName];if(!cd)return[];return cd.deliveries.map(d=>typeof d==="string"?{s:d,r:0}:d);};
return(<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
<div><span style={{fontSize:14,fontWeight:700}}>Quotes</span><span style={{fontSize:11,color:"#a8a29e",marginLeft:6}}>{savedQuotes.length}</span></div>
<button onClick={()=>setQuoteFormOpen(!quoteFormOpen)} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>{quoteFormOpen?"Cancel":"+ New Quote"}</button>
</div>
{quoteFormOpen&&<div style={{background:"#fff",border:"2px solid #16a34a",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
<div style={{fontSize:13,fontWeight:700,color:"#16a34a",marginBottom:12}}>New Quote</div>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Customer</label>
<select value={qCust} onChange={e=>{setQCust(e.target.value);setQStop("");}} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff",marginBottom:10}}>
<option value="">Select customer...</option>{allCustNames.map(c=><option key={c} value={c}>{c}</option>)}<option value="__manual">Manual Entry</option>
</select>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Delivery To</label>
{qCust&&qCust!=="__manual"&&getDeliveries2(qCust).length>0?
<select value={qStop} onChange={e=>setQStop(e.target.value)} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff",marginBottom:10}}>
<option value="">Select stop...</option>{getDeliveries2(qCust).map(d=><option key={d.s} value={d.s}>{d.s}{d.r?" — $"+d.r:""}</option>)}<option value="__custom">Custom location...</option>
</select>
:<input value={qStop} onChange={e=>setQStop(e.target.value)} placeholder="Delivery location" style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",marginBottom:10}}/>}
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Address</label>
<div style={{marginBottom:10}}><AddressInput value={qAddr} onChange={setQAddr} placeholder="Delivery address" style={{fontSize:13}}/></div>
<div style={{display:"flex",gap:10,marginBottom:10}}>
<div style={{flex:1}}><label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Miles</label><input type="number" value={qMiles} onChange={e=>setQMiles(e.target.value)} placeholder="e.g. 25" style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}/></div>
<div style={{flex:1}}><label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Rate Override</label><input type="number" value={qRate} onChange={e=>setQRate(e.target.value)} placeholder={qMiles?"Auto":"$"} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}/></div>
</div>
{qMiles&&<div style={{fontSize:12,color:"#16a34a",fontWeight:700,marginBottom:8}}>Auto: {fmt(calcQuoteRate(qMiles,qLiftgate,qGravel,qExtraPallets).total)}</div>}
<div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
<label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:11,fontWeight:600,color:qLiftgate?"#92400e":"#78716c",background:qLiftgate?"#fef3c7":"#f5f5f4",padding:"5px 10px",borderRadius:7,border:qLiftgate?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qLiftgate} onChange={e=>setQLiftgate(e.target.checked)}/> Liftgate</label>
<label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:11,fontWeight:600,color:qGravel?"#92400e":"#78716c",background:qGravel?"#fef3c7":"#f5f5f4",padding:"5px 10px",borderRadius:7,border:qGravel?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qGravel} onChange={e=>setQGravel(e.target.checked)}/> Gravel</label>
<label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:11,fontWeight:600,color:qExtraPallets?"#92400e":"#78716c",background:qExtraPallets?"#fef3c7":"#f5f5f4",padding:"5px 10px",borderRadius:7,border:qExtraPallets?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qExtraPallets} onChange={e=>setQExtraPallets(e.target.checked)}/> 4-5 Pallets</label>
</div>
<label style={{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Notes</label>
<textarea value={qNote} onChange={e=>setQNote(e.target.value)} placeholder="Details..." rows={2} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none",resize:"vertical",fontFamily:"inherit",marginBottom:10}}/>
<div style={{display:"flex",justifyContent:"flex-end",gap:6}}>
<button onClick={()=>setQuoteFormOpen(false)} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11,fontWeight:600}}>Cancel</button>
<button onClick={saveQuote} disabled={!qStop.trim()} style={{background:qStop.trim()?"#16a34a":"#a8a29e",color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11,fontWeight:700}}>Save</button>
</div>
</div>}
{savedQuotes.length===0&&!quoteFormOpen&&<div style={{textAlign:"center",padding:"48px 20px",color:"#a8a29e"}}><div style={{fontSize:36,marginBottom:12}}>💰</div><p style={{fontSize:13,fontWeight:600,margin:"0 0 4px"}}>No quotes yet</p></div>}
{savedQuotes.map(q=>{const c=CC[q.customer]||CC["Quote Delivery"]||CC["One-Off Delivery"];const accepted=q.status==="accepted";return(
<div key={q.id} style={{background:accepted?"#f0fdf4":"#fff",border:`1px solid ${accepted?"#bbf7d0":"#e7e5e4"}`,borderRadius:12,padding:"12px 14px",marginBottom:8,borderLeft:`4px solid ${accepted?"#16a34a":c.accent}`}}>
<div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3,flexWrap:"wrap"}}>
<span style={{fontSize:11,fontWeight:800,color:"#a8a29e"}}>#{q.num}</span>
<span style={{fontSize:10,fontWeight:600,color:c.accent}}>{q.customer}</span>
{accepted?<span style={{fontSize:8,background:"#16a34a",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>ACCEPTED</span>:<span style={{fontSize:8,background:"#fef3c7",color:"#92400e",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PENDING</span>}
{q.miles&&<span style={{fontSize:9,color:"#78716c"}}>{q.miles}mi</span>}
{q.liftgate&&<span style={{fontSize:8,background:"#fef3c7",color:"#92400e",padding:"1px 3px",borderRadius:2}}>LG</span>}
</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div style={{flex:1}}>
<div style={{fontSize:14,fontWeight:700}}>{q.stop}</div>
{q.addr&&<div style={{fontSize:10,color:"#78716c",marginTop:1}}>{q.addr}</div>}
{q.note&&<div style={{fontSize:10,color:"#57534e",marginTop:2}}>{q.note}</div>}
<div style={{fontSize:9,color:"#a8a29e",marginTop:3}}>{new Date(q.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})} {new Date(q.createdAt).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}</div>
</div>
<div style={{textAlign:"right",marginLeft:10,flexShrink:0}}>
<div style={{fontSize:18,fontWeight:800,color:accepted?"#16a34a":"#1c1917",fontVariantNumeric:"tabular-nums"}}>{fmt(q.rate)}</div>
{q.calc&&<div style={{fontSize:9,color:"#78716c"}}>{fmt(q.calc.base)}+{fmt(q.calc.fuel)}</div>}
</div>
</div>
{!accepted&&<div style={{display:"flex",gap:6,marginTop:8}}>
{qPushDay&&qPushDay.quoteId===q.id?<div style={{flex:1,display:"flex",gap:4}}>
<select onChange={e=>{if(e.target.value)pushQuoteToDay(q.id,e.target.value);}} defaultValue="" style={{flex:1,border:"1px solid #16a34a",borderRadius:6,padding:"4px 6px",fontSize:10,outline:"none",background:"#f0fdf4"}}>
<option value="">Pick day...</option>{DAYS.map((day,i)=><option key={i} value={`${wo}-${i}`}>{day} {wd[i].date}</option>)}<option value={`${wo+1}-0`}>Next Mon</option>
</select>
<button onClick={()=>setQPushDay(null)} style={{background:"#e7e5e4",border:"none",borderRadius:5,padding:"3px 8px",cursor:"pointer",fontSize:9}}>✕</button>
</div>
:<><button onClick={()=>setQPushDay({quoteId:q.id})} style={{flex:1,background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"7px",cursor:"pointer",fontSize:11,fontWeight:700}}>Push to Day</button>
<button onClick={()=>{setSavedQuotes(p=>p.filter(x=>x.id!==q.id));deleteQuoteFromFB(q.id).catch(e=>console.error("Quote del:",e));showToast("Deleted");}} style={{background:"#fef2f2",border:"none",borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Delete</button></>}
</div>}
{accepted&&q.pushedTo&&<div style={{fontSize:10,color:"#16a34a",fontWeight:600,marginTop:4}}>✓ Pushed to {DAYS[parseInt(q.pushedTo.split("-")[1])]||""}</div>}
</div>);})}
</div>);
})()}

{/* DELIVERIES LIST MODE */}
{histMode==="deliveries"&&<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px",marginBottom:8}}>
<span style={{fontSize:12,color:"#78716c"}}>{histFiltered.length} deliveries</span>
{(histSearch||histCustFilter||histDrvFilter)&&<button onClick={()=>{setHistSearch("");setHistCustFilter("");setHistDrvFilter("");}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear</button>}
</div>
{histFiltered.length===0&&<div style={{textAlign:"center",padding:"48px 20px",color:"#a8a29e"}}><div style={{fontSize:36,marginBottom:12}}>{"🔍"}</div><p style={{fontSize:14,margin:0}}>{histAll.length===0?"No delivery data yet":"No matches"}</p></div>}
{histFiltered.length>0&&(()=>{const grouped={};histFiltered.forEach(e=>{const gk=`${e.weekOff}-${e.dayIdx}`;if(!grouped[gk])grouped[gk]={dayName:e.dayName,dayDate:e.dayDate,weekOff:e.weekOff,dayIdx:e.dayIdx,entries:[]};grouped[gk].entries.push(e);});return Object.values(grouped).sort((a,b)=>a.weekOff!==b.weekOff?b.weekOff-a.weekOff:b.dayIdx-a.dayIdx).map((grp,gi)=>{const dayTotal=grp.entries.reduce((s,e)=>s+e.baseRate,0);const isCur=grp.weekOff===wo;return(<div key={gi} style={{marginBottom:12}}>
<div style={{display:"flex",justifyContent:"space-between",padding:"6px 4px",borderBottom:"1px solid #e7e5e4",marginBottom:4}}>
<span style={{fontSize:13,fontWeight:700,color:isCur?"#1c1917":"#78716c"}}>{grp.dayName} — {grp.dayDate}{!isCur&&<span style={{fontSize:10,color:"#a8a29e",fontWeight:500,marginLeft:4}}>{grp.weekOff===wo-1?"last wk":(wo-grp.weekOff)+"w ago"}</span>}</span>
<span style={{fontSize:12,fontWeight:600,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(dayTotal)}</span>
</div>
{grp.entries.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di=drivers.findIndex(d=>d.id===entry.driverId);const hasPhotos=entry.photos&&entry.photos.length>0;return(
<div key={entry.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 8px 6px 16px",borderLeft:"3px solid "+(entry.stopType==="pickup"?"#2563eb":c.accent),marginBottom:3,background:"#fff",borderRadius:"0 8px 8px 0"}}>
<div style={{flex:1,minWidth:0}}>
<div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
{entry.stopType==="pickup"&&<span style={{fontSize:8,background:"#2563eb",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:700}}>PU</span>}
<span style={{fontSize:11,color:c.accent,fontWeight:600}}>{entry.customer}</span>
<span style={{fontSize:12,color:"#57534e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.stop}</span>
{hasPhotos&&<span style={{fontSize:9,background:"#dbeafe",color:"#2563eb",padding:"1px 4px",borderRadius:3,fontWeight:600}}>{"📷"}{entry.photos.length}</span>}
{entry.signature&&<span style={{fontSize:9,background:"#dcfce7",color:"#16a34a",padding:"1px 4px",borderRadius:3,fontWeight:600}}>{"✓"} POD</span>}
</div>
{entry.addr&&<div style={{fontSize:10,color:"#a8a29e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.addr}</div>}
{hasPhotos&&<div style={{display:"flex",gap:4,marginTop:4}}>
{entry.photos.slice(0,4).map((p,pi)=><img key={pi} src={p} alt="" onClick={()=>setLightboxPhoto({src:p,stop:entry.stop,customer:entry.customer,dayName:entry.dayName,dayDate:entry.dayDate,signature:entry.signature})} style={{width:36,height:36,objectFit:"cover",borderRadius:6,border:"1px solid #e7e5e4",cursor:"pointer"}}/>)}
{entry.photos.length>4&&<div style={{width:36,height:36,borderRadius:6,background:"#f5f5f4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#78716c"}}>+{entry.photos.length-4}</div>}
</div>}
</div>
<div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:6}}>
{drv&&<span style={{fontSize:9,background:DCOL[di]||"#78716c",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:600}}>{drv.name.charAt(0)}</span>}
<InlineRate value={entry.baseRate} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/>
</div>
</div>);})}
</div>);});})()}
</div>}

{/* LIGHTBOX */}
{lightboxPhoto&&<div onClick={()=>setLightboxPhoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
<button onClick={()=>setLightboxPhoto(null)} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:16,color:"#fff"}}>{"✕"}</button>
<img src={lightboxPhoto.src} alt={lightboxPhoto.stop} style={{maxWidth:"100%",maxHeight:"70vh",borderRadius:12,objectFit:"contain"}} onClick={e=>e.stopPropagation()}/>
<div style={{marginTop:12,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
<div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{lightboxPhoto.stop}</div>
<div style={{fontSize:13,color:"#a8a29e",marginTop:2}}>{lightboxPhoto.customer}</div>
<div style={{fontSize:12,color:"#78716c",marginTop:2}}>{lightboxPhoto.dayName} {lightboxPhoto.dayDate}</div>
{lightboxPhoto.signature&&<div style={{marginTop:8,background:"#16a34a",color:"#fff",display:"inline-block",padding:"4px 12px",borderRadius:6,fontSize:12,fontWeight:600}}>{"✓"} Received by: {lightboxPhoto.signature}</div>}
</div>
</div>}
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
<button onClick={()=>{setSelCust(null);setMultiSelect(false);setMultiChecked([]);setShowAddCustomDel(false);setShowCustPickup(false);}} style={BB}>← Back</button>
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
onAdd={(dueBy,weight)=>{const cd=CUSTOMERS[selCust];addDel(selCust,stop,rate||0,preAssignDriver||0,{isHourly:cd.rate_type==="hourly",fuelPct:(cd.fuel_surcharge&&!cd.fuel_included)?cd.fuel_surcharge:0,note:note||null,addr,priority:cd.priority,dueBy:dueBy||null,weight:weight||0});}}
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
<AddressInput value={customDelAddr} onChange={v=>setCustomDelAddr(v)} placeholder="Full address" style={{borderRadius:10,padding:"10px 14px"}}/>
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

{/* CUSTOMER PICKUP BUILDER */}
{!showCustPickup&&<button onClick={()=>{setShowCustPickup(true);setCustPUFrom("");setCustPUAddr("");setCustPUNote("");}} style={{display:"block",width:"100%",marginTop:8,background:"#eff6ff",border:"2px dashed #93c5fd",borderRadius:12,padding:"14px 16px",cursor:"pointer",textAlign:"center",color:"#2563eb",fontSize:13,fontWeight:600}}>{"+ Add Pickup for "+selCust}</button>}
{showCustPickup&&<div style={{marginTop:8,background:"#fff",border:"2px solid #2563eb",borderRadius:14,padding:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<span style={{fontSize:13,fontWeight:700,color:"#2563eb"}}>{"Pickup for "+selCust}</span>
<button onClick={()=>setShowCustPickup(false)} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#78716c"}}>{"\u2715"}</button>
</div>
<p style={{fontSize:11,color:"#78716c",margin:"0 0 10px"}}>{"Select where to pick up material going back to "+selCust}</p>
{(()=>{
const cd=CUSTOMERS[selCust];
const custDeliveries=cd?cd.deliveries||[]:[];
const deliveryNames=custDeliveries.map(d=>typeof d==="string"?d:d.s);
const custSources=PICKUP_SOURCES.filter(ps=>ps.customer===selCust);
const allLocs=[...custSources.map(s=>({name:s.label,addr:s.addr,type:"warehouse"})),...deliveryNames.map(n=>({name:n,addr:getAddr(n),type:"delivery"}))];
return(<div>
{allLocs.length>0&&<div style={{marginBottom:10}}>
<div style={{fontSize:11,fontWeight:600,color:"#57534e",marginBottom:6}}>Pick up from:</div>
<div style={{maxHeight:200,overflowY:"auto",border:"1px solid #e7e5e4",borderRadius:10}}>
{custSources.length>0&&<div style={{padding:"6px 10px",fontSize:10,fontWeight:700,color:"#2563eb",textTransform:"uppercase",background:"#eff6ff"}}>Warehouses</div>}
{custSources.map((src,si)=><div key={"w"+si} onClick={()=>{setCustPUFrom(src.label);setCustPUAddr(src.addr);}} style={{padding:"8px 12px",cursor:"pointer",background:custPUFrom===src.label?"#dbeafe":"#fff",borderBottom:"1px solid #f5f5f4"}}>
<div style={{fontSize:12,fontWeight:600,color:custPUFrom===src.label?"#2563eb":"#1c1917"}}>{src.label}</div>
<div style={{fontSize:10,color:"#a8a29e"}}>{src.addr}</div>
</div>)}
{deliveryNames.length>0&&<div style={{padding:"6px 10px",fontSize:10,fontWeight:700,color:"#16a34a",textTransform:"uppercase",background:"#f0fdf4"}}>{selCust+" Delivery Locations"}</div>}
{deliveryNames.map((n,di)=>{const addr=getAddr(n);return(<div key={"d"+di} onClick={()=>{setCustPUFrom(n);setCustPUAddr(addr);}} style={{padding:"8px 12px",cursor:"pointer",background:custPUFrom===n?"#dbeafe":"#fff",borderBottom:"1px solid #f5f5f4"}}>
<div style={{fontSize:12,fontWeight:600,color:custPUFrom===n?"#2563eb":"#1c1917"}}>{n}</div>
{addr&&<div style={{fontSize:10,color:"#a8a29e"}}>{addr}</div>}
</div>);})}
</div>
</div>}
<div style={{fontSize:11,fontWeight:600,color:"#57534e",marginBottom:4,marginTop:8}}>Or enter manually:</div>
<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
<input value={custPUFrom} onChange={e=>setCustPUFrom(e.target.value)} placeholder="Pickup location name" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/>
<AddressInput value={custPUAddr} onChange={v=>setCustPUAddr(v)} placeholder="Address"/>
<input value={custPUNote} onChange={e=>setCustPUNote(e.target.value)} placeholder="Note (optional)" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/>
</div>
</div>);})()}
{custPUFrom&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:10}}>
<div style={{fontSize:10,color:"#2563eb",fontWeight:700}}>PICKUP</div>
<div style={{fontSize:14,fontWeight:700}}>{custPUFrom+" \u2192 "+selCust}</div>
{custPUAddr&&<div style={{fontSize:11,color:"#78716c"}}>{custPUAddr}</div>}
</div>}
<button onClick={()=>{if(!custPUFrom.trim())return;const cd=CUSTOMERS[selCust];const custPS=PICKUP_SOURCES.filter(ps=>ps.customer===selCust);const homeAddr=custPS.length>0?custPS[0].addr:"";addDel(selCust,custPUFrom.trim(),0,preAssignDriver||0,{stopType:"pickup",addr:custPUAddr.trim()||"",note:custPUNote.trim()||("Pickup for "+selCust),instructions:"Picking up for "+selCust+". Return to: "+(homeAddr||(cd&&cd.pickup)||selCust),priority:(cd&&cd.priority)||false});setShowCustPickup(false);setCustPUFrom("");setCustPUAddr("");setCustPUNote("");}} disabled={!custPUFrom.trim()} style={{display:"block",width:"100%",background:custPUFrom.trim()?"#2563eb":"#e7e5e4",color:custPUFrom.trim()?"#fff":"#a8a29e",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:600,cursor:custPUFrom.trim()?"pointer":"default"}}>{"Add Pickup \u2192 "+selCust}</button>
</div>}

</div>}

{/* ═══ QUOTE BUILDER ═══ */}
{view==="add"&&quoteMode&&<QuoteBuilder customerName={quoteMode.name} pickupOptions={quoteMode.pickups} onAdd={addDel} onBack={()=>setQuoteMode(null)} drivers={drivers} drvEntries={drvEntries}/>}
</div>

{/* ═══ 2-WAY MESSAGING PANEL ═══ */}
{showMsgPanel&&<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column"}}>
<div onClick={()=>setShowMsgPanel(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
<div style={{position:"relative",marginTop:"auto",background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column",zIndex:1,minHeight:400}}>
{/* Header */}
<div style={{padding:"14px 20px 10px",borderBottom:"1px solid #e7e5e4",flexShrink:0}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{fontSize:16,fontWeight:700,color:BRAND.main}}>{"💬"} Messages</div>
<button onClick={()=>setShowMsgPanel(false)} style={{background:"#f5f5f4",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:14,color:"#78716c"}}>{"✕"}</button>
</div>
{/* Channel tabs */}
<div style={{display:"flex",gap:4,overflowX:"auto"}}>
<button onClick={()=>{setMsgChannel(null);markMsgsRead(null);}} style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:msgChannel===null?BRAND.main:"#f5f5f4",color:msgChannel===null?"#fff":"#57534e",flexShrink:0,position:"relative"}}>{"📢"} All Drivers{getUnreadCount(null)>0&&<span style={{background:"#dc2626",color:"#fff",fontSize:8,padding:"1px 4px",borderRadius:6,marginLeft:4}}>{getUnreadCount(null)}</span>}</button>
{drivers.map((d,di)=>{const unread=getUnreadCount(d.id);return(
<button key={d.id} onClick={()=>{setMsgChannel(d.id);markMsgsRead(d.id);}} style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:msgChannel===d.id?DCOL[di]:"#f5f5f4",color:msgChannel===d.id?"#fff":"#57534e",flexShrink:0,position:"relative"}}>{d.name.split(" ")[0]}{unread>0&&<span style={{background:"#dc2626",color:"#fff",fontSize:8,padding:"1px 4px",borderRadius:6,marginLeft:4}}>{unread}</span>}</button>
);})}
</div>
</div>

{/* Messages */}
<div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:6}}>
{getMessages(msgChannel).length===0&&<div style={{textAlign:"center",padding:"40px 16px",color:"#a8a29e"}}>
<div style={{fontSize:28,marginBottom:8}}>{"💬"}</div>
<p style={{fontSize:13,margin:0}}>{msgChannel===null?"Group channel — all drivers see these messages":"Private chat with "+(drivers.find(d=>d.id===msgChannel)?.name||"driver")}</p>
</div>}
{getMessages(msgChannel).map(msg=>{const isMe=msg.from==="dispatch";return(
<div key={msg.id} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start"}}>
<div style={{maxWidth:"80%"}}>
{!isMe&&<div style={{fontSize:10,fontWeight:600,color:"#78716c",marginBottom:2}}>{msg.fromName}</div>}
<div style={{padding:"10px 14px",borderRadius:isMe?"14px 14px 4px 14px":"14px 14px 14px 4px",background:isMe?BRAND.main:"#f5f5f4",color:isMe?"#fff":"#1c1917",fontSize:13,lineHeight:1.5}}>
{msg.text}
</div>
<div style={{fontSize:9,color:"#a8a29e",marginTop:2,textAlign:isMe?"right":"left"}}>{msg.time}</div>
</div>
</div>);})}
</div>

{/* Input */}
<div style={{padding:"8px 16px 20px",borderTop:"1px solid #e7e5e4",display:"flex",gap:8,flexShrink:0}}>
<input value={msgInput} onChange={e=>setMsgInput(e.target.value)}
onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg(msgChannel);}}}
placeholder={msgChannel===null?"Message all drivers...":"Message "+(drivers.find(d=>d.id===msgChannel)?.name||"driver")+"..."}
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:12,padding:"12px 16px",fontSize:14,outline:"none",background:"#fafaf9",fontFamily:"inherit"}}/>
<button onClick={()=>sendMsg(msgChannel)} disabled={!msgInput.trim()}
style={{background:msgInput.trim()?BRAND.main:"#e7e5e4",color:msgInput.trim()?"#fff":"#a8a29e",border:"none",borderRadius:12,padding:"12px 16px",cursor:msgInput.trim()?"pointer":"default",fontSize:14,fontWeight:700,flexShrink:0}}>
{"\u2191"}
</button>
</div>
</div>
</div>}

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
const[log,setLog]=useState(()=>lsGet(LS_LOG,{}));
const[toast,setToast]=useState(null);
const[pinEntry,setPinEntry]=useState("");
const[authenticated,setAuthenticated]=useState(false);
const getPin=(phone)=>{const digits=(phone||"").replace(/\D/g,"");return digits.length>=4?digits.slice(-4):"0000";};
const[sigStop,setSigStop]=useState(null);
const[shipPlanInputs,setShipPlanInputs]=useState({});
const[allDrivers,setAllDrivers]=useState(()=>lsGet(LS_DRIVERS,DEFAULT_DRIVERS));
const[driverNotifs,setDriverNotifs]=useState([]);
const[showDriverMsg,setShowDriverMsg]=useState(false);
const[driverMsgInput,setDriverMsgInput]=useState("");
const[driverMessages,setDriverMessages]=useState([]); /* private messages */
const[groupMessages,setGroupMessages]=useState([]); /* group channel */
const[driverMsgTab,setDriverMsgTab]=useState("private"); /* private | group */

const wd=getWeekDates(wo);const dk=`${wo}-${sd}`;const dl=log[dk]||[];
const showToast=useCallback(m=>{setToast(m);setTimeout(()=>setToast(null),2000);},[]);

/* Resolve driver from slug — checks live drivers first so any driver name works */
const driverId=resolveDriverSlug(driverSlug,allDrivers);
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

/* Save driver status updates back to Firestore AND localStorage */
const saveDriverLog=useCallback((newLog)=>{
  lsSet(LS_LOG,newLog);
  const entries2=newLog[dk]||[];
  saveManifestDay(wo,sd,entries2).catch(e=>console.error("Driver save:",e));
},[dk,wo,sd]);

const updateStatus=(eid,status)=>{const now=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,status,arrivedAt:status==="arrived"?now:e.arrivedAt,departedAt:status==="departed"?now:e.departedAt}:e)};saveDriverLog(n);return n;});};
const addPhoto=(eid,dataUrl)=>setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),dataUrl]}:e)};saveDriverLog(n);return n;});
const addSignature=(eid,sig)=>setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,signature:sig}:e)};saveDriverLog(n);return n;});
const setShipPlanD=(eid,num)=>setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,shipPlan:num}:e)};saveDriverLog(n);return n;});
const setEtaD=(eid,mins,dest)=>setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,eta:mins,etaDest:dest||null}:e)};saveDriverLog(n);return n;});

const sendDriverMsg=()=>{
if(!driverMsgInput.trim()||!driver)return;
const now=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
const msg={id:Date.now()+Math.random(),from:"driver-"+driverId,fromName:driver.name,text:driverMsgInput.trim(),time:now,read:false};
if(driverMsgTab==="private")setDriverMessages(p=>[...p,msg]);
else setGroupMessages(p=>[...p,msg]);
setDriverMsgInput("");
/* In production, save to Firestore for dispatch to see in real-time */
};

if(!driver){
return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:BRAND.dark,color:"#fff",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:40}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<h1 style={{fontSize:24,fontWeight:800,margin:"0 0 8px"}}><img src={LOGO_WHITE} alt="Davis Delivery" style={{height:36,objectFit:"contain"}}/></h1>
<p style={{color:"#a8a29e",fontSize:14,margin:0}}>Driver not found</p>
<p style={{color:"#78716c",fontSize:12,marginTop:12}}>Check your link or contact dispatch</p>
</div>
);
}

/* PIN screen — simple gate before showing route */
if(!authenticated){
return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:BRAND.dark,color:"#fff",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<div style={{textAlign:"center",width:"100%",maxWidth:320}}>
<h1 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}><img src={LOGO_WHITE} alt="Davis Delivery" style={{height:32,objectFit:"contain"}}/></h1>
<p style={{color:BRAND.light,fontSize:11,letterSpacing:"0.08em",margin:"0 0 32px"}}>DRIVER ACCESS</p>
<div style={{width:56,height:56,borderRadius:16,background:BRAND.main,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,color:"#16a34a"}}>{driver.name.charAt(0)}</div>
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

<div style={{background:BRAND.dark,color:"#fff",padding:"16px 20px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<h1 style={{margin:0}}><img src={LOGO_WHITE} alt="Davis Delivery" style={{height:26,objectFit:"contain"}}/></h1>
<p style={{margin:"2px 0 0",fontSize:11,color:"#93c5fd",letterSpacing:"0.08em"}}>DRIVER MANIFEST</p>
</div>
<button onClick={()=>{setAuthenticated(false);setPinEntry("");}} style={{background:"#292524",border:"1px solid #44403c",color:"#a8a29e",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11}}>Lock</button>
<button onClick={()=>setShowDriverMsg(true)} style={{background:BRAND.main,border:"none",color:"#fff",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>{"💬"}</button>
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
{driverNotifs.filter(n=>!n.read).slice(0,5).map(n=>{
const isRouteChange=n.type==="route_change"||n.message?.includes("ROUTE CHANGED");
return(
<div key={n.id} style={{background:isRouteChange?"#fef2f2":"#fef3c7",border:isRouteChange?"2px solid #dc2626":"1px solid #fde68a",borderRadius:10,padding:"10px 14px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,animation:isRouteChange?"routeAlert 0.5s ease":"none"}}>
<div style={{flex:1}}>
<div style={{fontSize:12,fontWeight:700,color:isRouteChange?"#dc2626":"#92400e"}}>{isRouteChange?"🔄 Route Changed":"📢 Dispatch"}</div>
<div style={{fontSize:12,color:"#1c1917",whiteSpace:"pre-wrap",marginTop:2}}>{n.message}</div>
<div style={{fontSize:10,color:"#a8a29e",marginTop:4}}>{n.time}</div>
</div>
<button onClick={()=>markNotificationRead(n.id)} style={{background:isRouteChange?"#dc2626":"#f59e0b",color:"#fff",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,flexShrink:0}}>Got it</button>
</div>);})}
</div>}

{total===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"#a8a29e"}}><div style={{fontSize:48,marginBottom:12}}>🚚</div><p style={{fontSize:16,fontWeight:600,margin:"0 0 4px"}}>No stops yet</p><p style={{fontSize:13,margin:0}}>Dispatch hasn't loaded your manifest yet.<br/>Pull down to refresh.</p></div>}

<div style={{padding:"0 16px 100px"}}>
{/* Leaving warehouse ETA */}
{entries.length>0&&!entries.some(e=>e.status==="arrived"||e.status==="departed")&&(
<div style={{background:"#fff",border:"2px solid "+BRAND.main,borderRadius:14,padding:"14px 16px",marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
<span style={{fontSize:18}}>{"🏠"}</span>
<div>
<div style={{fontSize:14,fontWeight:700,color:BRAND.main}}>Leaving Warehouse</div>
<div style={{fontSize:11,color:"#78716c"}}>ETA to first stop: {entries[0].stop}</div>
</div>
</div>
<div style={{display:"flex",gap:6,alignItems:"center"}}>
<input placeholder="mins" type="number" defaultValue={entries[0].eta||""} style={{width:70,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}
onBlur={e=>{if(e.target.value)setEtaD(entries[0].id,e.target.value,entries[0].stop);}}/>
<span style={{fontSize:12,color:"#78716c"}}>min to</span>
<span style={{fontSize:12,fontWeight:700,color:BRAND.main,flex:1}}>{entries[0].stop}</span>
</div>
{entries[0].eta&&entries[0].etaDest&&<div style={{marginTop:6,fontSize:11,color:BRAND.main,fontWeight:600}}>{"🚚"} ETA: {entries[0].eta} min → {entries[0].etaDest}</div>}
</div>
)}
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
{entry.dueBy&&<span style={{fontSize:9,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700,display:"inline-flex",alignItems:"center",gap:2}}>{"\u23F0"} {entry.dueBy}</span>}
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
style={{display:"inline-flex",alignItems:"center",gap:6,background:BRAND.main,color:"#fff",border:"none",borderRadius:10,padding:"10px 16px",cursor:"pointer",fontSize:13,fontWeight:600,marginTop:8,textDecoration:"none",width:"100%",justifyContent:"center"}}>
🧭 Get Directions
</a>}
{entry.arrivedAt&&<div style={{fontSize:10,color:"#16a34a",marginTop:6}}>Arrived: {entry.arrivedAt}</div>}
{entry.departedAt&&<div style={{fontSize:10,color:"#16a34a"}}>Departed: {entry.departedAt}</div>}
{entry.eta&&<div style={{fontSize:10,color:"#2563eb"}}>ETA: {entry.eta} min{entry.etaDest?" → "+entry.etaDest:""}</div>}
<div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
{!arrived&&<button onClick={()=>{updateStatus(entry.id,"arrived");showToast("Arrived ✓");}} style={{flex:1,background:"#f59e0b",color:"#fff",border:"none",borderRadius:10,padding:"10px",cursor:"pointer",fontSize:13,fontWeight:600}}>Arrived</button>}
{arrived&&!departed&&<button onClick={()=>{if(!canDepart)return;updateStatus(entry.id,"departed");showToast("Departed ✓");}} style={{flex:1,background:canDepart?"#16a34a":"#a8a29e",color:"#fff",border:"none",borderRadius:10,padding:"10px",cursor:canDepart?"pointer":"not-allowed",fontSize:13,fontWeight:600}}>{canDepart?"Departed":"Enter Ship Plan # First"}</button>}
{arrived&&(
<div style={{width:"100%",marginTop:4}}>
<div style={{display:"flex",gap:6,marginBottom:4}}>
<select defaultValue={entry.etaDest||""} onChange={e=>{const dest=e.target.value;const curMins=entry.eta||"";if(dest&&curMins)setEtaD(entry.id,curMins,dest);}}
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:12,outline:"none",background:"#fff",color:entry.etaDest?"#1c1917":"#a8a29e"}}>
<option value="">ETA to where?</option>
{entries.filter((_,ei)=>ei>i&&_.status!=="departed").map(ne=><option key={ne.id} value={ne.stop}>{ne.stop}</option>)}
<option value="Davis Warehouse">{"🏠 Davis Warehouse"}</option>
</select>
<input placeholder="mins" type="number" defaultValue={entry.eta||""} style={{width:70,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}
onBlur={e=>{if(e.target.value){const select=e.target.parentElement.querySelector("select");const dest=select?select.value:"";setEtaD(entry.id,e.target.value,dest||entry.etaDest);}}}/>
</div>
<div style={{display:"flex",gap:6}}>
<label style={{display:"flex",alignItems:"center",gap:4,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#2563eb",flex:1,justifyContent:"center"}}>
{"📷"} Photo
<input type="file" accept="image/*" capture="environment" style={{display:"none"}}
onChange={e=>{if(e.target.files[0]){const r=new FileReader();r.onload=ev=>addPhoto(entry.id,ev.target.result);r.readAsDataURL(e.target.files[0]);}}}/>
</label>
<button onClick={()=>setSigStop(entry.id)} style={{background:"#f3e8f9",border:"1px solid #d8b4fe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#7c3aed",flex:1}}>{"✍"} Sign</button>
</div>
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
{/* Driver Messaging Panel */}
{showDriverMsg&&<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column"}}>
<div onClick={()=>setShowDriverMsg(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
<div style={{position:"relative",marginTop:"auto",background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column",zIndex:1,minHeight:360}}>
{/* Header */}
<div style={{padding:"14px 20px 10px",borderBottom:"1px solid #e7e5e4",flexShrink:0}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{fontSize:16,fontWeight:700,color:BRAND.main}}>{"💬"} Messages</div>
<button onClick={()=>setShowDriverMsg(false)} style={{background:"#f5f5f4",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:14,color:"#78716c"}}>{"✕"}</button>
</div>
<div style={{display:"flex",gap:4}}>
<button onClick={()=>setDriverMsgTab("private")} style={{flex:1,padding:"6px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:driverMsgTab==="private"?BRAND.main:"#f5f5f4",color:driverMsgTab==="private"?"#fff":"#57534e"}}>Dispatch</button>
<button onClick={()=>setDriverMsgTab("group")} style={{flex:1,padding:"6px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:driverMsgTab==="group"?"#f59e0b":"#f5f5f4",color:driverMsgTab==="group"?"#fff":"#57534e"}}>{"📢"} All Drivers</button>
</div>
</div>
{/* Messages */}
<div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:6}}>
{(driverMsgTab==="private"?driverMessages:groupMessages).length===0&&<div style={{textAlign:"center",padding:"40px 16px",color:"#a8a29e"}}>
<div style={{fontSize:28,marginBottom:8}}>{"💬"}</div>
<p style={{fontSize:13,margin:0}}>{driverMsgTab==="private"?"Private chat with dispatch":"Group channel — all drivers and dispatch"}</p>
</div>}
{(driverMsgTab==="private"?driverMessages:groupMessages).map(msg=>{const isMe=msg.from==="driver-"+driverId;return(
<div key={msg.id} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start"}}>
<div style={{maxWidth:"80%"}}>
{!isMe&&<div style={{fontSize:10,fontWeight:600,color:"#78716c",marginBottom:2}}>{msg.fromName}</div>}
<div style={{padding:"10px 14px",borderRadius:isMe?"14px 14px 4px 14px":"14px 14px 14px 4px",background:isMe?BRAND.main:"#f5f5f4",color:isMe?"#fff":"#1c1917",fontSize:13,lineHeight:1.5}}>
{msg.text}
</div>
<div style={{fontSize:9,color:"#a8a29e",marginTop:2,textAlign:isMe?"right":"left"}}>{msg.time}</div>
</div>
</div>);})}
</div>
{/* Input */}
<div style={{padding:"8px 16px 20px",borderTop:"1px solid #e7e5e4",display:"flex",gap:8,flexShrink:0}}>
<input value={driverMsgInput} onChange={e=>setDriverMsgInput(e.target.value)}
onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendDriverMsg();}}}
placeholder={driverMsgTab==="private"?"Message dispatch...":"Message all drivers..."}
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:12,padding:"12px 16px",fontSize:14,outline:"none",background:"#fafaf9",fontFamily:"inherit"}}/>
<button onClick={sendDriverMsg} disabled={!driverMsgInput.trim()}
style={{background:driverMsgInput.trim()?BRAND.main:"#e7e5e4",color:driverMsgInput.trim()?"#fff":"#a8a29e",border:"none",borderRadius:12,padding:"12px 16px",cursor:driverMsgInput.trim()?"pointer":"default",fontSize:14,fontWeight:700,flexShrink:0}}>
{"\u2191"}
</button>
</div>
</div>
</div>}

<style>{`@keyframes slideDown{from{transform:translate(-50%,-20px);opacity:0}to{transform:translate(-50%,0);opacity:1}}@keyframes routeAlert{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(220,38,38,0.4)}50%{transform:scale(1.02);box-shadow:0 0 0 8px rgba(220,38,38,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(220,38,38,0)}}button:active{transform:scale(0.97)}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}`}</style>
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
