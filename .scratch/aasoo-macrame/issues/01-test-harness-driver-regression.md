# 01: Test harness and driver regression

**What to build:** the project's first test suite, which boots the app and drives HTTP requests at the route boundary, plus the regression test that proves a published Product's fields actually reach the browser. This is the seam every later ticket writes its tests into, and it locks down the bug already hit once: the SQLite driver silently returning rows whose fields were all undefined, so the product page rendered an empty heading and the listing showed zero cards.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] A test harness exists and can be run with one command; it boots the app and makes real HTTP requests against it.
- [ ] The seeded data setup runs before tests (schema created, sample Products inserted) and is isolated so tests do not depend on leftovers of earlier runs.
- [ ] Fetching a published Product's page returns 200 and the response body contains that Product's name.
- [ ] Fetching the catalog page returns 200 and the response body contains the name of every published Product.
- [ ] A draft Product does not appear in either response.
- [ ] Prices render in Persian digits with the toman suffix, not raw integers.
- [ ] If the driver ever again maps columns incorrectly, these tests go red.
