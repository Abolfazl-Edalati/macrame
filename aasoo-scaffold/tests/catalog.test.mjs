// Route-boundary regression: a published Product's fields must actually reach the browser.
// This is the exact red that would have caught the sqlite-proxy mapping failure,
// where the product page rendered an empty <h1> and the listing showed zero cards.
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

test("catalog page lists every published product by name", async () => {
  const res = await appFetch("/products");
  assert.equal(res.status, 200);
  const html = await renderedText(res);
  for (const p of published) assert.ok(html.includes(p.name), `missing ${p.name}`);
});

test("draft products never appear in the catalog", async () => {
  const res = await appFetch("/products");
  const html = await renderedText(res);
  for (const d of drafts) assert.ok(!html.includes(d.name), `draft leaked: ${d.name}`);
});

test("a draft product's own page is not served either", async () => {
  const res = await appFetch(`/products/${drafts[0].slug}`);
  assert.equal(res.status, 404, "draft product page must 404");
});

test("product page shows the product's own name in its heading", async () => {
  const res = await appFetch(`/products/${inStock.slug}`);
  assert.equal(res.status, 200);
  const html = await renderedText(res);
  assert.ok(html.includes(inStock.name), "product name missing from its own page");
});

test("prices render in Persian digits with the toman suffix", async () => {
  const res = await appFetch(`/products/${inStock.slug}`);
  const html = await renderedText(res);
  // 1250000 -> "۱٬۲۵۰٬۰۰۰" then " تومان"
  const persianDigits = inStock.price.toLocaleString("fa-IR").replace(/\s/g, "");
  assert.ok(
    html.includes(`${persianDigits} تومان`),
    `expected Persian-digit toman price, got neither it nor the raw integer ${inStock.price}`,
  );
  assert.ok(!html.includes(`>${inStock.price}<`), "raw integer price leaked into the page");
});

test("made-to-order product shows its lead time", async () => {
  const res = await appFetch(`/products/${madeToOrder.slug}`);
  assert.equal(res.status, 200);
  const html = await renderedText(res);
  assert.ok(html.includes(String(madeToOrder.leadTimeDays)), "lead time missing");
});

test("unknown product slug serves the Persian 404", async () => {
  const res = await appFetch("/products/no-such-piece");
  assert.equal(res.status, 404);
});

test("home page renders and links into the catalog", async () => {
  const res = await appFetch("/");
  assert.equal(res.status, 200);
  const html = await renderedText(res);
  assert.ok(html.includes("آسو"), "brand missing from home");
});
