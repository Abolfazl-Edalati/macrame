import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  // integer toman
  price: integer("price").notNull(),
  category: text("category").notNull(),
  availability: text("availability", { enum: ["in-stock", "made-to-order"] }).notNull(),
  leadTimeDays: integer("lead_time_days"),
  // JSON array of display-only variant option strings
  variantOptions: text("variant_options").notNull().default("[]"),
  // JSON array of image paths (relative to /public)
  images: text("images").notNull().default("[]"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").notNull().default(sql`(unixepoch())`),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // human-readable reference, e.g. AAS-1042
  ref: text("ref").notNull().unique(),
  // guest checkout fields
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  notes: text("notes").notNull().default(""),
  status: text("status", {
    enum: ["new", "confirmed", "shipped", "delivered", "cancelled"],
  }).notNull().default("new"),
  // flat domestic rate snapshotted at checkout, integer toman
  shippingAmount: integer("shipping_amount").notNull().default(0),
  createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").notNull().default(sql`(unixepoch())`),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  // snapshots — catalog edits must not rewrite placed orders
  name: text("name").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull().default(""),
  quantity: integer("quantity").notNull().default(1),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export const ORDER_STATUS = [
  "new",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];

export const PRODUCT_AVAILABILITY = ["in-stock", "made-to-order"] as const;
export type ProductAvailability = (typeof PRODUCT_AVAILABILITY)[number];
