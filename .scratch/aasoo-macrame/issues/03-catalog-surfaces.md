# 03: Catalog surfaces

**What to build:** the public catalog — the home page with its full-bleed hero, newest-products grid and editorial story band, the all-products listing, the individual product page, and the sitemap. A buyer should be able to land, see what the studio makes, browse every piece on one page, then open a piece to judge it: description, photos, price in toman, and whether it exists now or will be made to order, including how many days the wait is.

**Blocked by:** 01 (Test harness and driver regression) — the regression test asserting a Product's fields render belongs to this surface and is written there.

**Status:** done

- [x] The home page renders the hero, the newest published Products in a grid, and the editorial story band.
- [x] The catalog page lists every published Product.
- [x] Each product page shows the name, description, images and price.
- [x] A made-to-order Product shows its availability label and how many days it takes; an in-stock Product shows it is available now.
- [x] Prices appear in toman with Persian digits and the toman suffix.
- [x] A Product saved as a draft appears on no public page and in the sitemap.
- [x] Product pages carry metadata for search engines, and the sitemap lists every published Product with its last-modified time.
- [x] A product page for an unknown slug returns the Persian 404 from 02.
- [x] Route-boundary tests assert the above by fetching these pages and checking the response bodies.
