"use client";

import { useState } from "react";
import { createProduct, updateProduct } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ProductFormValues = {
  id?: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  availability: "in-stock" | "made-to-order";
  leadTimeDays: number | null;
  variantOptions: string;
  images: string;
  published: boolean;
};

export function AdminProductForm({ initial }: { initial?: ProductFormValues }) {
  const [error, setError] = useState<string | undefined>();
  const [availability, setAvailability] = useState(initial?.availability ?? "in-stock");
  const [published, setPublished] = useState(initial?.published ?? true);

  async function action(formData: FormData) {
    const res = initial
      ? await updateProduct(initial.id!, formData)
      : await createProduct(formData);
    if (res && "error" in res) setError(res.error);
  }

  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5">
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="space-y-2">
        <Label>نام محصول</Label>
        <Input name="name" defaultValue={initial?.name} required />
      </div>
      <div className="space-y-2">
        <Label>اسلاگ (انگلیسی، برای لینک)</Label>
        <Input name="slug" dir="ltr" defaultValue={initial?.slug} required />
      </div>
      <div className="space-y-2">
        <Label>توضیحات</Label>
        <Textarea name="description" defaultValue={initial?.description} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>قیمت (تومان)</Label>
          <Input name="price" type="number" defaultValue={initial?.price ?? 0} required />
        </div>
        <div className="space-y-2">
          <Label>دسته</Label>
          <Input name="category" defaultValue={initial?.category} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>وضعیت موجودی</Label>
        <select
          name="availability"
          value={availability}
          onChange={(e) => setAvailability(e.target.value as "in-stock" | "made-to-order")}
          className="h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm"
        >
          <option value="in-stock">موجود</option>
          <option value="made-to-order">سفارشی</option>
        </select>
      </div>
      {availability === "made-to-order" && (
        <div className="space-y-2">
          <Label>زمان آماده‌سازی (روز)</Label>
          <Input name="leadTimeDays" type="number" defaultValue={initial?.leadTimeDays ?? 5} />
        </div>
      )}
      <div className="space-y-2">
        <Label>گزینه‌ها (JSON آرایه‌ای، مثلاً [&quot;کرم&quot;,&quot;قهوه‌ای&quot;])</Label>
        <Textarea name="variantOptions" dir="ltr" defaultValue={initial?.variantOptions ?? "[]"} />
      </div>
      <div className="space-y-2">
        <Label>تصاویر (JSON مسیرها، مثلاً [&quot;/products/a.jpg&quot;])</Label>
        <Textarea name="images" dir="ltr" defaultValue={initial?.images ?? "[]"} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        منتشر شود
      </label>
      <Button type="submit" variant="primary" size="lg">
        {initial ? "ذخیره تغییرات" : "ایجاد محصول"}
      </Button>
    </form>
  );
}
