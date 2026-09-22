// Ticket 03: the public catalog surfaces — home, listing, product page, sitemap.
// A buyer lands, sees what the studio makes, browses every piece, then opens one
// to judge it: description, photos, price, and availability including lead time.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startApp, appFetch, renderedText, stopApp } from "./app.mjs";
import { FIXTURES } from "./seed-fixtures.mjs";

const published = FIXTURES.filter((f) => f.published === 1);
const drafts = FIXTURES.filter((f) => f.published === 0);
const [inStock, madeToOrder] = published;

before(async () => {
  await startApp();
});

after(async () => {
  await stopApp();
});

test("home renders hero, newest grid, and editorial band", async () => {
  const res = await appFetch("/");
  assert.equal(res.status, 200);
  const html = await renderedText(res);
  assert.ok(html.includes("آسو مکرومه"), "hero brand missing");
  assert.ok(html.includes("تازه‌های استودیو"), "newest strip heading missing");
  assert.ok(html.includes("هر گره، یک داستان"), "editorial band missing");
  // The newest grid is seeded published products, most recent first.
  assert.ok(html.includes(inStock.name), "in-stock product missing from home grid");
});

test("catalog page lists every published product", async () => {
  const res = await appFetch("/products");
  assert.equal(res.status, 200);
  const html = await renderedText(res);
  for (const p of published) assert.ok(html.includes(p.name), `missing ${p.name}`);
  for (const d of drafts) assert.ok(!html.includes(d.name), `draft leaked: ${d.name}`);
});

test("product page shows name, description, and price", async () => {
  const res = await appFetch(`/products/${inStock.slug}`);
  assert.equal(res.status, 200);
  const html = await renderedText(res);
  assert.ok(html.includes(inStock.name), "name missing");
  assert.ok(html.includes(inStock.description), "description missing");
  const persianPrice = inStock.price.toLocaleString("fa-IR").replace(/\s/g, "");
  assert.ok(html.includes(`${persianPrice} تومان`), "toman price missing");
});

test("in-stock product shows it is available now", async () => {
  const html = await renderedText(await appFetch(`/products/${inStock.slug}`));
  assert.ok(html.includes("موجود"), "in-stock availability label missing");
});

test("made-to-order product shows its availability label and lead time", async () => {
  const res = await appFetch(`/products/${madeToOrder.slug}`);
  assert.equal(res.status, 200);
  const html = await renderedText(res);
  assert.ok(html.includes("سفارشی"), "made-to-order label missing");
  assert.ok(
    html.includes(String(madeToOrder.leadTimeDays)),
    "lead time in days missing",
  );
});

test("product pages carry search-engine metadata", async () => {
  const res = await appFetch(`/products/${inStock.slug}`);
  const html = await renderedText(res);
  assert.ok(
    html.includes(`<title>${inStock.name} | آسو مکرومه</title>`),
    "page title must be the product name",
  );
  assert.ok(
    html.includes(`content="${inStock.description}"`),
    "meta description must be the product description",
  );
});

test("sitemap lists every published product and no drafts", async () => {
  const res = await appFetch("/sitemap.xml");
  assert.equal(res.status, 200);
  const xml = await res.text();
  for (const p of published) {
    assert.ok(xml.includes(`/products/${p.slug}`), `sitemap missing ${p.slug}`);
  }
  for (const d of drafts) {
    assert.ok(!xml.includes(`/products/${d.slug}`), `sitemap leaked draft ${d.slug}`);
  }
});

test("unknown product slug serves the Persian 404", async () => {
  const res = await appFetch("/products/no-such-piece");
  assert.equal(res.status, 404);
  assert.ok((await renderedText(res)).includes("صفحه مورد نظر پیدا نشد"));
});
