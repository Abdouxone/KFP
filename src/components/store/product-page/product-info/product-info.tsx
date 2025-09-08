"use client";
import { ProductPageDataType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
// React
import React, { FC } from "react";
import { CopyIcon } from "../../icons";
import { toast } from "react-hot-toast";
import { ReactStars } from "new-react-stars";
import ProductPrice from "./product-price";
import { Separator } from "@/components/ui/separator";
import ColorWheel from "@/components/shared/color-wheel";
import ProductVariantSelector from "./variant-selector";
import SizeSelector from "./size-selector";

interface Props {
  productData: ProductPageDataType;
  quantity?: number;
  sizeId: string | undefined;
}

const ProductInfo: FC<Props> = ({ productData, quantity, sizeId }) => {
  // Check if productData exists, return null if it's missing (prevents rendering)
  if (!productData) return null;

  // Destructure necessary properties from the productData objects
  const {
    productId,
    name,
    sku,
    colors,
    variantImages,
    sizes,
    isSale,
    saleEndDate,
    variantName,
    store,
    rating,
    reviews,
    numReviews,
  } = productData;

  // Function to copy the SKU to the clipboard
  const copySkuToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sku);
      toast.success("SKU copied to clipboard.");
    } catch (error) {
      toast.error("Failed to copy SKU.");
    }
  };
  return (
    <div className="relative w-full xl:w-[540px]">
      {/* Title */}
      <div>
        <h1 className="text-main-primary inline font-bold leading-5 ">
          {name} · {variantName}
        </h1>
      </div>
      {/* Sku - Rating - Num reviews */}
      <div className="flex items-center text-xs mt-2">
        {/* Store details */}
        <Link
          href={`/stores/${store.url}`}
          className="hidden sm:inline-block md:hidden lg:inline-block mr-2 hover:underline"
        >
          <div className="w-full flex items-center gap-x-1">
            <Image
              src={store.logo}
              alt={store.name}
              width={100}
              height={100}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </Link>
        {/* SkU - Rating - Num reviews */}
        <div className="whitespace-nowrap">
          <span className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-500">
            SKU: {sku}
          </span>
          <span
            className="inline-block align-middle text-[#2F68A8] mx-1 cursor-pointer"
            onClick={copySkuToClipboard}
          >
            <CopyIcon />
          </span>
        </div>
        <div className="ml-4 flex items-center gap-x-2 flex-1 whitespace-nowrap">
          <ReactStars
            count={5}
            size={24}
            color1="#F5F5F5"
            color2="#FFD804"
            value={rating || 0}
            half
            edit={false}
          />
          <Link href="#reviews" className="text-[#ffd804] hover:underline">
            (
            {numReviews === 0
              ? "No review yet"
              : numReviews === 1
              ? "1 review"
              : `${numReviews} reviews`}
            )
          </Link>
        </div>
      </div>
      {/* price */}
      <div className="my-2 relative flex flex-col sm:flex-row justify-between">
        <ProductPrice sizeId={sizeId} sizes={sizes} />
      </div>
      {/* Colors Wheel - Variant Switcher */}
      <Separator className="mt-2" />
      <div className="mt-4 space-y-2 ">
        <div className="relative flex items-center justify-between text-main-primary font-bold">
          <span className="flex items-center gap-x-2">
            {colors.length > 1 ? "Colors" : "Color"}
            <ColorWheel colors={colors} size={22} />
          </span>
        </div>
        {/* Variant Switcher */}
        {variantImages.length > 0 && (
          <ProductVariantSelector
            variants={variantImages}
            slug={productData.variantSlug}
          />
        )}
      </div>
      {/* Size Selector */}
      <div className="space-y-2 pb-2 mt-4">
        <div>
          <h1 className="text-main-primary font-bold">Size</h1>
        </div>
        <SizeSelector sizes={sizes} sizeId={sizeId} />
      </div>
    </div>
  );
};

export default ProductInfo;
