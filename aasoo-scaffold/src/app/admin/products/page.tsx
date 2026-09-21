import Link from "next/link";
import { getAllProducts } from "@/db/queries";
import { formatToman } from "@/lib/format";
import { firstImage } from "@/components/product-card";
import { DeleteProductButton } from "@/components/delete-product-button";

export default async function AdminProductsPage() {
  const products = await getAllProducts();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">محصولات</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center justify-center rounded-full bg-amber-700 px-5 font-semibold text-white"
        >
          افزودن محصول
        </Link>
      </div>
      <div className="mt-8 space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={firstImage(p)} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-neutral-500">
                {p.category} · {formatToman(p.price)} · {p.published ? "منتشر شده" : "پیش‌نویس"}
              </p>
            </div>
            <Link
              href={`/admin/products/${p.id}/edit`}
              className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm hover:bg-neutral-100"
            >
              ویرایش
            </Link>
            <DeleteProductButton id={p.id} name={p.name} />
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-10 text-center text-neutral-500">هنوز محصولی اضافه نشده است.</p>
      )}
    </div>
  );
}
