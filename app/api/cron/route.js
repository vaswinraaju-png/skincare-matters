import {admin} from "@/lib/db";import {sendTemplate} from "@/lib/meta";import {runBroadcast} from "../broadcast/route";
export async function GET(req){if(req.headers.get("authorization")!==`Bearer ${process.env.CRON_SECRET}`)return new Response("no",{status:401});const db=admin();const now=new Date().toISOString();
 const {data:bs}=await db.from("broadcasts").select("*").eq("status","scheduled").lte("scheduled_at",now);for(const b of bs||[])await runBroadcast(db,b);
 const {data:ds}=await db.from("drip_queue").select("*,automations(*,workspaces(*)),contacts(*)").eq("done",false).lte("run_at",now);
 for(const d of ds||[]){try{if(d.contacts.opted_in)await sendTemplate(d.automations.workspaces,d.contacts.phone,d.automations.template_name);}catch{}await db.from("drip_queue").update({done:true}).eq("id",d.id);}
 return Response.json({broadcasts:bs?.length,drips:ds?.length});}
