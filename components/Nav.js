"use client";import Link from "next/link";import {usePathname} from "next/navigation";import {useState} from "react";
const L=[["/inbox","Inbox"],["/contacts","Contacts"],["/templates","Templates"],["/broadcasts","Broadcasts"],["/automations","Automations"],["/","Analytics"],["/settings","Settings"]];
export default function Nav(){const p=usePathname();const [o,setO]=useState(false);
 return <header className="bg-ink text-paper sticky top-0 z-20" style={{paddingTop:"env(safe-area-inset-top)"}}>
  <div className="flex items-center justify-between px-4 h-14"><span className="font-bold text-lg">Relay<span className="text-signal">.</span></span>
  <button className="md:hidden min-h-11 min-w-11" aria-label="Menu" onClick={()=>setO(!o)}>☰</button>
  <nav className="hidden md:flex gap-1">{L.map(([h,t])=><Link key={h} href={h} className={`px-3 py-2 rounded-lg ${p===h?"bg-paper/15":""}`}>{t}</Link>)}</nav></div>
  {o&&<nav className="md:hidden flex flex-col pb-2">{L.map(([h,t])=><Link key={h} href={h} onClick={()=>setO(false)} className="px-4 py-3">{t}</Link>)}</nav>}</header>;}
