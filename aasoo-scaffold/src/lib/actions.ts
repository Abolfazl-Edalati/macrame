"use server";

import { db } from "@/db";
import { orders, orderItems, ORDER_STATUS } from "@/db/schema";
import { env } from "@/lib/env";
import { notifyOrderSummary } from "@/lib/telegram";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const CheckoutSchema = z.object({
  customerName: z.string().min(2, "نام را وارد کنید"),
  customerPhone: z.string().min(6, "شماره تماس را وارد کنید"),
  customerAddress: z.string().min(10, "آدرس را وارد کنید"),
  notes: z.string().optional().default(""),
  items: z
    .array(
      z.object({
        productId: z.number(),
        name: z.string(),
        price: z.number().nonnegative(),
        image: z.string().optional().default(""),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "سبد خرید خالی است"),
});

export type CheckoutState =
  | { ok: true; ref: string }
  | { ok: false; errors: Record<string, string[]> };

export async function placeOrder(
  input: z.infer<typeof CheckoutSchema>,
): Promise<CheckoutState> {
  const parsed = CheckoutSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      (errors[key] ??= []).push(issue.message);
    }
    return { ok: false, errors };
  }

  const { items, customerName, customerPhone, customerAddress, notes } = parsed.data;
  const itemsTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingAmount = env.SHIPPING_FLAT_TOMAN;
  const total = itemsTotal + shippingAmount;

  // human-readable ref: AAS-<id>; id assigned by the DB, so insert then patch the ref
  const [created] = await db
    .insert(orders)
    .values({
      ref: "AAS-PENDING",
      customerName,
      customerPhone,
      customerAddress,
      notes,
      status: "new",
      shippingAmount,
    })
    .returning({ id: orders.id });

  const ref = `AAS-${String(created.id).padStart(4, "0")}`;
  await db.update(orders).set({ ref }).where(eq(orders.id, created.id));

  await db.insert(orderItems).values(
    items.map((i) => ({
      orderId: created.id,
      productId: i.productId,
      name: i.name,
      price: i.price, // snapshot
      image: i.image,
      quantity: i.quantity,
    })),
  );

  notifyOrderSummary({
    ref,
    customerName,
    customerPhone,
    customerAddress,
    notes,
    items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
    itemsTotal,
    shippingAmount,
    total,
  });

  return { ok: true, ref };
}

export async function updateOrderStatus(orderId: number, status: string) {
  await db
    .update(orders)
    .set({ status: status as (typeof ORDER_STATUS)[number], updatedAt: sql`(unixepoch())` })
    .where(eq(orders.id, orderId));
}
