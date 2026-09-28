"use client";import {useState} from "react";import Script from "next/script";import {sb,useWs} from "@/components/useWs";
export default function S(){const ws=useWs();const [msg,setMsg]=useState("");const [name,setName]=useState("");let info={};
 const connect=()=>{window.addEventListener("message",e=>{if(!e.origin.endsWith("facebook.com"))return;try{const d=JSON.parse(e.data);if(d.type==="WA_EMBEDDED_SIGNUP"&&d.event==="FINISH")info=d.data;}catch{}});
  window.FB.login(async r=>{if(!r.authResponse?.code)return setMsg("Signup was cancelled.");const {data:{user}}=await sb.auth.getUser();
   const j=await(await fetch("/api/onboard",{method:"POST",body:JSON.stringify({code:r.authResponse.code,waba_id:info.waba_id,phone_number_id:info.phone_number_id,name,user_id:user?.id})})).json();setMsg(j.error||"Number connected.");},
   {config_id:process.env.NEXT_PUBLIC_META_CONFIG_ID,response_type:"code",override_default_response_type:true,extras:{sessionInfoVersion:"3"}});};
 return <><Script src="https://connect.facebook.net/en_US/sdk.js" onLoad={()=>window.FB.init({appId:process.env.NEXT_PUBLIC_META_APP_ID,version:"v21.0"})}/>
 <h1 className="text-2xl font-bold mb-4">Settings</h1>
 {ws?<div className="bg-white p-4"><b>{ws.name}</b><p className="text-sm">WABA {ws.waba_id}, phone ID {ws.phone_number_id}</p></div>:
 <div className="bg-white p-4 grid gap-2 max-w-md"><input className="inp" placeholder="Business name" value={name} onChange={e=>setName(e.target.value)}/><button className="btn" onClick={connect}>Connect WhatsApp number</button></div>}
 {msg&&<p className="mt-3">{msg}</p>}
 <p className="mt-6 text-sm opacity-70">Webhook URL: /api/webhook. Subscribe to messages field in your Meta app.</p></>;}
