interface PageProps {
  params: { productSlug: string; variantSlug: string };
}

export default function ProductVariantPage({
  params: { productSlug, variantSlug },
}: PageProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold">Variant Page</h1>
    </div>
  );
}
