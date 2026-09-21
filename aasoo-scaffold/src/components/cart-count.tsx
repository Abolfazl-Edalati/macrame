"use client";

import { useSyncExternalStore } from "react";
import { getCart, cartCount, subscribeCart } from "@/lib/cart";

export function CartCount() {
  const count = useSyncExternalStore(subscribeCart, () => cartCount(getCart()), () => 0);
  if (count === 0) return null;
  return <span className="tabular-nums">{count}</span>;
}
