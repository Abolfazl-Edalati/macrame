# Aasoo Macrame — Storefront, Orders, and Admin Spec

Labels: ready-for-agent

## Problem Statement

The maker behind Aasoo Macrame sells one-of-a-kind handmade macrame pieces to Persian-speaking buyers in the Iranian market, but has no place to sell them online. There is no catalog, no way for a buyer to commit to a purchase, and no channel that reliably reaches the maker when somebody wants to buy. Today every interested buyer has to find the maker on social media and negotiate in chat, which means buyers who would just place an order never do, and the maker has to be present in chat to make any sale at all.

## Solution

A Persian-only, right-to-left storefront that shows the maker's Products, lets a buyer build a cart and place an Order with no account (guest checkout), and pays cash on delivery — no online payment at all. The moment an Order is placed it is written to the database and the maker is alerted on Telegram. A single-password admin page lets the maker manage Products (create, edit, delete, publish) and move each Order through its status lifecycle. The shop is self-hosted domestically; the hosting decision itself is tracked separately and is not part of this spec.

## User Stories

1. As a prospective buyer, I want to open the home page and immediately see what the studio makes, so that I know within seconds whether anything is for me.
2. As a prospective buyer, I want the whole site in Persian and right-to-left, so that it reads naturally to me.
3. As a prospective buyer, I want to browse all Products on one page, so that I can compare pieces without clicking in and out.
4. As a prospective buyer, I want to see the newest pieces highlighted on the home page, so that I can check what has just been made.
5. As a prospective buyer, I want to see a Product's price in toman with Persian digits, so that I know exactly what I would pay.
6. As a prospective buyer, I want to see whether a Product is in-stock or made-to-order, so that I know if I am buying something that exists now or something that will be made for me.
7. As a prospective buyer, when a Product is made-to-order, I want to see how many days it takes, so that I can decide whether the wait is acceptable.
8. As a prospective buyer, I want a Product page with a description and photos, so that I can judge the piece before committing.
9. As a prospective buyer, I want to add a Product to my cart without creating an account, so that buying is not gated on a signup step.
10. As a buyer, I want my cart to persist when I leave and come back, so that a piece I chose yesterday is still there.
11. As a buyer, I want to change quantities and remove lines in my cart, so that I control exactly what I am ordering.
12. As a buyer, I want to see the cart total clearly, so that I am not surprised at delivery.
13. As a buyer, I want to check out with just my name, phone and address, so that I can place the Order in under a minute.
14. As a buyer, I want to add a note to my Order, so that I can pass on delivery instructions or a question.
15. As a buyer, I want to be told that payment happens on delivery, so that I am not searching the page for a payment step that does not exist.
16. As a buyer, I want a confirmation showing my Order reference, so that I have something to quote if I need to follow up.
17. As a buyer, I want my cart cleared after I place an Order, so that I do not accidentally re-order the same pieces.
18. As a buyer who wants something I do not see in the catalog, I want a contact page pointing at the maker's Instagram and Telegram, so that I can ask for a Custom order request.
19. As a buyer, I want the contact page to explain how a custom piece works, so that I know what to expect before I reach out.
20. As a buyer arriving on a bad link, I want a Persian 404 page, so that a broken link does not look like a broken site.
21. As a buyer, I want product pages discoverable by search engines, so that I can find a specific piece by searching.
22. As the maker, I want to be alerted on Telegram the moment an Order is placed, so that I can respond to a buyer without checking the site.
23. As the maker, I want every Order persisted in the database regardless of whether the Telegram alert succeeds, so that a messaging outage never loses me a sale.
24. As the maker, I want to see every Order with the buyer's name, phone, address, note, and the exact items ordered, so that I can fulfil it.
25. As the maker, I want each Order's prices frozen at what the buyer saw, so that later catalog price changes do not rewrite history.
26. As the maker, I want to move an Order through new, confirmed, shipped, delivered and cancelled, so that the Order status reflects reality.
27. As the maker, I want the admin pages protected by a password, so that nobody but me can see buyer details or change the catalog.
28. As the maker, I want a single dashboard showing new Order count, totals, and Product count, so that I can see at a glance what needs attention.
29. As the maker, I want to add a Product with name, slug, description, price, category, availability, lead time, variant options and images, so that the catalog reflects what I actually have.
30. As the maker, I want to mark a Product published or as a draft, so that I can stage a piece without showing it publicly.
31. As the maker, I want to edit an existing Product, so that I can correct a price or a description.
32. As the maker, I want to delete a Product, so that retired pieces leave the catalog.
33. As the maker, I want to be warned before a Product is deleted, so that a slip does not remove a piece I sell.
34. As the maker, I want a made-to-order Product to record its lead time only when relevant, so that the form does not ask me for nonsense on in-stock pieces.
35. As the maker, I want the sitemap to list every published Product, so that all my pieces are crawlable.
36. As the maker, I want the flat domestic shipping amount configurable in one place, so that a rate change does not touch code.
37. As the maker, I want the shop to survive a restart with its data intact, so that Orders and Products do not vanish overnight.
38. As the maker, I want the store to stay up if the alerting service is down, so that a third-party outage is not my outage.

