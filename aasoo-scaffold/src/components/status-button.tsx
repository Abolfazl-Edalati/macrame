"use client";

import { useTransition } from "react";
import { moveOrderStatus } from "@/lib/admin-actions";
import { ORDER_STATUS_LABELS } from "@/components/order-status-badge";
import { cn } from "@/lib/utils";

export function StatusButton({
  orderId,
  status,
  active,
}: {
  orderId: number;
  status: string;
  active: boolean;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => moveOrderStatus(orderId, status))}
      className={cn(
        "rounded-full border px-3 py-1 text-xs transition",
        active
          ? "border-amber-700 bg-amber-700 font-semibold text-white"
          : "border-neutral-300 text-neutral-600 hover:bg-neutral-100",
      )}
    >
      {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] ?? status}
    </button>
  );
}
