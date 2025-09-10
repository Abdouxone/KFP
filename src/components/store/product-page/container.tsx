"use client";
import { CartProductType, ProductPageDataType } from "@/lib/types";
import { FC, ReactNode, useEffect, useState } from "react";
import ProductSwiper from "./product-swiper";
import ProductInfo from "./product-info/product-info";
import { isProductValidToAdd } from "@/lib/utils";

interface Props {
  productData: ProductPageDataType;
  sizeId: string | undefined;
  children: ReactNode;
}

const ProductPageContainer: FC<Props> = ({ productData, sizeId, children }) => {
  // If there is no product data available, render nothing (null)
  if (!productData) return null;
  const { images } = productData;

  // Initialize the default product data for the cart item
  const data: CartProductType = {
    productId: productData.productId,
    variantId: productData.variantId,
    productSlug: productData.productSlug,
    variantSlug: productData.variantSlug,
    name: productData.name,
    variantName: productData.variantName,
    image: productData.images[0].url,
    variantImage: productData.variantImage,
    sizeId: sizeId || "",
    size: "",
    quantity: 1,
    price: 0,
    stock: 1,
  };

  // useState hook to manage the product's state in the cart
  const [productToBeAddedToCart, setProductToBeAddedToCart] =
    useState<CartProductType>(data);

  // useState hook to manage product validity to be added to cart
  const [isProductValid, setIsProductValid] = useState<boolean>(false);

  // Function to handle state changes for the product properties
  const handleChange = (property: keyof CartProductType, value: any) => {
    setProductToBeAddedToCart((prevProduct) => ({
      ...prevProduct,
      [property]: value,
    }));
  };

  useEffect(() => {
    const check = isProductValidToAdd(productToBeAddedToCart);
    setIsProductValid(check);
  }, [productToBeAddedToCart]);

  console.log("productToBeAddedToCart ====>", productToBeAddedToCart);

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        {/* Product images Swiper */}
        <ProductSwiper images={images} />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row ">
          {/* Product Main Info */}
          <ProductInfo
            productData={productData}
            sizeId={sizeId}
            handleChange={handleChange}
          />
          {/* Buy actions card */}
        </div>
      </div>
      <div className="w-[calc(100%-390px)] mt-6 pb-16 ">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