## Implementation Decisions

- **Stack**: Next.js App Router with React server components, TypeScript, Tailwind, shadcn-style primitives. Persian only, `lang="fa"` and `dir="rtl"` at the root. IRAN Sans loaded as a local font via `next/font`.
- **Visual direction** (from the winning prototype variant, "Editorial gallery"): full-bleed hero image with a dark overlay and a single "کاوش در محصولات" call to action, a newest-products grid titled "تازه‌های استودیو", an editorial story band on a dark background, and a minimal footer. Palette: cream background `#faf7f2`, amber-700 accent.
- **Persistence (ADR 0001)**: SQLite first via Drizzle, swappable to PostgreSQL later by environment change. Prices are integer toman. Database file and its `data` directory are created on first access; WAL mode is set on open.
- **Driver constraint**: the SQLite client is Node's built-in sqlite, exposed to Drizzle through the proxy adapter, because `better-sqlite3` needs a native build step (Python + node-gyp) unavailable on this machine. Trade-off: the Drizzle instance is async, so all query functions and every consumer of them are async; there is no `.get()`/`.all()` synchronous shorthand.
- **Schema**: three tables — Products, Orders, Order Items. Products carry slug, name, description, price, category, availability (`in-stock` | `made-to-order`), lead time days, variant options as a JSON string, images as a JSON string, published flag, and unix-epoch timestamps. Orders carry a human-readable unique `ref`, guest identity fields (name, phone, address), notes, one Order status, shipping amount, and timestamps. Order Items carry the Order id, the Product id (nullable on Product deletion), and snapshotted name, price, image and quantity.
- **Order reference**: inserted with a placeholder, then patched to `AAS-` plus the zero-padded id, because the id is assigned by the database at insert time.
- **Order status**: `new → confirmed → shipped → delivered | cancelled`. There is deliberately no `paid` state; payment is collected by the carrier at delivery (COD).
- **Cart**: client-side only, in localStorage, with a custom change event plus the `storage` event so the header count and the cart page agree. No inventory reservation: one-of-a-kind pieces are reconciled by the maker in chat, since a cart holds no claim on a Product.
- **Checkout**: a server action validates the guest fields and the items with zod, computes the items total plus the flat shipping amount from configuration, writes the Order and its Order Items, fires the Telegram alert, and returns the reference. Validation errors are surfaced per field.
- **Alerting**: a Telegram `sendMessage` post, fire-and-forget with a swallowed failure, because the database is the source of truth and an alert failure must never fail Order placement.
- **Admin auth**: a single shared password from configuration, verified against the submitted value, setting an httpOnly same-site cookie for 30 days. Middleware redirects every `/admin` route except the login page to the login page when the cookie is absent. Server actions that mutate admin state do not currently re-check the cookie — see Testing Decisions and Further Notes.
- **Product form**: images and variant options are entered as raw JSON array strings and validated to be arrays before write. The lead-time field is only rendered for made-to-order availability. Deleting a Product asks for inline confirmation.
- **SEO**: per-Product metadata (title and description) plus a sitemap listing every published Product with its last-modified time.
- **Formatting**: all amounts and dates go through Persian-locale Intl formatters; amounts carry the تومان suffix when shown to buyers.
- **Static asset policy**: the hero image lives in the public folder and is referenced by path. Product images without a real asset fall back to the hero image as a placeholder, and product detail renders raw `img` tags for gallery thumbnails.

