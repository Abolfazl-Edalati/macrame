"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/db/schema";

export function AddToCartButton({ product, quantity = 1 }: { product: Product; quantity?: number }) {
  const [added, setAdded] = useState(false);

  function handle() {
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: JSON.parse(product.images || "[]")[0] ?? "",
      },
      quantity,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Button type="button" variant="primary" size="lg" onClick={handle} className="w-full">
      {added ? "به سبد اضافه شد ✓" : "افزودن به سبد خرید"}
    </Button>
  );
}
