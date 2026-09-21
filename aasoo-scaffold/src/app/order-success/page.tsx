import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
        ✓
      </div>
      <h1 className="text-3xl font-bold">سفارش شما ثبت شد</h1>
      <p className="mt-4 leading-8 text-neutral-600">شماره سفارش شما</p>
      <p className="mt-2 text-2xl font-extrabold text-amber-800">{ref || "ثبت شد"}</p>
      <p className="mt-4 leading-8 text-neutral-600">
        به‌زودی برای هماهنگی پرداخت در محل و ارسال با شما تماس می‌گیریم.
      </p>
      <Link href="/products" className="mt-8 inline-block">
        <Button variant="primary" size="lg">
          ادامه خرید
        </Button>
      </Link>
    </div>
  );
}
