# 05: Guest checkout and Order persistence

**What to build:** the path from a full cart to a placed Order. A buyer gives name, phone and address plus an optional note, is told payment happens on delivery, and finishes in under a minute. The Order and its Order Items are written to the database with prices frozen at what the buyer saw, a human-readable reference is issued, the cart is cleared, and the buyer lands on a confirmation showing that reference. A Telegram alert is sent fire-and-forget; an alert failure must never lose the Order, because the database is the source of truth.

**Blocked by:** 04 (Cart) — checkout consumes the cart's contents.

**Status:** ready-for-agent

- [ ] Submitting checkout with a valid name, phone and address and a non-empty cart creates an Order in `new` status.
- [ ] Each line becomes an Order Item holding the Product id, the snapshotted name, the price as it was at checkout, the image and the quantity.
- [ ] The Order carries a reference of the shape `AAS-0001`, unique across Orders.
- [ ] The flat shipping amount from configuration is stored on the Order and added into the total shown.
- [ ] Invalid input returns per-field errors and creates no Order; an empty cart is rejected.
- [ ] Placing an Order fails closed on the database side even when the Telegram alert errors — the Order is persisted and the reference is returned regardless.
- [ ] The cart is cleared after the Order is placed.
- [ ] The confirmation page shows the Order reference, and the page cannot be reached with a bogus reference.
- [ ] Snapshot regression: after a Product's price changes, the stored Order Item still holds the price the buyer saw.
- [ ] Route-boundary tests cover the checkout POST end to end and assert on the persisted Order, not on any network call.
