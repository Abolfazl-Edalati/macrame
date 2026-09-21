import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatToman } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

const PLACEHOLDER = "/hero.jpg";

export function firstImage(product: Product): string {
  try {
    const arr = JSON.parse(product.images) as string[];
    if (arr.length > 0) return arr[0].replace(/^\//, "");
  } catch {
    /* fall through */
  }
  return PLACEHOLDER;
}

export function AvailabilityBadge({ product }: { product: Product }) {
  return product.availability === "in-stock" ? (
    <Badge variant="accent">موجود</Badge>
  ) : (
    <Badge>
      {product.leadTimeDays ? `سفارشی، ${product.leadTimeDays} روز` : "سفارشی"}
    </Badge>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const src = firstImage(product);
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={src}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 768px) 33vw, 50vw"
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-neutral-900">{product.name}</h3>
          <AvailabilityBadge product={product} />
        </div>
        <span className="whitespace-nowrap text-sm font-semibold text-amber-800">
          {formatToman(product.price)}
        </span>
      </div>
    </Link>
  );
}
