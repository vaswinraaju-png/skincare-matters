import {admin} from "@/lib/db";import {sendText,sendTemplate} from "@/lib/meta";
export async function GET(req){const p=new URL(req.url).searchParams;return p.get("hub.verify_token")===process.env.WEBHOOK_VERIFY_TOKEN?new Response(p.get("hub.challenge")):new Response("no",{status:403});}
export async function POST(req){
 const db=admin();const body=await req.json();
 for(const e of body.entry||[])for(const ch of e.changes||[]){const v=ch.value;
  const {data:ws}=await db.from("workspaces").select("*").eq("phone_number_id",v.metadata?.phone_number_id).single();if(!ws)continue;
  for(const s of v.statuses||[])await db.from("messages").update({status:s.status}).eq("wamid",s.id);
  for(const m of v.messages||[]){
   const name=v.contacts?.[0]?.profile?.name;
   const {data:existing}=await db.from("contacts").select("id").eq("workspace_id",ws.id).eq("phone",m.from).maybeSingle();
   const {data:c}=await db.from("contacts").upsert({workspace_id:ws.id,phone:m.from,name,last_inbound_at:new Date()},{onConflict:"workspace_id,phone"}).select().single();
   const text=m.text?.body||m.button?.text||m.interactive?.button_reply?.title||`[${m.type}]`;
   await db.from("messages").insert({workspace_id:ws.id,contact_id:c.id,wamid:m.id,direction:"in",type:m.type,body:text,status:"received"});
   if(/^(stop|unsubscribe)$/i.test(text.trim())){await db.from("contacts").update({opted_in:false}).eq("id",c.id);continue;}
   const {data:autos}=await db.from("automations").select("*").eq("workspace_id",ws.id).eq("active",true);
   for(const a of autos||[]){
    if(a.kind==="welcome"&&!existing)await reply(db,ws,c,a.reply);
    if(a.kind==="keyword"&&text.toLowerCase().includes(a.keyword?.toLowerCase()))await reply(db,ws,c,a.reply);
    if(a.kind==="drip"&&!existing)await db.from("drip_queue").insert({automation_id:a.id,contact_id:c.id,run_at:new Date(Date.now()+a.delay_hours*36e5)});
   }}}
 return Response.json({ok:true});}
async function reply(db,ws,c,body){const r=await sendText(ws,c.phone,body);await db.from("messages").insert({workspace_id:ws.id,contact_id:c.id,wamid:r.messages[0].id,direction:"out",type:"text",body,status:"sent"});}