## Testing Decisions

- **One primary seam: the route boundary.** Tests drive HTTP requests at the running Next.js app and assert on the response, because that is the seam where every behaviour the spec cares about is observable and where the class of bug we actually hit (driver row-mapping silently producing empty fields) becomes visible. Component internals, query functions and formatting helpers are not tested directly; behaviour is asserted at the route.
- **A good test here** asserts external behaviour only: a request returns the expected status and the response body contains the domain facts (a published Product's name, an Order reference, a status label). It never inspects how a component rendered, which query ran, or what the cart store did internally.
- **Order placement is the highest-value path** and should be covered end to end: a checkout POST results in a persisted Order with a `ref` of the right shape, Order Items whose prices match the catalog at that moment, and the buyer being shown the reference. The fire-and-forget alert rule is asserted as "Order succeeds regardless of alert outcome," not as "a Telegram request was made" — the database, not the network call, is the source of truth.
- **Regression priority**: the empty-fields bug. A test that fetches a published Product page and asserts the Product's name is present in the response is the exact red that would have caught the driver mapping failure. This is the first test to write.
- **Snapshotting** is asserted by placing an Order, then changing the Product's price, then confirming the stored Order Item still holds the original price.
- **Admin guard** is asserted at the route seam: unauthenticated `/admin` redirects to login; the login flow with the configured password yields access, and a wrong password does not.
- **Prior art**: none — the project has no test suite yet, so the harness is established by this spec. Drizzle's own patterns are the closest reference for schema-level reasoning, but no existing tests are reused.

## Out of Scope

- Online payment or any payment gateway; COD is the only payment model and there is no `paid` status.
- English or any non-Persian language; the site is Persian-only.
- Multi-seller or marketplace functionality; there is exactly one maker.
- Customer accounts, profiles, order history, or signups; checkout is guest-only.
- Blog, editorial CMS, or content pages beyond the story band and contact page.
- A shipping calculator or carrier integration; shipping is a single flat domestic amount, set in configuration, and the exact carrier rate is settled with the buyer at delivery.
- Inventory reservation or stock counts; availability is `in-stock` or `made-to-order` and one-of-a-kind pieces are reconciled by the maker in chat.
- A separate Custom order request entity; custom work is a contact link, not an Order type.
- Hosting and deployment target — a separate open decision tracked in the wayfinder map, not resolved by this build.
- Image processing pipeline (uploads, resizing, CDN); images are referenced by path.

## Further Notes

- **Unresolved driver risk.** The proxy adapter over Node's built-in sqlite was chosen to dodge a native build. The empty-fields symptom appeared once and one config change was applied in response, but the fix was never verified against a live request because the verification step was blocked. Treat "a published Product's fields actually render" as the first acceptance test, not a settled fact.
- **Admin action authorization gap.** Middleware guards page routes, but the server actions that create, update and delete Products and that move Order status do not currently verify the admin cookie before mutating. Middleware makes reaching them hard, but it does not make them safe. This should be closed before the store takes real Orders.
- **Draft products are absent from the sitemap and from all public catalog queries** by design; only the admin list shows unpublished Products.
- **Deleting a Product sets the Order Item's product id to null** rather than cascading, so historical Orders keep their snapshotted name, price and image even after the piece is retired.
- **The `.env` file currently holds live Telegram credentials and a default admin password.** Both should be rotated and moved out of the repository before any real deployment; the credentials were supplied for local development.
- **Two stale server processes** may still be listening on ports 3000 and 3100 from earlier smoke tests; kill them before starting a fresh server.
