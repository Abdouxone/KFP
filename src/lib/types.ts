import {
  Cart,
  CartItem,
  Prisma,
  ProductVariantImage,
  ShippingAddress,
  Size,
  Willaya,
} from "@/generated/prisma";
import {
  getAllStoreProducts,
  getProductPageData,
  getProducts,
  retrieveProductDetails,
} from "@/queries/product";
import { getAllSubCategories } from "@/queries/Subcategory";
import { Variable } from "lucide-react";
import { StringValidation } from "zod/v3";
import { StringFormatParams } from "zod/v4/core";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

//SubCategory + parent category
export type SubCategoryWithCategoryType = Prisma.PromiseReturnType<
  typeof getAllSubCategories
>[0];

// Product + variant
export type ProductWithVariantType = {
  productId: string;
  variantId: string;
  name: string;
  description: string;
  variantName: string;
  variantDescription: string;
  images: { url: string }[];
  variantImage: string;
  categoryId: string;
  subCategoryId: string;
  brand: string;
  sku: string;
  colors: { color: string }[];
  sizes: { size: string; quantity: number; price: number; discount?: number }[];
  product_specs: { name: string; value: string }[];
  variant_specs: { name: string; value: string }[];
  keywords: string[];
  questions: { question: string; answer: string }[];
  isSale: boolean;
  saleEndDate?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Store Product Type
export type StoreProductType = Prisma.PromiseReturnType<
  typeof getAllStoreProducts
>[0];

// Product return tupe from getProducts query
export type ProductType = Prisma.PromiseReturnType<
  typeof getProducts
>["products"][0];

export type VariantSimplified = {
  variantId: string;
  variantSlug: string;
  variantName: string;
  images: ProductVariantImage[];
  sizes: Size[];
};

export type VariantImageType = {
  url: string;
  image: string;
};

export type ProductPageType = Prisma.PromiseReturnType<
  typeof retrieveProductDetails
>;

export type ProductPageDataType = Prisma.PromiseReturnType<
  typeof getProductPageData
>;

export type CartProductType = {
  productId: string;
  variantId: string;
  productSlug: string;
  variantSlug: string;
  name: string;
  variantName: string;
  image: string;
  variantImage: String;
  sizeId: string;
  size: string;
  quantity: number;
  price: number;
  stock: number;
};

export type VariantInfoType = {
  variantName: string;
  variantSlug: string;
  variantImage: string;
  variantUrl: string;
  images: ProductVariantImage[];
  sizes: Size[];
  colors: string;
};

export type CartWithCartItemsType = Cart & {
  cartItems: CartItem[];
};

export type userShippingAddressType = ShippingAddress & {
  willaya: Willaya;
};
