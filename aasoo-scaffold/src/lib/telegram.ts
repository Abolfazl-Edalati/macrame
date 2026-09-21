import { env } from "@/lib/env";

const API = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

/** Push a Persian order summary to the maker's Telegram chat. Alert-only; the DB is source of truth. */
export function notifyOrderSummary(payload: {
  ref: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  items: { name: string; quantity: number; price: number }[];
  itemsTotal: number;
  shippingAmount: number;
  total: number;
}): void {
  const lines = payload.items.map(
    (i) => `• ${i.name} ×${new Intl.NumberFormat("fa-IR").format(i.quantity)} — ${new Intl.NumberFormat("fa-IR").format(i.price * i.quantity)}`,
  );

  const text = [
    `🧶 سفارش جدید: ${payload.ref}`,
    ``,
    `👤 ${payload.customerName}`,
    `📱 ${payload.customerPhone}`,
    `📍 ${payload.customerAddress}`,
    payload.notes ? `📝 ${payload.notes}` : null,
    ``,
    ...lines,
    ``,
    `مجموع کالاها: ${new Intl.NumberFormat("fa-IR").format(payload.itemsTotal)} تومان`,
    `ارسال: ${new Intl.NumberFormat("fa-IR").format(payload.shippingAmount)} تومان`,
    `قابل پرداخت (در محل): ${new Intl.NumberFormat("fa-IR").format(payload.total)} تومان`,
  ]
    .filter(Boolean)
    .join("\n");

  // Fire-and-forget: an alert failure must not fail order placement.
  void fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  }).catch(() => {
    /* alert-only; DB write already succeeded */
  });
}
