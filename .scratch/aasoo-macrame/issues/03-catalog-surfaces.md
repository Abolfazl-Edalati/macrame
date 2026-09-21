# 03: Catalog surfaces

**What to build:** the public catalog — the home page with its full-bleed hero, newest-products grid and editorial story band, the all-products listing, the individual product page, and the sitemap. A buyer should be able to land, see what the studio makes, browse every piece on one page, then open a piece to judge it: description, photos, price in toman, and whether it exists now or will be made to order, including how many days the wait is.

**Blocked by:** 01 (Test harness and driver regression) — the regression test asserting a Product's fields render belongs to this surface and is written there.

**Status:** ready-for-agent

- [ ] The home page renders the hero, the newest published Products in a grid, and the editorial story band.
- [ ] The catalog page lists every published Product.
- [ ] Each product page shows the name, description, images and price.
- [ ] A made-to-order Product shows its availability label and how many days it takes; an in-stock Product shows it is available now.
- [ ] Prices appear in toman with Persian digits and the toman suffix.
- [ ] A Product saved as a draft appears on no public page and in the sitemap.
- [ ] Product pages carry metadata for search engines, and the sitemap lists every published Product with its last-modified time.
- [ ] A product page for an unknown slug returns the Persian 404 from 02.
- [ ] Route-boundary tests assert the above by fetching these pages and checking the response bodies.
