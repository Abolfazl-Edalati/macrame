import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/db/schema";

const LABELS: Record<OrderStatus, string> = {
  new: "جدید",
  confirmed: "تأیید شد",
  shipped: "ارسال شد",
  delivered: "تحویل شد",
  cancelled: "لغو شد",
};

const VARIANTS: Record<OrderStatus, "accent" | "default" | "outline"> = {
  new: "accent",
  confirmed: "default",
  shipped: "default",
  delivered: "default",
  cancelled: "outline",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={VARIANTS[status] ?? "default"}>{LABELS[status] ?? status}</Badge>
  );
}

export const ORDER_STATUS_LABELS = LABELS;
