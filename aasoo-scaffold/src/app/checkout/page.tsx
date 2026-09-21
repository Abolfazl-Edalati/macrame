"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { getCart, cartTotal, clearCart, subscribeCart } from "@/lib/cart";
import { formatToman } from "@/lib/format";
import { placeOrder } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SHIPPING = 0;

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useSyncExternalStore(
    subscribeCart,
    () => getCart(),
    () => [],
  );
  const itemsTotal = cartTotal(lines);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const items =
    lines.length === 0
      ? []
      : lines.map((l) => ({
          productId: l.productId,
          name: l.name,
          price: l.price,
          image: l.image,
          quantity: l.quantity,
        }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const res = await placeOrder({
      customerName: String(fd.get("customerName") ?? ""),
      customerPhone: String(fd.get("customerPhone") ?? ""),
      customerAddress: String(fd.get("customerAddress") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      items,
    });
    setPending(false);
    if (res.ok) {
      clearCart();
      router.push(`/order-success?ref=${res.ref}`);
    } else {
      setErrors(res.errors);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">سبد خرید خالی است</h1>
        <p className="mt-3 text-neutral-500">برای ثبت سفارش ابتدا محصولی انتخاب کنید.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">نهایی‌کردن سفارش</h1>
      <div className="mt-8 grid gap-10 md:grid-cols-5">
        {/* Order summary */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold">خلاصه سفارش</h2>
          <div className="mt-4 space-y-3">
            {lines.map((l) => (
              <div key={l.productId} className="flex items-center gap-3">
                {l.image && (
                  <Image
                    src={l.image}
                    alt={l.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 text-sm">
                  <p className="font-medium">{l.name}</p>
                  <p className="text-neutral-500">تعداد: {l.quantity}</p>
                </div>
                <span className="text-sm font-semibold">{formatToman(l.price * l.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-neutral-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span>جمع کالا</span>
              <span>{formatToman(itemsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>ارسال</span>
              <span>{SHIPPING === 0 ? "مشخص می‌شود" : formatToman(SHIPPING)}</span>
            </div>
            <div className="flex justify-between pt-2 text-lg font-bold">
              <span>قابل پرداخت (در محل)</span>
              <span>{formatToman(itemsTotal + SHIPPING)}</span>
            </div>
          </div>
        </div>

        {/* Guest form */}
        <form onSubmit={handleSubmit} className="space-y-5 md:col-span-3">
          <div className="space-y-2">
            <Label htmlFor="customerName">نام و نام خانوادگی</Label>
            <Input id="customerName" name="customerName" placeholder="مثلاً زهرا رضایی" />
            {errors.customerName && (
              <p className="text-sm text-red-600">{errors.customerName[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">شماره تماس</Label>
            <Input id="customerPhone" name="customerPhone" inputMode="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" />
            {errors.customerPhone && (
              <p className="text-sm text-red-600">{errors.customerPhone[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerAddress">آدرس</Label>
            <Textarea id="customerAddress" name="customerAddress" placeholder="استان، شهر، خیابان، کد پستی" />
            {errors.customerAddress && (
              <p className="text-sm text-red-600">{errors.customerAddress[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">توضیحات (اختیاری)</Label>
            <Textarea id="notes" name="notes" placeholder="هر توضیحی که لازم می‌دانید" />
          </div>
          <p className="text-sm text-neutral-500">
            هزینه ارسال با هماهنگی شرکت پست تعیین و در زمان تحویل دریافت می‌شود (پرداخت در محل).
          </p>
          <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full">
            {pending ? "در حال ثبت..." : "ثبت نهایی سفارش"}
          </Button>
        </form>
      </div>
    </div>
  );
}
