// Prisma
import { PrismaClient } from "@/generated/prisma";
import { clsx, type ClassValue } from "clsx";

// ColorThief
import ColorThief from "colorthief";

// Tailwind
import { twMerge } from "tailwind-merge";

//DB
import { db } from "./db";
import { CartProductType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to get grid class names depending on length
export const getGridClassName = (length: number) => {
  switch (length) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-1 ";
    case 5:
      return "grid-cols-2 grid-rows-6";
    case 6:
      return "grid-cols-2";
    default:
      return "";
  }
};

// Function to get prominent colors from an image
export const getDominantColors = (imgUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 4).map((color) => {
          // Convert RGB array to hex string
          return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2])
            .toString(16)
            .slice(1)
            .toUpperCase()}`;
        });
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};

// Helper function to generate a unique slug
export const generateUniqueSlug = async (
  baseSlug: string,
  model: keyof PrismaClient,
  field: string = "slug",
  separator: string = "-"
) => {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existingRecord = await (db[model] as any).findFirst({
      where: {
        [field]: slug,
      },
    });
    if (!existingRecord) {
      break;
    }
    slug = `${slug}${separator}${suffix}`;
    suffix += 1;
  }
  return slug;
};

// Function to validate the product data before adding it to the cart
export const isProductValidToAdd = (product: CartProductType): boolean => {
  // Check that all required fields are filled
  const {
    productId,
    variantId,
    productSlug,
    variantSlug,
    name,
    variantName,
    image,
    quantity,
    price,
    sizeId,
    size,
    stock,
    variantImage,
  } = product;

  // Ensure that all necessary fields have values
  if (
    !productId ||
    !variantId ||
    !productSlug ||
    !variantSlug ||
    !name ||
    !variantName ||
    !image ||
    quantity <= 0 ||
    price <= 0 ||
    !sizeId || // Ensure sizeId is not empty
    !size || // Ensure size is not empty
    stock <= 0 ||
    !variantImage // Ensure variantImage is not empty
  ) {
    return false; // Validation failed
  }

  return true; // Product is valid
};
