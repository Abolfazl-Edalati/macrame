# 04: Cart

**What to build:** a buyer's cart that needs no account and survives leaving and coming back. A buyer adds a Product from its page, then changes quantities, removes lines and sees the total — and the count in the header always agrees with the cart page. The cart is client-side only: it holds no claim on a one-of-a-kind piece, and the maker reconciles availability in chat.

**Blocked by:** 02 (Persian storefront shell), 03 (Catalog surfaces) — the cart is entered from a product page and rendered inside the shared shell.

**Status:** ready-for-agent

- [ ] Adding a Product puts it in the cart without any account or signup step.
- [ ] The cart persists across page loads and a return visit.
- [ ] A buyer can change a line's quantity and remove a line.
- [ ] The cart page shows the line total and the order total, including the flat shipping amount from configuration.
- [ ] The header cart count and the cart page never disagree, including when the cart changes in another open tab.
- [ ] Adding an out-of-catalog or draft Product cannot produce a cart line.
- [ ] Route-boundary tests assert the cart page renders and totals correctly from a given cart state.
