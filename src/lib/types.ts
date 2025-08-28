import { Prisma } from "@/generated/prisma";
import { getAllStoreProducts } from "@/queries/product";
import { getAllSubCategories } from "@/queries/Subcategory";

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
  keywords: string[];
  isSale: boolean;
  saleEndDate?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Store Product Type
export type StoreProductType = Prisma.PromiseReturnType<
  typeof getAllStoreProducts
>[0];
