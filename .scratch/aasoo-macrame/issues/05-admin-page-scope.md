# Admin page scope

Type: grilling
Status: resolved

## Answer

Admin page scope locked (single-password, env-set, guarded by Next middleware/server):

- **Auth**: one shared admin password in `ADMIN_PASSWORD` env; guarded route; no user table. Upgradable to real auth later (out of MVP).
- **Orders**: list (with status filter), detail view (items, total, customer contact, notes), and status moves `new → confirmed → shipped → delivered | cancelled`. Status moves here drive order state (per 04); no separate Telegram "mark done" path in MVP.
- **Products**: CRUD against SQLite (add/edit/delete, upload images, set availability + leadTimeDays, category, price, toggle visibility).

Deferred out of MVP admin: analytics, inventory reservation, payment reconciliation (none — COD), and multi-user access.

Blocked by: 02

## Question

Lock the MVP admin page: single-password login (env-set, guarded by Next middleware/server), list + manage orders (move status along the lifecycle, view order detail + contact), and product CRUD (add/edit/remove products against the DB). Scope the boundary: what's in the MVP admin vs. deferred (analytics, inventory reservation, payment reconciliation)?

## Notes

- Admin IS in the MVP (user corrected my default — Q16).
- Read/writes the same SQLite DB; pairs with the data model ticket (02) and order ticket (04).
- Blocked by data model (02).
