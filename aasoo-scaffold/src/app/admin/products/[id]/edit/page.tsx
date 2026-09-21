import { notFound } from "next/navigation";
import { getProduct } from "@/db/queries";
import { AdminProductForm } from "@/components/admin-product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(Number(id));
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">ویرایش: {product.name}</h1>
      <AdminProductForm
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          category: product.category,
          availability: product.availability,
          leadTimeDays: product.leadTimeDays,
          variantOptions: product.variantOptions,
          images: product.images,
          published: product.published,
        }}
      />
    </div>
  );
}
