# Order system: COD + Telegram alert

Type: grilling
Status: resolved

## Answer

Checkout + order flow locked (depends on the 02 data model):

- **Checkout**: guest form (name, phone, address, notes) + order summary. No account, no inventory reservation (glossary). Cart is client-held until checkout (see validation below for why no server cart).
- **Order placement**: on submit, server creates the Order + OrderItems in SQLite, status `new`, flat shipping snapshotted in; then a route handler pushes a formatted Persian summary (order ref, items, qty, total toman, customer contact) to the Telegram channel.
- **Status moves**: `new` → `confirmed` → `shipped` → `delivered` | `cancelled`, driven by the maker from the **admin page** (05, in MVP). Telegram is alert-only; the DB is source of truth.
- **Telegram mechanism**: a bot token + chat_id, both via env, sending via `sendMessage` to the Telegram Bot API. Only the maker provisions these (see hand-off).

Hand-off for execution: maker creates a Telegram bot (@BotFather) and supplies `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`.

Constraint added: cart state is client-side; the DB write happens once at checkout. To keep order totals truthful we rely on the OrderItem price snapshot, so catalog edits don't rewrite placed orders. No server-side cart session in the MVP.

Blocked by: 02

## Question

Lock the checkout + order flow: guest checkout form (name, phone, address, notes — glossary #5), cart without inventory reservation (glossary #2), COD order placed → order persisted to SQLite (status `new`) → webhook pushes a formatted summary to the Telegram channel. At what point is status moved (new → confirmed → shipped → delivered | cancelled), and who moves it — the user in the Telegram/chat or via the admin page? Confirm the exact Telegram outbound mechanism (bot token + chat_id via env).

## Notes

- No `paid` state — money moves at the door (COD). (glossary #4)
- Flat domestic postage; cost confirmed in chat at fulfilment (Q19) — decide what the order stores for shipping now.
- Blocked by the data model ticket (02): order shape must exist first.
