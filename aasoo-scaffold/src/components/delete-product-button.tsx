"use client";

import { useState } from "react";
import { deleteProduct } from "@/lib/admin-actions";

export function DeleteProductButton({ id, name }: { id: number; name: string }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500">حذف شود؟</span>
        <button
          onClick={() => deleteProduct(id)}
          className="rounded-full bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
        >
          بله
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100"
        >
          خیر
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-red-600 hover:bg-red-50"
    >
      حذف
    </button>
  );
}
