"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products, orders, ORDER_STATUS } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { verifyPassword, setAdminSession, clearAdminSession, isAdminAuthed } from "@/lib/admin-auth";

/** Login with the shared password. Good enough for a single seller behind /admin. */
export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { error: "رمز عبور اشتباه است" };
  }
  await setAdminSession();
  redirect("/admin");
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin/login");
}

const ProductSchema = z.object({
  name: z.string().min(1, "نام الزامی است"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug انگلیسی، فقط حروف کوچک و خط تیره"),
  description: z.string().default(""),
  price: z.coerce.number().int().nonnegative("قیمت نامعتبر است"),
  category: z.string().min(1, "دسته الزامی است"),
  availability: z.enum(["in-stock", "made-to-order"]),
  leadTimeDays: z.coerce.number().int().min(0).optional().nullable(),
  variantOptions: z.string().default("[]"),
  images: z.string().default("[]"),
  published: z.coerce.boolean().default(true),
});

export async function createProduct(formData: FormData): Promise<{ error?: string }> {
  const parsed = ProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "خطا در فرم" };
  }
  const d = parsed.data;
  await db.insert(products).values({
    ...d,
    variantOptions: validJson(d.variantOptions, "[]"),
    images: validJson(d.images, "[]"),
  });
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: number,
  formData: FormData,
): Promise<{ error?: string }> {
  const parsed = ProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "خطا در فرم" };
  }
  const d = parsed.data;
  await db
    .update(products)
    .set({
      ...d,
      variantOptions: validJson(d.variantOptions, "[]"),
      images: validJson(d.images, "[]"),
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function moveOrderStatus(orderId: number, status: string) {
  if (!ORDER_STATUS.includes(status as (typeof ORDER_STATUS)[number])) return;
  await db
    .update(orders)
    .set({ status: status as (typeof ORDER_STATUS)[number], updatedAt: sql`(unixepoch())` })
    .where(eq(orders.id, orderId));
  revalidatePath("/admin/orders");
}

/** Guard so server actions never run without an admin session. */
export async function requireAdmin() {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }
}

function validJson(value: string, fallback: string): string {
  try {
    JSON.parse(value || "");
    // must be an array of strings for our fields
    const arr = JSON.parse(value || "[]");
    return Array.isArray(arr) ? value : fallback;
  } catch {
    return fallback;
  }
}
