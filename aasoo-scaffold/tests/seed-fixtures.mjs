// Test fixtures: a small, known catalog for route-boundary tests.
// Writes into the test DB only (SQLITE_FILE), never the dev DB.
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

// Kept in one place so assertions can import the exact expected strings.
// Pure data: importing this module must have NO side effects on the database,
// because the test runner runs each file in its own process and an import
// here would re-seed mid-run.
const FIXTURES = [
  {
    slug: "test-divar-koub",
    name: "دیوارکوب تستی گل",
    description: "قطعه تستی برای بررسی نمایش محصول.",
    price: 1250000,
    category: "دیوارکوب",
    availability: "in-stock",
    leadTimeDays: null,
    variantOptions: '["کرم"]',
    images: "[]",
    published: 1,
  },
  {
    slug: "test-aviz-safareshi",
    name: "آویز سفارشی تستی",
    description: "قطعه سفارشی تستی با زمان ساخت.",
    price: 850000,
    category: "آویز گلدان",
    availability: "made-to-order",
    leadTimeDays: 5,
    variantOptions: '["کوتاه","بلند"]',
    images: "[]",
    published: 1,
  },
  {
    slug: "test-pish-nashr",
    name: "قطعه پیش‌نشر تستی",
    description: "نباید در فروشگاه دیده شود.",
    price: 100000,
    category: "دسته تست",
    availability: "in-stock",
    leadTimeDays: null,
    variantOptions: "[]",
    images: "[]",
    published: 0,
  },
];

/**
 * The DB tests write into. Hard-coded, never the dev DB: reading it from the
 * environment would let a bare `npm test` land on `aasoo.db` and wipe real
 * orders with the DELETE below.
 */
export const TEST_DB = "aasoo-test.db";

/**
 * Seed the test DB. Called explicitly by the test harness before the app boots;
 * never runs as a side effect of importing this module.
 * Returns the fixtures written, so the harness can verify the write landed.
 */
export function seedFixtures() {
  const file = process.env.SQLITE_FILE || TEST_DB;
  const dbPath = path.join(process.cwd(), "data", file);
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    availability TEXT NOT NULL CHECK (availability IN ('in-stock','made-to-order')),
    lead_time_days INTEGER,
    variant_options TEXT NOT NULL DEFAULT '[]',
    images TEXT NOT NULL DEFAULT '[]',
    published INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','confirmed','shipped','delivered','cancelled')),
    shipping_amount INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    quantity INTEGER NOT NULL DEFAULT 1
  );
  `);
  // A previous run may still hold the file (WAL sidecars keep the handle alive),
  // so unlink would fail with EBUSY on Windows. Drop rows instead: same isolation,
  // no file-lock dependency.
  for (const t of ["order_items", "orders", "products"]) db.exec(`DELETE FROM ${t};`);

  const ins = db.prepare(
    `INSERT INTO products
     (slug, name, description, price, category, availability, lead_time_days, variant_options, images, published)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
  );
  for (const f of FIXTURES) {
    ins.run(
      f.slug,
      f.name,
      f.description,
      f.price,
      f.category,
      f.availability,
      f.leadTimeDays,
      f.variantOptions,
      f.images,
      f.published,
    );
  }

  const written = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
  db.close();
  if (written !== FIXTURES.length)
    throw new Error(`expected ${FIXTURES.length} rows, found ${written}`);
  return FIXTURES;
}

export { FIXTURES };
