import { db } from "@/db";
import { products, orders, orderItems } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

export async function getPublishedProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.published, true))
    .orderBy(desc(products.createdAt));
}

export async function getRecentProducts(limit = 6) {
  const rows = await getPublishedProducts();
  return rows.slice(0, limit);
}

export async function getProductBySlug(slug: string) {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.published, true)))
    .limit(1);
  return rows[0];
}

export async function getProduct(id: number) {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0];
}

export async function getAllProducts() {
  return db.select().from(products).orderBy(desc(products.createdAt));
}

type OrderWithItems = {
  order: typeof orders.$inferSelect;
  items: (typeof orderItems.$inferSelect)[];
};

export async function getOrdersWithItems(): Promise<OrderWithItems[]> {
  const orderList = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const orderIds = orderList.map((o) => o.id);
  const items =
    orderIds.length === 0
      ? []
      : await db
          .select()
          .from(orderItems)
          .where(inArray(orderItems.orderId, orderIds));
  return orderList.map((order) => ({
    order,
    items: items.filter((i) => i.orderId === order.id),
  }));
}
