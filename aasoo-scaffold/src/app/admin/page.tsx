import Link from "next/link";
import { getOrdersWithItems } from "@/db/queries";
import { getAllProducts } from "@/db/queries";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { formatPersianDate } from "@/lib/format";

export default async function AdminHomePage() {
  const orders = await getOrdersWithItems();
  const products = await getAllProducts();
  const newOrders = orders.filter((r) => r.order.status === "new");

  return (
    <div>
      <h1 className="text-2xl font-bold">داشبورد</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">سفارش‌های جدید</p>
          <p className="mt-2 text-3xl font-bold">{newOrders.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">کل سفارش‌ها</p>
          <p className="mt-2 text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">محصولات</p>
          <p className="mt-2 text-3xl font-bold">{products.length}</p>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold">آخرین سفارش‌ها</h2>
      {orders.length === 0 ? (
        <p className="mt-6 text-neutral-500">هنوز سفارشی ثبت نشده است.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.slice(0, 5).map(({ order }) => (
            <Link
              key={order.id}
              href="/admin/orders"
              className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold">{order.ref}</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <span className="text-sm text-neutral-500">{formatPersianDate(order.createdAt)}</span>
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/admin/products/new"
        className="mt-10 inline-flex h-11 items-center justify-center rounded-full bg-amber-700 px-6 font-semibold text-white"
      >
        افزودن محصول
      </Link>
    </div>
  );
}
