# Hosting & deploy target

Type: grilling
Status:

## Question

Lock where and how Aasoo Macrame will run in production: user said "domestic solutions" and declined Vercel/serverless (Q11). Decide the concrete host (a domestic VPS such as ArvanCloud/Hetzner, a shared host, another self-host), the Next.js build+run method (standalone Node server, PM2/systemd), reverse proxy/TLS, and how the SQLite file is persisted/backed up, and where env vars (admin password, Telegram bot token, chat_id) live.

## Notes

- Self-hosted long-running server → Next route handlers fine.
- SQLite→Postgres swap later (Q14) — pick host/ops that won't block that.
- This is a decision only the user can make (domestic provider preference) — grilling, not research.
