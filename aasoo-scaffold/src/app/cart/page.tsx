"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import Image from "next/image";
import { getCart, setQuantity, removeLine, cartTotal, subscribeCart } from "@/lib/cart";
import { formatToman } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const lines = useSyncExternalStore(subscribeCart, () => getCart(), () => []);
  const total = cartTotal(lines);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">سبد خرید شما خالی است</h1>
        <p className="mt-3 text-neutral-500">محصولات دست‌باف را کشف کنید.</p>
        <Link href="/products" className="mt-8 inline-block">
          <Button variant="primary" size="lg">
            مشاهده محصولات
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">سبد خرید</h1>
      <div className="mt-8 space-y-4">
        {lines.map((l) => (
          <div
            key={l.productId}
            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4"
          >
            {l.image ? (
              <Image
                src={l.image}
                alt={l.name}
                width={72}
                height={72}
                className="h-18 w-18 rounded-xl object-cover"
              />
            ) : (
              <div className="h-18 w-18 rounded-xl bg-neutral-100" />
            )}
            <div className="flex-1">
              <Link href={`/products/${l.slug}`} className="font-semibold hover:underline">
                {l.name}
              </Link>
              <p className="text-sm text-neutral-500">{formatToman(l.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(l.productId, l.quantity - 1)}
                className="h-8 w-8 rounded-full border border-neutral-300"
              >
                −
              </button>
              <span className="w-8 text-center tabular-nums">{l.quantity}</span>
              <button
                onClick={() => setQuantity(l.productId, l.quantity + 1)}
                className="h-8 w-8 rounded-full border border-neutral-300"
              >
                +
              </button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => removeLine(l.productId)}>
              حذف
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between rounded-2xl bg-neutral-900 p-6 text-white">
        <span className="text-lg">جمع کل</span>
        <span className="text-2xl font-bold">{formatToman(total)}</span>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Link href="/products">
          <Button variant="outline">ادامه خرید</Button>
        </Link>
        <Link href="/checkout">
          <Button variant="primary" size="lg">
            ثبت سفارش
          </Button>
        </Link>
      </div>
    </div>
  );
}
