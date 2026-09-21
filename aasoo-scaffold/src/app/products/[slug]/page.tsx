import { notFound } from "next/navigation";
import { getProductBySlug } from "@/db/queries";
import { firstImage, AvailabilityBadge } from "@/components/product-card";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatToman } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.name} | آسو مکرومه` : "محصول | آسو مکرومه",
    description: product?.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  let images: string[] = [];
  let options: string[] = [];
  try {
    images = JSON.parse(product.images);
    options = JSON.parse(product.variantOptions);
  } catch {
    /* ignore */
  }
  const main = firstImage(product);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={main} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img} alt="" className="aspect-square rounded-xl object-cover" />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <AvailabilityBadge product={product} />
          <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-3xl font-extrabold text-amber-800">
            {formatToman(product.price)}
          </p>
          {product.availability === "made-to-order" && product.leadTimeDays && (
            <p className="mt-2 text-sm text-neutral-500">
              این قطعه سفارشی است و
              <span className="font-semibold"> پس از {product.leadTimeDays} روز</span> آماده ارسال
              می‌شود.
            </p>
          )}
          <p className="mt-6 leading-8 text-neutral-700">{product.description}</p>

          {options.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">گزینه‌ها:</p>
              <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                  <span
                    key={o}
                    className="rounded-full border border-neutral-300 px-3 py-1 text-sm"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
          <p className="mt-4 text-sm text-neutral-500">ارسال سراسری با پست · پرداخت در محل</p>
        </div>
      </div>
    </div>
  );
}
