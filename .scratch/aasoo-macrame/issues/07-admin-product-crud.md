# 07: Admin product CRUD

**What to build:** the maker's control over the catalog — create a Product with name, slug, description, price, category, availability, lead time, variant options and images; edit any of that later; retire a piece with a confirmation so a slip does not delete it; and stage a piece as a draft that the public never sees but the admin list does.

**Blocked by:** 06 (Admin auth and guard) — every mutating action here must sit behind the closed guard.

**Status:** ready-for-agent

- [ ] The admin product list shows every Product including drafts, with each one's price and published state.
- [ ] Creating a Product with all fields saves it and it appears in the admin list.
- [ ] Editing an existing Product changes exactly what was submitted and nothing else.
- [ ] Deleting a Product requires confirmation, and the Product is gone from the list afterwards.
- [ ] Deleting a Product that an Order Item refers to sets that item's Product id to null rather than removing it, so the historical Order keeps its snapshot.
- [ ] Images and variant options are entered as JSON array strings and rejected unless they parse to arrays.
- [ ] The lead-time field is only relevant and only submitted for a made-to-order Product; an in-stock Product never carries one.
- [ ] A Product saved as a draft appears in the admin list and on no public page or the sitemap.
- [ ] A duplicate slug is rejected with a clear error.
- [ ] Route-boundary tests create, edit and delete a Product through the admin actions and assert the catalog changed.
