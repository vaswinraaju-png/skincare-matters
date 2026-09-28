"use client";import {useEffect,useState} from "react";import {sb,useWs} from "@/components/useWs";
export default function A(){const ws=useWs();const [s,setS]=useState({});
 useEffect(()=>{if(!ws)return;sb.from("messages").select("status,direction").eq("workspace_id",ws.id).then(({data=[]})=>{const o={};data.forEach(m=>{const k=m.direction==="in"?"replied":m.status;o[k]=(o[k]||0)+1});setS(o);});},[ws]);
 if(!ws)return <div className="py-16"><h1 className="text-2xl font-bold mb-2">Connect a WhatsApp number to start</h1><a className="btn inline-flex items-center" href="/settings">Connect number</a></div>;
 const sent=(s.sent||0)+(s.delivered||0)+(s.read||0);const rows=[["Sent",sent],["Delivered",(s.delivered||0)+(s.read||0)],["Read",s.read||0],["Replies",s.replied||0],["Failed",s.failed||0]];
 return <><h1 className="text-2xl font-bold mb-4">{ws.name}</h1><div className="grid grid-cols-2 md:grid-cols-5 gap-3">{rows.map(([k,v])=><div key={k} className="bg-white border-l-4 border-signal p-4"><div className="text-3xl font-bold">{v}</div><div className="text-sm opacity-70">{k}</div></div>)}</div>
 <p className="mt-4 text-sm opacity-70">Read rate {sent?Math.round((s.read||0)/sent*100):0}%</p></>;}
