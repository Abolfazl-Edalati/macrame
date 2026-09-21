import type { MetadataRoute } from "next";
import { getPublishedProducts } from "@/db/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://aasoomacrame.example";
  const products = await getPublishedProducts();

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/products`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: new Date(Number(p.updatedAt) * 1000 || Date.now()),
    })),
  ];
}
