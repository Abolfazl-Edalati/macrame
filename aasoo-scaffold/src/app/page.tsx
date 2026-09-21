import Image from "next/image";
import Link from "next/link";
import { getRecentProducts } from "@/db/queries";
import { ProductCard } from "@/components/product-card";

export default async function HomePage() {
  const products = await getRecentProducts(6);

  return (
    <>
      {/* Hero: full-bleed dark-overlay editorial */}
      <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="آسو مکرومه — دست‌بافت مکرومه"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-3xl px-6 text-center text-white">
          <p className="mb-4 text-sm tracking-widest uppercase opacity-80">دست‌بافت · منحصربفرد</p>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            آسو مکرومه
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/85">
            هر قطعه با دست بافته می‌شود؛ هیچ دو تکه‌ای شبیه هم نیستند.
          </p>
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 font-semibold text-neutral-900 transition hover:bg-amber-50"
          >
            کاوش در محصولات
          </Link>
        </div>
      </section>

      {/* Newest strip */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">تازه‌های استودیو</h2>
            <p className="mt-1 text-neutral-500">جدیدترین آثار دست‌باف</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-amber-800 hover:underline">
            مشاهده همه
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Editorial about band */}
      <section className="bg-neutral-900 py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold">هر گره، یک داستان</h2>
          <p className="leading-8 text-white/80">
            در استودیوی آسو، هر محصول با صبر و دقت بافته می‌شود. از انتخاب طناب پنبه‌ای تا آخرین
            گره، همه با عشق به دست‌ساخت انجام می‌شود. چون هر قطعه منحصربفرد است، اگر قطعه‌ای که
            می‌پسندید در حال حاضر موجود نباشد، آن را برای شما می‌بافیم.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-white/40 px-6 font-semibold text-white transition hover:bg-white hover:text-neutral-900"
          >
            سفارش سفارشی
          </Link>
        </div>
      </section>
    </>
  );
}
