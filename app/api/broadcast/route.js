import {admin} from "@/lib/db";import {sendTemplate} from "@/lib/meta";
export async function runBroadcast(db,b){const {data:ws}=await db.from("workspaces").select("*").eq("id",b.workspace_id).single();
 let q=db.from("contacts").select("*").eq("workspace_id",b.workspace_id).eq("opted_in",true);if(b.tag)q=q.contains("tags",[b.tag]);const {data:cs}=await q;
 await db.from("broadcasts").update({status:"sending"}).eq("id",b.id);
 for(const c of cs||[]){try{const r=await sendTemplate(ws,c.phone,b.template_name,b.language);await db.from("messages").insert({workspace_id:b.workspace_id,contact_id:c.id,wamid:r.messages[0].id,direction:"out",type:"template",body:`[template] ${b.template_name}`,status:"sent",broadcast_id:b.id});}
  catch(e){await db.from("messages").insert({workspace_id:b.workspace_id,contact_id:c.id,direction:"out",type:"template",body:e.message,status:"failed",broadcast_id:b.id});}
  await new Promise(r=>setTimeout(r,60));}
 await db.from("broadcasts").update({status:"sent"}).eq("id",b.id);}
export async function POST(req){const b=await req.json();const db=admin();const {data}=await db.from("broadcasts").insert({...b,status:b.scheduled_at?"scheduled":"sending"}).select().single();
 if(!b.scheduled_at)runBroadcast(db,data);return Response.json(data);}
