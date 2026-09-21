import { getOrdersWithItems } from "@/db/queries";
import { formatToman, formatPersianDate } from "@/lib/format";
import { ORDER_STATUS } from "@/db/schema";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { StatusButton } from "@/components/status-button";

export default async function AdminOrdersPage() {
  const rows = await getOrdersWithItems();
  return (
    <div>
      <h1 className="text-2xl font-bold">سفارش‌ها</h1>
      {rows.length === 0 ? (
        <p className="mt-10 text-center text-neutral-500">هنوز سفارشی ثبت نشده است.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {rows.map(({ order, items }) => (
            <div
              key={order.id}
              className="rounded-2xl border border-neutral-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{order.ref}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {formatPersianDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-neutral-500">جمع:</span>
                  <span className="font-semibold">
                    {formatToman(
                      items.reduce((s, i) => s + i.price * i.quantity, 0) +
                        order.shippingAmount,
                    )}
                  </span>
                </div>
              </div>
              <div className="mt-4 border-t border-neutral-100 pt-4 text-sm leading-7">
                <p>
                  <span className="text-neutral-500">مشتری:</span> {order.customerName}
                </p>
                <p>
                  <span className="text-neutral-500">تلفن:</span> {order.customerPhone}
                </p>
                <p>
                  <span className="text-neutral-500">آدرس:</span> {order.customerAddress}
                </p>
                {order.notes && (
                  <p>
                    <span className="text-neutral-500">یادداشت:</span> {order.notes}
                  </p>
                )}
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between">
                    <span>
                      {i.name} × {i.quantity}
                    </span>
                    <span>{formatToman(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {ORDER_STATUS.map((s) => (
                  <StatusButton key={s} orderId={order.id} status={s} active={order.status === s} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
