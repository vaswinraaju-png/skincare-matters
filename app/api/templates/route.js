import {admin} from "@/lib/db";import {listTemplates,createTemplate} from "@/lib/meta";
async function ws(id){return (await admin().from("workspaces").select("*").eq("id",id).single()).data;}
export async function GET(req){const id=new URL(req.url).searchParams.get("workspace_id");const w=await ws(id);const {data}=await listTemplates(w);
 const rows=data.map(t=>({workspace_id:id,meta_id:t.id,name:t.name,language:t.language,category:t.category,status:t.status,components:t.components}));
 await admin().from("templates").upsert(rows,{onConflict:"workspace_id,name,language"});return Response.json(rows);}
export async function POST(req){const {workspace_id,name,language,category,body}=await req.json();
 try{const r=await createTemplate(await ws(workspace_id),{name,language,category,components:[{type:"BODY",text:body}]});
 await admin().from("templates").insert({workspace_id,meta_id:r.id,name,language,category,status:r.status,components:[{type:"BODY",text:body}]});return Response.json(r);}catch(e){return Response.json({error:e.message},{status:400});}}
