import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { CartCount } from "@/components/cart-count";

export function SiteHeader() {
  return (
    <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      <Link href="/" className="font-extrabold text-2xl tracking-tight text-neutral-900">
        آسو<span className="text-amber-700">‌مکرومه</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-600">
        <Link href="/">خانه</Link>
        <Link href="/products">محصولات</Link>
        <Link href="/contact">سفارش سفارشی</Link>
        <Link href="/contact">تماس</Link>
      </nav>
      <Link
        href="/cart"
        className="text-sm font-semibold border border-neutral-900 rounded-full px-4 py-2 inline-flex items-center gap-2"
      >
        <ShoppingCart className="h-4 w-4" />
        <CartCount />
      </Link>
    </header>
  );
}
