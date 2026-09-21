# Domain glossary & data model

Type: grilling
Status: resolved

## Answer

Glossary written to `CONTEXT.md` (Product, Availability, Order, Order Item, Order status, COD, Guest checkout, Custom order request). ADR `0001` records SQLite-first → Postgres-later via Drizzle.

Data shapes (execution builds these with Drizzle):

- **Product**: id, slug, name, description, price (integer toman), category, availability (`in-stock` | `made-to-order`), leadTimeDays (nullable), images[], variantOptions (JSON, display-only — no per-variant stock), timestamps.
- **Order**: id, guest fields (name, phone, address, notes), status (`new`→`confirmed`→`shipped`→`delivered` | `cancelled`), shippingAmount (integer, snapshotted flat rate), createdAt/updatedAt. No `paid` state (COD).
- **OrderItem**: id, orderId FK, productId FK (nullable for deleted products), name/price/image snapshots, quantity.
- **Shipping**: one configurable flat domestic rate, snapshotted onto the Order at checkout.
- **Custom orders**: NOT an order type — routed via the contact link (Q18). No dedicated entity.

Notes: status moves via the admin page (05, in MVP). One-of-a-kind conflicts reconciled manually in chat, not by inventory reservation. Whole-order status only, no partial.


## Question

Lock the domain vocabulary and the core data shapes for the store: Product (and its `availability` enum: in-stock / made-to-order, leadTimeDays), Order (guest checkout, status lifecycle `new → confirmed → shipped → delivered | cancelled`, no `paid` state — COD), OrderItem (product, qty, price-at-time), single order type, customer contact as guest fields. Confirm the SQLite schema supports these and stays swappable to Postgres later.

## Notes

- Glossary terms settled in grilling round: Product, Order, OrderItem, COD defined, availability, guest checkout, admin single-password.
- Cross-consult `domain-modeling` skill. Writes/updates `CONTEXT.md` glossary on resolution.
- Codepen: keep CONTEXT.md free of implementation detail; ADR only if a hard-to-reverse trade-off surfaces.
- This ticket BLOCKS the order ticket (04) and the admin ticket (05) — schema shapes them.
