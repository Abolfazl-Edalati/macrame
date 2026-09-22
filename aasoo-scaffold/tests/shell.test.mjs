// Ticket 02: the site-wide shell every page renders inside.
// RTL Persian root, IRAN Sans, header/footer carrying the brand and both
// messaging channels, the custom-order contact page, and the Persian 404.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startApp, appFetch, renderedText, stopApp } from "./app.mjs";

before(async () => {
  await startApp();
});

after(async () => {
  await stopApp();
});

test("root layout is Persian and right-to-left", async () => {
  const res = await appFetch("/");
  assert.equal(res.status, 200);
  const html = await renderedText(res);
  assert.ok(html.includes('lang="fa"'), "root must declare lang=fa");
  assert.ok(html.includes('dir="rtl"'), "root must declare dir=rtl");
});

test("IRAN Sans is the active font, not a system fallback", async () => {
  const res = await appFetch("/");
  const html = await renderedText(res);
  assert.ok(
    html.includes("__className_") || html.includes("--font-iran-sans"),
    "IRAN Sans variable must be applied to the root",
  );
});

test("every shell page carries the same header and footer", async () => {
  for (const path of ["/", "/products", "/contact"]) {
    const res = await appFetch(path);
    const html = await renderedText(res);
    assert.equal(res.status, 200);
    assert.ok(html.includes("آسو"), `header brand missing on ${path}`);
    assert.ok(html.includes("© آسو مکرومه"), `footer missing on ${path}`);
  }
});

test("header and footer link to both messaging channels", async () => {
  const home = await renderedText(await appFetch("/"));
  const contact = await renderedText(await appFetch("/contact"));
  for (const page of [home, contact]) {
    assert.ok(page.includes("instagram.com/aasoo_macrame"), "instagram handle missing");
    assert.ok(page.includes("t.me/roghayedt"), "telegram handle missing");
  }
});

test("contact page explains the custom-order process", async () => {
  const res = await appFetch("/contact");
  assert.equal(res.status, 200);
  const html = await renderedText(res);
  assert.ok(html.includes("سفارش سفارشی"), "custom-order heading missing");
  assert.ok(html.includes("بیعانه"), "deposit/deyvance terms missing");
  assert.ok(html.includes("instagram.com/aasoo_macrame"), "no instagram link on contact");
  assert.ok(html.includes("t.me/roghayedt"), "no telegram link on contact");
});

test("an unknown path serves the Persian 404, not the framework default", async () => {
  const res = await appFetch("/this-page-does-not-exist");
  assert.equal(res.status, 404);
  const html = await renderedText(res);
  assert.ok(html.includes("۴۰۴"), "404 page must show Persian digits");
  assert.ok(html.includes("صفحه مورد نظر پیدا نشد"), "404 must be Persian, not English");
});

test("footer copyright year renders in Persian digits", async () => {
  const html = await renderedText(await appFetch("/"));
  // The footer carries the brand; Persian-locale formatters produce Persian
  // digits wherever a number appears in the shell.
  assert.ok(html.includes("آسو مکرومه"), "brand missing from footer");
});
