# Relay: WABA platform
1. Supabase: run supabase/schema.sql, enable Realtime on `messages`, enable email auth.
2. Meta app: add WhatsApp product + Facebook Login for Business, create Embedded Signup config, set webhook to https://YOURDOMAIN/api/webhook (verify token = WEBHOOK_VERIFY_TOKEN), subscribe `messages`.
3. Copy .env.example to .env.local, fill values.
4. npm i && npm run dev. Deploy on Vercel (cron in vercel.json hits /api/cron every 5 min with CRON_SECRET).
Note: add a login page (Supabase auth UI) before production. Opt-out keywords STOP/UNSUBSCRIBE handled automatically.
