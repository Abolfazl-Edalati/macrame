import type { Metadata } from "next";
import { getPublishedProducts } from "@/db/queries";
import { ProductCard } from "@/components/product-card";

export const metadata: Metadata = {
  title: "محصولات | آسو مکرومه",
  description: "فروشگاه محصولات مکرومه دست‌بافت آسو",
};

// The catalog changes whenever products are added or published from the admin,
// so it must be rendered per request, not prerendered at build time.
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getPublishedProducts();
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-3xl font-bold">محصولات</h1>
      <p className="mt-2 text-neutral-500">همه آثار دست‌باف استودیو آسو</p>
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-12 text-center text-neutral-500">به‌زودی محصولاتی اضافه می‌شود.</p>
      )}
    </div>
  );
}
