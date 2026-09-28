import {admin} from "@/lib/db";import {sendText,sendTemplate,in24h} from "@/lib/meta";
export async function POST(req){const {workspace_id,contact_id,text,template,language}=await req.json();const db=admin();
 const {data:ws}=await db.from("workspaces").select("*").eq("id",workspace_id).single();const {data:c}=await db.from("contacts").select("*").eq("id",contact_id).single();
 try{let r,body=text;
  if(template)r=await sendTemplate(ws,c.phone,template,language),body=`[template] ${template}`;
  else{if(!in24h(c))return Response.json({error:"24 hour window closed. Send a template instead."},{status:400});r=await sendText(ws,c.phone,text);}
  await db.from("messages").insert({workspace_id,contact_id,wamid:r.messages[0].id,direction:"out",type:template?"template":"text",body,status:"sent"});
  return Response.json({ok:true});}catch(e){return Response.json({error:e.message},{status:400});}}
