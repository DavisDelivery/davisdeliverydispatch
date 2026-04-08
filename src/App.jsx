
const _s={
label:{fontSize:11,fontWeight:600,color:"#57534e",display:"block",marginBottom:4},
labelSm:{fontSize:9,fontWeight:600,color:"#57534e",display:"block",marginBottom:2},
labelBlue:{fontSize:9,fontWeight:600,color:"#2563eb",display:"block",marginBottom:2},
labelGray:{fontSize:9,fontWeight:600,color:"#78716c",display:"block",marginBottom:2},
flexBtwMb16:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},
flexBtwMb8:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8},
flexBtwMb10:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10},
flexBtw:{display:"flex",justifyContent:"space-between",alignItems:"center"},
flexC8:{display:"flex",alignItems:"center",gap:8},
tagGreen:{fontSize:8,background:"#16a34a",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700},
tagAmber:{fontSize:8,background:"#f59e0b",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700},
tagBlue:{fontSize:8,background:"#2563eb",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700},
tag9Amber:{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700},
tag9Green:{fontSize:9,background:"#16a34a",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700},
sub:{fontSize:10,color:"#78716c"},
sub11:{fontSize:11,color:"#78716c"},
bold14:{fontSize:14,fontWeight:700},
loadTitle:{fontSize:12,fontWeight:700,color:"#d97706",textTransform:"uppercase",marginBottom:8},
loadWeight:{fontSize:14,fontWeight:700,color:"#d97706",fontVariantNumeric:"tabular-nums"},
splitInput:{width:"100%",border:"2px solid #2563eb",borderRadius:6,padding:"5px 8px",fontSize:13,fontWeight:700,outline:"none",textAlign:"center",background:"#eff6ff"},
splitTotal:{width:"100%",border:"1px solid #bfdbfe",borderRadius:6,padding:"5px 8px",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"},
splitT2:{border:"1px solid #e7e5e4",borderRadius:6,padding:"5px 8px",fontSize:13,fontWeight:700,textAlign:"center",background:"#f5f5f4",color:"#57534e"},
f1:{flex:1},
f1m:{flex:1,minWidth:0},
iconBtn:{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#78716c"},
delBtn:{marginLeft:"auto",background:"none",border:"none",color:"#dc2626",fontSize:10,cursor:"pointer",padding:"0 2px"},
flexG6Mb6:{display:"flex",gap:6,marginBottom:6,alignItems:"center"},
flexG6:{display:"flex",gap:6},
flexG4W:{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"},
flexG4Mt4:{display:"flex",gap:4,marginTop:4,flexWrap:"wrap",alignItems:"center"},
flexG3Mt4:{display:"flex",gap:3,marginTop:4,flexWrap:"wrap",alignItems:"center"},
flexC4Mb2W:{display:"flex",alignItems:"center",gap:4,marginBottom:2,flexWrap:"wrap"},
slider:{width:"100%",accentColor:"#2563eb",marginBottom:6},
splitTitle:{fontSize:12,fontWeight:700,color:"#1e40af",marginBottom:8},
loadBadge:{fontSize:8,color:"#2563eb",fontWeight:700,padding:"2px 4px"},
menuItem:{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:12,cursor:"pointer"},
menuBtn:{display:"flex",alignItems:"center",gap:8,width:"100%",textAlign:"left",background:"none",border:"none",padding:"10px",cursor:"pointer",borderRadius:8,fontSize:12,fontWeight:600,color:"#1c1917"},
flexC10:{display:"flex",alignItems:"center",gap:10},
flexC4:{display:"flex",alignItems:"center",gap:4},
flexBtwP4:{display:"flex",justifyContent:"space-between",padding:"4px 0"},
flexBtwMb12:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12},
emptyState:{textAlign:"center",padding:"48px 20px",color:"#a8a29e"},
emptyState2:{textAlign:"center",padding:"60px 20px",color:"#a8a29e"},
truncate:{fontSize:12,color:"#57534e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},
input12:{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,outline:"none"},
inputFull12:{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,outline:"none"},
inputFull13:{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none"},
splitBtn:{flex:1,background:"#2563eb",color:"#fff",border:"none",borderRadius:6,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer"},
cancelBtn:{background:"#e7e5e4",border:"none",borderRadius:6,padding:"8px 12px",fontSize:11,cursor:"pointer",color:"#57534e"},
cancelBtn2:{background:"#e7e5e4",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600},
greenBtn:{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700},
inputMb4:{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,outline:"none",marginBottom:4},
};
import { useState, useCallback, useEffect, useRef, Fragment } from "react";


const _fbCfg={apiKey:"AIzaSyDY2OceDzBWMHPR3C3O1oxktrCIy3mKMqU",authDomain:"glorybounddispatch.firebaseapp.com",projectId:"glorybounddispatch",storageBucket:"glorybounddispatch.firebasestorage.app",messagingSenderId:"114912216623",appId:"1:114912216623:web:a835cd6054d3e1707668da"};


(()=>{
  if(window._fbLoaded)return;
  const s=document.createElement("script");
  s.type="module";
  s.textContent=`
    import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import{getFirestore,doc,setDoc,getDoc,onSnapshot,collection,addDoc,updateDoc,deleteDoc,query,orderBy,enableIndexedDbPersistence}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
    import{getStorage,ref as storageRef,uploadBytes,getDownloadURL}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
    const app=initializeApp(${JSON.stringify(_fbCfg)});
    const db=getFirestore(app);
    const storage=getStorage(app);
    /* Enable offline persistence — data cached locally, syncs when online */
    enableIndexedDbPersistence(db).catch(e=>{console.warn("[FB] Offline persistence failed:",e.code);});
    console.log("[FB] SDK loaded, creating ops...");

    /* Every operation is a closure that calls the SDK directly */
    window._fbOps={
      /* Write a document (set/overwrite) */
      write:async(path,data)=>{
        const ref=doc(db,...path.split("/"));
        await setDoc(ref,data);
      },
      /* Read a document once */
      read:async(path)=>{
        const ref=doc(db,...path.split("/"));
        const snap=await getDoc(ref);
        return snap.exists()?snap.data():null;
      },
      /* Add a document to a collection (auto-ID) */
      add:async(path,data)=>{
        const col=collection(db,...path.split("/"));
        await addDoc(col,data);
      },
      /* Update fields on a document */
      update:async(path,data)=>{
        const ref=doc(db,...path.split("/"));
        await updateDoc(ref,data);
      },
      /* Delete a document */
      remove:async(path)=>{
        const ref=doc(db,...path.split("/"));
        await deleteDoc(ref);
      },
      /* Subscribe to a document */
      onDoc:(path,cb,errCb)=>{
        const ref=doc(db,...path.split("/"));
        return onSnapshot(ref,(snap)=>{
          cb(snap.exists()?snap.data():null,snap.exists());
        },errCb||(()=>{}));
      },
      /* Subscribe to a collection */
      onCol:(path,cb,errCb)=>{
        const col=collection(db,...path.split("/"));
        return onSnapshot(col,(snap)=>{
          const docs=snap.docs.map(d=>({id:d.id,...d.data()}));
          cb(docs);
        },errCb||(()=>{}));
      },
      /* Upload a file to Firebase Storage and return download URL */
      uploadFile:async(path,blob)=>{
        const ref=storageRef(storage,path);
        await uploadBytes(ref,blob);
        return await getDownloadURL(ref);
      }
    };
    window._fbLoaded=true;
    console.log("[FB] ✓ All ops ready");
  `;
  document.head.appendChild(s);
})();

const DAYNAMES_FB=["Mon","Tue","Wed","Thu","Fri"];

/* _whenFB(cb) — calls cb once Firebase ops are available */
const _whenFB=(cb)=>{
  if(window._fbLoaded&&window._fbOps){cb();return;}
  const id=setInterval(()=>{
    if(window._fbLoaded&&window._fbOps){clearInterval(id);cb();}
  },200);
  setTimeout(()=>clearInterval(id),15000);
};



const AUTO_BACKUP_KEY="dd_auto_backups";
const MAX_AUTO_BACKUPS=14; /* Keep last 14 snapshots */
const autoBackup=(label,data)=>{
  try{
    const backups=JSON.parse(localStorage.getItem(AUTO_BACKUP_KEY)||"[]");
    const snapshot={label,timestamp:Date.now(),date:new Date().toISOString(),data};
    backups.push(snapshot);
    /* Keep only last N backups */
    while(backups.length>MAX_AUTO_BACKUPS)backups.shift();
    localStorage.setItem(AUTO_BACKUP_KEY,JSON.stringify(backups));
  }catch(e){console.warn("[BACKUP] localStorage full or error:",e);}
};
const getAutoBackups=()=>{
  try{return JSON.parse(localStorage.getItem(AUTO_BACKUP_KEY)||"[]");}
  catch(e){return[];}
};

const saveManifestDay=async(wo,sd,entries)=>{
  const fbKey=getFbKey(wo,sd);
  if(!window._fbOps){
    console.error("[SAVE] ABORT: window._fbOps not available");
    throw new Error("Firebase not loaded — _fbOps missing");
  }
  
  if((!entries||entries.length===0)){
    /* Check if Firebase currently has data for this key */
    try{
      const existing=await window._fbOps.read("manifests/"+fbKey);
      if(existing&&existing.entries&&existing.entries.length>0){
        console.warn("[SAVE] BLOCKED: Refusing to overwrite "+fbKey+" (has "+existing.entries.length+" entries) with empty array");
        return; /* Silently refuse — don't throw, don't overwrite */
      }
    }catch(readErr){
      /* If we can't read, err on side of caution — don't write empty */
      console.warn("[SAVE] BLOCKED: Can't verify "+fbKey+", refusing empty write");
      return;
    }
  }
  try{
    const safe=entries.map(e=>{
      const copy={...e};
      /* Strip large binary data */
      copy.photos=(e.photos||[]).map((_,i)=>`photo_${e.id}_${i}`);
      copy.signature=e.signature?"signed":null;
      /* Remove undefined values (Firestore rejects them) */
      Object.keys(copy).forEach(k=>{if(copy[k]===undefined)delete copy[k];});
      return copy;
    });
    /* Auto-backup before writing */
    autoBackup("save-"+fbKey,{key:fbKey,entries:safe});
    console.log("[SAVE] Writing manifests/"+fbKey,"entries:",safe.length);
    await window._fbOps.write("manifests/"+fbKey,{entries:safe,updatedAt:Date.now()});
    console.log("[SAVE] ✓ OK manifests/"+fbKey);
  }catch(e){
    console.error("[SAVE] ✗ FAILED manifests/"+fbKey,e.code||"",e.message||e);
    throw e;
  }
};
const subscribeManifests=(wo,cb)=>{
  const unsubs=[];
  let cancelled=false;
  _whenFB(()=>{
    if(cancelled)return;
    for(let i=0;i<5;i++){
      const fbKey=getFbKey(wo,i);
      const dayAbbr=DAYNAMES_FB[i];
      unsubs.push(window._fbOps.onDoc("manifests/"+fbKey,(data,exists)=>{
        cb({[fbKey]:{entries:exists?(data.entries||[]):[],dayIdx:i}});
      },(err)=>{
        console.error("[SUB-ERR] manifests/"+fbKey,err.code||err.message);
      }));
    }
  });
  return()=>{cancelled=true;unsubs.forEach(u=>u());};
};


const saveDrivers=async(drivers)=>{
  if(!window._fbOps)return;
  await window._fbOps.write("config/drivers",{drivers,updatedAt:Date.now()});
};
const subscribeDrivers=(cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onDoc("config/drivers",(data)=>{
    if(data&&data.drivers?.length)cb(data.drivers,data.updatedAt||0);
  });});
  return()=>{if(unsub)unsub();};
};


const saveEmserHours=async(key,hours)=>{
  if(!window._fbOps)return;
  await window._fbOps.write("emserHours/"+key,{hours,updatedAt:Date.now()});
};
const subscribeEmserHours=(cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onCol("emserHours",(docs)=>{
    const data={};docs.forEach(d=>{data[d.id]=d.hours;});cb(data);
  });});
  return()=>{if(unsub)unsub();};
};


const saveEmserShifts=async(dayKey,shifts)=>{
  if(!window._fbOps)return;
  await window._fbOps.write("emserShifts/"+dayKey,{shifts,updatedAt:Date.now()});
};
const subscribeEmserShifts=(cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onCol("emserShifts",(docs)=>{
    const data={};docs.forEach(d=>{data[d.id]=d.shifts||[];});cb(data);
  });});
  return()=>{if(unsub)unsub();};
};


const saveDispatchNote=async(dayKey,note)=>{
  if(!window._fbOps)return;
  await window._fbOps.write("dispatchNotes/"+dayKey,{note,updatedAt:Date.now()});
};
const subscribeDispatchNotes=(cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onCol("dispatchNotes",(docs)=>{
    const data={};docs.forEach(d=>{data[d.id]=d.note||"";});cb(data);
  });});
  return()=>{if(unsub)unsub();};
};


const sendNotificationToDriver=async(driverId,msg,type)=>{
  if(!window._fbOps)return;
  await window._fbOps.add("notifications/"+String(driverId)+"/items",{msg,type,time:Date.now(),read:false});
};
const subscribeNotifications=(driverId,cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onCol("notifications/"+String(driverId)+"/items",(docs)=>{cb(docs);});});
  return()=>{if(unsub)unsub();};
};
const markNotificationRead=async(driverId,notifId)=>{
  if(!window._fbOps)return;
  await window._fbOps.update("notifications/"+String(driverId)+"/items/"+notifId,{read:true});
};


const saveQuoteToFB=async(quote)=>{
  if(!window._fbOps)return;
  await window._fbOps.write("quotes/"+String(quote.id),{...quote,updatedAt:Date.now()});
};
const deleteQuoteFromFB=async(quoteId)=>{
  if(!window._fbOps)return;
  await window._fbOps.remove("quotes/"+String(quoteId));
};
const subscribeQuotes=(cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onCol("quotes",(docs)=>{
    docs.sort((a,b)=>(b.num||0)-(a.num||0));cb(docs);
  });});
  return()=>{if(unsub)unsub();};
};


const saveMessage=async(channelKey,msg)=>{
  if(!window._fbOps)throw new Error("Firebase not loaded");

  await window._fbOps.add("messages/"+channelKey+"/items",{...msg,timestamp:Date.now()});

};
const subscribeMessages=(channelKey,cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onCol("messages/"+channelKey+"/items",(docs)=>{
    docs.sort((a,b)=>(a.timestamp||0)-(b.timestamp||0));cb(docs);
  },(err)=>{console.error("[MSG-SUB]",channelKey,err);});});
  return()=>{if(unsub)unsub();};
};
const markMessageRead=async(channelKey,msgId)=>{
  if(!window._fbOps)return;
  await window._fbOps.update("messages/"+channelKey+"/items/"+msgId,{read:true});
};


const saveDriverLocation=async(driverId,lat,lng)=>{
  if(!window._fbOps)return;
  await window._fbOps.write("driverLocations/"+String(driverId),{lat,lng,updatedAt:Date.now()});
};
const subscribeDriverLocations=(cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onCol("driverLocations",(docs)=>{
    const locs={};docs.forEach(d=>{locs[d.id]=d;});cb(locs);
  });});
  return()=>{if(unsub)unsub();};
};


const saveInvoice=async(invoice)=>{
  if(!window._fbOps)return;
  await window._fbOps.write("invoices/"+String(invoice.id),{...invoice,updatedAt:Date.now()});
};
const subscribeInvoices=(cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onCol("invoices",(docs)=>{
    docs.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));cb(docs);
  });});
  return()=>{if(unsub)unsub();};
};


const saveCustomStops=async(data)=>{
  if(!window._fbOps)return;
  await window._fbOps.write("config/customStops",{data,updatedAt:Date.now()});
};
const subscribeCustomStops=(cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onDoc("config/customStops",(data)=>{
    if(data&&data.data)cb(data.data);
  });});
  return()=>{if(unsub)unsub();};
};


const saveStopOverrides=async(data)=>{
  if(!window._fbOps)return;
  await window._fbOps.write("config/stopOverrides",{data,updatedAt:Date.now()});
};
const subscribeStopOverrides=(cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onDoc("config/stopOverrides",(data)=>{
    if(data&&data.data)cb(data.data);
  });});
  return()=>{if(unsub)unsub();};
};


const saveHiddenStops=async(data)=>{
  if(!window._fbOps)return;
  await window._fbOps.write("config/hiddenStops",{data,updatedAt:Date.now()});
};
const subscribeHiddenStops=(cb)=>{
  let unsub;
  _whenFB(()=>{unsub=window._fbOps.onDoc("config/hiddenStops",(data)=>{
    if(data&&data.data)cb(data.data);
  });});
  return()=>{if(unsub)unsub();};
};


const calcRouteMiles=(entries)=>{
  const origin={lat:33.93,lng:-84.21};
  const pts=[origin];
  entries.forEach(e=>{const addr=e.addr||getAddr(e.stop);const c=getCoords(addr);if(c)pts.push(c);});
  let total=0;
  for(let i=1;i<pts.length;i++){
    const a=pts[i-1],b=pts[i];
    total+=Math.sqrt(Math.pow((a.lat-b.lat)*69,2)+Math.pow((a.lng-b.lng)*59,2));
  }
  return Math.round(total);
};
const requestPushPermission=async()=>null;const onPushMessage=()=>{};const saveDriverToken=async()=>{};

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

/* -- BRAND COLORS -- */
const BRAND={main:"#1e5b92",dark:"#134b7f",light:"#357bb7",pale:"#e8f0f8",bg:"#f0f5fa"};
const DISTANCE_BONUS_STOPS=["DCO Eatonton","DCO Athens"];
const APP_VERSION="3.11.24";
const LOGO_URI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAAAoCAYAAAAyhCJ1AAAxTElEQVR4nO28d5xUVRI/+q1z7r0dpieSEZAoCqIorGIcMIsYUHtWMaCL4q4LKsY19rQRxZxB17jL7k6vYRExoTAGdBVEUUZEchhg8nS+955z6v3RM4iK6+6+/X3e573Pq8+nP33nzr0nVNWpU/WtOk34fw0xEYgPmvH8VTmrZIADbVmW7QBgsNGu73sgJgiJ4qBjIqHAjuKgqdu3J312y9knbGYAiNZIJKIGIP5XPUWjNTKRqNITb391YosJn+pl08rAMMgW4aAjh5TTzDmXnfBttKZGJKqq9IIFCwIPfJyZ1epbQe37XjDgBMkOiVLKfPlm9ekPMZh21yczExHxVY+/1P3zbXRne0b5QgqyHMeWjk09RGbuyzefufDU2/4ytlWXTvZzrm9IUyBUZku/beWi28+cBWYC7WybAPBlD80f9VUbX9yeMeM8Tf09bWwhCI5ttYcss6qkyFq8T7fA3x+9+KhlpoO31v9WWP8nqZoAcFoFz884PfdjPwU2AkSF2QvJYCPATGjLCUgXEOyibpvXclj1G4sGlPMjf7p8fC0D+BHzfkKJxEpmrpGjrlW3t8jwMCgJCAGjDSwZgW7ekQRwWcPKboRojTzxxBO9W99/ZViz6Hk0kIZxCdoLopRz+dtrFsy9sYoaO4W+az9jqxdLAGrFDnPWZt1zioscLCb4eYkipTCoXDwJAI1pGtFglV+g/DQgAHglCOfalxIwi6tBYAaqq4mrq3Fc7NU739mEK3IcCiqtYFiDyAI0QEaWkbLG7PAxZktLdsbBN70+b3hFNv70lbTyv1cEZopVV1N811vV1UwEFESDf7nq/lsiy0oZldcwnmZAFnphaHReFT4+EYFJZEWgIpkLntGS98448uZ5f7xrRH76oUS5n1OGaE2NTFRV6bPum3d0WoSG6WyrT4JEwR4xu2lFbQ6fteCTT24aP2ZMctTU2TYR6bPvfWVWc0NqXM73tAAEOK9zweLg+3VtpwOY3Sn0XfuqjY/VliC05DA5q/Jaak9rDZAVlCWUWvSnP5zxaeFJkTN+XhvjKjJEEHnJTMmdg69KCJGI66P0fk9vUt2n5Nx2tkReSxgigmFQYcGQBoxPSjHaDQWSJhxN5vTEC+6ae7z4T2QQi8UKSw4gEHE8HjfY5VPQeOqUBSEalaiMWZWVMSsWi/0nfe1+AAAEjCDSUoCkAElASMNCapaWYmEpJkszWWBAEBuBPMNt16mcrzf7ZVMu/9x6a3ZNTSmqq6ljLj+gRKLQz+Zm9xLXWCACEZMUBpJAFthHTkS6PfZO/cRdhzb3Kn9REac2kLRtIkNSQPpMaHXFZElAbXyx2bWfaE2NBIjPfegfB2ZMaCT5OSGgHQOWQYtk9wjN2fmCVoSC0ksCJIyWjuSgAIBtcyQSVfrMu18Zv1WVTsllkr4tNUgYqSEE2RHLCkQs6UQsFiFLayFhGBa0NlopIl7bq7v11b9nEaI1EokqHY/HGfE4JIApM2tK23OZcstvdb/b2C79YCC4T/9+vh0pan/uitPSkkiZREIDQC2A2loAiAlwNf8rs/yL1LEVgAwYEmBCSCrfkUYZw6QBNoaDximWniawlzOWhJRk4OeSXmOwyxHPLWt8Qd4TP1WjWmAXyxWLxUQ8XqWvffaN/q+v9E/WXo6lEJIYYIAZIIsIngJ2pHCxIDy/rFe9rowtkkTjvHE3Jf6UFM4tft4zgmCx8jhJzsFT7n1lxJyrJn4Vi7GIx8kAQMPKbgQA63aY81wqEZKSCiwkS1uGdGrH5MPK33g9FhOIx40QABPAxAABDAYRJAHAt3sxAVjXYn6XVZItoQlEpNniiO3proG2uZbEamZRnvfNge2Mg3NUEs7lcqYsqOWwCn/aXVOqGv+lInQ4TQaJKs3M4pLbHx4glc0fbczP+XRdwxDP9bg1o/cMW8FMkaJv6tZt7Z7zTNv+k++hEZNnpqUUTQS5xQ5Y35RGgh+9NeuSz0HxDobHzb/q+2f1oMMp6BCOsgMBa0gkf/OEvXv8aYuXs1ixam1NluzIpg/YnrUuaBShY/Oey5bQJIkcnU/7TYGyU06OJ6pevYVqKmMxqzYeVwCwGGMFEDfLNvuTs1ZpkPy0MmCLCGAIkmQAZqm8LKds+9Df3P/KyKdnTPwiPbW3BICRPZ0Xt2/I/sGFsAmGBbT2RMT6prnpXADXLcZiAcAATLVxUkuXLg3/5i+bor5xIYgEG9K2FbBK7Mxfq8aNS+85+dngRiAvpYQ0gOrwOUkAmkkxANSOU2b1gsDwJ7L7s/GIAGEMKTsQsvqX+je9ddPpd3dqugQw47kFg5auS0/bIZwrytEyN3H9pIWVsZi1e0WIxQTq6iiRqNIWgDHTHj574OTHbwpBiZ7F/mv1btHR5VC57hHnrW6l8qF0NnNcz5Lgl5dMmnjrXU/PjZQErPKsJ7ooQm9f6/5KmWEtqfzpo6benxzWq2h6PH7Jpk7P/D9WBEEdykAAA0QCGddv+l3VoVt3eWwrgG8swtwJd8y78pu2wH05n4yAFgJKZH2HN7bL65g5QVTdoZBMtXHo9esXBU+fnb7A8z0IsNBMsKFNRVjnmnJ2WMCQAOu8iFjfNrVdCODyZb32YsRi4qFpp6751fWvLk5xyTHazxCMlkwekpZ1Jq9ecAvtNc4DQNEaiEQVzG1vbj46J4v3IOVpEElNRGGTNgO7W898COCg/kVmIwCtUVAAYjALAASt4XUK+LHVoXIh/HJoDRCRASAEISKtbYVnaiSikBrAvReMXwtgxnl3Pl0jLLl+CZjGotr8SBGYUFktEY8rAnDMdc8ctbmh/d7t7f4BGV+AJX2czKkK47m6IePaTUn7tFLbGzi01P1tOm+Omf2nv9zy8ZPX/AFAw48FKAAccPF9l3y1sfGdU657/KzE3VXL/xvLwIVRFpSBGWwMmMmOxWKiDsOtYVi5c3XXLl6MV2845f5Drnphny1++UUsWUNYkrXPKciRv334H/sA8bpYLCYWY7GojY9TVybmn5yhkv5QaQ02gkUQIeGv/1UfumvhBvG062qWYKncPFoVn/Xqq6/edNpp41LRWI2DaI1WpXgqn6HjsmlkhcWBlO9RPlg88MzXc0cBeCNaUyMTiQQI4O0ZvtBjyYIYBNIiEBQR2f7xn2ecvgKxmGhAtw7e6A4nWHTui9jVv5l4QHHyycXJFEhEmA0LYpn38vxNG8865Y7XAocPodeur5qw/ftVVyNfvKHq48L1hYjHwTsduGi04LygNq7GX/vUPvtOfey1La3Zlx1bfHn8PsVDAyb9bsgii1kEDZG0JYGMp1o9Z7+vWgLvBO3iF22jP5x09T0Xj5lxX2hM9L7Q4OkPBfacHAvuOTkWNNGYs+ypq2YHbZq6YXvybydcO6dPPB5n/IdOJFkSIAljCkoAGAgiisfjpgHdTDweN/F43NTGx6lo9+GMWEwMDbXco3es9ts3rxe5xnroXFprq1hsbMeYnUqDxUYC2NriTsv5mgkMzdCWJVEe8N965rJT/xihXD1ZDhEJQ1Bu1irp/shyPg+IiUS8ykskqvR+PUrnH9E7e/gBkW03om1zPtewwbQ3N/H6DU2TCEBiYatAokpfP/ulXklfHqt9jwAWmhm2JOoW5uc0A5UY+z1fpARoFzYxwzAXnJups+0+e4zOhslbKqTDABsCkTCK2l2re12yaM7zn+Gb0dfPe+e4+Pw/XPLEwoOYo98vvg7+W52rMpGo0ufc/mKvdVvbrtnWkjlKWtZbRw6ouOSx6ybVrwDQ+4w7bMOmTTPCbBiupwWEEJI85GEXbWxomv/dX27ed/2bT1UMPvHinPcz7uAnT91YO/Ki+2/Y3tD8R0F0vOnQ8X+XdCYJBIshLAvQGkRAPu/mC/9d/INnO7YeepZ53aBJs9anPezltjZqbmuCSrWgtQJDAWBrywqJR+JqxnPv77egLnW4cdMgQBgIjpCHvmXWX5dooCLINUkveIXKs7QdRwoL8JR/GCH++PhrHhzS09Ej+xSteXf+2+v9bW7Rre05hG0Cp9LttCPIE+545PkuN0yf3AIAS+ox0ZXFEeHlFBFLQ5YMqPaW8fvSK28AWFw9VneEnJDCBhkJgMEdMVmnzzwKo7AMwIAK6/5kq3dyuyfIElozsRRGcS6njEtWWUrbxzQacczmdTmMvmHBF+Pj85597MjmOQPGXZiPxWLCisfjZsyMGaEeVv9ztja0niKkqD1l772OjF8+PvkFAJzwUCB2cIv/dJ0gScgns64fkEGUlAXcooBoDllYT6y2uZ6tD/7to48d/WLS7Vt1V6i8OExKczLj+q1FDmUB01hUUtxYFg61HHPwngvnvv7Z+QdMvnXysvjNz3dGJb+kBAQgvW0DUiIJJxCA6TBo0t/u70YPdpIjSQ89775WygmQkGBoqFwSyWYvBAD+ihYiAP/8ZtNvs36FINaKyCIpAyJk2pf/9VqzZO9sTGwrCTzT2pC8QjlY071Yv9av1Pvn5rU79tj/wnvezKb8tlyperwUpe19e3V36je4xVKwgYCQzDrPwbIFXzScAuA5ZhYHXf+PydoAJIk0S20HQlYZZRLTTz+zGZUxi4hUZWxRp/oXpA9ZMAys4WfaGQCW9Rqlo9EaWXP9xMXH3lJz9SaU3JvyA4B2GQQtBYiMb1j57PlgD5BJKzCy1RQ9dOabZsrvH3k9Gp9+0mrrpoceP2BrkzmiPcdNkyfuW3XhuHH5jwCgMmZhcbVGVULdGr/c9DrzDg6FAiCICqUlQjaQc7Phbc25g0g4AQBQWYNiqTYEBDUmMzlSihkWwllPlHi+yxnXlDTJDNZtbTJpI8Ok4BDwPCcSv6QDO4lJQnku/FQbDAO2HQAsl4BCmLrbdxhQ2hCDADaFOFBIOI5kANhYC+++p2oqHnhz9dlJdzNbkqBYKumEAz2LMy8QfQYgYQB8FXsmcdi2zS3ln3zTdMR3eZ5lSc73rrBvqp19fY1hxlyALIEPB0Zv+zSjwwdBe5pg4CqD7Rl/CgHPnnbNY/s3NYdGeyLP0hbCsOSQzvGe/eiPHwKIdh/Ou3JE+y6MyYPdDLSbQT6bRSBbX8CT49VIIK4Ri4m341X3/Xrmy3VrW3B9m6eOcEXQAiwwC5CALuz9BsbPmUyyTSeN2a9ty/o3L7vjwUOsslBRRo4IPRmvqvJevneXkLE2rkBxIFoDALBsm1JZt5mMGdCaYTR7XmhId7tZFtubepbYl/ftWdr8wcrmT0b0jETnPzh9KQAYFEIWIQDDwJp164N3vbQk0tpmumxqTe2byqoZT86ebV9yySU/QNx+QRV2ClJwIYrQP29LCGC8/9HHoar7a/saDQjDxB1huWPJbYXH4ualJTN/ndNOidGe8WFZUmir2N9ef9KoHk8vezahr3loTp+Pvmo789l/fDM+Z8SxgYCN4rC5bdIhPZ56e+mOKWff8mDJYLSk52/bJpfNmeN3Lw39sUXhIFcxE9gyvsupPB0ya/bsrs9/2HxSW8oTyt2uhCBicmRRKPf5nx6+aemfr4mJndHU4sUAgPZtG9GebYLv5QDlA04IQSF/ONN43GDqbPtvfzj9DYvwxsTrHhr13Q7vpIwnjnMN7a+tkojLAsbNsvE9YbycMEb5vhMeUPuNusW6eurk1cD3iZafhnQJMABLAmWRADU2JlkKCVsyBHvZbkXWqkWPX/M+AAw5664taxvT40w0tqJXDta2EJRet431slaDKDBgwIA8gDyAJgDfjrpo5uQXv8weCOCf/24EYbgA7XDHymZjoGn3mjAsGrPrEuRV//nBoz3j9IJyNRNLYwAJRWVB+3OgkPwZcObt03wqFsVOHpGgeq9XqfVY7eyL3zj3xn/sM+Kcu3774sL609Ic6mbbYXQPZt/89aHBizfsMF2fWty4OE9FA7E1v/zPT8fnjZo6GwAwfkS3l9a/t+nuPOwyYs0SMDntyPlfZK7NuuIorRlSCKGNYScAlBcF5hARozImUYsf8EH7Pow2YGaQEIUIQv+EVYQ5l/gAoDhmJWZevgzAMotw6+9ueajPii2Nh9Sn1aTmvDhNeWCymIQlLa19bs+YqOCOMOTnY/poRy8AweRcz2PNgGKG6ymjmCUAQmXMIiG+cTWPQSLubZsfzyIR97Bsjg8kNDpQxh+Q5s99T42trIxZ27b1lj/5/+7IdIyGAYYBiCDAEpUxC4CFyljhg5ioS8S9pUtnh9c2Zu7M+pqJuBBzCkEB8prGH1T+KQCcePn9pzmONahnMPPk0fsUDdmcuOnovj2KNw+dNPev737dvmxtGy5u08FuEZHdtk9p7oL1f4+d+PoX2fFvr8otb82agZl0Vte3ZC4RAC+bs9CgstK6cfrk5uKg9ZKwbDCgQZDa97Cmwb2qPccHsnJh2JABSYezrSeOKC/sBourd8OnjrDZGBjDBfPK3ytCNBqVAPj4395xxGFT7phEKABke1bGgurImPVI/PIttX+8PrG+5uaJe5SIu+2AQ2DSzCA2TFnfdLN+nBH7KXXsVgzje17OlrIYWgEMaANmQ0FmtiwiPzzlvsUtSXNj9LrHj2rOadnanpKel7MFc6C0rNTqUlbGzS0tTZFgwJXAjlZjr3Hz7mm1tXHVCUFHo8Pp55SyM4nBHYlkogK44pBIojausEtSxxZA1bUP/urs+1sebHSdEdCuAUiASdmOZVVETM2VF17YFo3WSLI3Np9yQHH/B66dtn3w5bOO7PvrO2cvrMsclcsDnqe5KMjUK4KXjxwYufLxO67ZeNiFt01Zk3JmpzIZbcPAQIqkJ46OXn3PoL/de+3aUUNn28tqa2nIHkXPtq7NTUkbIQQxhADasiw6WW4YWlq2VRHkefGrLm5BtEYWMkO7nz2zAXXAB9QZbEWHUyJRh01LloSOfHDRM2k/MHjk+XcffMqI4jvi11y6C54TlYoTulvYqq3P4DqAmDrSdIKAfzv7SGzYcYLCsv0wfAaTBEPnNrR4Rw44655vB55914amdrcs7Yruy+vdd8sjNkoj4Q22jHzrK3+15+stvlKl0hJFec8tsSwZ0HnV1VPU79jLH7syIK0F8++/ZFWH30j4uewlf3+bwEL5LlBcNHX0Bfcd6DMo7Njh9kw64vpmxLvfZA7OGgfQnpEEwcxGGSEiyCWPGNpl5teVMSuRiGqA3j/npseH7nXOzKeWbtQTsopgVN4HSbskRHpAsX/1srm3PvQ1A4hGZdcukWWrmzIegSwjSBCT8kTY+Xa7ey6AeOTbegaAebOmfzIkesfXGeHsC+MbAEISdtp9ZoigpTF4z8iclSjY3t27zRKEAqJaEB59v3c0rCRCQo1/dN+HW92iwb7v+eu0c9kfP2qt2v+cu/7Us2vw9aHdI9+ESxxVt+7w/b7anLvf84gJEB3pEwQdbP+3FUEIgaBtC18zExGM0ggEAiXaVYHmnBwghDWggPK5nPOkLvbQigA1FIfE9lAg3C5IbEll8i8tePyatZ1tLlq0yHryw+29Gnc0ntqcd6sP++2D0gkGErUP/q7m55yF70EHBgOCjcHWlDxe5HB84b4CcxBGe4DxIZA3JIxgQ1obQZEgiT1L+YInbv79ZgBYv6h/8NQ/zrz53a/brskoy2Y/bwjGl3YgUOb4G/brLc9//dFbPgCiMhYbxvE4+DXM+GLPM2/9IGeco0n7GmDh+wotGXPB+kXP3j1g3IXuqKlTLSLyf3XhrOdafete1/WNAITpVGSGJmnJiKW+fPXuyz6mey6jROKH1qAzCjLG71gAu9a3dHzXxtWoC26/dF2LfZH2cp4lyNF+XrdB9kxr++ptae/qFRu2pwjS1yQqsh6BWAHEZAwpYdlWSYhq/n1FgGHfd5PGmA6rZEAkIkQAsW9IcyEpRiSS6ZxsT1I3IaibI7F/JCDbu5YGsiUhmRlz8X1cbNI3vPvH2GvHjBunDLCZgUcdgUfPvnXOyO+2pKcdeP5t466dMHRa1cqVjF0cSALAbAp7AwPcwVQ2ShtPmZ1aQkyCCYUFxKw1mKUjI45vBpX6Fy95IfYKAESvfuSQox/b+kRT3tpf+QpS+JqEYGGFA92C2X+ePMQ644E7b9yKypiF2riKx4HKyphVWwvTp0v42fbtONpTPkiwIOPrlLL7n/3C9hMBvAKMAgCMPbD8L1ve3RF3wWGw4QKLCAywLQXKi+TTRMQd7f4geqrsUAYhRMe8C5sjs0Gnr8gAHcpEFnw/T5bD2teyUAlgtK9MhkgQrOLCw4oJzCAmNqSMDNhd7fzWwweVz/y34V0hhGlqa2s1molNQQB5T8FoQ8xCMCABFmACRJCsYBhkBZA3MtCcM91Xb3f7f7nVHbwjpfbq1q08t895d73df9K9nw06++5Ph547a9ngc2ct+eDrtquhvDqSVvdH39u0H+Jxs2sdAwNQGtBMMCBwgaFgsDTEtgFsBmzDsDTIUuRIlkErELBk97C3ZPQeZuySF255GgD2P6v697XfJWu3Z6z9lZdXQoANSyIRsLpaqflPRYcd88CdN22t7FCCzjHU1hacuat+NXhemNwGDUsaw8yskVfgHUl1kSBg2ZyFBtEaee/0i+ojtnkTMkgGQnOhUoQVpBXgXNuEEQPnAkDt7pzETpIShgvbgWHAmO9LKShaIz5+/sbHDu5tHdk7oj8KBG2ppC0VhDCGC2VVBSjJB7HWzPA1E9sBu3tY1x86uOy0x+PTdrs1EJgRq66murrhtDz1gbWmMkZETAFboEUZJgvQykAIq0gIlqwK3rsxRtuCdLcwNkLn1ylJpb4wB7oUcnzfg6c4kIdpDJeWFDet08fmtIBkAcMGYA2I0CHZ5vaT9utT8o+WfL5kd3kIm3xhk4YQWhAVtjnq8CiYAIsAKQCSnHSE2lgUkJ/16Raoee/Ra95arxmXXhqLfNqcvXNLRkx3fR8huIAUFkMDUlKXcPa91Ze+P5HG3aai0ahMJOI/wjiIEa2Rp110Wmq/c27/c15hhvZ9BpE0nIPycfzZV94x7M/33Vg3qvwYexlgencJPZfyvTPyWlmCRCHgsQNUFvBfufWqql9wEgGbFTmkIOALAoiFgq1VgTeJlYxoVL725B8+cSxx+JFT7zl7U4ualMqpI1wtS5VhYSBAJCCI4FgKjvBbK4rcl07YJ3Tr/TdP34xoVFrMTNXV1QQAHXE8gwjx7501DQBy4D254lDY3t6SkVTwWQ1ToBjCZ4Jmo4mD4bAcUKLTrFUKlr1qZL/SVyYduce31zz35RlbUqhOa7srA0UNO1o89r12wVaEoFgwiNmw0mlywnYmEg52rSgJhJbGrzOLC2GhAeLGABhSoSe1+9kwPA9wOhjVceEDKI846NW1lId2rWiKX33uDk8ZrOxU8FiMAsmkFoy5/Ur0k7bUZIwmAFBKs2WB7pwydg2Nq1YduMbuhZOoMgDo8MFlt6zc3P5MNusxG0mBoGYtHNGWTW0DgGVzLlEA+PdH9Xvjifkr9k05kuDkQEqyFQ5RH8vZvAqgjvZ+QrW1hf6HDwgmwg16icoaZpMjOIQQvEwBDYsbJADEYsKLx83Cx6/+iwT+ct39L/b6dHXTfq25/F6pVLYcUqAkHEoWB2n1MaP3WnbTxZN21KHwHuJx/YOET7SmRnorM8XaQ89kOtlLGXuQp/SgnKf6ZVx9+q8Gl9+5ZGXD5a2u6ELQsCwLAIGNgRASe5byW32K9XsNKd13c5uepmCjNID5vbtF/hEhz1vZyLGcawYcv1/ZeYtXJR9Ne1QmoNgYJrBhBaKKIBr36Vfx0XdN3oiBJWLKwkd+X9sx2P+qkAWjptqjRgHL5szx/+13OvqLxWJi15rMjjEQYjHa5e+faeI/SLH/2PJ1vtd5/1+1E4sJxKsZII5Go7Jh2DCqjRcWzr/sc9RUuzLSi2vHolBmuHDJwj0++Wx13/oshjWmVMQ1sl8y6zu2DJQls/mMEwjIjKcaSoN28+FDIh/Ord34dNK3+tvCsK/hsVY5YVmyZ0R8F9ENi+vq3UtKHFo9ZGCfL/65mS+rCJsvKooCX1vQPTxY+25NUe8xfXHB8q2qOqvtPqS9DpSQ2UBQqcMNIwZ3Xfrllvzx/cKZjw7Z257wwFVX5n+mBJ0qK2OyczL/FtN/wsSO9wqgDHYLfP3rRgRi2Cmsny24icUE4nUE/KD9nw+Tf0oFBdxVSf7FnHemCna2H5WVlcOow8r8pE/rpffWH9iWlT0s075h3ZbsOJbBHo3NbW5JUSiUTmccKZ1yX6lB20hWbN+QP/nE0YNu3+EG94SbQyqVzjYnM5mKEqdHULol7yxPx8iJ0LYs94rUN1V0i1Sktef7q5678XwfwLGX3Xt4Y8Z/29WO7VgsMiJogUTBP+gou857rZblt7dNP6rXsGWr1KS6TRgJ0MeIxQRXV/MBVVfv0+wGwv17lpr3Z1/7JREp1AKH/uY3xa3Z3oNbUsa2BETPoK5flrh702HnXdfPzedDSxMPfdvJ+FETruxqRQK9P43HV+x/+mVDSouLZO3zd60iAIdMunpkWBa1vPun+KYjz4+NXNOYDvhGUs+QTq945b6vT/nNNcX1WTF4W5acEf175hY+duUKFTc4KDp9mGMX5RNzq9adMz1WsnZ7bu/jh4U+j3eUwSEeN4KAQ39zz2Etaa93/z6BT1+/9+pNAGjMWdftvTWjI6yMDDnkrpl3//LJsWeDK79dtc/6xpy115691JI//mEFEekjzr1qgB0OlL8Xj38OAKMmTNsbFvmfv/rI2oPOumw/k9dbP3v1seZEokrz1zXO/revPMo1hlf97daFRKRm3FcT+nDZF0Ob2nOOdEKiW4nd9vHz8VXWa59t/odrJA0p16/tSPHJLfk8IlJgc5uC4RDY1QBbgJToWRx+et7Hm+7LGqev1l7BYxcBlCRTLZGgt8wOODy6f/iiuk3NF21JBg4pobyf8uRBfc68/QsAHzamnC0BC7y+yR0zpEvoxnYjjvdcZjevBLNixyGU2JFVGxq8A+sa6m+XRh05ol/FOwVGVjOqF8sdGetN4Vhd6puy/oCJNzWcNO2u6OuPXv9lU2PpYe2w3gg62CSFtIJB/SSA2za3csyWoQMEcKAZPN3BmkfclBO6SOX4RgsoznEo2tjCNzFz8cmX373HV5vSy3tGzHHGxLb0nZD7iEXQsyVlWfJXBJzQ4DmHbUnTG0EL277e3FIx8NTrXv7u5bsm5UXRCZvb+C7+4q2Kgbcs/pslZNfq6uFj4oiJysUQtbVxNXLSLZdvacveadjUr1mfsa6/69HRs266rLnX+Gtfzyu7W1BS0rGwTQCjWxp3DNqSsj8vLg0l61tz9uCJN3zGixYdPfrJhaMbt6Pm3NjjPW45uH/7MU98sKJE8tUSeHh7OviR7+f+AOCx6HUP9htYvfJN5Zu9jTE89Izr6xYsWDD67/+sH9SQlcs9Y+2wjdR517wtgAtFlh3yDemikGMP6SanFouMOm7/7scVW7mlrH0tdN6HdrWlsqasyLGSedM3k3OR1wSPBXKKYUmqd/PesDIH77z7zO3PDOgdmclGc9hGcnif8MrisAyUROzxBt7vbcl15WF5BPxUZZnaUd8r7G0fUEFb+5Sgvl+JaCovCezFlhxQFLQOD4VDkbyfDXWaL8c+WkGIcGlIXvebyuFDlKZM3caWJwhAY1oLm7Q/fsyA8w8Z1v20A/fu+yQAuL5wmRylwQS/ggDACQQdw8KFIOzXv/uTmmXo0IvvOGZDoz+JWTQvnXv7O2N/j7Bigf57dLl1zIg+p47au890BuBrEkL7uvXtu3v3Kg/9NuXh7Cdnzwuv/Ps99wsh1wy8Y9nCvKZxvXv2uJCoSqOujmo7TFFz0js276r84UO7XnDCyH7HzbxherMUBCYR6NW1+E8HD+l96r4DKi4wAIwVJCEtfurhiwYevO8elRkTOHL0k6/v+eXf70poRvafX+2o+s1rdSeyZcuDThzzLARBw3YNWQwAKza0z8p5XHzekSP6HnVgvwElUj9w4okn+p7ngVnwoD7drxnep/zUYT3LbzAArG5Bb7mUdpEtIYIB/mdI6PwRB/T+9L0vN2wU5IzmAk4kPSa0Z9xyIZCKONIOSrONgWxe+6I4KFVbqyohxmeorLR6VXRZ+93mLdjanO3SmDalAiZfVN414wQCWZAX1CJAG7PyUGO0tnI2DBjGAE7AKmYS0lVOzhiHNLPdxVd2xxZJBMk2MbW1tWVuvLyqcfjZt8xNp6ybJQE9ykqpyZPWwmUb5wYkMLjCOhNAoxQQDGMEiLERLgAo7fskYDxtiIha+oy/el5zm7zLN9RVkv+0NoxycgPaUG7Ljvabm9sybr8wPQ7gNlsGjBaQ3U+86YOtLbprkUNvTh21zb9EGwztXTTt8x3yve5FgYfef/KKrxGNSiQSOhaLiXgtaOywHtM+/K5l9ntf1C8sklhy7lWzzn7x3qsb+51yU7qpJXtuPuOeVmz7CwBMcaSWRiucO+XBv5ATKHUklh80YGDLMm0QcvCMp8wV25pSSTL6pWcuOi3FzKLfSTcwlDYSgOepQ0oDNO/Oq6o6i3qfIZqF3898hjxtsL4+Oau4KMDbqf0KAH+zVtfceiABKD//xtsdO3hYxjfyq7XN/UlzD218Q8wIWCpLINnQrsbblm0LS0CYXFcBagw5IpfKqOEegnZYeIU0qO8JwwraGGiWlqcQ8bM6QprACGF7TkNQsHBghaijIJmhPdORTArAN0BxgFFeYtV3TISBApgkhFNx7GWz9v16XfLSAPh9xQBbotTxFZ80Zv+zmlva023JdD0AaMNGaQruM/7qnhDS+Wb+3Zu01qQNRChgMwAavEfx/V9s1ouFyfPRw0ufXg8g7bNi5vCAnhU39OlR/H6mqSVNALIqD6WMawuxKpfVF3UrE9fT6EL6956pZ30+8fYXTY/Ssg9Wg6myoZpqAcTjABH4683bju5V7DxbMaDvw8vWpeevbcgdJInm9xp/bXlJUeTp0cP6vJhvTaplzHT61fdq7btUXhxa35zD1JKgvP2JmZe2AsDBA7s+umBFwzTj2jh4QPG0TR2+j6cVgYTUACTrBcmsPP+kaQ8/357Jl/j55ElXTdzv6gWrWiEl0V57dLmsd7fiNekGblwOQFwWe6D/xTc+MJY1la7cmnk86Vmhv75bt7A1pw9XnhK2ZHnMyB5VL910RM/Txw4ZfvxB/fYf2tMeW14cmF4SDs5xLOetUDD0FDOvZRJjqbZWbW9tH6LYIlI5bXJtkH4alGqASDXASm1DINcEK9MAO9sASu+AatlkVNMGw80bjGnZoFXzBh3Jbmrr6m99YdrRRWs70EV2fWUFhW71fX3b6nXNn4YcWX/o0C6/B4DSoMkIMGre+uSv73727dstLU3VAFAR0FlD1vBW2N/KoPOmLYAAGxMSRndC1Ivm3PJRKeU3ljhY+PKDN6wBgHK0woGbWbVuU/VbH6x467v6xr9bAoBhLnU8Wv/KrRcXU/rZttb0ozOvm1kKAIsWfaQcuLmA1IEfRDmxjhyJsQZvaHSfXbpyw3OObvm4T9eiJZqZwkGrpT2VvejdJXVvrVi3df6cOXNClijyS4LCfDvtqN/3KPKnu7nMH86/4tbhAPC3e2d8W+bo2hJkVr/1+HWfFLZNyWFL6bJQAfc5ef8uN4Qt/mT5d1s/Xru97e3mZK4XAARliKV2zZffrHvi7SWr3vpqTdMDBMDqVhL0NzYluTRofdg16G8tdURfVzmDAlJ39bXqacGUff3d9vvPvW19eyDgsOf57Z7nN5cVR1yl/UbWfku3sohxpVrfkHSPHnnqFdM3NeTO8xQ0s28so2mvnsHri2T+i2ymPRu0hcqmk3krFKRQwHabPee8te3+1Vr7hsDSGKEtS4hBXa1zltQ8vmDcLuk4QaQuvHHW0U2eFezqFOdfuPOijes62H1Y17K3W4eE925ozltFVpDKA7nWjwCceMCQmUkE56S0J8NSuF/9HTjiV31nmzz9dfarunPTUdfc/cihyvLyD8zvyFi0tqaPP2DkwTtybsAYQV2LlLfSABP32fODJngjHjswJjZWV08594Yn91nnFGomr7nm/OzvYo/vN3BQZMfCJ78HhBAvgGHL/nrn9X94/M/3fPjZhl4fPHPDt0Skcf+VdOJBex7XmHPCmXRSWK5v6uvr88cM7r2uorj/3kNeXiHXJmY+OiU2523tNbYCgGLQ+EP6nhFyc3bHMQbylcHYEX0Pscu85m/nAQ/Er2qxCMdWXhAbqByY92ffuaHqdSAWq1l98L7dh7a2Z+zycDeC355e987PVBALFGDaDZ/OC9/4ypddVn6XHqAY/TxX7+kqb09f8QBPq77aV3sYUMSQhK81fE2QgSJorQDjg9lAsEFAcL1ti7xSqtW2LQXm1oAl80xojASt4PakPi/jEwQbSMtGr2JTt0f3it8ao9p79SptG1RWkjpw0O+SVVU/gWGp45jl//DAbUz8Ihjzn9EuWMFP2v53cAQComIX/OGHeAJAqKwsYCC1teqH7wG7tN9xyupnOumEmOvqhlOiYSUBi4Ha7txRrLnbQRIASYBvmO569NGK5aubemxvS/VtT+k9tBH9c57a01N+X6V0b6W5lzYc1syeY1sWG+Mp5WdsS1I4GJCe77f42tRHwkE4tqVTqXRjUVE4W15aEgg51Fhkq7Uj9h7cMHLvXm+fM2FC665JqB8hdxTrRPwAxKsLZyw70UGuruYJ51xa9vrcJ9o6cyk/h/xNmDA1HAq1qmHDhv0gzxCPxxkAYrFYx7tM0WiVSCS+51UHorjzIDABfGY06iQSCS8Wi4nOce3CSo7FYqKuro6GDRvGP5jXf4eo/lC5doNOdvIktguffulMASEWo2hdHQFRNDSspFoAqK37RUURABSzuPPhh7t4rpTINGbPOutY3nvvfsoS/XJCEIQQ0FrDFHJWIACa/9fn6WOC6Faz31FnPi38nFn+/vypKNTUfr/CAD722HOLlI39w8Hi7dtb6hMBiy9ZsnDe0o6pdAoW+H5l/XQ1/0BwlRZQq4aNOeGWUMCpW1Y776XO5w+oPGW0MO7WZR+8tQ2dVYCA+ZHFoFgsRi+/t/zw8vKI1EqX27ZzAEPcFwnoPr62TvK1WX7+qePev/Opl68MO5Y+dJ+hc554Ymbrbsf2C/RLaWhGPG4SiYROJKp0bW1cFVKyiU6YksBMsVhMRDuOwKMyZjEqLQ0IIjI3Xn55Y/zaadvj8Xhyn30OTxH1y2kGfM1wfQ1lQAYxoRlCMQQjKhH9/hONRuV/faQ+GpVA3Ow79tSzleeL4f163HNMdGopEbQUAsxMgoiZWfbcq0/QU+6Rm1t23B4uLlo36bTjVglBmDp1qkQhsYnZs2fbAEzHN0+YMCH80EMPBQQRFsViFuJxM3ny5CAAEGrVcdFLByvQMaFI5F0AfMo5lwwjIgg2R1ZUdOnBzLKjZtQcc0y0FIibGTPuC02dOtsGgBVrNo7yfT27uT13TSZvytvS6W3JbHrGqvUNVyRT6azr5sc98sKC6ZGiomIpxBI9ckB6p9z+Q/qPThn9F0Q7S8s6ziruPLv3Pf1vDcDOVguVKVfeeFufN99f/lr38pJ5vla5VHvbcEvQPCscPkMpVSIt6WnlrwgJsR6WY2fy+Yu6lxXPTyazW13mvjkv/eSgvl3yTU3urHwuY/uyqK7YsZVRHjzmXmyQjxSFRmeyueZee3R9sGlH6w1szFKWVitJ65S8l3tz5XuvPHjw8b8+XXnexPKS0nvyvn+EFijRvprgufm5ktAWDAROCYScV9ta0udlc6m/rfr03RdGH3/O0Ew6eZ207GwwYG9obm49Yo8e3f66pbG5yvfN4EujlUf9/e3PYtqyKtio+75a9Oqy/zZB93/7xyt+gQr7IXX8eMYPf0hjV3P7P6dYIbXO73z8dX+t1LbmtlarLZXtlsrmvJSH49vaszKdzmVSqVzOdf2h7Tn32MamlrHa03M3btrRtzWbH5zNe5VvPzHDXbOmZYarzDatLJdBF7Ql249obUuOLispKm/N5M5oT+cajYC9bv22Bx1bbkhncsd7vhqQbEun+3cp23jhhRd261Ye3jPnq+4btjfFd7SmhjQ2tByfzbnrcq53ciqdP2SvAb1v2LK99X5piR09yksZAJLptikwuu7r2penaeX/KhQOFftQR/bvWXGvr/3sP97/fO/lta9Oy6WyTiqZPR0AsHjxfyXT/9OK8P8YxevqCABclTulb59uymgTlOz1CQWdvlJapV1Lg6+WR4LvAt6XgkQ35emikGNllJsfCtZFLGhycTjQurZujUcCa43SI/bo3fXFgOR5AcfOFkeCuqwo8HZFJPRqcQAvs+uXCOZGKYXHUJvIqHIirnANgkops6OxZSB8v624KOAIYR0agH2r8vOZkOPUa+333tLUfiob81XQstMV4ZJVU6dOtcOW7N+nZ8ULhx878SxJtOHA4SPPcjPZZgoGD+1RUbzIZrH/uNOnzHQCjjty2JD7ARBqa//jnxr4/zIRAEyYOjW892Enf3TUaefcuGhRzIrFYg5zjZRSoKamRgoixGKx4KJFi6xYLOYQEY6feE6vcaede8eQMccvnTp1qg0UdrVjolNLASAGCELHsXwUkFF0RF9CCIw5LlohBCEWiwkhvt8Ch405rqLTIZ4xY0YIADr9iVMnTy6LxWIWATjohBNKgIJnv2jRIgsAJkTP67frxKKXzhjc0TKddt6Ve3WM4f+n3RABQPTSWGRE5Snv/uqYU0bvev9nSADAkaf85pQDjpq4asyxpx8G7Dw80kE7nVb60fdu+9/lenfPix9970I/cI53eZd/3O7u+viv6P8CHXtmhIAB8zoAAAAASUVORK5CYII=";
const LOGO_WHITE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAAAcCAYAAAAOa8NNAAAMqklEQVR4nM2aeZBV1RHGf/3mDQzIgIALiwyLS8AlqIlbxCWZuEdNsNRQJqgkMVZcKkVMDJpKRVO4o6i4lHEJMWU0KhIhoqBGLUzUcosGEVkElOCSUXAYZnvvffmj+/IOz3kDWhUrp+rWve/ec/p09+n+ztdnxviCmyQzM0kaCNwF9AZqgBJQiG5F4F3gWWCumTVJyplZqYqsvsC9QK+QY8AZZrY6+p0FnAJ0RJ9bzew+STVmVow+NWZWlHQ2cDLQGbpdBLwMzAUUut5jZrdJqjWzzrBlCvAdoCH6NAOLgFnA7Wa2bmsdVCMpX+WqkZSTZFspKxf3odq6tlrSednYdB5J+bhP7GLclKTfYRXfnk91yRYu7Fma9CtI2kHS4Irx0xK/jJD0RvKtVHFXyDxhSw7OVe1QZcxncPYQSc2SimFUV60zeb69co5E1nMhp11SRzwvlVSb9H0+6VOSNDaxsyaevx5ztUbfO+L9qHjXGe+vTuTOizHtVWzoiPsx+WrOSNKrFjgR2B3YDmjD070N+AhYi6f8kq1OlXLLxSXgFeDx+F0PjIs5i3H9QNIrZnZT5pxI+wOAA3D46BFyS8AuQKOkx8xMwExg/9C9B3Aa8E8cchTjJsa9JvSYKc8kJbrmgCyjRgGNoV8t8BIwGWgBRgOnAscD15nZvNTJVhE14yU9JenaWJmPJD0k6QlJ50o6QtL3JZ0n6RJJt0j6WSKrS1ipiOwWldNtWkW/GkkXJxFelLRWUp+Qnxl8Z/QpRBS1qZwpDyb67BjfsrZSUl2mp6T+kpoSfV5TOeKHR+QW49tV8T7LhCyqb+jC3uMlDdzkD22OXYdImiPpGUkfhIM741oq6XRJEyTtUCG0Rzj+Ojm2dgkp3Tj7Fjlm1sU96ze7wqAjEwcOkvRJ4tyZkmaoDBetknZN5r5E0uPxXpKOSb5luJ8tyOTkW0OFs6+M92NUhsFszjslnSBpSIXdlv4YLekaSfdIOi7ezZH0l5ggm2ilHMN2quLM8ZImZdH5GZx9Q7zPIrY2Fu2U+N4afS9IZF1Q4aDDJY1VuXVKmhRz7Sepl6S/Jrbck8hakNjZImloN86+IlnwbFz6XXIkmCvp1ExOXtIA4HBgT2C2mS1MVqIHsCH6rgc+wDHuDqBJUh2OTx3xfT2wApgkx8o1CnrW1cJUtELF75KZlSQ1xe9czN039OsJ/DDG1QL/Bl4ws43hxPXAx8BhwM7APTiWj6W8T3xLUj0wIPoVcbx+OHSvNbPOLnTN7MkBk4AHgf0qbOkPHAccJ+kUYGIeGAm8ZmazwogckDOzgqTWMIS450PwBGAe8HooV4/z1wHAKKAV2BtYEwoVqzi4u2ahS338LoWRbfG7EfhS0n96OHoEvtl+D3gHWADMM7OlYd9NwGVAe8g+At/4a/GgqQHu0NZR2ZyZvSPpEJzHjwcOBraP78XQezzw3qZRkbJZimebxixJD0RaNEu6Ld7frG54o6RdJV0UMmsrvlWDkenaHLMzOLk7SVMpcFbSiwETd0k6RlKjHLOzNlnSoZKWSLo/mX+4ytSuJGmhpJcSPRbH/NlidwUjl8f7zWyLdztIOlLSH1TG8oKkDbkQamZWqqzQ8JXO3omgPDjFOUG+gw+RNEzSLnENwdN3cMjs1NYVPRvNrGBmbXEvSDoTz6JizP0h8JSkBjyzRuOQdiZOGycCf8Oza0087wYcIWlHADNbBczHM66ER+K+lLNvppkV8AjvtoVt4+Sb+Kh494GZzTezicDTMQ/ANvkt4GkB2DaeW4BDJD2Ep9xRcb2Nl6VL8dTsEWN2lnQO8KSZLd6S4sDhkn4O9MTT+2s41xa+6D2Bq82sFVgtaSZwFZ6i4I670MyuAQhZORzS+uFpfmMs+p1AlpmiXIa34tieyavWsswfANwM7BW+uRN4BN8/9gL2SOR80qWkBEbuljMSyTloc5KmpUjjFfIq6gZJZ0gansgZK+l8OV9uUMLlVa4gC9q8UkxbR/J8f4zrKWmqNq8610pqjO/5yKRRKleUBUmvJHbVyVlVMb5nEJHx8kzHFEY2JrIynp3VICl/V4U9GfzN6KqCNHxzqgU2Uq7K8hEBRcqQkm2wI/EoN+AySZ14dK/HN7RB+K59aRYVce9TPXgAz6AWYIaZ/VLS/sAfgV2TPsuA483sTUn5gJ+cma2QtBD4RvTbO3R81MzaJN0LXEg5zQFuVddwZzgByFrmt+uBgZQrz8rv4P57ApiSz4RncBJ3AR2S2uO5FIbnEmFFfKd/Cy+DD4xvbcBvKoz4GC9ZS9Im1OoAngHqYo7UyALOJJ7DadgKOcu4FE/1Zymn/SQzW5k5OnNO2HUtvqAdYfRXgEejz0yc8mYQshZ4KuyvZE/tMWc+9FwWvloFnC4nDhNw+jg0fNUOLAf+DNxgZp3pCVoNsA1O34bgR4UTYuCmSivaGuAxYAywEngYOBTnvdNxfBycOPH9mHiqmT2uLo5Lu2uhW64K502LJ6PsqJrE+Zv1zc59qsjKMlgRHPl4Llb0q4l+uWyeeJfRyI1m9lG8zwHKSxqEk/5RwPDo3AvfkF6J50H4+W4LHonLcOcuwRfkE3yTbMLho5Yy/BCyegDnS3oBP+utNHKzBUh/h6FVHVTFeZ9ydNpXVYqtygVKf6t8fm7JnKX4lmXW+13ILIGnxU14Cu2PO9Uow4aAOfG9gDt8PR7pzTgetuMLshB4CE+jp3BYKeJwshp4Eq/+djWzl+Tl8KX4ItxnZnMlnYhXXUVgiqTD8Kh6WF4xXgjMwE/WrsDZynbA3/FD/nbgNrzqvTj0nx73b+IF2Y+BX7t/VAtcgLOG34eO14fOzwN3x3z1eCbfL+kKM5ssaWL4pROnuX+SdDKe3W+F3FNxatkKXJ7DqdOx+DHpm3E14DCwAS9Dj8Wp0knAkTjNG4PTvgK+8TyI07WdcGi5D3ggrsXAd8PQLJoawlkPAjPkPPireDn9YSh4OHBgpGFdGNKKZ+LZwHnAfwguHfp+FHJGAquAG3EIOymcuSb4v/AsvDhkvINTxNNwjP8wvh8Tjp4WQbCvpDOAc2PMOGDvCJ5r8OBdFHYeh1e57wEb8sAv8IhrjUl6h5F5/Ey4JZzzTjzvjG+MioUZg0dCXxzvS6FIR4yrCUe1RZ+UjSw3s9mSpuIR2opHZ5uZtUvqANYFdpbCkT2BXwH/AhaZ2aOSTgpHG7AOh7WROCxebmatsYn91sxuyTA0+k2OhfhRyF0fctbjUVsAfgo8E+fnU/FsXxAMqCcOn9sDzZGFfc2sQ1JL2NRqZi15PE2OxynVupgoOwOZE0LqwlF1eAYMC+waHI7Lh1K9KR+wp+xCONQ8CywPpvAJsJekp4FXzWyRpNNCxu7yKvE9/I8Go3AIaQPqzWy5pCXAvIyq4rA3CNgHh6b5OAsaEzq8C7we/bPzmgF4VtbhNDc7f9keOAiHg1U4xJwjaVu8Kn0fmB2yCkBfM3tVXuq/ALRIOhoPuHpgrKQGC6OGAiPiGoqzkVKsSp8wpncM7oNTnPk4pAC8huNbMx79zSHnRsoU8DEzO3qT933nHoHv5tkhUd+YuxfwRizisHDMcmAHPOWLeMq3R9T2xGGpDw5tbUAvM/tY0i5mtiz69DOzD9LNUVJ/HHPfCOc14Cd2683sbUmDzWytpJ3DyS2xSM2hRz1gZvZxyBuNQ1WzvMIcFHYsqXpeEak2EE/vwcmCDMOjfI9wynZheJHyUWsrHrn1lAuThTh7WQ68HBw1m2uLx7AZOwm9UjZQlc6p/Bfz9K/om1hO5TOUmcPnaVuyIyP/WWptGtcdF02NwVd5IGWM3hj3Er76wnG4jjLcdGaVXsyVRVmmC4RDJY0DGs3skoq5++IQcQpeNKzaWv4e0XeQmd0Vv/c1s5er9B2E72EdYctSnGE8gxOCxcA/Qt9SalNqj5mVuj2JS0pXSy5i0tKWovHztmTe/jh1ewTH3w34pt2E4/np+EJPx/+wsQZnVytx5/TDoaUXflK5J47dZwFX44EifDPdBj+f34agc3ixdjDORGbhe8HQ0GMVnulTcWhjS/741NlI2pLBXQqpWAy66/sZFyYXUb0P7vCjKB/I98ahqQmHqjXAJfhJXiNOt4bhm30zvge0x1WKa12Mn4zTxjW4E/vgtcKhuGMX4NT3JzhnbsAX7cs4zZsGbG9mHyYMp2rbqn+s+aJbgrVX4nvBEjwKF+Ob1D74ftCEG94IfBuP+p74njEaT/mNuMOH4NHfD99D5uMcuj8eyS/iZydNeHQ34fy6MeYdGfKOwIu0ofhiz+F/mOVfWJP0O0m7baHPTMVf3P/f238BpIIp8JGmKPgAAAAASUVORK5CYII=";


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
const DRIVER_SLUGS={"trevor":1,"brent":2,"trevarr":3,"chad":4};
function getDriverSlug(name){return name.toLowerCase().split(" ")[0].replace(/[^a-z0-9]/g,"");}

/* Resolve a slug to a driver ID — checks live drivers array first, then static map */
function resolveDriverSlug(slug,driversArr){
  if(!slug)return null;
  const found=driversArr.find(d=>getDriverSlug(d.name)===slug.toLowerCase());
  if(found)return found.id;
  return DRIVER_SLUGS[slug.toLowerCase()]||null;
}

const ADDR={
  // EMSER PICKUPS
  "Emser Norcross":"5981 Live Oak Parkway, Norcross, GA 30093",
  "Emser - Norcross":"5981 Live Oak Parkway, Norcross, GA 30093",
  "Emser Roswell":"250 Hembree Park Drive, Roswell, GA 30076",
  "Transfer - Norcross":"5981 Live Oak Parkway, Norcross, GA 30093",
  "Transfer - Roswell":"250 Hembree Park Drive, Roswell, GA 30076",
  // EMSER DELIVERIES
  "AFDC Flooring Attic":"4125 Buford Dr, Buford, GA 30518",
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
  "Strathmore - Atlanta":"50 East Great Southwest Parkway, Atlanta, GA 30336",
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
  "SE Southern Surfaces - Buford":"4550 Atwater Court, Suite 211, Buford, GA 30518",
  "Construction Resources - Decatur":"196 Rio Circle, Decatur, GA 30030",
  "Builders Floor Coverings - Decatur":"196 Rio Circle, Decatur, GA 30030",
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
  "Perfect Edge to IMETCO":"4264 Winters Chapel Road, Building F, Doraville, GA 30360",
  "Southern Aluminum to IMETCO":"1401 Blairs Bridge Road, Lithia Springs, GA 30122",
  "Finishing Dynamics to IMETCO":"28 Andrews Way, Villa Rica, GA 30180",
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
const _customAddrCache={};
const getAddr=(s)=>ADDR[s]||_customAddrCache[s]||"";


const DEFAULT_INSTRUCTIONS={
  // EMSER
  "Atlanta West - Lithia Springs":"Product pick up at either or both Emser locations",
  "Atlanta Flooring - Suwanee":"Must deliver between 9:30 AM – 1:00 PM",
  "Elite Flooring - Norcross":"Deliveries always made here",
  "Britts - Lawrenceville":"Not before 9",
  "Stocco - Alpharetta":"Product pick up at either or both Emser locations",
  "DCO Tech Dr":"Do not deliver before 10ish",
  "DCO Tech Dr - Lawrenceville":"Do not deliver before 10ish",
  "DCO Eatonton":"ALWAYS 942 Greensboro Rd (NEVER 105 Harmony). Parking lot delivery — Forklift, no dock. +1h distance bonus",
  "DCO Athens":"+1h distance bonus — long-distance run",
  "AFDC Flooring Attic":"This is a Liftgate Delivery",
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
  "IMETCO to Finishing Dynamics":"Requires Ship Plan # — Pickup at IMETCO, deliver to Finishing Dynamics (28 Andrews Way, Villa Rica)",
  "Perfect Edge to IMETCO":"Requires Ship Plan # — Pickup at Perfect Edge, deliver to IMETCO (4648 S Old Peachtree Rd, Norcross)",
  "Southern Aluminum to IMETCO":"Requires Ship Plan # — Pickup at Southern Aluminum, deliver to IMETCO (4648 S Old Peachtree Rd, Norcross)",
  "Finishing Dynamics to IMETCO":"⚠ Get an updated Ship Plan # from driver before departing. Photo BOL required. — Pickup at Finishing Dynamics, deliver to IMETCO (4648 S Old Peachtree Rd, Norcross)",
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


const CUSTOMERS={
"Emser Tile":{rate_type:"hourly",rate:102.50,min_hours:4,pickup:"Norcross &/or Roswell",note:"$102.50/hr, 4hr min",
deliveries:["AFDC Flooring Attic","Advanced Flooring Design - Mableton","American Flooring Services","Atlanta Flooring - Suwanee","Atlanta West - Lithia Springs","BEC - Alpharetta","Britts - Lawrenceville","Builders Floor Coverings - Decatur","Construction Resources - Decatur","D3 - Woodstock","Dalton Carpet Outlet - Smyrna","DCO Athens","DCO Eatonton","DCO Lakes Pkwy","DCO Smyrna","DCO Tech Dr - Lawrenceville","Drop Ship Liftgate","Elite Flooring - Norcross","Flooring Design Group - Doraville","Floorworx - Norcross","Gel & Associates - Atlanta","Hillman - Sugar Hill","Idlewood - Norcross","JSJ/ProSource - Marietta","Madison Flooring Group","NE Corner - Flowery Branch","NOCO Contracting","Peachwood Floor Covering","Precision Flooring - Norcross","Premier - Suwanee","Prestigious - Alpharetta","ProSource - Marietta","ProSource - Norcross","SE Commercial - Woodstock","Sherwin Williams - Norcross","Sherwin Williams - Smyrna","Stocco - Alpharetta","Strathmore - Atlanta","Transfer - Norcross","Transfer - Roswell","Valufloor - Doraville","Vanguard - Norcross"]},
"Florida Tile":{rate_type:"flat",pickup:"Norcross",fuel_surcharge:0.15,note:"Flat rate + 15% fuel (separate)",
deliveries:[{s:"3 Little Dogs - Cumming",r:200},{s:"Atlanta West - Lithia Springs",r:200},{s:"BEC - Alpharetta",r:175},{s:"Britts - Lawrenceville",r:125},{s:"Builders Floor Coverings - Decatur",r:175},{s:"Construction Resources - Decatur",r:175},{s:"DCO Lakes Pkwy - Lawrenceville",r:125},{s:"DCO Tech Dr - Lawrenceville",r:125},{s:"Floor Works - Dallas",r:250},{s:"Hillman - Sugar Hill",r:150},{s:"JSJ/ProSource - Marietta",r:150},{s:"Moda",r:150},{s:"NE Corner - Flowery Branch",r:150},{s:"Precision Flooring - Norcross",r:125},{s:"Premier - Suwanee",r:125},{s:"ProSource - Norcross",r:125},{s:"Remodel Republic",r:150},{s:"SE Commercial - Woodstock",r:175},{s:"SE Southern Surfaces - Buford",r:150,lg:true,addr:"4550 Atwater Court, Suite 211, Buford, GA 30518"},{s:"Tile House",r:175},{s:"Vanguard - Norcross",r:125}]},
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
{customer:"Emser Tile",label:"Emser - Norcross",addr:"5981 Live Oak Parkway, Norcross, GA 30093"},
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
const fmtEta=(mins)=>{const m=parseInt(mins)||0;if(!m)return mins+" min";const h=Math.floor(m/60);const rm=m%60;const dur=h>0?(rm>0?h+"h "+rm+"m":h+"h"):m+"m";const arr=new Date(Date.now()+m*60000);const t=arr.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});return dur+" · ~"+t;};

function getWeekDates(off=0){const now=new Date();const d=now.getDay();const mon=new Date(now);mon.setDate(now.getDate()-(d===0?6:d-1)+off*7);return DAYS.map((name,i)=>{const dt=new Date(mon);dt.setDate(mon.getDate()+i);return{name,date:dt.toLocaleDateString("en-US",{month:"short",day:"numeric"}),iso:dt.toISOString().slice(0,10)}});}
/* Firebase key for a given week offset + day index — returns ISO date like "2026-03-24" */
function getFbKey(wo,dayIdx){const now=new Date();const d=now.getDay();const mon=new Date(now);mon.setDate(now.getDate()-(d===0?6:d-1)+wo*7+dayIdx);const y=mon.getFullYear();const m=String(mon.getMonth()+1).padStart(2,'0');const dd=String(mon.getDate()).padStart(2,'0');return y+'-'+m+'-'+dd;}
function fmt(n){return "$"+n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");}



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


function ParsedStopsCard({stops,onAddSelected}){
const[checked,setChecked]=useState(()=>stops.map((_,i)=>i));
const toggle=(idx)=>setChecked(p=>p.includes(idx)?p.filter(x=>x!==idx):[...p,idx]);
const toggleAll=()=>setChecked(p=>p.length===stops.length?[]:stops.map((_,i)=>i));
const selected=stops.filter((_,i)=>checked.includes(i));
return(
<div style={{marginTop:6,background:"#f0fdf4",border:"2px solid #16a34a",borderRadius:12,padding:"10px 12px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<span style={{fontSize:11,fontWeight:700,color:"#16a34a"}}>{stops.length} stops found</span>
<button onClick={toggleAll} style={{background:"none",border:"none",fontSize:10,color:"#2563eb",cursor:"pointer",fontWeight:600}}>{checked.length===stops.length?"Deselect All":"Select All"}</button>
</div>
{stops.map((s,si)=>{const isChecked=checked.includes(si);return(
<div key={si} onClick={()=>toggle(si)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 4px",borderBottom:si<stops.length-1?"1px solid #dcfce7":"none",cursor:"pointer"}}>
<div style={{width:20,height:20,borderRadius:5,border:`2px solid ${isChecked?"#16a34a":"#d6d3d1"}`,background:isChecked?"#16a34a":"#fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700,flexShrink:0}}>{isChecked?"✓":""}</div>
<div style={_s.f1m}>
<div style={{fontSize:12,fontWeight:600,color:"#1c1917"}}>{s.stop}</div>
{s.customer&&<div style={{fontSize:9,color:s.customer==="Florida Tile"?"#16a34a":s.customer==="Emser Tile"?"#2563eb":"#78716c",fontWeight:700}}>{s.customer}{s.rate?" — $"+s.rate:""}</div>}
{(s.weight||s.note)&&<div style={_s.sub}>{s.weight?Math.round(s.weight/1000)+"K lbs":""}{s.weight&&s.note?" · ":""}{s.note||""}</div>}
</div>
</div>);})}
{selected.length>0&&<button onClick={()=>onAddSelected(selected)} style={{display:"block",width:"100%",marginTop:8,background:"#16a34a",color:"#fff",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontSize:14,fontWeight:700}}>
+ Add {selected.length} Stop{selected.length!==1?"s":""} to Manifest
</button>}
{selected.length===0&&<div style={{textAlign:"center",padding:"8px",fontSize:12,color:"#a8a29e"}}>Select stops to add</div>}
</div>
);
}


/* Uses Google Places API when available, falls back to plain input gracefully */
let _gmpState="idle"; /* idle | loading | ready | failed */
let _gmpRetries=0;
function loadGoogleMaps(){
if(_gmpState==="ready"||window.google?.maps?.places){_gmpState="ready";return;}
if(_gmpState==="loading")return;
if(_gmpState==="failed"&&_gmpRetries>=3)return;
_gmpState="loading";
_gmpRetries++;
try{
const s=document.createElement("script");
s.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB29mVeZXedDhLVT3eMVgl07EsOneWCUu4&libraries=places,geometry";
s.async=true;
s.onload=()=>{_gmpState="ready";};
s.onerror=()=>{_gmpState="failed";};
document.head.appendChild(s);
}catch(e){_gmpState="failed";}
}


function GoogleMapView({stops,drivers,height,onStopClick,activeDriver,activeLoad,showSearch,searchLabel,onAssignStop,driverLocs}){
const containerRef=useRef(null);
const mapInstanceRef=useRef(null);
const markersRef=useRef([]);       /* [{marker, infoWindow, labelOverlay, stopId}] */
const polylinesRef=useRef([]);
const labelsRef=useRef([]);
const driverMarkersRef=useRef([]); /* live driver location markers */
const searchInputRef=useRef(null);
const[useRoadRoutes,setUseRoadRoutes]=useState(false);
const[showTraffic,setShowTraffic]=useState(false);
const[hideLabels,setHideLabels]=useState(false);
const trafficLayerRef=useRef(null);
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
mapTypeControl:true,
mapTypeControlOptions:{style:window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,position:window.google.maps.ControlPosition.TOP_RIGHT,mapTypeIds:["roadmap","satellite","hybrid"]},
streetViewControl:true,
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
const isPickupBy=text.toLowerCase().startsWith("pickup by");
const isPickupAfter=text.toLowerCase().startsWith("pickup after");
const isPickup=isPickupBy||isPickupAfter||text.toLowerCase().startsWith("pickup");
const isAfter=text.toLowerCase().startsWith("after");
const bg=isWindow?"#7c3aed":isPickup?"#16a34a":isAfter?"#2563eb":"#dc2626";
const display=isPickupBy?"PU By "+text.replace(/^Pickup By\s*/i,"")
  :isPickupAfter?"PU After "+text.replace(/^Pickup After\s*/i,"")
  :isPickup?text
  :text.replace(/^(By|After)\s*/i,"");
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
markersRef.current.forEach(({marker,labelOverlay,pickupLabelOverlay})=>{
marker.setMap(null);
if(labelOverlay)labelOverlay.setMap(null);
if(pickupLabelOverlay)pickupLabelOverlay.setMap(null);
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

const hasRouteNum=s.routeOrder>0&&!done;
const isUnassigned=!isAssigned&&!done;
const scale=done?4:onSite?9:hasRouteNum?10:isActiveDriverStop?9:isUnassigned?8:6;
const fillColor=done?"#a8a29e":isUnassigned?"#d97706":"#2563eb";
const strokeColor=onSite?"#f59e0b":isActiveDriverStop?"#1c1917":isUnassigned?"#92400e":isP?"#f59e0b":"#fff";
const strokeWeight=onSite?3:isActiveDriverStop?3:isUnassigned?2.5:1.5;
const fillOpacity=done?0.4:hasActive&&!isActiveDriverStop&&isAssigned?0.5:1;

const marker=new window.google.maps.Marker({
position:pos,map,
icon:{
path:isPU?'M -2,-2 L 0,-4 L 2,-2 L 2,2 L -2,2 Z':window.google.maps.SymbolPath.CIRCLE,
scale:isPU?Math.min(scale,6):scale,fillColor,fillOpacity,strokeColor,strokeWeight,
},
zIndex:done?1:onSite?10:isActiveDriverStop?9:isP?8:5,
title:s.stop,
cursor:onAssignStop?"pointer":"default",
label:s.routeOrder>0&&!done?{text:String(s.routeOrder),color:"#fff",fontSize:"10px",fontWeight:"800",fontFamily:"DM Sans,system-ui,sans-serif"}:undefined,
});

/* dueBy label above marker */
let labelOverlay=null;
if(s.dueBy){
labelOverlay=makeDueLabel(map,pos,s.dueBy);
}
/* pickupDueBy label above delivery markers (shows pickup time on delivery dot) */
let pickupLabelOverlay=null;
if(s.pickupDueBy&&s.stopType!=="pickup"){
const puPos={lat:pos.lat+(s.dueBy?0.008:0),lng:pos.lng};
pickupLabelOverlay=makeDueLabel(map,puPos,s.pickupDueBy);
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
if(s.pickupDueBy)badges.push(`<span style="background:#16a34a;color:#fff;padding:1px 5px;border-radius:3px;font-size:9px;font-weight:700">📦 ${s.pickupDueBy}</span>`);

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

markersRef.current.push({marker,infoWindow,labelOverlay,pickupLabelOverlay});

if(s.driverId&&s.driverId>0){
const loadKey=s.driverId+"-"+(s.loadNum||1);
if(!drvStops[loadKey])drvStops[loadKey]=[];
drvStops[loadKey].push({pos,routeOrder:s.routeOrder||999,driverId:s.driverId});
}
});

/* Detect shared stops across drivers — only show arrows on overlapping routes */
const allDrvPositions={};
Object.entries(drvStops).forEach(([loadKey,items])=>{allDrvPositions[loadKey]=items.sort((a,b)=>a.routeOrder-b.routeOrder).map(i=>({pos:i.pos,driverId:i.driverId}));});
const posKey=(p)=>p.lat.toFixed(4)+","+p.lng.toFixed(4);
const sharedPositions=new Set();
const allPosKeys={};
Object.entries(allDrvPositions).forEach(([loadKey,items])=>{
  const did=items[0]?.driverId||loadKey;
  items.forEach(i=>{const k=posKey(i.pos);if(allPosKeys[k]&&allPosKeys[k]!==did)sharedPositions.add(k);allPosKeys[k]=allPosKeys[k]||did;});
});
const drvHasShared=(items)=>items.some(i=>sharedPositions.has(posKey(i.pos)));

/* Polylines — use Directions API for road-following routes when enabled, otherwise straight lines */
/* Each loadKey (driverId-loadNum) gets its own polyline — no line between loads */
Object.entries(allDrvPositions).forEach(([loadKey,items])=>{
if(items.length<2)return;
const driverId=items[0].driverId;
const positions=items.map(i=>i.pos);
const di=drivers.findIndex(d=>d.id===Number(driverId));
const col=DCOL[di]||"#78716c";
const needsArrows=drvHasShared(items);
const arrowIcons=needsArrows?[{icon:{path:'M 0,-1 L 2,0 L 0,1',scale:5,fillColor:col,fillOpacity:1,strokeWeight:0},offset:'100%',repeat:'60px'}]:[];
if(useRoadRoutes&&window.google?.maps?.DirectionsService&&positions.length<=25){
  const svc=new window.google.maps.DirectionsService();
  const origin=positions[0];
  const dest=positions[positions.length-1];
  const waypoints=positions.slice(1,-1).map(p=>({location:p,stopover:true}));
  svc.route({origin,destination:dest,waypoints,travelMode:window.google.maps.TravelMode.DRIVING,optimizeWaypoints:false},(result,status)=>{
    if(status==="OK"){
      const renderer=new window.google.maps.DirectionsRenderer({map,directions:result,suppressMarkers:true,preserveViewport:true,
        polylineOptions:{strokeColor:col,strokeOpacity:0.8,strokeWeight:5,icons:arrowIcons}});
      polylinesRef.current.push({setMap:(m)=>{renderer.setMap(m);}});
    }else{
      const line=new window.google.maps.Polyline({
        path:positions,geodesic:true,strokeColor:col,strokeOpacity:0.75,strokeWeight:4,map,icons:arrowIcons,
      });
      polylinesRef.current.push(line);
    }
  });
}else{
  const line=new window.google.maps.Polyline({
    path:positions,geodesic:true,strokeColor:col,strokeOpacity:0.75,strokeWeight:4,map,icons:arrowIcons,
  });
  polylinesRef.current.push(line);
}
});

if(stops.filter(s=>s.coords).length>0){
map.fitBounds(bounds,{top:60,bottom:20,left:20,right:20});
}
},[stops,drivers,mapReady,useRoadRoutes]);/* activeDriver handled via ref — no flicker on driver select */

/* Traffic layer toggle */
useEffect(()=>{
const map=mapInstanceRef.current;
if(!map||!window.google?.maps?.TrafficLayer)return;
if(showTraffic){
  if(!trafficLayerRef.current)trafficLayerRef.current=new window.google.maps.TrafficLayer();
  trafficLayerRef.current.setMap(map);
}else{
  if(trafficLayerRef.current)trafficLayerRef.current.setMap(null);
}
},[showTraffic,mapReady]);

/* Labels toggle */
useEffect(()=>{
const map=mapInstanceRef.current;
if(!map)return;
const baseStyles=[
{featureType:"poi",stylers:[{visibility:"off"}]},
{featureType:"transit",stylers:[{visibility:"off"}]},
{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#c9e4f5"}]},
{featureType:"landscape",elementType:"geometry.fill",stylers:[{color:"#f0efe9"}]},
{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#fcd34d"}]},
{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#fbbf24"}]},
{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{color:"#ffffff"}]},
{featureType:"road.local",elementType:"geometry.fill",stylers:[{color:"#f5f5f4"}]},
{featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#1e5b92"}]},
];
if(hideLabels){
  map.setOptions({styles:[...baseStyles,
    {elementType:"labels",stylers:[{visibility:"off"}]},
  ]});
}else{
  map.setOptions({styles:baseStyles});
}
},[hideLabels,mapReady]);

/* Live driver location markers */
useEffect(()=>{
const map=mapInstanceRef.current;
if(!map||!mapReady||!driverLocs)return;
/* Remove old driver markers */
driverMarkersRef.current.forEach(m=>m.setMap(null));
driverMarkersRef.current=[];
/* Create new markers for each driver with a location */
drivers.forEach((drv,di)=>{
  const loc=driverLocs[drv.id];
  if(!loc||!loc.lat||!loc.lng)return;
  const col=DCOL[di]||BRAND.main;
  const initials=drv.name.split(" ").map(w=>w[0]).join("").toUpperCase();
  const age=loc.updatedAt?(typeof loc.updatedAt==="string"?Math.round((Date.now()-new Date(loc.updatedAt).getTime())/60000):Math.round((Date.now()-loc.updatedAt)/60000)):null;
  const ageLabel=age!==null?(age<1?"just now":age<60?age+"m ago":Math.round(age/60)+"h ago"):"";
  const speedLabel=loc.speed>0?loc.speed+" mph":"";
  const truckLabel=loc.truck||"";
  const cityLabel=[loc.city,loc.locState].filter(Boolean).join(", ");
  /* Custom SVG marker with driver initials */
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48"><defs><filter id="s" x="-20%" y="-10%" width="140%" height="130%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs><path d="M20 47 C20 47 3 28 3 18 A17 17 0 0 1 37 18 C37 28 20 47 20 47Z" fill="${col}" filter="url(#s)" stroke="#fff" stroke-width="2"/><circle cx="20" cy="18" r="11" fill="#fff"/><text x="20" y="22" text-anchor="middle" font-size="11" font-weight="800" font-family="system-ui" fill="${col}">${initials}</text></svg>`;
  const marker=new window.google.maps.Marker({
    position:{lat:loc.lat,lng:loc.lng},
    map,
    icon:{url:"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg),scaledSize:new window.google.maps.Size(40,48),anchor:new window.google.maps.Point(20,48)},
    title:drv.name+(ageLabel?" ("+ageLabel+")":""),
    zIndex:1000+di
  });
  const infoContent=`<div style="font-family:system-ui;padding:4px"><div style="font-size:13px;font-weight:700;color:${col}">${drv.name}</div>${truckLabel?`<div style="font-size:11px;color:#57534e;margin-top:2px">🚚 ${truckLabel}</div>`:""}<div style="font-size:11px;color:#78716c;margin-top:2px">📍 ${cityLabel||"Live location"}${ageLabel?" · "+ageLabel:""}</div>${speedLabel?`<div style="font-size:11px;color:#2563eb;margin-top:2px">🏎 ${speedLabel}</div>`:""}${loc.state==="off"?'<div style="font-size:10px;color:#a8a29e;margin-top:2px">Engine off</div>':""}${age!==null&&age>30?'<div style="font-size:10px;color:#dc2626;margin-top:2px">⚠ Location may be stale</div>':""}</div>`;
  const info=new window.google.maps.InfoWindow({content:infoContent});
  marker.addListener("click",()=>{if(openInfoRef.current)openInfoRef.current.close();info.open(map,marker);openInfoRef.current=info;});
  driverMarkersRef.current.push(marker);
});
},[driverLocs,drivers,mapReady]);

return(
<div style={{position:"relative",borderRadius:14,overflow:"hidden",border:"1px solid #d6d3d1",boxShadow:"0 2px 12px rgba(0,0,0,0.08)",height:typeof height==="string"&&height.includes("%")?height:undefined}}>{showSearch&&(
<div style={{position:"absolute",top:10,left:10,right:200,zIndex:5}}>
<input ref={searchInputRef} type="text" placeholder={searchLabel||"Search address…"}
style={{width:"100%",padding:"10px 14px 10px 36px",border:"none",borderRadius:10,fontSize:13,fontWeight:500,outline:"none",boxShadow:"0 2px 12px rgba(0,0,0,0.15)",background:"#fff",fontFamily:"'DM Sans',system-ui,sans-serif"}}/>
<span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none",opacity:0.5}}>🔍</span>
</div>
)}
{/* Map overlay buttons */}
<div style={{position:"absolute",bottom:activeDriver&&onAssignStop?52:12,left:12,zIndex:5,display:"flex",gap:6}}>
<button onClick={()=>setUseRoadRoutes(!useRoadRoutes)} style={{background:useRoadRoutes?"#1e5b92":"#fff",color:useRoadRoutes?"#fff":"#57534e",border:"1px solid "+(useRoadRoutes?"#1e5b92":"#d6d3d1"),borderRadius:8,padding:"6px 10px",fontSize:10,fontWeight:700,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",gap:4}}>
{useRoadRoutes?"🛣 Road Routes":"〰 Straight Lines"}
</button>
<button onClick={()=>setShowTraffic(!showTraffic)} style={{background:showTraffic?"#dc2626":"#fff",color:showTraffic?"#fff":"#57534e",border:"1px solid "+(showTraffic?"#dc2626":"#d6d3d1"),borderRadius:8,padding:"6px 10px",fontSize:10,fontWeight:700,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",gap:4}}>
{showTraffic?"🚦 Traffic ON":"🚦 Traffic"}
</button>
<button onClick={()=>setHideLabels(!hideLabels)} style={{background:hideLabels?"#7c3aed":"#fff",color:hideLabels?"#fff":"#57534e",border:"1px solid "+(hideLabels?"#7c3aed":"#d6d3d1"),borderRadius:8,padding:"6px 10px",fontSize:10,fontWeight:700,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",gap:4}}>
{hideLabels?"🏷 Labels OFF":"🏷 Labels"}
</button>
</div>
{/* Assign-mode banner */}
{activeDriver&&onAssignStop&&(()=>{
const drv=drivers.find(d=>d.id===activeDriver);
const di=drivers.findIndex(d=>d.id===activeDriver);
const showLoad=activeLoad&&activeLoad>1;
return(<div style={{position:"absolute",bottom:12,left:12,right:12,zIndex:5,background:DCOL[di]||BRAND.main,color:"#fff",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.2)"}}>
<span>🖱 Tap stops to add to {drv?.name?.split(" ")[0]}'s route{showLoad?" (Load "+activeLoad+")":""}</span>
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


function DriverView({driver,entries,dayLabel,onStatusUpdate,onPhotoUpload,onSignature,onEta,onShipPlan,onLiftgate}){
const [sigStop,setSigStop]=useState(null);
const [shipPlanInputs,setShipPlanInputs]=useState({});
const [liftgateRequested,setLiftgateRequested]=useState({});
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
<div style={_s.flexBtwMb8}>
<div>
<h2 style={{margin:0,fontSize:18,fontWeight:700}}>{driver.name}</h2>
<p style={{margin:0,fontSize:13,color:"#78716c"}}>{dayLabel}</p>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:22,fontWeight:700,color:"#16a34a"}}>{completed}/{total}</div>
<div style={_s.sub11}>completed</div>
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
<div style={_s.sub11}>ETA to first stop: {entries[0].stop}</div>
</div>
</div>
<div style={{display:"flex",gap:6,alignItems:"center"}}>
<input placeholder="mins" type="number" inputMode="numeric" defaultValue={entries[0].eta||""} style={{width:70,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}
onBlur={e=>{if(e.target.value)onEta(entries[0].id,e.target.value,entries[0].stop);}}/>
<span style={{fontSize:12,color:"#78716c"}}>min to</span>
<span style={{fontSize:12,fontWeight:700,color:BRAND.main,flex:1}}>{entries[0].stop}</span>
</div>
{entries[0].eta&&entries[0].etaDest&&<div style={{marginTop:6,fontSize:11,color:BRAND.main,fontWeight:600}}>{"🚚"} {fmtEta(entries[0].eta)} → {entries[0].etaDest}</div>}
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
{!isPickup&&<span style={_s.tag9Green}>DELIVERY</span>}
{entry.priority&&<span style={_s.tag9Amber}>PRIORITY</span>}
{departed&&<span style={_s.tag9Green}>DONE</span>}
{arrived&&!departed&&<span style={_s.tag9Amber}>ON SITE</span>}
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
{entry.shipPlan&&<div style={{marginTop:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"6px 12px"}}><span style={{fontSize:10,color:"#16a34a",fontWeight:600}}>Ship Plan #:</span> <span style={_s.bold14}>{entry.shipPlan}</span></div>}
{entry.note&&<div style={{fontSize:11,color:"#78716c",marginTop:2}}>{entry.note}</div>}
{addr&&<a href={`https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`} target="_blank" rel="noopener"
style={{display:"inline-flex",alignItems:"center",gap:6,background:BRAND.main,color:"#fff",border:"none",borderRadius:10,padding:"10px 16px",cursor:"pointer",fontSize:13,fontWeight:600,marginTop:8,textDecoration:"none",width:"100%",justifyContent:"center"}}>
🧭 Get Directions
</a>}
{(entry.arrivedAt||entry.departedAt||entry.eta)&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>
{entry.arrivedAt&&<span style={{fontSize:11,fontWeight:700,color:"#16a34a",background:"#f0fdf4",padding:"3px 8px",borderRadius:6,border:"1px solid #bbf7d0"}}>📍 Arrived {entry.arrivedAt}</span>}
{entry.departedAt&&<span style={{fontSize:11,fontWeight:700,color:"#16a34a",background:"#dcfce7",padding:"3px 8px",borderRadius:6,border:"1px solid #86efac"}}>✅ Departed {entry.departedAt}</span>}
{entry.eta&&<span style={{fontSize:11,fontWeight:700,color:"#2563eb",background:"#eff6ff",padding:"3px 8px",borderRadius:6,border:"1px solid #bfdbfe"}}>🚚 {fmtEta(entry.eta)}{entry.etaDest?" → "+entry.etaDest:""}</span>}
</div>}
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
<input placeholder="mins" type="number" inputMode="numeric" defaultValue={entry.eta||""} style={{width:70,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}
onBlur={e=>{if(e.target.value){const select=e.target.parentElement.querySelector("select");const dest=select?select.value:"";onEta(entry.id,e.target.value,dest||entry.etaDest);}}}/>
</div>
<div style={_s.flexG6}>
<label style={{display:"flex",alignItems:"center",gap:4,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#2563eb",flex:1,justifyContent:"center"}}>
{"📷"} Photo
<input type="file" accept="image/*" capture="environment" style={{display:"none"}}
onChange={e=>{if(e.target.files[0]){const r=new FileReader();r.onload=ev=>onPhotoUpload(entry.id,ev.target.result);r.readAsDataURL(e.target.files[0]);}}}/>
</label>
<button onClick={()=>setSigStop(entry.id)} style={{background:"#f3e8f9",border:"1px solid #d8b4fe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#7c3aed",flex:1}}>{"✍"} Sign</button>
</div>
{/* Liftgate request */}
{!entry.liftgateApplied&&!liftgateRequested[entry.id]&&<button onClick={()=>{setLiftgateRequested(p=>({...p,[entry.id]:true}));if(onLiftgate)onLiftgate(entry.id,entry.stop);}} style={{width:"100%",marginTop:6,background:"#fff7ed",border:"2px solid #fed7aa",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:700,color:"#ea580c",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
🔄 Liftgate Required (+$75)
</button>}
{liftgateRequested[entry.id]&&!entry.liftgateApplied&&<div style={{width:"100%",marginTop:6,background:"#fef3c7",border:"1px solid #fde68a",borderRadius:8,padding:"8px 12px",textAlign:"center",fontSize:11,fontWeight:600,color:"#92400e"}}>
⏳ Liftgate request sent — awaiting dispatch approval
</div>}
{entry.liftgateApplied&&<div style={{width:"100%",marginTop:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 12px",textAlign:"center",fontSize:11,fontWeight:600,color:"#16a34a"}}>
✓ Liftgate charge approved (+$75)
</div>}
</div>
)}
</div>
{entry.photos&&entry.photos.length>0&&(
<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
{entry.photos.map((p,pi)=><img key={pi} src={p} alt="delivery" style={{width:60,height:60,objectFit:"cover",borderRadius:8,border:"1px solid #e7e5e4"}}/>)}
</div>
)}
{entry.signature&&<div style={{marginTop:8,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 12px"}}><span style={{fontSize:10,color:"#16a34a",fontWeight:600}}>Received by:</span> <span style={_s.bold14}>{entry.signature}</span></div>}
{sigStop===entry.id&&<div style={{marginTop:8}}><SignaturePad onSave={d=>{onSignature(entry.id,d);setSigStop(null);}} onCancel={()=>setSigStop(null)}/></div>}
</div>
);
})}
</div>
</div>
);
}


function QuoteBuilder({customerName,pickupOptions,onAdd,onAddQuote,onBack,drivers,drvEntries}){
const hasMultiPickup=pickupOptions&&pickupOptions.length>1;
const[miles,setMiles]=useState("");const[liftgate,setLiftgate]=useState(false);const[gravel,setGravel]=useState(false);const[extraPallets,setExtraPallets]=useState(false);const[customStop,setCustomStop]=useState("");const[pickupName,setPickupName]=useState(hasMultiPickup?"":pickupOptions?.[0]?.label||"");const[originAddr,setOriginAddr]=useState(hasMultiPickup?"":pickupOptions?.[0]?.addr||"");const[selectedPickup,setSelectedPickup]=useState(hasMultiPickup?null:pickupOptions?.[0]?.label||"custom");const[destAddr,setDestAddr]=useState("");const[calcLoading,setCalcLoading]=useState(false);const[calcError,setCalcError]=useState("");const[apiKey,setApiKey]=useState(()=>{try{return window.__gbApiKey||"AIzaSyB29mVeZXedDhLVT3eMVgl07EsOneWCUu4";}catch{return"AIzaSyB29mVeZXedDhLVT3eMVgl07EsOneWCUu4";}});const[showApiInput,setShowApiInput]=useState(false);
const mi=parseFloat(miles)||0;const baseTier=getBaseTier(mi);const fuelAmt=liftgate?0:baseTier*0.15;const total=baseTier+fuelAmt+(liftgate?75:0)+(gravel?25:0)+(extraPallets?25:0);const isOneOff=customerName==="One-Off Delivery";
const calcDistance=async()=>{if(!originAddr||!destAddr){setCalcError("Enter both addresses");return;}if(!apiKey){setShowApiInput(true);setCalcError("Set API key first");return;}setCalcLoading(true);setCalcError("");try{const svc=new window.google.maps.DistanceMatrixService();svc.getDistanceMatrix({origins:[originAddr],destinations:[destAddr],travelMode:window.google.maps.TravelMode.DRIVING,unitSystem:window.google.maps.UnitSystem.IMPERIAL},(resp,status)=>{setCalcLoading(false);if(status==="OK"&&resp.rows[0]?.elements[0]?.status==="OK")setMiles(parseFloat(resp.rows[0].elements[0].distance.text.replace(/,/g,"")).toFixed(1));else setCalcError("Could not calculate");});}catch{setCalcLoading(false);setCalcError("Maps API error");}};
const loadMaps=k=>{if(window.google?.maps?.DistanceMatrixService)return;const s=document.createElement("script");s.src=`https://maps.googleapis.com/maps/api/js?key=${k}&libraries=places,geometry`;s.async=true;document.head.appendChild(s);};
const saveKey=k=>{setApiKey(k);window.__gbApiKey=k;if(k)loadMaps(k);setShowApiInput(false);};
const addQuote=drvId=>{const stopName=customStop||customerName||(isOneOff?"One-Off":"Quote");const cust=isOneOff?"One-Off Delivery":"Quote Delivery";const noteItems=[`${mi}mi`,liftgate?"LG":"Fuel",gravel?"Gravel":"",extraPallets?"4-5 Pallets":""].filter(Boolean).join(" | ");
if(pickupName&&originAddr&&onAddQuote){
  onAddQuote(cust,{puStop:pickupName,puAddr:originAddr,puNote:`Picking up for ${stopName}`},{delStop:stopName,delAddr:destAddr,delRate:total,delNote:"from "+pickupName+" | "+noteItems,pickupFrom:pickupName},drvId);
}else{
  onAdd(cust,stopName,total,drvId,{note:(pickupName?"from "+pickupName+" | ":"")+noteItems,addr:destAddr,stopType:"delivery",pickupFrom:pickupName||null});
}
};
return(
<div>
<button onClick={onBack} style={BB}>← Back</button>
<div style={{padding:"0 4px"}}><h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:700,color:isOneOff?"#6b7280":"#d97706"}}>{customerName}</h2><p style={{margin:"0 0 16px",fontSize:12,color:"#78716c"}}>No liftgate = base + 15% fuel. Liftgate = base + $75, no fuel.</p></div>
<div style={{padding:"0 4px",marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:"#57534e",display:"block",marginBottom:4}}>Customer / Stop Name</label><input value={customStop} onChange={e=>setCustomStop(e.target.value)} placeholder={isOneOff?"e.g. Smith Residence":"e.g. "+customerName+" - Customer Name"} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:14,outline:"none",background:"#fff"}}/></div>
{/* Pickup Info */}
<div style={{background:"#eff6ff",border:"2px solid #2563eb",borderRadius:14,padding:16,margin:"0 4px 12px"}}>
<div style={{fontSize:13,fontWeight:700,color:"#2563eb",marginBottom:10}}>📦 Pickup Information</div>
{pickupOptions&&pickupOptions.length>0&&<div style={{marginBottom:10}}>
<label style={{fontSize:12,fontWeight:600,color:hasMultiPickup&&!selectedPickup?"#dc2626":"#57534e",display:"block",marginBottom:6}}>{hasMultiPickup?"⚠ Select Pickup Location":"Pickup From"}</label>
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>
{pickupOptions.map(po=><button key={po.label} onClick={()=>{setSelectedPickup(po.label);setOriginAddr(po.addr);setPickupName(po.label);}} style={{padding:hasMultiPickup?"10px 16px":"6px 12px",borderRadius:10,border:selectedPickup===po.label?"2px solid #2563eb":"2px solid #e7e5e4",cursor:"pointer",fontSize:hasMultiPickup?14:12,fontWeight:700,background:selectedPickup===po.label?"#2563eb":"#fff",color:selectedPickup===po.label?"#fff":"#57534e"}}>{po.label}</button>)}
<button onClick={()=>{setSelectedPickup("custom");setOriginAddr("");setPickupName("");}} style={{padding:hasMultiPickup?"10px 16px":"6px 12px",borderRadius:10,border:selectedPickup==="custom"?"2px solid #2563eb":"2px solid #e7e5e4",cursor:"pointer",fontSize:hasMultiPickup?14:12,fontWeight:700,background:selectedPickup==="custom"?"#2563eb":"#fff",color:selectedPickup==="custom"?"#fff":"#57534e"}}>Manual</button>
</div>
{selectedPickup&&selectedPickup!=="custom"&&<div style={_s.sub11}>{originAddr}</div>}
</div>}
<div style={{display:"flex",flexDirection:"column",gap:6}}>
<div><label style={{fontSize:11,fontWeight:600,color:"#2563eb",display:"block",marginBottom:3}}>Pickup Customer / Name</label>
<input value={pickupName} onChange={e=>setPickupName(e.target.value)} placeholder="e.g. ABC Warehouse" style={{width:"100%",border:"1px solid #bfdbfe",borderRadius:8,padding:"9px 12px",fontSize:13,outline:"none",background:"#fff"}}/></div>
<div><label style={{fontSize:11,fontWeight:600,color:"#2563eb",display:"block",marginBottom:3}}>Pickup Address</label>
<AddressInput value={originAddr} onChange={setOriginAddr} placeholder="Pickup address"/></div>
</div>
</div>
<div style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:16,margin:"0 4px 12px"}}>
<div style={_s.flexBtwMb10}><span style={{fontSize:13,fontWeight:700}}>📍 Delivery Destination</span><button onClick={()=>setShowApiInput(!showApiInput)} style={{background:"#f5f5f4",border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,color:"#78716c",cursor:"pointer"}}>{apiKey?"API Key Set":"Set API Key"}</button></div>
{(customStop||(!isOneOff&&customerName))&&<div style={{fontSize:13,fontWeight:700,color:BRAND.main,marginBottom:8,padding:"6px 10px",background:BRAND.pale,borderRadius:8,borderLeft:"3px solid "+BRAND.main}}>📍 {customStop||customerName}</div>}
{showApiInput&&<div style={{marginBottom:10}}><input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Google Maps API key" style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none",marginBottom:6}}/><button onClick={()=>saveKey(apiKey)} style={{background:"#1c1917",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Save</button></div>}
{pickupName&&<div style={{fontSize:11,color:"#2563eb",fontWeight:600,marginBottom:6}}>📦 Picking up from: {pickupName}</div>}
<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
<AddressInput value={destAddr} onChange={setDestAddr} placeholder="Delivery address"/>
<button onClick={calcDistance} disabled={calcLoading||!originAddr} style={{background:originAddr?"#1c1917":"#a8a29e",color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:13,fontWeight:600,cursor:originAddr?"pointer":"default",opacity:calcLoading?0.6:1}}>{calcLoading?"Calculating…":!originAddr?"Enter pickup address first":"Calculate Distance"}</button>
</div>
{calcError&&<p style={{fontSize:12,color:"#dc2626",margin:"0 0 8px"}}>{calcError}</p>}
<div style={_s.flexC8}><label style={{fontSize:13,fontWeight:600,color:"#57534e"}}>Miles:</label><input value={miles} onChange={e=>setMiles(e.target.value)} placeholder="0" type="number" inputMode="decimal" step="0.1" style={{width:80,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:15,fontWeight:700,outline:"none",textAlign:"center"}}/>{mi>0&&<span style={{fontSize:13,fontVariantNumeric:"tabular-nums",color:"#57534e"}}>Base: {fmt(baseTier)}</span>}</div>
</div>
<div style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:16,margin:"0 4px 12px"}}><span style={{fontSize:13,fontWeight:700,display:"block",marginBottom:10}}>Add-ons</span>
{[{label:"Liftgate (+$75, replaces fuel)",val:liftgate,set:setLiftgate,color:"#dc2626"},{label:"Gravel / Uneven Driveway (+$25)",val:gravel,set:setGravel,color:"#d97706"},{label:"4-5 Pallets (+$25)",val:extraPallets,set:setExtraPallets,color:"#7c3aed"}].map((o,i)=><button key={i} onClick={()=>o.set(!o.val)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"12px 14px",marginBottom:6,borderRadius:10,cursor:"pointer",background:o.val?`${o.color}11`:"#fafaf9",border:o.val?`2px solid ${o.color}`:"1px solid #e7e5e4"}}><div style={_s.flexC10}><div style={{width:22,height:22,borderRadius:6,border:`2px solid ${o.val?o.color:"#d6d3d1"}`,background:o.val?o.color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700}}>{o.val?"✓":""}</div><span style={{fontSize:13,fontWeight:600}}>{o.label}</span></div></button>)}
{!liftgate&&mi>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:"#fffbeb",borderRadius:10,border:"1px solid #fde68a",marginTop:6}}><span style={{fontSize:13,color:"#92400e",fontWeight:600}}>15% Fuel</span><span style={{fontVariantNumeric:"tabular-nums",fontSize:13,fontWeight:700,color:"#d97706"}}>{fmt(fuelAmt)}</span></div>}
{liftgate&&<div style={{padding:"10px 14px",background:"#fef2f2",borderRadius:10,border:"1px solid #fecaca",marginTop:6}}><span style={{fontSize:12,color:"#991b1b"}}>Liftgate = no fuel charge</span></div>}
</div>
{mi>0&&<div style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:16,margin:"0 4px 12px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,paddingBottom:12,borderBottom:"2px solid #bbf7d0"}}><span style={{fontSize:15,fontWeight:700}}>Total</span><span style={{fontSize:22,fontWeight:700,fontVariantNumeric:"tabular-nums",color:"#16a34a"}}>{fmt(total)}</span></div>
<span style={{fontSize:13,fontWeight:600,color:"#57534e",display:"block",marginBottom:10}}>Assign Driver</span>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{drivers.map((drv,di)=><button key={drv.id} onClick={()=>addQuote(drv.id)} style={{background:"#fff",border:`3px solid ${DCOL[di]}`,borderRadius:14,padding:"14px 10px",cursor:"pointer",textAlign:"center"}}><div style={{width:40,height:40,borderRadius:12,background:DCOL[di],margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff",fontWeight:700}}>{drv.name.charAt(0)}</div><div style={_s.bold14}>{drv.name}</div></button>)}</div>
<button onClick={()=>addQuote(0)} style={{display:"block",width:"100%",marginTop:10,background:"#fafaf9",border:"2px dashed #d6d3d1",borderRadius:14,padding:"14px",cursor:"pointer",textAlign:"center",color:"#78716c",fontSize:14,fontWeight:600}}>Skip — Assign Later</button>
</div>}
</div>
);
}


function ManifestStop({entry,eIdx,total,drivers,onMove,onReassign,onRemove,onDelete,onUpdateInstructions,onShipPlan,onDueBy,onWeight,onLoadNum,onRate,maxLoad,onDragStart,onDragOver,onDrop,isDragOver,isDragging,onLiftgate,onSplit,driverLoadCounts}){
const[expanded,setExpanded]=useState(false);const[instrText,setInstrText]=useState(entry.instructions||"");const[dueByInput,setDueByInput]=useState(entry.dueBy||"");const[dueType,setDueType]=useState(entry.dueBy?(entry.dueBy.startsWith("After")?"after":"by"):"by");const[lastHour,setLastHour]=useState(()=>{if(entry.dueBy){const m=entry.dueBy.match(/(\d+(?::\d+)?\s*[AP]M)/);return m?m[1].replace(/:\d+/,""):""}return "";});
const[showAssign,setShowAssign]=useState(false);
const getInitials=(name)=>{const parts=name.split(" ");return parts.length>=2?(parts[0][0]+parts[1][0]).toUpperCase():name.slice(0,2).toUpperCase();};
const curDrv=drivers.find(d=>d.id===entry.driverId);
const curDrvIdx=drivers.findIndex(d=>d.id===entry.driverId);
const buildTime=(hour,mins)=>{if(!hour)return "";const[h,period]=hour.split(" ");return mins===":00"?`${h} ${period}`:`${h}${mins} ${period}`;};
const applyHour=(hour)=>{const mins=dueByInput?dueByInput.match(/:\d+/)?.[0]||":00":":00";const t=buildTime(hour,mins);setLastHour(hour);setDueByInput(dueType==="by"?"By "+t:"After "+t);};
const applyMins=(mins)=>{const hour=lastHour;if(!hour)return;const t=buildTime(hour,mins);setDueByInput(dueType==="by"?"By "+t:"After "+t);};
const c=CC[entry.customer]||CC["One-Off Delivery"];const addr=entry.addr||getAddr(entry.stop);const isP=entry.priority;const isPU=entry.stopType==="pickup";const hasI=entry.instructions?.trim();const isImetco=entry.customer==="IMETCO";const hasDue=!!entry.dueBy;
return(
<div data-drv={entry.driverId} data-idx={eIdx}>
<div onDragOver={e=>{e.preventDefault();onDragOver();}} onDrop={onDrop}
style={{display:"flex",alignItems:"center",gap:6,padding:"8px",marginBottom:expanded||isImetco?0:2,background:isDragOver?"#dcfce7":isDragging?"#fef9c3":hasDue?"#fef2f2":isPU?"#eff6ff":isP?"#fef3c7":"#fafaf9",border:isDragOver?"2px dashed #16a34a":`1px solid ${hasDue?"#fca5a5":isPU?"#bfdbfe":isP?"#fde68a":"#e7e5e4"}`,borderRadius:expanded||isImetco?"10px 10px 0 0":10,borderLeft:`4px solid ${isPU?"#2563eb":isP?"#f59e0b":c.accent}`,opacity:isDragging?0.5:1,transition:"background 0.15s,opacity 0.15s"}}>
{/* ▲▼ reorder + drag handle for desktop */}
<div style={{display:"flex",flexDirection:"column",gap:1,flexShrink:0}}>
<button draggable onDragStart={onDragStart} onClick={e=>{e.stopPropagation();onMove(-1);}} disabled={eIdx===0} style={{background:eIdx===0?"#f5f5f4":"#e7e5e4",border:"none",borderRadius:4,padding:"4px 6px",cursor:eIdx===0?"default":"pointer",fontSize:10,color:eIdx===0?"#d6d3d1":"#57534e",fontWeight:700,lineHeight:1}}>▲</button>
<button onClick={e=>{e.stopPropagation();onMove(1);}} disabled={eIdx===total-1} style={{background:eIdx===total-1?"#f5f5f4":"#e7e5e4",border:"none",borderRadius:4,padding:"4px 6px",cursor:eIdx===total-1?"default":"pointer",fontSize:10,color:eIdx===total-1?"#d6d3d1":"#57534e",fontWeight:700,lineHeight:1}}>▼</button>
</div>
<div style={_s.f1m} onClick={e=>{e.stopPropagation();setExpanded(!expanded);setInstrText(entry.instructions||"");setDueByInput(entry.dueBy||"");}}>
<div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
<span style={{fontSize:11,fontVariantNumeric:"tabular-nums",color:"#a8a29e"}}>{eIdx+1}.</span>
{isPU&&<span style={{fontSize:9,background:"#2563eb",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PICKUP</span>}
{!isPU&&<span style={_s.tag9Green}>DELIVERY</span>}
{isP&&<span style={_s.tag9Amber}>PRIORITY</span>}
{entry.status==="departed"&&<span style={_s.tag9Green}>DONE</span>}
{entry.status==="arrived"&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>ON SITE</span>}
{hasDue&&<span style={{fontSize:9,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700,display:"inline-flex",alignItems:"center",gap:2}}>{"\u23F0"} {entry.dueBy}</span>}
{entry.pickupDueBy&&<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700,display:"inline-flex",alignItems:"center",gap:2}}>{"📦"} {entry.pickupDueBy}</span>}
<span style={{fontSize:12,fontWeight:700,color:"#1c1917"}}>{entry.stop}</span>
</div>
<div style={{fontSize:10,color:c.accent,fontWeight:600}}>{entry.customer}</div>
{addr&&<div style={{fontSize:11,color:"#57534e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{addr}</div>}
{entry.note&&<div style={{fontSize:10,color:"#a8a29e"}}>{entry.note}</div>}
{hasI&&!expanded&&<div style={{fontSize:10,color:"#2563eb",marginTop:2}}>📋 {entry.instructions}</div>}
{!hasI&&!expanded&&<div style={{fontSize:9,color:"#d6d3d1",marginTop:2}}>tap to add instructions</div>}
{entry.shipPlan&&!expanded&&<div style={{fontSize:10,color:"#ea580c",fontWeight:700,marginTop:1}}>SP# {entry.shipPlan}</div>}
{entry.weight>0&&!expanded&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:1}}><span style={{fontSize:10,color:BRAND.main,fontWeight:700}}>{entry.weight.toLocaleString()} lbs {(entry.loadNum||1)>1?"(Load "+(entry.loadNum||1)+")":""}</span>{entry.pickupFrom&&entry.stopType!=="pickup"&&<span style={{fontSize:9,color:"#78716c",fontWeight:500}}>from {entry.pickupFrom}</span>}</div>}
{!(entry.weight>0)&&!expanded&&entry.pickupFrom&&entry.stopType!=="pickup"&&<div style={{fontSize:9,color:"#78716c",fontWeight:500,marginTop:1}}>from {entry.pickupFrom}</div>}
{/* Timestamps & ETA */}
{(entry.arrivedAt||entry.departedAt||entry.eta)&&!expanded&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
{entry.arrivedAt&&<span style={{fontSize:9,fontWeight:700,color:"#16a34a",background:"#f0fdf4",padding:"2px 6px",borderRadius:4,border:"1px solid #bbf7d0"}}>📍 {entry.arrivedAt}</span>}
{entry.departedAt&&<span style={{fontSize:9,fontWeight:700,color:"#16a34a",background:"#dcfce7",padding:"2px 6px",borderRadius:4,border:"1px solid #86efac"}}>✅ {entry.departedAt}</span>}
{entry.eta&&<span style={{fontSize:9,fontWeight:700,color:"#2563eb",background:"#eff6ff",padding:"2px 6px",borderRadius:4,border:"1px solid #bfdbfe"}}>🚚 {fmtEta(entry.eta)}{entry.etaDest?" → "+entry.etaDest.split(" - ")[0]:""}</span>}
</div>}
{/* Photos & POD indicators */}
{(entry.photos?.length>0||entry.signature)&&!expanded&&<div style={{display:"flex",gap:4,marginTop:3}}>
{entry.photos?.length>0&&<span style={{fontSize:9,fontWeight:700,color:"#7c3aed",background:"#f5f3ff",padding:"2px 6px",borderRadius:4,border:"1px solid #ddd6fe"}}>📸 {entry.photos.length} photo{entry.photos.length>1?"s":""}</span>}
{entry.signature&&<span style={{fontSize:9,fontWeight:700,color:"#16a34a",background:"#f0fdf4",padding:"2px 6px",borderRadius:4,border:"1px solid #bbf7d0"}}>✍ POD: {entry.signature}</span>}
</div>}
</div>
{/* Right column: rate, buttons, assign */}
<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
<span onClick={e=>e.stopPropagation()}><InlineRate value={entry.baseRate+(entry.knownLiftgate?(entry.liftgateFee||75):0)} isHourly={entry.isHourly} onSave={r=>onRate&&onRate(r)}/></span>
{!isPU&&<div style={{display:"flex",gap:3}} onClick={e=>e.stopPropagation()}>
{!entry.isHourly&&!entry.liftgateApplied&&<button onClick={()=>{if(onLiftgate)onLiftgate();}} style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:5,padding:"2px 7px",cursor:"pointer",fontSize:9,color:"#ea580c",fontWeight:700}}>+LG</button>}
{entry.isHourly&&!entry.liftgateApplied&&<button onClick={()=>{if(onLiftgate)onLiftgate();}} style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:5,padding:"2px 7px",cursor:"pointer",fontSize:9,color:"#ea580c",fontWeight:700}}>+1HR LG</button>}
{entry.liftgateApplied&&<span style={{fontSize:8,color:entry.knownLiftgate?"#16a34a":"#ea580c",fontWeight:700,background:entry.knownLiftgate?"#f0fdf4":"#fff7ed",padding:"2px 6px",borderRadius:5,border:entry.knownLiftgate?"1px solid #bbf7d0":"1px solid #fed7aa"}}>{entry.isHourly?"✓ LG +1HR":entry.knownLiftgate?"✓ LG $75":"✓ +LG $75"}</span>}
{!entry.wasSplit&&<button onClick={()=>{if(onSplit)onSplit();}} style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:5,padding:"2px 7px",cursor:"pointer",fontSize:9,color:"#2563eb",fontWeight:700}}>✂Split</button>}
{entry.wasSplit&&<span style={{fontSize:8,color:"#2563eb",fontWeight:700,background:"#eff6ff",padding:"2px 6px",borderRadius:5,border:"1px solid #bfdbfe"}}>L{entry.loadNum}</span>}
</div>}
<div style={{position:"relative",flexShrink:0}}>
<button onClick={e=>{e.stopPropagation();setShowAssign(!showAssign);}}
style={{display:"flex",alignItems:"center",gap:4,background:curDrv?DCOL[curDrvIdx]:"#e7e5e4",color:curDrv?"#fff":"#78716c",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:700,minWidth:56,justifyContent:"center"}}>
{curDrv?getInitials(curDrv.name):"Assign"} <span style={{fontSize:8,opacity:0.7}}>▾</span>
</button>
{showAssign&&<><div style={{position:"fixed",inset:0,zIndex:149}} onClick={()=>setShowAssign(false)}/>
<div style={{position:"absolute",top:"100%",right:0,zIndex:150,background:"#fff",border:"1px solid #e7e5e4",borderRadius:12,padding:6,marginTop:4,boxShadow:"0 8px 32px rgba(0,0,0,0.18)",width:160}}>
{drivers.map((dd,ddi)=>{const isCur=dd.id===entry.driverId;const numLoads=driverLoadCounts?.[dd.id]||1;return(
<div key={dd.id}>
<button onClick={e=>{e.stopPropagation();if(numLoads<=1&&!isCur){onReassign(dd.id);if(onLoadNum)onLoadNum(1);setShowAssign(false);}}}
style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 12px",marginBottom:numLoads>1?0:2,borderRadius:numLoads>1?"8px 8px 0 0":8,border:isCur?`2px solid ${DCOL[ddi]}`:"1px solid transparent",background:isCur?`${DCOL[ddi]}10`:"#fff",cursor:numLoads>1?"default":isCur?"default":"pointer"}}>
<div style={{width:32,height:32,borderRadius:8,background:DCOL[ddi],display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:800,flexShrink:0}}>{getInitials(dd.name)}</div>
<div style={{flex:1,textAlign:"left"}}>
<div style={{fontSize:12,fontWeight:700,color:isCur?DCOL[ddi]:"#1c1917"}}>{dd.name}{numLoads>1?` · ${numLoads} loads`:""}</div>
{isCur&&<div style={{fontSize:9,color:DCOL[ddi]}}>Current · L{entry.loadNum||1}</div>}
</div>
</button>
{numLoads>1&&<div style={{display:"flex",gap:3,padding:"4px 12px 8px",marginBottom:2,background:"#f5f5f4",borderRadius:"0 0 8px 8px"}}>
{Array.from({length:numLoads},(_,i)=>i+1).map(ln=><button key={ln} onClick={e=>{e.stopPropagation();onReassign(dd.id);if(onLoadNum)onLoadNum(ln);setShowAssign(false);}} style={{flex:1,padding:"6px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:(isCur&&(entry.loadNum||1)===ln)?DCOL[ddi]:"#e7e5e4",color:(isCur&&(entry.loadNum||1)===ln)?"#fff":"#57534e"}}>L{ln}</button>)}
</div>}
</div>);})}
{entry.driverId>0&&<button onClick={e=>{e.stopPropagation();onReassign(0);setShowAssign(false);}}
style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 12px",marginTop:2,borderRadius:8,border:"1px solid #fca5a5",background:"#fef2f2",cursor:"pointer"}}>
<div style={{width:32,height:32,borderRadius:8,background:"#f59e0b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:800}}>↩</div>
<div style={{fontSize:12,fontWeight:700,color:"#92400e"}}>Unassign to pool</div>
</button>}
<button onClick={e=>{e.stopPropagation();if(onDelete)onDelete();else onRemove();setShowAssign(false);}}
style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 12px",marginTop:2,borderRadius:8,border:"1px solid #fca5a5",background:"#fef2f2",cursor:"pointer"}}>
<div style={{width:32,height:32,borderRadius:8,background:"#dc2626",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:800}}>🗑</div>
<div style={{fontSize:12,fontWeight:700,color:"#dc2626"}}>Delete permanently</div>
</button>
</div></>}
</div>
</div>
</div>
{isImetco&&!expanded&&<div style={{padding:"4px 8px 6px 12px",background:"#fafaf9",border:"1px solid #e7e5e4",borderTop:"none",borderRadius:"0 0 10px 10px",borderLeft:`4px solid ${c.accent}`,marginBottom:2,display:"flex",alignItems:"center",gap:6}} onClick={e=>e.stopPropagation()}>
<span style={{fontSize:10,fontWeight:700,color:"#ea580c",flexShrink:0}}>Ship Plan #:</span>
<input value={entry.shipPlan||""} onChange={e=>onShipPlan(e.target.value)} placeholder="Enter #" onClick={e=>e.stopPropagation()}
style={{flex:1,maxWidth:120,border:entry.shipPlan?"1px solid #bbf7d0":"1px solid #fca5a5",borderRadius:6,padding:"4px 8px",fontSize:12,fontWeight:700,outline:"none",background:entry.shipPlan?"#f0fdf4":"#fff",textAlign:"center"}}/>
</div>}
{expanded&&<div style={{padding:"8px 12px 10px",marginBottom:2,background:"#fff",border:"1px solid #e7e5e4",borderTop:"none",borderRadius:"0 0 10px 10px",borderLeft:`4px solid ${isPU?"#2563eb":isP?"#f59e0b":c.accent}`}}>
<label style={_s.label}>Special instructions / notes</label>
<textarea value={instrText} onChange={e=>setInstrText(e.target.value)} placeholder="Phone #, gate code, dock info…" rows={2} onClick={e=>e.stopPropagation()}
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
<div style={{marginTop:8,background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:10,padding:"8px 10px"}}>
<div style={{display:"flex",gap:4,marginBottom:8}}>
<button onClick={e=>{e.stopPropagation();setDueType("by");if(dueByInput)setDueByInput("By "+dueByInput.replace(/^(By |After )/,""));}} style={{flex:1,padding:"6px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:dueType==="by"?"#dc2626":"#e7e5e4",color:dueType==="by"?"#fff":"#57534e"}}>{"\u23F0"} Deliver By</button>
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
<div style={_s.f1}>
<label style={{fontSize:10,fontWeight:600,color:"#57534e",display:"block",marginBottom:3}}>Weight (lbs)</label>
<input type="number" inputMode="numeric" pattern="[0-9]*" value={entry.weight||""} onChange={e=>{e.stopPropagation();if(onWeight)onWeight(e.target.value);}} onClick={e=>e.stopPropagation()} placeholder="0"
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
</div>
<div style={_s.f1}>
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
<button onClick={e=>{e.stopPropagation();onUpdateInstructions(instrText.trim());if(onDueBy)onDueBy(dueByInput||null);setExpanded(false);}} style={{background:BRAND.main,color:"#fff",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:600}}>Done</button>
</div>
</div>}
</div>
);
}


/* These are approximate coords for map plotting. When deployed with Google Maps API, */
/* real geocoding can replace these. For now they enable the route builder UI. */
const COORDS={
"5470-G Oakbrook Parkway, Norcross, GA 30093":{lat:33.9293,lng:-84.2135},
"5981 Live Oak Parkway, Norcross, GA 30093":{lat:33.9093,lng:-84.2003},
"250 Hembree Park Drive, Roswell, GA 30076":{lat:34.0567,lng:-84.3196},
"6731 Discovery Blvd #200, Mableton, GA 30126":{lat:33.7875,lng:-84.5261},
"3665 Swiftwater Park Drive, Bldg 2, Suwanee, GA 30024":{lat:34.0373,lng:-84.0824},
"1850 Westford Drive, Lithia Springs, GA 30122":{lat:33.7624,lng:-84.6434},
"1000 Union Center Drive, Suite C, Alpharetta, GA 30004":{lat:34.1268,lng:-84.2344},
"375 Buford Drive, Lawrenceville, GA 30046":{lat:33.9673,lng:-83.9856},
"103 Smokehill Lane #100, Woodstock, GA 30188":{lat:34.0839,lng:-84.4994},
"3500 Highlands Parkway SE, Smyrna, GA 30082":{lat:33.8267,lng:-84.5001},
"3690 Atlanta Highway #108, Athens, GA 30606":{lat:33.9411,lng:-83.4643},
"942 Greensboro Road, Eatonton, GA 31024":{lat:33.4168,lng:-83.2735},
"1440 Lakes Parkway, Suite 100, Lawrenceville, GA 30043":{lat:33.9602,lng:-84.0463},
"2408 Tech Center Parkway #100, Lawrenceville, GA 30043":{lat:34.0429,lng:-84.0011},
"3480 Green Pointe Parkway, Norcross, GA 30092":{lat:33.9451,lng:-84.2629},
"3230 Oakcliff Industrial Street, Doraville, GA 30340":{lat:33.9027,lng:-84.2549},
"2975 Courtyard Drive, Norcross, GA 30071":{lat:33.9555,lng:-84.2022},
"50 East Great Southwest Parkway, Atlanta, GA 30336":{lat:33.7441,lng:-84.5578},
"201 Peachtree Industrial Blvd, Sugar Hill, GA 30518":{lat:34.0787,lng:-84.058},
"6375 Peachtree Industrial Blvd, Norcross, GA 30071":{lat:33.9475,lng:-84.2371},
"5340 McEver Road, Unit G, Flowery Branch, GA 30542":{lat:34.2086,lng:-83.9145},
"1750 Corporate Drive, Suite 740, Norcross, GA 30093":{lat:33.9364,lng:-84.1418},
"605 Satellite Blvd, Suite 200, Suwanee, GA 30024":{lat:34.0277,lng:-84.0678},
"795 Branch Drive, Alpharetta, GA 30004":{lat:34.129,lng:-84.2215},
"1028 Branch Dr, Alpharetta, GA 30004":{lat:34.128,lng:-84.2184},
"2260 Northwest Parkway SE, Marietta, GA 30067":{lat:33.919,lng:-84.4895},
"3000 Miller Court West, Norcross, GA 30071":{lat:33.9541,lng:-84.217},
"6513 Warren Drive, Norcross, GA 30071":{lat:33.9079,lng:-84.2209},
"5500 South Cobb Drive SE, Bldg 100, Smyrna, GA 30080":{lat:33.8181,lng:-84.4832},
"6190 Shiloh Crossing, Suite D, Alpharetta, GA 30004":{lat:34.1153,lng:-84.1967},
"4301 Pleasantdale Road, Suite A, Doraville, GA 30340":{lat:33.9083,lng:-84.246},
"1750 Corporate Drive, Suite 700, Norcross, GA 30093":{lat:33.9364,lng:-84.1418},
"193 Stockwood Drive, Woodstock, GA 30188":{lat:34.0818,lng:-84.5212},
"4550 Atwater Court, Suite 211, Buford, GA 30518":{lat:34.1013,lng:-84.0153},
"196 Rio Circle, Decatur, GA 30030":{lat:33.78,lng:-84.2702},
"1167 Eatonton Road, Madison, GA 30650":{lat:33.5812,lng:-83.4783},
"783 Metromont Road, Hiram, GA 30141":{lat:33.8769,lng:-84.7434},
"400 Northfield Way, Roswell, GA 30075":{lat:34.0366,lng:-84.3481},
"6684 Jimmy Carter Blvd, Suite 500, Norcross, GA 30071":{lat:33.9358,lng:-84.2349},
"3045 Chastain Meadows Parkway, Suite 100, Marietta, GA 30066":{lat:34.0253,lng:-84.5573},
"560 Webb Industrial Drive, Marietta, GA 30062":{lat:33.9745,lng:-84.5359},
"5884 Peachtree Road, Atlanta, GA 30340":{lat:33.9035,lng:-84.2902},
"5984 Financial Drive, Norcross, GA 30071":{lat:33.9193,lng:-84.2079},
"415 Winkler Drive #B, Alpharetta, GA 30004":{lat:34.1379,lng:-84.2399},
"1670 Oakbrook Drive, Norcross, GA 30093":{lat:33.9122,lng:-84.1964},
"1740 Cumberland Point Drive, Suite 1, Marietta, GA 30067":{lat:33.9117,lng:-84.4901},
"1721 Oakbrook Drive, Norcross, GA 30093":{lat:33.9148,lng:-84.1972},
"1455 Oakbrook Drive, Suite 100, Norcross, GA 30093":{lat:33.9173,lng:-84.1900},
"2450 Freedom Parkway, Suite 207, Cumming, GA 30041":{lat:34.2466,lng:-84.0901},
"309 West Avenue, Dallas, GA 30157":{lat:33.9149,lng:-84.8474},
"14147 Chattahoochee Avenue, Atlanta, GA 30318":{lat:33.8068,lng:-84.4345},
"1328 Canton Road, Marietta, GA 30066":{lat:33.9837,lng:-84.5361},
"4648 South Old Peachtree Road, Norcross, GA 30071":{lat:33.9669,lng:-84.1825},
"28 Andrews Way, Villa Rica, GA 30180":{lat:33.7419,lng:-84.9439},
"4264 Winters Chapel Road, Building F, Doraville, GA 30360":{lat:33.9191,lng:-84.2706},
"14100 Veterans Memorial Highway, Villa Rica, GA 30180":{lat:33.7334,lng:-84.8472},
"50 MM Way, Pendergrass, GA 30567":{lat:34.1690,lng:-83.6861},
"1300 Williams Drive, Marietta, GA 30066":{lat:33.9948,lng:-84.5366},
"1698 Sands Place A, Marietta, GA 30067":{lat:33.9144,lng:-84.4914},
"3094 Emery Circle, Austell, GA 30168":{lat:33.7955,lng:-84.6226},
"157 North Salem Road NE, Conyers, GA 30013":{lat:33.6403,lng:-83.9752},
"191 Rio Circle, Decatur, GA 30030":{lat:33.78,lng:-84.2702},
"505 Selig Drive, Atlanta, GA 30336":{lat:33.7454,lng:-84.546},
"2935 Alcove Drive, Scottdale, GA 30079":{lat:33.7945,lng:-84.2691},
"4598-A Stonegate Industrial Blvd, Stone Mountain, GA 30083":{lat:33.8216,lng:-84.2005},
"1401 Blairs Bridge Road, Lithia Springs, GA 30122":{lat:33.7709,lng:-84.6166},
"3650 Burnett Park Drive #7106, Suwanee, GA 30024":{lat:34.0378,lng:-84.079},
"4520 South Berkeley Lake Road NW, Norcross, GA 30071":{lat:33.9718,lng:-84.1845},
"4998 South Royal Atlanta Drive, Suite C, Tucker, GA 30084":{lat:33.8567,lng:-84.1839},
"5425 Progress Court, Braselton, GA 30517":{lat:34.1494,lng:-83.801},
"1101 GA-124, Hoschton, GA 30548":{lat:34.09,lng:-83.8171},
"4251 Wayside Court SW, Suite B, Lilburn, GA 30047":{lat:33.8912,lng:-84.1151},
"4405 South Old Peachtree Road, Norcross, GA 30071":{lat:33.9724,lng:-84.176},
"10 Fesco Way, Loganville, GA 30052":{lat:33.8343,lng:-83.905},
"2146 Flinstone Drive, Suite B, Tucker, GA 30084":{lat:33.8469,lng:-84.1952},
"29 Durand Street, Woodbury, GA 30293":{lat:32.9837,lng:-84.5819},
"1256 Oakbrook Drive, Suite F, Norcross, GA 30093":{lat:33.9169,lng:-84.1816},
"3065 Trotters Parkway, Alpharetta, GA 30004":{lat:34.1272,lng:-84.2289},
"1015 Chattahoochee Avenue NW, Atlanta, GA 30318":{lat:33.8010,lng:-84.4210},
"3044 Northwoods Circle, Norcross, GA 30071":{lat:33.9592,lng:-84.1992},
"470 Woodsmill Road, Suite B, Gainesville, GA 30501":{lat:34.3008,lng:-83.8379},
"3175 Highway 212, Covington, GA 30016":{lat:33.4742,lng:-83.9325},
"11 Perimeter Center East, Atlanta, GA 30346":{lat:33.9259,lng:-84.3343},
"1275 Oakbrook Drive, Suite D, Norcross, GA 30093":{lat:33.9174,lng:-84.1848},
};
const _dynamicCoords=(()=>{try{return JSON.parse(localStorage.getItem('dd_geocode_cache')||'{}');}catch(e){return{};}})();
let _geocodeNotify=null; /* set by App to trigger re-render */
let _geocodeSaveTimer=null;
function _saveGeoCache(){if(_geocodeSaveTimer)clearTimeout(_geocodeSaveTimer);_geocodeSaveTimer=setTimeout(()=>{try{const toSave={};Object.entries(_dynamicCoords).forEach(([k,v])=>{if(!k.startsWith('_pending_')&&v&&v.lat)toSave[k]=v;});localStorage.setItem('dd_geocode_cache',JSON.stringify(toSave));}catch(e){}},1000);}
function getCoords(addr){
  if(!addr)return null;
  if(COORDS[addr])return COORDS[addr];
  if(_dynamicCoords[addr]&&_dynamicCoords[addr].lat)return _dynamicCoords[addr];
  if(!_dynamicCoords["_pending_"+addr]){
    _dynamicCoords["_pending_"+addr]=true;
    try{
    if(window.google?.maps?.Geocoder){
      const geocoder=new window.google.maps.Geocoder();
      geocoder.geocode({address:addr},(results,status)=>{
        if(status==="OK"&&results[0]){
          const loc=results[0].geometry.location;
          _dynamicCoords[addr]={lat:loc.lat(),lng:loc.lng()};
          _saveGeoCache();
          if(_geocodeNotify)_geocodeNotify();
        }else{try{
          if(window.google?.maps?.places){
            const svc=new window.google.maps.places.PlacesService(document.createElement("div"));
            svc.findPlaceFromQuery({query:addr,fields:["geometry"]},(r2,s2)=>{
              if(s2==="OK"&&r2[0]?.geometry?.location){_dynamicCoords[addr]={lat:r2[0].geometry.location.lat(),lng:r2[0].geometry.location.lng()};_saveGeoCache();if(_geocodeNotify)_geocodeNotify();}
            });
          }
        }catch(e){}}
      });
    }else if(window.google?.maps?.places){
      const svc=new window.google.maps.places.PlacesService(document.createElement("div"));
      svc.findPlaceFromQuery({query:addr,fields:["geometry"]},(r,s)=>{
        if(s==="OK"&&r[0]?.geometry?.location){_dynamicCoords[addr]={lat:r[0].geometry.location.lat(),lng:r[0].geometry.location.lng()};_saveGeoCache();if(_geocodeNotify)_geocodeNotify();}
      });
    }
    }catch(e){}
  }
  return null;
}


function RouteBuilder({entries,drivers,onAssign,onAssignBulk,onReorder,onBack,getDriverCapacity:getDrvCap,driverLocs}){
const[activeDriver,setActiveDriver]=useState(null);
/* Filter out pickups — routing only cares about deliveries */
const deliveryEntries=entries.filter(e=>e.stopType!=="pickup");
/* Initialize routeOrders from existing manifest assignments */
const[routeOrders,setRouteOrders]=useState(()=>{
const o={};drivers.forEach(d=>{o[d.id]=deliveryEntries.filter(e=>e.driverId===d.id).map(e=>e.id);});return o;
});
const[hoveredStop,setHoveredStop]=useState(null);
const mapRef=useState(null);

/* Geocode all delivery entries and compute route order from routeOrders */
const stopsWithCoords=deliveryEntries.map(e=>{
const addr=e.addr||getAddr(e.stop);
const coords=getCoords(addr);
/* Find which driver has this stop and what position it's in */
let assignedDriver=0;
let routeOrder=0;
for(const[did,ids]of Object.entries(routeOrders)){
  const idx=ids.indexOf(e.id);
  if(idx>=0){assignedDriver=Number(did);routeOrder=idx+1;break;}
}
return{...e,coords,displayAddr:addr,driverId:assignedDriver,routeOrder};
}).filter(e=>e.coords);

const stopsNoCoords=deliveryEntries.filter(e=>{
const addr=e.addr||getAddr(e.stop);
return!getCoords(addr);
});

/* Build route order for active driver */
const driverRoute=activeDriver?routeOrders[activeDriver]||[]:[];


const[rbSortMenu,setRbSortMenu]=useState(null);
const _rbCoord=(e)=>{if(!e)return null;const addr=e.addr||getAddr(e.stop);return getCoords(addr);};
const _rbOrigin={lat:33.93,lng:-84.21};
const _rbDist=(a,b)=>Math.sqrt(Math.pow(a.lat-b.lat,2)+Math.pow(a.lng-b.lng,2));
const _rbDistO=(e)=>{const c=_rbCoord(e);return c?_rbDist(_rbOrigin,c):0;};
const _rbSplit=(es)=>{
const pu=es.filter(e=>e.stopType==="pickup"||e.dueBy?.startsWith("Pickup"));
const tm=es.filter(e=>e.dueBy&&!e.dueBy.startsWith("Pickup")&&!pu.includes(e));
const rg=es.filter(e=>!pu.includes(e)&&!tm.includes(e));
return{pu,tm,rg};
};
const _rbParseTime=(db)=>{if(!db)return 9999;const m=db.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);if(!m)return 9999;let h=parseInt(m[1]);const min=parseInt(m[2]||"0");const ap=(m[3]||"").toUpperCase();if(ap==="PM"&&h!==12)h+=12;if(ap==="AM"&&h===12)h=0;return h*60+min;};
const _rbApply=(drvId,sorted)=>{
setRouteOrders(p=>({...p,[drvId]:sorted.map(e=>e.id)}));
sorted.forEach((e,i)=>onAssign(e.id,drvId));
setRbSortMenu(null);
};
const rbSortClosest=(drvId)=>{const ids=routeOrders[drvId]||[];if(ids.length<2)return;const es=ids.map(id=>deliveryEntries.find(e=>e.id===id)).filter(Boolean);const{pu,tm,rg}=_rbSplit(es);rg.sort((a,b)=>_rbDistO(a)-_rbDistO(b));tm.sort((a,b)=>_rbDistO(a)-_rbDistO(b));_rbApply(drvId,[...pu,...tm,...rg]);};
const rbSortFurthest=(drvId)=>{const ids=routeOrders[drvId]||[];if(ids.length<2)return;const es=ids.map(id=>deliveryEntries.find(e=>e.id===id)).filter(Boolean);const{pu,tm,rg}=_rbSplit(es);rg.sort((a,b)=>_rbDistO(b)-_rbDistO(a));tm.sort((a,b)=>_rbDistO(b)-_rbDistO(a));_rbApply(drvId,[...pu,...tm,...rg]);};
const rbSortByTime=(drvId)=>{const ids=routeOrders[drvId]||[];if(ids.length<2)return;const es=ids.map(id=>deliveryEntries.find(e=>e.id===id)).filter(Boolean);const{pu,tm,rg}=_rbSplit(es);tm.sort((a,b)=>_rbParseTime(a.dueBy)-_rbParseTime(b.dueBy));rg.sort((a,b)=>_rbDistO(a)-_rbDistO(b));_rbApply(drvId,[...pu,...tm,...rg]);};
const rbSortShortest=(drvId)=>{const ids=routeOrders[drvId]||[];if(ids.length<2)return;const es=ids.map(id=>deliveryEntries.find(e=>e.id===id)).filter(Boolean);const{pu}=_rbSplit(es);const all=es.filter(e=>!pu.includes(e));const sorted=[];const rem=[...all];let cur=pu.length?(_rbCoord(pu[pu.length-1])||_rbOrigin):_rbOrigin;while(rem.length){let bi=0,bd=Infinity;rem.forEach((e,i)=>{const c=_rbCoord(e);if(!c)return;const d=_rbDist(cur,c);if(d<bd){bd=d;bi=i;}});const nx=rem.splice(bi,1)[0];const nc=_rbCoord(nx);if(nc)cur=nc;sorted.push(nx);}_rbApply(drvId,[...pu,...sorted]);};
const rbSortReverse=(drvId)=>{const ids=routeOrders[drvId]||[];if(ids.length<2)return;const es=ids.map(id=>deliveryEntries.find(e=>e.id===id)).filter(Boolean);const{pu}=_rbSplit(es);const np=es.filter(e=>!pu.includes(e));np.reverse();_rbApply(drvId,[...pu,...np]);};
const rbSortGoogle=(drvId)=>{
const ids=routeOrders[drvId]||[];if(ids.length<2)return;
if(!window.google?.maps?.DirectionsService)return;
const es=ids.map(id=>deliveryEntries.find(e=>e.id===id)).filter(Boolean);const{pu}=_rbSplit(es);
const dels=es.filter(e=>!pu.includes(e));
if(dels.length<2||dels.length>23)return;
const coords=dels.map(e=>_rbCoord(e)).filter(Boolean);
if(coords.length!==dels.length){rbSortShortest(drvId);return;}
const svc=new window.google.maps.DirectionsService();
svc.route({origin:_rbOrigin,destination:coords[coords.length-1],waypoints:coords.slice(0,-1).map(c=>({location:c,stopover:true})),travelMode:window.google.maps.TravelMode.DRIVING,optimizeWaypoints:true},(result,status)=>{
  if(status==="OK"&&result.routes[0]?.waypoint_order){
    const order=result.routes[0].waypoint_order;
    const reordered=[...order.map(i=>dels[i]),dels[dels.length-1]];
    _rbApply(drvId,[...pu,...reordered]);
  }else{rbSortShortest(drvId);}
});
};
const RB_SORT_OPTIONS=[
{icon:"📍",label:"Closest → Furthest",fn:rbSortClosest},
{icon:"🏁",label:"Furthest → Closest",fn:rbSortFurthest},
{icon:"⏰",label:"By Time Constraint",fn:rbSortByTime},
{icon:"🧭",label:"Shortest Distance",fn:rbSortShortest},
{icon:"🗺",label:"Google Optimized",fn:rbSortGoogle},
{icon:"🔄",label:"Reverse Route",fn:rbSortReverse},
];

const handleStopClick=(entryId)=>{
if(!activeDriver)return;
const entry=deliveryEntries.find(e=>e.id===entryId);
if(!entry)return;
const addr=entry.addr||getAddr(entry.stop);
const siblings=deliveryEntries.filter(e=>{
  const ea=e.addr||getAddr(e.stop);
  return e.stop===entry.stop&&ea===addr;
});
const idsToAdd=siblings.map(e=>e.id);
if(driverRoute.includes(entryId)){
  setRouteOrders(p=>({...p,[activeDriver]:(p[activeDriver]||[]).filter(id=>!idsToAdd.includes(id))}));
  if(onAssignBulk)onAssignBulk(idsToAdd,0);
  else idsToAdd.forEach(id=>onAssign(id,0));
  return;
}
setRouteOrders(p=>{
  const updated={...p};
  Object.entries(updated).forEach(([did,ids])=>{
    if(Number(did)!==activeDriver){updated[did]=ids.filter(id=>!idsToAdd.includes(id));}
  });
  const cur=updated[activeDriver]||[];
  const ni=idsToAdd.filter(id=>!cur.includes(id));
  updated[activeDriver]=[...cur,...ni];
  return updated;
});
const newIds=idsToAdd.filter(id=>!(routeOrders[activeDriver]||[]).includes(id));
if(newIds.length>0){
  if(onAssignBulk)onAssignBulk(newIds,activeDriver);
  else newIds.forEach(id=>onAssign(id,activeDriver));
}
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

/* Route lines for each driver — split by loadNum */
const routeLines=[];
Object.entries(routeOrders).forEach(([did,ids])=>{
if(ids.length<2)return;
const di=drivers.findIndex(d=>d.id===Number(did));
const color=DCOL[di]||"#78716c";
/* Group IDs by loadNum */
const loadGroups={};
ids.forEach(id=>{
const s=stopsWithCoords.find(sw=>sw.id===id);
if(!s)return;
const ln=s.loadNum||1;
if(!loadGroups[ln])loadGroups[ln]=[];
loadGroups[ln].push(s);
});
Object.values(loadGroups).forEach(group=>{
const points=group.map(s=>toXY(s.coords));
if(points.length>=2)routeLines.push({color,points});
});
});

const unassignedCount=stopsWithCoords.filter(s=>!getStopDriverColor(s.id)).length;
const totalAssigned=Object.values(routeOrders).reduce((s,ids)=>s+ids.length,0);

return(
<div>
<div style={{padding:"12px 4px 8px"}}>
<div style={_s.flexBtwMb8}>
<h2 style={{margin:0,fontSize:16,fontWeight:600}}>Build Routes — {deliveryEntries.length} stops</h2>
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
onAssignStop={activeDriver?(stopId,drvId)=>handleStopClick(stopId):null} driverLocs={driverLocs}/>
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
{ids.length>=2&&<div style={{position:"relative",marginLeft:"auto"}}>
<button onClick={()=>setRbSortMenu(rbSortMenu===drv.id?null:drv.id)} style={{background:"linear-gradient(135deg,#2563eb,#1d4ed8)",border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",fontSize:10,fontWeight:700,color:"#fff"}}>⚡ Route ▾</button>
{rbSortMenu===drv.id&&<><div style={{position:"fixed",inset:0,zIndex:199}} onClick={()=>setRbSortMenu(null)}/>
<div style={{position:"absolute",top:"100%",right:0,zIndex:200,background:"#fff",border:"1px solid #e7e5e4",borderRadius:12,padding:6,marginTop:4,boxShadow:"0 12px 40px rgba(0,0,0,0.2)",width:220}}>
<div style={{fontSize:12,fontWeight:700,color:DCOL[di],padding:"6px 10px",borderBottom:"1px solid #f5f5f4",marginBottom:4}}>{drv.name} — Route Order</div>
{RB_SORT_OPTIONS.map((opt,oi)=><button key={oi} onClick={()=>opt.fn(drv.id)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",textAlign:"left",background:"none",border:"none",padding:"9px 10px",cursor:"pointer",borderRadius:8,fontSize:11,fontWeight:600,color:"#1c1917"}}><span style={{fontSize:14}}>{opt.icon}</span><span>{opt.label}</span></button>)}
</div></>}
</div>}
</div>
{/* Weight counter */}
{(()=>{const totalW=ids.reduce((sum,id)=>{const s=deliveryEntries.find(e=>e.id===id);return sum+(s?.weight||0);},0);const cap=getDrvCap?getDrvCap(d.id):10000;const pct=Math.min(100,totalW/cap*100);const col=totalW>cap?"#dc2626":totalW>cap*0.8?"#d97706":"#16a34a";return totalW>0?(
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
<div style={{flex:1,height:8,background:"#e7e5e4",borderRadius:4,overflow:"hidden"}}>
<div style={{height:"100%",width:pct+"%",background:col,borderRadius:4,transition:"width 0.3s"}}/>
</div>
<span style={{fontSize:13,fontWeight:700,color:col,fontVariantNumeric:"tabular-nums",flexShrink:0}}>{totalW.toLocaleString()}<span style={{fontSize:10,color:"#a8a29e"}}>/{(cap/1000).toFixed(0)}k</span></span>
{totalW>cap&&<span style={{fontSize:7,background:"#dc2626",color:"#fff",padding:"0px 3px",borderRadius:2,fontWeight:700}}>OVER</span>}
</div>):null;})()}
<div style={{display:"flex",flexWrap:"wrap",gap:4}}>
{ids.map((id,oi)=>{
const s=deliveryEntries.find(e=>e.id===id);
if(!s)return null;
return(
<div key={id} style={{display:"flex",alignItems:"center",gap:4,background:"#f5f5f4",borderRadius:6,padding:"3px 8px"}}>
<span style={{fontSize:10,fontWeight:700,color:DCOL[di]}}>{oi+1}.</span>
<span style={{fontSize:10,color:"#57534e"}}>{s.stop.length>20?s.stop.slice(0,20)+"…":s.stop}</span>
{s.weight>0&&<span style={{fontSize:8,color:BRAND.main,fontWeight:700}}>{(s.weight/1000).toFixed(s.weight%1000?1:0)}k</span>}
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
<div key={name} style={_s.flexC4}>
<div style={{width:8,height:8,borderRadius:4,background:c.accent}}/>
<span style={_s.sub}>{name}</span>
</div>
))}
</div>
<div style={{display:"flex",gap:8,marginTop:6}}>
{drivers.map((d,di)=>(
<div key={d.id} style={_s.flexC4}>
<div style={{width:8,height:8,borderRadius:4,background:DCOL[di],border:"2px solid #fff",boxShadow:"0 0 0 1px "+DCOL[di]}}/>
<span style={_s.sub}>{d.name.split(" ")[0]}</span>
</div>
))}
</div>
</div>
</div>
);
}


function DeliveryListItem({stop,rate,note,addr,curInstr,checked,multiSelect,accent,onCheck,onAdd,onSaveInstr,isCustom,onOpenEdit,pickupSources,ltlMode,isLG}){
const[expanded,setExpanded]=useState(false);
const[instrText,setInstrText]=useState(curInstr||"");
const[dueVal,setDueVal]=useState("");
const[dueType,setDueType]=useState("by");
const[pickupDueVal,setPickupDueVal]=useState("");
const[pickupDueType,setPickupDueType]=useState("by");
const[weightVal,setWeightVal]=useState("");
const[pickupLoc,setPickupLoc]=useState("");
const[ltlRate,setLtlRate]=useState("");
const hasInstr=curInstr?.trim();
const HOURS=["8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM"];
const dueLabel=dueVal?(dueType==="by"?"By "+dueVal:"After "+dueVal):"";
const pickupDueLabel=pickupDueVal?(pickupDueType==="by"?"Pickup By "+pickupDueVal:"Pickup After "+pickupDueVal):"";
const addWithExtras=()=>{onAdd(dueLabel||null,parseFloat(weightVal)||0,pickupDueLabel||null,pickupLoc||null,parseFloat(ltlRate)||0);setDueVal("");setPickupDueVal("");setWeightVal("");setPickupLoc("");setLtlRate("");};
return(
<div style={{marginBottom:6}}>
<div style={{display:"flex",width:"100%",textAlign:"left",background:checked?"#eff6ff":dueLabel||pickupDueLabel?"#fef2f2":"#fff",border:checked?"2px solid #2563eb":dueLabel||pickupDueLabel?"1px solid #fca5a5":"1px solid #e7e5e4",borderRadius:expanded?"12px 12px 0 0":12,padding:"12px 16px",borderLeft:`4px solid ${accent}`,alignItems:"center",gap:10}}>
{multiSelect&&<div onClick={onCheck} style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked?"#2563eb":"#d6d3d1"}`,background:checked?"#2563eb":"#fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700,flexShrink:0,cursor:"pointer"}}>{checked?"✓":""}</div>}
<div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>{if(multiSelect){onCheck();}else{addWithExtras();}}}>
<div style={{fontSize:14,fontWeight:600}}>{stop}</div>
{addr&&<div style={{fontSize:10,color:"#a8a29e"}}>{addr}</div>}
{note&&<div style={{fontSize:11,color:"#d97706",marginTop:2}}>{note}</div>}
{dueLabel&&<div style={{fontSize:10,color:dueType==="by"?"#dc2626":"#2563eb",fontWeight:700,marginTop:2}}>{"\u23F0"} {dueLabel}</div>}
{pickupDueLabel&&<div style={{fontSize:10,color:"#16a34a",fontWeight:700,marginTop:2}}>{"📦"} {pickupDueLabel}</div>}
{weightVal&&<div style={{fontSize:10,color:BRAND.main,fontWeight:700,marginTop:2}}>{parseFloat(weightVal).toLocaleString()} lbs</div>}
{hasInstr&&!expanded&&<div style={{fontSize:10,color:"#2563eb",marginTop:2}}>{"📋"} {curInstr}</div>}
{!hasInstr&&!expanded&&!dueLabel&&!pickupDueLabel&&!weightVal&&<div style={{fontSize:9,color:"#d6d3d1",marginTop:2}}>tap to add</div>}
</div>
<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
<span style={{fontVariantNumeric:"tabular-nums",fontSize:17,fontWeight:700,color:accent}}>{ltlMode&&!rate?<input type="number" inputMode="decimal" value={ltlRate} onChange={e=>{e.stopPropagation();setLtlRate(e.target.value);}} onClick={e=>e.stopPropagation()} placeholder="$0" style={{width:70,border:"2px solid #dc2626",borderRadius:8,padding:"4px 6px",fontSize:15,fontWeight:700,outline:"none",textAlign:"center",color:"#dc2626",background:"#fef2f2"}}/>:rate?fmt(rate):"Hourly"}</span>
{isLG&&<span style={{fontSize:9,fontWeight:700,color:"#16a34a",background:"#f0fdf4",padding:"2px 6px",borderRadius:4,border:"1px solid #bbf7d0"}}>+$75 LG (no fuel)</span>}
<div style={{display:"flex",gap:3}}>
<button onClick={e=>{e.stopPropagation();setInstrText(curInstr||"");setExpanded(!expanded);}} style={{background:hasInstr||dueLabel||pickupDueLabel||weightVal?"#eff6ff":"#f5f5f4",border:hasInstr||dueLabel||pickupDueLabel||weightVal?"1px solid #bfdbfe":"1px solid #e7e5e4",borderRadius:6,padding:"3px 6px",cursor:"pointer",fontSize:9,fontWeight:600,color:hasInstr||dueLabel||pickupDueLabel||weightVal?"#2563eb":"#a8a29e"}}>{"⚙"}</button>
</div>
</div>
</div>
{expanded&&<div style={{padding:"8px 12px 10px",background:"#fff",border:"1px solid #e7e5e4",borderTop:"none",borderRadius:"0 0 12px 12px",borderLeft:`4px solid ${accent}`}}>
<label style={_s.label}>Instructions for {stop}</label>
<textarea value={instrText} onChange={e=>setInstrText(e.target.value)} placeholder="Phone #, gate code, dock info…" rows={2}
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
{/* Delivery time constraint */}
<div style={{marginTop:8,background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:10,padding:"8px 10px"}}>
<div style={{display:"flex",gap:4,marginBottom:6}}>
<button onClick={e=>{e.stopPropagation();setDueType("by");}} style={{flex:1,padding:"5px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:dueType==="by"?"#dc2626":"#e7e5e4",color:dueType==="by"?"#fff":"#57534e"}}>{"\u23F0"} Deliver By</button>
<button onClick={e=>{e.stopPropagation();setDueType("after");}} style={{flex:1,padding:"5px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:dueType==="after"?"#2563eb":"#e7e5e4",color:dueType==="after"?"#fff":"#57534e"}}>Deliver After</button>
</div>
<div style={{display:"flex",gap:3,flexWrap:"wrap",alignItems:"center"}}>
{HOURS.map(t=>{const sel=dueVal===t||dueVal===t.replace(" ",":30 ");return(<button key={t} onClick={e=>{e.stopPropagation();setDueVal(dueVal===t?"":t);}} style={{padding:"5px 8px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:sel?(dueType==="by"?"#dc2626":"#2563eb"):"#fff",color:sel?"#fff":"#1c1917"}}>{t}</button>);})}
{dueVal&&<button onClick={e=>{e.stopPropagation();if(dueVal.includes(":30")){setDueVal(dueVal.replace(":30 "," "));}else{setDueVal(dueVal.replace(/(\d+) (AM|PM)/,"$1:30 $2"));}}} style={{padding:"5px 8px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:dueVal.includes(":30")?"#f59e0b":"#fef3c7",color:dueVal.includes(":30")?"#fff":"#92400e"}}>{dueVal.includes(":30")?"− :30":"+:30"}</button>}
{!dueVal&&<button style={{padding:"5px 8px",borderRadius:6,border:"none",fontSize:11,fontWeight:700,background:"#f5f5f4",color:"#d6d3d1",cursor:"default"}}>+:30</button>}
{dueVal&&<button onClick={e=>{e.stopPropagation();setDueVal("");}} style={{padding:"5px 8px",borderRadius:6,border:"1px solid #d6d3d1",cursor:"pointer",fontSize:10,background:"#fff",color:"#78716c"}}>Clear</button>}
</div>
{dueVal&&<div style={{fontSize:11,fontWeight:700,color:dueType==="by"?"#dc2626":"#2563eb",marginTop:4}}>{dueType==="by"?"By":"After"} {dueVal}</div>}
</div>
{/* Pickup time constraint */}
<div style={{marginTop:8,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"8px 10px"}}>
<div style={{display:"flex",gap:4,marginBottom:6}}>
<button onClick={e=>{e.stopPropagation();setPickupDueType("by");}} style={{flex:1,padding:"5px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:pickupDueType==="by"?"#16a34a":"#e7e5e4",color:pickupDueType==="by"?"#fff":"#57534e"}}>{"📦"} Pickup By</button>
<button onClick={e=>{e.stopPropagation();setPickupDueType("after");}} style={{flex:1,padding:"5px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:pickupDueType==="after"?"#059669":"#e7e5e4",color:pickupDueType==="after"?"#fff":"#57534e"}}>Pickup After</button>
</div>
<div style={{display:"flex",gap:3,flexWrap:"wrap",alignItems:"center"}}>
{HOURS.map(t=>{const sel=pickupDueVal===t||pickupDueVal===t.replace(" ",":30 ");return(<button key={t} onClick={e=>{e.stopPropagation();setPickupDueVal(pickupDueVal===t?"":t);}} style={{padding:"5px 8px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:sel?(pickupDueType==="by"?"#16a34a":"#059669"):"#fff",color:sel?"#fff":"#1c1917"}}>{t}</button>);})}
{pickupDueVal&&<button onClick={e=>{e.stopPropagation();if(pickupDueVal.includes(":30")){setPickupDueVal(pickupDueVal.replace(":30 "," "));}else{setPickupDueVal(pickupDueVal.replace(/(\d+) (AM|PM)/,"$1:30 $2"));}}} style={{padding:"5px 8px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:pickupDueVal.includes(":30")?"#f59e0b":"#fef3c7",color:pickupDueVal.includes(":30")?"#fff":"#92400e"}}>{pickupDueVal.includes(":30")?"− :30":"+:30"}</button>}
{!pickupDueVal&&<button style={{padding:"5px 8px",borderRadius:6,border:"none",fontSize:11,fontWeight:700,background:"#f5f5f4",color:"#d6d3d1",cursor:"default"}}>+:30</button>}
{pickupDueVal&&<button onClick={e=>{e.stopPropagation();setPickupDueVal("");}} style={{padding:"5px 8px",borderRadius:6,border:"1px solid #d6d3d1",cursor:"pointer",fontSize:10,background:"#fff",color:"#78716c"}}>Clear</button>}
</div>
{pickupDueLabel&&<div style={{fontSize:11,fontWeight:700,color:"#16a34a",marginTop:4}}>{pickupDueLabel}</div>}
</div>
{/* Weight */}
<div style={{marginTop:8,background:"#f0f5fa",border:"1px solid "+BRAND.light+"44",borderRadius:10,padding:"8px 10px"}}>
<div style={_s.flexC8}>
<label style={{fontSize:11,fontWeight:600,color:BRAND.main,flexShrink:0}}>Weight:</label>
<input type="number" inputMode="numeric" pattern="[0-9]*" value={weightVal} onChange={e=>setWeightVal(e.target.value)} onClick={e=>e.stopPropagation()} placeholder="lbs"
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center",maxWidth:120}}/>
<span style={_s.sub11}>lbs</span>
{weightVal&&<button onClick={e=>{e.stopPropagation();setWeightVal("");}} style={{background:"#fff",border:"1px solid #d6d3d1",borderRadius:5,padding:"2px 6px",cursor:"pointer",fontSize:10,color:"#78716c"}}>Clear</button>}
</div>
</div>
{/* Pickup location override for multi-pickup customers */}
{pickupSources&&pickupSources.length>1&&<div style={{marginTop:8,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"8px 10px"}}>
<label style={{fontSize:11,fontWeight:600,color:"#2563eb",display:"block",marginBottom:4}}>Pickup from:</label>
<div style={{display:"flex",gap:4}}>
{pickupSources.map(ps=>{const loc=ps.label.split(" - ").pop();return(<button key={loc} onClick={e=>{e.stopPropagation();setPickupLoc(pickupLoc===loc?"":loc);}} style={{flex:1,padding:"6px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:pickupLoc===loc?"#2563eb":"#e7e5e4",color:pickupLoc===loc?"#fff":"#57534e"}}>{loc}</button>);})}
</div>
{pickupLoc&&<div style={{fontSize:10,color:"#2563eb",fontWeight:600,marginTop:3}}>Will pick up from {pickupLoc}</div>}
</div>}
<div style={{display:"flex",gap:6,marginTop:8,justifyContent:"space-between",alignItems:"center"}}>
{onOpenEdit&&<button onClick={e=>{e.stopPropagation();onOpenEdit();}} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:10,fontWeight:700,color:"#57534e",display:"flex",alignItems:"center",gap:4}}>⚙ Edit Stop</button>}
{!onOpenEdit&&<div/>}
<div style={_s.flexG6}>
<button onClick={e=>{e.stopPropagation();setExpanded(false);}} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Cancel</button>
<button onClick={e=>{e.stopPropagation();onSaveInstr(instrText.trim());addWithExtras();setExpanded(false);}} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:700}}>+ Add to Manifest</button>
</div>
</div>
</div>}
</div>
);
}


const LS_DRIVERS="dd_drivers";
const LS_LOG="dd_log";
const LS_CUSTOM_INSTR="dd_custom_instr";
const LS_DISP_NOTES="dd_disp_notes";
const LS_EMH="dd_emh";
const DEFAULT_DRIVERS=[{id:1,name:"Trevor Seyers",phone:"404-394-9891"},{id:2,name:"Brent Dixon",phone:"678-353-9443"},{id:3,name:"Trevarr Howard",phone:"470-590-1739"},{id:4,name:"Chad Davis",phone:"678-977-4808"}];
function lsGet(key,fallback){try{const v=localStorage.getItem(key);if(v){const parsed=JSON.parse(v);return parsed;}return fallback;}catch{return fallback;}}
function lsSet(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch{}}


function DispatchApp(){
const isDesktop=useIsDesktop();
const[wo,setWo]=useState(0);
const[sd,setSd]=useState(()=>{const d=new Date().getDay();return d>=1&&d<=5?d-1:0;});
const[log,_rawSetLog]=useState({});
const dirtyDaysRef=useRef(new Set());
const prevLogRef=useRef({});
const logRef=useRef({}); /* always points to CURRENT log for .then() closures */
const saveTimerRef=useRef(null);
const[saveStatus,setSaveStatus]=useState("");

/* Keep logRef in sync with log */
logRef.current=log;

/* setLog wrapper — marks changed days as dirty. Pure — no side effects. */
const setLog=useCallback((updater)=>{
  _rawSetLog(prev=>{
    const next=typeof updater==="function"?updater(prev):updater;
    Object.keys(next).forEach(k=>{
      if(JSON.stringify(next[k])!==JSON.stringify(prev[k]||[])){
        dirtyDaysRef.current.add(k);
      }
    });
    return next;
  });
},[]);

/* useEffect runs AFTER render — log is committed, dirtyDaysRef is populated */
useEffect(()=>{
  if(dirtyDaysRef.current.size===0)return;
  if(saveTimerRef.current)clearTimeout(saveTimerRef.current);
  saveTimerRef.current=setTimeout(()=>{
    saveTimerRef.current=null;
    const toSave=[...dirtyDaysRef.current];
    if(toSave.length===0)return;
    setSaveStatus("saving...");
    let done=0;
    let anyFail=false;
    toSave.forEach(dayKey=>{
      const entries=log[dayKey]||[];
      const savedJson=JSON.stringify(entries);
      /* Parse "wo-dayIdx" — handle negative wo like "-1-0" */
      const lastDash=dayKey.lastIndexOf("-");
      const wOff=parseInt(dayKey.slice(0,lastDash));
      const dIdx=parseInt(dayKey.slice(lastDash+1));
      if(isNaN(wOff)||isNaN(dIdx)||dIdx<0||dIdx>4){
        dirtyDaysRef.current.delete(dayKey);
        done++;
        if(done===toSave.length)setSaveStatus("");
        return;
      }
      saveManifestDay(wOff,dIdx,entries).then(()=>{
        prevLogRef.current[dayKey]=savedJson;
        /* Only clear dirty if current log matches what we saved.
           logRef.current is always the LATEST log, not the closure's stale copy. */
        const currentJson=JSON.stringify(logRef.current[dayKey]||[]);
        if(currentJson===savedJson){
          dirtyDaysRef.current.delete(dayKey);
        }else{
        }
        done++;
        if(done===toSave.length){
          setSaveStatus(anyFail?"⚠ FAILED":"✓ saved");
          setTimeout(()=>setSaveStatus(""),3000);
        }
      }).catch(e=>{
        console.error("[SAVE] FAILED",dayKey,e);
        anyFail=true;
        done++;
        if(done===toSave.length)setSaveStatus("⚠ FAILED");
      });
    });
  },100);
},[log]);


const lastAutoBackupRef=useRef(0);
useEffect(()=>{
  const now=Date.now();
  /* Only backup if data exists and at least 5 min since last backup */
  const hasData=Object.values(log).some(arr=>arr&&arr.length>0);
  if(!hasData)return;
  if(now-lastAutoBackupRef.current<5*60*1000)return;
  lastAutoBackupRef.current=now;
  autoBackup("auto-full",log);
  console.log("[BACKUP] Auto-backup saved to localStorage");
},[log]);
const[view,setView]=useState("manifest");
const[selCust,setSelCust]=useState(null);
const[selPickup,setSelPickup]=useState("Norcross"); /* default pickup location for customers with multiple */
const[emserLTL,setEmserLTL]=useState(false); /* LTL mode — Emser stops billed flat rate instead of hourly */
const[selStop,setSelStop]=useState(null);
const[emH,setEmH]=useState(()=>lsGet(LS_EMH,{}));
const[toast,setToast]=useState(null);
const[drivers,setDrivers]=useState(()=>{
let d=lsGet(LS_DRIVERS,DEFAULT_DRIVERS);
/* Dedup drivers by name — keep canonical IDs (1-4), remove duplicates */
const seen=new Set();const deduped=[];
d.forEach(drv=>{const key=drv.name.toLowerCase().trim();if(!seen.has(key)){seen.add(key);deduped.push(drv);}});
/* Ensure phone numbers from DEFAULT_DRIVERS are applied */
const merged=deduped.map(drv=>{const def=DEFAULT_DRIVERS.find(dd=>dd.id===drv.id||dd.name===drv.name);if(def&&!drv.phone&&def.phone)return{...drv,phone:def.phone};return drv;});
return merged;
});
const[showDM,setShowDM]=useState(false);
const[showLinkModal,setShowLinkModal]=useState(null); /* {name, url, phone} */
const[editDrv,setEditDrv]=useState(null);const[editNm,setEditNm]=useState("");const[editPh,setEditPh]=useState("");
const[newDN,setNewDN]=useState("");const[newDP,setNewDP]=useState("");
const[quoteMode,setQuoteMode]=useState(null);
const[showCustomHrs,setShowCustomHrs]=useState(false);const[customHrsInput,setCustomHrsInput]=useState("");
const[insertPickupFor,setInsertPickupFor]=useState(null);
const[pickupCustomer,setPickupCustomer]=useState("");const[pickupStop,setPickupStop]=useState("");const[pickupAddr,setPickupAddr]=useState("");const[pickupForDel,setPickupForDel]=useState("");const[pickupNote,setPickupNote]=useState("");
const[dragSrc,setDragSrc]=useState(null);const[dragOver,setDragOver]=useState(null);
const[splitEntry,setSplitEntry]=useState(null); /* {id, totalWeight, ratio} */
const[showDatePicker,setShowDatePicker]=useState(false);
const[preAssignDriver,setPreAssignDriver]=useState(null);
const[multiSelect,setMultiSelect]=useState(false);const[multiChecked,setMultiChecked]=useState([]);
const[driverViewId,setDriverViewId]=useState(null);
const[customInstr,setCustomInstr]=useState(()=>lsGet(LS_CUSTOM_INSTR,{}));
const[showAddCustomDel,setShowAddCustomDel]=useState(false);
const[showAddPickup,setShowAddPickup]=useState(false);
const[puCustomName,setPuCustomName]=useState("");
const[puCustomAddr,setPuCustomAddr]=useState("");
const[puWeight,setPuWeight]=useState("");
const[puRate,setPuRate]=useState("");
const[puMiles,setPuMiles]=useState("");
const[puNote,setPuNote]=useState("");
const[puDelName,setPuDelName]=useState("");
const[puDelAddr,setPuDelAddr]=useState("");
const[stopEditOpen,setStopEditOpen]=useState(null); /* {cust, idx, isCustom, stop, addr, rate, note} when editing a stop permanently */
const[stopEditName,setStopEditName]=useState("");
const[stopEditAddr,setStopEditAddr]=useState("");
const[stopEditRate,setStopEditRate]=useState("");
const[stopEditNote,setStopEditNote]=useState("");
const[confirmDeleteStop,setConfirmDeleteStop]=useState(false);
const[stopOverrides,setStopOverrides]=useState(()=>{
const ovr=lsGet("dd_stop_overrides",{});
/* Auto-clean overrides for known-liftgate stops — these must use base data rates */
const cleaned={...ovr};let didClean=false;
Object.keys(cleaned).forEach(key=>{const[cu,sn]=key.split("::");const cd=CUSTOMERS[cu];if(cd?.deliveries){const sd=cd.deliveries.find(d=>typeof d!=="string"&&d.s===sn&&d.lg);if(sd){delete cleaned[key];didClean=true;}}});
if(didClean)lsSet("dd_stop_overrides",cleaned);
return cleaned;
}); /* {"Cust::StopName": {s,addr,r,n}} */
const[hiddenStops,setHiddenStops]=useState(()=>lsGet("dd_hidden_stops",[])); /* ["Cust::StopName", ...] */
/* Custom delivery stops added per customer — persisted to Firebase */
const[customStops,setCustomStops]=useState(()=>{
const stored=lsGet("dd_custom_stops",{});
/* Populate address cache */
Object.values(stored).forEach(stops=>{if(Array.isArray(stops))stops.forEach(s=>{if(s.addr&&s.s)_customAddrCache[s.s]=s.addr;});});
return stored;
}); /* {customerName: [{s:"name",r:100,addr:"...",note:"..."}]} */
const[mapActiveDrv,setMapActiveDrv]=useState(null); /* driver selected for click-to-assign on Live Routes map */
const[mapActiveLoad,setMapActiveLoad]=useState(1); /* which load number for click-to-assign */
const[driverLocs,setDriverLocs]=useState({}); /* {driverId: {lat,lng,updatedAt}} */
const[gpsEnabled,setGpsEnabled]=useState(()=>{try{const s=localStorage.getItem("gpsEnabled");return s?JSON.parse(s):{1:true,2:true,3:true,4:true};}catch{return{1:true,2:true,3:true,4:true};}}); /* per-driver Motive GPS toggle */
const toggleGps=(driverId)=>setGpsEnabled(prev=>{const next={...prev,[driverId]:!prev[driverId]};try{localStorage.setItem("gpsEnabled",JSON.stringify(next));}catch{}return next;});
const[invoices,setInvoices]=useState([]);
const[showInvoice,setShowInvoice]=useState(null); /* customer name to generate invoice for */

const[rpActive,setRpActive]=useState(null);
const[rpOrders,setRpOrders]=useState({});
const rpOrdersRef=useRef({});
const[rpDragSrc,setRpDragSrc]=useState(null);
const[rpDragOver,setRpDragOver]=useState(null);
const[rpShowUnassigned,setRpShowUnassigned]=useState(true);
const[rpInited,setRpInited]=useState(false);

const[rpOptMenu,setRpOptMenu]=useState(null); /* driverId when open */
const[customDelName,setCustomDelName]=useState("");
const[customDelAddr,setCustomDelAddr]=useState("");
const[customDelRate,setCustomDelRate]=useState("");
const[customDelNote,setCustomDelNote]=useState("");
const[customDelPermanent,setCustomDelPermanent]=useState(true);
const[oneOffCust,setOneOffCust]=useState("");
const[notifyDriver,setNotifyDriver]=useState(null); /* driver id for notify modal */
const[notifyCustomMsg,setNotifyCustomMsg]=useState("");
const[notifications,setNotifications]=useState({}); /* {driverId: [{msg,time,type},...]} */
const[showChat,setShowChat]=useState(false);
const[chatMessages,setChatMessages]=useState([]);
const[chatInput,setChatInput]=useState("");
const[chatLoading,setChatLoading]=useState(false);
const[chatImage,setChatImage]=useState(null); /* {base64, preview} */
/* 2-Way Messaging */
const[showMsgPanel,setShowMsgPanel]=useState(false);
const[showMoreMenu,setShowMoreMenu]=useState(false);
const[geocodeVer,setGeocodeVer]=useState(0);
useEffect(()=>{_geocodeNotify=()=>setGeocodeVer(v=>v+1);return()=>{_geocodeNotify=null;};},[]);
const[msgChannel,setMsgChannel]=useState(null); /* null=group, driverId=private */
const[msgInput,setMsgInput]=useState("");
const[allMessages,setAllMessages]=useState({}); /* {channelKey: [{id,from,text,time,fromName},...]} */
const[histSearch,setHistSearch]=useState("");
const[histCustFilter,setHistCustFilter]=useState("");
const[histDrvFilter,setHistDrvFilter]=useState("");
const[histWeekRange,setHistWeekRange]=useState(4);
const[histMode,setHistMode]=useState("deliveries"); /* deliveries | photos | emser */
const[lightboxPhoto,setLightboxPhoto]=useState(null);
const[histDetail,setHistDetail]=useState(null); /* selected history entry for POD detail */
const[emserShifts,setEmserShifts]=useState(()=>lsGet("dd_emser_shifts",{})); /* {dayKey: [{id,driverId,start,end},...]} */
const[dispNotes,setDispNotes]=useState(()=>lsGet(LS_DISP_NOTES,{}));
const[editingNote,setEditingNote]=useState(false);
const[noteText,setNoteText]=useState("");

const[savedQuotes,setSavedQuotes]=useState(()=>lsGet("dd_quotes",[]));
const[quoteFormOpen,setQuoteFormOpen]=useState(false);
const[quoteTab,setQuoteTab]=useState("current"); /* current | past */
const[aiQuoteInput,setAiQuoteInput]=useState("");
const[aiQuoteLoading,setAiQuoteLoading]=useState(false);
const[qCust,setQCust]=useState("");
const[qPickup,setQPickup]=useState(""); /* selected pickup location for quote customers */
const[qPickupName,setQPickupName]=useState(""); /* pickup customer name */
const[qPickupAddr,setQPickupAddr]=useState(""); /* pickup address */
const[qStop,setQStop]=useState("");
const[qCustomMode,setQCustomMode]=useState(false);
const[qAddr,setQAddr]=useState("");
const[qRate,setQRate]=useState("");
const[qNote,setQNote]=useState("");
const[qMiles,setQMiles]=useState("");
const[qLiftgate,setQLiftgate]=useState(false);
const[qGravel,setQGravel]=useState(false);
const[qExtraPallets,setQExtraPallets]=useState(false);
const[qCalcLoading,setQCalcLoading]=useState(false);
const[qCalcError,setQCalcError]=useState("");
const calcQuoteMiles=()=>{
  let origin=qPickupAddr||"";
  if(!origin){
    const qc=QUOTE_CUSTOMERS.find(q=>q.name===qCust);
    if(qc&&qc.pickups){
      if(qPickup){const p=qc.pickups.find(x=>x.label===qPickup);if(p)origin=p.addr;}
      else if(qc.pickups.length===1)origin=qc.pickups[0].addr;
    }
    if(!origin){const ps=PICKUP_SOURCES.find(s=>s.customer===qCust);if(ps)origin=ps.addr;}
  }
  if(!origin||!qAddr){setQCalcError(!origin?"Enter pickup address":"Enter delivery address");return;}
  if(!window.google?.maps?.DistanceMatrixService){setQCalcError("Google Maps not loaded");return;}
  setQCalcLoading(true);setQCalcError("");
  try{
    const svc=new window.google.maps.DistanceMatrixService();
    svc.getDistanceMatrix({origins:[origin],destinations:[qAddr],travelMode:window.google.maps.TravelMode.DRIVING,unitSystem:window.google.maps.UnitSystem.IMPERIAL},(resp,status)=>{
      setQCalcLoading(false);
      if(status==="OK"&&resp.rows[0]?.elements[0]?.status==="OK"){
        setQMiles(parseFloat(resp.rows[0].elements[0].distance.text.replace(/,/g,"")).toFixed(1));
      }else{setQCalcError("Could not calculate distance");}
    });
  }catch(e){setQCalcLoading(false);setQCalcError("Maps error");}
};
const[qPushDay,setQPushDay]=useState(null); /* {quoteId, targetDk} */
const[puCalcLoading,setPuCalcLoading]=useState(false);
const[puCalcError,setPuCalcError]=useState("");
const calcPuMiles=(fromAddr,toAddr)=>{
  if(!fromAddr||!toAddr){setPuCalcError("Enter both addresses");return;}
  if(!window.google?.maps?.DistanceMatrixService){setPuCalcError("Google Maps not loaded");return;}
  setPuCalcLoading(true);setPuCalcError("");
  try{const svc=new window.google.maps.DistanceMatrixService();
  svc.getDistanceMatrix({origins:[fromAddr],destinations:[toAddr],travelMode:window.google.maps.TravelMode.DRIVING,unitSystem:window.google.maps.UnitSystem.IMPERIAL},(resp,status)=>{
    setPuCalcLoading(false);
    if(status==="OK"&&resp.rows[0]?.elements[0]?.status==="OK"){setPuMiles(parseFloat(resp.rows[0].elements[0].distance.text.replace(/,/g,"")).toFixed(1));}
    else{setPuCalcError("Could not calculate");}
  });}catch(e){setPuCalcLoading(false);setPuCalcError("Maps error");}
};

const wd=getWeekDates(wo);const dk=`${wo}-${sd}`;const dl=log[dk]||[];
const emDk=getFbKey(wo,sd); /* date-based key for Emser hours/shifts */
const showToast=useCallback(m=>{setToast(m);setTimeout(()=>setToast(null),2000);},[]);

/* Sync rpOrders from live manifest whenever Routes tab is opened */
useEffect(()=>{rpOrdersRef.current=rpOrders;},[rpOrders]);
useEffect(()=>{
  if(view==="routes"&&!rpInited&&dl.length>0){
    const o={};drivers.forEach(d=>{o[d.id]=dl.filter(e=>e.driverId===d.id).map(e=>e.id);});
    setRpOrders(o);
    setRpInited(true);
  }
  if(view!=="routes"&&rpInited){
    /* Auto-apply routes when leaving the Routes tab */
    const orders=rpOrdersRef.current;
    Object.entries(orders).forEach(([did,ids])=>{
      ids.forEach(id=>{const e=dl.find(x=>x.id===id);if(e&&e.driverId!==Number(did))reassign(id,Number(did));});
      if(ids.length>0)reorderDriver(Number(did),ids);
    });
    setRpInited(false);
  }
},[view,dl.length,rpInited]);

const firebaseReady=useRef(false);
const prevEmHRef=useRef({}); /* tracks last saved emH values */
const prevNotesRef=useRef({}); /* tracks last saved dispNotes values */
const prevShiftsRef=useRef({}); /* tracks last saved emserShifts JSON */
const dirtyShiftsRef=useRef(new Set()); /* tracks emDk keys with unsaved local changes */
const pendingSaveKeys=useRef(new Set()); /* tracks keys waiting for FB echo confirmation */
const[fbConnected,setFbConnected]=useState(false);
const driverChangeSource=useRef("init"); /* "init" | "firebase" | "user" */
const dirtyDriversRef=useRef(false); /* true when user has unsaved driver changes */
const driverLocalTs=useRef(parseInt(localStorage.getItem("dd_drivers_ts")||"0"));


useEffect(()=>{
  _whenFB(async()=>{
    firebaseReady.current=true;
    setFbConnected(true);
    try{
      await window._fbOps.write("_test/ping",{t:Date.now()});
      console.log("[FB] ✓ Firestore connected and working");
    }catch(e){
      console.error("[FB] ✗ Firestore test FAILED:",e.code||"",e.message||e);
      setSaveStatus("⚠ DB error");
    }
  });
  const unsubDrivers=subscribeDrivers((fbDrivers,fbTs)=>{
    if(dirtyDriversRef.current)return; /* Skip while user changes being saved */
    if(fbDrivers&&fbDrivers.length>0){
      /* If local changes are newer than Firebase, push local to Firebase instead */
      if(driverLocalTs.current>0&&driverLocalTs.current>(fbTs||0)){
        saveDrivers(drivers).catch(e=>console.error("Drv push:",e));
        return;
      }
      driverChangeSource.current="firebase";
      setDrivers(prev=>{
        const localOnly=prev.filter(ld=>!fbDrivers.find(fd=>fd.id===ld.id));
        if(localOnly.length>0)return[...fbDrivers,...localOnly];
        return fbDrivers;
      });
    }
  });
  const unsubEmser=subscribeEmserHours((fbEmH)=>{
    setEmH(prev=>{
      const merged={...prev};
      let changed=false;
      Object.entries(fbEmH).forEach(([k,v])=>{
        const prevVal=prevEmHRef.current[k];
        const localVal=prev[k];
        /* Only accept Firebase data if local hasn't changed since last sync */
        if(localVal===prevVal||localVal===undefined){
          if(v!==localVal){merged[k]=v;changed=true;}
        }
        prevEmHRef.current[k]=v;
      });
      return changed?merged:prev;
    });
  });
  const unsubNotes=subscribeDispatchNotes((fbNotes)=>{
    setDispNotes(prev=>{
      const merged={...prev};
      let changed=false;
      Object.entries(fbNotes).forEach(([k,v])=>{
        const prevVal=prevNotesRef.current[k];
        const localVal=prev[k];
        if(localVal===prevVal||localVal===undefined||localVal===""){
          if(v!==localVal){merged[k]=v;changed=true;}
        }
        prevNotesRef.current[k]=v;
      });
      return changed?merged:prev;
    });
  });
  const unsubShifts=subscribeEmserShifts((fbShifts)=>{
    setEmserShifts(prev=>{
      const merged={...prev};
      let changed=false;
      Object.entries(fbShifts).forEach(([k,v])=>{
        const fbJson=JSON.stringify(v);
        const localJson=JSON.stringify(prev[k]||[]);
        /* If this key was pending save confirmation, check if FB matches local */
        if(pendingSaveKeys.current.has(k)){
          if(fbJson===localJson){
            /* FB echo matches — safe to clear dirty */
            pendingSaveKeys.current.delete(k);
            dirtyShiftsRef.current.delete(k);
          }
          return; /* Either way, keep local data while pending */
        }
        if(dirtyShiftsRef.current.has(k))return;
        if(fbJson!==localJson){
          merged[k]=v;
          changed=true;
        }
        prevShiftsRef.current[k]=fbJson;
      });
      return changed?merged:prev;
    });
  });
  const unsubQuotes=subscribeQuotes((fbQuotes)=>{setSavedQuotes(fbQuotes);});
  const unsubLocs=subscribeDriverLocations((locs)=>{setDriverLocs(locs);});
  const unsubInv=subscribeInvoices((inv)=>{setInvoices(inv);});
  const unsubCustomStops=subscribeCustomStops((data)=>{
    setCustomStops(prev=>{
      /* Merge Firebase data — don't overwrite local changes */
      const merged={...prev};
      let changed=false;
      Object.entries(data).forEach(([cust,stops])=>{
        const fbJson=JSON.stringify(stops);
        const localJson=JSON.stringify(prev[cust]||[]);
        /* Accept Firebase data only if local hasn't been modified */
        if(!prev[cust]||prev[cust].length===0||localJson===fbJson){
          if(fbJson!==localJson){merged[cust]=stops;changed=true;}
        }else if(stops.length>prev[cust].length){
          /* Firebase has MORE stops — accept it (likely another device added) */
          merged[cust]=stops;changed=true;
        }
      });
      if(changed)lsSet("dd_custom_stops",merged);
      return changed?merged:prev;
    });
    /* Populate address cache from custom stops */
    Object.values(data).forEach(stops=>{if(Array.isArray(stops))stops.forEach(s=>{if(s.addr&&s.s)_customAddrCache[s.s]=s.addr;});});
  });
  const unsubStopOvr=subscribeStopOverrides((data)=>{
    /* Remove overrides for known-liftgate stops */
    const clean={};let removed=false;
    Object.entries(data).forEach(([key,val])=>{const[cu,sn]=key.split("::");const cd=CUSTOMERS[cu];const isLG=cd?.deliveries?.find(d=>typeof d!=="string"&&d.s===sn&&d.lg);if(isLG){removed=true;}else{clean[key]=val;}});
    if(removed)saveStopOverrides(clean).catch(()=>{});
    setStopOverrides(prev=>{
      const merged={...prev,...clean};
      /* Also clean any local lg overrides */
      Object.keys(merged).forEach(key=>{const[cu,sn]=key.split("::");const cd=CUSTOMERS[cu];if(cd?.deliveries?.find(d=>typeof d!=="string"&&d.s===sn&&d.lg))delete merged[key];});
      const changed=JSON.stringify(merged)!==JSON.stringify(prev);
      if(changed)lsSet("dd_stop_overrides",merged);
      return changed?merged:prev;
    });
    Object.values(clean).forEach(o=>{if(o&&o.addr&&o.s)_customAddrCache[o.s]=o.addr;});
  });
  const unsubHidden=subscribeHiddenStops((data)=>{
    setHiddenStops(prev=>{
      if(Array.isArray(data)&&Array.isArray(prev)){
        /* Merge — keep any locally hidden stops not yet in Firebase */
        const merged=[...new Set([...prev,...data])];
        const changed=JSON.stringify(merged)!==JSON.stringify(prev);
        if(changed)lsSet("dd_hidden_stops",merged);
        return changed?merged:prev;
      }
      lsSet("dd_hidden_stops",data);
      return data;
    });
  });
  let unsubCap;
  _whenFB(()=>{unsubCap=window._fbOps.onDoc("config/driverCapacity",(data)=>{
    if(data&&data.data){setDriverCapacity(data.data);lsSet("dd_driver_capacity",data.data);}
  });});
  return()=>{unsubDrivers();unsubEmser();unsubNotes();unsubShifts();unsubQuotes();unsubLocs();unsubInv();unsubCustomStops();unsubStopOvr();unsubHidden();if(unsubCap)unsubCap();};
},[]);

/* ═══ MOTIVE GPS POLLING ═══ */
useEffect(()=>{
  const matchDriver=(motiveDriver)=>{
    if(!motiveDriver||!motiveDriver.name)return null;
    const mName=motiveDriver.name.toLowerCase();
    return drivers.find(d=>mName.includes(d.name.split(" ")[1]?.toLowerCase())||mName.includes(d.name.split(" ")[0]?.toLowerCase()));
  };
  const poll=async()=>{
    try{
      const r=await fetch("/api/motive-gps");
      if(!r.ok)return;
      const data=await r.json();
      if(!data.vehicles)return;
      const locs={};
      data.vehicles.forEach(v=>{
        if(!v.lat||!v.lng)return;
        const drv=matchDriver(v.driver);
        if(drv){
          /* Only update location if GPS toggle is ON for this driver */
          if(gpsEnabled[drv.id]===false)return;
          locs[drv.id]={lat:v.lat,lng:v.lng,speed:v.speed,bearing:v.bearing,state:v.state,truck:v.number,city:v.city,locState:v.locState,updatedAt:v.locatedAt||data.fetchedAt,source:"motive"};
        }
      });
      if(Object.keys(locs).length>0)setDriverLocs(prev=>({...prev,...locs}));
    }catch(e){console.warn("[MOTIVE] Poll failed:",e.message);}
  };
  poll();
  const interval=setInterval(poll,60000);
  return()=>clearInterval(interval);
},[drivers,gpsEnabled]);

/* Subscribe to Firebase — accept data ONLY for clean (non-dirty) days */
useEffect(()=>{
  const unsubManifests=subscribeManifests(wo,(fbData)=>{
    _rawSetLog(prev=>{
      const updated={...prev};
      let changed=false;
      Object.entries(fbData).forEach(([fbKey,payload])=>{
        const dayIdx=payload.dayIdx;
        const entries=(payload.entries||[]).map(e=>{
          if(e.customer&&!e.isHourly&&e.stopType!=="pickup"){
            const cd=CUSTOMERS[e.customer];
            if(cd?.deliveries){
              const sd=cd.deliveries.find(d=>typeof d!=="string"&&d.s===e.stop&&d.lg);
              if(sd){return{...e,fuelPct:0,liftgateApplied:true,knownLiftgate:true,liftgateFee:e.liftgateFee||75,note:e.note==="Known liftgate — no fuel"?"$"+(sd.r||e.baseRate)+" + $75 LG":e.note};}
            }
          }
          return e;
        });
        const lk=`${wo}-${dayIdx}`;
        /* SKIP if this day has unsaved user changes */
        if(dirtyDaysRef.current.has(lk)){
          return;
        }
        const fbJson=JSON.stringify(entries);
        if(fbJson!==JSON.stringify(prev[lk]||[])){
          updated[lk]=entries;
          prevLogRef.current[lk]=fbJson;
          changed=true;
        }
      });
      return changed?updated:prev;
    });
  });
  return()=>unsubManifests();
},[wo]);

/* Save effect removed — setLog wrapper saves directly to Firebase on every change */

useEffect(()=>{
  if(!firebaseReady.current)return;
  if(driverChangeSource.current==="firebase"){driverChangeSource.current="user";return;}
  /* Save immediately — no debounce to avoid React cleanup cancelling the timer */
  saveDrivers(drivers).then(()=>{setTimeout(()=>{dirtyDriversRef.current=false;},1000);}).catch(e=>console.error("Drv save:",e));
},[drivers]);

useEffect(()=>{
  if(!firebaseReady.current)return;
  const emKey=`${emDk}-emser`;
  const val=emH[emKey];
  if(val===undefined)return;
  if(prevEmHRef.current[emKey]===val)return;
  prevEmHRef.current[emKey]=val;
  const timer=setTimeout(()=>{
    saveEmserHours(emKey,val).catch(e=>console.error("EmH save:",e));
  },500);
  return()=>clearTimeout(timer);
},[emH,emDk]);

useEffect(()=>{
  if(!firebaseReady.current)return;
  const val=dispNotes[emDk];
  if(val===undefined)return;
  if(prevNotesRef.current[emDk]===val)return;
  prevNotesRef.current[emDk]=val;
  const timer=setTimeout(()=>{
    saveDispatchNote(emDk,val||"").catch(e=>console.error("Note save:",e));
  },500);
  return()=>clearTimeout(timer);
},[dispNotes,emDk]);

/* Shifts save handled by global effect below */


useEffect(()=>{lsSet(LS_DRIVERS,drivers);if(driverChangeSource.current!=="firebase"){const ts=Date.now();localStorage.setItem("dd_drivers_ts",String(ts));driverLocalTs.current=ts;}},[drivers]);
useEffect(()=>{lsSet(LS_CUSTOM_INSTR,customInstr);},[customInstr]);
useEffect(()=>{lsSet(LS_DISP_NOTES,dispNotes);},[dispNotes]);
useEffect(()=>{lsSet(LS_EMH,emH);},[emH]);
/* Sync emH with shift+liftgate totals */
useEffect(()=>{
const{totalMins}=getShiftSummary(emDk);
if(!totalMins)return;
const lgCount=dl.filter(e=>e.isHourly&&e.liftgateApplied).length;
const distBonus=dl.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length;
const billedMins=totalMins+(lgCount+distBonus)*60;
const hrs=Math.round(billedMins/15)*15/60;
const key=`${emDk}-emser`;
setEmH(p=>{if(p[key]===hrs)return p;return{...p,[key]:hrs};});
},[dl,emDk,emserShifts]);
useEffect(()=>{lsSet("dd_emser_shifts",emserShifts);},[emserShifts]);
const prevShiftsSaveRef=useRef(JSON.stringify(emserShifts));
useEffect(()=>{
  if(!firebaseReady.current)return;
  const json=JSON.stringify(emserShifts);
  if(json===prevShiftsSaveRef.current)return;
  const prev=JSON.parse(prevShiftsSaveRef.current);
  prevShiftsSaveRef.current=json;
  const changedKeys=[];
  Object.entries(emserShifts).forEach(([dayKey,shifts])=>{
    if(JSON.stringify(shifts)!==JSON.stringify(prev[dayKey]||[]))changedKeys.push(dayKey);
  });
  if(!changedKeys.length)return;
  const timer=setTimeout(()=>{
    Promise.all(changedKeys.map(dayKey=>
      saveEmserShifts(dayKey,emserShifts[dayKey]||[]).then(()=>{
        prevShiftsRef.current[dayKey]=JSON.stringify(emserShifts[dayKey]||[]);
      })
    )).then(()=>{
      /* Don't clear dirty on timer — let the subscription clear it when FB echo matches */
      changedKeys.forEach(k=>{pendingSaveKeys.current.add(k);});
    }).catch(e=>console.error("Shifts save:",e));
  },500);
  return()=>clearTimeout(timer);
},[emserShifts]);
useEffect(()=>{lsSet("dd_quotes",savedQuotes);},[savedQuotes]);
useEffect(()=>{lsSet("dd_custom_stops",customStops);},[customStops]);
const prevCustomStopsRef=useRef(JSON.stringify(customStops));
useEffect(()=>{
  if(!firebaseReady.current)return;
  const json=JSON.stringify(customStops);
  if(json===prevCustomStopsRef.current)return; /* No actual change */
  prevCustomStopsRef.current=json;
  const timer=setTimeout(()=>{saveCustomStops(customStops).catch(e=>console.error("CustomStops save:",e));},500);
  return()=>clearTimeout(timer);
},[customStops]);
useEffect(()=>{lsSet("dd_stop_overrides",stopOverrides);},[stopOverrides]);
const prevStopOvrRef=useRef(JSON.stringify(stopOverrides));
useEffect(()=>{
  if(!firebaseReady.current)return;
  const json=JSON.stringify(stopOverrides);
  if(json===prevStopOvrRef.current)return;
  prevStopOvrRef.current=json;
  const timer=setTimeout(()=>{saveStopOverrides(stopOverrides).catch(e=>console.error("StopOverrides save:",e));},500);
  return()=>clearTimeout(timer);
},[stopOverrides]);
useEffect(()=>{lsSet("dd_hidden_stops",hiddenStops);},[hiddenStops]);
const prevHiddenRef=useRef(JSON.stringify(hiddenStops));
useEffect(()=>{
  if(!firebaseReady.current)return;
  const json=JSON.stringify(hiddenStops);
  if(json===prevHiddenRef.current)return;
  prevHiddenRef.current=json;
  const timer=setTimeout(()=>{saveHiddenStops(hiddenStops).catch(e=>console.error("HiddenStops save:",e));},500);
  return()=>clearTimeout(timer);
},[hiddenStops]);


const openStopEdit=(cust,idx,isCustom,stop,addr,rate,note)=>{
  setStopEditOpen({cust,idx,isCustom,stop,addr,rate,note});
  setStopEditName(stop);setStopEditAddr(addr||"");setStopEditRate(rate?String(rate):"");setStopEditNote(note||"");setConfirmDeleteStop(false);
};
const saveStopEdit=()=>{
  if(!stopEditOpen||!stopEditName.trim())return;
  const{cust,idx,isCustom,stop:origStop}=stopEditOpen;
  if(isCustom){
    /* Custom stop — edit in place */
    const hardLen=CUSTOMERS[cust]?.deliveries?.length||0;
    const ci=idx-hardLen;
    setCustomStops(p=>{const arr=[...(p[cust]||[])];if(ci>=0&&ci<arr.length){arr[ci]={...arr[ci],s:stopEditName.trim(),addr:stopEditAddr.trim(),r:parseFloat(stopEditRate)||0,n:stopEditNote.trim()||null};}return{...p,[cust]:arr};});
  }else{
    /* Built-in stop — save override keyed by "Customer::OriginalStopName" */
    const key=cust+"::"+origStop;
    setStopOverrides(p=>({...p,[key]:{s:stopEditName.trim(),addr:stopEditAddr.trim(),r:parseFloat(stopEditRate)||0,n:stopEditNote.trim()||null}}));
  }
  if(stopEditAddr.trim())_customAddrCache[stopEditName.trim()]=stopEditAddr.trim();
  showToast(stopEditName.trim()+" updated");
  setStopEditOpen(null);
};
const deleteStopPermanent=()=>{
  if(!stopEditOpen)return;
  const{cust,idx,isCustom,stop}=stopEditOpen;
  if(isCustom){
    /* Custom stop — remove permanently */
    const hardLen=CUSTOMERS[cust]?.deliveries?.length||0;
    const ci=idx-hardLen;
    setCustomStops(p=>({...p,[cust]:(p[cust]||[]).filter((_,i)=>i!==ci)}));
    if(stop)delete _customAddrCache[stop];
    showToast(stop+" permanently deleted");
  }else{
    /* Built-in stop — hide it + remove any override */
    const key=cust+"::"+stop;
    setHiddenStops(p=>[...p.filter(k=>k!==key),key]);
    setStopOverrides(p=>{const next={...p};delete next[key];return next;});
    showToast(stop+" removed permanently");
  }
  setStopEditOpen(null);setConfirmDeleteStop(false);
};
/* Restore a hidden built-in stop */
const restoreHiddenStop=(key)=>{
  setHiddenStops(p=>p.filter(k=>k!==key));
  showToast("Stop restored");
};


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
const q={id:Date.now()+Math.random(),num:savedQuotes.length+1,customer:qCust,stop:qStop,addr:qAddr,rate:finalRate,miles:miles||null,liftgate:qLiftgate,gravel:qGravel,extraPallets:qExtraPallets,note:qNote,pickup:qPickup||null,pickupName:qPickupName||null,pickupAddr:qPickupAddr||null,calc,createdAt:new Date().toISOString(),status:"pending"};
setSavedQuotes(p=>[q,...p]);
saveQuoteToFB(q).catch(e=>console.error("Quote save:",e));
setQCust("");setQStop("");setQAddr("");setQRate("");setQNote("");setQMiles("");setQLiftgate(false);setQGravel(false);setQExtraPallets(false);setQPickup("");setQPickupName("");setQPickupAddr("");setQCustomMode(false);setQuoteFormOpen(false);
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

const unplanQuote=(quoteId)=>{
const q=savedQuotes.find(x=>x.id===quoteId);
if(!q||!q.pushedTo)return;
/* Remove the entry from the manifest day */
const targetDk=q.pushedTo;
setLog(p=>{
  const dayEntries=p[targetDk]||[];
  const filtered=dayEntries.filter(e=>!(e.stop===q.stop&&e.customer===q.customer&&Math.abs(e.baseRate-(q.rate||0))<1));
  return{...p,[targetDk]:filtered};
});
setSavedQuotes(p=>p.map(x=>x.id===quoteId?{...x,status:"pending",pushedTo:null}:x));
const updated={...q,status:"pending",pushedTo:null};
saveQuoteToFB(updated).catch(e=>console.error("Quote unplan:",e));
showToast("Quote unplanned — removed from manifest");
};

const aiGenerateQuote=async(input)=>{
if(!input.trim())return;
setAiQuoteLoading(true);
try{
const custList=Object.keys(CUSTOMERS).join(", ");
const prompt=`You are a delivery dispatch quote assistant for Davis Delivery Service in Atlanta, GA.

Available customers: ${custList}

Rate structure:
- Emser Tile: $102.50/hr, 4hr minimum
- Florida Tile: Flat rate + 15% fuel surcharge
- Specialty: Flat rate (fuel included)
- IMETCO: Flat rate per delivery
- MM Systems: Flat rate + 30% fuel surcharge
- Quote/One-Off: Base rate by miles: 0-15mi=$125, 15-25mi=$150, 25-35mi=$175, 35-50mi=$200, 50+mi=$250. Add $75 for liftgate (replaces fuel). No liftgate = base + 15% fuel. Gravel/uneven +$25. 4-5 pallets +$25.

The user says: "${input}"

Generate a quote. Respond ONLY with valid JSON (no markdown, no backticks):
{"customer":"customer name or One-Off Delivery","stop":"delivery location name","addr":"full address if mentioned","miles":number or null,"liftgate":true/false,"gravel":true/false,"extraPallets":true/false,"rate":calculated total rate,"note":"any notes","breakdown":"human readable breakdown"}`;

const r=await fetch("/.netlify/functions/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:prompt}]})});
if(!r.ok)throw new Error("API error");
const data=await r.json();
const text=data.content?.[0]?.text||data.text||"";
const clean=text.replace(/```json|```/g,"").trim();
const parsed=JSON.parse(clean);
const q={id:Date.now()+Math.random(),num:savedQuotes.length+1,customer:parsed.customer||"One-Off Delivery",stop:parsed.stop||"",addr:parsed.addr||"",rate:parsed.rate||0,miles:parsed.miles||null,liftgate:parsed.liftgate||false,gravel:parsed.gravel||false,extraPallets:parsed.extraPallets||false,note:parsed.note||(parsed.breakdown||""),pickup:null,calc:null,createdAt:new Date().toISOString(),status:"pending",aiGenerated:true};
setSavedQuotes(p=>[q,...p]);
saveQuoteToFB(q).catch(e=>console.error("Quote save:",e));
showToast("AI Quote #"+q.num+" created: "+fmt(q.rate));
setAiQuoteInput("");
}catch(e){console.error("AI quote error:",e);showToast("AI quote failed — try again or create manually");}
finally{setAiQuoteLoading(false);}
};

const addQuoteWithPickup=(cust,pu,del,drvId)=>{
setLog(p=>{
let all=[...(p[dk]||[])];
const puEntry={id:Date.now()+Math.random(),customer:cust,stop:pu.puStop,baseRate:0,fuelPct:0,isHourly:false,note:pu.puNote,driverId:drvId,addr:pu.puAddr,stopType:"pickup",priority:false,instructions:"",status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null,dueBy:null,weight:0,loadNum:1,pickupFrom:pu.puStop,manualPickup:true};
const delEntry={id:Date.now()+Math.random()+0.001,customer:cust,stop:del.delStop,baseRate:del.delRate,fuelPct:0,isHourly:false,note:del.delNote,driverId:drvId,addr:del.delAddr,stopType:"delivery",priority:false,instructions:"",status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null,dueBy:null,weight:0,loadNum:1,pickupFrom:del.pickupFrom};
if(drvId>0){let insertIdx=all.length;for(let i=all.length-1;i>=0;i--){if(all[i].driverId===drvId){insertIdx=i+1;break;}}all.splice(insertIdx,0,puEntry,delEntry);}
else{all.push(puEntry,delEntry);}
return{...p,[dk]:all};
});
showToast("PU "+pu.puStop+" + DEL "+del.delStop+" added");
};

const addDel=(cust,stop,rate,drvId,ex={})=>{
const cd=CUSTOMERS[cust];
const instrForStop=customInstr[stop]!==undefined?customInstr[stop]:getDefaultInstr(stop);
/* Check if this stop is a known liftgate (lg:true in delivery data) */
const stopData=cd?.deliveries?.find(d=>(typeof d==="string"?d:d.s)===stop);
const isKnownLG=stopData&&typeof stopData==="object"&&stopData.lg;
/* Known liftgate: keep base rate from delivery data, use liftgateFee for +$75, zero out fuel */
const finalFuelPct=isKnownLG?0:(ex.fuelPct||0);
const finalBaseRate=isKnownLG?(stopData.r||rate):rate;
/* Auto time constraints for specific stops */
const autoDueBy=ex.dueBy||(stop==="Atlanta Flooring - Suwanee"?"9:30–1:00 PM"
:cust==="IMETCO"&&stop==="IMETCO to Finishing Dynamics"?"By 2:00 PM"
:cust==="IMETCO"&&stop==="Perfect Edge to IMETCO"?"By 3:30 PM"
:cust==="IMETCO"&&stop==="Southern Aluminum to IMETCO"?"By 3:30 PM"
:cust==="IMETCO"&&stop==="Finishing Dynamics to IMETCO"?"By 3:30 PM"
:cust==="IMETCO"&&stop==="Round Trip IMETCO & Finishing Dynamics"?"By 3:30 PM"
:null);
const autoDeliverAfter=(cust==="Specialty"&&!ex.dueBy)?"Pickup 7:30 AM — Specialty":null;
const entry={id:Date.now()+Math.random(),customer:cust,stop,baseRate:finalBaseRate,liftgateFee:isKnownLG?75:0,fuelPct:finalFuelPct,isHourly:ex.isHourly||false,note:ex.note||(isKnownLG?"$"+finalBaseRate+" + $75 LG":null),driverId:drvId,addr:ex.addr||getAddr(stop),stopType:ex.stopType||"delivery",priority:ex.priority||(cd?.priority)||false,instructions:ex.instructions!==undefined?ex.instructions:instrForStop,status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null,dueBy:autoDueBy||autoDeliverAfter||null,weight:ex.weight||0,loadNum:ex.loadNum||1,pickupFrom:ex.pickupFrom||selPickup||null,pickupDueBy:ex.pickupDueBy||null,manualPickup:ex.manualPickup||false,liftgateApplied:isKnownLG||ex.liftgateApplied||false,knownLiftgate:isKnownLG||false};

setLog(p=>{
let all=[...(p[dk]||[])];
/* Insert at end of this driver's stops, not end of entire day */
if(entry.driverId>0){
  let insertIdx=all.length;
  for(let i=all.length-1;i>=0;i--){
    if(all[i].driverId===entry.driverId){insertIdx=i+1;break;}
  }
  all.splice(insertIdx,0,entry);
}else{
  all.push(entry);
}
if(entry.stopType==="delivery"&&entry.driverId>0)all=rebuildPickupsFor(all,cust);
return{...p,[dk]:all};
});
if(cust==="Emser Tile"&&DISTANCE_BONUS_STOPS.includes(stop)){
showToast(`${stop} added — +1h distance bonus applied`);
}else if(stop==="AFDC Flooring Attic"&&cust==="Emser Tile"){
setEmH(p=>{const key=`${emDk}-emser`;const cur=p[key]||4;return{...p,[key]:cur+1};});
setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===entry.id?{...e,liftgateApplied:true}:e)}));
showToast("AFDC added — Liftgate +1 hr applied");
}else if(isKnownLG){
showToast(`${stop} added — $${finalBaseRate} + $75 LG`);
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
const isKnownLG2=!isStr&&s.lg;
const finalFuelPct2=isKnownLG2?0:((cd.fuel_surcharge&&!cd.fuel_included)?cd.fuel_surcharge:0);
const autoDue=isSpecialty?"Pickup 7:30 AM — Specialty"
:cust==="IMETCO"&&stop==="IMETCO to Finishing Dynamics"?"By 2:00 PM"
:cust==="IMETCO"&&(stop==="Perfect Edge to IMETCO"||stop==="Southern Aluminum to IMETCO"||stop==="Finishing Dynamics to IMETCO"||stop==="Round Trip IMETCO & Finishing Dynamics")?"By 3:30 PM"
:null;
return{id:Date.now()+Math.random(),customer:cust,stop,baseRate:rate,liftgateFee:isKnownLG2?75:0,fuelPct:finalFuelPct2,isHourly:cd.rate_type==="hourly"&&!emserLTL,note:isStr?null:(isKnownLG2?"$"+rate+" + $75 LG":(s.n||null)),driverId:drvId,addr:getAddr(stop),stopType:"delivery",priority:cd.priority||false,instructions:instrForStop,status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null,dueBy:autoDue,weight:0,loadNum:1,liftgateApplied:isKnownLG2,knownLiftgate:isKnownLG2};
});
setLog(p=>{let all=[...(p[dk]||[]),...newEntries];if(drvId>0){const custs=new Set(newEntries.filter(e=>e.stopType==="delivery").map(e=>e.customer));custs.forEach(c=>{all=rebuildPickupsFor(all,c);});}return{...p,[dk]:all};});
showToast(`${stops.length} stops added`);setMultiSelect(false);setMultiChecked([]);
};


const rebuildPickupsFor=(all,cust)=>{
const makeNote=(dels)=>{if(!dels.length)return"";const names=dels.map(e=>e.stop);if(names.length<=3)return names.join(", ");return names.slice(0,2).join(", ")+" +"+(names.length-2)+" more";};
const puSrcs=PICKUP_SOURCES.filter(s=>s.customer===cust);
if(!puSrcs.length)return all;
/* Remove ALL existing pickups for this customer */
all=all.filter(e=>!(e.customer===cust&&e.stopType==="pickup"&&!e.manualPickup));
const custDels=all.filter(e=>e.customer===cust&&e.stopType==="delivery");
/* Group deliveries by driver */
const byDriver={};
custDels.forEach(e=>{if(e.driverId>0){if(!byDriver[e.driverId])byDriver[e.driverId]=[];byDriver[e.driverId].push(e);}});
const cd=CUSTOMERS[cust];
const puDueBy=(cust==="Specialty")?"Pickup 7:30 AM — Specialty":null;
Object.entries(byDriver).forEach(([drvIdStr,dels])=>{
const dId=Number(drvIdStr);
/* Group by pickupFrom location, then by loadNum */
const byLocLoad={};
dels.forEach(e=>{
  const loc=e.pickupFrom||selPickup||puSrcs[0].label.split(" - ").pop();
  const ln=e.loadNum||1;
  const key=loc+"::"+ln;
  if(!byLocLoad[key])byLocLoad[key]={loc,loadNum:ln,dels:[]};
  byLocLoad[key].dels.push(e);
});
/* Check if driver has multiple loads */
const driverLoads=new Set(dels.map(e=>e.loadNum||1));
const hasMultiLoads=driverLoads.size>1;
/* Create a pickup card for each unique location+load combo */
Object.values(byLocLoad).forEach(({loc,loadNum:ln,dels:locDels})=>{
/* Skip if a manual pickup already exists for this driver+customer */
const hasManualPU=all.some(e=>e.customer===cust&&e.stopType==="pickup"&&e.manualPickup&&e.driverId===dId);
if(hasManualPU)return;
const puSrc=puSrcs.find(s=>s.label.includes(loc))||puSrcs[0];
const delWithPuDue=locDels.find(e=>e.pickupDueBy);
const effectivePuDue=delWithPuDue?delWithPuDue.pickupDueBy:puDueBy;
const puEntry={id:Date.now()+Math.random()+Math.random(),customer:cust,stop:puSrc.label,baseRate:0,fuelPct:0,isHourly:false,
note:makeNote(locDels),driverId:dId,addr:puSrc.addr,stopType:"pickup",priority:cd?.priority||false,
instructions:"",status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null,
dueBy:effectivePuDue,weight:0,loadNum:hasMultiLoads?ln:1,pickupFrom:loc};
/* Insert pickup BEFORE the first delivery for this customer+driver+location+load */
const firstDelIdx=all.findIndex(e=>e.customer===cust&&e.stopType==="delivery"&&e.driverId===dId&&(e.pickupFrom||selPickup)===loc&&(e.loadNum||1)===ln);
if(firstDelIdx>=0){all.splice(firstDelIdx,0,puEntry);}
else{
  const anyDelIdx=all.findIndex(e=>e.customer===cust&&e.stopType==="delivery"&&e.driverId===dId&&(e.loadNum||1)===ln);
  if(anyDelIdx>=0)all.splice(anyDelIdx,0,puEntry);
  else all.push(puEntry);
}
});
});
return all;
};

const deleteDel=(id)=>{
const entry=dl.find(e=>e.id===id);
if(!entry)return;
setLog(p=>{
let all=[...(p[dk]||[])].filter(e=>e.id!==id);
if(entry.stopType==="delivery"){all=rebuildPickupsFor(all,entry.customer);}
return{...p,[dk]:all};
});
/* Distance bonus auto-recalculated by sync effect when dl changes */
if(entry.customer==="Emser Tile"&&DISTANCE_BONUS_STOPS.includes(entry.stop)){
  showToast(entry.stop+" deleted — distance bonus removed");
  return;
}
showToast(entry.stop+" deleted");
};

const rmFromDriver=(id)=>{const entry=dl.find(e=>e.id===id);if(!entry)return;if(entry.driverId===0){deleteDel(id);}else{reassign(id,0);showToast("Moved to Unassigned");}};

const reassign=(eid,did,newLoadNum)=>{
const entry=dl.find(e=>e.id===eid);
const oldDid=entry?.driverId;
setLog(p=>{
let all=[...(p[dk]||[])].map(e=>e.id===eid?{...e,driverId:did,...(newLoadNum?{loadNum:newLoadNum}:{})}:e);
const movedEntry=all.find(e=>e.id===eid);
if(movedEntry&&movedEntry.stopType==="delivery"&&(did!==oldDid||newLoadNum)){
all=rebuildPickupsFor(all,movedEntry.customer);
}
return{...p,[dk]:all};
});
if(entry&&did>0&&did!==oldDid){
sendNotificationToDriver(did,"🔄 ROUTE CHANGED\nNew stop added to your route:\n"+entry.stop+(entry.customer?" ("+entry.customer+")":"")+(entry.addr?"\n📍 "+entry.addr:""),"route_change").catch(()=>{});
if(oldDid>0)sendNotificationToDriver(oldDid,"🔄 ROUTE CHANGED\nStop removed from your route:\n"+entry.stop+(entry.customer?" ("+entry.customer+")":""),"route_change").catch(()=>{});
}
};
/* Bulk reassign multiple entries at once — ensures pickups rebuild correctly */
const reassignBulk=(eids,did)=>{
setLog(p=>{
let all=[...(p[dk]||[])];
const custs=new Set();
eids.forEach(eid=>{
  const idx=all.findIndex(e=>e.id===eid);
  if(idx>=0){all[idx]={...all[idx],driverId:did};if(all[idx].stopType==="delivery")custs.add(all[idx].customer);}
});
custs.forEach(c=>{all=rebuildPickupsFor(all,c);});
return{...p,[dk]:all};
});
};
const assignInOrder=(eid,did,loadNum)=>{
const entry=dl.find(e=>e.id===eid);
if(!entry)return;
if(entry.driverId===did){
reassign(eid,0);
showToast("Removed from route");
return;
}
/* Use reassign for splitting logic + notifications, then reorder + set loadNum */
reassign(eid,did);
setTimeout(()=>{
setLog(p=>{
let all=[...(p[dk]||[])];
const ent=all.find(e=>e.id===eid);
if(!ent||ent.driverId!==did)return p;
if(loadNum)ent.loadNum=loadNum;
/* Reorder: move to end of this driver's stops */
all=all.filter(e=>e.id!==eid);
let insertIdx=all.length;
for(let i=all.length-1;i>=0;i--){
if(all[i].driverId===did){insertIdx=i+1;break;}
}
all.splice(insertIdx,0,ent);
/* Rebuild pickups so load-specific pickup cards are created */
if(ent.stopType==="delivery")all=rebuildPickupsFor(all,ent.customer);
return{...p,[dk]:all};
});
},50);
showToast("Stop #"+(dl.filter(e=>e.driverId===did).length+1)+" added"+(loadNum>1?" (Load "+loadNum+")":""));
};
const updateInstructions=(eid,text)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,instructions:text}:e)}));
const updateRate=(eid,rate)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,baseRate:parseFloat(rate)||0}:e)}));
const updateRateForDay=(eid,rate,dayKey)=>setLog(p=>({...p,[dayKey]:(p[dayKey]||[]).map(e=>e.id===eid?{...e,baseRate:parseFloat(rate)||0}:e)}));

const[liftgateRequests,setLiftgateRequests]=useState([]);/* [{id,entryId,stop,driverId,driverName,time,status}] */
const requestLiftgate=(entryId,stopName)=>{
const entry=dl.find(e=>e.id===entryId);
const drv=entry?drivers.find(d=>d.id===entry.driverId):null;
const req={id:Date.now()+Math.random(),entryId,stop:stopName,driverId:entry?.driverId,driverName:drv?.name||"Driver",time:new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),status:"pending"};
setLiftgateRequests(p=>[req,...p]);
showToast("Liftgate request sent");
};
const approveLiftgate=(reqId)=>{
const req=liftgateRequests.find(r=>r.id===reqId);
if(!req)return;
setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===req.entryId?{...e,liftgateFee:75,liftgateApplied:true}:e)}));
setLiftgateRequests(p=>p.map(r=>r.id===reqId?{...r,status:"approved"}:r));
showToast("Liftgate +$75 applied to "+req.stop);
};
const denyLiftgate=(reqId)=>{
setLiftgateRequests(p=>p.map(r=>r.id===reqId?{...r,status:"denied"}:r));
showToast("Liftgate denied");
};
const manualLiftgate=(entryId)=>{
setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===entryId?{...e,liftgateFee:75,liftgateApplied:true}:e)}));
showToast("Liftgate +$75 added (fuel still applies)");
};
const confirmSplit=(entryId,totalWeight,ratio,truck1Weight)=>{
const w1=truck1Weight!==undefined?truck1Weight:Math.round(totalWeight*(ratio/100));
const w2=totalWeight-w1;
setLog(p=>{
  let all=[...(p[dk]||[])];
  const idx=all.findIndex(e=>e.id===entryId);
  if(idx<0)return p;
  const orig=all[idx];
  /* Update original with load 1 — stays with current driver */
  all[idx]={...orig,weight:w1,loadNum:1,wasSplit:true,note:(orig.note?orig.note+" | ":"")+"Split 1/2: "+w1+" lbs"};
  /* Create load 2 — goes to UNASSIGNED so dispatcher can assign to another truck */
  const load2={...orig,id:Date.now()+Math.random(),weight:w2,loadNum:2,wasSplit:true,driverId:0,note:(orig.note?orig.note+" | ":"")+"Split 2/2: "+w2+" lbs",status:null,arrivedAt:null,departedAt:null,photos:[],signature:null};
  all.push(load2);
  /* Rebuild pickups to create pickup cards for the new load */
  all=rebuildPickupsFor(all,orig.customer);
  return{...p,[dk]:all};
});
setSplitEntry(null);
showToast("Split — Load 2 moved to Unassigned");
};
const updateStatus=(eid,status)=>{const now=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,status,arrivedAt:status==="arrived"?now:e.arrivedAt,departedAt:status==="departed"?now:e.departedAt}:e)}));};
const addPhoto=(eid,dataUrl)=>{
/* Upload to Firebase Storage if available, otherwise store base64 */
if(window._fbOps?.uploadFile){
  const blob=fetch(dataUrl).then(r=>r.blob()).catch(()=>null);
  blob.then(b=>{
    if(!b){setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),dataUrl]}:e)}));return;}
    const path=`photos/${emDk}/${eid}_${Date.now()}.jpg`;
    window._fbOps.uploadFile(path,b).then(url=>{
      setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),url]}:e)}));
    }).catch(()=>{
      setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),dataUrl]}:e)}));
    });
  });
}else{
  setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),dataUrl]}:e)}));
}
};
const addSignature=(eid,dataUrl)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,signature:dataUrl}:e)}));
const setShipPlan=(eid,num)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,shipPlan:num}:e)}));
const setEta=(eid,mins,dest)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,eta:mins,etaDest:dest||null}:e)}));
const setDueBy=(eid,time)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,dueBy:time||null}:e)}));
const setWeight=(eid,w)=>setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,weight:parseFloat(w)||0}:e)}));
const setLoadNum=(eid,n)=>{setLog(p=>{let all=[...(p[dk]||[])].map(e=>e.id===eid?{...e,loadNum:n}:e);const entry=all.find(e=>e.id===eid);if(entry&&entry.stopType==="delivery")all=rebuildPickupsFor(all,entry.customer);return{...p,[dk]:all};});};


const TRUCK_LIMITS={default:10000,heavy:13500};
const[driverCapacity,setDriverCapacity]=useState(()=>lsGet("dd_driver_capacity",{})); /* {driverId: 10000|13500} */
useEffect(()=>{lsSet("dd_driver_capacity",driverCapacity);},[driverCapacity]);
const prevCapRef=useRef(JSON.stringify(driverCapacity));
useEffect(()=>{
  if(!firebaseReady.current)return;
  const json=JSON.stringify(driverCapacity);
  if(json===prevCapRef.current)return;
  prevCapRef.current=json;
  const timer=setTimeout(()=>{
    if(window._fbOps)window._fbOps.write("config/driverCapacity",{data:driverCapacity,updatedAt:Date.now()}).catch(e=>console.error("Cap save:",e));
  },500);
  return()=>clearTimeout(timer);
},[driverCapacity]);
const[driverLoadCount,setDriverLoadCount]=useState({}); /* {driverId: numLoads} — tracks extra loads */
const getDriverCapacity=(drvId)=>driverCapacity[drvId]||TRUCK_LIMITS.default;
const toggleDriverCapacity=(drvId)=>{setDriverCapacity(p=>{const cur=p[drvId]||TRUCK_LIMITS.default;return{...p,[drvId]:cur===TRUCK_LIMITS.default?TRUCK_LIMITS.heavy:TRUCK_LIMITS.default};});};
const addDriverLoad=(drvId)=>{const cur=getDriverLoadOptions(drvId);setDriverLoadCount(p=>({...p,[drvId]:Math.min(cur+1,3)}));showToast("Load "+(cur+1)+" added");};
const getDriverLoadOptions=(drvId)=>{const explicit=driverLoadCount[drvId]||1;const fromEntries=getMaxLoad(drvId);return Math.max(explicit,fromEntries);};
const getLoadWeight=(drvId,loadN)=>dl.filter(e=>e.driverId===drvId&&(e.loadNum||1)===loadN).reduce((s,e)=>s+(e.weight||0),0);
const getDriverLoads=(drvId)=>{const loads=new Set();dl.filter(e=>e.driverId===drvId).forEach(e=>loads.add(e.loadNum||1));return[...loads].sort((a,b)=>a-b);};
const getMaxLoad=(drvId)=>{const loads=getDriverLoads(drvId);return loads.length>0?Math.max(...loads):1;};
const weightPct=(w,cap)=>Math.min((w/(cap||TRUCK_LIMITS.default))*100,100);
const weightColor=(w,cap)=>w>(cap||TRUCK_LIMITS.default)?"#dc2626":w>(cap||TRUCK_LIMITS.default)*0.85?"#d97706":"#16a34a";


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
const getEmserDayShifts=()=>emserShifts[emDk]||[];

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

const addEmserShift=(driverId)=>{dirtyShiftsRef.current.add(emDk);setEmserShifts(p=>{const updated=[...(p[emDk]||[]),{id:Date.now()+Math.random(),driverId,start:"",end:""}];return{...p,[emDk]:updated};});};
const updateEmserShift=(shiftId,field,val)=>{dirtyShiftsRef.current.add(emDk);setEmserShifts(p=>{const updated=(p[emDk]||[]).map(s=>s.id===shiftId?{...s,[field]:val}:s);return{...p,[emDk]:updated};});};
const removeEmserShift=(shiftId)=>{
  dirtyShiftsRef.current.add(emDk);
  setEmserShifts(p=>{
    const updated=(p[emDk]||[]).filter(s=>s.id!==shiftId);
    const next={...p,[emDk]:updated};
    if(updated.length===0){
      setEmH(prev=>({...prev,[`${emDk}-emser`]:4}));
    }
    return next;
  });
};
const calcAndApplyEmserHours=useCallback(()=>{const shifts=emserShifts[emDk]||[];const totalMins=shifts.reduce((sum,s)=>sum+calcShiftMins(s),0);const hours=Math.round(totalMins/15)*15/60;if(hours>0){setEmH(p=>({...p,[`${emDk}-emser`]:hours}));return hours;}return emH[`${emDk}-emser`]||4;},[emserShifts,emDk,emH]);

/* Auto-apply shift totals to emH whenever shifts change for this day */
useEffect(()=>{
  const shifts=emserShifts[emDk]||[];
  if(!shifts.length)return;
  const totalMins=shifts.reduce((sum,s)=>sum+calcShiftMins(s),0);
  if(totalMins>0){
    const lgCount=dl.filter(e=>e.isHourly&&e.liftgateApplied).length;
    const distBonus=dl.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length;
    const billedMins=totalMins+(lgCount+distBonus)*60;
    const hours=Math.round(billedMins/15)*15/60;
    setEmH(p=>{if(p[`${emDk}-emser`]===hours)return p;return{...p,[`${emDk}-emser`]:hours};});
  }
},[emserShifts,emDk,dl]);


const getMsgKey=(ch)=>ch?"dm-"+ch:"group";
const getMessages=(ch)=>allMessages[getMsgKey(ch)]||[];
const sendMsg=(ch)=>{
if(!msgInput.trim())return;
const key=getMsgKey(ch);
const now=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
const msg={from:"dispatch",fromName:"Dispatch",text:msgInput.trim(),time:now,read:false};
saveMessage(key,msg).catch(e=>console.error("[MSG-DISPATCH] FAILED:",e));
setMsgInput("");
};
const getUnreadCount=(ch)=>{const msgs=getMessages(ch);return msgs.filter(m=>m.from!=="dispatch"&&!m.read).length;};
const getTotalUnread=()=>{let c=getUnreadCount(null);drivers.forEach(d=>{c+=getUnreadCount(d.id);});return c;};
const markMsgsRead=(ch)=>{const key=getMsgKey(ch);const msgs=getMessages(ch);msgs.forEach(m=>{if(m.from!=="dispatch"&&!m.read)markMessageRead(key,m.id).catch(()=>{});});};
const[msgPopup,setMsgPopup]=useState(null); /* {from,text,time,channelKey} */
const prevMsgCountRef=useRef({});

/* Subscribe to all message channels */
useEffect(()=>{
  const unsubs=[];
  /* Group channel */
  unsubs.push(subscribeMessages("group",(msgs)=>{
    setAllMessages(p=>{const prev=p["group"]||[];
    /* Detect new incoming messages for popup */
    if(msgs.length>prev.length){const newest=msgs[msgs.length-1];if(newest&&newest.from!=="dispatch"&&!showMsgPanel){setMsgPopup({from:newest.fromName||"Driver",text:newest.text,time:newest.time,channelKey:"group"});setTimeout(()=>setMsgPopup(null),8000);}}
    return{...p,"group":msgs};});
  }));
  /* Per-driver channels */
  drivers.forEach(d=>{
    const key="dm-"+d.id;
    unsubs.push(subscribeMessages(key,(msgs)=>{
      setAllMessages(p=>{const prev=p[key]||[];
      if(msgs.length>prev.length){const newest=msgs[msgs.length-1];if(newest&&newest.from!=="dispatch"&&!showMsgPanel){setMsgPopup({from:newest.fromName||d.name,text:newest.text,time:newest.time,channelKey:key});setTimeout(()=>setMsgPopup(null),8000);}}
      return{...p,[key]:msgs};});
    }));
  });
  return()=>unsubs.forEach(u=>u());
},[drivers.length]);

const moveInDriver=(drvId,fromIdx,dir)=>{const toIdx=fromIdx+dir;setLog(p=>{const all=[...(p[dk]||[])];const de=all.filter(e=>e.driverId===drvId);const rest=all.filter(e=>e.driverId!==drvId);if(toIdx<0||toIdx>=de.length)return p;[de[fromIdx],de[toIdx]]=[de[toIdx],de[fromIdx]];return{...p,[dk]:[...rest,...de]};});};


const[sortMenuDrv,setSortMenuDrv]=useState(null);
const _sCoord=(e)=>{if(!e)return null;const addr=e.addr||getAddr(e.stop);return getCoords(addr);};
const _sOrigin={lat:33.93,lng:-84.21};
const _sDist=(a,b)=>Math.sqrt(Math.pow(a.lat-b.lat,2)+Math.pow(a.lng-b.lng,2));
const _sDistO=(e)=>{const c=_sCoord(e);return c?_sDist(_sOrigin,c):0;};
const _sSplit=(entries)=>{
const pu=entries.filter(e=>e.stopType==="pickup"||e.dueBy?.startsWith("Pickup"));
const tm=entries.filter(e=>e.dueBy&&!e.dueBy.startsWith("Pickup")&&!pu.includes(e));
const rg=entries.filter(e=>!pu.includes(e)&&!tm.includes(e));
return{pu,tm,rg};
};
const _sParseTime=(db)=>{if(!db)return 9999;const m=db.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);if(!m)return 9999;let h=parseInt(m[1]);const min=parseInt(m[2]||"0");const ap=(m[3]||"").toUpperCase();if(ap==="PM"&&h!==12)h+=12;if(ap==="AM"&&h===12)h=0;return h*60+min;};
const _sApply=(drvId,sorted,msg)=>{
setLog(p=>{const all=[...(p[dk]||[])];const rest=all.filter(e=>e.driverId!==drvId);return{...p,[dk]:[...rest,...sorted]};});
setSortMenuDrv(null);showToast(msg);
};

const sortClosest=(drvId)=>{const de=drvEntries(drvId);if(de.length<2)return;const{pu,tm,rg}=_sSplit(de);rg.sort((a,b)=>_sDistO(a)-_sDistO(b));tm.sort((a,b)=>_sDistO(a)-_sDistO(b));_sApply(drvId,[...pu,...tm,...rg],"📍 Closest → Furthest");};
const sortFurthest=(drvId)=>{const de=drvEntries(drvId);if(de.length<2)return;const{pu,tm,rg}=_sSplit(de);rg.sort((a,b)=>_sDistO(b)-_sDistO(a));tm.sort((a,b)=>_sDistO(b)-_sDistO(a));_sApply(drvId,[...pu,...tm,...rg],"🏁 Furthest → Closest");};
const sortByTime=(drvId)=>{const de=drvEntries(drvId);if(de.length<2)return;const{pu,tm,rg}=_sSplit(de);tm.sort((a,b)=>_sParseTime(a.dueBy)-_sParseTime(b.dueBy));rg.sort((a,b)=>_sDistO(a)-_sDistO(b));_sApply(drvId,[...pu,...tm,...rg],"⏰ By Time Constraint");};
const sortShortest=(drvId)=>{const de=drvEntries(drvId);if(de.length<2)return;const{pu}=_sSplit(de);const all=de.filter(e=>!pu.includes(e));const sorted=[];const rem=[...all];let cur=pu.length?(_sCoord(pu[pu.length-1])||_sOrigin):_sOrigin;while(rem.length){let bi=0,bd=Infinity;rem.forEach((e,i)=>{const c=_sCoord(e);if(!c)return;const d=_sDist(cur,c);if(d<bd){bd=d;bi=i;}});const nx=rem.splice(bi,1)[0];const nc=_sCoord(nx);if(nc)cur=nc;sorted.push(nx);}_sApply(drvId,[...pu,...sorted],"🧭 Shortest Distance");};
const sortReverse=(drvId)=>{const de=drvEntries(drvId);if(de.length<2)return;const{pu}=_sSplit(de);const np=de.filter(e=>!pu.includes(e));np.reverse();_sApply(drvId,[...pu,...np],"🔄 Route Reversed");};
const sortGoogle=(drvId)=>{
const de=drvEntries(drvId);if(de.length<2)return;
if(!window.google?.maps?.DirectionsService){showToast("Google Maps not loaded");return;}
const{pu}=_sSplit(de);const dels=de.filter(e=>!pu.includes(e));
if(dels.length<2){showToast("Need 2+ delivery stops");return;}
if(dels.length>23){showToast("Max 23 stops for API optimization");return;}
showToast("⏳ Calculating optimal route...");
const coords=dels.map(e=>{const addr=e.addr||getAddr(e.stop);return getCoords(addr);}).filter(Boolean);
if(coords.length!==dels.length){showToast("Some stops missing coordinates — using straight-line");sortShortest(drvId);return;}
const origin=_sOrigin;const dest=coords[coords.length-1];
const waypoints=coords.slice(0,-1).map(c=>({location:c,stopover:true}));
const svc=new window.google.maps.DirectionsService();
svc.route({origin,destination:dest,waypoints,travelMode:window.google.maps.TravelMode.DRIVING,optimizeWaypoints:true},(result,status)=>{
  if(status==="OK"&&result.routes[0]?.waypoint_order){
    const order=result.routes[0].waypoint_order;
    const reordered=[...order.map(i=>dels[i]),dels[dels.length-1]];
    const legs=result.routes[0].legs;
    const totalMi=legs.reduce((s,l)=>s+(l.distance?.value||0),0)/1609.34;
    const totalMin=legs.reduce((s,l)=>s+(l.duration?.value||0),0)/60;
    _sApply(drvId,[...pu,...reordered],`🗺 Google Optimized — ${Math.round(totalMi)}mi, ~${Math.round(totalMin)}min`);
  }else{showToast("API failed — using straight-line fallback");sortShortest(drvId);}
});
};

const SORT_OPTIONS=[
{icon:"📍",label:"Closest → Furthest",desc:"Nearest stops first",fn:sortClosest},
{icon:"🏁",label:"Furthest → Closest",desc:"Furthest stops first",fn:sortFurthest},
{icon:"⏰",label:"By Time Constraint",desc:"Deadlines first",fn:sortByTime},
{icon:"🧭",label:"Shortest Distance",desc:"Best path between all",fn:sortShortest},
{icon:"🗺",label:"Google Optimized",desc:"Actual driving route (API)",fn:sortGoogle},
{icon:"🔄",label:"Reverse Route",desc:"Flip current order",fn:sortReverse},
];
const insertPickup=(drvId,afterIdx)=>{if(!pickupStop)return;const forLabel=pickupForDel?` → ${pickupForDel}`:"";const entry={id:Date.now()+Math.random(),customer:pickupCustomer||"Pickup",stop:`${pickupCustomer||"Pickup"}${forLabel}`,baseRate:0,fuelPct:0,isHourly:false,note:pickupNote||(pickupForDel?`Picking up for ${pickupForDel}`:null),driverId:drvId,addr:pickupAddr||"",stopType:"pickup",priority:false,pickupFrom:pickupStop,pickupFor:pickupForDel,instructions:"",status:null,arrivedAt:null,departedAt:null,eta:null,photos:[],signature:null};setLog(p=>{const all=[...(p[dk]||[])];const de=all.filter(e=>e.driverId===drvId);const rest=all.filter(e=>e.driverId!==drvId);de.splice(afterIdx+1,0,entry);return{...p,[dk]:[...rest,...de]};});setInsertPickupFor(null);setPickupCustomer("");setPickupStop("");setPickupAddr("");setPickupForDel("");setPickupNote("");showToast(`Pickup added`);};

const computeDay=(key,emKey)=>{const entries=log[key]||[];let base=0;let lgFees=0;if(entries.some(e=>e.isHourly)){const{totalMins}=getShiftSummary(emKey||key);const lgCount=entries.filter(e=>e.isHourly&&e.liftgateApplied).length;const distBonus=entries.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length;if(totalMins>0){const billedMins=totalMins+(lgCount+distBonus)*60;base+=102.50*(Math.round(billedMins/15)*15/60);}else{base+=102.50*(emH[`${emKey||key}-emser`]||4);}}const fBC={};entries.forEach(e=>{if(e.isHourly)return;base+=e.baseRate;lgFees+=(e.liftgateFee||0);if(e.fuelPct>0){if(!fBC[e.customer])fBC[e.customer]={pct:e.fuelPct,base:0};fBC[e.customer].base+=e.baseRate;}});let fuel=0;Object.values(fBC).forEach(c=>{fuel+=c.base*c.pct;});return{base:base+lgFees,fuel,total:base+lgFees+fuel,fBC,lgFees};};


const getDriverMiles=(drvId,dayKey)=>{const entries=(log[dayKey||dk]||[]).filter(e=>e.driverId===drvId);return calcRouteMiles(entries);};
const getWeekDriverMiles=(drvId)=>{let total=0;for(let i=0;i<5;i++){total+=getDriverMiles(drvId,`${wo}-${i}`);}return total;};


const generateInvoice=(custName)=>{
const cd=CUSTOMERS[custName];if(!cd)return null;
const weekDates=getWeekDates(wo);
const lines=[];let grandBase=0,grandFuel=0;
DAYS.forEach((day,i)=>{
const dayEntries=(log[`${wo}-${i}`]||[]).filter(e=>e.customer===custName);
if(!dayEntries.length)return;
if(cd.rate_type==="hourly"){
/* Emser: hourly billing per day */
const _invFbKey=getFbKey(wo,i);const{totalMins:_invMins}=getShiftSummary(_invFbKey);const _invLG=(log[`${wo}-${i}`]||[]).filter(e=>e.isHourly&&e.liftgateApplied).length;const _invDist=(log[`${wo}-${i}`]||[]).filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length;const hrs=_invMins>0?Math.round((_invMins+(_invLG+_invDist)*60)/15)*15/60:(emH[`${_invFbKey}-emser`]||4);
const amt=102.50*hrs;
lines.push({day:weekDates[i].name,date:weekDates[i].date,desc:`Hourly: ${hrs}h × $102.50`,stops:dayEntries.map(e=>e.stop).join(", "),base:amt,fuel:0});
grandBase+=amt;
}else{
dayEntries.forEach(e=>{
if(e.stopType==="pickup")return;
const fuelAmt=e.fuelPct>0?e.baseRate*e.fuelPct:0;
const lgNote=e.liftgateApplied?" + Liftgate":"";
lines.push({day:weekDates[i].name,date:weekDates[i].date,desc:e.stop+lgNote,stops:e.stop,base:e.baseRate,fuel:fuelAmt,shipPlan:e.shipPlan||null});
grandBase+=e.baseRate;grandFuel+=fuelAmt;
});
}
});
const inv={id:Date.now()+Math.random(),customer:custName,weekOf:weekDates[0].date+" – "+weekDates[4].date,weekOffset:wo,lines,grandBase,grandFuel,grandTotal:grandBase+grandFuel,createdAt:Date.now(),rateType:cd.rate_type,fuelPct:cd.fuel_surcharge||0,fuelIncluded:cd.fuel_included||false};
return inv;
};
const createAndSaveInvoice=(custName)=>{
const inv=generateInvoice(custName);
if(!inv||!inv.lines.length){showToast("No deliveries for "+custName+" this week");return;}
saveInvoice(inv).catch(e=>console.error("Invoice save:",e));
setInvoices(p=>[inv,...p]);
setShowInvoice(inv.id);
showToast("Invoice generated for "+custName);
};
const dc=computeDay(dk,emDk);const wkD=DAYS.map((_,i)=>{const k=`${wo}-${i}`;return{entries:log[k]||[],calc:computeDay(k,getFbKey(wo,i))};});const wkT=wkD.reduce((s,d)=>s+d.calc.total,0);
const wkF={};wkD.forEach(d=>{Object.entries(d.calc.fBC).forEach(([c,cf])=>{if(!wkF[c])wkF[c]={pct:cf.pct,base:0};wkF[c].base+=cf.base;});});
const prevWkD=DAYS.map((_,i)=>{const k=`${wo-1}-${i}`;return{entries:log[k]||[],calc:computeDay(k,getFbKey(wo-1,i))};});
const prevWkT=prevWkD.reduce((s,d)=>s+d.calc.total,0);
const wowDelta=wkT-prevWkT;
const wowPct=prevWkT>0?((wowDelta/prevWkT)*100):0;
const getHistoryEntries=()=>{const all=[];for(let w=wo;w>=wo-histWeekRange;w--){const wdates=getWeekDates(w);for(let d=0;d<5;d++){const k=`${w}-${d}`;(log[k]||[]).forEach(e=>all.push({...e,weekOff:w,dayIdx:d,dayName:DAYS[d],dayDate:wdates[d].date}));}}return all;};
const histAll=getHistoryEntries();
const histFiltered=histAll.filter(e=>{const q=histSearch.toLowerCase();return(!q||e.stop.toLowerCase().includes(q)||e.customer.toLowerCase().includes(q)||(e.addr||"").toLowerCase().includes(q))&&(!histCustFilter||e.customer===histCustFilter)&&(!histDrvFilter||e.driverId===Number(histDrvFilter));});

const addDrvr=()=>{if(!newDN.trim())return;driverChangeSource.current="user";dirtyDriversRef.current=true;setDrivers(p=>[...p,{id:Date.now(),name:newDN.trim(),phone:newDP.trim()}]);setNewDN("");setNewDP("");};
const saveDrv=id=>{if(!editNm.trim())return;driverChangeSource.current="user";dirtyDriversRef.current=true;setDrivers(p=>p.map(d=>d.id===id?{...d,name:editNm.trim(),phone:editPh.trim()}:d));setEditDrv(null);};
const rmDrv=id=>{if(drivers.length<=1)return;driverChangeSource.current="user";dirtyDriversRef.current=true;setDrivers(p=>p.filter(d=>d.id!==id));};
const drvEntries=did=>dl.filter(e=>e.driverId===did);
const handleDrop=(drvId,toIdx)=>{
if(!dragSrc){setDragSrc(null);setDragOver(null);return;}
if(dragSrc.drvId===drvId&&dragSrc.idx===toIdx){setDragSrc(null);setDragOver(null);return;}
if(dragSrc.drvId===drvId){
/* Same driver — reorder */
setLog(p=>{const all=[...(p[dk]||[])];const de=all.filter(e=>e.driverId===drvId);const rest=all.filter(e=>e.driverId!==drvId);const[moved]=de.splice(dragSrc.idx,1);de.splice(toIdx,0,moved);return{...p,[dk]:[...rest,...de]};});
}else{
/* Cross-driver — reassign (including to/from unassigned drvId=0) */
const srcEntries=dl.filter(e=>e.driverId===dragSrc.drvId);
const entry=srcEntries[dragSrc.idx];
if(entry){
reassign(entry.id,drvId);
const targetName=drvId===0?"Unassigned":((drivers.find(d=>d.id===drvId))?.name||"driver");
showToast("Moved to "+targetName);
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
const printContent=(title,fn)=>{const w=window.open("","_blank","width=1000,height=700");if(!w){showToast("Print blocked here — works when published");return;}w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
@page{size:landscape;margin:12mm}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;padding:16px 24px;font-size:12px;color:#1c1917;max-width:100%}
.header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #1e5b92;padding-bottom:10px;margin-bottom:16px}
.header h1{font-size:20px;margin:0;color:#1e5b92}
.header .total{font-size:24px;font-weight:800;color:#16a34a}
.header .sub{font-size:11px;color:#78716c;margin-top:2px}
.section{margin-bottom:14px;break-inside:avoid}
.section-title{font-size:14px;font-weight:700;color:#1c1917;padding:6px 10px;background:#f0f5fa;border-left:4px solid #1e5b92;margin-bottom:6px;display:flex;justify-content:space-between}
.section-title .amt{color:#16a34a;font-variant-numeric:tabular-nums}
table{width:100%;border-collapse:collapse;font-size:11px}
th{text-align:left;padding:4px 8px;background:#f5f5f4;border-bottom:2px solid #d6d3d1;font-size:10px;text-transform:uppercase;color:#78716c}
td{padding:5px 8px;border-bottom:1px solid #e7e5e4;vertical-align:top}
.tag{display:inline-block;padding:1px 6px;border-radius:3px;font-size:9px;font-weight:700;color:#fff;margin-right:4px}
.pu{background:#2563eb}.del{background:#16a34a}.pri{background:#f59e0b}
.drv{display:inline-block;padding:1px 5px;border-radius:3px;font-size:9px;font-weight:700;color:#fff}
.instr{color:#2563eb;font-weight:600;font-size:10px}
.note{color:#78716c;font-style:italic;font-size:10px}
.emser{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:8px 12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
.emser .lbl{font-weight:700;color:#2563eb;font-size:12px}
.emser .val{font-weight:800;color:#1d4ed8;font-size:16px;font-variant-numeric:tabular-nums}
.fuel{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:8px 12px;margin-bottom:10px}
.fuel .lbl{font-weight:700;color:#92400e;font-size:11px;text-transform:uppercase;margin-bottom:4px}
@media print{body{padding:0}.section{break-inside:avoid}}
</style></head><body>`);w.document.write(fn());w.document.write("</body></html>");w.document.close();setTimeout(()=>w.print(),300);};
const printManifest=drvId=>{const drv=drivers.find(d=>d.id===drvId);const di=drivers.findIndex(d=>d.id===drvId);const de=drvEntries(drvId);printContent(`Manifest - ${drv?.name}`,()=>{let h=`<div class="header"><div><h1>DAVIS DELIVERY SERVICE</h1><div class="sub">${drv?.name||"Unassigned"} — ${de.length} stops · ${wd[sd].name} ${wd[sd].date}</div></div></div>`;h+=`<table><tr><th>#</th><th>Type</th><th>Stop</th><th>Customer</th><th>Address</th><th>Notes</th><th>Rate</th></tr>`;de.forEach((e,i)=>{const tag=e.stopType==="pickup"?'<span class="tag pu">PU</span>':e.priority?'<span class="tag pri">PRI</span>':'<span class="tag del">DEL</span>';h+=`<tr><td>${i+1}</td><td>${tag}</td><td><b>${e.stop}</b></td><td>${e.customer}</td><td style="font-size:10px;color:#78716c">${e.addr||""}</td><td>${e.instructions?'<span class="instr">'+e.instructions+'</span>':""} ${e.note?'<span class="note">'+e.note+'</span>':""}</td><td style="text-align:right;font-weight:700">${e.isHourly?"HR":fmt(e.baseRate)}</td></tr>`;});h+=`</table>`;return h;});};
const printDailyLog=()=>{printContent(`Daily Log`,()=>{
/* ── header ── */
let h=`<div class="header"><div><h1>DAVIS DELIVERY — Daily Log</h1><div class="sub">${wd[sd].name} — ${wd[sd].date}</div></div><div class="total">${fmt(dc.total)}</div></div>`;
/* ── emser hours block ── */
const{totalMins:shiftMins}=getShiftSummary(emDk);
if(shiftMins>0){const _pLG=dl.filter(e=>e.isHourly&&e.liftgateApplied).length;const _pDist=dl.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length;const _pBilled=shiftMins+(_pLG+_pDist)*60;const hrs=Math.round(_pBilled/15)*15/60;h+=`<div class="emser"><span class="lbl">⏱ Emser Hours: ${formatMins(_pBilled)}${_pLG>0?" (incl "+_pLG+"h LG)":""}${_pDist>0?" (incl "+_pDist+"h distance)":""}</span><span class="val">${fmt(102.50*hrs)}</span></div>`;}
/* ── fuel surcharge summary ── */
if(Object.keys(dc.fBC||{}).length>0){h+=`<div class="fuel"><span class="lbl">Fuel Surcharges</span><div>`;Object.entries(dc.fBC).forEach(([cu,cf])=>{h+=`<span style="margin-right:14px;font-size:11px">${cu}: ${fmt(cf.base)} × ${Math.round(cf.pct*100)}% = <b style="color:#d97706">${fmt(cf.base*cf.pct)}</b></span>`;});h+=`</div></div>`;}
/* ── per-driver sections ── */
drivers.forEach((drv)=>{
  const de=drvEntries(drv.id);
  if(!de.length)return;
  const drvRev=de.filter(e=>!e.isHourly&&e.stopType!=="pickup").reduce((s,e)=>s+e.baseRate,0);
  const drvDeliveries=de.filter(e=>e.stopType!=="pickup").length;
  const drvDone=de.filter(e=>e.status==="departed").length;
  const drvMiles=getDriverMiles(drv.id);
  h+=`<div class="section"><div class="section-title"><span>${drv.name} — ${drvDeliveries} stops${drvMiles>0?" · ~"+drvMiles+"mi":""} · ${drvDone}/${drvDeliveries} done</span><span class="amt">${fmt(drvRev)}</span></div>`;
  h+=`<table><tr><th>#</th><th>Status</th><th>Type</th><th>Stop</th><th>Address</th><th>Wt</th><th>Notes</th><th style="text-align:right">Rate</th></tr>`;
  de.forEach((e,i)=>{
    const tag=e.stopType==="pickup"?'<span class="tag pu">PU</span>':e.priority?'<span class="tag pri">PRI</span>':'<span class="tag del">DEL</span>';
    const status=e.status==="departed"?'<span style="color:#16a34a;font-weight:700">✓</span>':e.status==="arrived"?'<span style="color:#d97706;font-weight:700">⟳</span>':'<span style="color:#a8a29e">–</span>';
    const lgBadge=e.liftgateApplied?'<span style="font-size:9px;background:#fef3c7;color:#92400e;padding:1px 4px;border-radius:3px;font-weight:700">LG</span> ':"";
    const wt=e.weight?e.weight.toLocaleString()+" lbs":"";
    const noteCell=`${e.instructions?'<span class="instr">📋 '+e.instructions+'</span><br>':""}${lgBadge}${e.note?'<span class="note">'+e.note+'</span>':""}${e.shipPlan?' <b style="color:#ea580c">SP# '+e.shipPlan+'</b>':""}`;
    h+=`<tr style="${e.status==="departed"?"background:#f0fdf4":e.status==="arrived"?"background:#fffbeb":""}"><td>${i+1}</td><td style="text-align:center">${status}</td><td>${tag}</td><td><b>${e.stop}</b><br><span style="font-size:10px;color:#78716c">${e.customer}</span></td><td style="font-size:10px;color:#78716c">${e.addr||""}</td><td style="font-size:10px;white-space:nowrap">${wt}</td><td>${noteCell}</td><td style="text-align:right;font-weight:700;white-space:nowrap">${e.isHourly?"HR":fmt(e.baseRate)}</td></tr>`;
  });
  h+=`</table></div>`;
});
/* ── unassigned stops ── */
const unassigned=dl.filter(e=>e.driverId===0);
if(unassigned.length>0){
  h+=`<div class="section"><div class="section-title" style="border-left-color:#dc2626"><span>⚠ Unassigned (${unassigned.length})</span></div>`;
  h+=`<table><tr><th>#</th><th>Type</th><th>Stop</th><th>Customer</th><th>Address</th><th>Wt</th><th>Notes</th><th style="text-align:right">Rate</th></tr>`;
  unassigned.forEach((e,i)=>{
    const tag=e.stopType==="pickup"?'<span class="tag pu">PU</span>':e.priority?'<span class="tag pri">PRI</span>':'<span class="tag del">DEL</span>';
    h+=`<tr style="background:#fef2f2"><td>${i+1}</td><td>${tag}</td><td><b>${e.stop}</b></td><td>${e.customer}</td><td style="font-size:10px;color:#78716c">${e.addr||""}</td><td style="font-size:10px">${e.weight?e.weight.toLocaleString()+" lbs":""}</td><td>${e.note?'<span class="note">'+e.note+'</span>':""}</td><td style="text-align:right;font-weight:700">${e.isHourly?"HR":fmt(e.baseRate)}</td></tr>`;
  });
  h+=`</table></div>`;
}
/* ── revenue summary ── */
const custRevPrint={};dl.forEach(e=>{if(!e.isHourly&&e.stopType!=="pickup"){if(!custRevPrint[e.customer])custRevPrint[e.customer]=0;custRevPrint[e.customer]+=e.baseRate;}});
if(shiftMins>0){const _fLG=dl.filter(e=>e.isHourly&&e.liftgateApplied).length;const _fDist=dl.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length;const _fBilled=shiftMins+(_fLG+_fDist)*60;const _hrs=Math.round(_fBilled/15)*15/60;custRevPrint["Emser Tile"]=(custRevPrint["Emser Tile"]||0)+102.50*_hrs;}
const custRevArr2=Object.entries(custRevPrint).sort((a,b)=>b[1]-a[1]);
if(custRevArr2.length>1){
  h+=`<div class="section"><div class="section-title"><span>Revenue by Customer</span><span class="amt">${fmt(dc.total)}</span></div><table>`;
  custRevArr2.forEach(([cu,rev])=>{h+=`<tr><td style="font-weight:600">${cu}</td><td style="text-align:right;font-weight:700;color:#16a34a">${fmt(rev)}</td></tr>`;});
  h+=`</table></div>`;
}
return h;});};
const printWeekly=()=>{printContent("Weekly",()=>{let h=`<div class="header"><div><h1>DAVIS DELIVERY — Weekly Summary</h1><div class="sub">${wd[0].date} — ${wd[4].date}</div></div><div class="total">${fmt(wkT)}</div></div>`;const wkShiftByDrv2={};let wkShiftTotal2=0;let wkBonusTotal2=0;DAYS.forEach((_,i)=>{const{byDriver,totalMins}=getShiftSummary(getFbKey(wo,i));wkShiftTotal2+=totalMins;const _dayEnts=log[`${wo}-${i}`]||[];const _dayLG=_dayEnts.filter(e=>e.isHourly&&e.liftgateApplied).length;const _dayDist=_dayEnts.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length;wkBonusTotal2+=(_dayLG+_dayDist)*60;Object.entries(byDriver).forEach(([did,mins])=>{wkShiftByDrv2[did]=(wkShiftByDrv2[did]||0)+mins;});});if(wkShiftTotal2>0){const _wkBilled2=wkShiftTotal2+wkBonusTotal2;const hrs2=Math.round(_wkBilled2/15)*15/60;h+=`<div class="emser"><div><span class="lbl">⏱ Emser Week Total: ${formatMins(_wkBilled2)}</span><br><span style="font-size:10px;color:#64748b">${drivers.filter(d=>wkShiftByDrv2[d.id]).map(d=>`${d.name}: ${formatMins(wkShiftByDrv2[d.id])}`).join(" · ")}</span></div><span class="val">${fmt(102.50*hrs2)}</span></div>`;}const wkFuel={};DAYS.forEach((_,i)=>{const calc=wkD[i].calc;Object.entries(calc.fBC||{}).forEach(([cu,cf])=>{if(!wkFuel[cu])wkFuel[cu]={pct:cf.pct,base:0};wkFuel[cu].base+=cf.base;});});if(Object.keys(wkFuel).length>0){h+=`<div class="fuel"><div class="lbl">Week Fuel Surcharges</div>`;Object.entries(wkFuel).forEach(([cu,cf])=>{h+=`<div style="display:flex;justify-content:space-between;padding:2px 0"><span>${cu} (${fmt(cf.base)} × ${Math.round(cf.pct*100)}%)</span><b style="color:#d97706">${fmt(cf.base*cf.pct)}</b></div>`;});h+=`</div>`;}DAYS.forEach((day,i)=>{const{entries,calc}=wkD[i];const{totalMins:shiftMins}=getShiftSummary(getFbKey(wo,i));if(!entries.length&&!shiftMins)return;h+=`<div class="section"><div class="section-title"><span>${day} — ${wd[i].date}</span><span class="amt">${fmt(calc.total)}</span></div>`;if(shiftMins>0){const _wpLG=entries.filter(e=>e.isHourly&&e.liftgateApplied).length;const _wpDist=entries.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length;const _wpBilled=shiftMins+(_wpLG+_wpDist)*60;const hrs=Math.round(_wpBilled/15)*15/60;h+=`<div style="padding:3px 10px;background:#eff6ff;border-left:3px solid #2563eb;margin-bottom:4px;font-size:11px"><b style="color:#2563eb">⏱ Emser ${formatMins(_wpBilled)}</b> — ${fmt(102.50*hrs)}</div>`;}h+=`<table><tr><th>Customer</th><th>Stop</th><th>Driver</th><th>Notes</th><th style="text-align:right">Rate</th></tr>`;entries.filter(e=>e.stopType!=="pickup").sort((a,b)=>a.customer.localeCompare(b.customer)).forEach(e=>{const drv=drivers.find(d=>d.id===e.driverId);h+=`<tr><td style="color:#57534e">${e.customer}</td><td><b>${e.stop}</b></td><td>${drv?drv.name:""}</td><td style="font-size:10px">${e.instructions?'<span class="instr">'+e.instructions+'</span> ':""}${e.shipPlan?'<b style="color:#ea580c">SP# '+e.shipPlan+'</b>':""}</td><td style="text-align:right;font-weight:700">${e.isHourly?"HR":fmt(e.baseRate)}</td></tr>`;});h+=`</table></div>`;});return h;});};


const exportBackup=()=>{
  const backup={
    version:APP_VERSION,
    exportedAt:new Date().toISOString(),
    manifests:log,
    drivers,
    emserHours:emH,
    emserShifts,
    dispatchNotes:dispNotes,
    customStops,
    stopOverrides,
    hiddenStops,
    driverCapacity,
    savedQuotes,
  };
  const json=JSON.stringify(backup,null,2);
  const blob=new Blob([json],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  const dateStr=new Date().toISOString().slice(0,10);
  a.href=url;a.download=`glory-bound-backup-${dateStr}.json`;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Backup downloaded");
};
const importBackup=(file)=>{
  const reader=new FileReader();
  reader.onload=(e)=>{
    try{
      const data=JSON.parse(e.target.result);
      if(!data.manifests){showToast("Invalid backup file");return;}
      /* Merge manifests — don't overwrite existing data */
      setLog(prev=>{
        const merged={...prev};
        let count=0;
        Object.entries(data.manifests).forEach(([key,entries])=>{
          if(entries&&entries.length>0&&(!merged[key]||merged[key].length===0)){
            merged[key]=entries;
            count++;
          }
        });
        showToast(count>0?`Restored ${count} days from backup`:"No new data to restore");
        return merged;
      });
      /* Restore other data if present */
      if(data.emserHours)setEmH(prev=>({...prev,...data.emserHours}));
      if(data.dispatchNotes)setDispNotes(prev=>({...prev,...data.dispatchNotes}));
      if(data.customStops&&Object.keys(data.customStops).length)setCustomStops(prev=>({...prev,...data.customStops}));
      if(data.savedQuotes&&Object.keys(data.savedQuotes).length)setSavedQuotes(prev=>({...prev,...data.savedQuotes}));
    }catch(err){showToast("Failed to read backup: "+err.message);}
  };
  reader.readAsText(file);
};


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
- DCO Eatonton: Long-distance run — schedule early, allow 2+ hours travel, +1h distance bonus
- DCO Athens: Long-distance run — +1h distance bonus
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
- PARSING DISPATCH PHOTOS: When the user sends a photo of a dispatch email or describes deliveries, extract each delivery stop and respond with a JSON block like this:
\`\`\`json
{"stops":[{"stop":"Customer Name","customer":"Florida Tile","weight":5000,"note":"from Norcross","rate":175},{"stop":"Another Customer","customer":"Emser Tile","weight":8000,"note":"from Roswell","rate":0}]}
\`\`\`
CRITICAL: Always include the "customer" field. Many stops exist in BOTH Emser Tile and Florida Tile. The user will tell you which customer — use that. If the user says "Florida Tile deliveries", set customer to "Florida Tile" for ALL stops. If the user says "Emser" or doesn't specify, use "Emser Tile". For Florida Tile, include the flat rate from the rate sheet. For Emser (hourly), rate should be 0.
Match stop names to known customers: AFD = "Atlanta Flooring - Suwanee", ELITE = "Elite Flooring - Norcross", FWORX = "Floorworx - Norcross", IDLEWOOD = "Idlewood - Norcross", VALUFLOR = "Valufloor - Doraville", BEC = "BEC - Alpharetta", PEACHWOOD = "Peachwood Floor Covering", AMERICAN FLOORING = "American Flooring Services", DCO = varies by location, HILLMAN = "Hillman - Sugar Hill", BRITTS = "Britts - Lawrenceville", STOCCO = "Stocco - Alpharetta", NE CORNER = "NE Corner - Flowery Branch", PREMIER = "Premier - Suwanee", PROSOURCE = varies by location, VANGUARD = "Vanguard - Norcross", SE COMMERCIAL = "SE Commercial - Woodstock", PRECISION = "Precision Flooring - Norcross", ATL WEST = "Atlanta West - Lithia Springs", ATL FLOORING = "Atlanta Flooring - Suwanee", SHERWIN = varies by location, GEL = "Gel & Associates - Atlanta", STRATHMORE = "Strathmore - Atlanta", FLOORING DESIGN = "Flooring Design Group - Doraville", D3 = "D3 - Woodstock", PRESTIGIOUS = "Prestigious - Alpharetta", MADISON = "Madison Flooring Group", CONSTRUCTION RESOURCES = "Construction Resources - Decatur", BFC = "Builders Floor Coverings - Decatur", BUILDERS = "Builders Floor Coverings - Decatur", NOCO = "NOCO Contracting", PEACHWOOD SUWANEE = "Peachwood Floor Covering", ADVANCE = "Advanced Flooring Design - Mableton", ADV FLOORING = "Advanced Flooring Design - Mableton".
Include weight in lbs. When weight is listed as a number followed by K (e.g. 8K), multiply by 1000 (8K = 8000 lbs). When weight is listed with LBS (e.g. 500 LBS), use as-is (500 LBS = 500 lbs). Do NOT convert LBS values to thousands. Note which pickup location (Norcross or Roswell) each stop comes from. Stops listed under "ROSWELL:" are from Roswell pickup; all others default to Norcross. If a stop appears under BOTH Norcross and Roswell sections, list it twice with the appropriate pickup noted.

When suggesting route orders, ALWAYS show time constraints first, then order remaining stops by geographic proximity in the Atlanta metro.
If two stops have conflicting time windows, flag the conflict clearly before suggesting a route.
Keep responses concise and actionable — the owner is on mobile.
Use dollar amounts with tabular formatting when discussing money.
Never make up addresses or rates — only use data provided above.`;
};

const sendChat=async()=>{
if((!chatInput.trim()&&!chatImage)||chatLoading)return;
const hasImage=!!chatImage;
/* Build user message content — text only or multimodal */
let userContent;
if(hasImage){
  const parts=[];
  if(chatImage.mediaType==="application/pdf"){
    parts.push({type:"document",source:{type:"base64",media_type:"application/pdf",data:chatImage.base64}});
  }else{
    parts.push({type:"image",source:{type:"base64",media_type:chatImage.mediaType||"image/jpeg",data:chatImage.base64}});
  }
  parts.push({type:"text",text:chatInput.trim()||"Parse this dispatch email and extract all delivery stops as JSON."});
  userContent=parts;
}else{
  userContent=chatInput.trim();
}
const fileLabel=chatImage?.fileName||"📷 Dispatch photo";
const userMsg={role:"user",content:userContent,_preview:hasImage?chatImage.preview:null,_text:chatInput.trim()||(hasImage?fileLabel:"")};const newMessages=[...chatMessages,userMsg];
setChatMessages(newMessages);
setChatInput("");
setChatImage(null);
setChatLoading(true);
try{
const payload={
model:"claude-haiku-4-5-20251001",
max_tokens:2048,
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
/* Attempt 2: Direct Anthropic API */
if(!data){
try{
const r2=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify(payload)});
if(r2.ok){data=await r2.json();if(!data?.content)data=null;}
else{const t2=await r2.text();errDetails+="\nDirect API: "+t2.slice(0,200);}
}catch(e2){errDetails+="\nDirect API error: "+e2.message;}
}
if(data&&data.content){
const assistantText=data.content.map(c=>c.type==="text"?c.text:"").join("")||"No response.";
/* Check if response contains parseable stops JSON */
let parsedStops=null;
try{
  const jsonMatch=assistantText.match(/```json\s*([\s\S]*?)```/)||assistantText.match(/(\{[\s\S]*"stops"\s*:\s*\[[\s\S]*\]\s*\})/);
  if(jsonMatch){
    const parsed=JSON.parse(jsonMatch[1]||jsonMatch[0]);
    if(parsed.stops&&Array.isArray(parsed.stops))parsedStops=parsed.stops;
  }
}catch(e){}
setChatMessages(prev=>[...prev,{role:"assistant",content:assistantText,_stops:parsedStops}]);
}else{
setChatMessages(prev=>[...prev,{role:"assistant",content:"AI unavailable.\n\n"+errDetails+"\n\nTo fix:\n1. Set ANTHROPIC_API_KEY in Netlify env vars\n2. Redeploy the site\n3. Ensure the API key has credits"}]);
}
}catch(err){
setChatMessages(prev=>[...prev,{role:"assistant",content:"Connection error: "+err.message}]);
}
setChatLoading(false);
};


if(driverViewId){
const drv=drivers.find(d=>d.id===driverViewId);
const de=drvEntries(driverViewId);
return(
<div>
<button onClick={()=>setDriverViewId(null)} style={{position:"fixed",top:12,right:12,zIndex:50,background:"#1c1917",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>← Dispatch View</button>
<DriverView driver={drv} entries={de} dayLabel={`${wd[sd].name} — ${wd[sd].date}`}
onStatusUpdate={updateStatus} onPhotoUpload={addPhoto} onSignature={addSignature} onEta={setEta} onShipPlan={setShipPlan} onLiftgate={requestLiftgate}/>
</div>
);
}


/* For add/selCust/quoteMode on desktop, fall through to the shared mobile layout below */
if(isDesktop&&view!=="add"&&!selCust&&!quoteMode){
const dkNote=dispNotes[emDk]||"";
const allDriverEntries=drivers.map((drv,di)=>({drv,di,entries:drvEntries(drv.id)}));
const uaEntries=dl.filter(e=>e.driverId===0);
const custRevenue={};dl.forEach(e=>{if(!e.isHourly){if(!custRevenue[e.customer])custRevenue[e.customer]=0;custRevenue[e.customer]+=e.baseRate;}});
if(dl.some(e=>e.isHourly)){const{totalMins:_crMins}=getShiftSummary(emDk);const _crLG=dl.filter(e=>e.isHourly&&e.liftgateApplied).length;const _crDist=dl.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length;const _crHrs=_crMins>0?Math.round((_crMins+(_crLG+_crDist)*60)/15)*15/60:(emH[`${emDk}-emser`]||4);custRevenue["Emser Tile"]=(custRevenue["Emser Tile"]||0)+102.50*_crHrs;}
const custRevArr=Object.entries(custRevenue).sort((a,b)=>b[1]-a[1]);
const maxCustRev=Math.max(...custRevArr.map(c=>c[1]),1);
const statusCounts={pending:0,arrived:0,departed:0};
dl.filter(e=>e.stopType!=="pickup").forEach(e=>{if(e.status==="departed")statusCounts.departed++;else if(e.status==="arrived")statusCounts.arrived++;else statusCounts.pending++;});
const deliveryCount=dl.filter(e=>e.stopType!=="pickup").length;

return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#f8f7f5",color:"#1c1917",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
{toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#16a34a",color:"#fff",padding:"10px 24px",borderRadius:12,fontWeight:600,fontSize:14,zIndex:1000,boxShadow:"0 8px 32px rgba(22,163,74,0.3)",animation:"slideDown 0.3s ease"}}>{"\u2713 "+toast}</div>}

{/* Message popup notification */}
{msgPopup&&<div style={{position:"fixed",top:20,right:20,zIndex:1001,background:"#fff",border:"2px solid "+BRAND.main,borderRadius:16,padding:"14px 18px",boxShadow:"0 12px 40px rgba(30,91,146,0.25)",maxWidth:340,cursor:"pointer",animation:"slideDown 0.3s ease"}} onClick={()=>{setShowMsgPanel(true);setMsgPopup(null);}}>
<div style={_s.flexC10}>
<div style={{width:36,height:36,borderRadius:10,background:BRAND.main,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff",flexShrink:0}}>💬</div>
<div style={_s.f1m}>
<div style={{fontSize:12,fontWeight:700,color:BRAND.main}}>{msgPopup.from}</div>
<div style={{fontSize:13,color:"#1c1917",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{msgPopup.text}</div>
<div style={{fontSize:10,color:"#a8a29e",marginTop:2}}>{msgPopup.time} · Tap to reply</div>
</div>
<button onClick={e=>{e.stopPropagation();setMsgPopup(null);}} style={{background:"none",border:"none",color:"#a8a29e",fontSize:16,cursor:"pointer",padding:"0 4px",flexShrink:0}}>✕</button>
</div>
</div>}

{/* Liftgate request notifications */}
{liftgateRequests.filter(r=>r.status==="pending").length>0&&<div style={{position:"fixed",top:60,right:20,zIndex:999,display:"flex",flexDirection:"column",gap:6,maxWidth:360}}>
{liftgateRequests.filter(r=>r.status==="pending").map(req=>(
<div key={req.id} style={{background:"#fff",border:"2px solid #ea580c",borderRadius:14,padding:"14px 16px",boxShadow:"0 8px 32px rgba(234,88,12,0.2)",animation:"slideDown 0.3s ease"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
<span style={{fontSize:20}}>🔄</span>
<div style={_s.f1}>
<div style={{fontSize:13,fontWeight:700,color:"#ea580c"}}>Liftgate Request</div>
<div style={{fontSize:12,color:"#1c1917",fontWeight:600}}>{req.stop}</div>
<div style={_s.sub}>From {req.driverName} at {req.time}</div>
</div>
</div>
<div style={{fontSize:12,color:"#57534e",marginBottom:10}}>Apply $75 liftgate charge to this delivery?</div>
<div style={_s.flexG6}>
<button onClick={()=>approveLiftgate(req.id)} style={{flex:1,background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:12,fontWeight:700}}>✓ Approve +$75</button>
<button onClick={()=>denyLiftgate(req.id)} style={{flex:1,background:"#fef2f2",color:"#dc2626",border:"1px solid #fca5a5",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:12,fontWeight:600}}>Deny</button>
</div>
</div>
))}
</div>}

{/* \u2500\u2500 TOP BAR \u2500\u2500 */}
<div style={{background:"#f7f7f6",borderBottom:"1px solid #e7e5e4",padding:"8px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
<div style={{display:"flex",alignItems:"center",gap:24}}>
<div style={_s.flexC8}>
<a href={window.location.pathname} onClick={e=>{e.preventDefault();setView("manifest");setSelCust(null);setQuoteMode(null);window.history.replaceState(null,"",window.location.pathname);window.scrollTo(0,0);}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
<img src={LOGO_URI} alt="Davis Delivery Service" style={{height:38,objectFit:"contain"}}/>
</a>
<span style={{fontSize:9,color:"#a8a29e",fontWeight:600,letterSpacing:"0.02em"}}>v{APP_VERSION}</span>
{saveStatus&&<span style={{fontSize:9,fontWeight:700,color:saveStatus.includes("FAIL")?"#dc2626":saveStatus.includes("saving")?"#d97706":"#16a34a",marginLeft:4}}>{saveStatus}</span>}
<span style={{display:"inline-block",width:6,height:6,borderRadius:3,background:fbConnected?"#16a34a":"#dc2626",marginLeft:6}}/>
</div>
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
<div style={_s.flexC10}>
{view!=="manifest"&&<button onClick={()=>{setView("manifest");setSelCust(null);setQuoteMode(null);window.history.replaceState(null,"",window.location.pathname);window.scrollTo(0,0);}} style={{background:BRAND.main,border:"none",color:"#fff",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:700}}>{"← Dashboard"}</button>}
{[{k:"daily",l:"Daily"},{k:"weekly",l:"Weekly"},{k:"routes",l:"Routes"},{k:"add",l:"+ Add"}].map(v=><button key={v.k} onClick={()=>{setView(v.k);setSelCust(null);setQuoteMode(null);if(v.k==="routes"){setRpInited(false);}}} style={{background:view===v.k?(v.k==="add"?"#16a34a":v.k==="routes"?"#d97706":BRAND.main):v.k==="add"?"#f0fdf4":v.k==="routes"?"#fffbeb":"#fff",border:view===v.k?"none":v.k==="add"?"1px solid #bbf7d0":v.k==="routes"?"1px solid #fde68a":"1px solid #e7e5e4",color:view===v.k?"#fff":v.k==="add"?"#16a34a":v.k==="routes"?"#d97706":"#57534e",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>{v.l}</button>)}
<div style={{position:"relative"}}>
<button onClick={()=>setShowMoreMenu(!showMoreMenu)} style={{background:view==="history"?BRAND.main:"#fff",border:view==="history"?"none":"1px solid #e7e5e4",color:view==="history"?"#fff":"#57534e",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>{view==="history"?(histMode==="quotes"?"Quotes":histMode==="emser"?"Emser Hrs":"History"):"More ⋯"}</button>
{showMoreMenu&&<><div style={{position:"fixed",inset:0,zIndex:199}} onClick={()=>setShowMoreMenu(false)}/>
<div style={{position:"absolute",top:"100%",right:0,zIndex:200,background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:6,marginTop:4,boxShadow:"0 12px 40px rgba(0,0,0,0.18)",width:240}}>
{[
{icon:"📋",label:"Delivery History",desc:"Search past deliveries",mode:"deliveries"},
{icon:"📷",label:"Photos",desc:"Delivery photos & POD",mode:"photos"},
{icon:"💰",label:"Quotes",desc:"Create & manage quotes",mode:"quotes"},
{icon:"⏱",label:"Emser Hours",desc:"Track driver shift hours",mode:"emser"},
].map(item=>(
<button key={item.mode} onClick={()=>{setView("history");setHistMode(item.mode);setShowMoreMenu(false);}}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"10px 12px",marginBottom:2,borderRadius:10,border:view==="history"&&histMode===item.mode?"2px solid "+BRAND.main:"1px solid transparent",background:view==="history"&&histMode===item.mode?"#f0f5fa":"#fff",cursor:"pointer"}}
onMouseEnter={e=>{if(!(view==="history"&&histMode===item.mode))e.currentTarget.style.background="#f5f5f4";}} onMouseLeave={e=>{e.currentTarget.style.background=view==="history"&&histMode===item.mode?"#f0f5fa":"#fff";}}>
<span style={{fontSize:18,width:28,textAlign:"center",flexShrink:0}}>{item.icon}</span>
<div>
<div style={{fontSize:12,fontWeight:700,color:view==="history"&&histMode===item.mode?BRAND.main:"#1c1917"}}>{item.label}</div>
<div style={{fontSize:9,color:"#78716c"}}>{item.desc}</div>
</div>
</button>
))}
<div style={{borderTop:"1px solid #e7e5e4",marginTop:4,paddingTop:4}}>
<button onClick={()=>{exportBackup();setShowMoreMenu(false);}}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"10px 12px",marginBottom:2,borderRadius:10,border:"1px solid transparent",background:"#fff",cursor:"pointer"}}
onMouseEnter={e=>{e.currentTarget.style.background="#f5f5f4";}} onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
<span style={{fontSize:18,width:28,textAlign:"center",flexShrink:0}}>💾</span>
<div><div style={{fontSize:12,fontWeight:700,color:"#1c1917"}}>Backup Data</div><div style={{fontSize:9,color:"#78716c"}}>Export all data as JSON</div></div>
</button>
<label style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:10,border:"1px solid transparent",background:"#fff",cursor:"pointer"}}
onMouseEnter={e=>{e.currentTarget.style.background="#f5f5f4";}} onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
<span style={{fontSize:18,width:28,textAlign:"center",flexShrink:0}}>📂</span>
<div><div style={{fontSize:12,fontWeight:700,color:"#1c1917"}}>Restore Backup</div><div style={{fontSize:9,color:"#78716c"}}>Import from JSON file</div></div>
<input type="file" accept=".json" style={{display:"none"}} onChange={e=>{if(e.target.files[0]){importBackup(e.target.files[0]);setShowMoreMenu(false);}e.target.value="";}}/>
</label>
</div>
</div></>}
</div>
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

{}
{view==="routes"&&(dl.length===0
?<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:"#f8f7f5"}}><div style={{textAlign:"center",color:"#a8a29e"}}><div style={{fontSize:48,marginBottom:12}}>🗺️</div><p style={{fontSize:16,fontWeight:600,margin:"0 0 8px"}}>No stops to route</p><p style={{fontSize:13,margin:0}}>Add deliveries via + Add, then build routes here.</p></div></div>
:(()=>{
/* rpOrders initialized via useEffect when Routes tab opens */


const rpUnassigned=dl.filter(e=>!Object.values(rpOrders).flat().includes(e.id));
const rpE=(id)=>dl.find(e=>e.id===id);
const rpTotal=Object.values(rpOrders).reduce((s,ids)=>s+ids.length,0);


const rpC=(e)=>{if(!e)return null;const addr=e.addr||getAddr(e.stop);return getCoords(addr);};
const rpO={lat:33.93,lng:-84.21};
const rpD=(a,b)=>Math.sqrt(Math.pow(a.lat-b.lat,2)+Math.pow(a.lng-b.lng,2));
const rpDO=(e)=>{const c=rpC(e);return c?rpD(rpO,c):0;};
/* Approximate miles from lat/lng delta (Atlanta area ~1deg lat≈69mi, 1deg lng≈59mi) */
const rpMiles=(a,b)=>{if(!a||!b)return 0;return Math.sqrt(Math.pow((a.lat-b.lat)*69,2)+Math.pow((a.lng-b.lng)*59,2));};
const rpSplit=(entries)=>{
const pu=entries.filter(e=>e.stopType==="pickup"||e.dueBy?.startsWith("Pickup"));
const tm=entries.filter(e=>e.dueBy&&!e.dueBy.startsWith("Pickup")&&!pu.includes(e));
const rg=entries.filter(e=>!pu.includes(e)&&!tm.includes(e));
return{pu,tm,rg};
};
const rpSet=(drvId,sorted,msg)=>{setRpOrders(p=>({...p,[drvId]:sorted.map(e=>e.id)}));setRpOptMenu(null);showToast(msg);};


const rpParseTime=(db)=>{if(!db)return 9999;const m=db.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);if(!m)return 9999;let h=parseInt(m[1]);const min=parseInt(m[2]||"0");const ap=(m[3]||"").toUpperCase();if(ap==="PM"&&h!==12)h+=12;if(ap==="AM"&&h===12)h=0;return h*60+min;};



/* 1. Closest → Furthest */
const rpOptClose=(did)=>{const ids=rpOrders[did]||[];if(ids.length<2)return;const es=ids.map(id=>rpE(id)).filter(Boolean);const{pu,tm,rg}=rpSplit(es);
rg.sort((a,b)=>rpDO(a)-rpDO(b));tm.sort((a,b)=>rpDO(a)-rpDO(b));
rpSet(did,[...pu,...tm,...rg],"📍 Closest → Furthest");};

/* 2. Furthest → Closest */
const rpOptFar=(did)=>{const ids=rpOrders[did]||[];if(ids.length<2)return;const es=ids.map(id=>rpE(id)).filter(Boolean);const{pu,tm,rg}=rpSplit(es);
rg.sort((a,b)=>rpDO(b)-rpDO(a));tm.sort((a,b)=>rpDO(b)-rpDO(a));
rpSet(did,[...pu,...tm,...rg],"🏁 Furthest → Closest");};

/* 3. By Time Constraint */
const rpOptTime=(did)=>{const ids=rpOrders[did]||[];if(ids.length<2)return;const es=ids.map(id=>rpE(id)).filter(Boolean);const{pu,tm,rg}=rpSplit(es);
tm.sort((a,b)=>rpParseTime(a.dueBy)-rpParseTime(b.dueBy));rg.sort((a,b)=>rpDO(a)-rpDO(b));
rpSet(did,[...pu,...tm,...rg],"⏰ By Time Constraint");};

/* 4. Shortest Distance (nearest-neighbor) */
const rpOptShort=(did)=>{const ids=rpOrders[did]||[];if(ids.length<2)return;const es=ids.map(id=>rpE(id)).filter(Boolean);const{pu}=rpSplit(es);
const all=es.filter(e=>!pu.includes(e));const sorted=[];const rem=[...all];
let cur=pu.length?(rpC(pu[pu.length-1])||rpO):rpO;
while(rem.length){let bi=0,bd=Infinity;rem.forEach((e,i)=>{const c=rpC(e);if(!c)return;const d=rpD(cur,c);if(d<bd){bd=d;bi=i;}});const nx=rem.splice(bi,1)[0];const nc=rpC(nx);if(nc)cur=nc;sorted.push(nx);}
rpSet(did,[...pu,...sorted],"🧭 Shortest Distance");};

/* 5. Reverse */
const rpOptRev=(did)=>{const ids=rpOrders[did]||[];if(ids.length<2)return;const es=ids.map(id=>rpE(id)).filter(Boolean);const{pu}=rpSplit(es);
const np=es.filter(e=>!pu.includes(e));np.reverse();
rpSet(did,[...pu,...np],"🔄 Route Reversed");};

/* 6. Google Directions API optimized route */
const rpOptGoogle=(did)=>{
const ids=rpOrders[did]||[];if(ids.length<2)return;
if(!window.google?.maps?.DirectionsService){showToast("Google Maps not loaded");return;}
const es=ids.map(id=>rpE(id)).filter(Boolean);const{pu}=rpSplit(es);
const dels=es.filter(e=>!pu.includes(e));
if(dels.length<2){showToast("Need 2+ delivery stops");return;}
if(dels.length>23){showToast("Max 23 stops for API optimization");return;}
showToast("⏳ Calculating optimal route...");
const coords=dels.map(e=>rpC(e)).filter(Boolean);
if(coords.length!==dels.length){showToast("Some stops missing coordinates");rpOptShort(did);return;}
const origin=rpO;
const dest=coords[coords.length-1];
const waypoints=coords.slice(0,-1).map(c=>({location:c,stopover:true}));
const svc=new window.google.maps.DirectionsService();
svc.route({origin,destination:dest,waypoints,travelMode:window.google.maps.TravelMode.DRIVING,optimizeWaypoints:true},(result,status)=>{
  if(status==="OK"&&result.routes[0]?.waypoint_order){
    const order=result.routes[0].waypoint_order;
    /* waypoint_order maps to dels[0..n-2], dest stays last */
    const reordered=[...order.map(i=>dels[i]),dels[dels.length-1]];
    const legs=result.routes[0].legs;
    const totalMi=legs.reduce((s,l)=>s+(l.distance?.value||0),0)/1609.34;
    const totalMin=legs.reduce((s,l)=>s+(l.duration?.value||0),0)/60;
    rpSet(did,[...pu,...reordered],`🗺 Google Optimized — ${Math.round(totalMi)}mi, ~${Math.round(totalMin)}min`);
  }else{
    showToast("API optimization failed — using straight-line fallback");
    rpOptShort(did);
  }
});
};


const rpClick=(entryId)=>{if(!rpActive)return;
/* Find all entries at the same stop name + address */
const entry=dl.find(e=>e.id===entryId);
const addr=entry?(entry.addr||getAddr(entry.stop)):"";
const siblings=entry?dl.filter(e=>(e.addr||getAddr(e.stop))===addr&&e.stop===entry.stop).map(e=>e.id):[entryId];
const ids=rpOrders[rpActive]||[];
if(ids.includes(entryId)){
  /* Remove all siblings */
  setRpOrders(p=>({...p,[rpActive]:ids.filter(x=>!siblings.includes(x))}));
}else{
  /* Add all siblings not already assigned */
  const cl={};Object.entries(rpOrders).forEach(([d,a])=>{cl[d]=a.filter(x=>!siblings.includes(x));});
  cl[rpActive]=[...(cl[rpActive]||[]),...siblings.filter(s=>!(cl[rpActive]||[]).includes(s))];
  setRpOrders(cl);
}};

const rpApply=()=>{Object.entries(rpOrders).forEach(([did,ids])=>{ids.forEach(id=>reassign(id,Number(did)));if(ids.length>0)reorderDriver(Number(did),ids);});rpUnassigned.forEach(e=>{if(e.driverId!==0)reassign(e.id,0);});showToast("Routes applied");setView("manifest");};

const rpDr=(drvId,toIdx)=>{if(!rpDragSrc)return;
if(rpDragSrc.drvId===drvId){setRpOrders(p=>{const ids=[...(p[drvId]||[])];const[mv]=ids.splice(rpDragSrc.idx,1);ids.splice(toIdx,0,mv);return{...p,[drvId]:ids};});}
else if(rpDragSrc.drvId==="pool"){const eid=rpDragSrc.idx;setRpOrders(p=>({...p,[drvId]:[...(p[drvId]||[]),eid]}));}
else{const eid=(rpOrders[rpDragSrc.drvId]||[])[rpDragSrc.idx];if(eid){setRpOrders(p=>{const s=[...(p[rpDragSrc.drvId]||[])].filter(x=>x!==eid);const d=[...(p[drvId]||[])];d.splice(toIdx,0,eid);return{...p,[rpDragSrc.drvId]:s,[drvId]:d};});}}
setRpDragSrc(null);setRpDragOver(null);};

const rpAddUA=(eid,did)=>{setRpOrders(p=>({...p,[did]:[...(p[did]||[]),eid]}));};
const rpRemove=(eid,did)=>{setRpOrders(p=>({...p,[did]:(p[did]||[]).filter(x=>x!==eid)}));};

/* Auto-fill unassigned by nearest driver */
const rpFill=()=>{if(!rpUnassigned.length)return;const nw={...rpOrders};
rpUnassigned.forEach(e=>{const ec=rpC(e);let bd=drivers[0]?.id,bv=Infinity;
drivers.forEach(d=>{const ids=nw[d.id]||[];let lc=rpO;if(ids.length){const l=rpE(ids[ids.length-1]);const lcc=rpC(l);if(lcc)lc=lcc;}const dist=ec?rpD(ec,lc):ids.length;if(dist<bv){bv=dist;bd=d.id;}});
nw[bd]=[...(nw[bd]||[]),e.id];});
setRpOrders(nw);showToast("Auto-filled "+rpUnassigned.length+" stops");};

/* Conflict detection */
const rpConf=(did)=>{const ids=rpOrders[did]||[];const cf=[];
const td=ids.map((id,i)=>{const e=rpE(id);return e?.dueBy?{s:e.stop,t:rpParseTime(e.dueBy),i,db:e.dueBy}:null;}).filter(Boolean);
for(let i=0;i<td.length;i++){for(let j=i+1;j<td.length;j++){if(td[i].t!==9999&&td[j].t!==9999&&td[i].t>td[j].t&&td[i].i<td[j].i)cf.push(`${td[j].s} due earlier but later in route`);}}
return cf;};

/* Driver stats */
const rpSt=(did)=>{const ids=rpOrders[did]||[];const cap=getDriverCapacity(did);const tw=ids.reduce((s,id)=>{const e=rpE(id);return s+(e?.weight||0);},0);
const pus=ids.filter(id=>{const e=rpE(id);return e?.stopType==="pickup";}).length;
const dels=ids.length-pus;const timed=ids.filter(id=>{const e=rpE(id);return!!e?.dueBy;}).length;
const rev=ids.reduce((s,id)=>{const e=rpE(id);return s+(e?.isHourly?0:(e?.baseRate||0));},0);
/* Estimate total route miles */
let miles=0;const pts=[rpO];ids.forEach(id=>{const e=rpE(id);const c=rpC(e);if(c)pts.push(c);});
for(let i=1;i<pts.length;i++)miles+=rpMiles(pts[i-1],pts[i]);
return{tw,cap,pus,dels,timed,rev,miles:Math.round(miles)};};

/* Map stops with route order */
const mapS=dl.map(e=>{const addr=e.addr||getAddr(e.stop);const coords=getCoords(addr);if(!coords)return null;
let ad=0,ro=0;Object.entries(rpOrders).forEach(([did,ids])=>{const idx=ids.indexOf(e.id);if(idx>=0){ad=Number(did);ro=idx+1;}});
return{...e,coords,driverId:ad,routeOrder:ro};}).filter(Boolean);

const actColor=rpActive?DCOL[drivers.findIndex(d=>d.id===rpActive)]||BRAND.main:BRAND.main;


return(
<div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:0,flex:1,overflow:"hidden",minHeight:0}}>

{}
<div style={{background:"#fff",borderRight:"1px solid #e7e5e4",display:"flex",flexDirection:"column",overflow:"hidden"}}>

{/* Header */}
<div style={{padding:"14px 16px 12px",background:"linear-gradient(135deg, #1c1917 0%, #292524 100%)",color:"#fff",flexShrink:0}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
<div>
<h2 style={{margin:0,fontSize:18,fontWeight:800,letterSpacing:"-0.02em"}}>Route Planner</h2>
<p style={{margin:"3px 0 0",fontSize:11,color:"#a8a29e"}}>{wd[sd].name} — {wd[sd].date} · {dl.length} stops</p>
</div>
<div style={{display:"flex",gap:4}}>
<button onClick={()=>{setView("manifest");setRpInited(false);}} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600,color:"#d6d3d1"}}>← Back</button>
</div>
</div>
{/* Stats bar */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
<div style={{background:"rgba(22,163,74,0.15)",borderRadius:8,padding:"8px 6px",textAlign:"center",border:"1px solid rgba(22,163,74,0.3)"}}>
<div style={{fontSize:20,fontWeight:800,color:"#4ade80"}}>{rpTotal}</div>
<div style={{fontSize:8,color:"#86efac",fontWeight:600,letterSpacing:"0.05em"}}>ROUTED</div>
</div>
<div style={{background:rpUnassigned.length?"rgba(220,38,38,0.15)":"rgba(255,255,255,0.05)",borderRadius:8,padding:"8px 6px",textAlign:"center",border:rpUnassigned.length?"1px solid rgba(220,38,38,0.3)":"1px solid rgba(255,255,255,0.1)"}}>
<div style={{fontSize:20,fontWeight:800,color:rpUnassigned.length?"#fca5a5":"#57534e"}}>{rpUnassigned.length}</div>
<div style={{fontSize:8,color:rpUnassigned.length?"#fca5a5":"#78716c",fontWeight:600,letterSpacing:"0.05em"}}>POOL</div>
</div>
<div style={{borderRadius:8,padding:"8px 6px",textAlign:"center"}}>
{rpUnassigned.length>0?<button onClick={rpFill} style={{background:"#d97706",color:"#fff",border:"none",borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:10,fontWeight:700,width:"100%"}}>⚡ Auto Fill</button>
:<div style={{color:"#4ade80",fontSize:14,fontWeight:800,marginTop:2}}>✓ All set</div>}
</div>
</div>
</div>

{/* Driver Panels */}
<div style={{flex:1,overflowY:"auto",padding:"8px 10px 80px"}}>
{drivers.map((drv,di)=>{
const ids=rpOrders[drv.id]||[];const isAct=rpActive===drv.id;const st=rpSt(drv.id);const cf=rpConf(drv.id);
return(
<div key={drv.id}
onDragOver={e=>{e.preventDefault();if(!ids.length)setRpDragOver({drvId:drv.id,idx:0});}}
onDrop={()=>{if(!ids.length)rpDr(drv.id,0);}}
style={{marginBottom:8,borderRadius:14,border:isAct?`2px solid ${DCOL[di]}`:"1px solid #e7e5e4",overflow:"hidden",transition:"all 0.2s",boxShadow:isAct?`0 4px 20px ${DCOL[di]}22`:"0 1px 3px rgba(0,0,0,0.04)"}}>

{/* Driver Header */}
<div onClick={()=>{setRpActive(isAct?null:drv.id);setRpOptMenu(null);}}
style={{padding:"12px 14px",cursor:"pointer",background:isAct?`linear-gradient(135deg, ${DCOL[di]}08, ${DCOL[di]}15)`:"#fafaf9",borderBottom:ids.length||isAct?"1px solid #e7e5e4":"none",transition:"background 0.15s"}}>
<div style={_s.flexC10}>
<div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg, ${DCOL[di]}, ${DCOL[di]}cc)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff",fontWeight:800,flexShrink:0,boxShadow:isAct?`0 3px 10px ${DCOL[di]}44`:"none"}}>{drv.name.charAt(0)}</div>
<div style={_s.f1m}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:15,fontWeight:700,color:isAct?DCOL[di]:"#1c1917"}}>{drv.name}</span>
{ids.length>0&&<span style={{fontSize:10,background:DCOL[di]+"18",color:DCOL[di],padding:"2px 8px",borderRadius:10,fontWeight:700}}>{ids.length}</span>}
{isAct&&<span style={{fontSize:8,background:DCOL[di],color:"#fff",padding:"2px 7px",borderRadius:5,fontWeight:700,marginLeft:"auto"}}>ACTIVE</span>}
</div>
{/* Rich stats row */}
{ids.length>0&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:4,flexWrap:"wrap"}}>
{st.pus>0&&<span style={{fontSize:9,color:"#2563eb",fontWeight:700,background:"#eff6ff",padding:"1px 6px",borderRadius:4}}>{st.pus} PU</span>}
<span style={{fontSize:9,color:"#57534e",background:"#f5f5f4",padding:"1px 6px",borderRadius:4}}>{st.dels} del</span>
{st.timed>0&&<span style={{fontSize:9,color:"#dc2626",fontWeight:700,background:"#fef2f2",padding:"1px 6px",borderRadius:4}}>⏰ {st.timed}</span>}
{st.miles>0&&<span style={{fontSize:9,color:"#78716c",fontVariantNumeric:"tabular-nums"}}>~{st.miles}mi</span>}
{st.rev>0&&<span style={{fontSize:9,color:"#16a34a",fontWeight:700,fontVariantNumeric:"tabular-nums",marginLeft:"auto"}}>{fmt(st.rev)}</span>}
</div>}
{/* Weight bar */}
{st.tw>0&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
<div style={{flex:1,maxWidth:120,height:5,background:"#e7e5e4",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:weightPct(st.tw,st.cap)+"%",background:weightColor(st.tw,st.cap),borderRadius:3,transition:"width 0.3s"}}/></div>
<span style={{fontSize:11,fontWeight:700,color:weightColor(st.tw,st.cap)}}>{st.tw.toLocaleString()}/{(st.cap/1000).toFixed(0)}k</span>
</div>}
</div>
</div>

{/* Action buttons — only when active */}
{isAct&&ids.length>=2&&<div style={{display:"flex",gap:4,marginTop:8}}>
<div style={{position:"relative",flex:1}}>
<button onClick={e=>{e.stopPropagation();setRpOptMenu(rpOptMenu===drv.id?null:drv.id);}}
style={{width:"100%",background:"linear-gradient(135deg, #2563eb, #1d4ed8)",color:"#fff",border:"none",borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
⚡ Route Order ▾
</button>
{rpOptMenu===drv.id&&<div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,background:"#fff",border:"1px solid #e7e5e4",borderRadius:12,padding:"4px",marginTop:4,boxShadow:"0 12px 40px rgba(0,0,0,0.18)"}}>
{[
{icon:"📍",label:"Closest → Furthest",desc:"Nearest stops first",fn:rpOptClose},
{icon:"🏁",label:"Furthest → Closest",desc:"Furthest stops first",fn:rpOptFar},
{icon:"⏰",label:"By Time Constraint",desc:"Deadlines first",fn:rpOptTime},
{icon:"🧭",label:"Shortest Distance",desc:"Best path between all",fn:rpOptShort},
{icon:"🗺",label:"Google Optimized",desc:"Actual driving route (API)",fn:rpOptGoogle},
{icon:"🔄",label:"Reverse Route",desc:"Flip current order",fn:rpOptRev},
].map((opt,oi)=><button key={oi} onClick={()=>opt.fn(drv.id)}
style={{display:"flex",alignItems:"center",gap:8,width:"100%",textAlign:"left",background:"none",border:"none",padding:"9px 10px",cursor:"pointer",borderRadius:8,fontSize:11,fontWeight:600,color:"#1c1917"}}
onMouseEnter={e=>{e.currentTarget.style.background="#eff6ff";}} onMouseLeave={e=>{e.currentTarget.style.background="none";}}>
<span style={{fontSize:15,flexShrink:0}}>{opt.icon}</span>
<div><div>{opt.label}</div><div style={{fontSize:9,color:"#a8a29e",fontWeight:400}}>{opt.desc}</div></div>
</button>)}
</div>}
</div>
<button onClick={e=>{e.stopPropagation();setRpOrders(p=>({...p,[drv.id]:[]}));}}
style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:10,fontWeight:700,color:"#dc2626",flexShrink:0}}>Clear</button>
</div>}
</div>

{/* Conflict warnings */}
{cf.length>0&&<div style={{padding:"6px 14px",background:"linear-gradient(90deg, #fef2f2, #fff1f2)",borderBottom:"1px solid #fca5a5"}}>
{cf.map((c2,ci)=><div key={ci} style={{fontSize:10,color:"#dc2626",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>⚠ {c2}</div>)}
</div>}

{/* Stop list — draggable */}
{ids.length>0&&<div style={{padding:"4px 6px 6px",maxHeight:isAct?440:140,overflowY:"auto",transition:"max-height 0.3s"}}>
{ids.map((id,oi)=>{const e=rpE(id);if(!e)return null;const c=CC[e.customer]||CC["One-Off Delivery"];const isPU=e.stopType==="pickup";
const isDSrc=rpDragSrc?.drvId===drv.id&&rpDragSrc?.idx===oi;const isDOvr=rpDragOver?.drvId===drv.id&&rpDragOver?.idx===oi;
return(<div key={id} draggable onDragStart={()=>setRpDragSrc({drvId:drv.id,idx:oi})} onDragOver={ev=>{ev.preventDefault();setRpDragOver({drvId:drv.id,idx:oi});}} onDrop={()=>rpDr(drv.id,oi)}
style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",marginBottom:2,borderRadius:9,background:isDOvr?"#dcfce7":isDSrc?"#fef9c3":"#fff",border:isDOvr?"2px dashed #16a34a":`1px solid ${isPU?"#bfdbfe":"#f5f5f4"}`,opacity:isDSrc?0.35:1,cursor:"grab",transition:"all 0.1s"}}>
<div style={{width:22,height:22,borderRadius:7,background:`linear-gradient(135deg, ${DCOL[di]}, ${DCOL[di]}bb)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:800,flexShrink:0}}>{oi+1}</div>
<div style={{width:3,height:20,borderRadius:2,background:isPU?"#2563eb":c.accent,flexShrink:0}}/>
<div style={_s.f1m}>
<div style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.stop}</div>
<div style={{display:"flex",alignItems:"center",gap:3,flexWrap:"wrap"}}>
<span style={{fontSize:9,color:c.accent}}>{e.customer}</span>
{isPU&&<span style={{fontSize:7,background:"#2563eb",color:"#fff",padding:"0 3px",borderRadius:2,fontWeight:700}}>PU</span>}
{!isPU&&<span style={{fontSize:7,background:"#16a34a",color:"#fff",padding:"0 3px",borderRadius:2,fontWeight:700}}>DEL</span>}
{e.priority&&<span style={{fontSize:7,background:"#f59e0b",color:"#fff",padding:"0 3px",borderRadius:2,fontWeight:700}}>PRI</span>}
{e.dueBy&&<span style={{fontSize:7,background:e.dueBy.includes("By")?"#dc2626":"#2563eb",color:"#fff",padding:"0 3px",borderRadius:2,fontWeight:700}}>⏰{e.dueBy}</span>}
{e.weight>0&&<span style={{fontSize:8,color:BRAND.main,fontWeight:700}}>{e.weight.toLocaleString()}lb</span>}
</div>
</div>
<button onClick={ev=>{ev.stopPropagation();rpRemove(id,drv.id);}} style={{background:"none",border:"none",color:"#dc2626",fontSize:10,cursor:"pointer",padding:"2px 4px",flexShrink:0,opacity:0.4}}>✕</button>
</div>);})}
</div>}

{/* Empty drop zone */}
{ids.length===0&&isAct&&<div onDragOver={ev=>{ev.preventDefault();setRpDragOver({drvId:drv.id,idx:0});}} onDrop={()=>rpDr(drv.id,0)}
style={{padding:"20px 16px",textAlign:"center",color:DCOL[di],fontSize:12,fontWeight:600,background:`${DCOL[di]}06`,borderTop:"1px dashed "+DCOL[di]+"44"}}>
Click stops on the map to build this route
</div>}
</div>);})}

{}
<div style={{marginTop:4,borderRadius:14,border:rpUnassigned.length?"2px dashed #d97706":"1px solid #e7e5e4",overflow:"hidden"}}
onDragOver={e=>e.preventDefault()}
onDrop={()=>{if(rpDragSrc&&rpDragSrc.drvId!=="pool"){const eid=(rpOrders[rpDragSrc.drvId]||[])[rpDragSrc.idx];if(eid)rpRemove(eid,rpDragSrc.drvId);setRpDragSrc(null);setRpDragOver(null);}}}>
<div onClick={()=>setRpShowUnassigned(!rpShowUnassigned)}
style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",cursor:"pointer",background:rpUnassigned.length?"linear-gradient(90deg, #fffbeb, #fef3c7)":"#fafaf9"}}>
<div style={_s.flexC8}>
<div style={{width:30,height:30,borderRadius:9,background:rpUnassigned.length?"linear-gradient(135deg, #d97706, #f59e0b)":"#a8a29e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:800}}>!</div>
<div>
<span style={{fontSize:13,fontWeight:700,color:rpUnassigned.length?"#92400e":"#78716c"}}>Unassigned Pool</span>
{rpUnassigned.length>0&&<span style={{fontSize:11,color:"#dc2626",fontWeight:700,marginLeft:6}}>{rpUnassigned.length}</span>}
</div>
</div>
<span style={{fontSize:12,color:"#a8a29e",transition:"transform 0.2s",transform:rpShowUnassigned?"rotate(0deg)":"rotate(-90deg)"}}>▾</span>
</div>
{rpShowUnassigned&&rpUnassigned.length>0&&<div style={{padding:"6px 8px",maxHeight:240,overflowY:"auto"}}>
{rpUnassigned.map(e=>{const c=CC[e.customer]||CC["One-Off Delivery"];return(
<div key={e.id} draggable onDragStart={()=>setRpDragSrc({drvId:"pool",idx:e.id})}
style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",marginBottom:2,borderRadius:9,background:"#fff",border:"1px solid #f5f5f4",cursor:"grab"}}>
<div style={{width:3,height:20,borderRadius:2,background:c.accent,flexShrink:0}}/>
<div style={_s.f1m}>
<div style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.stop}</div>
<div style={{display:"flex",alignItems:"center",gap:3}}>
<span style={{fontSize:9,color:c.accent}}>{e.customer}</span>
{e.dueBy&&<span style={{fontSize:7,background:"#dc2626",color:"#fff",padding:"0 3px",borderRadius:2,fontWeight:700}}>⏰{e.dueBy}</span>}
</div>
</div>
{rpActive&&<button onClick={()=>rpAddUA(e.id,rpActive)}
style={{background:`linear-gradient(135deg, ${DCOL[drivers.findIndex(d=>d.id===rpActive)]}, ${DCOL[drivers.findIndex(d=>d.id===rpActive)]}cc)`,color:"#fff",border:"none",borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:9,fontWeight:700,flexShrink:0}}>
+ {drivers.find(d=>d.id===rpActive)?.name?.split(" ")[0]}
</button>}
</div>);})}
</div>}
</div>
</div>

{/* Apply footer */}
<div style={{padding:"10px 14px",borderTop:"1px solid #e7e5e4",flexShrink:0,background:"#fafaf9"}}>
<button onClick={rpApply} disabled={!rpTotal}
style={{width:"100%",background:rpTotal?"linear-gradient(135deg, #16a34a, #15803d)":"#e7e5e4",color:rpTotal?"#fff":"#a8a29e",border:"none",borderRadius:12,padding:"14px",cursor:rpTotal?"pointer":"default",fontSize:14,fontWeight:800,boxShadow:rpTotal?"0 4px 16px rgba(22,163,74,0.3)":"none",transition:"all 0.2s"}}>
✓ Apply Routes to Manifests
</button>
</div>
</div>

{}
<div style={{position:"relative",background:"#e8e4df",overflow:"hidden",height:"100%",minHeight:0}}>
{/* Active driver HUD */}
{rpActive&&(()=>{const di2=drivers.findIndex(d=>d.id===rpActive);const dv=drivers.find(d=>d.id===rpActive);const ct=(rpOrders[rpActive]||[]).length;const st2=rpSt(rpActive);
return(<div style={{position:"absolute",top:12,left:12,right:60,zIndex:5}}>
<div style={{background:`linear-gradient(135deg, ${DCOL[di2]}, ${DCOL[di2]}dd)`,color:"#fff",borderRadius:14,padding:"12px 18px",boxShadow:`0 8px 32px ${DCOL[di2]}44`,display:"flex",alignItems:"center",gap:12}}>
<div style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,flexShrink:0}}>{dv?.name?.charAt(0)}</div>
<div style={_s.f1}>
<div style={_s.bold14}>{dv?.name}'s Route</div>
<div style={{fontSize:11,opacity:0.85}}>{ct} stop{ct!==1?"s":""}{st2.miles>0?` · ~${st2.miles}mi`:""}{st2.rev>0?" · "+fmt(st2.rev):""} — click map to add</div>
</div>
</div>
</div>);})()}
{!rpActive&&<div style={{position:"absolute",top:12,left:12,right:60,zIndex:5,background:"#fff",borderRadius:14,padding:"12px 18px",fontSize:13,fontWeight:600,color:"#78716c",boxShadow:"0 8px 32px rgba(0,0,0,0.1)",display:"flex",alignItems:"center",gap:10}}>
<span style={{fontSize:22}}>👈</span>
<div><div style={{fontWeight:700,color:"#1c1917"}}>Select a driver</div><div style={{fontSize:11,marginTop:2}}>Then click stops on the map in delivery order</div></div>
</div>}

{/* Driver legend */}
<div style={{position:"absolute",bottom:14,left:14,zIndex:5,background:"#fff",borderRadius:14,padding:"10px 16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",display:"flex",gap:8,flexWrap:"wrap"}}>
{drivers.map((d,di2)=>{const ct=(rpOrders[d.id]||[]).length;const isA=rpActive===d.id;return(
<div key={d.id} onClick={()=>{setRpActive(rpActive===d.id?null:d.id);setRpOptMenu(null);}}
style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",padding:isA?"4px 12px":"4px 8px",borderRadius:9,background:isA?DCOL[di2]:"transparent",transition:"all 0.15s",border:isA?"none":"1px solid transparent"}}>
<div style={{width:10,height:10,borderRadius:4,background:isA?"#fff":DCOL[di2]}}/>
<span style={{fontSize:11,fontWeight:700,color:isA?"#fff":"#57534e"}}>{d.name.split(" ")[0]}</span>
{ct>0&&<span style={{fontSize:10,color:isA?"rgba(255,255,255,0.8)":"#a8a29e",fontWeight:600}}>{ct}</span>}
</div>);})}
</div>

<GoogleMapView stops={mapS} drivers={drivers} height={"100%"} showSearch={true} searchLabel="Search address…"
activeDriver={rpActive} onStopClick={rpClick} onAssignStop={rpActive?(sid)=>rpClick(sid):null} driverLocs={driverLocs}/>
</div>

</div>);
})()
)}
{}
{(view==="daily"||view==="weekly"||view==="history")&&(
<div style={{flex:1,overflowY:"auto",padding:"24px 40px",background:"#f8f7f5"}}>

{/* Daily */}
{view==="daily"&&<div style={{maxWidth:900,margin:"0 auto"}}>
<div style={_s.flexBtwMb16}>
<h2 style={{margin:0,fontSize:18,fontWeight:700}}>{wd[sd].name} — {wd[sd].date}</h2>
<div style={_s.flexC10}>
{dl.length>0&&<button onClick={printDailyLog} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#57534e"}}>Print</button>}
<span style={{fontSize:18,fontWeight:700,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(dc.total)}</span>
</div>
</div>
{/* Dispatcher notes */}
{!editingNote?<div onClick={()=>{setEditingNote(true);setNoteText(dispNotes[emDk]||"");}} style={{background:dispNotes[emDk]?"#faf5ff":"#fafaf9",border:dispNotes[emDk]?"2px solid #d8b4fe":"1px dashed #d6d3d1",borderRadius:12,padding:"12px 16px",marginBottom:16,cursor:"pointer",display:"flex",alignItems:"flex-start",gap:10}}>
<span style={{fontSize:16}}>📝</span>
{dispNotes[emDk]?<div><div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",marginBottom:2}}>Dispatcher Notes</div><div style={{fontSize:13,color:"#1c1917",whiteSpace:"pre-wrap",lineHeight:1.4}}>{dispNotes[emDk]}</div></div>
:<div style={{fontSize:12,color:"#a8a29e",paddingTop:2}}>Click to add dispatcher notes for this day</div>}
</div>
:<div style={{background:"#fff",border:"2px solid #7c3aed",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
<div style={{fontSize:11,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",marginBottom:6}}>Dispatcher Notes</div>
<textarea value={noteText} onChange={e=>setNoteText(e.target.value)} autoFocus placeholder="Route changes, special instructions, notes for the day…" rows={3} style={{width:"100%",border:"1px solid #d8b4fe",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit",background:"#faf5ff"}}/>
<div style={{display:"flex",gap:6,marginTop:6,justifyContent:"flex-end"}}>
{dispNotes[emDk]&&<button onClick={()=>{setDispNotes(p=>{const n={...p};delete n[emDk];return n;});setEditingNote(false);setNoteText("");}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear</button>}
<button onClick={()=>setEditingNote(false)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Cancel</button>
<button onClick={()=>{setDispNotes(p=>({...p,[emDk]:noteText.trim()}));setEditingNote(false);showToast("Notes saved");}} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:600}}>Save</button>
</div>
</div>}
{/* Emser hours */}
{dl.some(e=>e.isHourly)&&(()=>{
const {byDriver,totalMins}=getShiftSummary(emDk);
const distBonusEntries=dl.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop));
const distBonusCount=distBonusEntries.length;
const lgCountDesktop=dl.filter(e=>e.isHourly&&e.liftgateApplied).length;
const lgMinsDesktop=lgCountDesktop*60;
const distMinsDesktop=distBonusCount*60;
const billedMinsDesktop=totalMins+lgMinsDesktop+distMinsDesktop;
const hoursUsed=totalMins>0?Math.round(billedMinsDesktop/15)*15/60:(emH[`${emDk}-emser`]||4);
/* emH synced via useEffect */
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
{lgCountDesktop>0&&<div style={{display:"flex",alignItems:"center",gap:5,background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,padding:"4px 10px"}}>
<span style={{fontSize:11,fontWeight:700,color:"#ea580c"}}>+{lgCountDesktop}h LG</span>
</div>}
{distBonusCount>0&&<div style={{display:"flex",alignItems:"center",gap:5,background:"#fef3c7",border:"1px solid #fde68a",borderRadius:8,padding:"4px 10px"}}>
<span style={{fontSize:11,fontWeight:700,color:"#92400e"}}>+{distBonusCount}h Distance</span>
</div>}
<div style={{display:"flex",alignItems:"center",gap:5,background:"#dbeafe",border:"1px solid #2563eb",borderRadius:8,padding:"4px 10px",marginLeft:"auto"}}>
<span style={{fontSize:12,fontWeight:700,color:"#1e40af"}}>⏱ {formatMins(billedMinsDesktop)} total</span>
</div>
</div>}
{/* Distance bonus badges */}
{distBonusEntries.map(be=>{const bDrv=drivers.find(d=>d.id===be.driverId);const bDi=drivers.findIndex(d=>d.id===be.driverId);const bInit=bDrv?bDrv.name.split(" ").map(n=>n[0]).join(""):"";return(
<div key={be.id} style={{display:"flex",alignItems:"center",gap:6,background:"#fef3c7",border:"1px solid #fde68a",borderRadius:8,padding:"5px 10px",marginBottom:4}}>
{bDi>=0&&<div style={{width:20,height:20,borderRadius:5,background:DCOL[bDi],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700}}>{bInit}</div>}
<span style={{fontSize:11,fontWeight:700,color:"#92400e"}}>+1h {be.stop} Bonus</span>
<span style={{fontSize:10,color:"#78716c",marginLeft:"auto"}}>Long-distance run</span>
</div>);})}
{!totalMins&&<div style={{fontSize:11,color:"#64748b",marginBottom:8}}>💡 Log shifts in History → ⏱ Emser Hours for auto-calculation</div>}
<div style={_s.flexBtw}>
<span style={{fontSize:12,color:"#64748b"}}>{totalMins>0?formatMins(totalMins)+" shifts"+(lgCountDesktop>0?" + "+lgCountDesktop+"h liftgate":"")+(distBonusCount>0?" + "+distBonusCount+"h distance":"")+" = ":""}{hoursUsed}h × $102.50</span>
<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
{[4,5,6,7,8,9,10].map(h=><button key={h} onClick={()=>setEmH(p=>({...p,[`${emDk}-emser`]:h}))} style={{width:32,height:30,borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:hoursUsed===h&&!totalMins?"#2563eb":"#e7e5e4",color:hoursUsed===h&&!totalMins?"#fff":"#78716c"}}>{h}</button>)}
<button onClick={()=>setShowCustomHrs(!showCustomHrs)} style={{height:30,borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,padding:"0 10px",background:showCustomHrs?"#2563eb":"#dbeafe",color:showCustomHrs?"#fff":"#2563eb"}}>Other</button>
</div></div>
{showCustomHrs&&<div style={{display:"flex",gap:6,alignItems:"center",marginTop:8}}><input value={customHrsInput} onChange={e=>setCustomHrsInput(e.target.value)} placeholder="e.g. 4.5" type="number" inputMode="decimal" step="0.25" min="1" style={{width:80,border:"1px solid #bfdbfe",borderRadius:8,padding:"6px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/><span style={{fontSize:12,color:"#64748b"}}>hrs</span><button onClick={()=>{const v=parseFloat(customHrsInput);if(v>0){setEmH(p=>({...p,[`${emDk}-emser`]:v}));setShowCustomHrs(false);setCustomHrsInput("");}}} style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Set</button></div>}
</div>);})()}
{/* Entry list */}
{dl.length===0?<div style={_s.emptyState2}><div style={{fontSize:40,marginBottom:12}}>🚚</div><p style={{fontSize:14,margin:0}}>No deliveries logged for this day</p></div>
:<div style={{display:"flex",flexDirection:"column",gap:16}}>
{(()=>{const dels=dl.filter(e=>e.stopType!=="pickup");const groups={};dels.forEach(e=>{if(!groups[e.customer])groups[e.customer]=[];groups[e.customer].push(e);});return Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0])).map(([cust,custEntries])=>{const c=getCustColor(cust);const custBase=custEntries.reduce((s,e)=>s+e.baseRate+(e.knownLiftgate?(e.liftgateFee||75):0),0);return(<div key={cust}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:c.accent+"11",borderRadius:"10px 10px 0 0",borderBottom:`2px solid ${c.accent}`}}>
<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:4,height:20,borderRadius:2,background:c.accent}}/><span style={{fontSize:13,fontWeight:700,color:c.accent,textTransform:"uppercase"}}>{cust}</span><span style={{fontSize:11,color:"#78716c"}}>({custEntries.length} {custEntries.length===1?"stop":"stops"})</span></div>
<span style={{fontSize:14,fontWeight:700,fontVariantNumeric:"tabular-nums",color:c.accent}}>{fmt(custBase)}</span>
</div>
<div style={{display:"flex",flexDirection:"column",gap:8,paddingTop:8}}>
{custEntries.map(entry=>{const drv=drivers.find(d=>d.id===entry.driverId);const di=drivers.findIndex(d=>d.id===entry.driverId);const done=entry.status==="departed";const onSite=entry.status==="arrived";const isImetco=entry.customer==="IMETCO";return(
<div key={entry.id} style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:12,padding:"12px 14px",borderLeft:`4px solid ${entry.priority?"#f59e0b":c.accent}`}}>
{/* Header row: customer + rate */}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
<div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",flex:1}}>
<span style={{fontSize:11,fontWeight:600,color:c.accent,textTransform:"uppercase"}}>{entry.customer}</span>
{entry.priority&&<span style={_s.tag9Amber}>PRIORITY</span>}
{done&&<span style={_s.tag9Green}>DONE</span>}
{onSite&&!done&&<span style={_s.tag9Amber}>ON SITE</span>}
{entry.dueBy&&<span style={{fontSize:9,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>⏰ {entry.dueBy}</span>}
{drv&&<span style={{fontSize:9,background:DCOL[di]||"#78716c",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:600}}>{drv.name.split(" ")[0]}</span>}
</div>
<div style={{fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums",flexShrink:0}}><InlineRate value={entry.baseRate+(entry.knownLiftgate?(entry.liftgateFee||75):0)} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/></div>
</div>
{/* Stop name + details */}
<div style={{fontSize:15,fontWeight:600,marginBottom:2}}>{entry.stop}</div>
{entry.addr&&<div style={_s.sub11}>{entry.addr}</div>}
{entry.instructions&&<div style={{fontSize:11,color:"#2563eb",marginTop:3,background:"#eff6ff",padding:"4px 8px",borderRadius:6}}>📋 {entry.instructions}</div>}
{entry.shipPlan&&<div style={{fontSize:11,color:"#ea580c",fontWeight:700,marginTop:2}}>SP# {entry.shipPlan}</div>}
{entry.weight>0&&<div style={{fontSize:11,color:BRAND.main,fontWeight:700,marginTop:2}}>{entry.weight.toLocaleString()} lbs{entry.wasSplit?" (Load "+entry.loadNum+")":""}</div>}
{/* Action row — full width */}
<div style={{display:"flex",gap:6,marginTop:8,alignItems:"center",flexWrap:"wrap"}}>
{!entry.liftgateApplied&&!entry.isHourly&&<button onClick={()=>manualLiftgate(entry.id)} style={{background:"#fff7ed",border:"1px solid #fed7aa",color:"#ea580c",fontSize:11,cursor:"pointer",padding:"5px 12px",borderRadius:8,fontWeight:700}}>+LG $75</button>}
{!entry.liftgateApplied&&entry.isHourly&&<button onClick={()=>{setEmH(p=>{const key=`${emDk}-emser`;const cur=p[key]||4;return{...p,[key]:cur+1};});setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===entry.id?{...e,liftgateApplied:true}:e)}));showToast("Liftgate +1 hr added");}} style={{background:"#fff7ed",border:"1px solid #fed7aa",color:"#ea580c",fontSize:11,cursor:"pointer",padding:"5px 12px",borderRadius:8,fontWeight:700}}>+1HR LG</button>}
{entry.liftgateApplied&&<span style={{fontSize:10,color:"#16a34a",fontWeight:700,background:"#f0fdf4",padding:"5px 10px",borderRadius:8,border:"1px solid #bbf7d0"}}>{entry.isHourly?"✓ LG +1HR":"✓ LG +$75"}</span>}
{!entry.wasSplit&&<button onClick={()=>setSplitEntry({id:entry.id,totalWeight:entry.weight||0,ratio:50,truck1Weight:Math.round((entry.weight||0)/2)})} style={{background:"#eff6ff",border:"1px solid #bfdbfe",color:"#2563eb",fontSize:11,cursor:"pointer",padding:"5px 12px",borderRadius:8,fontWeight:700}}>✂ Split</button>}
{entry.wasSplit&&<span style={{fontSize:10,color:"#2563eb",fontWeight:700,background:"#eff6ff",padding:"5px 10px",borderRadius:8,border:"1px solid #bfdbfe"}}>Load {entry.loadNum}</span>}
<button onClick={()=>deleteDel(entry.id)} style={{background:"none",border:"none",color:"#dc2626",fontSize:10,cursor:"pointer",padding:"5px 8px",opacity:0.5,marginLeft:"auto"}}>Delete</button>
</div>
{/* Split shipment panel */}
{splitEntry?.id===entry.id&&<div style={{marginTop:8,background:"#eff6ff",border:"2px solid #2563eb",borderRadius:10,padding:14}}>
<div style={{fontSize:13,fontWeight:700,color:"#1e40af",marginBottom:10}}>✂ Split Shipment</div>
{(()=>{const tw=splitEntry.totalWeight||0;const t1w=splitEntry.truck1Weight!==undefined?splitEntry.truck1Weight:Math.round(tw*(splitEntry.ratio/100));const t2w=tw-t1w;return(<>
<div style={_s.flexG6Mb6}>
<div style={_s.f1}><label style={_s.labelSm}>Total</label><input type="number" inputMode="numeric" value={tw||""} onChange={e=>{const newTw=parseInt(e.target.value)||0;setSplitEntry(p=>({...p,totalWeight:newTw,truck1Weight:Math.min(p.truck1Weight||Math.round(newTw/2),newTw)}));}} style={_s.splitTotal}/></div>
<div style={_s.f1}><label style={_s.labelBlue}>Truck 1</label><input type="number" inputMode="numeric" value={splitEntry.truck1Weight!==undefined?splitEntry.truck1Weight:""} onChange={e=>{const v=e.target.value;setSplitEntry(p=>({...p,truck1Weight:v===""?0:parseInt(v)||0}));}} style={_s.splitInput}/></div>
<div style={_s.f1}><label style={_s.labelGray}>Truck 2</label><div style={_s.splitT2}>{t2w.toLocaleString()}</div></div>
</div>
<input type="range" min={0} max={tw} step={100} value={t1w} onChange={e=>{const v=parseInt(e.target.value)||0;setSplitEntry(p=>({...p,truck1Weight:v}));}} style={_s.slider}/>
</>);})()}
<div style={{display:"flex",gap:8}}>
<button onClick={()=>confirmSplit(entry.id,splitEntry.totalWeight,splitEntry.ratio,splitEntry.truck1Weight)} style={{flex:1,background:"#2563eb",color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>✂ Split into 2 Loads</button>
<button onClick={()=>setSplitEntry(null)} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"10px 14px",fontSize:12,cursor:"pointer",color:"#57534e"}}>Cancel</button>
</div>
</div>}
{isImetco&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:11,fontWeight:700,color:"#ea580c",flexShrink:0}}>Ship Plan #:</span>
<input value={entry.shipPlan||""} onChange={e=>setShipPlan(entry.id,e.target.value)} placeholder="Enter #" style={{flex:1,border:entry.shipPlan?"1px solid #bbf7d0":"1px solid #fca5a5",borderRadius:8,padding:"5px 10px",fontSize:13,fontWeight:700,outline:"none",background:entry.shipPlan?"#f0fdf4":"#fff7ed",textAlign:"center"}}/>
</div>}
</div>);})}
</div>
</div>);})})()}
</div>}
{Object.keys(dc.fBC).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"14px 16px",marginTop:12}}><div style={_s.loadTitle}>Fuel Surcharges</div>{Object.entries(dc.fBC).map(([cu,cf])=><div key={cu} style={_s.flexBtwP4}><span style={{fontSize:13}}>{cu} <span style={{fontSize:11,color:"#a8a29e"}}>{fmt(cf.base)} × {Math.round(cf.pct*100)}%</span></span><span style={_s.loadWeight}>{fmt(cf.base*cf.pct)}</span></div>)}</div>}
<div style={{display:"flex",justifyContent:"space-between",padding:"16px 4px 0",borderTop:"2px solid #bbf7d0",marginTop:16}}><span style={{fontSize:15,fontWeight:700,color:"#57534e"}}>Day Total</span><span style={{fontSize:22,fontWeight:700,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(dc.total)}</span></div>
</div>}

{/* Weekly */}
{view==="weekly"&&<div style={{maxWidth:860,margin:"0 auto"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
<h2 style={{margin:0,fontSize:18,fontWeight:700}}>Weekly Summary</h2>
<div style={_s.flexC10}>
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
<div style={_s.flexC4}><div style={{width:10,height:10,borderRadius:2,background:"#d6d3d1"}}/><span style={{fontSize:10,color:"#a8a29e"}}>Last week</span></div>
<div style={_s.flexC4}><div style={{width:10,height:10,borderRadius:2,background:"#16a34a"}}/><span style={{fontSize:10,color:"#a8a29e"}}>This week</span></div>
</div>
</div>
{/* Emser Week Hours */}
{(()=>{const wkShiftByDrv={};let wkShiftTotal=0;let wkBonusMins=0;DAYS.forEach((_,i)=>{const{byDriver,totalMins}=getShiftSummary(getFbKey(wo,i));wkShiftTotal+=totalMins;const _wkDE=log[`${wo}-${i}`]||[];wkBonusMins+=(_wkDE.filter(e=>e.isHourly&&e.liftgateApplied).length+_wkDE.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length)*60;Object.entries(byDriver).forEach(([did,mins])=>{wkShiftByDrv[did]=(wkShiftByDrv[did]||0)+mins;});});if(!wkShiftTotal)return null;const wkShiftHrs=Math.round((wkShiftTotal+wkBonusMins)/15)*15/60;return(<div style={{background:"#eff6ff",border:"2px solid #2563eb",borderRadius:14,padding:"16px 18px",marginBottom:16}}>
<div style={_s.flexBtwMb10}>
<span style={{fontSize:16,fontWeight:700,color:"#2563eb"}}>⏱ Emser Week Total</span>
<span style={{fontSize:22,fontWeight:800,fontVariantNumeric:"tabular-nums",color:"#1d4ed8"}}>{fmt(102.50*wkShiftHrs)}</span>
</div>
<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:6}}>
{drivers.map((drv,di)=>{const mins=wkShiftByDrv[drv.id]||0;if(!mins)return null;const initials=drv.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();const hrs=Math.round(mins/15)*15/60;return(<div key={drv.id} style={{display:"flex",alignItems:"center",gap:6,background:"#fff",border:`2px solid ${DCOL[di]}`,borderRadius:8,padding:"6px 14px"}}>
<div style={{width:24,height:24,borderRadius:6,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>{initials}</div>
<div><div style={{fontSize:14,fontWeight:700}}>{formatMins(mins)}</div><div style={{fontSize:11,color:"#64748b"}}>{fmt(102.50*hrs)}</div></div>
</div>);})}
</div>
<div style={{fontSize:13,color:"#1d4ed8",fontWeight:600}}>{formatMins(wkShiftTotal+wkBonusMins)} total · $102.50/hr</div>
</div>);})()}
{/* Week fuel */}
{Object.keys(wkF).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:"14px 16px",marginBottom:16}}><div style={_s.loadTitle}>Week Fuel Surcharges</div>{Object.entries(wkF).map(([cu,cf])=><div key={cu} style={_s.flexBtwP4}><span style={{fontSize:13}}>{cu} <span style={{fontSize:11,color:"#a8a29e"}}>{fmt(cf.base)} × {Math.round(cf.pct*100)}%</span></span><span style={_s.loadWeight}>{fmt(cf.base*cf.pct)}</span></div>)}</div>}
{/* Day-by-day breakdown */}
{DAYS.map((day,i)=>{const{entries,calc}=wkD[i];const dayKey=`${wo}-${i}`;const{byDriver:shiftByDrv,totalMins:shiftMins}=getShiftSummary(getFbKey(wo,i));if(!entries.length&&!shiftMins)return null;return(<div key={day} style={{marginBottom:14}}>
<div style={{display:"flex",justifyContent:"space-between",padding:"8px 4px",borderBottom:"1px solid #e7e5e4",marginBottom:6}}><span style={_s.bold14}>{day} — {wd[i].date}</span><span style={{fontVariantNumeric:"tabular-nums",fontWeight:700,color:"#16a34a",fontSize:14}}>{fmt(calc.total)}</span></div>
{shiftMins>0&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px 5px 14px",borderLeft:"3px solid #2563eb",marginBottom:3,background:"#eff6ff",borderRadius:"0 8px 8px 0",flexWrap:"wrap"}}>
<span style={{fontSize:11,color:"#2563eb",fontWeight:700,flexShrink:0}}>⏱ Emser</span>
{drivers.map((drv,di)=>{const mins=shiftByDrv[drv.id]||0;if(!mins)return null;const initials=drv.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();return(<span key={drv.id} style={{fontSize:11,background:DCOL[di],color:"#fff",padding:"1px 6px",borderRadius:4,fontWeight:600}}>{initials} {formatMins(mins)}</span>);})}
<span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:"#1d4ed8",fontVariantNumeric:"tabular-nums"}}>{formatMins(shiftMins)} — {fmt(102.50*Math.round(shiftMins/15)*15/60)}</span>
</div>}
{entries.filter(e=>e.stopType!=="pickup").sort((a,b)=>a.customer.localeCompare(b.customer)).map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di2=drivers.findIndex(d=>d.id===entry.driverId);return(<div key={entry.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px 5px 14px",borderLeft:`3px solid ${c.accent}`,marginBottom:3,background:"#fff",borderRadius:"0 8px 8px 0"}}>
<div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:0}}>
<span style={{fontSize:11,color:c.accent,fontWeight:600,flexShrink:0}}>{entry.customer}</span>
<span style={_s.truncate}>{entry.stop}</span>
{entry.shipPlan&&<span style={{fontSize:10,color:"#ea580c",fontWeight:700,flexShrink:0}}>SP#{entry.shipPlan}</span>}
{drv&&<span style={{fontSize:9,background:DCOL[di2]||"#78716c",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:600,flexShrink:0}}>{drv.name.split(" ")[0]}</span>}
</div>
<InlineRate value={entry.baseRate+(entry.knownLiftgate?(entry.liftgateFee||75):0)} isHourly={entry.isHourly} onSave={r=>updateRateForDay(entry.id,r,dayKey)}/>
</div>);})}
</div>);})}
{wkD.every(d=>!d.entries.length)&&<div style={_s.emptyState2}><p>No deliveries this week</p></div>}
{Object.keys(wkF).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:"14px 16px",marginBottom:16}}><div style={_s.loadTitle}>Week Fuel Surcharges</div>{Object.entries(wkF).map(([cu,cf])=><div key={cu} style={_s.flexBtwP4}><span style={{fontSize:13}}>{cu} <span style={{fontSize:11,color:"#a8a29e"}}>{fmt(cf.base)} × {Math.round(cf.pct*100)}%</span></span><span style={_s.loadWeight}>{fmt(cf.base*cf.pct)}</span></div>)}</div>}
</div>}
{view==="history"&&<div style={{maxWidth:1000,margin:"0 auto"}}>
<div style={_s.flexBtwMb16}>
<h2 style={{margin:0,fontSize:18,fontWeight:700}}>Delivery History</h2>
</div>
{/* Mode toggle */}
<div style={{display:"flex",gap:3,marginBottom:16,background:"#f5f5f4",borderRadius:10,padding:3,width:"fit-content"}}>
{[{k:"deliveries",l:"Deliveries"},{k:"photos",l:"📷 Photos"},{k:"emser",l:"⏱ Emser Hours"},{k:"quotes",l:"💰 Quotes"}].map(m=>(
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
<div style={_s.flexBtwMb16}>
<span style={{fontSize:15,fontWeight:700}}>{wd[sd].name} — {wd[sd].date}</span>
<div style={{textAlign:"right"}}>
<div style={{fontSize:22,fontWeight:800,color:BRAND.main,fontVariantNumeric:"tabular-nums"}}>{totalMins>0?formatMins(totalMins):(emH[`${emDk}-emser`]||4)+"h"}</div>
<div style={{fontSize:12,color:"#78716c"}}>{totalMins>0?fmt(102.50*totalHrs):fmt(102.50*(emH[`${emDk}-emser`]||4))}</div>
</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
{drivers.map((drv,di)=>{
const drvShifts=shifts.filter(s=>s.driverId===drv.id);
const drvMins=perDriver[drv.id]||0;
return(<div key={drv.id} style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:"14px 16px",borderLeft:`3px solid ${DCOL[di]}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:drvShifts.length?10:0}}>
<div style={_s.flexC8}>
<div style={{width:24,height:24,borderRadius:7,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",fontWeight:700}}>{drv.name.charAt(0)}</div>
<span style={_s.bold14}>{drv.name}</span>
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
const safeTimeChange=(field,val)=>{if(val)updateEmserShift(shift.id,field,val);};
const MINS=[{l:":00",v:"00"},{l:":15",v:"15"},{l:":30",v:"30"},{l:":45",v:"45"}];
const btnBase={padding:"3px 0",borderRadius:4,border:"none",cursor:"pointer",fontSize:9,fontWeight:700,textAlign:"center"};
return(
<div key={shift.id} style={{background:"#fafaf9",border:"1px solid #e7e5e4",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
<div style={_s.flexBtwMb8}>
<span style={{fontSize:11,fontWeight:600,color:"#57534e"}}>Shift {si+1}</span>
<div style={{display:"flex",alignItems:"center",gap:6}}>
{mins>0&&<span style={{fontSize:12,fontWeight:700,color:BRAND.main}}>{formatMins(mins)}</span>}
<button onClick={()=>removeEmserShift(shift.id)} style={{background:"#fef2f2",border:"none",borderRadius:5,padding:"2px 7px",cursor:"pointer",fontSize:10,color:"#dc2626"}}>✕</button>
</div>
</div>
<div style={{display:"flex",gap:12}}>
{/* Start column */}
<div style={_s.f1}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
<label style={{fontSize:10,fontWeight:700,color:BRAND.main,width:28,flexShrink:0}}>Start</label>
<div style={{flex:1,border:"1px solid #bfdbfe",borderRadius:7,padding:"4px 8px",fontSize:13,fontWeight:700,background:shift.start?"#eff6ff":"#fafaf9",color:shift.start?"#1c1917":"#a8a29e",minHeight:22,display:"flex",alignItems:"center"}}>{shift.start?((h)=>{const[hh,mm]=h.split(":");const n=parseInt(hh);const ampm=n>=12?"PM":"AM";const d=n===0?12:n>12?n-12:n;return d+":"+mm+" "+ampm;})(shift.start):"—"}{shift.start&&<button onClick={()=>updateEmserShift(shift.id,"start","")} style={_s.delBtn}>✕</button>}</div>
</div>
<div style={{display:"flex",gap:2,paddingLeft:34}}>
{HOURS.map(h=>{const sel=startDispHour===h&&!!shift.start;return(<button key={h} onClick={()=>setHour("start",h)} style={{...btnBase,flex:1,background:sel?BRAND.main:"#e7e5e4",color:sel?"#fff":"#44403c"}}>{h}</button>);})}
</div>
<div style={{display:"flex",gap:2,paddingLeft:34,marginTop:2}}>
{MINS.map(({l,v})=>{const sel=shift.start&&shift.start.split(":")[1]===v;const dis=!shift.start;return(<button key={v} onClick={()=>setMin("start",v)} style={{...btnBase,flex:1,background:sel?BRAND.main:dis?"#f5f5f4":"#dbeafe",color:sel?"#fff":dis?"#ccc":"#1d4ed8",opacity:dis?0.4:1,cursor:dis?"default":"pointer"}}>{l}</button>);})}
</div>
</div>
{/* End column */}
<div style={_s.f1}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
<label style={{fontSize:10,fontWeight:700,color:"#16a34a",width:28,flexShrink:0}}>End</label>
<div style={{flex:1,border:"1px solid #bbf7d0",borderRadius:7,padding:"4px 8px",fontSize:13,fontWeight:700,background:shift.end?"#f0fdf4":"#fafaf9",color:shift.end?"#1c1917":"#a8a29e",minHeight:22,display:"flex",alignItems:"center"}}>{shift.end?((h)=>{const[hh,mm]=h.split(":");const n=parseInt(hh);const ampm=n>=12?"PM":"AM";const d=n===0?12:n>12?n-12:n;return d+":"+mm+" "+ampm;})(shift.end):"—"}{shift.end&&<button onClick={()=>updateEmserShift(shift.id,"end","")} style={_s.delBtn}>✕</button>}</div>
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
<div style={_s.flexBtwMb12}>
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
{photosAll.length===0?<div style={_s.emptyState2}><div style={{fontSize:40,marginBottom:12}}>📷</div><p style={{fontSize:14,fontWeight:600,margin:"0 0 4px"}}>No photos found</p></div>
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
{/* AI Quote Builder */}
<div style={{background:"#fff",border:"2px solid #d97706",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
<div style={{fontSize:13,fontWeight:700,color:"#d97706",marginBottom:8}}>🤖 AI Quote Builder</div>
<div style={{display:"flex",gap:6}}>
<input value={aiQuoteInput} onChange={e=>setAiQuoteInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();aiGenerateQuote(aiQuoteInput);}}}
placeholder='e.g. "One-off delivery to 123 Main St, Marietta, about 20 miles, needs liftgate"'
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
<button onClick={()=>aiGenerateQuote(aiQuoteInput)} disabled={!aiQuoteInput.trim()||aiQuoteLoading} style={{background:aiQuoteInput.trim()&&!aiQuoteLoading?"#d97706":"#e7e5e4",color:aiQuoteInput.trim()&&!aiQuoteLoading?"#fff":"#a8a29e",border:"none",borderRadius:10,padding:"10px 18px",cursor:aiQuoteInput.trim()&&!aiQuoteLoading?"pointer":"default",fontSize:13,fontWeight:700,flexShrink:0}}>{aiQuoteLoading?"⏳":"Build Quote"}</button>
</div>
<div style={{fontSize:10,color:"#a8a29e",marginTop:4}}>Describe the delivery and AI will calculate the rate automatically</div>
</div>
<div style={_s.flexBtwMb16}>
<div style={{display:"flex",gap:3,background:"#f5f5f4",borderRadius:10,padding:3}}>
<button onClick={()=>setQuoteTab("current")} style={{background:quoteTab==="current"?"#fff":"transparent",border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:600,color:quoteTab==="current"?"#1c1917":"#a8a29e",boxShadow:quoteTab==="current"?"0 1px 3px rgba(0,0,0,0.1)":"none"}}>Current ({savedQuotes.filter(q=>q.status!=="accepted").length})</button>
<button onClick={()=>setQuoteTab("past")} style={{background:quoteTab==="past"?"#fff":"transparent",border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:600,color:quoteTab==="past"?"#1c1917":"#a8a29e",boxShadow:quoteTab==="past"?"0 1px 3px rgba(0,0,0,0.1)":"none"}}>Past ({savedQuotes.filter(q=>q.status==="accepted").length})</button>
</div>
<button onClick={()=>setQuoteFormOpen(!quoteFormOpen)} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",cursor:"pointer",fontSize:13,fontWeight:700}}>{quoteFormOpen?"Cancel":"+ New Quote"}</button>
</div>
{quoteFormOpen&&<div style={{background:"#fff",border:"2px solid #16a34a",borderRadius:16,padding:"18px 20px",marginBottom:20}}>
<div style={{fontSize:14,fontWeight:700,color:"#16a34a",marginBottom:14}}>New Quote</div>
{/* Customer */}
<div style={{marginBottom:12}}>
<label style={_s.label}>Customer (who is this quote for?)</label>
<select value={qCust} onChange={e=>{const v=e.target.value;setQCust(v);setQStop("");setQCustomMode(false);const qc=QUOTE_CUSTOMERS.find(q=>q.name===v);const pSrcs=PICKUP_SOURCES.filter(s=>s.customer===v);const pickups=qc?.pickups?.length?qc.pickups:pSrcs.length?pSrcs.map(s=>({label:s.label,addr:s.addr})):[];if(pickups.length===1){setQPickup(pickups[0].label);setQPickupName(pickups[0].label);setQPickupAddr(pickups[0].addr);}else{setQPickup("");setQPickupName("");setQPickupAddr("");}}} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff"}}>
<option value="">Select customer...</option>{allCustNames.map(c=><option key={c} value={c}>{c}</option>)}<option value="__manual">Manual Entry</option>
</select>
</div>
{/* Pickup Info */}
<div style={{background:"#eff6ff",border:"2px solid #2563eb",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
<div style={{fontSize:12,fontWeight:700,color:"#2563eb",marginBottom:8}}>📦 Pickup From</div>
{(()=>{const qc=QUOTE_CUSTOMERS.find(q=>q.name===qCust);const pSrcs=PICKUP_SOURCES.filter(s=>s.customer===qCust);const pickups=qc?.pickups?.length?qc.pickups:pSrcs.length?pSrcs.map(s=>({label:s.label,addr:s.addr})):[];if(pickups.length>0)return(<div style={{marginBottom:8}}>
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>
{pickups.map(p=><button key={p.label} onClick={()=>{setQPickup(p.label);setQPickupName(p.label);setQPickupAddr(p.addr);}} style={{padding:"6px 14px",borderRadius:8,border:qPickup===p.label?"2px solid #2563eb":"2px solid #e7e5e4",cursor:"pointer",fontSize:12,fontWeight:700,background:qPickup===p.label?"#2563eb":"#fff",color:qPickup===p.label?"#fff":"#57534e"}}>{p.label}</button>)}
</div>
</div>);return null;})()}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
<div>
<label style={{fontSize:10,fontWeight:600,color:"#2563eb",display:"block",marginBottom:3}}>Pickup Customer / Name</label>
<input value={qPickupName} onChange={e=>setQPickupName(e.target.value)} placeholder="e.g. ABC Warehouse" style={{width:"100%",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff"}}/>
</div>
<div style={{gridColumn:"1 / -1"}}>
<label style={{fontSize:10,fontWeight:600,color:"#2563eb",display:"block",marginBottom:3}}>Pickup Address</label>
<AddressInput value={qPickupAddr} onChange={setQPickupAddr} placeholder="Pickup address"/>
</div>
</div>
</div>
{/* Delivery Info */}
<div style={{background:"#f0fdf4",border:"2px solid #16a34a",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
<div style={{fontSize:12,fontWeight:700,color:"#16a34a",marginBottom:8}}>📍 Delivering To</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
<div style={{gridColumn:"1 / -1"}}>
<label style={{fontSize:10,fontWeight:600,color:"#16a34a",display:"block",marginBottom:3}}>Delivery Stop / Customer Name</label>
{qCust&&qCust!=="__manual"&&getDeliveries(qCust).length>0&&qStop!=="__custom"&&!qCustomMode?
<select value={qStop} onChange={e=>{if(e.target.value==="__custom"){setQStop("");setQCustomMode(true);}else{setQStop(e.target.value);setQCustomMode(false);}}} style={{width:"100%",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff"}}>
<option value="">Select stop...</option>{getDeliveries(qCust).map(d=><option key={d.s} value={d.s}>{d.s}{d.r?" — $"+d.r:""}</option>)}<option value="__custom">Custom location...</option>
</select>
:<div><input value={qStop} onChange={e=>setQStop(e.target.value)} placeholder="e.g. Smith Residence" style={{width:"100%",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff"}}/>
{qCust&&qCust!=="__manual"&&getDeliveries(qCust).length>0&&<button onClick={()=>{setQStop("");setQCustomMode(false);}} style={{marginTop:3,background:"none",border:"none",color:"#2563eb",fontSize:10,cursor:"pointer",fontWeight:600}}>← Back to stop list</button>}
</div>}
</div>
<div style={{gridColumn:"1 / -1"}}>
<label style={{fontSize:10,fontWeight:600,color:"#16a34a",display:"block",marginBottom:3}}>Delivery Address</label>
<AddressInput value={qAddr} onChange={setQAddr} placeholder="Delivery address"/>
</div>
</div>
</div>
{/* Mileage Calculator */}
<div style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<span style={{fontSize:12,fontWeight:700,color:"#57534e"}}>📏 Distance & Rate</span>
{(qPickupAddr||qAddr)&&<button onClick={calcQuoteMiles} disabled={qCalcLoading||!qPickupAddr||!qAddr} style={{background:qPickupAddr&&qAddr&&!qCalcLoading?"#1c1917":"#a8a29e",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:11,fontWeight:600,cursor:qPickupAddr&&qAddr?"pointer":"default"}}>{qCalcLoading?"Calculating…":"Calculate Miles"}</button>}
</div>
{qCalcError&&<div style={{fontSize:11,color:"#dc2626",marginBottom:6}}>{qCalcError}</div>}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
<div>
<label style={{fontSize:10,fontWeight:600,color:"#57534e",display:"block",marginBottom:3}}>Miles</label>
<input type="number" value={qMiles} onChange={e=>setQMiles(e.target.value)} placeholder="0" style={{width:"100%",border:qMiles?"2px solid #16a34a":"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center",background:qMiles?"#f0fdf4":"#fff"}}/>
</div>
<div>
<label style={{fontSize:10,fontWeight:600,color:"#57534e",display:"block",marginBottom:3}}>Rate Override</label>
<input type="number" value={qRate} onChange={e=>setQRate(e.target.value)} placeholder={qMiles?"Auto: "+fmt(calcQuoteRate(qMiles,qLiftgate,qGravel,qExtraPallets).total):"$"} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
</div>
</div>
{qMiles>0&&!qRate&&<div style={{fontSize:12,fontWeight:700,color:"#16a34a",marginTop:6,textAlign:"center"}}>Auto Rate: {fmt(calcQuoteRate(qMiles,qLiftgate,qGravel,qExtraPallets).total)} ({fmt(calcQuoteRate(qMiles,qLiftgate,qGravel,qExtraPallets).base)} base + {fmt(calcQuoteRate(qMiles,qLiftgate,qGravel,qExtraPallets).fuel)} {qLiftgate?"liftgate":"fuel"})</div>}
</div>
{/* Add-ons */}
<div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
<label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,fontWeight:600,color:qLiftgate?"#d97706":"#78716c",background:qLiftgate?"#fef3c7":"#f5f5f4",padding:"6px 12px",borderRadius:8,border:qLiftgate?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qLiftgate} onChange={e=>setQLiftgate(e.target.checked)} style={{accentColor:"#d97706"}}/> Liftgate +$75</label>
<label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,fontWeight:600,color:qGravel?"#d97706":"#78716c",background:qGravel?"#fef3c7":"#f5f5f4",padding:"6px 12px",borderRadius:8,border:qGravel?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qGravel} onChange={e=>setQGravel(e.target.checked)} style={{accentColor:"#d97706"}}/> Gravel +$25</label>
<label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,fontWeight:600,color:qExtraPallets?"#d97706":"#78716c",background:qExtraPallets?"#fef3c7":"#f5f5f4",padding:"6px 12px",borderRadius:8,border:qExtraPallets?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qExtraPallets} onChange={e=>setQExtraPallets(e.target.checked)} style={{accentColor:"#d97706"}}/> 4-5 Pallets +$25</label>
</div>
{/* Notes */}
<div style={{marginBottom:12}}>
<label style={_s.label}>Notes</label>
<textarea value={qNote} onChange={e=>setQNote(e.target.value)} placeholder="Additional details..." rows={2} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
</div>
<div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
<button onClick={()=>setQuoteFormOpen(false)} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:12,fontWeight:600}}>Cancel</button>
<button onClick={saveQuote} disabled={!qStop.trim()} style={{background:qStop.trim()?"#16a34a":"#a8a29e",color:"#fff",border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:12,fontWeight:700}}>Save Quote</button>
</div>
</div>}
{savedQuotes.length===0&&!quoteFormOpen&&<div style={_s.emptyState2}><div style={{fontSize:40,marginBottom:12}}>💰</div><p style={{fontSize:14,fontWeight:600,margin:"0 0 4px"}}>No quotes yet</p><p style={{fontSize:12,margin:0}}>Create your first quote above</p></div>}
{savedQuotes.filter(q=>quoteTab==="current"?q.status!=="accepted":q.status==="accepted").map((q,qi)=>{const c=CC[q.customer]||CC["Quote Delivery"]||CC["One-Off Delivery"];const accepted=q.status==="accepted";return(
<div key={q.id} style={{background:accepted?"#f0fdf4":"#fff",border:`1px solid ${accepted?"#bbf7d0":"#e7e5e4"}`,borderRadius:14,padding:"14px 18px",marginBottom:8,borderLeft:`4px solid ${accepted?"#16a34a":c.accent}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div style={_s.f1}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
<span style={{fontSize:12,fontWeight:800,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>#{q.num}</span>
<span style={{fontSize:11,fontWeight:600,color:c.accent}}>{q.customer}</span>
{accepted&&<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"1px 6px",borderRadius:3,fontWeight:700}}>ACCEPTED</span>}
{!accepted&&<span style={{fontSize:9,background:"#fef3c7",color:"#92400e",padding:"1px 6px",borderRadius:3,fontWeight:700}}>PENDING</span>}
{q.miles&&<span style={_s.sub}>{q.miles}mi</span>}
{q.liftgate&&<span style={{fontSize:9,background:"#fef3c7",color:"#92400e",padding:"1px 4px",borderRadius:3}}>LG</span>}
{q.gravel&&<span style={{fontSize:9,background:"#fef3c7",color:"#92400e",padding:"1px 4px",borderRadius:3}}>GRV</span>}
{q.extraPallets&&<span style={{fontSize:9,background:"#fef3c7",color:"#92400e",padding:"1px 4px",borderRadius:3}}>4-5P</span>}
</div>
<div style={{fontSize:15,fontWeight:700}}>{q.stop}</div>
{q.addr&&<div style={{fontSize:11,color:"#78716c",marginTop:1}}>📍 {q.addr}</div>}
{(q.pickupName||q.pickupAddr)&&<div style={{fontSize:11,color:"#2563eb",marginTop:2,fontWeight:600}}>📦 PU: {q.pickupName||""}{q.pickupAddr?" — "+q.pickupAddr.split(",")[0]:""}</div>}
{q.note&&<div style={{fontSize:11,color:"#57534e",marginTop:2}}>{q.note}</div>}
<div style={{fontSize:10,color:"#a8a29e",marginTop:4}}>{new Date(q.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})} at {new Date(q.createdAt).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}</div>
</div>
<div style={{textAlign:"right",marginLeft:14,flexShrink:0}}>
<div style={{fontSize:20,fontWeight:800,color:accepted?"#16a34a":"#1c1917",fontVariantNumeric:"tabular-nums"}}>{fmt(q.rate)}</div>
{q.calc&&<div style={_s.sub}>{fmt(q.calc.base)}+{fmt(q.calc.fuel)} fuel</div>}
{!accepted&&<div style={{display:"flex",flexDirection:"column",gap:4,marginTop:8}}>
{qPushDay&&qPushDay.quoteId===q.id?<div style={{display:"flex",flexDirection:"column",gap:4}}>
<input type="date" onChange={e=>{if(e.target.value){
const target=new Date(e.target.value+"T12:00:00");const now=new Date();
const tD=target.getDay();const tM=new Date(target);tM.setDate(target.getDate()-(tD===0?6:tD-1));
const nD=now.getDay();const nM=new Date(now);nM.setDate(now.getDate()-(nD===0?6:nD-1));
tM.setHours(0,0,0,0);nM.setHours(0,0,0,0);
const weekOff=Math.round((tM-nM)/(7*24*60*60*1000));
const dayIdx=tD===0?6:tD-1;
if(dayIdx>=0&&dayIdx<=4){pushQuoteToDay(q.id,`${weekOff}-${dayIdx}`);}
else{showToast("Pick a weekday (Mon-Fri)");}
}}} style={{border:"1px solid #16a34a",borderRadius:6,padding:"6px 8px",fontSize:12,outline:"none",background:"#f0fdf4",fontWeight:600}}/>
<button onClick={()=>setQPushDay(null)} style={{background:"none",border:"none",fontSize:9,color:"#78716c",cursor:"pointer"}}>Cancel</button>
</div>
:<button onClick={()=>setQPushDay({quoteId:q.id})} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:10,fontWeight:700}}>Push to Day</button>}
<button onClick={()=>{setSavedQuotes(p=>p.filter(x=>x.id!==q.id));deleteQuoteFromFB(q.id).catch(e=>console.error("Quote del:",e));showToast("Quote deleted");}} style={{background:"none",border:"none",color:"#dc2626",fontSize:9,cursor:"pointer",padding:"2px 0"}}>Delete</button>
</div>}
{accepted&&q.pushedTo&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
<span style={{fontSize:10,color:"#16a34a",fontWeight:600}}>✓ Pushed to {DAYS[parseInt(q.pushedTo.split("-")[1])]||""}</span>
<button onClick={()=>unplanQuote(q.id)} style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:10,color:"#dc2626",fontWeight:600}}>Unplan</button>
</div>}
</div>
</div>
</div>);})}
{savedQuotes.filter(q=>quoteTab==="current"?q.status!=="accepted":q.status==="accepted").length===0&&<div style={{textAlign:"center",padding:"32px 16px",color:"#a8a29e"}}><div style={{fontSize:28,marginBottom:8}}>{quoteTab==="current"?"📋":"✅"}</div><div style={{fontSize:13}}>{quoteTab==="current"?"No open quotes":"No completed quotes"}</div></div>}
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
{histFiltered.length===0&&<div style={_s.emptyState2}><div style={{fontSize:40,marginBottom:12}}>🔍</div><p style={{fontSize:14,margin:0}}>{histAll.length===0?"No delivery data yet":"No matches"}</p></div>}
{histFiltered.length>0&&(()=>{const grouped={};histFiltered.forEach(e=>{const gk=`${e.weekOff}-${e.dayIdx}`;if(!grouped[gk])grouped[gk]={dayName:e.dayName,dayDate:e.dayDate,weekOff:e.weekOff,dayIdx:e.dayIdx,entries:[]};grouped[gk].entries.push(e);});return Object.values(grouped).sort((a,b)=>a.weekOff!==b.weekOff?b.weekOff-a.weekOff:b.dayIdx-a.dayIdx).map((grp,gi)=>{const dayTotal=grp.entries.reduce((s,e)=>s+e.baseRate,0);const isCur=grp.weekOff===wo;return(<div key={gi} style={{marginBottom:14}}>
<div style={{display:"flex",justifyContent:"space-between",padding:"6px 4px",borderBottom:"1px solid #e7e5e4",marginBottom:6}}>
<span style={{fontSize:13,fontWeight:700,color:isCur?"#1c1917":"#78716c"}}>{grp.dayName} — {grp.dayDate}{!isCur&&<span style={{fontSize:10,color:"#a8a29e",fontWeight:500,marginLeft:4}}>{grp.weekOff===wo-1?"last wk":(wo-grp.weekOff)+"w ago"}</span>}</span>
<span style={{fontSize:12,fontWeight:600,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(dayTotal)}</span>
</div>
{grp.entries.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di=drivers.findIndex(d=>d.id===entry.driverId);const hasPhotos=entry.photos&&entry.photos.length>0;return(
<div key={entry.id} onClick={()=>setHistDetail(entry)} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 10px 7px 16px",borderLeft:`3px solid ${entry.stopType==="pickup"?"#2563eb":c.accent}`,marginBottom:4,background:"#fff",borderRadius:"0 8px 8px 0",cursor:"pointer"}}>
<div style={_s.f1m}>
<div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
{entry.stopType==="pickup"&&<span style={{fontSize:8,background:"#2563eb",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:700}}>PU</span>}
{entry.stopType!=="pickup"&&<span style={{fontSize:8,background:"#16a34a",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:700}}>DEL</span>}
<span style={{fontSize:11,color:c.accent,fontWeight:600}}>{entry.customer}</span>
<span style={_s.truncate}>{entry.stop}</span>
{hasPhotos&&<span style={{fontSize:9,background:"#dbeafe",color:"#2563eb",padding:"1px 4px",borderRadius:3,fontWeight:600}}>📷 {entry.photos.length}</span>}
{entry.signature&&<span style={{fontSize:9,background:"#dcfce7",color:"#16a34a",padding:"1px 4px",borderRadius:3,fontWeight:600}}>✓ POD</span>}
</div>
{entry.addr&&<div style={{fontSize:10,color:"#a8a29e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.addr}</div>}
{hasPhotos&&<div style={{display:"flex",gap:4,marginTop:4}}>{entry.photos.slice(0,5).map((p,pi)=><img key={pi} src={p} alt="" onClick={e=>{e.stopPropagation();setLightboxPhoto({src:p,stop:entry.stop,customer:entry.customer,dayName:entry.dayName,dayDate:entry.dayDate,signature:entry.signature});}} style={{width:40,height:40,objectFit:"cover",borderRadius:6,border:"1px solid #e7e5e4",cursor:"pointer"}}/>)}{entry.photos.length>5&&<div style={{width:40,height:40,borderRadius:6,background:"#f5f5f4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#78716c"}}>+{entry.photos.length-5}</div>}</div>}
</div>
<div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:8}}>
{drv&&<span style={{fontSize:9,background:DCOL[di]||"#78716c",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:600}}>{drv.name.split(" ")[0]}</span>}
<InlineRate value={entry.baseRate+(entry.knownLiftgate?(entry.liftgateFee||75):0)} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/>
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
{/* POD Detail Modal */}
{histDetail&&(()=>{const e=histDetail;const c=getCustColor(e.customer);const drv=drivers.find(d=>d.id===e.driverId);const di=drivers.findIndex(d=>d.id===e.driverId);const hasPhotos=e.photos&&e.photos.length>0&&!e.photos.every(p=>typeof p==="string"&&p.startsWith("photo_"));return(
<div onClick={()=>setHistDetail(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:290,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
<div onClick={ev=>ev.stopPropagation()} style={{background:"#fff",borderRadius:16,maxWidth:500,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
{/* Header */}
<div style={{padding:"16px 20px",borderBottom:"1px solid #e7e5e4",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
{e.stopType==="pickup"?<span style={{fontSize:9,background:"#2563eb",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700}}>PICKUP</span>:<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700}}>DELIVERY</span>}
{e.status==="departed"&&<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700}}>COMPLETED</span>}
{e.status==="arrived"&&!e.departedAt&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700}}>ON SITE</span>}
{e.priority&&<span style={{fontSize:9,background:"#f59e0b",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700}}>PRIORITY</span>}
</div>
<div style={{fontSize:18,fontWeight:700}}>{e.stop}</div>
<div style={{fontSize:13,color:c.accent,fontWeight:600}}>{e.customer}</div>
{e.addr&&<div style={{fontSize:12,color:"#78716c",marginTop:2}}>{e.addr}</div>}
</div>
<button onClick={()=>setHistDetail(null)} style={{background:"#f5f5f4",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:14,color:"#78716c",flexShrink:0}}>✕</button>
</div>
{/* Info */}
<div style={{padding:"12px 20px",display:"flex",flexDirection:"column",gap:8}}>
<div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
{drv&&<div style={{display:"flex",alignItems:"center",gap:6,background:DCOL[di]+"18",border:`1px solid ${DCOL[di]}44`,borderRadius:8,padding:"6px 12px"}}>
<div style={{width:24,height:24,borderRadius:6,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>{drv.name.split(" ").map(n=>n[0]).join("")}</div>
<span style={{fontSize:12,fontWeight:600}}>{drv.name}</span>
</div>}
<div style={{display:"flex",alignItems:"center",gap:4,background:"#f5f5f4",borderRadius:8,padding:"6px 12px"}}>
<span style={{fontSize:11,color:"#78716c"}}>{e.dayName} — {e.dayDate}</span>
</div>
</div>
{(e.arrivedAt||e.departedAt)&&<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
{e.arrivedAt&&<div style={{display:"flex",alignItems:"center",gap:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"6px 12px"}}>
<span style={{fontSize:16}}>📍</span><div><div style={{fontSize:10,color:"#16a34a",fontWeight:700}}>Arrived</div><div style={{fontSize:14,fontWeight:700}}>{e.arrivedAt}</div></div>
</div>}
{e.departedAt&&<div style={{display:"flex",alignItems:"center",gap:6,background:"#dcfce7",border:"1px solid #86efac",borderRadius:8,padding:"6px 12px"}}>
<span style={{fontSize:16}}>✅</span><div><div style={{fontSize:10,color:"#16a34a",fontWeight:700}}>Departed</div><div style={{fontSize:14,fontWeight:700}}>{e.departedAt}</div></div>
</div>}
</div>}
{e.instructions&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#1d4ed8"}}>📋 {e.instructions}</div>}
{e.note&&<div style={{fontSize:12,color:"#78716c"}}>{e.note}</div>}
{e.weight>0&&<div style={{fontSize:12,color:BRAND.main,fontWeight:700}}>{e.weight.toLocaleString()} lbs{e.wasSplit?" (Load "+e.loadNum+")":""}</div>}
{e.shipPlan&&<div style={{fontSize:12,color:"#ea580c",fontWeight:700}}>Ship Plan # {e.shipPlan}</div>}
{e.dueBy&&<div style={{fontSize:12,color:"#dc2626",fontWeight:600}}>⏰ {e.dueBy}</div>}
</div>
{/* Signature / POD */}
{e.signature&&<div style={{padding:"0 20px 12px"}}>
<div style={{background:"#f0fdf4",border:"2px solid #16a34a",borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
<div style={{fontSize:12,color:"#16a34a",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Proof of Delivery</div>
<div style={{fontSize:20,fontWeight:700,color:"#1c1917"}}>✍ {e.signature}</div>
<div style={{fontSize:11,color:"#78716c",marginTop:2}}>Signed by recipient</div>
</div>
</div>}
{/* Photos */}
{hasPhotos&&<div style={{padding:"0 20px 16px"}}>
<div style={{fontSize:12,fontWeight:700,color:"#57534e",marginBottom:8}}>📷 Photos ({e.photos.filter(p=>!(typeof p==="string"&&p.startsWith("photo_"))).length})</div>
<div style={{display:"flex",flexDirection:"column",gap:8}}>
{e.photos.filter(p=>!(typeof p==="string"&&p.startsWith("photo_"))).map((p,pi)=><img key={pi} src={p} alt={`POD ${pi+1}`} onClick={()=>{setHistDetail(null);setLightboxPhoto({src:p,stop:e.stop,customer:e.customer,dayName:e.dayName,dayDate:e.dayDate,signature:e.signature});}} style={{width:"100%",borderRadius:10,border:"1px solid #e7e5e4",cursor:"pointer",objectFit:"contain",maxHeight:300}}/>)}
</div>
</div>}
{!e.signature&&!hasPhotos&&!(e.arrivedAt||e.departedAt)&&<div style={{padding:"12px 20px 16px",textAlign:"center",color:"#a8a29e",fontSize:12}}>No POD data recorded for this stop</div>}
{/* Rate */}
<div style={{padding:"12px 20px 16px",borderTop:"1px solid #e7e5e4",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:13,color:"#78716c"}}>Rate</span>
<span style={{fontSize:18,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{e.isHourly?"Hourly":fmt(e.baseRate+(e.knownLiftgate?(e.liftgateFee||75):0))}</span>
</div>
</div>
</div>);})()}
</div>}

{/* Add — handled by shared mobile layout (desktop falls through) */}
</div>
)}

{/* \u2500\u2500 MAIN 3-COLUMN \u2500\u2500 */}
{(view==="manifest")&&<div style={{flex:1,display:"grid",gridTemplateColumns:"minmax(240px,1fr) minmax(300px,2fr) minmax(240px,1fr)",gap:0,overflow:"hidden"}}>

{/* LEFT \u2500 Kanban Manifests */}
<div style={{background:"#fff",borderRight:"1px solid #e7e5e4",overflowY:"auto",padding:"16px"}}>
<div style={_s.flexBtwMb12}>
<h2 style={{margin:0,fontSize:15,fontWeight:700}}>Manifests</h2>
<button onClick={()=>{setView("add");setSelCust(null);setQuoteMode(null);}} style={{background:"#16a34a",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:600,color:"#fff"}}>+ Add</button>
</div>

{!editingNote?<div onClick={()=>{setEditingNote(true);setNoteText(dispNotes[emDk]||"");}} style={{background:dispNotes[emDk]?"#faf5ff":"#fafaf9",border:dispNotes[emDk]?"1px solid #d8b4fe":"1px dashed #d6d3d1",borderRadius:10,padding:"8px 12px",marginBottom:12,cursor:"pointer",minHeight:32,display:"flex",alignItems:"flex-start",gap:8}}>
<span style={{fontSize:13,flexShrink:0}}>{"📝"}</span>
{dispNotes[emDk]?<div style={_s.f1}><div style={{fontSize:9,fontWeight:700,color:"#7c3aed",textTransform:"uppercase"}}>Notes</div><div style={{fontSize:12,color:"#57534e",whiteSpace:"pre-wrap",marginTop:2}}>{dispNotes[emDk]}</div></div>
:<div style={{fontSize:11,color:"#a8a29e",paddingTop:2}}>Click to add dispatcher notes</div>}
</div>
:<div style={{background:"#fff",border:"2px solid #7c3aed",borderRadius:10,padding:"10px 12px",marginBottom:12}}>
<div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",marginBottom:4}}>Dispatcher Notes</div>
<textarea value={noteText} onChange={e=>setNoteText(e.target.value)} autoFocus placeholder="Route changes, special instructions…" rows={2}
style={{width:"100%",border:"1px solid #d8b4fe",borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none",resize:"vertical",fontFamily:"inherit",background:"#faf5ff"}}/>
<div style={{display:"flex",gap:6,marginTop:6,justifyContent:"flex-end"}}>
{dispNotes[emDk]&&<button onClick={()=>{setDispNotes(p=>{const n={...p};delete n[emDk];return n;});setEditingNote(false);setNoteText("");}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,color:"#dc2626",fontWeight:600}}>Clear</button>}
<button onClick={()=>setEditingNote(false)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600}}>Cancel</button>
<button onClick={()=>{setDispNotes(p=>({...p,[emDk]:noteText.trim()}));setEditingNote(false);showToast("Notes saved");}} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:6,padding:"4px 12px",cursor:"pointer",fontSize:10,fontWeight:600}}>Save</button>
</div>
</div>}

{allDriverEntries.map(({drv,di,entries:de})=>(
<div key={drv.id} style={{marginBottom:12}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:"#f5f5f4",borderRadius:"10px 10px 0 0",borderLeft:`3px solid ${DCOL[di]}`}}>
<div style={_s.flexC8}>
<div style={{width:24,height:24,borderRadius:8,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",fontWeight:700}}>{drv.name.charAt(0)}</div>
<span style={{fontSize:13,fontWeight:700}}>{drv.name}</span>
<span style={{fontSize:11,color:"#a8a29e"}}>({de.length})</span>
{de.length>0&&<span style={{fontSize:9,color:"#78716c",fontVariantNumeric:"tabular-nums"}}>~{getDriverMiles(drv.id)}mi</span>}
</div>
<div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
{de.length>0&&<><button onClick={()=>printManifest(drv.id)} style={{background:"#e7e5e4",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#57534e",fontWeight:600}}>Print</button><button onClick={()=>textManifest(drv.id)} style={{background:"#dbeafe",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#2563eb",fontWeight:600}}>Text</button><button onClick={()=>{setNotifyDriver(drv.id);setNotifyCustomMsg("");}} style={{background:"#fef3c7",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#92400e",fontWeight:600}}>Notify</button></>}
{de.length>=2&&<div style={{position:"relative"}}>
<button onClick={()=>setSortMenuDrv(sortMenuDrv===drv.id?null:drv.id)} style={{background:"linear-gradient(135deg,#2563eb,#1d4ed8)",border:"none",borderRadius:5,padding:"3px 7px",cursor:"pointer",fontSize:9,color:"#fff",fontWeight:700}}>⚡ Route ▾</button>
{sortMenuDrv===drv.id&&<><div style={{position:"fixed",inset:0,zIndex:199}} onClick={()=>setSortMenuDrv(null)}/>
<div style={{position:"absolute",top:"100%",right:0,zIndex:200,background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:6,marginTop:4,boxShadow:"0 12px 40px rgba(0,0,0,0.2)",width:220}}>
<div style={{fontSize:12,fontWeight:700,color:DCOL[di],padding:"6px 10px",borderBottom:"1px solid #f5f5f4",marginBottom:4}}>{drv.name} — Route Order</div>
{SORT_OPTIONS.map((opt,oi)=><button key={oi} onClick={()=>opt.fn(drv.id)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",textAlign:"left",background:"none",border:"none",padding:"9px 10px",cursor:"pointer",borderRadius:8,fontSize:11,fontWeight:600,color:"#1c1917"}} onMouseEnter={e=>{e.currentTarget.style.background="#eff6ff";}} onMouseLeave={e=>{e.currentTarget.style.background="none";}}>
<span style={{fontSize:14}}>{opt.icon}</span><div><div>{opt.label}</div><div style={{fontSize:8,color:"#a8a29e",fontWeight:400}}>{opt.desc}</div></div>
</button>)}
</div></>}
</div>}
<button onClick={()=>setInsertPickupFor({driverId:drv.id,afterIdx:-1})} style={{background:"#eff6ff",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#2563eb",fontWeight:600}}>+PU</button>
<button onClick={()=>setDriverViewId(drv.id)} style={{background:"#f3e8f9",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#7c3aed",fontWeight:600}}>View</button>
{/* ⋯ More menu */}
<div style={{position:"relative"}}>
<button onClick={()=>setSortMenuDrv(sortMenuDrv===("more-"+drv.id)?null:"more-"+drv.id)} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#57534e",fontWeight:600}}>⋯</button>
{sortMenuDrv===("more-"+drv.id)&&<><div style={{position:"fixed",inset:0,zIndex:199}} onClick={()=>setSortMenuDrv(null)}/>
<div style={{position:"absolute",top:"100%",right:0,zIndex:200,background:"#fff",border:"1px solid #e7e5e4",borderRadius:12,padding:6,marginTop:4,boxShadow:"0 12px 40px rgba(0,0,0,0.2)",width:180}}>
<div style={{fontSize:11,fontWeight:700,color:DCOL[di],padding:"6px 10px",borderBottom:"1px solid #f5f5f4",marginBottom:4}}>{drv.name}</div>
{getDriverLoadOptions(drv.id)<3&&<button onClick={()=>{addDriverLoad(drv.id);setSortMenuDrv(null);}} style={_s.menuBtn}>
<span style={{fontSize:14}}>🚚</span><span>Add Load {getDriverLoadOptions(drv.id)+1}</span>
</button>}
<button onClick={()=>{toggleDriverCapacity(drv.id);setSortMenuDrv(null);}} style={_s.menuBtn}>
<span style={{fontSize:14}}>{getDriverCapacity(drv.id)===TRUCK_LIMITS.heavy?"🚚":"🚛"}</span><span>{getDriverCapacity(drv.id)===TRUCK_LIMITS.heavy?"Switch to 10k":"Switch to 13.5k"}</span>
</button>
</div></>}
</div>
{/* + Add (far right) */}
<button onClick={()=>{setPreAssignDriver(drv.id);setView("add");setSelCust(null);setQuoteMode(null);}} style={{background:"#dcfce7",border:"none",borderRadius:5,padding:"3px 6px",cursor:"pointer",fontSize:9,color:"#16a34a",fontWeight:600}}>+</button>
</div>
</div>
<div style={{background:"#fafaf9",border:"1px solid #e7e5e4",borderTop:"none",borderRadius:"0 0 10px 10px",padding:de.length?"6px 6px 2px":"8px 10px",minHeight:40}}>
{de.length===0&&<div style={{fontSize:11,color:"#a8a29e",textAlign:"center",padding:4}}>No stops</div>}
{de.length>0&&(()=>{const cap=getDriverCapacity(drv.id);const loads=getDriverLoads(drv.id);return(<>
{loads.map(loadN=>{const w=getLoadWeight(drv.id,loadN);const pct=weightPct(w,cap);const col=weightColor(w,cap);const over=w>cap;return w>0||loads.length>1?(<div key={loadN} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 4px",marginBottom:2}}>
<span style={{fontSize:11,fontWeight:700,color:"#78716c",flexShrink:0}}>L{loadN}</span>
<div style={{flex:1,height:8,background:"#e7e5e4",borderRadius:4,overflow:"hidden"}}>
<div style={{height:"100%",width:pct+"%",background:col,borderRadius:4,transition:"width 0.3s"}}/>
</div>
<span style={{fontSize:12,fontWeight:700,color:col,fontVariantNumeric:"tabular-nums",flexShrink:0}}>{w.toLocaleString()}<span style={{fontSize:10,color:"#a8a29e"}}>/{(cap/1000).toFixed(0)}k</span></span>
{over&&<span style={{fontSize:7,background:"#dc2626",color:"#fff",padding:"0px 3px",borderRadius:2,fontWeight:700}}>OVER</span>}
</div>):null;})}
<button onClick={()=>toggleDriverCapacity(drv.id)} style={{fontSize:8,color:cap===TRUCK_LIMITS.heavy?"#d97706":"#a8a29e",background:cap===TRUCK_LIMITS.heavy?"#fef3c7":"transparent",border:"none",borderRadius:4,padding:"1px 6px",cursor:"pointer",fontWeight:600}}>
{cap===TRUCK_LIMITS.heavy?"🚛 13.5k":"→ 13.5k"}
</button>
{/* Show unassigned split loads that match this driver's stops */}
{(()=>{const uaSplits=dl.filter(e=>e.driverId===0&&e.wasSplit&&e.loadNum>1);const drvStopNames=de.filter(e=>e.wasSplit).map(e=>e.stop);const matchingSplits=uaSplits.filter(e=>drvStopNames.includes(e.stop));if(!matchingSplits.length)return null;return matchingSplits.map(s=><div key={s.id} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 8px",marginBottom:2,background:"#fef3c7",border:"1px solid #fde68a",borderRadius:6}}>
<span style={{fontSize:9,fontWeight:700,color:"#92400e"}}>⚠ Load {s.loadNum} unassigned:</span>
<span style={{fontSize:9,color:"#78716c"}}>{s.stop} — {s.weight?.toLocaleString()||0} lbs</span>
<button onClick={()=>reassign(s.id,drv.id)} style={{marginLeft:"auto",background:"#16a34a",color:"#fff",border:"none",borderRadius:4,padding:"2px 8px",cursor:"pointer",fontSize:8,fontWeight:700}}>+ Assign</button>
</div>);})()}
</>);})()}
{(()=>{
/* Group stops by load number and render with separators */
const maxLoadNum=Math.max(...de.map(e=>e.loadNum||1),1);
const hasMultiLoads=maxLoadNum>1||getDriverLoadOptions(drv.id)>1;
let globalIdx=0;
const loadGroups=[];
for(let ln=1;ln<=Math.max(maxLoadNum,getDriverLoadOptions(drv.id));ln++){
  const loadStops=de.filter(e=>(e.loadNum||1)===ln);
  if(loadStops.length>0||hasMultiLoads)loadGroups.push({loadNum:ln,stops:loadStops});
}
return loadGroups.map(({loadNum:ln,stops:loadStops})=>{
let stopNum=0;
return(<div key={"load-"+ln}>
{hasMultiLoads&&<div style={{display:"flex",alignItems:"center",gap:8,margin:"8px 0 4px",padding:"0 4px"}}>
<div style={{flex:1,height:2,background:ln===1?"#2563eb":ln===2?"#d97706":"#7c3aed",borderRadius:1,opacity:0.4}}/>
<span style={{fontSize:10,fontWeight:800,color:ln===1?"#2563eb":ln===2?"#d97706":"#7c3aed",letterSpacing:"0.05em"}}>LOAD {ln}</span>
<div style={{flex:1,height:2,background:ln===1?"#2563eb":ln===2?"#d97706":"#7c3aed",borderRadius:1,opacity:0.4}}/>
</div>}
{loadStops.length===0&&hasMultiLoads&&<div style={{padding:"12px 10px",textAlign:"center",fontSize:11,color:"#a8a29e",background:"#fafaf9",border:"2px dashed #e7e5e4",borderRadius:8,marginBottom:4}}>No stops on Load {ln} — drag or assign stops here</div>}
{loadStops.map((entry)=>{
stopNum++;
const eIdx=de.indexOf(entry);
const c=CC[entry.customer]||CC["One-Off Delivery"];const isPU=entry.stopType==="pickup";const done=entry.status==="departed";const onSite=entry.status==="arrived";const hasDue=!!entry.dueBy;const addr=entry.addr||getAddr(entry.stop);const isP=entry.priority;const hasInstr=entry.instructions?.trim();const isImetco=entry.customer==="IMETCO";
const isDrgSrc=dragSrc?.drvId===drv.id&&dragSrc?.idx===eIdx;
const isDrgOver=dragOver?.drvId===drv.id&&dragOver?.idx===eIdx;
return(<div key={entry.id}>
<div draggable onDragStart={()=>setDragSrc({drvId:drv.id,idx:eIdx})}
onDragOver={ev=>{ev.preventDefault();setDragOver({drvId:drv.id,idx:eIdx});}}
onDrop={()=>handleDrop(drv.id,eIdx)}
style={{background:isDrgOver?"#dcfce7":isDrgSrc?"#fef9c3":done?"#f0fdf4":onSite?"#fffbeb":hasDue?"#fef2f2":isP?"#fef3c7":isPU?"#eff6ff":"#fff",border:isDrgOver?"2px dashed #16a34a":`1px solid ${done?"#bbf7d0":onSite?"#fde68a":hasDue?"#fca5a5":"#e7e5e4"}`,borderRadius:8,padding:"8px 10px",marginBottom:0,borderLeft:`3px solid ${isPU?"#2563eb":isP?"#f59e0b":c.accent}`,opacity:isDrgSrc?0.4:done?0.6:1,cursor:"grab",transition:"background 0.1s"}}>
<div style={_s.flexC4Mb2W}>
<span style={{fontSize:10,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>{stopNum}.</span>
{isPU&&<span style={_s.tagBlue}>PU</span>}
{!isPU&&<span style={_s.tagGreen}>DEL</span>}
{isP&&<span style={_s.tagAmber}>PRIORITY</span>}
{done&&<span style={_s.tagGreen}>DONE</span>}
{onSite&&!done&&<span style={_s.tagAmber}>ON SITE</span>}
{hasDue&&<span style={{fontSize:8,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700,display:"inline-flex",alignItems:"center",gap:1}}>{"\u23F0"}{entry.dueBy}</span>}
{entry.pickupDueBy&&<span style={{fontSize:8,background:"#16a34a",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700,display:"inline-flex",alignItems:"center",gap:1}}>{"📦"}{entry.pickupDueBy}</span>}
{isImetco&&<span style={{fontSize:8,background:"#ea580c",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>SHIP PLAN REQ</span>}
<span style={{fontSize:11,fontWeight:600,color:"#1c1917",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.stop}</span>
</div>
<div style={_s.flexBtw}>
<div style={{fontSize:10,color:c.accent,fontWeight:600}}>{entry.customer}{entry.pickupFrom&&entry.stopType!=="pickup"?<span style={{color:"#78716c",fontWeight:500}}> — {entry.pickupFrom}</span>:""}</div>
<InlineRate value={entry.baseRate+(entry.knownLiftgate?(entry.liftgateFee||75):0)} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/>
</div>
{addr&&<div style={{fontSize:9,color:"#78716c",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{addr}</div>}
{entry.note&&<div style={{fontSize:9,color:"#a8a29e",marginTop:1}}>{entry.note}</div>}
{entry.shipPlan&&<div style={{fontSize:9,color:"#ea580c",fontWeight:700,marginTop:1}}>SP# {entry.shipPlan}</div>}
{entry.weight>0&&<div style={{fontSize:9,color:BRAND.main,fontWeight:700,marginTop:1}}>{entry.weight.toLocaleString()} lbs{(entry.loadNum||1)>1?" (Load "+(entry.loadNum||1)+")":""}</div>}
{(entry.arrivedAt||entry.departedAt||entry.eta)&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>
{entry.arrivedAt&&<span style={{fontSize:9,fontWeight:700,color:"#16a34a",background:"#f0fdf4",padding:"1px 5px",borderRadius:4}}>📍 {entry.arrivedAt}</span>}
{entry.departedAt&&<span style={{fontSize:9,fontWeight:700,color:"#16a34a",background:"#dcfce7",padding:"1px 5px",borderRadius:4}}>✅ {entry.departedAt}</span>}
{entry.eta&&<span style={{fontSize:9,fontWeight:700,color:"#2563eb",background:"#eff6ff",padding:"1px 5px",borderRadius:4}}>🚚 {fmtEta(entry.eta)}{entry.etaDest?" → "+entry.etaDest.split(" - ")[0]:""}</span>}
</div>}
{entry.signature&&<div style={{fontSize:9,color:"#16a34a",marginTop:1}}>✍ {entry.signature}</div>}
{entry.photos&&entry.photos.length>0&&<div style={{display:"flex",gap:3,marginTop:3}}>{entry.photos.map((p,pi)=><img key={pi} src={p} alt="" style={{width:24,height:24,objectFit:"cover",borderRadius:4,border:"1px solid #e7e5e4"}}/>)}</div>}
<div style={_s.flexG3Mt4}>
<select value={entry.driverId+":"+(entry.loadNum||1)} onChange={e=>{e.stopPropagation();const v=e.target.value;if(v==="0:1"){reassign(entry.id,0);return;}const[did,ln]=v.split(":").map(Number);reassign(entry.id,did,ln);}} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:5,padding:"2px 4px",fontSize:9,color:"#57534e",cursor:"pointer",maxWidth:80}}><option value="0:1">{entry.driverId>0?"↩ Unassign":"Assign"}</option>{drivers.flatMap(dd=>{const nl=getDriverLoadOptions(dd.id);const opts=[<option key={dd.id+":1"} value={dd.id+":1"}>{dd.name}</option>];for(let ln=2;ln<=nl;ln++)opts.push(<option key={dd.id+":"+ln} value={dd.id+":"+ln}>{dd.name.split(" ").map(w=>w[0]).join("")+" L"+ln}</option>);return opts;})}</select>
<button onClick={()=>moveInDriver(drv.id,eIdx,-1)} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:4,padding:"1px 5px",cursor:"pointer",fontSize:9,color:"#78716c"}} title="Move up">▲</button>
<button onClick={()=>moveInDriver(drv.id,eIdx,1)} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:4,padding:"1px 5px",cursor:"pointer",fontSize:9,color:"#78716c"}} title="Move down">▼</button>
<input type="number" inputMode="numeric" value={entry.weight||""} onChange={e=>setWeight(entry.id,e.target.value)} onClick={e=>e.stopPropagation()} placeholder="lbs" style={{width:52,border:"1px solid #d6d3d1",borderRadius:4,padding:"2px 4px",fontSize:9,fontWeight:700,outline:"none",textAlign:"center",background:entry.weight?"#f0f5fa":"#fff"}}/>
{!isPU&&!entry.isHourly&&!entry.liftgateApplied&&<button onClick={()=>manualLiftgate(entry.id)} style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:4,padding:"1px 6px",cursor:"pointer",fontSize:9,color:"#ea580c",fontWeight:700}}>+LG</button>}
{!isPU&&entry.isHourly&&!entry.liftgateApplied&&<button onClick={()=>{setEmH(p=>{const key=`${emDk}-emser`;const cur=p[key]||4;return{...p,[key]:cur+1};});setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===entry.id?{...e,liftgateApplied:true}:e)}));showToast("Liftgate +1 hr added");}} style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:4,padding:"1px 6px",cursor:"pointer",fontSize:9,color:"#ea580c",fontWeight:700}}>+1HR LG</button>}
{entry.liftgateApplied&&<span style={{fontSize:8,color:"#16a34a",fontWeight:700,padding:"2px 4px"}}>{entry.isHourly?"✓+1HR":"✓LG"}</span>}
{!isPU&&!entry.wasSplit&&<button onClick={()=>setSplitEntry({id:entry.id,totalWeight:entry.weight||0,ratio:50,truck1Weight:Math.round((entry.weight||0)/2)})} style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:4,padding:"1px 6px",cursor:"pointer",fontSize:9,color:"#2563eb",fontWeight:700}}>✂Split</button>}
{entry.wasSplit&&<span style={_s.loadBadge}>L{entry.loadNum}</span>}
{getDriverLoadOptions(drv.id)>1&&!entry.wasSplit&&<>{[1,2,3].filter(n=>n<=getDriverLoadOptions(drv.id)).map(n=><button key={n} onClick={()=>setLoadNum(entry.id,n)} style={{padding:"1px 5px",borderRadius:3,border:"none",cursor:"pointer",fontSize:8,fontWeight:700,background:(entry.loadNum||1)===n?"#7c3aed":"#f5f5f4",color:(entry.loadNum||1)===n?"#fff":"#78716c"}}>L{n}</button>)}</>}
<button onClick={()=>deleteDel(entry.id)} style={{background:"none",border:"none",color:"#dc2626",fontSize:9,cursor:"pointer",padding:"1px 4px"}}>✕</button>
</div>
{/* Inline notes edit */}
<div style={{display:"flex",gap:3,marginTop:3,alignItems:"center"}}>
<input value={entry.instructions||""} onChange={e=>updateInstructions(entry.id,e.target.value)} onClick={e=>e.stopPropagation()} placeholder="📋 Add notes..." style={{flex:1,border:"1px solid #e7e5e4",borderRadius:4,padding:"3px 6px",fontSize:9,outline:"none",background:entry.instructions?"#eff6ff":"#fafaf9",color:"#1c1917",fontFamily:"inherit"}}/>
</div>
{/* Inline split panel */}
{splitEntry?.id===entry.id&&<div style={{marginTop:6,background:"#eff6ff",border:"2px solid #2563eb",borderRadius:8,padding:10}}>
<div style={{fontSize:11,fontWeight:700,color:"#1e40af",marginBottom:8}}>✂ Split Shipment</div>
{(()=>{const tw=splitEntry.totalWeight||0;const t1w=splitEntry.truck1Weight!==undefined?splitEntry.truck1Weight:Math.round(tw*(splitEntry.ratio/100));const t2w=tw-t1w;return(<>
<div style={_s.flexG6Mb6}>
<div style={_s.f1}><label style={_s.labelSm}>Total</label><input type="number" inputMode="numeric" value={tw||""} onChange={e=>{const newTw=parseInt(e.target.value)||0;setSplitEntry(p=>({...p,totalWeight:newTw,truck1Weight:Math.min(p.truck1Weight||Math.round(newTw/2),newTw)}));}} style={_s.splitTotal}/></div>
<div style={_s.f1}><label style={_s.labelBlue}>Truck 1</label><input type="number" inputMode="numeric" value={splitEntry.truck1Weight!==undefined?splitEntry.truck1Weight:""} onChange={e=>{const v=e.target.value;setSplitEntry(p=>({...p,truck1Weight:v===""?0:parseInt(v)||0}));}} style={_s.splitInput}/></div>
<div style={_s.f1}><label style={_s.labelGray}>Truck 2</label><div style={_s.splitT2}>{t2w.toLocaleString()}</div></div>
</div>
<input type="range" min={0} max={tw} step={100} value={t1w} onChange={e=>{const v=parseInt(e.target.value)||0;setSplitEntry(p=>({...p,truck1Weight:v}));}} style={_s.slider}/>
</>);})()}
<div style={_s.flexG6}>
<button onClick={()=>confirmSplit(entry.id,splitEntry.totalWeight,splitEntry.ratio,splitEntry.truck1Weight)} style={_s.splitBtn}>✂ Split</button>
<button onClick={()=>setSplitEntry(null)} style={_s.cancelBtn}>Cancel</button>
</div>
</div>}
</div>
<button onClick={()=>setInsertPickupFor({driverId:drv.id,afterIdx:eIdx})} style={{display:"block",width:"100%",background:"none",border:"none",borderRadius:0,padding:"2px 0",cursor:"pointer",fontSize:8,color:"#bfdbfe",textAlign:"center",opacity:0.6}}>+ pickup</button>
</div>);})}
</div>);});})()}
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
<div style={_s.flexC4Mb2W}>
{entry.stopType==="pickup"&&<span style={_s.tagBlue}>PU</span>}
{entry.stopType!=="pickup"&&<span style={_s.tagGreen}>DEL</span>}
{entry.priority&&<span style={_s.tagAmber}>PRIORITY</span>}
{entry.dueBy&&<span style={{fontSize:8,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700}}>{"\u23F0"}{entry.dueBy}</span>}
{entry.pickupDueBy&&<span style={_s.tagGreen}>{"📦"}{entry.pickupDueBy}</span>}
<span style={{fontSize:11,fontWeight:600}}>{entry.stop}</span>
</div>
<div style={_s.flexBtw}>
<div style={{fontSize:10,color:c.accent}}>{entry.customer}{entry.pickupFrom&&entry.stopType!=="pickup"?<span style={{color:"#78716c"}}> — {entry.pickupFrom}</span>:""}</div>
<InlineRate value={entry.baseRate+(entry.knownLiftgate?(entry.liftgateFee||75):0)} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/>
</div>
{addr&&<div style={{fontSize:9,color:"#78716c",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{addr}</div>}
{entry.note&&<div style={{fontSize:9,color:"#a8a29e",marginTop:1}}>{entry.note}</div>}
{entry.weight>0&&<div style={{fontSize:9,color:BRAND.main,fontWeight:700,marginTop:1}}>{entry.weight.toLocaleString()} lbs</div>}
<div style={{display:"flex",gap:3,marginTop:4,alignItems:"center"}}>
<select value={"0:1"} onChange={e=>{const v=e.target.value;if(v==="0:1")return;const[did,ln]=v.split(":").map(Number);reassign(entry.id,did,ln);}} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:5,padding:"3px 6px",fontSize:10,color:"#57534e",cursor:"pointer"}}>
<option value="0:1">Assign...</option>{drivers.flatMap(dd=>{const nl=getDriverLoadOptions(dd.id);const opts=[<option key={dd.id+":1"} value={dd.id+":1"}>{dd.name}</option>];for(let ln=2;ln<=nl;ln++)opts.push(<option key={dd.id+":"+ln} value={dd.id+":"+ln}>{dd.name.split(" ").map(w=>w[0]).join("")+" L"+ln}</option>);return opts;})}
</select>
<input type="number" inputMode="numeric" value={entry.weight||""} onChange={e=>setWeight(entry.id,e.target.value)} onClick={e=>e.stopPropagation()} placeholder="lbs" style={{width:52,border:"1px solid #d6d3d1",borderRadius:4,padding:"3px 4px",fontSize:9,fontWeight:700,outline:"none",textAlign:"center",background:entry.weight?"#f0f5fa":"#fff"}}/>
<button onClick={()=>deleteDel(entry.id)} style={{marginLeft:"auto",background:"none",border:"none",color:"#dc2626",fontSize:9,cursor:"pointer",padding:"2px 4px"}}>✕</button>
</div>
<input value={entry.instructions||""} onChange={e=>updateInstructions(entry.id,e.target.value)} onClick={e=>e.stopPropagation()} placeholder="📋 Add notes..." style={{width:"100%",marginTop:3,border:"1px solid #e7e5e4",borderRadius:4,padding:"3px 6px",fontSize:9,outline:"none",background:entry.instructions?"#eff6ff":"#fafaf9",color:"#1c1917",fontFamily:"inherit"}}/>
</div>);})}
</div>
</div>}
</div>

{/* CENTER \u2500 Map + Revenue */}
<div style={{background:"#f8f7f5",overflowY:"auto",display:"flex",flexDirection:"column"}}>

<div style={{padding:"16px 20px 0"}}>
<div style={_s.flexBtwMb10}>
<h2 style={{margin:0,fontSize:15,fontWeight:700}}>Live Routes</h2>
<div style={{display:"flex",gap:10}}>
{drivers.map((d,di)=><div key={d.id} style={_s.flexC4}>
<div style={{width:8,height:8,borderRadius:4,background:DCOL[di]}}/>
<span style={_s.sub}>{d.name.split(" ")[0]}</span>
</div>)}
</div>
</div>
</div>
{(()=>{
const stopsWithCoords2=dl.map(e=>{const addr=e.addr||getAddr(e.stop);const coords=getCoords(addr);if(!coords)return null;
/* Compute route order: position within this driver's stops */
const drvStopsArr=dl.filter(x=>x.driverId===e.driverId);
const routeOrder=e.driverId>0?drvStopsArr.indexOf(e)+1:0;
return{...e,coords,routeOrder};}).filter(Boolean);
return(
<div style={{margin:"0 20px"}}>
{/* Driver selector for click-to-assign — with multi-load support */}
<div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
<span style={{fontSize:10,color:"#78716c",fontWeight:600,marginRight:2}}>Assign to:</span>
{drivers.map((d,di)=>{const numLoads=getDriverLoadOptions(d.id);const isActive=mapActiveDrv===d.id;const initials=d.name.split(" ").map(w=>w[0]).join("").toUpperCase();return(<Fragment key={d.id}>
<button onClick={()=>{if(isActive&&mapActiveLoad===1){setMapActiveDrv(null);setMapActiveLoad(1);}else{setMapActiveDrv(d.id);setMapActiveLoad(1);}}}
style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:numLoads>1?"8px 0 0 8px":8,border:`2px solid ${isActive&&mapActiveLoad===1?DCOL[di]:"#e7e5e4"}`,borderRight:numLoads>1?(isActive?"1px solid rgba(255,255,255,0.3)":"1px solid #e7e5e4"):undefined,background:isActive&&mapActiveLoad===1?DCOL[di]:"#fff",cursor:"pointer",transition:"all 0.15s"}}>
<div style={{width:10,height:10,borderRadius:3,background:isActive&&mapActiveLoad===1?"#fff":DCOL[di]}}/>
<span style={{fontSize:11,fontWeight:700,color:isActive&&mapActiveLoad===1?"#fff":"#57534e"}}>{d.name.split(" ")[0]}</span>
</button>
{numLoads>1&&Array.from({length:numLoads-1},(_,li)=>li+2).map(ln=>(
<button key={d.id+"-L"+ln} onClick={()=>{if(isActive&&mapActiveLoad===ln){setMapActiveDrv(null);setMapActiveLoad(1);}else{setMapActiveDrv(d.id);setMapActiveLoad(ln);}}}
style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:ln===numLoads?"0 8px 8px 0":"0",border:`2px solid ${isActive&&mapActiveLoad===ln?DCOL[di]:"#e7e5e4"}`,borderLeft:"none",background:isActive&&mapActiveLoad===ln?DCOL[di]:"#fff",cursor:"pointer",transition:"all 0.15s"}}>
<span style={{fontSize:10,fontWeight:700,color:isActive&&mapActiveLoad===ln?"#fff":"#57534e"}}>{initials} L{ln}</span>
</button>
))}
</Fragment>);})}
{mapActiveDrv&&<button onClick={()=>{setMapActiveDrv(null);setMapActiveLoad(1);}} style={{fontSize:10,color:"#78716c",background:"none",border:"none",cursor:"pointer",padding:"4px 6px"}}>✕ Clear</button>}
{!mapActiveDrv&&<span style={{fontSize:10,color:"#a8a29e",fontStyle:"italic"}}>or click any stop to see details</span>}
</div>
<GoogleMapView stops={stopsWithCoords2} drivers={drivers} height={Math.max(500,window.innerHeight-280)} showSearch={true} searchLabel="Search address on map…"
activeDriver={mapActiveDrv} activeLoad={mapActiveLoad}
onAssignStop={mapActiveDrv?(stopId,drvId)=>{assignInOrder(stopId,mapActiveDrv,mapActiveLoad);}:null} driverLocs={driverLocs}/>
</div>);
})()}

{/* Revenue Dashboard */}
<div style={{padding:"16px 20px"}}>

<h2 style={{margin:"0 0 12px",fontSize:15,fontWeight:700}}>Today's Revenue</h2>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
<div style={{background:"#fff",borderRadius:12,padding:"14px 16px",textAlign:"center",border:"1px solid #e7e5e4"}}>
<div style={{fontSize:10,color:"#a8a29e",textTransform:"uppercase",marginBottom:4}}>Deliveries</div>
<div style={{fontSize:24,fontWeight:800,fontVariantNumeric:"tabular-nums"}}>{deliveryCount}</div>
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

{/* ── MOTIVE GPS PANEL ── */}
<div style={{background:"#f8f7f5",borderRadius:14,border:"1px solid #e7e5e4",padding:"12px 14px",marginTop:12}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:13}}>📡</span>
<span style={{fontSize:12,fontWeight:700,color:"#1c1917"}}>Motive GPS</span>
</div>
<span style={{fontSize:9,color:"#a8a29e",fontWeight:500}}>1 min polling</span>
</div>
{drivers.filter(d=>d.id<=3).map((drv,di)=>{
  const loc=driverLocs[drv.id];
  const on=gpsEnabled[drv.id]!==false;
  const col=DCOL[di]||BRAND.main;
  const age=loc?.updatedAt?(typeof loc.updatedAt==="string"?Math.round((Date.now()-new Date(loc.updatedAt).getTime())/60000):Math.round((Date.now()-loc.updatedAt)/60000)):null;
  const ageStr=age===null?"—":age<1?"just now":age<60?age+"m ago":Math.round(age/60)+"h ago";
  const hasLoc=on&&loc&&loc.lat;
  return(
  <div key={drv.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,marginBottom:4,background:on?"#fff":"#f5f5f4",border:"1px solid "+(on?"#e7e5e4":"#ebebea"),transition:"all 0.2s"}}>
    <div style={{width:28,height:28,borderRadius:8,background:on?col:"#d6d3d1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700,flexShrink:0,transition:"background 0.2s"}}>
      {drv.name.charAt(0)}
    </div>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:12,fontWeight:600,color:on?"#1c1917":"#a8a29e"}}>{drv.name.split(" ")[0]}</div>
      {on&&hasLoc?(
        <div style={{fontSize:10,color:"#78716c",display:"flex",alignItems:"center",gap:4}}>
          {loc.city?<span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:80}}>{loc.city}{loc.locState?", "+loc.locState:""}</span>:<span>Located</span>}
          {loc.speed>0&&<span style={{color:"#2563eb",fontWeight:600,flexShrink:0}}>· {loc.speed} mph</span>}
        </div>
      ):(
        <div style={{fontSize:10,color:"#a8a29e"}}>{on?"No data yet":"GPS off"}</div>
      )}
    </div>
    {on&&hasLoc&&(
      <div style={{fontSize:9,color:age!==null&&age>30?"#dc2626":"#78716c",background:age!==null&&age>30?"#fef2f2":"#f5f5f4",border:"1px solid "+(age!==null&&age>30?"#fca5a5":"#e7e5e4"),borderRadius:6,padding:"2px 6px",flexShrink:0,fontWeight:age!==null&&age>30?700:400}}>
        {age!==null&&age>30?"⚠ ":""}{ageStr}
      </div>
    )}
    <button onClick={()=>{toggleGps(drv.id);if(on){setDriverLocs(prev=>{const n={...prev};delete n[drv.id];return n;});}}}
      style={{flexShrink:0,width:36,height:20,borderRadius:10,border:"none",cursor:"pointer",background:on?col:"#d6d3d1",position:"relative",transition:"background 0.25s",padding:0}}
      title={(on?"Disable":"Enable")+" GPS for "+drv.name}>
      <span style={{position:"absolute",top:2,left:on?18:2,width:16,height:16,borderRadius:8,background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.25)",transition:"left 0.2s",display:"block"}}/>
    </button>
  </div>
  );
})}
</div>
</div>
</div>

{/* RIGHT \u2500 Daily Log */}
<div style={{background:"#fff",borderLeft:"1px solid #e7e5e4",overflowY:"auto",padding:16}}>
<div style={_s.flexBtwMb12}>
<h2 style={{margin:0,fontSize:15,fontWeight:700}}>Daily Log</h2>
<div style={_s.flexC8}>
<button onClick={printDailyLog} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#78716c"}}>Print</button>
<span style={{fontVariantNumeric:"tabular-nums",fontSize:16,fontWeight:700,color:"#16a34a"}}>{fmt(dc.total)}</span>
</div>
</div>

{dl.some(e=>e.isHourly)&&(()=>{const {byDriver,totalMins}=getShiftSummary(emDk);const _mLG=dl.filter(e=>e.isHourly&&e.liftgateApplied).length;const _mDist=dl.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length;const hoursUsed=totalMins>0?Math.round((totalMins+(_mLG+_mDist)*60)/15)*15/60:(emH[`${emDk}-emser`]||4);return(<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:12}}>
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
{[4,5,6,7,8,9,10].map(h=><button key={h} onClick={()=>setEmH(p=>({...p,[`${emDk}-emser`]:h}))} style={{width:28,height:26,borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:hoursUsed===h?"#2563eb":"#e7e5e4",color:hoursUsed===h?"#fff":"#78716c"}}>{h}</button>)}
</div>
</div>);})()}

{dl.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:"#a8a29e"}}><div style={{fontSize:28,marginBottom:8}}>{"\uD83D\uDE9A"}</div><div style={{fontSize:13}}>No deliveries yet</div></div>
:dl.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di=drivers.findIndex(d=>d.id===entry.driverId);const done=entry.status==="departed";const onSite=entry.status==="arrived";const addr=entry.addr||getAddr(entry.stop);const hasInstr=entry.instructions?.trim();return(
<div key={entry.id} style={{background:done?"#f0fdf4":onSite?"#fffbeb":"#fafaf9",borderRadius:10,padding:"10px 14px",marginBottom:6,borderLeft:`3px solid ${entry.priority?"#f59e0b":entry.stopType==="pickup"?"#2563eb":c.accent}`,border:`1px solid ${done?"#bbf7d0":onSite?"#fde68a":"#e7e5e4"}`,opacity:done?0.7:1}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div style={_s.f1m}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
<span style={{fontSize:10,fontWeight:600,color:c.accent,textTransform:"uppercase"}}>{entry.customer}</span>
{entry.stopType==="pickup"&&<span style={_s.tagBlue}>PU</span>}
{entry.stopType!=="pickup"&&<span style={_s.tagGreen}>DEL</span>}
{entry.priority&&<span style={_s.tagAmber}>PRIORITY</span>}
{done&&<span style={_s.tagGreen}>DONE</span>}
{onSite&&!done&&<span style={_s.tagAmber}>ON SITE</span>}
{entry.dueBy&&<span style={{fontSize:8,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 4px",borderRadius:2,fontWeight:700,display:"inline-flex",alignItems:"center",gap:1}}>{"\u23F0"}{entry.dueBy}</span>}
{drv&&<span style={{fontSize:9,background:DCOL[di]||"#78716c",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:600}}>{drv.name.split(" ")[0]}</span>}
</div>
<div style={{fontSize:13,fontWeight:600}}>{entry.stop}</div>
{addr&&<div style={{fontSize:10,color:"#a8a29e",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{addr}</div>}
{entry.note&&<div style={{fontSize:10,color:"#a8a29e",marginTop:1}}>{entry.note}</div>}
{hasInstr&&<div style={{fontSize:10,color:"#2563eb",marginTop:2,background:"#eff6ff",padding:"3px 6px",borderRadius:4}}>📋 {entry.instructions}</div>}
{entry.shipPlan&&<div style={{fontSize:10,color:"#ea580c",fontWeight:700,marginTop:1}}>SP# {entry.shipPlan}</div>}
{entry.weight>0&&<div style={{fontSize:10,color:BRAND.main,fontWeight:700,marginTop:1}}>{entry.weight.toLocaleString()} lbs{(entry.loadNum||1)>1?" (Load "+(entry.loadNum||1)+")":""}</div>}
{(entry.arrivedAt||entry.departedAt||entry.eta)&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>
{entry.arrivedAt&&<span style={{fontSize:10,fontWeight:700,color:"#16a34a",background:"#f0fdf4",padding:"1px 5px",borderRadius:4}}>📍 {entry.arrivedAt}</span>}
{entry.departedAt&&<span style={{fontSize:10,fontWeight:700,color:"#16a34a",background:"#dcfce7",padding:"1px 5px",borderRadius:4}}>✅ {entry.departedAt}</span>}
{entry.eta&&<span style={{fontSize:10,fontWeight:700,color:"#2563eb",background:"#eff6ff",padding:"1px 5px",borderRadius:4}}>🚚 {fmtEta(entry.eta)}{entry.etaDest?" → "+entry.etaDest.split(" - ")[0]:""}</span>}
</div>}
{entry.signature&&<div style={{fontSize:9,color:"#16a34a",marginTop:1}}>✍ {entry.signature}</div>}
{entry.photos&&entry.photos.length>0&&<div style={{display:"flex",gap:3,marginTop:3}}>{entry.photos.map((p,pi)=><img key={pi} src={p} alt="" style={{width:24,height:24,objectFit:"cover",borderRadius:4,border:"1px solid #e7e5e4"}}/>)}</div>}
</div>
<InlineRate value={entry.baseRate+(entry.knownLiftgate?(entry.liftgateFee||75):0)} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/>
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

{showDM&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>{if(editDrv&&editNm.trim()){driverChangeSource.current="user";dirtyDriversRef.current=true;setDrivers(p=>p.map(d=>d.id===editDrv?{...d,name:editNm.trim(),phone:editPh.trim()}:d));}setShowDM(false);setEditDrv(null);}}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:420}} onClick={e=>e.stopPropagation()}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{margin:0,fontSize:18,fontWeight:700}}>Manage Drivers</h3><button onClick={()=>{if(editDrv&&editNm.trim()){driverChangeSource.current="user";dirtyDriversRef.current=true;setDrivers(p=>p.map(d=>d.id===editDrv?{...d,name:editNm.trim(),phone:editPh.trim()}:d));}setShowDM(false);setEditDrv(null);}} style={_s.iconBtn}>{"\u2715"}</button></div>
{drivers.map((d,i)=><div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f5f5f4"}}>
<div style={{width:12,height:12,borderRadius:4,background:DCOL[i]||"#78716c",flexShrink:0}}/>
{editDrv===d.id?<div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
<input value={editNm} onChange={e=>setEditNm(e.target.value)} autoFocus placeholder="Name" onBlur={()=>{setTimeout(()=>{if(editNm.trim())saveDrv(d.id);},200);}} style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:14,outline:"none"}}/>
<div style={_s.flexG6}><input value={editPh} onChange={e=>setEditPh(e.target.value)} placeholder="Phone (optional)" onKeyDown={e=>e.key==="Enter"&&saveDrv(d.id)} onBlur={()=>{setTimeout(()=>saveDrv(d.id),100);}} style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:13,outline:"none"}}/><button onClick={()=>saveDrv(d.id)} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>Save</button></div>
</div>:<>
<div style={_s.f1}><div style={{fontSize:15,fontWeight:600}}>{d.name}</div>{d.phone&&<div style={_s.sub11}>{d.phone}</div>}</div>
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
<button onClick={addDrvr} disabled={!newDN.trim()} style={{background:newDN.trim()?"#16a34a":"#d6d3d1",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:newDN.trim()?"pointer":"default",fontSize:12,fontWeight:600,flexShrink:0}}>Add</button>
</div>

</div>
</div>
</div>}

{/* Driver Link Modal */}
{showLinkModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowLinkModal(null)}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
<div style={_s.flexBtwMb16}>
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
<div style={_s.flexC10}>
<div style={{width:36,height:36,borderRadius:12,background:"linear-gradient(135deg, #d97706, #ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{"🤖"}</div>
<div><div style={{fontSize:15,fontWeight:700}}>Dispatch AI</div><div style={_s.sub}>Knows your routes, rates & customers</div></div>
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
<div style={{maxWidth:"85%"}}>
{msg._preview&&<img src={msg._preview} alt="dispatch" style={{maxWidth:"100%",maxHeight:150,borderRadius:12,marginBottom:4,objectFit:"cover"}}/>}
<div style={{padding:"10px 14px",borderRadius:msg.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:msg.role==="user"?BRAND.main:"#f5f5f4",color:msg.role==="user"?"#fff":"#1c1917",fontSize:13,lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
{msg.role==="user"?(msg._text||"📷 Photo"):typeof msg.content==="string"?msg.content.replace(/```json[\s\S]*?```/g,"").trim():""}
</div>
{msg._stops&&msg._stops.length>0&&<ParsedStopsCard stops={msg._stops} onAddSelected={(selected)=>{
selected.forEach(s=>{
const cust=s.customer||"Emser Tile";
const cd=CUSTOMERS[cust];
const isHourly=cd?.rate_type==="hourly";
const rate=s.rate||0;
const fuelPct=(cd?.fuel_surcharge&&!cd?.fuel_included)?cd.fuel_surcharge:0;
addDel(cust,s.stop,isHourly?0:rate,0,{isHourly,weight:s.weight||0,note:s.note||null,fuelPct});
});
const custName=selected[0]?.customer||"Emser Tile";
showToast(selected.length+" "+custName+" stops added");
}}/>}
</div>
</div>
))}
{chatLoading&&<div style={{display:"flex",justifyContent:"flex-start"}}>
<div style={{padding:"10px 14px",borderRadius:"14px 14px 14px 4px",background:"#f5f5f4",fontSize:13,color:"#a8a29e"}}>
<span style={{animation:"pulse 1s infinite"}}>Thinking...</span>
</div>
</div>}
</div>
{chatImage&&<div style={{padding:"8px 16px 0",display:"flex",alignItems:"center",gap:8}}>
<div style={{position:"relative"}}>{chatImage.mediaType==="application/pdf"?<div style={{width:50,height:50,borderRadius:8,background:"#fef2f2",border:"1px solid #fca5a5",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}><span style={{fontSize:18}}>📄</span><span style={{fontSize:7,color:"#dc2626",fontWeight:600}}>PDF</span></div>:<img src={chatImage.preview} alt="" style={{height:50,borderRadius:8}}/>}<button onClick={()=>setChatImage(null)} style={{position:"absolute",top:-4,right:-4,background:"#dc2626",color:"#fff",border:"none",borderRadius:10,width:18,height:18,fontSize:9,cursor:"pointer",fontWeight:700}}>✕</button></div>
<div><div style={{fontSize:11,color:"#16a34a",fontWeight:600}}>Ready</div>{chatImage.fileName&&<div style={{fontSize:9,color:"#78716c"}}>{chatImage.fileName}</div>}</div>
</div>}
<div style={{padding:"8px 16px 16px",borderTop:"1px solid #e7e5e4",display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
<label style={{display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:8,cursor:"pointer",flexShrink:0}} title="Take photo">
<span style={{fontSize:14}}>📷</span>
<input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{if(e.target.files[0]){const f=e.target.files[0];const r=new FileReader();r.onload=ev=>{setChatImage({base64:ev.target.result.split(",")[1],preview:ev.target.result,mediaType:f.type||"image/jpeg",fileName:f.name});};r.readAsDataURL(f);}e.target.value="";}}/>
</label>
<label style={{display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:8,cursor:"pointer",flexShrink:0}} title="Upload file">
<span style={{fontSize:14}}>📎</span>
<input type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={e=>{if(e.target.files[0]){const f=e.target.files[0];const r=new FileReader();r.onload=ev=>{const isPdf=f.type==="application/pdf";setChatImage({base64:ev.target.result.split(",")[1],preview:isPdf?null:ev.target.result,mediaType:f.type||"image/jpeg",fileName:f.name});};r.readAsDataURL(f);}e.target.value="";}}/>
</label>
<input value={chatInput} onChange={e=>setChatInput(e.target.value)}
onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
placeholder={chatImage?"Add note or send…":"Ask about routes, quotes, revenue..."}
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:12,padding:"12px 16px",fontSize:14,outline:"none",background:"#fafaf9",fontFamily:"inherit"}}/>
<button onClick={sendChat} disabled={(!chatInput.trim()&&!chatImage)||chatLoading}
style={{background:(chatInput.trim()||chatImage)&&!chatLoading?BRAND.main:"#e7e5e4",color:(chatInput.trim()||chatImage)&&!chatLoading?"#fff":"#a8a29e",border:"none",borderRadius:12,padding:"12px 16px",cursor:(chatInput.trim()||chatImage)&&!chatLoading?"pointer":"default",fontSize:14,fontWeight:700,flexShrink:0}}>
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
<div style={_s.flexBtwMb16}>
<div style={_s.flexC8}>
<div style={{width:28,height:28,borderRadius:8,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:700}}>{drv?.name?.charAt(0)}</div>
<h3 style={{margin:0,fontSize:16,fontWeight:700}}>{"Notify "+drv?.name}</h3>
</div>
<button onClick={()=>setNotifyDriver(null)} style={_s.iconBtn}>{"\u2715"}</button>
</div>
<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
<button onClick={()=>sendNotification(notifyDriver,"🔄 RETURN TO YARD\nHead back to base when current stop is complete.","return")} style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"2px solid #dc2626",background:"#fef2f2",cursor:"pointer"}}>
<span style={{fontSize:20}}>{"🔄"}</span><div><div style={{fontSize:13,fontWeight:700,color:"#dc2626"}}>Return to Yard</div></div></button>
<button onClick={()=>sendNotification(notifyDriver,"📞 CALL DISPATCH\nCall dispatch ASAP.","call")} style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"1px solid #e7e5e4",background:"#fafaf9",cursor:"pointer"}}>
<span style={{fontSize:20}}>{"📞"}</span><div><div style={{fontSize:13,fontWeight:700}}>Call Dispatch</div></div></button>
<button onClick={()=>sendNotification(notifyDriver,"⚠️ MANIFEST UPDATED\nYour route has been changed. Check your manifest.\nCurrent stops: "+de.length,"update")} style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"1px solid #e7e5e4",background:"#fafaf9",cursor:"pointer"}}>
<span style={{fontSize:20}}>{"⚠️"}</span><div><div style={{fontSize:13,fontWeight:700}}>Manifest Updated</div></div></button>
</div>
<div style={_s.flexG6}>
<textarea value={notifyCustomMsg} onChange={e=>setNotifyCustomMsg(e.target.value)} placeholder="Custom message..." rows={2} style={{flex:1,border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
<button onClick={()=>{if(notifyCustomMsg.trim())sendNotification(notifyDriver,notifyCustomMsg.trim(),"custom");}} disabled={!notifyCustomMsg.trim()} style={{alignSelf:"flex-end",background:notifyCustomMsg.trim()?BRAND.main:"#e7e5e4",color:notifyCustomMsg.trim()?"#fff":"#a8a29e",border:"none",borderRadius:10,padding:"10px 16px",cursor:notifyCustomMsg.trim()?"pointer":"default",fontSize:13,fontWeight:600}}>Send</button>
</div>
</div>
</div>);
})()}

{/* Insert Pickup Modal - Desktop */}
{insertPickupFor&&(()=>{
const handleSelect=src=>{setPickupCustomer(src.customer);setPickupStop(src.label);setPickupAddr(src.addr);};
const allStops=new Set();Object.values(CUSTOMERS).forEach(cd=>(cd.deliveries||[]).forEach(d=>{allStops.add(typeof d==="string"?d:d.s);}));
const remaining=[...allStops].filter(s=>!SHARED_STOPS.includes(s)&&!s.startsWith("Transfer")&&s!=="Drop Ship Liftgate").sort();
return(
<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20,paddingTop:40,overflowY:"auto"}} onClick={()=>setInsertPickupFor(null)}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:400}} onClick={e=>e.stopPropagation()}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><h3 style={{margin:0,fontSize:18,fontWeight:700}}>Insert Pickup</h3><button onClick={()=>setInsertPickupFor(null)} style={_s.iconBtn}>✕</button></div>
<p style={{fontSize:12,color:"#78716c",margin:"0 0 10px"}}>Tap a customer to auto-fill, or use manual entry.</p>
<div style={{maxHeight:180,overflowY:"auto",marginBottom:12,border:"1px solid #e7e5e4",borderRadius:12,padding:4}}>
{PICKUP_SOURCES.map((src,i)=><button key={i} onClick={()=>handleSelect(src)} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 12px",marginBottom:2,borderRadius:8,cursor:"pointer",background:pickupStop===src.label?"#eff6ff":"#fafaf9",border:pickupStop===src.label?"2px solid #2563eb":"1px solid transparent"}}><div style={{fontSize:13,fontWeight:600}}>{src.label}</div><div style={{fontSize:10,color:"#a8a29e"}}>{src.addr}</div></button>)}
</div>
<details style={{marginBottom:12}}><summary style={{fontSize:13,fontWeight:600,color:"#2563eb",cursor:"pointer",padding:"4px 0"}}>Manual Entry</summary><div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}><input value={pickupCustomer} onChange={e=>setPickupCustomer(e.target.value)} placeholder="Customer" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/><input value={pickupStop} onChange={e=>setPickupStop(e.target.value)} placeholder="Location" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/><AddressInput value={pickupAddr} onChange={v=>setPickupAddr(v)} placeholder="Address"/></div></details>
{pickupStop&&(()=>{
const custData=CUSTOMERS[pickupCustomer];
const custDels=custData?.deliveries?custData.deliveries.map(d=>typeof d==="string"?d:d.s).sort():null;
return(<div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:6}}>Picking up for</label>
{custDels?<>
<div style={{maxHeight:160,overflowY:"auto",border:"1px solid #e7e5e4",borderRadius:10,padding:4,marginBottom:8}}>
{custDels.filter(s=>!s.startsWith("Transfer")).map(s=><button key={s} onClick={()=>setPickupForDel(pickupForDel===s?"":s)} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 10px",marginBottom:1,borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600,background:pickupForDel===s?"#16a34a":"#fff",color:pickupForDel===s?"#fff":"#1c1917",border:pickupForDel===s?"1px solid #15803d":"1px solid transparent"}}>{s}</button>)}
</div>
</>:<>
<div style={{fontSize:10,fontWeight:600,color:"#d97706",marginBottom:4}}>Multi-customer stops</div>
<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{SHARED_STOPS.map(s=><button key={s} onClick={()=>setPickupForDel(s)} style={{padding:"5px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:pickupForDel===s?"#16a34a":"#fef3c7",color:pickupForDel===s?"#fff":"#92400e"}}>{s.split(" - ")[0]}</button>)}</div>
<details style={{marginBottom:8}}><summary style={{fontSize:11,fontWeight:600,color:"#57534e",cursor:"pointer"}}>All other ({remaining.length})</summary><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6,maxHeight:120,overflowY:"auto"}}>{remaining.map(s=><button key={s} onClick={()=>setPickupForDel(s)} style={{padding:"4px 8px",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,fontWeight:600,background:pickupForDel===s?"#16a34a":"#e7e5e4",color:pickupForDel===s?"#fff":"#57534e"}}>{s}</button>)}</div></details>
</>}
<input value={pickupForDel} onChange={e=>setPickupForDel(e.target.value)} placeholder="Custom / type manually..." style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/>
</div>);})()}
{pickupStop&&<input value={pickupNote} onChange={e=>setPickupNote(e.target.value)} placeholder="Note (optional)" style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",marginBottom:12}}/>}
{pickupStop&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:12}}><div style={{fontSize:11,color:"#2563eb",fontWeight:600}}>PICKUP</div><div style={_s.bold14}>{pickupCustomer||"Pickup"}{pickupForDel?` → ${pickupForDel}`:""}</div>{pickupAddr&&<div style={_s.sub11}>{pickupAddr}</div>}</div>}
<button onClick={()=>insertPickup(insertPickupFor.driverId,insertPickupFor.afterIdx)} disabled={!pickupStop} style={{display:"block",width:"100%",background:pickupStop?"#2563eb":"#e7e5e4",color:pickupStop?"#fff":"#a8a29e",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:600,cursor:pickupStop?"pointer":"default"}}>Insert Pickup</button>
</div>
</div>
);
})()}

{showMsgPanel&&<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column"}}>
<div onClick={()=>setShowMsgPanel(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
<div style={{position:"relative",marginTop:"auto",background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column",zIndex:1,minHeight:400}}>
{/* Header */}
<div style={{padding:"14px 20px 10px",borderBottom:"1px solid #e7e5e4",flexShrink:0}}>
<div style={_s.flexBtwMb10}>
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

<style>{`@keyframes slideDown{from{transform:translate(-50%,-20px);opacity:0}to{transform:translate(-50%,0);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}button:active{transform:scale(0.98)}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#f5f5f4}::-webkit-scrollbar-thumb{background:#d6d3d1;border-radius:3px}::-webkit-scrollbar-thumb:hover{background:#a8a29e}`}</style>
</div>
);
}


return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#f5f5f4",color:"#1c1917",minHeight:"100vh",maxWidth:isDesktop?900:480,margin:"0 auto"}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
{toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#16a34a",color:"#fff",padding:"10px 24px",borderRadius:12,fontWeight:600,fontSize:14,zIndex:999,boxShadow:"0 8px 32px rgba(22,163,74,0.3)",animation:"slideDown 0.3s ease"}}>{"✓ "+toast}</div>}

{/* Desktop: back to dashboard bar */}
{isDesktop&&<div style={{background:"#fff",borderBottom:"1px solid #e7e5e4",padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<button onClick={()=>{setView("manifest");setSelCust(null);setQuoteMode(null);window.history.replaceState(null,"",window.location.pathname);window.scrollTo(0,0);}} style={{background:BRAND.main,border:"none",color:"#fff",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:600}}>{"← Dashboard"}</button>
<div style={_s.flexG6}>
{[{k:"daily",l:"Daily"},{k:"weekly",l:"Weekly"},{k:"history",l:"History"},{k:"add",l:"+ Add"}].map(v=><button key={v.k} onClick={()=>{setView(v.k);setSelCust(null);setQuoteMode(null);}} style={{background:view===v.k?BRAND.main:"#f5f5f4",border:view===v.k?"none":"1px solid #e7e5e4",color:view===v.k?"#fff":"#57534e",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>{v.l}</button>)}
</div>
</div>}

{/* HEADER */}
<div style={{background:BRAND.dark,color:"#fff",padding:"16px 20px 12px"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<a href={window.location.pathname} onClick={e=>{e.preventDefault();setView("manifest");setSelCust(null);setQuoteMode(null);window.history.replaceState(null,"",window.location.pathname);window.scrollTo(0,0);}} style={{cursor:"pointer"}}><img src={LOGO_WHITE} alt="Davis Delivery" style={{height:28,objectFit:"contain"}}/></a>
<div>
<div style={{fontSize:8,color:"#93c5fd",fontWeight:600,opacity:0.7}}>v{APP_VERSION}</div>
<div style={{display:"flex",alignItems:"center",gap:3}}><span style={{display:"inline-block",width:5,height:5,borderRadius:3,background:fbConnected?"#16a34a":"#dc2626"}}/><span style={{fontSize:7,color:fbConnected?"#6ee7b7":"#fca5a5"}}>{saveStatus||((fbConnected?"synced":"offline"))}</span></div>
</div>

</div>
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
{[{k:"manifest",l:"Manifests"},{k:"routes",l:"Routes"},{k:"daily",l:"Daily"},{k:"weekly",l:"Weekly"}].map(v=>
<button key={v.k} onClick={()=>{setView(v.k);setSelCust(null);setSelStop(null);setQuoteMode(null);setInsertPickupFor(null);setMultiSelect(false);setMultiChecked([]);setPreAssignDriver(null);setShowMoreMenu(false);}}
style={{flex:1,border:view===v.k?"2px solid "+BRAND.main:"1px solid #d6d3d1",borderRadius:10,padding:"9px 2px",cursor:"pointer",fontSize:11,fontWeight:600,background:view===v.k?BRAND.main:"#fff",color:view===v.k?"#fff":BRAND.main}}>{v.l}</button>
)}
<button onClick={()=>setShowMoreMenu(true)}
style={{flex:1,border:view==="history"?"2px solid "+BRAND.main:"1px solid #d6d3d1",borderRadius:10,padding:"9px 2px",cursor:"pointer",fontSize:11,fontWeight:600,background:view==="history"?BRAND.main:"#fff",color:view==="history"?"#fff":BRAND.main}}>
{view==="history"?(histMode==="quotes"?"Quotes":histMode==="emser"?"Emser":"History"):"More ⋯"}
</button>
<button onClick={()=>{setView("add");setSelCust(null);setSelStop(null);setQuoteMode(null);setInsertPickupFor(null);setMultiSelect(false);setMultiChecked([]);setShowMoreMenu(false);}}
style={{flex:1,border:"2px solid #16a34a",borderRadius:10,padding:"9px 2px",cursor:"pointer",fontSize:11,fontWeight:600,background:view==="add"?"#16a34a":"#fff",color:view==="add"?"#fff":"#16a34a"}}>+ Add</button>
</div>

{/* MORE MENU — bottom sheet */}
{showMoreMenu&&<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column"}} onClick={()=>setShowMoreMenu(false)}>
<div style={{flex:1,background:"rgba(0,0,0,0.4)"}}/>
<div style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"20px 16px 32px"}} onClick={e=>e.stopPropagation()}>
<div style={{width:40,height:4,borderRadius:2,background:"#d6d3d1",margin:"0 auto 16px"}}/>
<div style={{fontSize:16,fontWeight:700,marginBottom:14,color:"#1c1917"}}>More Options</div>
{[
{icon:"📋",label:"Delivery History",desc:"Search past deliveries & proof of delivery",mode:"deliveries"},
{icon:"📷",label:"Photos",desc:"Delivery photos & POD signatures",mode:"photos"},
{icon:"💰",label:"Quotes",desc:"Create and manage delivery quotes",mode:"quotes"},
{icon:"⏱",label:"Emser Hours",desc:"Track driver shift hours for Emser",mode:"emser"},
].map(item=>(
<button key={item.mode} onClick={()=>{setView("history");setHistMode(item.mode);setShowMoreMenu(false);}}
style={{display:"flex",alignItems:"center",gap:12,width:"100%",textAlign:"left",padding:"14px 12px",marginBottom:6,borderRadius:12,border:view==="history"&&histMode===item.mode?"2px solid #7c3aed":"1px solid #e7e5e4",background:view==="history"&&histMode===item.mode?"#f3e8ff":"#fff",cursor:"pointer"}}>
<span style={{fontSize:24,width:36,textAlign:"center",flexShrink:0}}>{item.icon}</span>
<div>
<div style={{fontSize:14,fontWeight:700,color:view==="history"&&histMode===item.mode?"#7c3aed":"#1c1917"}}>{item.label}</div>
<div style={{fontSize:11,color:"#78716c",marginTop:1}}>{item.desc}</div>
</div>
</button>
))}
<div style={{borderTop:"1px solid #e7e5e4",marginTop:8,paddingTop:8,display:"flex",gap:8}}>
<button onClick={()=>{exportBackup();setShowMoreMenu(false);}}
style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 12px",borderRadius:12,border:"1px solid #e7e5e4",background:"#fff",cursor:"pointer"}}>
<span style={{fontSize:20}}>💾</span>
<div style={{textAlign:"left"}}><div style={{fontSize:13,fontWeight:700,color:"#1c1917"}}>Backup</div><div style={_s.sub}>Export JSON</div></div>
</button>
<label style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 12px",borderRadius:12,border:"1px solid #e7e5e4",background:"#fff",cursor:"pointer"}}>
<span style={{fontSize:20}}>📂</span>
<div style={{textAlign:"left"}}><div style={{fontSize:13,fontWeight:700,color:"#1c1917"}}>Restore</div><div style={_s.sub}>Import JSON</div></div>
<input type="file" accept=".json" style={{display:"none"}} onChange={e=>{if(e.target.files[0]){importBackup(e.target.files[0]);setShowMoreMenu(false);}e.target.value="";}}/>
</label>
</div>
</div>
</div>}

{/* DRIVER MODAL */}
{showDM&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:380}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{margin:0,fontSize:18,fontWeight:700}}>Manage Drivers</h3><button onClick={()=>{if(editDrv&&editNm.trim()){driverChangeSource.current="user";dirtyDriversRef.current=true;setDrivers(p=>p.map(d=>d.id===editDrv?{...d,name:editNm.trim(),phone:editPh.trim()}:d));}setShowDM(false);setEditDrv(null);}} style={_s.iconBtn}>✕</button></div>
{drivers.map((d,i)=><div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f5f5f4"}}>
<div style={{width:12,height:12,borderRadius:4,background:DCOL[i]||"#78716c"}}/>
{editDrv===d.id?<div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
<input value={editNm} onChange={e=>setEditNm(e.target.value)} autoFocus placeholder="Name" onBlur={()=>{setTimeout(()=>{if(editNm.trim())saveDrv(d.id);},200);}} style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:14,outline:"none"}}/>
<div style={_s.flexG6}><input value={editPh} onChange={e=>setEditPh(e.target.value)} placeholder="Phone" onKeyDown={e=>e.key==="Enter"&&saveDrv(d.id)} onBlur={()=>{setTimeout(()=>saveDrv(d.id),100);}} style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"6px 10px",fontSize:13,outline:"none"}}/><button onClick={()=>saveDrv(d.id)} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>Save</button></div>
</div>:<>
<div style={_s.f1}><div style={{fontSize:15,fontWeight:600}}>{d.name}</div>{d.phone&&<div style={_s.sub11}>{d.phone}</div>}</div>
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
{<div style={{marginTop:12}}><div style={{display:"flex",gap:6,marginBottom:6}}><input value={newDN} onChange={e=>setNewDN(e.target.value)} placeholder="Driver name" style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:14,outline:"none"}}/></div><div style={_s.flexG6}><input value={newDP} onChange={e=>setNewDP(e.target.value)} placeholder="Phone number" type="tel" onKeyDown={e=>e.key==="Enter"&&addDrvr()} style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:14,outline:"none"}}/><button onClick={addDrvr} style={{background:(!newDN.trim()||!newDP.trim())?"#e7e5e4":"#1c1917",color:(!newDN.trim()||!newDP.trim())?"#a8a29e":"#fff",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:600}}>Add</button></div>{newDN.trim()&&!newDP.trim()&&<p style={{fontSize:11,color:"#dc2626",margin:"4px 0 0"}}>Phone required</p>}</div>}
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
<div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><h3 style={{margin:0,fontSize:18,fontWeight:700}}>Insert Pickup</h3><button onClick={()=>setInsertPickupFor(null)} style={_s.iconBtn}>✕</button></div>
<p style={{fontSize:12,color:"#78716c",margin:"0 0 10px"}}>Tap a customer to auto-fill, or use manual entry.</p>
<div style={{maxHeight:180,overflowY:"auto",marginBottom:12,border:"1px solid #e7e5e4",borderRadius:12,padding:4}}>
{PICKUP_SOURCES.map((src,i)=><button key={i} onClick={()=>handleSelect(src)} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 12px",marginBottom:2,borderRadius:8,cursor:"pointer",background:pickupStop===src.label?"#eff6ff":"#fafaf9",border:pickupStop===src.label?"2px solid #2563eb":"1px solid transparent"}}><div style={{fontSize:13,fontWeight:600}}>{src.label}</div><div style={{fontSize:10,color:"#a8a29e"}}>{src.addr}</div></button>)}
</div>
<details style={{marginBottom:12}}><summary style={{fontSize:13,fontWeight:600,color:"#2563eb",cursor:"pointer",padding:"4px 0"}}>Manual Entry</summary><div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}><input value={pickupCustomer} onChange={e=>setPickupCustomer(e.target.value)} placeholder="Customer" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/><input value={pickupStop} onChange={e=>setPickupStop(e.target.value)} placeholder="Location" style={{border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/><AddressInput value={pickupAddr} onChange={v=>setPickupAddr(v)} placeholder="Address"/></div></details>
{pickupStop&&(()=>{
const custData=CUSTOMERS[pickupCustomer];
const custDels=custData?.deliveries?custData.deliveries.map(d=>typeof d==="string"?d:d.s).sort():null;
return(<div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:6}}>Picking up for</label>
{custDels?<>
<div style={{maxHeight:160,overflowY:"auto",border:"1px solid #e7e5e4",borderRadius:10,padding:4,marginBottom:8}}>
{custDels.filter(s=>!s.startsWith("Transfer")).map(s=><button key={s} onClick={()=>setPickupForDel(pickupForDel===s?"":s)} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 10px",marginBottom:1,borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600,background:pickupForDel===s?"#16a34a":"#fff",color:pickupForDel===s?"#fff":"#1c1917",border:pickupForDel===s?"1px solid #15803d":"1px solid transparent"}}>{s}</button>)}
</div>
</>:<>
<div style={{fontSize:10,fontWeight:600,color:"#d97706",marginBottom:4}}>Multi-customer stops</div>
<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{SHARED_STOPS.map(s=><button key={s} onClick={()=>setPickupForDel(s)} style={{padding:"5px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:pickupForDel===s?"#16a34a":"#fef3c7",color:pickupForDel===s?"#fff":"#92400e"}}>{s.split(" - ")[0]}</button>)}</div>
<details style={{marginBottom:8}}><summary style={{fontSize:11,fontWeight:600,color:"#57534e",cursor:"pointer"}}>All other ({remaining.length})</summary><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6,maxHeight:120,overflowY:"auto"}}>{remaining.map(s=><button key={s} onClick={()=>setPickupForDel(s)} style={{padding:"4px 8px",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,fontWeight:600,background:pickupForDel===s?"#16a34a":"#e7e5e4",color:pickupForDel===s?"#fff":"#57534e"}}>{s}</button>)}</div></details>
</>}
<input value={pickupForDel} onChange={e=>setPickupForDel(e.target.value)} placeholder="Custom / type manually..." style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/>
</div>);})()}
{pickupStop&&<input value={pickupNote} onChange={e=>setPickupNote(e.target.value)} placeholder="Note (optional)" style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",marginBottom:12}}/>}
{pickupStop&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:12}}><div style={{fontSize:11,color:"#2563eb",fontWeight:600}}>PICKUP</div><div style={_s.bold14}>{pickupCustomer||"Pickup"}{pickupForDel?` → ${pickupForDel}`:""}</div>{pickupAddr&&<div style={_s.sub11}>{pickupAddr}</div>}</div>}
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
<div style={_s.flexBtwMb16}>
<div style={_s.flexC8}>
<div style={{width:28,height:28,borderRadius:8,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:700}}>{drv?.name?.charAt(0)}</div>
<div><h3 style={{margin:0,fontSize:16,fontWeight:700}}>Notify {drv?.name}</h3>
<div style={_s.sub}>{drv?.phone||"No phone"} • via SMS{drv?.phone?"":" (unavailable)"}</div></div>
</div>
<button onClick={()=>setNotifyDriver(null)} style={_s.iconBtn}>✕</button>
</div>

{/* Quick presets */}
<div style={{fontSize:11,fontWeight:700,color:"#57534e",marginBottom:8,textTransform:"uppercase"}}>Quick Messages</div>
<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>

<button onClick={()=>sendNotification(notifyDriver,"🔄 RETURN TO YARD\nHead back to base when current stop is complete.","return")}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"2px solid #dc2626",background:"#fef2f2",cursor:"pointer"}}>
<span style={{fontSize:20}}>🔄</span>
<div><div style={{fontSize:13,fontWeight:700,color:"#dc2626"}}>Return to Yard</div><div style={_s.sub}>Head back to base</div></div>
</button>

<button onClick={()=>sendNotification(notifyDriver,"📞 CALL DISPATCH\nCall dispatch ASAP.","call")}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"1px solid #e7e5e4",background:"#fafaf9",cursor:"pointer"}}>
<span style={{fontSize:20}}>📞</span>
<div><div style={{fontSize:13,fontWeight:700}}>Call Dispatch</div><div style={_s.sub}>Driver needs to call in</div></div>
</button>

<button onClick={()=>sendNotification(notifyDriver,"⏰ SCHEDULE CHANGE\nCheck your manifest — stop times have been updated.","schedule")}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"1px solid #e7e5e4",background:"#fafaf9",cursor:"pointer"}}>
<span style={{fontSize:20}}>⏰</span>
<div><div style={{fontSize:13,fontWeight:700}}>Schedule Change</div><div style={_s.sub}>Stop times updated</div></div>
</button>

<button onClick={()=>sendNotification(notifyDriver,"⚠️ MANIFEST UPDATED\nYour route has been changed. Check your manifest for updates.\n\nCurrent stops: "+de.length,"update")}
style={{display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:10,border:"1px solid #e7e5e4",background:"#fafaf9",cursor:"pointer"}}>
<span style={{fontSize:20}}>⚠️</span>
<div><div style={{fontSize:13,fontWeight:700}}>Manifest Updated</div><div style={_s.sub}>General route change alert</div></div>
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
<div style={_s.f1m}>
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
<div style={_s.f1m}>
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
<div style={_s.flexG6}>
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

{}
{view==="manifest"&&<div
onDragEnd={()=>{setDragSrc(null);setDragOver(null);}}>
<div style={{padding:"16px 4px 8px"}}><h2 style={{margin:0,fontSize:16,fontWeight:600}}>Load Manifests — {wd[sd].name}</h2><p style={{margin:"4px 0 0",fontSize:12,color:"#78716c"}}>Use ▲▼ to reorder. Tap driver initials to reassign.</p></div>
{dispNotes[emDk]&&<div onClick={()=>{setView("daily");setEditingNote(true);setNoteText(dispNotes[emDk]);}} style={{background:"#faf5ff",border:"1px solid #d8b4fe",borderRadius:10,padding:"8px 12px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"flex-start",gap:6}}>
<span style={{fontSize:12,flexShrink:0}}>📝</span>
<div style={_s.f1}><div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textTransform:"uppercase"}}>Day Notes</div><div style={{fontSize:12,color:"#57534e",whiteSpace:"pre-wrap",lineHeight:1.3}}>{dispNotes[emDk].length>120?dispNotes[emDk].slice(0,120)+"…":dispNotes[emDk]}</div></div>
</div>}
{drivers.map((drv,di)=>{const de=drvEntries(drv.id);const isDrvDropTarget=dragSrc&&dragSrc.drvId!==drv.id&&dragOver?.drvId===drv.id;return(
<div key={drv.id}
onDragOver={e=>{e.preventDefault();if(dragSrc&&dragSrc.drvId!==drv.id&&!de.length)setDragOver({drvId:drv.id,idx:0});}}
onDrop={()=>{if(dragSrc&&!de.length)handleDrop(drv.id,0);}}
style={{background:isDrvDropTarget&&!de.length?"#dcfce7":"#fff",border:isDrvDropTarget&&!de.length?`2px solid ${DCOL[di]}`:"1px solid #e7e5e4",borderRadius:14,padding:16,marginBottom:12,transition:"background 0.15s"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:de.length?8:0}}><div style={{width:14,height:14,borderRadius:4,background:DCOL[di]}}/><span style={{fontSize:15,fontWeight:700}}>{drv.name}</span><span style={{fontSize:12,color:"#a8a29e"}}>({de.length})</span>{de.length>0&&<span style={{fontSize:10,color:"#78716c",fontVariantNumeric:"tabular-nums"}}>~{getDriverMiles(drv.id)}mi</span>}</div>
<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
{de.length>0&&<button onClick={()=>printManifest(drv.id)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#57534e"}}>Print</button>}
{de.length>0&&<button onClick={()=>textManifest(drv.id)} style={{background:"#dbeafe",border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#2563eb"}}>Text</button>}
<button onClick={()=>{setNotifyDriver(drv.id);setNotifyCustomMsg("");}} style={{background:"#fef3c7",border:"1px solid #fde68a",borderRadius:6,padding:"5px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#92400e"}}>Notify</button>
{de.length>=2&&<div style={{position:"relative"}}>
<button onClick={()=>setSortMenuDrv(sortMenuDrv===drv.id?null:drv.id)} style={{background:"linear-gradient(135deg,#2563eb,#1d4ed8)",border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",fontSize:10,fontWeight:700,color:"#fff"}}>⚡ Route ▾</button>
{sortMenuDrv===drv.id&&<><div style={{position:"fixed",inset:0,zIndex:199}} onClick={()=>setSortMenuDrv(null)}/>
<div style={{position:"absolute",top:"100%",right:0,zIndex:200,background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:6,marginTop:4,boxShadow:"0 12px 40px rgba(0,0,0,0.2)",width:220}}>
<div style={{fontSize:12,fontWeight:700,color:DCOL[di],padding:"6px 10px",borderBottom:"1px solid #f5f5f4",marginBottom:4}}>{drv.name} — Route Order</div>
{SORT_OPTIONS.map((opt,oi)=><button key={oi} onClick={()=>opt.fn(drv.id)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",textAlign:"left",background:"none",border:"none",padding:"10px 10px",cursor:"pointer",borderRadius:8,fontSize:12,fontWeight:600,color:"#1c1917"}} onMouseEnter={e=>{e.currentTarget.style.background="#eff6ff";}} onMouseLeave={e=>{e.currentTarget.style.background="none";}}>
<span style={{fontSize:16}}>{opt.icon}</span><div><div>{opt.label}</div><div style={{fontSize:9,color:"#a8a29e",fontWeight:400}}>{opt.desc}</div></div>
</button>)}
</div></>}
</div>}
<button onClick={()=>setDriverViewId(drv.id)} style={{background:"#f3e8f9",border:"1px solid #d8b4fe",borderRadius:6,padding:"5px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#7c3aed"}}>View</button>
<button onClick={()=>setInsertPickupFor({driverId:drv.id,afterIdx:-1})} style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:6,padding:"5px 8px",cursor:"pointer",fontSize:10,color:"#2563eb",fontWeight:600}}>+PU</button>
{/* ⋯ More menu */}
<div style={{position:"relative"}}>
<button onClick={()=>setSortMenuDrv(sortMenuDrv===("more2-"+drv.id)?null:"more2-"+drv.id)} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:6,padding:"5px 8px",cursor:"pointer",fontSize:10,color:"#57534e",fontWeight:600}}>⋯</button>
{sortMenuDrv===("more2-"+drv.id)&&<><div style={{position:"fixed",inset:0,zIndex:199}} onClick={()=>setSortMenuDrv(null)}/>
<div style={{position:"absolute",top:"100%",right:0,zIndex:200,background:"#fff",border:"1px solid #e7e5e4",borderRadius:12,padding:6,marginTop:4,boxShadow:"0 12px 40px rgba(0,0,0,0.2)",width:180}}>
<div style={{fontSize:11,fontWeight:700,color:DCOL[di],padding:"6px 10px",borderBottom:"1px solid #f5f5f4",marginBottom:4}}>{drv.name}</div>
{getDriverLoadOptions(drv.id)<3&&<button onClick={()=>{addDriverLoad(drv.id);setSortMenuDrv(null);}} style={_s.menuBtn}>
<span style={{fontSize:14}}>🚚</span><span>Add Load {getDriverLoadOptions(drv.id)+1}</span>
</button>}
<button onClick={()=>{toggleDriverCapacity(drv.id);setSortMenuDrv(null);}} style={_s.menuBtn}>
<span style={{fontSize:14}}>{getDriverCapacity(drv.id)===TRUCK_LIMITS.heavy?"🚚":"🚛"}</span><span>{getDriverCapacity(drv.id)===TRUCK_LIMITS.heavy?"Switch to 10k":"Switch to 13.5k"}</span>
</button>
</div></>}
</div>
<button onClick={()=>{setPreAssignDriver(drv.id);setView("add");setSelCust(null);setSelStop(null);setQuoteMode(null);}} style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:6,padding:"5px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"#16a34a"}}>+ Add</button>
</div>
{de.length===0&&<p style={{fontSize:13,color:dragSrc?"#16a34a":"#a8a29e",margin:"8px 0 0",fontWeight:dragSrc?600:400}}>{dragSrc?"Drop here to assign":"No stops"}</p>}
{de.length>0&&(()=>{const cap=getDriverCapacity(drv.id);const loads=getDriverLoads(drv.id);return(<>
{loads.map(loadN=>{const w=getLoadWeight(drv.id,loadN);const pct=weightPct(w,cap);const col=weightColor(w,cap);const over=w>cap;return w>0||loads.length>1?(<div key={loadN} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",marginBottom:2}}>
<span style={{fontSize:12,fontWeight:700,color:"#78716c",flexShrink:0}}>Load {loadN}</span>
<div style={{flex:1,height:8,background:"#e7e5e4",borderRadius:4,overflow:"hidden"}}>
<div style={{height:"100%",width:pct+"%",background:col,borderRadius:4,transition:"width 0.3s"}}/>
</div>
<span style={{fontSize:13,fontWeight:700,color:col,fontVariantNumeric:"tabular-nums",flexShrink:0}}>{w.toLocaleString()}<span style={{fontSize:11,color:"#a8a29e"}}>/{(cap/1000).toFixed(0)}k</span></span>
{over&&<span style={{fontSize:8,background:"#dc2626",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:700}}>OVER</span>}
</div>):null;})}
<button onClick={()=>toggleDriverCapacity(drv.id)} style={{fontSize:9,color:cap===TRUCK_LIMITS.heavy?"#d97706":"#78716c",background:cap===TRUCK_LIMITS.heavy?"#fef3c7":"#f5f5f4",border:cap===TRUCK_LIMITS.heavy?"1px solid #fde68a":"1px solid #e7e5e4",borderRadius:6,padding:"2px 8px",cursor:"pointer",fontWeight:600,marginBottom:4}}>
{cap===TRUCK_LIMITS.heavy?"🚛 13.5k Truck":"🚚 10k → tap for 13.5k"}
</button>
</>);})()}
{(()=>{
/* Group stops by load number and render with separators — mobile manifest */
const maxLoadNum=Math.max(...de.map(e=>e.loadNum||1),1);
const hasMultiLoads=maxLoadNum>1||getDriverLoadOptions(drv.id)>1;
const loadGroups=[];
for(let ln=1;ln<=Math.max(maxLoadNum,getDriverLoadOptions(drv.id));ln++){
  const loadStops=de.filter(e=>(e.loadNum||1)===ln);
  if(loadStops.length>0||hasMultiLoads)loadGroups.push({loadNum:ln,stops:loadStops});
}
return loadGroups.map(({loadNum:ln,stops:loadStops})=>(<div key={"mload-"+ln}>
{hasMultiLoads&&<div style={{display:"flex",alignItems:"center",gap:8,margin:"8px 0 4px",padding:"0 4px"}}>
<div style={{flex:1,height:2,background:ln===1?"#2563eb":ln===2?"#d97706":"#7c3aed",borderRadius:1,opacity:0.4}}/>
<span style={{fontSize:10,fontWeight:800,color:ln===1?"#2563eb":ln===2?"#d97706":"#7c3aed",letterSpacing:"0.05em"}}>LOAD {ln}</span>
<div style={{flex:1,height:2,background:ln===1?"#2563eb":ln===2?"#d97706":"#7c3aed",borderRadius:1,opacity:0.4}}/>
</div>}
{loadStops.length===0&&hasMultiLoads&&<div style={{padding:"12px 10px",textAlign:"center",fontSize:11,color:"#a8a29e",background:"#fafaf9",border:"2px dashed #e7e5e4",borderRadius:8,marginBottom:4}}>No stops on Load {ln}</div>}
{loadStops.map((entry)=>{
const eIdx=de.indexOf(entry);
return(<div key={entry.id}>
<ManifestStop entry={entry} eIdx={eIdx} total={de.length} drivers={drivers} onMove={dir=>moveInDriver(drv.id,eIdx,dir)} onReassign={did=>reassign(entry.id,did)} onRemove={()=>rmFromDriver(entry.id)} onDelete={()=>deleteDel(entry.id)} onUpdateInstructions={text=>updateInstructions(entry.id,text)} onShipPlan={val=>setShipPlan(entry.id,val)} onDueBy={time=>setDueBy(entry.id,time)} onWeight={w=>setWeight(entry.id,w)} onLoadNum={n=>setLoadNum(entry.id,n)} onRate={r=>updateRate(entry.id,r)} maxLoad={getMaxLoad(drv.id)}
onLiftgate={()=>{if(entry.isHourly){setEmH(p=>{const key=`${emDk}-emser`;const cur=p[key]||4;return{...p,[key]:cur+1};});setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===entry.id?{...e,liftgateApplied:true}:e)}));showToast("Liftgate +1 hr added");}else{manualLiftgate(entry.id);}}} onSplit={()=>setSplitEntry({id:entry.id,totalWeight:entry.weight||0,ratio:50,truck1Weight:Math.round((entry.weight||0)/2)})} driverLoadCounts={Object.fromEntries(drivers.map(d=>[d.id,getDriverLoadOptions(d.id)]))}
isDragging={dragSrc?.drvId===drv.id&&dragSrc?.idx===eIdx} isDragOver={dragOver?.drvId===drv.id&&dragOver?.idx===eIdx} onDragStart={()=>setDragSrc({drvId:drv.id,idx:eIdx})} onDragOver={()=>setDragOver({drvId:drv.id,idx:eIdx})} onDrop={()=>handleDrop(drv.id,eIdx)}/>
{splitEntry?.id===entry.id&&<div style={{margin:"0 0 4px",background:"#eff6ff",border:"2px solid #2563eb",borderRadius:10,padding:12}}>
<div style={_s.splitTitle}>✂ Split Shipment</div>
{(()=>{const tw=splitEntry.totalWeight||0;const t1w=splitEntry.truck1Weight!==undefined?splitEntry.truck1Weight:Math.round(tw*(splitEntry.ratio/100));const t2w=tw-t1w;return(<>
<div style={_s.flexG6Mb6}>
<div style={_s.f1}><label style={_s.labelSm}>Total</label><input type="number" inputMode="numeric" value={tw||""} onChange={e=>{const newTw=parseInt(e.target.value)||0;setSplitEntry(p=>({...p,totalWeight:newTw,truck1Weight:Math.min(p.truck1Weight||Math.round(newTw/2),newTw)}));}} style={_s.splitTotal}/></div>
<div style={_s.f1}><label style={_s.labelBlue}>Truck 1</label><input type="number" inputMode="numeric" value={splitEntry.truck1Weight!==undefined?splitEntry.truck1Weight:""} onChange={e=>{const v=e.target.value;setSplitEntry(p=>({...p,truck1Weight:v===""?0:parseInt(v)||0}));}} style={_s.splitInput}/></div>
<div style={_s.f1}><label style={_s.labelGray}>Truck 2</label><div style={_s.splitT2}>{t2w.toLocaleString()}</div></div>
</div>
<input type="range" min={0} max={tw} step={100} value={t1w} onChange={e=>{const v=parseInt(e.target.value)||0;setSplitEntry(p=>({...p,truck1Weight:v}));}} style={_s.slider}/>
</>);})()}
<div style={_s.flexG6}>
<button onClick={()=>confirmSplit(entry.id,splitEntry.totalWeight,splitEntry.ratio,splitEntry.truck1Weight)} style={_s.splitBtn}>✂ Split</button>
<button onClick={()=>setSplitEntry(null)} style={_s.cancelBtn}>Cancel</button>
</div>
</div>}
<button onClick={()=>setInsertPickupFor({driverId:drv.id,afterIdx:eIdx})} style={{display:"block",width:"100%",background:"none",border:"1px dashed #bfdbfe",borderRadius:6,padding:"3px",cursor:"pointer",fontSize:10,color:"#93c5fd",marginBottom:4,textAlign:"center"}}>+ insert pickup here</button>
</div>);})}
</div>));
})()}
</div>);})}
{(()=>{const ua=dl.filter(e=>e.driverId===0);if(!ua.length&&!dragSrc)return null;return(<div
onDragOver={e=>{e.preventDefault();if(!ua.length)setDragOver({drvId:0,idx:0});}}
onDrop={()=>{if(dragSrc){handleDrop(0,ua.length);}}}
style={{background:dragOver?.drvId===0?"#dcfce7":"#fff",border:dragOver?.drvId===0?"2px dashed #16a34a":"2px dashed #d6d3d1",borderRadius:14,padding:16,marginBottom:12,transition:"background 0.15s"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:ua.length?10:0}}><div style={{width:14,height:14,borderRadius:4,background:"#a8a29e"}}/><span style={{fontSize:15,fontWeight:700,color:"#78716c"}}>Unassigned</span><span style={{fontSize:12,color:"#a8a29e"}}>({ua.length})</span></div>
{ua.map((entry,eIdx)=><div key={entry.id}><ManifestStop entry={entry} eIdx={eIdx} total={ua.length} drivers={drivers} onMove={dir=>moveInDriver(0,eIdx,dir)} onReassign={did=>reassign(entry.id,did)} onRemove={()=>deleteDel(entry.id)} onDelete={()=>deleteDel(entry.id)} onUpdateInstructions={text=>updateInstructions(entry.id,text)} onShipPlan={val=>setShipPlan(entry.id,val)} onDueBy={time=>setDueBy(entry.id,time)} onWeight={w=>setWeight(entry.id,w)} onLoadNum={n=>setLoadNum(entry.id,n)} onRate={r=>updateRate(entry.id,r)} maxLoad={1}
onLiftgate={()=>{if(entry.isHourly){setEmH(p=>{const key=`${emDk}-emser`;const cur=p[key]||4;return{...p,[key]:cur+1};});setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===entry.id?{...e,liftgateApplied:true}:e)}));showToast("Liftgate +1 hr added");}else{manualLiftgate(entry.id);}}} onSplit={()=>setSplitEntry({id:entry.id,totalWeight:entry.weight||0,ratio:50,truck1Weight:Math.round((entry.weight||0)/2)})} driverLoadCounts={Object.fromEntries(drivers.map(d=>[d.id,getDriverLoadOptions(d.id)]))}
isDragging={dragSrc?.drvId===0&&dragSrc?.idx===eIdx} isDragOver={dragOver?.drvId===0&&dragOver?.idx===eIdx} onDragStart={()=>setDragSrc({drvId:0,idx:eIdx})} onDragOver={()=>setDragOver({drvId:0,idx:eIdx})} onDrop={()=>handleDrop(0,eIdx)}/>
{splitEntry?.id===entry.id&&<div style={{margin:"0 0 4px",background:"#eff6ff",border:"2px solid #2563eb",borderRadius:10,padding:12}}>
<div style={_s.splitTitle}>✂ Split Shipment</div>
{(()=>{const tw=splitEntry.totalWeight||0;const t1w=splitEntry.truck1Weight!==undefined?splitEntry.truck1Weight:Math.round(tw*(splitEntry.ratio/100));const t2w=tw-t1w;return(<>
<div style={_s.flexG6Mb6}>
<div style={_s.f1}><label style={_s.labelSm}>Total</label><input type="number" inputMode="numeric" value={tw||""} onChange={e=>{const newTw=parseInt(e.target.value)||0;setSplitEntry(p=>({...p,totalWeight:newTw,truck1Weight:Math.min(p.truck1Weight||Math.round(newTw/2),newTw)}));}} style={_s.splitTotal}/></div>
<div style={_s.f1}><label style={_s.labelBlue}>Truck 1</label><input type="number" inputMode="numeric" value={splitEntry.truck1Weight!==undefined?splitEntry.truck1Weight:""} onChange={e=>{const v=e.target.value;setSplitEntry(p=>({...p,truck1Weight:v===""?0:parseInt(v)||0}));}} style={_s.splitInput}/></div>
<div style={_s.f1}><label style={_s.labelGray}>Truck 2</label><div style={_s.splitT2}>{t2w.toLocaleString()}</div></div>
</div>
<input type="range" min={0} max={tw} step={100} value={t1w} onChange={e=>{const v=parseInt(e.target.value)||0;setSplitEntry(p=>({...p,truck1Weight:v}));}} style={_s.slider}/>
</>);})()}
<div style={_s.flexG6}>
<button onClick={()=>confirmSplit(entry.id,splitEntry.totalWeight,splitEntry.ratio,splitEntry.truck1Weight)} style={_s.splitBtn}>✂ Split</button>
<button onClick={()=>setSplitEntry(null)} style={_s.cancelBtn}>Cancel</button>
</div>
</div>}
</div>)}
{!ua.length&&dragSrc&&<div style={{padding:"20px",textAlign:"center",color:"#16a34a",fontSize:13,fontWeight:600}}>Drop here to unassign</div>}
</div>);})()}
{/* Sort menu overlay for mobile */}
{sortMenuDrv&&typeof sortMenuDrv==="number"&&<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.4)"}} onClick={()=>setSortMenuDrv(null)}>
<div onClick={e=>e.stopPropagation()} style={{position:"absolute",bottom:0,left:0,right:0,background:"#fff",borderRadius:"20px 20px 0 0",padding:"16px 16px 32px",boxShadow:"0 -8px 40px rgba(0,0,0,0.15)"}}>
<div style={{width:40,height:4,borderRadius:2,background:"#d6d3d1",margin:"0 auto 14px"}}/>
<div style={{fontSize:15,fontWeight:700,color:"#1c1917",marginBottom:12}}>⚡ Route Order — {drivers.find(d=>d.id===sortMenuDrv)?.name}</div>
{SORT_OPTIONS.map((opt,oi)=><button key={oi} onClick={()=>opt.fn(sortMenuDrv)}
style={{display:"flex",alignItems:"center",gap:12,width:"100%",textAlign:"left",background:"none",border:"none",padding:"14px 12px",cursor:"pointer",borderRadius:12,fontSize:14,fontWeight:600,color:"#1c1917",borderBottom:oi<4?"1px solid #f5f5f4":"none"}}>
<span style={{fontSize:22,width:32,textAlign:"center",flexShrink:0}}>{opt.icon}</span>
<div><div style={{fontSize:14}}>{opt.label}</div><div style={{fontSize:11,color:"#a8a29e",fontWeight:400,marginTop:2}}>{opt.desc}</div></div>
</button>)}
</div>
</div>}
</div>}

{}
{view==="routes"&&<div>
{dl.length===0?<div style={_s.emptyState}><div style={{fontSize:48,marginBottom:12}}>🗺️</div><p style={{fontSize:16,fontWeight:600,margin:"0 0 8px"}}>No stops to route</p><p style={{fontSize:13,margin:0}}>Add deliveries first via the + Add tab,<br/>then come here to build routes on the map.</p></div>
:<RouteBuilder entries={dl} drivers={drivers}
onAssign={(eid,did)=>reassign(eid,did)}
onAssignBulk={(eids,did)=>reassignBulk(eids,did)}
onReorder={(drvId,orderedIds)=>reorderDriver(drvId,orderedIds)}
onBack={()=>setView("manifest")}
driverLocs={driverLocs}
getDriverCapacity={getDriverCapacity}/>}
</div>}

{}
{view==="daily"&&<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 4px 8px"}}><h2 style={{margin:0,fontSize:16,fontWeight:600}}>{wd[sd].name} — {wd[sd].date}</h2><div style={_s.flexC8}>{dl.length>0&&<button onClick={printDailyLog} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600,color:"#57534e"}}>Print</button>}<span style={{fontVariantNumeric:"tabular-nums",fontSize:15,fontWeight:700,color:"#16a34a"}}>{fmt(dc.total)}</span></div></div>
{!editingNote?<div onClick={()=>{setEditingNote(true);setNoteText(dispNotes[emDk]||"");}} style={{background:"#fff",border:dispNotes[emDk]?"2px solid #7c3aed":"1px solid #e7e5e4",borderRadius:12,padding:"10px 14px",marginBottom:12,cursor:"pointer",minHeight:28,display:"flex",alignItems:"flex-start",gap:8}}>
<span style={{fontSize:14,flexShrink:0}}>{"📝"}</span>
{dispNotes[emDk]?<div style={_s.f1}><div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",marginBottom:2}}>Dispatcher Notes</div><div style={{fontSize:13,color:"#1c1917",whiteSpace:"pre-wrap",lineHeight:1.4}}>{dispNotes[emDk]}</div></div>
:<div style={{fontSize:12,color:"#a8a29e",paddingTop:2}}>Tap to add dispatcher notes for this day</div>}
</div>
:<div style={{background:"#fff",border:"2px solid #7c3aed",borderRadius:12,padding:"10px 14px",marginBottom:12}}>
<div style={{fontSize:11,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",marginBottom:6}}>Dispatcher Notes</div>
<textarea value={noteText} onChange={e=>setNoteText(e.target.value)} autoFocus placeholder="Route changes, special instructions, notes for the day…" rows={3}
style={{width:"100%",border:"1px solid #d8b4fe",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit",background:"#faf5ff"}}/>
<div style={{display:"flex",gap:6,marginTop:6,justifyContent:"flex-end"}}>
{dispNotes[emDk]&&<button onClick={()=>{setDispNotes(p=>{const n={...p};delete n[emDk];return n;});setEditingNote(false);setNoteText("");}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear</button>}
<button onClick={()=>setEditingNote(false)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Cancel</button>
<button onClick={()=>{setDispNotes(p=>({...p,[emDk]:noteText.trim()}));setEditingNote(false);showToast("Notes saved");}} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:600}}>Save</button>
</div>
</div>}
{dl.some(e=>e.isHourly)&&(()=>{
const{byDriver,totalMins}=getShiftSummary(emDk);
const hasShifts=totalMins>0;
const lgCount=dl.filter(e=>e.isHourly&&e.liftgateApplied).length;
const distBonusMob=dl.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length;
const lgMins=lgCount*60;
const distMins=distBonusMob*60;
const billedMins=totalMins+lgMins+distMins;
const hrs=hasShifts?Math.round(billedMins/15)*15/60:(emH[`${emDk}-emser`]||4);
/* Sync emH with shift+LG total */
/* emH synced via useEffect */
return(<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:"12px 16px",marginBottom:12}}>
<div style={_s.flexBtwMb8}>
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
<span style={{fontSize:13,fontWeight:800,color:"#1d4ed8"}}>{formatMins(billedMins)}</span>
</div>
</div>
<div style={{fontSize:11,color:"#64748b"}}>{formatMins(totalMins)} shifts{lgCount>0?` + ${lgCount}h liftgate`:""}{distBonusMob>0?` + ${distBonusMob}h distance`:""} = {hrs}h billed × $102.50</div>
</>):(<>
<div style={_s.flexBtw}><span style={{fontSize:12,color:"#64748b"}}>{hrs}h × $102.50</span>
<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
{[4,5,6,7,8,9,10].map(h=><button key={h} onClick={()=>{setEmH(p=>({...p,[`${emDk}-emser`]:h}));setShowCustomHrs(false);}} style={{width:30,height:30,borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:!showCustomHrs&&hrs===h?"#2563eb":"#e7e5e4",color:!showCustomHrs&&hrs===h?"#fff":"#78716c"}}>{h}</button>)}
<button onClick={()=>setShowCustomHrs(!showCustomHrs)} style={{height:30,borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,padding:"0 8px",background:showCustomHrs?"#2563eb":"#dbeafe",color:showCustomHrs?"#fff":"#2563eb"}}>Other</button>
</div></div>
{showCustomHrs&&<div style={{display:"flex",gap:6,alignItems:"center",marginTop:8}}><input value={customHrsInput} onChange={e=>setCustomHrsInput(e.target.value)} placeholder="e.g. 4.5" type="number" inputMode="decimal" step="0.25" min="1" style={{width:80,border:"1px solid #bfdbfe",borderRadius:8,padding:"6px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center",background:"#fff"}}/><span style={{fontSize:12,color:"#64748b"}}>hrs</span><button onClick={()=>{const v=parseFloat(customHrsInput);if(v>0){setEmH(p=>({...p,[`${emDk}-emser`]:v}));setShowCustomHrs(false);setCustomHrsInput("");}}} style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Set</button></div>}
<div style={{fontSize:11,color:"#64748b",marginTop:6}}>💡 Log shifts in History → ⏱ Emser Hours for auto-calculation</div>
</>)}
</div>);
})()}
{dl.length===0?<div style={_s.emptyState}><div style={{fontSize:36,marginBottom:12}}>🚚</div><p style={{fontSize:14,margin:0}}>No deliveries logged</p></div>:<>
{(()=>{const dels=dl.filter(e=>e.stopType!=="pickup");const groups={};dels.forEach(e=>{if(!groups[e.customer])groups[e.customer]=[];groups[e.customer].push(e);});return Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0])).map(([cust,custEntries])=>{const c=getCustColor(cust);const custBase=custEntries.reduce((s,e)=>s+e.baseRate+(e.knownLiftgate?(e.liftgateFee||75):0),0);return(<div key={cust} style={{marginBottom:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 12px",background:c.accent+"11",borderRadius:"10px 10px 0 0",borderBottom:`2px solid ${c.accent}`}}>
<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:3,height:16,borderRadius:2,background:c.accent}}/><span style={{fontSize:12,fontWeight:700,color:c.accent,textTransform:"uppercase"}}>{cust}</span><span style={{fontSize:10,color:"#78716c"}}>({custEntries.length})</span></div>
<span style={{fontSize:13,fontWeight:700,fontVariantNumeric:"tabular-nums",color:c.accent}}>{fmt(custBase)}</span>
</div>
{custEntries.map(entry=>{const drv=drivers.find(d=>d.id===entry.driverId);const di=drivers.findIndex(d=>d.id===entry.driverId);const isImetco=entry.customer==="IMETCO";return(
<div key={entry.id} style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:"12px 16px",marginBottom:8,borderLeft:`4px solid ${entry.priority?"#f59e0b":c.accent}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div style={_s.f1}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
<span style={{fontSize:11,fontWeight:600,color:c.accent,textTransform:"uppercase"}}>{entry.customer}</span>
{entry.priority&&<span style={_s.tag9Amber}>PRIORITY</span>}
{entry.dueBy&&<span style={{fontSize:9,background:entry.dueBy.includes("-")?"#7c3aed":entry.dueBy.startsWith("After")?"#2563eb":"#dc2626",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700,display:"inline-flex",alignItems:"center",gap:2}}>{"\u23F0"} {entry.dueBy}</span>}
<span style={{fontSize:10,background:drv?(DCOL[di]||"#78716c"):"#a8a29e",color:"#fff",padding:"1px 6px",borderRadius:4,fontWeight:600}}>{drv?.name||"Unassigned"}</span>
</div>
<div style={{fontSize:14,fontWeight:600}}>{entry.stop}</div>
{entry.addr&&<div style={{fontSize:11,color:"#78716c",marginTop:1}}>{entry.addr}</div>}
{entry.instructions&&<div style={{fontSize:11,color:"#2563eb",marginTop:2}}>📋 {entry.instructions}</div>}
</div>
<div style={{textAlign:"right",marginLeft:12}}>
<div style={{fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums"}}><InlineRate value={entry.baseRate+(entry.knownLiftgate?(entry.liftgateFee||75):0)} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/></div>
{!entry.liftgateApplied&&!entry.isHourly&&<button onClick={()=>manualLiftgate(entry.id)} style={{background:"#fff7ed",border:"1px solid #fed7aa",color:"#ea580c",fontSize:10,cursor:"pointer",padding:"3px 8px",borderRadius:6,fontWeight:700,marginTop:4,display:"block"}}>+LG $75</button>}
{!entry.liftgateApplied&&entry.isHourly&&<button onClick={()=>{setEmH(p=>{const key=`${emDk}-emser`;const cur=p[key]||4;return{...p,[key]:cur+1};});setLog(p=>({...p,[dk]:(p[dk]||[]).map(e=>e.id===entry.id?{...e,liftgateApplied:true}:e)}));showToast("Liftgate +1 hr added");}} style={{background:"#fff7ed",border:"1px solid #fed7aa",color:"#ea580c",fontSize:10,cursor:"pointer",padding:"3px 8px",borderRadius:6,fontWeight:700,marginTop:4,display:"block"}}>+1HR LG</button>}
{entry.liftgateApplied&&<div style={{fontSize:9,color:"#16a34a",fontWeight:700,marginTop:4}}>{entry.isHourly?"✓ LG +1HR":"✓ LG +$75"}</div>}
{!entry.wasSplit&&<button onClick={()=>setSplitEntry({id:entry.id,totalWeight:entry.weight||0,ratio:50,truck1Weight:Math.round((entry.weight||0)/2)})} style={{background:"#eff6ff",border:"1px solid #bfdbfe",color:"#2563eb",fontSize:9,cursor:"pointer",padding:"3px 8px",borderRadius:6,fontWeight:700,marginTop:4,display:"block"}}>✂ Split</button>}
{entry.weight>0&&<div style={{fontSize:8,color:"#78716c",marginTop:2}}>{entry.weight.toLocaleString()} lbs</div>}
{entry.wasSplit&&<div style={{fontSize:8,color:"#2563eb",fontWeight:700,marginTop:2}}>Load {entry.loadNum}</div>}
<button onClick={()=>deleteDel(entry.id)} style={{background:"none",border:"none",color:"#dc2626",fontSize:9,cursor:"pointer",padding:"0",opacity:0.5,marginTop:10,display:"block"}}>Delete</button>
</div>
</div>
{splitEntry?.id===entry.id&&<div style={{marginTop:8,background:"#eff6ff",border:"2px solid #2563eb",borderRadius:10,padding:14}}>
<div style={{fontSize:13,fontWeight:700,color:"#1e40af",marginBottom:8}}>✂ Split Shipment</div>
{(()=>{const tw=splitEntry.totalWeight||0;const t1w=splitEntry.truck1Weight!==undefined?splitEntry.truck1Weight:Math.round(tw*(splitEntry.ratio/100));const t2w=tw-t1w;return(<>
<div style={_s.flexG6Mb6}>
<div style={_s.f1}><label style={_s.labelSm}>Total</label><input type="number" inputMode="numeric" value={tw||""} onChange={e=>{const newTw=parseInt(e.target.value)||0;setSplitEntry(p=>({...p,totalWeight:newTw,truck1Weight:Math.min(p.truck1Weight||Math.round(newTw/2),newTw)}));}} style={_s.splitTotal}/></div>
<div style={_s.f1}><label style={_s.labelBlue}>Truck 1</label><input type="number" inputMode="numeric" value={splitEntry.truck1Weight!==undefined?splitEntry.truck1Weight:""} onChange={e=>{const v=e.target.value;setSplitEntry(p=>({...p,truck1Weight:v===""?0:parseInt(v)||0}));}} style={_s.splitInput}/></div>
<div style={_s.f1}><label style={_s.labelGray}>Truck 2</label><div style={_s.splitT2}>{t2w.toLocaleString()}</div></div>
</div>
<input type="range" min={0} max={tw} step={100} value={t1w} onChange={e=>{const v=parseInt(e.target.value)||0;setSplitEntry(p=>({...p,truck1Weight:v}));}} style={_s.slider}/>
</>);})()}
<div style={{display:"flex",gap:8}}>
<button onClick={()=>confirmSplit(entry.id,splitEntry.totalWeight,splitEntry.ratio,splitEntry.truck1Weight)} style={{flex:1,background:"#2563eb",color:"#fff",border:"none",borderRadius:8,padding:"10px 16px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>✂ Split</button>
<button onClick={()=>setSplitEntry(null)} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"10px 12px",fontSize:12,cursor:"pointer",color:"#57534e"}}>Cancel</button>
</div>
</div>}
{isImetco&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:11,fontWeight:700,color:"#ea580c",flexShrink:0}}>Ship Plan #:</span>
<input value={entry.shipPlan||""} onChange={e=>setShipPlan(entry.id,e.target.value)} placeholder="Enter #"
style={{flex:1,border:entry.shipPlan?"1px solid #bbf7d0":"1px solid #fca5a5",borderRadius:8,padding:"6px 10px",fontSize:13,fontWeight:700,outline:"none",background:entry.shipPlan?"#f0fdf4":"#fff7ed",textAlign:"center"}}/>
</div>}
</div>);})}
</div>);})})()}
{Object.keys(dc.fBC).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:"14px 16px",marginTop:12}}><div style={_s.loadTitle}>Fuel Surcharges</div>{Object.entries(dc.fBC).map(([cu,cf])=><div key={cu} style={_s.flexBtwP4}><span style={{fontSize:13}}>{cu} <span style={{fontSize:11,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base)} x {Math.round(cf.pct*100)}%</span></span><span style={_s.loadWeight}>{fmt(cf.base*cf.pct)}</span></div>)}</div>}
<div style={{display:"flex",justifyContent:"space-between",padding:"16px 4px 0",borderTop:"2px solid #bbf7d0",marginTop:16}}><span style={{fontSize:15,fontWeight:700,color:"#57534e"}}>Day Total</span><span style={{fontSize:20,fontWeight:700,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(dc.total)}</span></div>
</>}
</div>}

{}
{view==="weekly"&&<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 4px 12px"}}><h2 style={{margin:0,fontSize:16,fontWeight:600}}>Weekly Summary</h2><div style={_s.flexC8}><button onClick={printWeekly} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:600,color:"#57534e"}}>Print</button><span style={{fontVariantNumeric:"tabular-nums",fontSize:18,fontWeight:700,color:"#16a34a"}}>{fmt(wkT)}</span></div></div>
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
<div style={_s.flexC4}><div style={{width:8,height:8,borderRadius:2,background:"#d6d3d1"}}/><span style={{fontSize:9,color:"#a8a29e"}}>Last wk</span></div>
<div style={_s.flexC4}><div style={{width:8,height:8,borderRadius:2,background:"#16a34a"}}/><span style={{fontSize:9,color:"#a8a29e"}}>This wk</span></div>
</div>
</div>
{(()=>{const wkShiftByDrv={};let wkShiftTotal=0;let wkBonusMins=0;DAYS.forEach((_,i)=>{const{byDriver,totalMins}=getShiftSummary(getFbKey(wo,i));wkShiftTotal+=totalMins;const _wkDE=log[`${wo}-${i}`]||[];wkBonusMins+=(_wkDE.filter(e=>e.isHourly&&e.liftgateApplied).length+_wkDE.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length)*60;Object.entries(byDriver).forEach(([did,mins])=>{wkShiftByDrv[did]=(wkShiftByDrv[did]||0)+mins;});});if(!wkShiftTotal)return null;const wkShiftHrs=Math.round((wkShiftTotal+wkBonusMins)/15)*15/60;return(<div style={{background:"#eff6ff",border:"2px solid #2563eb",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
<div style={_s.flexBtwMb8}><span style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>⏱ Emser Week Total</span><span style={{fontSize:20,fontWeight:800,fontVariantNumeric:"tabular-nums",color:"#1d4ed8"}}>{fmt(102.50*wkShiftHrs)}</span></div>
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>
{drivers.map((drv,di)=>{const mins=wkShiftByDrv[drv.id]||0;if(!mins)return null;const initials=drv.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();const hrs=Math.round(mins/15)*15/60;return(<div key={drv.id} style={{display:"flex",alignItems:"center",gap:5,background:"#fff",border:`2px solid ${DCOL[di]}`,borderRadius:8,padding:"4px 10px"}}><div style={{width:20,height:20,borderRadius:5,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700}}>{initials}</div><div><div style={{fontSize:12,fontWeight:700}}>{formatMins(mins)}</div><div style={{fontSize:9,color:"#64748b"}}>{fmt(102.50*hrs)}</div></div></div>);})}
</div>
<div style={{fontSize:11,color:"#1d4ed8",fontWeight:600}}>{formatMins(wkShiftTotal+wkBonusMins)} total · $102.50/hr</div>
</div>);})()}
{DAYS.map((day,i)=>{const{entries,calc}=wkD[i];const wk2=`${wo}-${i}`;const{byDriver:shiftByDrv,totalMins:shiftMins}=getShiftSummary(getFbKey(wo,i));if(!entries.length&&!shiftMins)return null;return(<div key={day} style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",padding:"8px 4px",borderBottom:"1px solid #e7e5e4"}}><span style={_s.bold14}>{day} — {wd[i].date}</span><span style={{fontVariantNumeric:"tabular-nums",fontWeight:700,color:"#16a34a",fontSize:14}}>{fmt(calc.total)}</span></div>
{shiftMins>0&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 8px 5px 14px",borderLeft:"3px solid #2563eb",marginTop:4,background:"#eff6ff",borderRadius:"0 8px 8px 0",flexWrap:"wrap"}}>
<span style={{fontSize:11,color:"#2563eb",fontWeight:700,flexShrink:0}}>⏱ Emser</span>
{drivers.map((drv,di)=>{const mins=shiftByDrv[drv.id]||0;if(!mins)return null;const initials=drv.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();return(<span key={drv.id} style={{fontSize:11,background:DCOL[di],color:"#fff",padding:"1px 6px",borderRadius:4,fontWeight:600}}>{initials} {formatMins(mins)}</span>);})}
<span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:"#1d4ed8",fontVariantNumeric:"tabular-nums"}}>{formatMins(shiftMins)} — {fmt(102.50*Math.round(shiftMins/15)*15/60)}</span>
</div>}
{entries.filter(e=>e.stopType!=="pickup").sort((a,b)=>a.customer.localeCompare(b.customer)).map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di2=drivers.findIndex(d=>d.id===entry.driverId);const isImetco=entry.customer==="IMETCO";return(<div key={entry.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 8px 6px 16px",borderLeft:`3px solid ${c.accent}`,marginTop:4,background:"#fff",borderRadius:isImetco?"0 8px 0 0":"0 8px 8px 0"}}><div style={{display:"flex",alignItems:"center",gap:4,flex:1,minWidth:0}}><span style={{fontSize:11,color:c.accent,fontWeight:600}}>{entry.customer}</span><span style={_s.truncate}>{entry.stop}</span>{drv&&<span style={{fontSize:9,background:DCOL[di2]||"#78716c",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:600,flexShrink:0}}>{drv.name.charAt(0)}</span>}</div><InlineRate value={entry.baseRate+(entry.knownLiftgate?(entry.liftgateFee||75):0)} isHourly={entry.isHourly} onSave={r=>updateRateForDay(entry.id,r,wk2)}/></div>
{isImetco&&<div style={{padding:"4px 8px 6px 16px",borderLeft:`3px solid ${c.accent}`,background:"#fff",borderRadius:"0 0 8px 0",display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:10,fontWeight:700,color:"#ea580c",flexShrink:0}}>SP#:</span>
<input value={entry.shipPlan||""} onChange={e=>{const eid=entry.id;const val=e.target.value;setLog(p=>({...p,[wk2]:(p[wk2]||[]).map(en=>en.id===eid?{...en,shipPlan:val}:en)}));}} placeholder="—"
style={{width:80,border:"1px solid #e7e5e4",borderRadius:6,padding:"3px 6px",fontSize:11,fontWeight:700,outline:"none",background:entry.shipPlan?"#f0fdf4":"#fff",textAlign:"center"}}/>
</div>}
</div>);})}</div>);})}
{wkD.every(d=>!d.entries.length)&&<div style={_s.emptyState}><p>No deliveries this week</p></div>}
{(()=>{const wkShiftByDrv={};let wkShiftTotal=0;let wkBonusMins=0;DAYS.forEach((_,i)=>{const{byDriver,totalMins}=getShiftSummary(getFbKey(wo,i));wkShiftTotal+=totalMins;const _wkDE=log[`${wo}-${i}`]||[];wkBonusMins+=(_wkDE.filter(e=>e.isHourly&&e.liftgateApplied).length+_wkDE.filter(e=>e.isHourly&&DISTANCE_BONUS_STOPS.includes(e.stop)).length)*60;Object.entries(byDriver).forEach(([did,mins])=>{wkShiftByDrv[did]=(wkShiftByDrv[did]||0)+mins;});});if(!wkShiftTotal)return null;const wkShiftHrs=Math.round((wkShiftTotal+wkBonusMins)/15)*15/60;return(<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
<div style={_s.flexBtwMb8}>
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
<div style={{fontSize:11,color:"#64748b",fontVariantNumeric:"tabular-nums"}}>{formatMins(wkShiftTotal+wkBonusMins)} total across all drivers</div>
</div>);})()}
{Object.keys(wkF).length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:"14px 16px",marginBottom:12}}><div style={_s.loadTitle}>Week Fuel</div>{Object.entries(wkF).map(([cu,cf])=><div key={cu} style={_s.flexBtwP4}><span style={{fontSize:13}}>{cu} <span style={{fontSize:11,color:"#a8a29e",fontVariantNumeric:"tabular-nums"}}>{fmt(cf.base)} x {Math.round(cf.pct*100)}%</span></span><span style={_s.loadWeight}>{fmt(cf.base*cf.pct)}</span></div>)}</div>}
</div>}

{}
{view==="history"&&<div>
<div style={{padding:"16px 4px 8px"}}><h2 style={{margin:0,fontSize:16,fontWeight:600}}>{histMode==="quotes"?"Quotes":histMode==="emser"?"Emser Hours":histMode==="photos"?"Photos":"Delivery History"}</h2><p style={{margin:"4px 0 0",fontSize:12,color:"#78716c"}}>{histMode==="emser"?"Track Emser driver hours":histMode==="quotes"?"Create and manage delivery quotes":histMode==="photos"?"Delivery photos & proof of delivery":"Search deliveries and proof of delivery"}</p></div>

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
<span style={_s.bold14}>{wd[sd].name} — {wd[sd].date}</span>
<div style={{textAlign:"right"}}>
<div style={{fontSize:18,fontWeight:800,color:BRAND.main,fontVariantNumeric:"tabular-nums"}}>{totalMins>0?formatMins(totalMins):(emH[`${emDk}-emser`]||4)+"h"}</div>
<div style={_s.sub}>{totalMins>0?fmt(102.50*totalHrs):fmt(102.50*(emH[`${emDk}-emser`]||4))}</div>
</div>
</div>

{/* Per-driver sections */}
{drivers.map((drv,di)=>{
const drvShifts=shifts.filter(s=>s.driverId===drv.id);
const drvMins=perDriver[drv.id]||0;
return(<div key={drv.id} style={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:14,padding:"12px 14px",marginBottom:10,borderLeft:`3px solid ${DCOL[di]}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:drvShifts.length?8:0}}>
<div style={_s.flexC8}>
<div style={{width:22,height:22,borderRadius:7,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>{drv.name.charAt(0)}</div>
<span style={_s.bold14}>{drv.name}</span>
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
const safeTimeChange=(field,val)=>{if(val)updateEmserShift(shift.id,field,val);};
const MINS=[{l:":00",v:"00"},{l:":15",v:"15"},{l:":30",v:"30"},{l:":45",v:"45"}];
const btnBase={padding:"4px 0",borderRadius:5,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,textAlign:"center"};
return(
<div key={shift.id} style={{background:"#fafaf9",border:"1px solid #e7e5e4",borderRadius:10,padding:"10px 12px",marginBottom:6}}>
<div style={_s.flexBtwMb8}>
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
<div style={{flex:1,border:"1px solid #bfdbfe",borderRadius:7,padding:"5px 8px",fontSize:13,fontWeight:700,background:shift.start?"#eff6ff":"#fafaf9",color:shift.start?"#1c1917":"#a8a29e",minHeight:22,display:"flex",alignItems:"center"}}>{shift.start?((h)=>{const[hh,mm]=h.split(":");const n=parseInt(hh);const ampm=n>=12?"PM":"AM";const d=n===0?12:n>12?n-12:n;return d+":"+mm+" "+ampm;})(shift.start):"—"}{shift.start&&<button onClick={()=>updateEmserShift(shift.id,"start","")} style={_s.delBtn}>✕</button>}</div>
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
<div style={{flex:1,border:"1px solid #bbf7d0",borderRadius:7,padding:"5px 8px",fontSize:13,fontWeight:700,background:shift.end?"#f0fdf4":"#fafaf9",color:shift.end?"#1c1917":"#a8a29e",minHeight:22,display:"flex",alignItems:"center"}}>{shift.end?((h)=>{const[hh,mm]=h.split(":");const n=parseInt(hh);const ampm=n>=12?"PM":"AM";const d=n===0?12:n>12?n-12:n;return d+":"+mm+" "+ampm;})(shift.end):"—"}{shift.end&&<button onClick={()=>updateEmserShift(shift.id,"end","")} style={_s.delBtn}>✕</button>}</div>
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
<div style={_s.flexBtwMb8}>
<div>
<div style={{fontSize:13,fontWeight:700,color:BRAND.dark}}>Total Emser Time</div>
<div style={_s.sub11}>Across all drivers</div>
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
{photoCount===0?<div style={_s.emptyState}><div style={{fontSize:36,marginBottom:12}}>{"📷"}</div><p style={{fontSize:14,fontWeight:600,margin:"0 0 4px"}}>No photos found</p><p style={{fontSize:12,margin:0}}>{histFiltered.length>0?"No photos on these deliveries":"Try adjusting your filters"}</p></div>
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
<div style={_s.flexBtwMb12}>
<div><span style={_s.bold14}>Quotes</span><span style={{fontSize:11,color:"#a8a29e",marginLeft:6}}>{savedQuotes.length}</span></div>
<button onClick={()=>setQuoteFormOpen(!quoteFormOpen)} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>{quoteFormOpen?"Cancel":"+ New Quote"}</button>
</div>
{quoteFormOpen&&<div style={{background:"#fff",border:"2px solid #16a34a",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
<div style={{fontSize:13,fontWeight:700,color:"#16a34a",marginBottom:12}}>New Quote</div>
{/* Customer */}
<label style={_s.label}>Customer (who is this for?)</label>
<select value={qCust} onChange={e=>{const v=e.target.value;setQCust(v);setQStop("");setQCustomMode(false);const qc=QUOTE_CUSTOMERS.find(q=>q.name===v);const pSrcs=PICKUP_SOURCES.filter(s=>s.customer===v);const pickups=qc?.pickups?.length?qc.pickups:pSrcs.length?pSrcs.map(s=>({label:s.label,addr:s.addr})):[];if(pickups.length===1){setQPickup(pickups[0].label);setQPickupName(pickups[0].label);setQPickupAddr(pickups[0].addr);}else{setQPickup("");setQPickupName("");setQPickupAddr("");}}} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff",marginBottom:10}}>
<option value="">Select customer...</option>{allCustNames.map(c=><option key={c} value={c}>{c}</option>)}<option value="__manual">Manual Entry</option>
</select>
{/* Pickup Info */}
<div style={{background:"#eff6ff",border:"2px solid #2563eb",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<span style={{fontSize:11,fontWeight:700,color:"#2563eb"}}>📦 Pickup From</span>
{(()=>{const qc=QUOTE_CUSTOMERS.find(q=>q.name===qCust);const pSrcs=PICKUP_SOURCES.filter(s=>s.customer===qCust);const hasKnown=(qc?.pickups?.length>0)||(pSrcs.length>0);if(hasKnown)return(
<button onClick={()=>{if(qPickup){setQPickup("");setQPickupName("");setQPickupAddr("");}else{/* find first known */const pickups=qc?.pickups?.length?qc.pickups:pSrcs.map(s=>({label:s.label,addr:s.addr}));if(pickups.length===1){setQPickup(pickups[0].label);setQPickupName(pickups[0].label);setQPickupAddr(pickups[0].addr);}}}} style={{fontSize:10,fontWeight:600,color:"#2563eb",background:"#dbeafe",border:"none",borderRadius:5,padding:"3px 8px",cursor:"pointer"}}>{qPickup?"✏ Manual":"← Known"}</button>
);return null;})()}
</div>
{(()=>{const qc=QUOTE_CUSTOMERS.find(q=>q.name===qCust);const pSrcs=PICKUP_SOURCES.filter(s=>s.customer===qCust);const pickups=qc?.pickups?.length?qc.pickups:pSrcs.length?pSrcs.map(s=>({label:s.label,addr:s.addr})):[];if(pickups.length>0&&!qPickup)return null;if(pickups.length>0&&qPickup)return(<div style={{marginBottom:6}}>
<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
{pickups.map(p=><button key={p.label} onClick={()=>{setQPickup(p.label);setQPickupName(p.label);setQPickupAddr(p.addr);}} style={{padding:"6px 12px",borderRadius:8,border:qPickup===p.label?"2px solid #2563eb":"2px solid #e7e5e4",cursor:"pointer",fontSize:12,fontWeight:700,background:qPickup===p.label?"#2563eb":"#fff",color:qPickup===p.label?"#fff":"#57534e"}}>{p.label}</button>)}
</div>
</div>);return null;})()}
<label style={{fontSize:10,fontWeight:600,color:"#2563eb",display:"block",marginBottom:2}}>Pickup Customer / Name</label>
<input value={qPickupName} onChange={e=>setQPickupName(e.target.value)} placeholder="e.g. ABC Warehouse" style={{width:"100%",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff",marginBottom:6}}/>
<label style={{fontSize:10,fontWeight:600,color:"#2563eb",display:"block",marginBottom:2}}>Pickup Address</label>
<AddressInput value={qPickupAddr} onChange={setQPickupAddr} placeholder="Pickup address"/>
</div>
{/* Delivery Info */}
<div style={{background:"#f0fdf4",border:"2px solid #16a34a",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
<div style={{fontSize:11,fontWeight:700,color:"#16a34a",marginBottom:6}}>📍 Delivering To</div>
<label style={{fontSize:10,fontWeight:600,color:"#16a34a",display:"block",marginBottom:2}}>Delivery Stop / Customer Name</label>
{qCust&&qCust!=="__manual"&&getDeliveries2(qCust).length>0&&qStop!=="__custom"&&!qCustomMode?
<select value={qStop} onChange={e=>{if(e.target.value==="__custom"){setQStop("");setQCustomMode(true);}else{setQStop(e.target.value);setQCustomMode(false);}}} style={{width:"100%",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff",marginBottom:6}}>
<option value="">Select stop...</option>{getDeliveries2(qCust).map(d=><option key={d.s} value={d.s}>{d.s}{d.r?" — $"+d.r:""}</option>)}<option value="__custom">Custom location...</option>
</select>
:<div style={{marginBottom:6}}><input value={qStop} onChange={e=>setQStop(e.target.value)} placeholder="e.g. Smith Residence" style={{width:"100%",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff"}}/>
{qCust&&qCust!=="__manual"&&getDeliveries2(qCust).length>0&&<button onClick={()=>{setQStop("");setQCustomMode(false);}} style={{marginTop:3,background:"none",border:"none",color:"#2563eb",fontSize:10,cursor:"pointer",fontWeight:600}}>← Back to stop list</button>}
</div>}
<label style={{fontSize:10,fontWeight:600,color:"#16a34a",display:"block",marginBottom:2}}>Delivery Address</label>
<AddressInput value={qAddr} onChange={setQAddr} placeholder="Delivery address"/>
</div>
{/* Distance & Rate */}
<div style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<span style={{fontSize:11,fontWeight:700,color:"#57534e"}}>📏 Distance & Rate</span>
<button onClick={calcQuoteMiles} disabled={qCalcLoading||!qPickupAddr||!qAddr} style={{background:qPickupAddr&&qAddr&&!qCalcLoading?"#1c1917":"#a8a29e",color:"#fff",border:"none",borderRadius:6,padding:"5px 12px",fontSize:10,fontWeight:600,cursor:qPickupAddr&&qAddr?"pointer":"default"}}>{qCalcLoading?"Calculating…":"Calculate Miles"}</button>
</div>
{qCalcError&&<div style={{fontSize:10,color:"#dc2626",marginBottom:6}}>{qCalcError}</div>}
<div style={{display:"flex",gap:8,marginBottom:6}}>
<div style={_s.f1}><label style={{fontSize:10,fontWeight:600,color:"#57534e",display:"block",marginBottom:2}}>Miles</label><input type="number" value={qMiles} onChange={e=>setQMiles(e.target.value)} placeholder="0" style={{width:"100%",border:qMiles?"2px solid #16a34a":"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center",background:qMiles?"#f0fdf4":"#fff"}}/></div>
<div style={_s.f1}><label style={{fontSize:10,fontWeight:600,color:"#57534e",display:"block",marginBottom:2}}>Rate Override</label><input type="number" value={qRate} onChange={e=>setQRate(e.target.value)} placeholder={qMiles?"Auto":"$"} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/></div>
</div>
{qMiles>0&&!qRate&&<div style={{fontSize:11,fontWeight:700,color:"#16a34a",textAlign:"center"}}>Auto: {fmt(calcQuoteRate(qMiles,qLiftgate,qGravel,qExtraPallets).total)} ({fmt(calcQuoteRate(qMiles,qLiftgate,qGravel,qExtraPallets).base)} base + {fmt(calcQuoteRate(qMiles,qLiftgate,qGravel,qExtraPallets).fuel)} {qLiftgate?"liftgate":"fuel"})</div>}
</div>
{/* Add-ons */}
<div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
<label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:11,fontWeight:600,color:qLiftgate?"#92400e":"#78716c",background:qLiftgate?"#fef3c7":"#f5f5f4",padding:"5px 10px",borderRadius:7,border:qLiftgate?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qLiftgate} onChange={e=>setQLiftgate(e.target.checked)}/> Liftgate +$75</label>
<label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:11,fontWeight:600,color:qGravel?"#92400e":"#78716c",background:qGravel?"#fef3c7":"#f5f5f4",padding:"5px 10px",borderRadius:7,border:qGravel?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qGravel} onChange={e=>setQGravel(e.target.checked)}/> Gravel +$25</label>
<label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:11,fontWeight:600,color:qExtraPallets?"#92400e":"#78716c",background:qExtraPallets?"#fef3c7":"#f5f5f4",padding:"5px 10px",borderRadius:7,border:qExtraPallets?"1px solid #fde68a":"1px solid #e7e5e4"}}>
<input type="checkbox" checked={qExtraPallets} onChange={e=>setQExtraPallets(e.target.checked)}/> 4-5 Pallets +$25</label>
</div>
<label style={_s.label}>Notes</label>
<textarea value={qNote} onChange={e=>setQNote(e.target.value)} placeholder="Details..." rows={2} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none",resize:"vertical",fontFamily:"inherit",marginBottom:10}}/>
<div style={{display:"flex",justifyContent:"flex-end",gap:6}}>
<button onClick={()=>setQuoteFormOpen(false)} style={{background:"#e7e5e4",border:"none",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11,fontWeight:600}}>Cancel</button>
<button onClick={saveQuote} disabled={!qStop.trim()} style={{background:qStop.trim()?"#16a34a":"#a8a29e",color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11,fontWeight:700}}>Save</button>
</div>
</div>}
{savedQuotes.length===0&&!quoteFormOpen&&<div style={_s.emptyState}><div style={{fontSize:36,marginBottom:12}}>💰</div><p style={{fontSize:13,fontWeight:600,margin:"0 0 4px"}}>No quotes yet</p></div>}
{savedQuotes.length>0&&!quoteFormOpen&&<div style={{display:"flex",gap:4,marginBottom:10,background:"#f5f5f4",borderRadius:8,padding:3}}>
<button onClick={()=>setQuoteTab("current")} style={{flex:1,background:quoteTab==="current"?"#fff":"transparent",border:"none",borderRadius:6,padding:"7px",cursor:"pointer",fontSize:12,fontWeight:600,color:quoteTab==="current"?"#1c1917":"#a8a29e",boxShadow:quoteTab==="current"?"0 1px 3px rgba(0,0,0,0.1)":"none"}}>Open ({savedQuotes.filter(q=>q.status!=="accepted").length})</button>
<button onClick={()=>setQuoteTab("past")} style={{flex:1,background:quoteTab==="past"?"#fff":"transparent",border:"none",borderRadius:6,padding:"7px",cursor:"pointer",fontSize:12,fontWeight:600,color:quoteTab==="past"?"#1c1917":"#a8a29e",boxShadow:quoteTab==="past"?"0 1px 3px rgba(0,0,0,0.1)":"none"}}>Completed ({savedQuotes.filter(q=>q.status==="accepted").length})</button>
</div>}
{savedQuotes.filter(q=>quoteTab==="current"?q.status!=="accepted":q.status==="accepted").map(q=>{const c=CC[q.customer]||CC["Quote Delivery"]||CC["One-Off Delivery"];const accepted=q.status==="accepted";return(
<div key={q.id} style={{background:accepted?"#f0fdf4":"#fff",border:`1px solid ${accepted?"#bbf7d0":"#e7e5e4"}`,borderRadius:12,padding:"12px 14px",marginBottom:8,borderLeft:`4px solid ${accepted?"#16a34a":c.accent}`}}>
<div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3,flexWrap:"wrap"}}>
<span style={{fontSize:11,fontWeight:800,color:"#a8a29e"}}>#{q.num}</span>
<span style={{fontSize:10,fontWeight:600,color:c.accent}}>{q.customer}</span>
{accepted?<span style={{fontSize:8,background:"#16a34a",color:"#fff",padding:"1px 5px",borderRadius:3,fontWeight:700}}>ACCEPTED</span>:<span style={{fontSize:8,background:"#fef3c7",color:"#92400e",padding:"1px 5px",borderRadius:3,fontWeight:700}}>PENDING</span>}
{q.miles&&<span style={{fontSize:9,color:"#78716c"}}>{q.miles}mi</span>}
{q.liftgate&&<span style={{fontSize:8,background:"#fef3c7",color:"#92400e",padding:"1px 3px",borderRadius:2}}>LG</span>}
</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div style={_s.f1}>
<div style={_s.bold14}>{q.stop}</div>
{q.addr&&<div style={{fontSize:10,color:"#78716c",marginTop:1}}>📍 {q.addr}</div>}
{(q.pickupName||q.pickupAddr)&&<div style={{fontSize:10,color:"#2563eb",marginTop:1,fontWeight:600}}>📦 PU: {q.pickupName||""}{q.pickupAddr?" — "+q.pickupAddr.split(",")[0]:""}</div>}
{q.note&&<div style={{fontSize:10,color:"#57534e",marginTop:2}}>{q.note}</div>}
<div style={{fontSize:9,color:"#a8a29e",marginTop:3}}>{new Date(q.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})} {new Date(q.createdAt).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}</div>
</div>
<div style={{textAlign:"right",marginLeft:10,flexShrink:0}}>
<div style={{fontSize:18,fontWeight:800,color:accepted?"#16a34a":"#1c1917",fontVariantNumeric:"tabular-nums"}}>{fmt(q.rate)}</div>
{q.calc&&<div style={{fontSize:9,color:"#78716c"}}>{fmt(q.calc.base)}+{fmt(q.calc.fuel)}</div>}
</div>
</div>
{!accepted&&<div style={{display:"flex",gap:6,marginTop:8}}>
{qPushDay&&qPushDay.quoteId===q.id?<div style={{flex:1,display:"flex",gap:4,alignItems:"center"}}>
<label style={{flex:1,position:"relative"}}>
<span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:12,color:"#16a34a",fontWeight:600,pointerEvents:"none"}}>📅 Select delivery date</span>
<input type="date" onChange={e=>{if(e.target.value){
const target=new Date(e.target.value+"T12:00:00");const now=new Date();
const tD=target.getDay();const tM=new Date(target);tM.setDate(target.getDate()-(tD===0?6:tD-1));
const nD=now.getDay();const nM=new Date(now);nM.setDate(now.getDate()-(nD===0?6:nD-1));
tM.setHours(0,0,0,0);nM.setHours(0,0,0,0);
const weekOff=Math.round((tM-nM)/(7*24*60*60*1000));
const dayIdx=tD===0?6:tD-1;
if(dayIdx>=0&&dayIdx<=4){pushQuoteToDay(q.id,`${weekOff}-${dayIdx}`);}
else{showToast("Pick a weekday (Mon-Fri)");}
}}} style={{flex:1,border:"1px solid #16a34a",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#f0fdf4",fontWeight:600,color:"transparent",WebkitTextFillColor:"transparent"}}/>
</label>
<button onClick={()=>setQPushDay(null)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10}}>✕</button>
</div>
:<><button onClick={()=>setQPushDay({quoteId:q.id})} style={{flex:1,background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"7px",cursor:"pointer",fontSize:11,fontWeight:700}}>Push to Day</button>
<button onClick={()=>{setSavedQuotes(p=>p.filter(x=>x.id!==q.id));deleteQuoteFromFB(q.id).catch(e=>console.error("Quote del:",e));showToast("Deleted");}} style={{background:"#fef2f2",border:"none",borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Delete</button></>}
</div>}
{accepted&&q.pushedTo&&<div style={{fontSize:10,color:"#16a34a",fontWeight:600,marginTop:4}}>✓ Pushed to {DAYS[parseInt(q.pushedTo.split("-")[1])]||""}</div>}
</div>);})}
{savedQuotes.filter(q=>quoteTab==="current"?q.status!=="accepted":q.status==="accepted").length===0&&savedQuotes.length>0&&<div style={{textAlign:"center",padding:"24px 16px",color:"#a8a29e"}}><div style={{fontSize:28,marginBottom:8}}>{quoteTab==="current"?"📋":"✅"}</div><div style={{fontSize:12}}>{quoteTab==="current"?"No open quotes":"No completed quotes"}</div></div>}
</div>);
})()}

{/* DELIVERIES LIST MODE */}
{histMode==="deliveries"&&<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px",marginBottom:8}}>
<span style={{fontSize:12,color:"#78716c"}}>{histFiltered.length} deliveries</span>
{(histSearch||histCustFilter||histDrvFilter)&&<button onClick={()=>{setHistSearch("");setHistCustFilter("");setHistDrvFilter("");}} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,color:"#dc2626",fontWeight:600}}>Clear</button>}
</div>
{histFiltered.length===0&&<div style={_s.emptyState}><div style={{fontSize:36,marginBottom:12}}>{"🔍"}</div><p style={{fontSize:14,margin:0}}>{histAll.length===0?"No delivery data yet":"No matches"}</p></div>}
{histFiltered.length>0&&(()=>{const grouped={};histFiltered.forEach(e=>{const gk=`${e.weekOff}-${e.dayIdx}`;if(!grouped[gk])grouped[gk]={dayName:e.dayName,dayDate:e.dayDate,weekOff:e.weekOff,dayIdx:e.dayIdx,entries:[]};grouped[gk].entries.push(e);});return Object.values(grouped).sort((a,b)=>a.weekOff!==b.weekOff?b.weekOff-a.weekOff:b.dayIdx-a.dayIdx).map((grp,gi)=>{const dayTotal=grp.entries.reduce((s,e)=>s+e.baseRate,0);const isCur=grp.weekOff===wo;return(<div key={gi} style={{marginBottom:12}}>
<div style={{display:"flex",justifyContent:"space-between",padding:"6px 4px",borderBottom:"1px solid #e7e5e4",marginBottom:4}}>
<span style={{fontSize:13,fontWeight:700,color:isCur?"#1c1917":"#78716c"}}>{grp.dayName} — {grp.dayDate}{!isCur&&<span style={{fontSize:10,color:"#a8a29e",fontWeight:500,marginLeft:4}}>{grp.weekOff===wo-1?"last wk":(wo-grp.weekOff)+"w ago"}</span>}</span>
<span style={{fontSize:12,fontWeight:600,color:"#16a34a",fontVariantNumeric:"tabular-nums"}}>{fmt(dayTotal)}</span>
</div>
{grp.entries.map(entry=>{const c=getCustColor(entry.customer);const drv=drivers.find(d=>d.id===entry.driverId);const di=drivers.findIndex(d=>d.id===entry.driverId);const hasPhotos=entry.photos&&entry.photos.length>0;return(
<div key={entry.id} onClick={()=>setHistDetail(entry)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 8px 6px 16px",borderLeft:"3px solid "+(entry.stopType==="pickup"?"#2563eb":c.accent),marginBottom:3,background:"#fff",borderRadius:"0 8px 8px 0",cursor:"pointer"}}>
<div style={_s.f1m}>
<div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
{entry.stopType==="pickup"&&<span style={{fontSize:8,background:"#2563eb",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:700}}>PU</span>}
{entry.stopType!=="pickup"&&<span style={{fontSize:8,background:"#16a34a",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:700}}>DEL</span>}
<span style={{fontSize:11,color:c.accent,fontWeight:600}}>{entry.customer}</span>
<span style={_s.truncate}>{entry.stop}</span>
{hasPhotos&&<span style={{fontSize:9,background:"#dbeafe",color:"#2563eb",padding:"1px 4px",borderRadius:3,fontWeight:600}}>{"📷"}{entry.photos.length}</span>}
{entry.signature&&<span style={{fontSize:9,background:"#dcfce7",color:"#16a34a",padding:"1px 4px",borderRadius:3,fontWeight:600}}>{"✓"} POD</span>}
</div>
{entry.addr&&<div style={{fontSize:10,color:"#a8a29e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.addr}</div>}
{hasPhotos&&<div style={{display:"flex",gap:4,marginTop:4}}>
{entry.photos.slice(0,4).map((p,pi)=><img key={pi} src={p} alt="" onClick={e=>{e.stopPropagation();setLightboxPhoto({src:p,stop:entry.stop,customer:entry.customer,dayName:entry.dayName,dayDate:entry.dayDate,signature:entry.signature});}} style={{width:36,height:36,objectFit:"cover",borderRadius:6,border:"1px solid #e7e5e4",cursor:"pointer"}}/>)}
{entry.photos.length>4&&<div style={{width:36,height:36,borderRadius:6,background:"#f5f5f4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#78716c"}}>+{entry.photos.length-4}</div>}
</div>}
</div>
<div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:6}}>
{drv&&<span style={{fontSize:9,background:DCOL[di]||"#78716c",color:"#fff",padding:"1px 4px",borderRadius:3,fontWeight:600}}>{drv.name.charAt(0)}</span>}
<InlineRate value={entry.baseRate+(entry.knownLiftgate?(entry.liftgateFee||75):0)} isHourly={entry.isHourly} onSave={r=>updateRate(entry.id,r)}/>
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
{/* POD Detail Modal — Mobile */}
{histDetail&&(()=>{const e=histDetail;const c=getCustColor(e.customer);const drv=drivers.find(d=>d.id===e.driverId);const di=drivers.findIndex(d=>d.id===e.driverId);const hasPhotos=e.photos&&e.photos.length>0&&!e.photos.every(p=>typeof p==="string"&&p.startsWith("photo_"));return(
<div onClick={()=>setHistDetail(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:290,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
<div onClick={ev=>ev.stopPropagation()} style={{background:"#fff",borderRadius:"16px 16px 0 0",width:"100%",maxHeight:"85vh",overflowY:"auto",boxShadow:"0 -10px 40px rgba(0,0,0,0.3)"}}>
<div style={{width:40,height:4,borderRadius:2,background:"#d6d3d1",margin:"8px auto 4px"}}/>
<div style={{padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
{e.stopType!=="pickup"&&<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700}}>DELIVERY</span>}
{e.status==="departed"&&<span style={{fontSize:9,background:"#16a34a",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700}}>DONE</span>}
</div>
<div style={{fontSize:17,fontWeight:700}}>{e.stop}</div>
<div style={{fontSize:12,color:c.accent,fontWeight:600}}>{e.customer}</div>
{e.addr&&<div style={{fontSize:11,color:"#78716c",marginTop:2}}>{e.addr}</div>}
</div>
<button onClick={()=>setHistDetail(null)} style={{background:"#f5f5f4",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:14,color:"#78716c"}}>✕</button>
</div>
<div style={{padding:"8px 20px",display:"flex",flexDirection:"column",gap:8}}>
<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
{drv&&<div style={{display:"flex",alignItems:"center",gap:5,background:DCOL[di]+"18",border:`1px solid ${DCOL[di]}44`,borderRadius:8,padding:"5px 10px"}}>
<div style={{width:22,height:22,borderRadius:6,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700}}>{drv.name.split(" ").map(n=>n[0]).join("")}</div>
<span style={{fontSize:11,fontWeight:600}}>{drv.name}</span>
</div>}
<div style={{background:"#f5f5f4",borderRadius:8,padding:"5px 10px",fontSize:11,color:"#78716c"}}>{e.dayName} — {e.dayDate}</div>
</div>
{(e.arrivedAt||e.departedAt)&&<div style={{display:"flex",gap:8}}>
{e.arrivedAt&&<div style={{flex:1,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:"#16a34a",fontWeight:700}}>📍 Arrived</div><div style={{fontSize:15,fontWeight:700}}>{e.arrivedAt}</div></div>}
{e.departedAt&&<div style={{flex:1,background:"#dcfce7",border:"1px solid #86efac",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:"#16a34a",fontWeight:700}}>✅ Departed</div><div style={{fontSize:15,fontWeight:700}}>{e.departedAt}</div></div>}
</div>}
{e.instructions&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#1d4ed8"}}>📋 {e.instructions}</div>}
{e.weight>0&&<div style={{fontSize:12,color:BRAND.main,fontWeight:700}}>{e.weight.toLocaleString()} lbs{e.wasSplit?" (Load "+e.loadNum+")":""}</div>}
{e.shipPlan&&<div style={{fontSize:12,color:"#ea580c",fontWeight:700}}>SP# {e.shipPlan}</div>}
</div>
{e.signature&&<div style={{padding:"8px 20px"}}>
<div style={{background:"#f0fdf4",border:"2px solid #16a34a",borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
<div style={{fontSize:11,color:"#16a34a",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Proof of Delivery</div>
<div style={{fontSize:20,fontWeight:700}}>✍ {e.signature}</div>
<div style={{fontSize:10,color:"#78716c",marginTop:2}}>Signed by recipient</div>
</div>
</div>}
{hasPhotos&&<div style={{padding:"4px 20px 16px"}}>
<div style={{fontSize:11,fontWeight:700,color:"#57534e",marginBottom:6}}>📷 Photos ({e.photos.filter(p=>!(typeof p==="string"&&p.startsWith("photo_"))).length})</div>
{e.photos.filter(p=>!(typeof p==="string"&&p.startsWith("photo_"))).map((p,pi)=><img key={pi} src={p} alt="" onClick={()=>{setHistDetail(null);setLightboxPhoto({src:p,stop:e.stop,customer:e.customer,dayName:e.dayName,dayDate:e.dayDate,signature:e.signature});}} style={{width:"100%",borderRadius:10,border:"1px solid #e7e5e4",cursor:"pointer",objectFit:"contain",maxHeight:250,marginBottom:6}}/>)}
</div>}
<div style={{padding:"10px 20px 20px",borderTop:"1px solid #e7e5e4",display:"flex",justifyContent:"space-between"}}>
<span style={{fontSize:12,color:"#78716c"}}>Rate</span>
<span style={{fontSize:17,fontWeight:700}}>{e.isHourly?"Hourly":fmt(e.baseRate+(e.knownLiftgate?(e.liftgateFee||75):0))}</span>
</div>
</div>
</div>);})()}
</div>}

{}
{view==="add"&&!selCust&&!quoteMode&&<div>
{preAssignDriver&&(()=>{const drv=drivers.find(d=>d.id===preAssignDriver);const di=drivers.findIndex(d=>d.id===preAssignDriver);return(<>
<button onClick={()=>{setPreAssignDriver(null);setView("manifest");}} style={{background:"none",border:"none",color:"#2563eb",fontSize:13,cursor:"pointer",padding:"16px 4px 4px",fontWeight:600}}>← Back to Manifests</button>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",margin:"4px 0 8px",background:"#f0fdf4",border:`2px solid ${DCOL[di]||"#16a34a"}`,borderRadius:12}}><div style={_s.flexC8}><div style={{width:28,height:28,borderRadius:8,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:700}}>{drv?.name?.charAt(0)}</div><div><div style={{fontSize:13,fontWeight:700}}>Adding for {drv?.name}</div><div style={{fontSize:10,color:"#16a34a"}}>Auto-assigned</div></div></div><button onClick={()=>setPreAssignDriver(null)} style={{background:"#e7e5e4",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,color:"#57534e"}}>Clear</button></div>
</>);})()}

{}
<h2 style={{margin:0,fontSize:16,fontWeight:600,padding:"16px 4px 8px"}}>Contract Customers</h2>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
{Object.keys(CUSTOMERS).map(cust=>{const c=CC[cust];const cd=CUSTOMERS[cust];return(<button key={cust} onClick={()=>setSelCust(cust)} style={{background:c.bg,border:"none",borderRadius:14,padding:"16px 14px",cursor:"pointer",textAlign:"left",position:"relative"}}>{cd.priority&&<span style={{position:"absolute",top:8,right:8,fontSize:9,background:"#f59e0b",color:"#fff",padding:"1px 5px",borderRadius:4,fontWeight:700}}>PRIORITY</span>}<div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{cust}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:4}}>{cd.rate_type==="hourly"?"$102.50/hr":`from ${cd.pickup}`}</div></button>);})}
</div>
<h2 style={{margin:0,fontSize:16,fontWeight:600,padding:"0 4px 8px"}}>Quote Customers</h2>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
{QUOTE_CUSTOMERS.map(qc=><button key={qc.name} onClick={()=>setQuoteMode(qc)} style={{background:"#78350f",border:"none",borderRadius:14,padding:"16px 14px",cursor:"pointer",textAlign:"left"}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{qc.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:4}}>{qc.pickups.map(p=>p.label).join(" / ")}</div></button>)}
</div>
<button onClick={()=>setQuoteMode({name:"One-Off Delivery",pickups:[]})} style={{display:"block",width:"calc(100% - 8px)",margin:"0 4px",background:"#374151",border:"none",borderRadius:14,padding:"18px 14px",cursor:"pointer",textAlign:"left"}}><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>New Customer / One-Off</div><div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:4}}>Mileage calculator + add-ons</div></button>

{/* One-off with customer association */}
<div style={{margin:"12px 4px 0",background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:14,padding:14}}>
<div style={{fontSize:13,fontWeight:700,marginBottom:8}}>One-Off for a Customer</div>
<div style={{fontSize:11,color:"#78716c",marginBottom:10}}>Add a one-time delivery tied to a contract customer</div>
<select value={oneOffCust} onChange={e=>setOneOffCust(e.target.value)} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:14,outline:"none",marginBottom:8,background:"#fff"}}>
<option value="">Select customer...</option>
{Object.keys(CUSTOMERS).map(c=><option key={c} value={c}>{c}</option>)}
</select>
{oneOffCust&&<button onClick={()=>{setSelCust(oneOffCust);setOneOffCust("");setShowAddCustomDel(true);setCustomDelPermanent(false);}} style={{width:"100%",background:CC[oneOffCust]?.bg||"#374151",color:"#fff",border:"none",borderRadius:10,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
+ Add One-Time Stop for {oneOffCust}
</button>}
</div>
</div>}
{}
{view==="add"&&selCust&&<div>
<button onClick={()=>{setSelCust(null);setMultiSelect(false);setMultiChecked([]);setShowAddCustomDel(false);setStopEditOpen(null);setConfirmDeleteStop(false);}} style={BB}>← {preAssignDriver?"Customers":"Back"}</button>
{preAssignDriver&&(()=>{const drv=drivers.find(d=>d.id===preAssignDriver);const di=drivers.findIndex(d=>d.id===preAssignDriver);return(<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",margin:"0 4px 8px",background:"#f0fdf4",border:`1px solid ${DCOL[di]||"#bbf7d0"}`,borderRadius:10}}><div style={{width:20,height:20,borderRadius:6,background:DCOL[di],display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>{drv?.name?.charAt(0)}</div><span style={{fontSize:12,fontWeight:600,color:"#16a34a"}}>Auto-adding to {drv?.name}</span></div>);})()}
<div style={{padding:"0 4px"}}>
<h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:700,color:CC[selCust].accent}}>{selCust}</h2>
<p style={{margin:"0 0 4px",fontSize:12,color:"#78716c"}}>{CUSTOMERS[selCust].noteHighlight?<>{CUSTOMERS[selCust].note.split("**"+CUSTOMERS[selCust].noteHighlight+"**")[0]}<span style={{background:"#fef3c7",color:"#92400e",fontWeight:700,padding:"1px 6px",borderRadius:4,border:"1px solid #fde68a"}}>{CUSTOMERS[selCust].noteHighlight}</span>{CUSTOMERS[selCust].note.split("**"+CUSTOMERS[selCust].noteHighlight+"**")[1]}</>:CUSTOMERS[selCust].note}</p>
{CUSTOMERS[selCust].priority&&<p style={{margin:"0 0 4px",fontSize:12,color:"#f59e0b",fontWeight:600}}>⚡ {CUSTOMERS[selCust].priorityNote||"Priority"}</p>}
</div>
{CUSTOMERS[selCust].fuel_surcharge&&!CUSTOMERS[selCust].fuel_included&&<p style={{fontSize:12,color:"#d97706",margin:"0 4px 8px",padding:"8px 12px",background:"#fffbeb",borderRadius:8,borderLeft:"3px solid #d97706"}}>⛽ {Math.round(CUSTOMERS[selCust].fuel_surcharge*100)}% fuel added separately</p>}
{/* Pickup location selector for customers with multiple pickups */}
{(()=>{const puSrcs=PICKUP_SOURCES.filter(s=>s.customer===selCust);if(puSrcs.length<=1)return null;return(
<div style={{margin:"0 4px 10px",padding:"10px 14px",background:"#eff6ff",border:"2px solid #2563eb",borderRadius:12}}>
<div style={{fontSize:11,fontWeight:700,color:"#2563eb",marginBottom:6}}>Pickup Location</div>
<div style={_s.flexG6}>
{puSrcs.map(ps=>{const loc=ps.label.split(" - ").pop();return(
<button key={ps.label} onClick={()=>setSelPickup(loc)} style={{flex:1,padding:"10px 8px",borderRadius:8,border:selPickup===loc?"2px solid #2563eb":"2px solid #e7e5e4",cursor:"pointer",fontSize:13,fontWeight:700,background:selPickup===loc?"#2563eb":"#fff",color:selPickup===loc?"#fff":"#57534e",textAlign:"center"}}>{loc}</button>
);})}
</div>
<div style={{fontSize:10,color:"#64748b",marginTop:4}}>{puSrcs.find(ps=>ps.label.includes(selPickup))?.addr||""}</div>
</div>);})()}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px",marginBottom:8}}>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{setMultiSelect(!multiSelect);setMultiChecked([]);}} style={{background:multiSelect?"#2563eb":"#e7e5e4",color:multiSelect?"#fff":"#57534e",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>
{multiSelect?"Cancel Multi-Select":"Select Multiple"}
</button>
{CUSTOMERS[selCust]?.rate_type==="hourly"&&<button onClick={()=>setEmserLTL(!emserLTL)} style={{background:emserLTL?"#dc2626":"#e7e5e4",color:emserLTL?"#fff":"#57534e",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700}}>
{emserLTL?"🚛 LTL ON":"🚛 LTL"}
</button>}
</div>
{multiSelect&&multiChecked.length>0&&<button onClick={()=>{const allDels=[...CUSTOMERS[selCust].deliveries,...(customStops[selCust]||[])];const stops=allDels.filter((_,i)=>multiChecked.includes(i));addMulti(selCust,stops,preAssignDriver||0);}} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>Add {multiChecked.length} stops</button>}
</div>
{emserLTL&&CUSTOMERS[selCust]?.rate_type==="hourly"&&<div style={{margin:"0 4px 10px",padding:"10px 14px",background:"#fef2f2",border:"2px solid #dc2626",borderRadius:12}}>
<div style={{fontSize:12,fontWeight:700,color:"#dc2626",marginBottom:4}}>🚛 LTL MODE — Flat Rate Billing</div>
<div style={{fontSize:11,color:"#78716c"}}>Stops added now are billed per-delivery instead of hourly. Tap the rate on any manifest card to set the price.</div>
</div>}
{CUSTOMERS[selCust].roundTrip&&<button onClick={()=>{const cd=CUSTOMERS[selCust];addDel(selCust,CUSTOMERS[selCust].roundTrip.label,CUSTOMERS[selCust].roundTrip.rate,preAssignDriver||0,{fuelPct:(cd.fuel_surcharge&&!cd.fuel_included)?cd.fuel_surcharge:0,priority:cd.priority});}} style={{display:"block",width:"100%",textAlign:"left",background:"#fef3c7",border:"2px solid #fbbf24",borderRadius:12,padding:"14px 16px",marginBottom:12,cursor:"pointer"}}><div style={_s.flexBtw}><div><div style={{fontSize:14,fontWeight:700,color:"#92400e"}}>🔄 {CUSTOMERS[selCust].roundTrip.label}</div></div><span style={{fontVariantNumeric:"tabular-nums",fontSize:17,fontWeight:700,color:"#ea580c"}}>{fmt(CUSTOMERS[selCust].roundTrip.rate)}</span></div></button>}
{/* Merge hardcoded + custom stops for this customer, sorted alphabetically */}
{(()=>{const hardcoded=CUSTOMERS[selCust].deliveries;const custom=customStops[selCust]||[];
/* Tag each entry with its source for isCustom detection */
const tagged=[...hardcoded.map((d,i)=>({d,src:"hard",origIdx:i})),...custom.map((d,i)=>({d,src:"custom",origIdx:hardcoded.length+i}))];
/* Sort alphabetically by DISPLAY name (after overrides applied) */
tagged.sort((a,b)=>{
const origA=typeof a.d==="string"?a.d:a.d.s;
const origB=typeof b.d==="string"?b.d:b.d.s;
const ovrA=a.src==="hard"&&stopOverrides[selCust+"::"+origA];
const ovrB=b.src==="hard"&&stopOverrides[selCust+"::"+origB];
const nameA=(ovrA?ovrA.s:origA).toLowerCase();
const nameB=(ovrB?ovrB.s:origB).toLowerCase();
return nameA.localeCompare(nameB);
});
const custHidden=hiddenStops.filter(k=>k.startsWith(selCust+"::"));
return(<>{tagged.map((item,idx)=>{const d=item.d;const isStr=typeof d==="string";const origStop=isStr?d:d.s;const origRate=isStr?0:d.r;const origNote=isStr?null:d.n;const origAddr=d.addr||getAddr(origStop);
const isCustom=item.src==="custom";
/* Skip hidden built-in stops */
const hideKey=selCust+"::"+origStop;
if(!isCustom&&hiddenStops.includes(hideKey))return null;
/* Apply override for built-in stops */
const ovrKey=selCust+"::"+origStop;
const ovr=(!isCustom&&stopOverrides[ovrKey])||null;
const stop=ovr?ovr.s:origStop;const isStopLG=!isStr&&d.lg;const rate=ovr?(ovr.r||0):origRate;const note=ovr?(ovr.n||null):origNote;const addr=ovr?(ovr.addr||origAddr):origAddr;
const curInstr=customInstr[stop]!==undefined?customInstr[stop]:(customInstr[origStop]!==undefined?customInstr[origStop]:getDefaultInstr(origStop));const checked=multiChecked.includes(item.origIdx);
const hasOverride=!!ovr;
return(<div key={item.origIdx} style={{position:"relative"}}>
<DeliveryListItem stop={stop} rate={rate} note={note} addr={addr} curInstr={curInstr} checked={checked} multiSelect={multiSelect} accent={CC[selCust].accent}
isCustom={isCustom}
isLG={isStopLG}
ltlMode={emserLTL&&CUSTOMERS[selCust]?.rate_type==="hourly"}
pickupSources={PICKUP_SOURCES.filter(s=>s.customer===selCust)}
onOpenEdit={()=>openStopEdit(selCust,item.origIdx,isCustom,origStop,addr,rate,note)}
onCheck={()=>setMultiChecked(p=>p.includes(item.origIdx)?p.filter(x=>x!==item.origIdx):[...p,item.origIdx])}
onAdd={(dueBy,weight,pickupDueBy,pickupLoc,ltlRateVal)=>{const cd=CUSTOMERS[selCust];const finalRate=(emserLTL&&cd.rate_type==="hourly")?ltlRateVal:(rate||0);addDel(selCust,stop,finalRate,preAssignDriver||0,{isHourly:cd.rate_type==="hourly"&&!emserLTL,fuelPct:(cd.fuel_surcharge&&!cd.fuel_included)?cd.fuel_surcharge:0,note:note||null,addr,priority:cd.priority,dueBy:dueBy||null,weight:weight||0,pickupDueBy:pickupDueBy||null,pickupFrom:pickupLoc||null});}}
onSaveInstr={text=>setCustomInstr(p=>({...p,[stop]:text}))}
/>
</div>);})}{custHidden.length>0&&<div style={{marginTop:10,background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:12,padding:"10px 14px"}}>
<div style={{fontSize:11,fontWeight:700,color:"#dc2626",marginBottom:6}}>🗑 Deleted Stops ({custHidden.length})</div>
{custHidden.map(key=>{const stopName=key.split("::")[1];return(<div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid #fecaca"}}>
<span style={{fontSize:12,color:"#78716c",textDecoration:"line-through"}}>{stopName}</span>
<button onClick={()=>restoreHiddenStop(key)} style={{background:"#fff",border:"1px solid #bfdbfe",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:10,fontWeight:700,color:"#2563eb"}}>↩ Restore</button>
</div>);})}
</div>}</>);
})()}
{/* Add new delivery location for this customer */}
{!showAddCustomDel?<button onClick={()=>{setShowAddCustomDel(true);setCustomDelName("");setCustomDelAddr("");setCustomDelRate("");setCustomDelNote("");}} style={{display:"block",width:"100%",marginTop:8,background:"#fafaf9",border:"2px dashed #d6d3d1",borderRadius:12,padding:"14px 16px",cursor:"pointer",textAlign:"center",color:"#78716c",fontSize:13,fontWeight:600}}>+ Add New Delivery Location</button>
:<div style={{marginTop:8,background:"#fff",border:`2px solid ${CC[selCust].accent}`,borderRadius:14,padding:16}}>
<div style={_s.flexBtwMb10}>
<span style={{fontSize:13,fontWeight:700,color:CC[selCust].accent}}>New {selCust} Delivery</span>
<button onClick={()=>setShowAddCustomDel(false)} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#78716c"}}>✕</button>
</div>
<div style={{display:"flex",flexDirection:"column",gap:8}}>
<input value={customDelName} onChange={e=>setCustomDelName(e.target.value)} placeholder="Stop name (e.g. Smith Flooring - Kennesaw)" autoFocus
style={{border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:14,outline:"none"}}/>
<AddressInput value={customDelAddr} onChange={v=>setCustomDelAddr(v)} placeholder="Full address" style={{borderRadius:10,padding:"10px 14px"}}/>
<div style={{display:"flex",gap:8}}>
<div style={_s.f1}>
<label style={_s.label}>Rate ($)</label>
<input value={customDelRate} onChange={e=>setCustomDelRate(e.target.value)} placeholder={CUSTOMERS[selCust].rate_type==="hourly"?"Hourly":"0.00"} type="number" inputMode="decimal" step="0.01"
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:14,fontWeight:700,outline:"none"}}/>
</div>
<div style={_s.f1}>
<label style={_s.label}>Note (optional)</label>
<input value={customDelNote} onChange={e=>setCustomDelNote(e.target.value)} placeholder="Gate code, hours…"
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:13,outline:"none"}}/>
</div>
</div>
{/* Permanent vs One-Time toggle */}
<div style={{display:"flex",gap:8,marginTop:4}}>
<button onClick={()=>setCustomDelPermanent(true)} style={{flex:1,padding:"10px",borderRadius:10,border:customDelPermanent?"2px solid #16a34a":"1px solid #d6d3d1",background:customDelPermanent?"#f0fdf4":"#fff",cursor:"pointer",fontSize:12,fontWeight:600,color:customDelPermanent?"#16a34a":"#78716c"}}>
✓ Permanent
</button>
<button onClick={()=>setCustomDelPermanent(false)} style={{flex:1,padding:"10px",borderRadius:10,border:!customDelPermanent?"2px solid #d97706":"1px solid #d6d3d1",background:!customDelPermanent?"#fffbeb":"#fff",cursor:"pointer",fontSize:12,fontWeight:600,color:!customDelPermanent?"#d97706":"#78716c"}}>
One-Time Only
</button>
</div>
<button onClick={()=>{
if(!customDelName.trim())return;
const cd=CUSTOMERS[selCust];
const rate=parseFloat(customDelRate)||0;
const newStop={s:customDelName.trim(),r:rate,addr:customDelAddr.trim(),n:customDelNote.trim()||null};
if(customDelPermanent){
  setCustomStops(p=>({...p,[selCust]:[...(p[selCust]||[]),newStop]}));
}
if(customDelAddr.trim())_customAddrCache[customDelName.trim()]=customDelAddr.trim();
addDel(selCust,customDelName.trim(),rate,preAssignDriver||0,{
isHourly:cd.rate_type==="hourly"&&!emserLTL,
fuelPct:(cd.fuel_surcharge&&!cd.fuel_included)?cd.fuel_surcharge:0,
note:customDelNote.trim()||null,
addr:customDelAddr.trim(),
priority:cd.priority,
});
setShowAddCustomDel(false);setCustomDelName("");setCustomDelAddr("");setCustomDelRate("");setCustomDelNote("");setCustomDelPermanent(true);
showToast(customDelName.trim()+(customDelPermanent?" saved to ":" added for ")+selCust);
}} disabled={!customDelName.trim()}
style={{background:customDelName.trim()?CC[selCust].accent:"#e7e5e4",color:customDelName.trim()?"#fff":"#a8a29e",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:600,cursor:customDelName.trim()?"pointer":"default"}}>
Add {customDelName.trim()||"Delivery"} to {selCust}
</button>
</div>
</div>}

{}
{!showAddPickup?<button onClick={()=>{setShowAddPickup(true);setPuCustomName("");setPuCustomAddr("");setPuWeight("");setPuRate("");setPuMiles("");setPuNote("");setPuDelName("");setPuDelAddr("");setPuCalcError("");}} style={{display:"block",width:"100%",marginTop:8,background:"#eff6ff",border:"2px dashed #93c5fd",borderRadius:12,padding:"14px 16px",cursor:"pointer",textAlign:"center",color:"#2563eb",fontSize:13,fontWeight:600}}>📦 Schedule a Pickup for {selCust}</button>
:<div style={{marginTop:8,background:"#fff",border:"2px solid #2563eb",borderRadius:14,padding:16}}>
<div style={{fontSize:13,fontWeight:700,color:"#2563eb",marginBottom:10}}>📦 Pickup for {selCust}</div>
<div style={_s.label}>Picking up from (supplier/vendor)</div>
{(()=>{const custData=CUSTOMERS[selCust];const custDels=custData?.deliveries?custData.deliveries.map(d=>typeof d==="string"?d:d.s).sort():[];
return custDels.length>0?<>
<div style={{maxHeight:140,overflowY:"auto",border:"1px solid #e7e5e4",borderRadius:10,padding:4,marginBottom:6}}>
{custDels.filter(s=>!s.startsWith("Transfer")&&s!=="Drop Ship Liftgate").map(s=>{const addr=getAddr(s);const delData=custData.deliveries.find(d=>(typeof d==="string"?d:d.s)===s);const rate=delData&&typeof delData!=="string"?delData.r:0;return(<button key={s} onClick={()=>{setPuCustomName(s);if(addr)setPuCustomAddr(addr);if(rate)setPuRate(String(rate));}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 10px",marginBottom:1,borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600,background:puCustomName===s?"#2563eb":"#fff",color:puCustomName===s?"#fff":"#1c1917",border:puCustomName===s?"1px solid #1d4ed8":"1px solid transparent"}}>{s}{rate?<span style={{fontSize:9,color:puCustomName===s?"#bfdbfe":"#16a34a",marginLeft:6}}>{fmt(rate)}</span>:""}{addr?<span style={{fontSize:9,color:puCustomName===s?"#bfdbfe":"#a8a29e",marginLeft:6}}>{addr.split(",")[0]}</span>:""}</button>);})}
</div>
<div style={{fontSize:10,fontWeight:600,color:"#78716c",marginBottom:4}}>Or enter custom:</div>
</>:null;})()}
<div style={{display:"flex",gap:4}}>
<input value={puCustomName} onChange={e=>setPuCustomName(e.target.value)} placeholder="Pickup location name" style={_s.input12}/>
<input value={puCustomAddr} onChange={e=>setPuCustomAddr(e.target.value)} placeholder="Pickup address" style={_s.input12}/>
</div>
<div style={{...(_s.label),marginTop:10}}>Delivering to</div>
{PICKUP_SOURCES.filter(s=>s.customer===selCust).map((src,i)=><button key={i} onClick={()=>{setPuDelName(src.label);setPuDelAddr(src.addr);}} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 12px",marginBottom:3,borderRadius:8,cursor:"pointer",background:puDelName===src.label?"#f0fdf4":"#f8fafc",border:puDelName===src.label?"2px solid #16a34a":"1px solid #e2e8f0",fontSize:12}}><span style={{fontWeight:600,color:"#16a34a"}}>{src.label}</span> <span style={{fontSize:10,color:"#94a3b8"}}>{src.addr}</span></button>)}
<div style={{display:"flex",gap:4,marginTop:4}}>
<input value={puDelName} onChange={e=>setPuDelName(e.target.value)} placeholder={"Delivery name (default: "+selCust+")"} style={_s.input12}/>
<input value={puDelAddr} onChange={e=>setPuDelAddr(e.target.value)} placeholder="Delivery address" style={_s.input12}/>
</div>
<div style={{display:"flex",gap:6,marginTop:8}}>
<div style={_s.f1}><div style={_s.labelSm}>Weight (lbs)</div><input type="number" inputMode="numeric" value={puWeight} onChange={e=>setPuWeight(e.target.value)} placeholder="0" style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,fontWeight:700,outline:"none",textAlign:"center"}}/></div>
<div style={_s.f1}><div style={_s.labelSm}>Rate ($)</div><input type="number" value={puRate} onChange={e=>setPuRate(e.target.value)} placeholder={puMiles?fmt(calcQuoteRate(puMiles,false,false,false).total):"$"} style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,fontWeight:700,outline:"none",textAlign:"center"}}/></div>
<div style={_s.f1}><div style={_s.labelSm}>Miles</div><input type="number" value={puMiles} onChange={e=>setPuMiles(e.target.value)} placeholder="0" style={{width:"100%",border:puMiles?"2px solid #16a34a":"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,fontWeight:700,outline:"none",textAlign:"center",background:puMiles?"#f0fdf4":"#fff"}}/></div>
</div>
{puMiles&&<div style={{fontSize:11,color:"#16a34a",fontWeight:700,marginTop:4}}>Auto rate: {fmt(calcQuoteRate(puMiles,false,false,false).total)}</div>}
{puCustomAddr&&puDelAddr&&<button onClick={()=>calcPuMiles(puCustomAddr,puDelAddr)} disabled={puCalcLoading} style={{width:"100%",marginTop:6,background:"#1c1917",color:"#fff",border:"none",borderRadius:8,padding:"8px",fontSize:12,fontWeight:600,cursor:"pointer",opacity:puCalcLoading?0.6:1}}>{puCalcLoading?"Calculating…":"📍 Calculate Distance"}</button>}
{puCalcError&&<div style={{fontSize:11,color:"#dc2626",marginTop:4}}>{puCalcError}</div>}
<input value={puNote} onChange={e=>setPuNote(e.target.value)} placeholder="Notes..." style={{width:"100%",marginTop:6,border:"1px solid #d6d3d1",borderRadius:8,padding:"7px 10px",fontSize:12,outline:"none"}}/>
{puCustomName.trim()&&<button onClick={()=>{
const cd=CUSTOMERS[selCust];const drvId=preAssignDriver||0;
const delStop=puDelName.trim()||selCust;
const rate=parseFloat(puRate)||(puMiles?calcQuoteRate(puMiles,false,false,false).total:0);
const weight=parseInt(puWeight)||0;
if(puCustomAddr.trim())_customAddrCache[puCustomName.trim()]=puCustomAddr.trim();
if(puDelAddr.trim())_customAddrCache[delStop]=puDelAddr.trim();
addDel(selCust,puCustomName.trim(),0,drvId,{stopType:"pickup",addr:puCustomAddr.trim(),note:puNote.trim()||null,pickupFrom:puCustomName.trim(),weight,manualPickup:true});
addDel(selCust,delStop,rate,drvId,{stopType:"delivery",addr:puDelAddr.trim()||getAddr(delStop),note:(puNote.trim()?puNote.trim()+" | ":"")+(puMiles?puMiles+"mi":""),weight,fuelPct:(cd.fuel_surcharge&&!cd.fuel_included)?cd.fuel_surcharge:0,isHourly:cd.rate_type==="hourly"&&!emserLTL,priority:cd.priority});
setShowAddPickup(false);showToast("PU "+puCustomName.trim()+" → DEL "+delStop);
}} style={{width:"100%",marginTop:8,background:"#2563eb",color:"#fff",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:600,cursor:"pointer"}}>📦 Pickup {puCustomName.trim()} → {puDelName.trim()||selCust}</button>}
<button onClick={()=>setShowAddPickup(false)} style={{width:"100%",marginTop:4,background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:8,padding:"8px",fontSize:12,fontWeight:600,color:"#78716c",cursor:"pointer"}}>Cancel</button>
</div>}

{}
{stopEditOpen&&stopEditOpen.cust===selCust&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>{setStopEditOpen(null);setConfirmDeleteStop(false);}}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:440,boxShadow:"0 24px 64px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
<div style={_s.flexBtwMb16}>
<div>
<h3 style={{margin:0,fontSize:17,fontWeight:700,color:CC[selCust]?.accent||"#1c1917"}}>⚙ Edit Stop</h3>
<div style={{fontSize:11,color:"#78716c",marginTop:2}}>{stopEditOpen.isCustom?"Custom stop":"Built-in stop"}{!stopEditOpen.isCustom&&stopOverrides[stopEditOpen.cust+"::"+stopEditOpen.stop]?" (modified)":""} — saves to Firebase</div>
</div>
<button onClick={()=>{setStopEditOpen(null);setConfirmDeleteStop(false);}} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#78716c",lineHeight:1}}>✕</button>
</div>
<div style={{display:"flex",flexDirection:"column",gap:10}}>
<div>
<label style={_s.label}>Stop Name</label>
<input value={stopEditName} onChange={e=>setStopEditName(e.target.value)} placeholder="Stop name"
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:14,fontWeight:600,outline:"none"}}/>
</div>
<div>
<label style={_s.label}>Address</label>
<AddressInput value={stopEditAddr} onChange={v=>setStopEditAddr(v)} placeholder="Full address" style={{borderRadius:10,padding:"10px 14px"}}/>
</div>
<div style={{display:"flex",gap:10}}>
<div style={_s.f1}>
<label style={_s.label}>Rate ($)</label>
<input value={stopEditRate} onChange={e=>setStopEditRate(e.target.value)} placeholder="0.00" type="number" inputMode="decimal" step="0.01"
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:14,fontWeight:700,outline:"none"}}/>
</div>
<div style={_s.f1}>
<label style={_s.label}>Note</label>
<input value={stopEditNote} onChange={e=>setStopEditNote(e.target.value)} placeholder="Optional"
style={{width:"100%",border:"1px solid #d6d3d1",borderRadius:10,padding:"10px 14px",fontSize:13,outline:"none"}}/>
</div>
</div>
</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16,gap:8}}>
{/* Delete / Restore button */}
{(()=>{const isCust=stopEditOpen.isCustom;
const delLabel=isCust?"🗑 Delete Stop":"🗑 Delete Stop";
const confirmLabel=isCust?"Yes, Delete Permanently":"Yes, Delete Permanently";
return confirmDeleteStop
?<div style={{flex:1,display:"flex",gap:6}}>
<button onClick={deleteStopPermanent} style={{flex:1,background:"#dc2626",color:"#fff",border:"none",borderRadius:10,padding:"10px",cursor:"pointer",fontSize:12,fontWeight:700}}>{confirmLabel}</button>
<button onClick={()=>setConfirmDeleteStop(false)} style={{background:"#e7e5e4",border:"none",borderRadius:10,padding:"10px 14px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#57534e"}}>No</button>
</div>
:<button onClick={()=>setConfirmDeleteStop(true)} style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:10,padding:"10px 14px",cursor:"pointer",fontSize:12,fontWeight:700,color:"#dc2626"}}>{delLabel}</button>;
})()}
<div style={{display:"flex",gap:8}}>
<button onClick={()=>{setStopEditOpen(null);setConfirmDeleteStop(false);}} style={{background:"#e7e5e4",border:"none",borderRadius:10,padding:"10px 16px",cursor:"pointer",fontSize:13,fontWeight:600}}>Cancel</button>
<button onClick={saveStopEdit} disabled={!stopEditName.trim()} style={{background:stopEditName.trim()?(CC[selCust]?.accent||"#16a34a"):"#d6d3d1",color:stopEditName.trim()?"#fff":"#a8a29e",border:"none",borderRadius:10,padding:"10px 20px",cursor:stopEditName.trim()?"pointer":"default",fontSize:13,fontWeight:700}}>Save</button>
</div>
</div>
</div>
</div>}

</div>}
{view==="add"&&quoteMode&&<QuoteBuilder customerName={quoteMode.name} pickupOptions={quoteMode.pickups} onAdd={addDel} onAddQuote={addQuoteWithPickup} onBack={()=>setQuoteMode(null)} drivers={drivers} drvEntries={drvEntries}/>}
</div>

{}
{showMsgPanel&&<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column"}}>
<div onClick={()=>setShowMsgPanel(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
<div style={{position:"relative",marginTop:"auto",background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column",zIndex:1,minHeight:400}}>
{/* Header */}
<div style={{padding:"14px 20px 10px",borderBottom:"1px solid #e7e5e4",flexShrink:0}}>
<div style={_s.flexBtwMb10}>
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

{}
{showChat&&<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column"}}>
<div onClick={()=>setShowChat(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
<div style={{position:"relative",marginTop:"auto",background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column",zIndex:1}}>
{/* Chat header */}
<div style={{padding:"16px 20px 12px",borderBottom:"1px solid #e7e5e4",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
<div style={_s.flexC10}>
<div style={{width:36,height:36,borderRadius:12,background:"linear-gradient(135deg, #d97706, #ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🤖</div>
<div><div style={{fontSize:15,fontWeight:700}}>Dispatch AI</div><div style={_s.sub}>Knows your routes, rates & customers</div></div>
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
<div style={{maxWidth:"85%"}}>
{/* Image preview for user messages */}
{msg._preview&&<img src={msg._preview} alt="dispatch" style={{maxWidth:"100%",maxHeight:150,borderRadius:12,marginBottom:4,objectFit:"cover"}}/>}
<div style={{padding:"10px 14px",borderRadius:msg.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:msg.role==="user"?"#1c1917":"#f5f5f4",color:msg.role==="user"?"#fff":"#1c1917",fontSize:13,lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
{msg.role==="user"?(msg._text||"📷 Photo"):typeof msg.content==="string"?msg.content.replace(/```json[\s\S]*?```/g,"").trim():""}
</div>
{/* Parsed stops — show Add All button */}
{msg._stops&&msg._stops.length>0&&<ParsedStopsCard stops={msg._stops} onAddSelected={(selected)=>{
selected.forEach(s=>{
const cust=s.customer||"Emser Tile";
const cd=CUSTOMERS[cust];
const isHourly=cd?.rate_type==="hourly";
const rate=s.rate||0;
const fuelPct=(cd?.fuel_surcharge&&!cd?.fuel_included)?cd.fuel_surcharge:0;
addDel(cust,s.stop,isHourly?0:rate,0,{isHourly,weight:s.weight||0,note:s.note||null,fuelPct});
});
const custName=selected[0]?.customer||"Emser Tile";
showToast(selected.length+" "+custName+" stops added");
}}/>}
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
{chatImage&&<div style={{padding:"8px 16px 0",display:"flex",alignItems:"center",gap:8}}>
<div style={{position:"relative",display:"inline-block"}}>
{chatImage.mediaType==="application/pdf"?<div style={{width:60,height:60,borderRadius:8,background:"#fef2f2",border:"1px solid #fca5a5",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}><span style={{fontSize:20}}>📄</span><span style={{fontSize:8,color:"#dc2626",fontWeight:600}}>PDF</span></div>
:<img src={chatImage.preview} alt="upload" style={{height:60,borderRadius:8,objectFit:"cover"}}/>}
<button onClick={()=>setChatImage(null)} style={{position:"absolute",top:-4,right:-4,background:"#dc2626",color:"#fff",border:"none",borderRadius:10,width:20,height:20,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>✕</button>
</div>
<div><div style={{fontSize:11,color:"#16a34a",fontWeight:600}}>Ready to parse</div>{chatImage.fileName&&<div style={{fontSize:9,color:"#78716c",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{chatImage.fileName}</div>}</div>
</div>}
<div style={{padding:"8px 16px 20px",borderTop:"1px solid #e7e5e4",display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
<label style={{display:"flex",alignItems:"center",justifyContent:"center",width:40,height:40,background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:10,cursor:"pointer",flexShrink:0}} title="Take photo">
<span style={{fontSize:16}}>📷</span>
<input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{
if(e.target.files[0]){const f=e.target.files[0];const r=new FileReader();r.onload=ev=>{setChatImage({base64:ev.target.result.split(",")[1],preview:ev.target.result,mediaType:f.type||"image/jpeg",fileName:f.name});};r.readAsDataURL(f);}e.target.value="";
}}/>
</label>
<label style={{display:"flex",alignItems:"center",justifyContent:"center",width:40,height:40,background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:10,cursor:"pointer",flexShrink:0}} title="Upload file">
<span style={{fontSize:16}}>📎</span>
<input type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={e=>{
if(e.target.files[0]){const f=e.target.files[0];const r=new FileReader();r.onload=ev=>{
const isPdf=f.type==="application/pdf";
setChatImage({base64:ev.target.result.split(",")[1],preview:isPdf?null:ev.target.result,mediaType:f.type||"image/jpeg",fileName:f.name});
};r.readAsDataURL(f);}e.target.value="";
}}/>
</label>
<input value={chatInput} onChange={e=>setChatInput(e.target.value)}
onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
placeholder={chatImage?"Add note or send…":"Ask about routes, quotes…"}
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:12,padding:"12px 12px",fontSize:14,outline:"none",background:"#fafaf9",fontFamily:"inherit"}}/>
<button onClick={sendChat} disabled={(!chatInput.trim()&&!chatImage)||chatLoading}
style={{background:(chatInput.trim()||chatImage)&&!chatLoading?"#d97706":"#e7e5e4",color:(chatInput.trim()||chatImage)&&!chatLoading?"#fff":"#a8a29e",border:"none",borderRadius:12,padding:"12px 14px",cursor:(chatInput.trim()||chatImage)&&!chatLoading?"pointer":"default",fontSize:14,fontWeight:700,flexShrink:0}}>
{chatLoading?"…":"↑"}
</button>
</div>
</div>
</div>}

{/* Driver Link Modal — Mobile */}
{showLinkModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowLinkModal(null)}>
<div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
<div style={_s.flexBtwMb16}>
<h3 style={{margin:0,fontSize:17,fontWeight:700}}>🔗 {showLinkModal.name}'s Link</h3>
<button onClick={()=>setShowLinkModal(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#78716c",lineHeight:1}}>✕</button>
</div>
<p style={{fontSize:12,color:"#78716c",margin:"0 0 10px"}}>Send this link to {showLinkModal.name.split(" ")[0]} — they'll see only their stops, no pricing.</p>
<div style={{background:"#f5f5f4",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
<span style={{flex:1,fontSize:12,color:"#1c1917",wordBreak:"break-all",fontFamily:"monospace"}}>{showLinkModal.url}</span>
</div>
<div style={{display:"flex",flexDirection:"column",gap:8}}>
<button onClick={()=>{navigator.clipboard.writeText(showLinkModal.url).then(()=>{showToast("Link copied");setShowLinkModal(null);}).catch(()=>{const ta=document.createElement("textarea");ta.value=showLinkModal.url;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);showToast("Link copied");setShowLinkModal(null);});}}
style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",background:BRAND.main,color:"#fff",border:"none",borderRadius:12,padding:"13px 16px",cursor:"pointer",fontSize:14,fontWeight:700}}>
📋 Copy Link
</button>
{showLinkModal.phone&&<button onClick={()=>{window.open(`sms:${showLinkModal.phone}?&body=${encodeURIComponent("Here's your Davis Delivery driver link:\n"+showLinkModal.url)}`,"_blank");setShowLinkModal(null);}}
style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",background:"#16a34a",color:"#fff",border:"none",borderRadius:12,padding:"13px 16px",cursor:"pointer",fontSize:14,fontWeight:700}}>
💬 Text to {showLinkModal.name.split(" ")[0]}
</button>}
{!showLinkModal.phone&&<p style={{fontSize:11,color:"#a8a29e",textAlign:"center",margin:0}}>No phone number saved — add one in Drivers to enable texting.</p>}
</div>
</div>
</div>}

<style>{`@keyframes slideDown{from{transform:translate(-50%,-20px);opacity:0}to{transform:translate(-50%,0);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}button:active{transform:scale(0.97)}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}select{-webkit-appearance:none}`}</style>
</div>
);
}


/* No pricing. No other drivers. No dispatch controls. Just their stops. */
function DriverPage({driverSlug}){
const[wo,setWo]=useState(0);
const[sd,setSd]=useState(()=>{const d=new Date().getDay();return d>=1&&d<=5?d-1:0;});
const[log,setLog]=useState({});
const[toast,setToast]=useState(null);
const[pinEntry,setPinEntry]=useState("");
const[authenticated,setAuthenticated]=useState(false);
const getPin=(phone)=>{const digits=(phone||"").replace(/\D/g,"");return digits.length>=4?digits.slice(-4):"0000";};
const[sigStop,setSigStop]=useState(null);
const[shipPlanInputs,setShipPlanInputs]=useState({});
const[allDrivers,setAllDrivers]=useState(()=>lsGet(LS_DRIVERS,DEFAULT_DRIVERS));
const[fbLoaded,setFbLoaded]=useState(false);
const[driverNotifs,setDriverNotifs]=useState([]);
const[showDriverMsg,setShowDriverMsg]=useState(false);
const[driverMsgInput,setDriverMsgInput]=useState("");
const[driverMessages,setDriverMessages]=useState([]); /* private messages */
const[groupMessages,setGroupMessages]=useState([]); /* group channel */
const[driverMsgTab,setDriverMsgTab]=useState("private"); /* private | group */
const driverPosRef=useRef(null); /* {lat,lng} — driver's current GPS position */

/* Load Google Maps for ETA calculations */
useEffect(()=>{loadGoogleMaps();},[]);

const wd=getWeekDates(wo);const dk=`${wo}-${sd}`;const dl=log[dk]||[];
const showToast=useCallback(m=>{setToast(m);setTimeout(()=>setToast(null),2000);},[]);
const drvSaveTime=useRef(0);

/* Resolve driver from slug — checks live drivers first so any driver name works */
const driverId=resolveDriverSlug(driverSlug,allDrivers);
const driver=allDrivers.find(d=>d.id===driverId);
const entries=dl.filter(e=>e.driverId===driverId);

/* Firebase sync for driver page */
useEffect(()=>{
  const unsubDrivers=subscribeDrivers((fbDrivers)=>{
    if(fbDrivers.length>0){
      /* Only update if the current driver slug still resolves in the new list */
      const stillExists=fbDrivers.find(d=>getDriverSlug(d.name)===driverSlug.toLowerCase());
      if(stillExists){
        setAllDrivers(fbDrivers);
      } else {
        /* Merge: add any new drivers from Firebase but keep local ones */
        setAllDrivers(prev=>{
          const merged=[...prev];
          fbDrivers.forEach(fd=>{if(!merged.find(m=>m.id===fd.id))merged.push(fd);});
          return merged;
        });
      }
    }
    setFbLoaded(true);
  });
  /* If Firebase never loads (offline), mark loaded after timeout */
  const timeout=setTimeout(()=>setFbLoaded(true),5000);
  const unsubManifests=subscribeManifests(wo,(fbData)=>{
    setLog(prev=>{
      const updated={...prev};
      let changed=false;
      Object.entries(fbData).forEach(([fbKey,payload])=>{
        const dayIdx=payload.dayIdx;
        const lk=`${wo}-${dayIdx}`;
        const fbEnts=(payload.entries||[]).map(e=>{
          if(e.customer&&!e.isHourly&&e.stopType!=="pickup"){
            const cd=CUSTOMERS[e.customer];
            if(cd?.deliveries){
              const sd2=cd.deliveries.find(d=>typeof d!=="string"&&d.s===e.stop&&d.lg);
              if(sd2)return{...e,fuelPct:0,liftgateApplied:true,knownLiftgate:true,liftgateFee:e.liftgateFee||75};
            }
          }
          return e;
        });
        const localEnts=prev[lk]||[];
        /* If driver just saved, skip entirely */
        if(Date.now()-drvSaveTime.current<3000)return;
        /* Smart merge: accept structural changes from dispatch but preserve driver-set fields */
        const localById={};
        localEnts.forEach(e=>{localById[e.id]=e;});
        const merged=fbEnts.map(fbE=>{
          const localE=localById[fbE.id];
          if(!localE)return fbE;
          /* Preserve driver-set fields if local is more advanced */
          const out={...fbE};
          if(localE.status&&!fbE.status)out.status=localE.status;
          if(localE.status==="departed"&&fbE.status!=="departed"){out.status=localE.status;out.departedAt=localE.departedAt;}
          if(localE.status==="arrived"&&!fbE.status){out.status=localE.status;out.arrivedAt=localE.arrivedAt;}
          if(localE.arrivedAt&&!fbE.arrivedAt)out.arrivedAt=localE.arrivedAt;
          if(localE.departedAt&&!fbE.departedAt)out.departedAt=localE.departedAt;
          if((localE.photos||[]).length>0&&((fbE.photos||[]).length===0||(fbE.photos||[]).some(p=>typeof p==="string"&&p.startsWith("photo_"))))out.photos=localE.photos;
          if(localE.signature&&(!fbE.signature||fbE.signature==="signed"))out.signature=localE.signature;
          if(localE.eta&&!fbE.eta){out.eta=localE.eta;out.etaDest=localE.etaDest;}
          if(localE.shipPlan&&!fbE.shipPlan)out.shipPlan=localE.shipPlan;
          return out;
        });
        const mergedJson=JSON.stringify(merged);
        if(mergedJson!==JSON.stringify(localEnts)){
          updated[lk]=merged;
          changed=true;
        }
      });
      return changed?updated:prev;
    });
  });
  return()=>{unsubDrivers();unsubManifests();clearTimeout(timeout);};
},[wo]);

/* Subscribe to notifications for this driver */
useEffect(()=>{
  if(!driverId)return;
  const unsub=subscribeNotifications(driverId,(notifs)=>{setDriverNotifs(notifs);});
  return()=>unsub();
},[driverId]);

/* Subscribe to messages for this driver */
useEffect(()=>{
  if(!driverId)return;
  const unsubs=[];
  unsubs.push(subscribeMessages("dm-"+driverId,(msgs)=>{setDriverMessages(msgs);}));
  unsubs.push(subscribeMessages("group",(msgs)=>{setGroupMessages(msgs);}));
  return()=>unsubs.forEach(u=>u());
},[driverId]);

/* Request push permission after auth */
useEffect(()=>{
  if(authenticated&&driverId){
    requestPushPermission().then(token=>{
      if(token)saveDriverToken(driverId,token);
    });
  }
},[authenticated,driverId]);


useEffect(()=>{
  if(!authenticated||!driverId)return;
  let watchId=null;
  const sendPos=(pos)=>{
    driverPosRef.current={lat:pos.coords.latitude,lng:pos.coords.longitude,ts:Date.now()};
    saveDriverLocation(driverId,pos.coords.latitude,pos.coords.longitude).catch(()=>{});
  };
  /* Try watchPosition for continuous updates */
  if(navigator.geolocation){
    /* Send immediately */
    navigator.geolocation.getCurrentPosition(sendPos,()=>{},{enableHighAccuracy:true,timeout:10000});
    /* Then watch for movement */
    watchId=navigator.geolocation.watchPosition(sendPos,()=>{},{enableHighAccuracy:true,maximumAge:60000,timeout:30000});
  }
  /* Fallback: poll every 60 seconds */
  const interval=setInterval(()=>{
    if(navigator.geolocation){navigator.geolocation.getCurrentPosition(sendPos,()=>{},{enableHighAccuracy:false,timeout:10000});}
  },60000);
  return()=>{if(watchId!==null)navigator.geolocation.clearWatch(watchId);clearInterval(interval);};
},[authenticated,driverId]);

/* Save driver status updates back to Firestore (cloud only) */
const saveDriverLog=useCallback((newLog)=>{
  const entries2=newLog[dk]||[];
  drvSaveTime.current=Date.now();
  saveManifestDay(wo,sd,entries2).catch(e=>console.error("[DRV-SAVE] FAILED:",e));
},[dk,wo,sd]);

const updateStatus=(eid,status)=>{const now=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,status,arrivedAt:status==="arrived"?now:e.arrivedAt,departedAt:status==="departed"?now:e.departedAt}:e)};saveDriverLog(n);return n;});};
const addPhoto=(eid,dataUrl)=>{
if(window._fbOps?.uploadFile){
  fetch(dataUrl).then(r=>r.blob()).then(b=>{
    const path=`photos/${dk}/${eid}_${Date.now()}.jpg`;
    return window._fbOps.uploadFile(path,b);
  }).then(url=>{
    setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),url]}:e)};saveDriverLog(n);return n;});
  }).catch(()=>{
    setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),dataUrl]}:e)};saveDriverLog(n);return n;});
  });
}else{
  setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),dataUrl]}:e)};saveDriverLog(n);return n;});
}};
const addSignature=(eid,sig)=>{
if(window._fbOps?.uploadFile){
  fetch(sig).then(r=>r.blob()).then(b=>{
    const path=`signatures/${dk}/${eid}_${Date.now()}.png`;
    return window._fbOps.uploadFile(path,b);
  }).then(url=>{
    setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,signature:url}:e)};saveDriverLog(n);return n;});
  }).catch(()=>{
    setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,signature:sig}:e)};saveDriverLog(n);return n;});
  });
}else{
  setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,signature:sig}:e)};saveDriverLog(n);return n;});
}};
const setShipPlanD=(eid,num)=>setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,shipPlan:num}:e)};saveDriverLog(n);return n;});
const setEtaD=(eid,mins,dest)=>setLog(p=>{const n={...p,[dk]:(p[dk]||[]).map(e=>e.id===eid?{...e,eta:mins,etaDest:dest||null}:e)};saveDriverLog(n);return n;});
const calcAutoEta=(eid,destStop)=>{
  if(!driverPosRef.current){showToast("📍 Waiting for GPS...");return;}
  if(!window.google?.maps?.DistanceMatrixService){showToast("Maps not loaded");return;}
  const destAddr=destStop.addr||getAddr(destStop.stop);
  if(!destAddr){showToast("No address for "+destStop.stop);return;}
  const origin=new window.google.maps.LatLng(driverPosRef.current.lat,driverPosRef.current.lng);
  const svc=new window.google.maps.DistanceMatrixService();
  showToast("⏳ Calculating ETA...");
  svc.getDistanceMatrix({origins:[origin],destinations:[destAddr],travelMode:window.google.maps.TravelMode.DRIVING},(result,status)=>{
    if(status==="OK"&&result.rows[0]?.elements[0]?.status==="OK"){
      const dur=result.rows[0].elements[0].duration_in_traffic||result.rows[0].elements[0].duration;
      const mins=Math.round(dur.value/60);
      setEtaD(eid,String(mins),destStop.stop);
      showToast(`ETA: ${mins} min → ${destStop.stop.split(" - ")[0]}`);
    }else{
      console.error("[ETA] Distance Matrix failed:",status,result);
      showToast("ETA calc failed — enter manually");
    }
  });
};

const sendDriverMsg=()=>{
if(!driverMsgInput.trim()||!driver)return;
const now=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
const channelKey=driverMsgTab==="private"?"dm-"+driverId:"group";
const msg={from:"driver-"+driverId,fromName:driver.name,text:driverMsgInput.trim(),time:now,read:false};
saveMessage(channelKey,msg).catch(e=>console.error("Msg send FAILED:",e));
setDriverMsgInput("");
};

if(!driver){
if(!fbLoaded){
return(
<div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:BRAND.dark,color:"#fff",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:40}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<h1 style={{fontSize:24,fontWeight:800,margin:"0 0 8px"}}><img src={LOGO_WHITE} alt="Davis Delivery" style={{height:36,objectFit:"contain"}}/></h1>
<p style={{color:"#93c5fd",fontSize:14,margin:0}}>Loading...</p>
</div>
);
}
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
<div style={_s.flexBtw}>
<div>
<h1 style={{margin:0}}><img src={LOGO_WHITE} alt="Davis Delivery" style={{height:26,objectFit:"contain"}}/></h1>
<p style={{margin:"2px 0 0",fontSize:11,color:"#93c5fd",letterSpacing:"0.08em"}}>DRIVER MANIFEST</p>
<div style={{display:"flex",alignItems:"center",gap:3,marginTop:2}}><span style={{display:"inline-block",width:5,height:5,borderRadius:3,background:fbLoaded?"#16a34a":"#dc2626"}}/><span style={{fontSize:7,color:fbLoaded?"#6ee7b7":"#fca5a5"}}>{fbLoaded?"synced":"connecting..."}</span></div>
</div>
<button onClick={()=>{setAuthenticated(false);setPinEntry("");}} style={{background:"#292524",border:"1px solid #44403c",color:"#a8a29e",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11}}>Lock</button>
<button onClick={()=>setShowDriverMsg(true)} style={{background:BRAND.main,border:"none",color:"#fff",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>{"💬"}</button>
</div>
</div>

<div style={{padding:"16px 16px 0"}}>
<div style={_s.flexBtwMb8}>
<div>
<h2 style={{margin:0,fontSize:18,fontWeight:700}}>{driver.name}</h2>
<p style={{margin:0,fontSize:13,color:"#78716c"}}>{wd[sd].name} — {wd[sd].date}</p>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:22,fontWeight:700,color:"#16a34a"}}>{completed}/{total}</div>
<div style={_s.sub11}>completed</div>
</div>
</div>
{/* Day picker */}
<div style={{display:"flex",gap:4,marginBottom:12}}>
{["Mon","Tue","Wed","Thu","Fri"].map((day,i)=>{const isToday=wo===0&&i===(new Date().getDay()>=1&&new Date().getDay()<=5?new Date().getDay()-1:0);const isSelected=sd===i;const dayEntries=(log[`${wo}-${i}`]||[]).filter(e=>e.driverId===driverId);return(
<button key={i} onClick={()=>setSd(i)} style={{flex:1,padding:"8px 2px",borderRadius:8,border:isSelected?"2px solid "+BRAND.main:isToday?"2px solid #d97706":"1px solid #d6d3d1",background:isSelected?BRAND.main:"#fff",cursor:"pointer",textAlign:"center"}}>
<div style={{fontSize:11,fontWeight:700,color:isSelected?"#fff":isToday?"#d97706":"#57534e"}}>{day}</div>
<div style={{fontSize:10,fontWeight:600,color:isSelected?"#93c5fd":isToday?"#d97706":"#78716c"}}>{wd[i].date}</div>
<div style={{fontSize:9,color:isSelected?"#93c5fd":"#a8a29e"}}>{dayEntries.length>0?dayEntries.length+" stops":"—"}</div>
</button>
);})}
</div>
{/* Week nav */}
<div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:12}}>
<button onClick={()=>setWo(wo-1)} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:8,padding:"4px 12px",cursor:"pointer",fontSize:11,fontWeight:600,color:"#57534e"}}>← Prev Week</button>
{wo!==0&&<button onClick={()=>setWo(0)} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:8,padding:"4px 12px",cursor:"pointer",fontSize:11,fontWeight:600,color:"#2563eb"}}>This Week</button>}
<button onClick={()=>setWo(wo+1)} style={{background:"#f5f5f4",border:"1px solid #e7e5e4",borderRadius:8,padding:"4px 12px",cursor:"pointer",fontSize:11,fontWeight:600,color:"#57534e"}}>Next Week →</button>
</div>
<div style={{height:6,background:"#e7e5e4",borderRadius:3,marginBottom:16,overflow:"hidden"}}>
<div style={{height:"100%",background:"#16a34a",borderRadius:3,width:`${total?completed/total*100:0}%`,transition:"width 0.3s"}}/>
</div>
</div>

{/* Driver notifications from dispatch */}
{driverNotifs.filter(n=>!n.read).length>0&&<div style={{padding:"0 16px",marginBottom:4}}>
{driverNotifs.filter(n=>!n.read).slice(0,5).map(n=>{
const isRouteChange=n.type==="route_change"||n.msg?.includes("ROUTE CHANGED");
return(
<div key={n.id} style={{background:isRouteChange?"#fef2f2":"#fef3c7",border:isRouteChange?"2px solid #dc2626":"1px solid #fde68a",borderRadius:10,padding:"10px 14px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,animation:isRouteChange?"routeAlert 0.5s ease":"none"}}>
<div style={_s.f1}>
<div style={{fontSize:12,fontWeight:700,color:isRouteChange?"#dc2626":"#92400e"}}>{isRouteChange?"🔄 Route Changed":"📢 Dispatch"}</div>
<div style={{fontSize:12,color:"#1c1917",whiteSpace:"pre-wrap",marginTop:2}}>{n.msg||n.message||""}</div>
<div style={{fontSize:10,color:"#a8a29e",marginTop:4}}>{typeof n.time==="number"?new Date(n.time).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}):n.time}</div>
</div>
<button onClick={()=>markNotificationRead(driverId,n.id)} style={{background:isRouteChange?"#dc2626":"#f59e0b",color:"#fff",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,flexShrink:0}}>Got it</button>
</div>);})}
</div>}

{total===0&&<div style={_s.emptyState2}><div style={{fontSize:48,marginBottom:12}}>🚚</div><p style={{fontSize:16,fontWeight:600,margin:"0 0 4px"}}>No stops yet</p><p style={{fontSize:13,margin:0}}>Dispatch hasn't loaded your manifest yet.<br/>Pull down to refresh.</p></div>}

<div style={{padding:"0 16px 100px"}}>
{/* Leaving warehouse ETA */}
{entries.length>0&&!entries.some(e=>e.status==="arrived"||e.status==="departed")&&(
<div style={{background:"#fff",border:"2px solid "+BRAND.main,borderRadius:14,padding:"14px 16px",marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
<span style={{fontSize:18}}>{"🏠"}</span>
<div>
<div style={{fontSize:14,fontWeight:700,color:BRAND.main}}>Leaving Warehouse</div>
<div style={_s.sub11}>ETA to first stop: {entries[0].stop}</div>
</div>
</div>
<div style={{display:"flex",gap:6,alignItems:"center"}}>
<input placeholder="mins" type="number" inputMode="numeric" defaultValue={entries[0].eta||""} style={{width:70,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}
onBlur={e=>{if(e.target.value)setEtaD(entries[0].id,e.target.value,entries[0].stop);}}/>
<span style={{fontSize:12,color:"#78716c"}}>min to</span>
<span style={{fontSize:12,fontWeight:700,color:BRAND.main,flex:1}}>{entries[0].stop}</span>
</div>
<button onClick={()=>{
const destAddr=entries[0].addr||getAddr(entries[0].stop);
if(!destAddr){showToast("No address for "+entries[0].stop);return;}
const warehouseAddr="2095 Highway 211 NW, Braselton, GA 30517";
if(!window.google?.maps?.DistanceMatrixService){showToast("Maps not loaded — try again in a moment");return;}
showToast("⏳ Calculating from warehouse...");
const svc=new window.google.maps.DistanceMatrixService();
const origin=driverPosRef.current&&driverPosRef.current.ts&&(Date.now()-driverPosRef.current.ts)<900000?new window.google.maps.LatLng(driverPosRef.current.lat,driverPosRef.current.lng):warehouseAddr;
svc.getDistanceMatrix({origins:[origin],destinations:[destAddr],travelMode:window.google.maps.TravelMode.DRIVING},(result,status)=>{
if(status==="OK"&&result.rows[0]?.elements[0]?.status==="OK"){
const dur=result.rows[0].elements[0].duration_in_traffic||result.rows[0].elements[0].duration;
const mins=Math.round(dur.value/60);
setEtaD(entries[0].id,String(mins),entries[0].stop);
showToast("ETA: "+Math.floor(mins/60)+"h "+mins%60+"m (~"+new Date(Date.now()+mins*60000).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})+") → "+entries[0].stop.split(" - ")[0]);
}else{showToast("ETA calc failed");}
});
}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",marginTop:6,background:"#eff6ff",border:"2px solid #2563eb",borderRadius:10,padding:"10px 16px",cursor:"pointer",fontSize:13,fontWeight:700,color:"#2563eb"}}>
{"🚚 Calculate ETA to "+entries[0].stop.split(" - ")[0]}
</button>
{entries[0].eta&&entries[0].etaDest&&<div style={{marginTop:6,fontSize:11,color:BRAND.main,fontWeight:600}}>{"🚚"} {fmtEta(entries[0].eta)} → {entries[0].etaDest}</div>}
</div>
)}
{/* GPS Status */}
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 12px",marginBottom:8,background:driverPosRef.current&&driverPosRef.current.ts&&(Date.now()-driverPosRef.current.ts)<900000?"#f0fdf4":"#fef2f2",borderRadius:10,border:driverPosRef.current&&driverPosRef.current.ts&&(Date.now()-driverPosRef.current.ts)<900000?"1px solid #bbf7d0":"1px solid #fca5a5"}}>
<span style={{fontSize:11,color:driverPosRef.current&&driverPosRef.current.ts&&(Date.now()-driverPosRef.current.ts)<900000?"#16a34a":"#dc2626",fontWeight:600}}>
{driverPosRef.current&&driverPosRef.current.ts?(Date.now()-driverPosRef.current.ts)<900000?"📍 GPS Active":"⚠ GPS Stale ("+Math.round((Date.now()-driverPosRef.current.ts)/60000)+"m ago)":"📍 No GPS"}
</span>
<button onClick={()=>{if(navigator.geolocation){showToast("📍 Getting location...");navigator.geolocation.getCurrentPosition(pos=>{driverPosRef.current={lat:pos.coords.latitude,lng:pos.coords.longitude,ts:Date.now()};saveDriverLocation(driverId,pos.coords.latitude,pos.coords.longitude).catch(()=>{});showToast("📍 Location updated!");},err=>{showToast("GPS error: "+err.message);},{enableHighAccuracy:true,timeout:10000});}else{showToast("GPS not available");}}} style={{background:"#fff",border:"1px solid #d6d3d1",borderRadius:6,padding:"4px 10px",fontSize:10,fontWeight:700,cursor:"pointer",color:"#57534e"}}>🔄 Refresh GPS</button>
</div>
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
{!isPickup&&<span style={_s.tag9Green}>DELIVERY</span>}
{entry.priority&&<span style={_s.tag9Amber}>PRIORITY</span>}
{departed&&<span style={_s.tag9Green}>DONE</span>}
{arrived&&!departed&&<span style={_s.tag9Amber}>ON SITE</span>}
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
{entry.shipPlan&&<div style={{marginTop:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"6px 12px"}}><span style={{fontSize:10,color:"#16a34a",fontWeight:600}}>Ship Plan #:</span> <span style={_s.bold14}>{entry.shipPlan}</span></div>}
{/* NO note shown — notes often contain pricing info */}
{addr&&<a href={`https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`} target="_blank" rel="noopener"
style={{display:"inline-flex",alignItems:"center",gap:6,background:BRAND.main,color:"#fff",border:"none",borderRadius:10,padding:"10px 16px",cursor:"pointer",fontSize:13,fontWeight:600,marginTop:8,textDecoration:"none",width:"100%",justifyContent:"center"}}>
🧭 Get Directions
</a>}
{/* ETA to Next Stop — always visible for non-departed stops */}
{!departed&&i<entries.length-1&&(()=>{
const nextStop=entries.slice(i+1).find(e=>e.status!=="departed");
if(!nextStop)return null;
const nextAddr=nextStop.addr||getAddr(nextStop.stop);
return(<button onClick={()=>{
  if(!nextAddr){showToast("No address for "+nextStop.stop);return;}
  const curAddr=entry.addr||getAddr(entry.stop);
  const originParam=driverPosRef.current&&driverPosRef.current.ts&&(Date.now()-driverPosRef.current.ts)<900000
    ?new window.google.maps.LatLng(driverPosRef.current.lat,driverPosRef.current.lng)
    :curAddr;
  if(!originParam){showToast("No origin address");return;}
  if(!window.google?.maps?.DistanceMatrixService){showToast("Maps not loaded");return;}
  showToast("⏳ Calculating ETA...");
  const svc=new window.google.maps.DistanceMatrixService();
  svc.getDistanceMatrix({origins:[originParam],destinations:[nextAddr],travelMode:window.google.maps.TravelMode.DRIVING},(result,status)=>{
    if(status==="OK"&&result.rows[0]?.elements[0]?.status==="OK"){
      const dur=result.rows[0].elements[0].duration_in_traffic||result.rows[0].elements[0].duration;
      const mins=Math.round(dur.value/60);
      setEtaD(entry.id,String(mins),nextStop.stop);
      showToast("ETA: "+Math.floor(mins/60)+"h "+mins%60+"m (~"+new Date(Date.now()+mins*60000).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})+") → "+nextStop.stop.split(" - ")[0]);
    }else{showToast("ETA calc failed — try again");}
  });
}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",marginTop:6,background:"#eff6ff",border:"2px solid #2563eb",borderRadius:10,padding:"10px 16px",cursor:"pointer",fontSize:13,fontWeight:700,color:"#2563eb"}}>
{"🚚 Get ETA to "+nextStop.stop.split(" - ")[0]}
</button>);
})()}
{(entry.arrivedAt||entry.departedAt||entry.eta)&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>
{entry.arrivedAt&&<span style={{fontSize:12,fontWeight:700,color:"#16a34a",background:"#f0fdf4",padding:"4px 10px",borderRadius:8,border:"1px solid #bbf7d0"}}>📍 Arrived {entry.arrivedAt}</span>}
{entry.departedAt&&<span style={{fontSize:12,fontWeight:700,color:"#16a34a",background:"#dcfce7",padding:"4px 10px",borderRadius:8,border:"1px solid #86efac"}}>✅ Departed {entry.departedAt}</span>}
{entry.eta&&<span style={{fontSize:12,fontWeight:700,color:"#2563eb",background:"#eff6ff",padding:"4px 10px",borderRadius:8,border:"1px solid #bfdbfe"}}>🚚 {fmtEta(entry.eta)}{entry.etaDest?" → "+entry.etaDest:""}</span>}
</div>}
<div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
{!arrived&&<button onClick={()=>{updateStatus(entry.id,"arrived");showToast("Arrived ✓");}} style={{flex:1,background:"#f59e0b",color:"#fff",border:"none",borderRadius:10,padding:"10px",cursor:"pointer",fontSize:13,fontWeight:600}}>Arrived</button>}
{arrived&&!departed&&<button onClick={()=>{if(!canDepart)return;updateStatus(entry.id,"departed");showToast("Departed ✓");}} style={{flex:1,background:canDepart?"#16a34a":"#a8a29e",color:"#fff",border:"none",borderRadius:10,padding:"10px",cursor:canDepart?"pointer":"not-allowed",fontSize:13,fontWeight:600}}>{canDepart?"Departed":"Enter Ship Plan # First"}</button>}
{arrived&&(
<div style={{width:"100%",marginTop:4}}>
<div style={{display:"flex",gap:6,marginBottom:4}}>
<select defaultValue={entry.etaDest||""} onChange={e=>{const dest=e.target.value;if(!dest)return;const nextEntry=entries.find(ne=>ne.stop===dest);const destObj=nextEntry||{stop:dest,addr:dest==="Davis Warehouse"?"Buford, GA":""};if(!destObj.addr&&!getAddr(destObj.stop)){showToast("No address for "+dest);return;}
/* Calculate ETA — use GPS if available, otherwise use current stop address as origin */
const destAddr=destObj.addr||getAddr(destObj.stop);
const doCalc=(originParam)=>{
  if(!window.google?.maps?.DistanceMatrixService){setEtaD(entry.id,"?",dest);showToast("Maps not loaded");return;}
  showToast("⏳ Calculating ETA...");
  const svc=new window.google.maps.DistanceMatrixService();
  svc.getDistanceMatrix({origins:[originParam],destinations:[destAddr],travelMode:window.google.maps.TravelMode.DRIVING},(result,status)=>{
    if(status==="OK"&&result.rows[0]?.elements[0]?.status==="OK"){
      const dur=result.rows[0].elements[0].duration_in_traffic||result.rows[0].elements[0].duration;
      const mins=Math.round(dur.value/60);
      setEtaD(entry.id,String(mins),dest);
      showToast("ETA: "+Math.floor(mins/60)+"h "+mins%60+"m (~"+new Date(Date.now()+mins*60000).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})+") → "+dest.split(" - ")[0]);
    }else{setEtaD(entry.id,"?",dest);showToast("ETA calc failed");}
  });
};
if(driverPosRef.current&&driverPosRef.current.ts&&(Date.now()-driverPosRef.current.ts)<900000){doCalc(new window.google.maps.LatLng(driverPosRef.current.lat,driverPosRef.current.lng));}
else{const curAddr=entry.addr||getAddr(entry.stop);if(curAddr){showToast("📍 Using current stop address (GPS stale)");doCalc(curAddr);}else{setEtaD(entry.id,"?",dest);showToast("No fresh GPS & no address");}}
}}
style={{flex:1,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:12,outline:"none",background:"#fff",color:entry.etaDest?"#1c1917":"#a8a29e"}}>
<option value="">ETA to where?</option>
{entries.filter((_,ei)=>ei>i&&_.status!=="departed").map(ne=><option key={ne.id} value={ne.stop}>{ne.stop}</option>)}
<option value="Davis Warehouse">{"🏠 Davis Warehouse"}</option>
</select>
<input placeholder="mins" type="number" inputMode="numeric" defaultValue={entry.eta||""} style={{width:70,border:"1px solid #d6d3d1",borderRadius:8,padding:"8px",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}
onBlur={e=>{if(e.target.value){const select=e.target.parentElement.querySelector("select");const dest=select?select.value:"";setEtaD(entry.id,e.target.value,dest||entry.etaDest);}}}/>
</div>
<div style={_s.flexG6}>
<label style={{display:"flex",alignItems:"center",gap:4,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#2563eb",flex:1,justifyContent:"center"}}>
{"📷"} Photo
<input type="file" accept="image/*" capture="environment" style={{display:"none"}}
onChange={e=>{if(e.target.files[0]){const r=new FileReader();r.onload=ev=>addPhoto(entry.id,ev.target.result);r.readAsDataURL(e.target.files[0]);}}}/>
</label>
<button onClick={()=>setSigStop(entry.id)} style={{background:"#f3e8f9",border:"1px solid #d8b4fe",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#7c3aed",flex:1}}>{"✍"} Sign</button>
</div>
{/* Liftgate request */}
{arrived&&!departed&&!entry.liftgateApplied&&<button onClick={()=>{
sendNotificationToDriver(0,"🔄 LIFTGATE REQUEST from "+(driver?.name||"driver")+"\nStop: "+entry.stop+"\nApply $75 liftgate charge?","liftgate_request").catch(()=>{});
showToast("Liftgate request sent to dispatch");
}} style={{width:"100%",marginTop:6,background:"#fff7ed",border:"2px solid #fed7aa",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:700,color:"#ea580c",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
🔄 Liftgate Required (+$75)
</button>}
{entry.liftgateApplied&&<div style={{width:"100%",marginTop:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 12px",textAlign:"center",fontSize:11,fontWeight:600,color:"#16a34a"}}>✓ Liftgate charge approved (+$75)</div>}
</div>
)}
</div>
{entry.photos&&entry.photos.length>0&&(
<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
{entry.photos.map((p,pi)=><img key={pi} src={p} alt="delivery" style={{width:60,height:60,objectFit:"cover",borderRadius:8,border:"1px solid #e7e5e4"}}/>)}
</div>
)}
{entry.signature&&<div style={{marginTop:8,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 12px"}}><span style={{fontSize:10,color:"#16a34a",fontWeight:600}}>Received by:</span> <span style={_s.bold14}>{entry.signature}</span></div>}
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
<div style={_s.flexBtwMb10}>
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
