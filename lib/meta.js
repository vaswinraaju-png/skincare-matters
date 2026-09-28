const G=process.env.GRAPH||"https://graph.facebook.com/v21.0";
async function call(path,token,opts={}){const r=await fetch(`${G}/${path}`,{...opts,headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"}});const j=await r.json();if(j.error)throw new Error(j.error.message);return j;}
export const sendText=(ws,to,body)=>call(`${ws.phone_number_id}/messages`,ws.access_token,{method:"POST",body:JSON.stringify({messaging_product:"whatsapp",to,type:"text",text:{body}})});
export const sendTemplate=(ws,to,name,language="en",components=[])=>call(`${ws.phone_number_id}/messages`,ws.access_token,{method:"POST",body:JSON.stringify({messaging_product:"whatsapp",to,type:"template",template:{name,language:{code:language},components}})});
export const listTemplates=ws=>call(`${ws.waba_id}/message_templates?limit=200`,ws.access_token);
export const createTemplate=(ws,t)=>call(`${ws.waba_id}/message_templates`,ws.access_token,{method:"POST",body:JSON.stringify(t)});
export async function exchangeCode(code){const u=`${G}/oauth/access_token?client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&code=${code}`;const j=await(await fetch(u)).json();if(j.error)throw new Error(j.error.message);return j.access_token;}
export const subscribeApp=(ws)=>call(`${ws.waba_id}/subscribed_apps`,ws.access_token,{method:"POST"});
export const registerPhone=(ws,pin)=>call(`${ws.phone_number_id}/register`,ws.access_token,{method:"POST",body:JSON.stringify({messaging_product:"whatsapp",pin})});
export const in24h=c=>c?.last_inbound_at&&Date.now()-new Date(c.last_inbound_at)<864e5;
