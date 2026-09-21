# Aasoo Macrame — wayfinder map

## Destination

A build-ready spec for **Aasoo Macrame**: a Persian-only, RTL e-commerce MVP in Next.js App Router + shadcn/ui (Tailwind + Radix). SQLite catalog + cart + COD orders (orders persisted to DB and pushed to Telegram), a single-password admin page, flat domestic shipping, Persian digits/toman, IRAN Sans font (supplied by user), real product images, self-hosted domestically. The spec is handed off for execution by an agent.

## Notes

- Trackers: local markdown (`.scratch/`). Map + child ticket files.
- Domain: e-commerce, handmade macrame, Persian RTL, Iran market.
- Self-hosted (user declined Vercel/serverless) → long-running server; Next route handlers fine; admin guarded by env-set password.
- Cost/scope: solo dev; keep MVP lean; execution is a later effort.
- Skills to consult on tickets: grilling, domain-modeling; prototype for visual direction.

## Decisions so far

<!-- index: one line per resolved ticket (closed = resolved in this map's own child ticket files) -->
- [01 Visual direction & home/product prototype](issues/01-visual-direction-prototype.md): Variant A "Editorial gallery" wins — full-bleed hero, horizontal strip, story band, minimal footer; warm earthy palette, RTL, amber accent, real product/hero images, IRAN Sans font.
- [02 Domain glossary & data model](issues/02-domain-glossary-data-model.md): Drizzle ORM, SQLite-first→Postgres-later (ADR 0001). Product holds availability + leadTimeDays, display-only variants, integer-toman prices; Order is guest COD with no paid state and snapshot OrderItems; flat shipping rate snapshotted; custom orders via contact link, no entity.
- [04 Order system: COD + Telegram alert](issues/04-order-system-cod-telegram.md): guest checkout → Order+OrderItems in SQLite (status `new`) → route handler pushes Persian summary to Telegram (bot token + chat_id via env). Status moves via admin page; DB is source of truth, Telegram alert-only. Client-side cart, no reservation.
- [05 Admin page scope](issues/05-admin-page-scope.md): single env-password login, order list/detail + status moves, product CRUD. Analytics/reservation/multi-user deferred.
- [03 Stack, RTL & Persian setup](issues/03-stack-rtl-persian-setup.md): Next App Router + TS, shadcn/ui on Tailwind+Radix, IRAN Sans via next/font/local (user supplies), RTL + `fa` locale, Persian digits + full-toman via Intl fa-IR; Persian dates; lucide icons.
- [06 Brand contact touchpoints](issues/06-brand-contact-touchpoints.md): Instagram + Telegram in header/footer + contact page; placeholder handles (t.me/aasoomacrame, instagram.com/aasoo_macrame) to be corrected pre-build; custom requests via global contact link to Telegram.

## Not yet specified

- SQLite→Postgres migration path (data volume/shape concerns; deferred until store grows — currently sub-scale for a ticket).
- Image asset pipeline (naming, sizing, storage location for self-host) — deferred, surfaces during prototyping.

## Out of scope

- Online payment gateway (Zarinpal etc.) — phase 2, COD is the MVP payment model. (Q4)
- Multi-language / English toggle — Persian-only MVP. (Q26)
- Multi-seller marketplace — single-seller store. (Q3)
- Blog/SEO content section — links + product SEO only. (Q20)
- Customer accounts / auth — guest checkout only. (glossary #5)
- Configurable shipping calculator (weight-based) — flat domestic postage. (Q19)
- Reservation/locking of one-of-a-kind inventory at cart — reconciled manually in chat. (glossary #2)
