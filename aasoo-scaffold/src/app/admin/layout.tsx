import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/admin-actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/admin" className="text-lg font-bold">
          پنل مدیریت آسو
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="text-sm text-neutral-600 hover:underline">
            سفارش‌ها
          </Link>
          <Link href="/admin/products" className="text-sm text-neutral-600 hover:underline">
            محصولات
          </Link>
          <form action={logout}>
            <Button variant="outline" size="sm" type="submit">
              خروج
            </Button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
