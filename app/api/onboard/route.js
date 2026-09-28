import {admin} from "@/lib/db";import {exchangeCode,subscribeApp,registerPhone} from "@/lib/meta";
export async function POST(req){const {code,waba_id,phone_number_id,name,user_id}=await req.json();
 try{const access_token=await exchangeCode(code);const db=admin();
  const {data:ws}=await db.from("workspaces").insert({name,waba_id,phone_number_id,access_token}).select().single();
  await db.from("members").insert({workspace_id:ws.id,user_id,role:"owner"});
  await subscribeApp(ws);try{await registerPhone(ws,"000000");}catch{}
  return Response.json({id:ws.id});}catch(e){return Response.json({error:e.message},{status:400});}}
