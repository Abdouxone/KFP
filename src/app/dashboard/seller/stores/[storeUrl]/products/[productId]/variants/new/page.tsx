"use server";
// Product Details form
import ProductDetails from "@/components/dashboard/forms/product-details";

// Queries
import { getAllCategories } from "@/queries/category";
import { getProductMainInfo } from "@/queries/product";

export default async function SellerNewProductVariantPage({
  params,
}: {
  params: { storeUrl: string; productId: string };
}) {
  // Get categories
  const categories = await getAllCategories();

  // Get product
  const product = await getProductMainInfo(params.productId);

  // if no product return Null
  if (!product) return null;

  return (
    <div>
      <ProductDetails
        categories={categories}
        storeUrl={params.storeUrl}
        data={product}
      />
    </div>
  );
}
