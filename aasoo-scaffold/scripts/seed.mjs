// Idempotent seed of sample products via node:sqlite (no native build needed).
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const db = new DatabaseSync(path.join(root, "data", "aasoo.db"));

const count = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
if (count > 0) {
  console.log("already seeded, skipping");
  db.close();
  process.exit(0);
}

const ins = db.prepare(
  `INSERT INTO products
   (slug, name, description, price, category, availability, lead_time_days, variant_options, images, published)
   VALUES (?,?,?,?,?,?,?,?,?,1)`,
);

const products = [
  ["divar-koub-gol", "دیوارکوب مکرومه گل", "طناب پنبه‌ای دست‌باف، تکه‌ای منحصربفرد. ابعاد تقریبی ۴۰×۶۰ سانتی‌متر.", 1250000, "دیوارکوب", "in-stock", null, '["کرم","قهوه‌ای"]', "[]"],
  ["aviz-goldan", "آویز گلدان مکرومه", "طناب جوت طبیعی، ارتفاع ۱۲۰ سانتی‌متر. مناسب گلدان‌های کوچک و متوسط.", 850000, "آویز گلدان", "made-to-order", 5, '["کوتاه","بلند"]', "[]"],
  ["tablo-nakh", "تابلو نخ ابریشمی", "نخ شانه ابریشمی روی قاب چوبی، ابعاد ۳۰×۳۰ سانتی‌متر.", 960000, "لوازم خانه", "in-stock", null, '["طبیعی"]', "[]"],
  ["cheragh-aviz", "چراغ‌آویز مکرومه", "چراغ‌آویز دست‌باف با طناب پنبه‌ای، مناسب فضای داخلی و بالکن.", 1480000, "لوازم خانه", "made-to-order", 7, '["کرم","زیتونی"]', "[]"],
  ["kif-dasti", "کیف دستی مکرومه", "کیف دستی دست‌دوز با بند چرمی؛ مناسب کار و تفریح.", 690000, "اکسسوری", "in-stock", null, '["کرم","مشکی"]', "[]"],
];

for (const p of products) ins.run(...p);
console.log(`seeded ${products.length} products`);
db.close();
