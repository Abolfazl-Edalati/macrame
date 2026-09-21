"use client";

export type CartLine = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const KEY = "aasoo-cart";

export function getCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(lines: CartLine[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("aasoo-cart-change"));
}

export function addToCart(line: Omit<CartLine, "quantity">, qty = 1): void {
  const cart = getCart();
  const existing = cart.find((l) => l.productId === line.productId);
  if (existing) existing.quantity += qty;
  else cart.push({ ...line, quantity: qty });
  saveCart(cart);
}

export function setQuantity(productId: number, qty: number): void {
  const cart = getCart().map((l) =>
    l.productId === productId ? { ...l, quantity: Math.max(1, qty) } : l,
  );
  saveCart(cart);
}

export function removeLine(productId: number): void {
  saveCart(getCart().filter((l) => l.productId !== productId));
}

export function clearCart(): void {
  saveCart([]);
}

export function cartTotal(cart: CartLine[]): number {
  return cart.reduce((sum, l) => sum + l.price * l.quantity, 0);
}

export function cartCount(cart: CartLine[]): number {
  return cart.reduce((sum, l) => sum + l.quantity, 0);
}

/** Subscribe to cart changes (React useSyncExternalStore-friendly). */
export function subscribeCart(cb: () => void): () => void {
  window.addEventListener("aasoo-cart-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("aasoo-cart-change", cb);
    window.removeEventListener("storage", cb);
  };
}
