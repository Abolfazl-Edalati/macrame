# 08: Admin orders dashboard and status lifecycle

**What to build:** the maker's view of every Order and the machinery to move one through its life. The dashboard shows at a glance what needs attention — new Order count, totals, Product count. Each Order shows the buyer's name, phone, address and note alongside the exact items ordered at the prices they were frozen at, and the maker can move an Order from `new` to `confirmed`, then `shipped`, then `delivered`, or `cancelled`. There is deliberately no paid state: payment is collected by the carrier at delivery.

**Blocked by:** 05 (Guest checkout and Order persistence) — there is nothing to show until an Order can be placed; 06 (Admin auth and guard) — status moves behind the closed guard.

**Status:** ready-for-agent

- [ ] The admin dashboard shows the count of new Orders, order totals and the Product count.
- [ ] The order list shows every Order with buyer name, phone, address, note and status.
- [ ] Each Order's items show the snapshotted name, image, unit price and quantity — not the current catalog price.
- [ ] An Order can be moved `new → confirmed → shipped → delivered`, and `cancelled` is available.
- [ ] A status move persists and is reflected on the next load of the page.
- [ ] No `paid` status exists anywhere in the admin UI.
- [ ] An Order Item whose Product was deleted still renders with its snapshot intact.
- [ ] Route-boundary tests place an Order, log in as admin, move its status, and assert the persisted status and the dashboard counts.
