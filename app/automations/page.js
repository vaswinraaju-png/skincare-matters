"use client";import {useEffect,useState} from "react";import {sb,useWs} from "@/components/useWs";
export default function A(){const ws=useWs();const [rows,setRows]=useState([]);const [f,setF]=useState({kind:"keyword",keyword:"",reply:"",template_name:"",delay_hours:24});
 const load=()=>ws&&sb.from("automations").select("*").eq("workspace_id",ws.id).then(({data})=>setRows(data||[]));useEffect(load,[ws]);
 const add=async()=>{await sb.from("automations").insert({...f,workspace_id:ws.id});load();};
 const toggle=async a=>{await sb.from("automations").update({active:!a.active}).eq("id",a.id);load();};
 return <><h1 className="text-2xl font-bold mb-4">Automations</h1>
 <div className="bg-white p-4 grid md:grid-cols-4 gap-2 mb-4"><select className="inp" value={f.kind} onChange={e=>setF({...f,kind:e.target.value})}><option value="keyword">Keyword reply</option><option value="welcome">Welcome message</option><option value="drip">Drip (template after delay)</option></select>
 {f.kind==="keyword"&&<input className="inp" placeholder="When message contains" value={f.keyword} onChange={e=>setF({...f,keyword:e.target.value})}/>}
 {f.kind==="drip"?<><input className="inp" placeholder="Approved template name" value={f.template_name} onChange={e=>setF({...f,template_name:e.target.value})}/><input type="number" className="inp" value={f.delay_hours} onChange={e=>setF({...f,delay_hours:+e.target.value})} aria-label="Delay hours"/></>:<input className="inp md:col-span-2" placeholder="Reply text" value={f.reply} onChange={e=>setF({...f,reply:e.target.value})}/>}
 <button className="btn" onClick={add}>Add automation</button></div>
 <div className="grid gap-2">{rows.map(a=><div key={a.id} className="bg-white p-4 flex justify-between items-center gap-3"><div className="min-w-0 break-words"><b>{a.kind}</b> {a.keyword&&`"${a.keyword}"`} {a.reply||`${a.template_name} after ${a.delay_hours}h`}</div><button className="btn-ghost" onClick={()=>toggle(a)}>{a.active?"Pause":"Resume"}</button></div>)}</div></>;}
