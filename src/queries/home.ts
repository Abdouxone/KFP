"use server";

import { db } from "@/lib/db";
import {
  ProductSimpleVariantType,
  ProductSize,
  ProductType,
  ProductWithVariants,
  SimpleProduct,
  VariantImageType,
} from "@/lib/types";

type FormatType = "simple" | "full";
type Param = {
  property: "category" | "subCategory" | "offer";
  value: string;
  type: FormatType;
};

type PropertyMapping = {
  [key: string]: string;
};
export const getHomeDataDynamic = async (
  params: Param[]
): Promise<Record<string, SimpleProduct[] | ProductType[]>> => {
  if (!Array.isArray(params) || params.length === 0) {
    throw new Error("Invalid input: params must be a non-empty array.");
  }

  // Define mapping for property names to database fields
  const propertyMapping: PropertyMapping = {
    category: "category.url",
    subCategory: "subCategory.url",
  };

  const mapProperty = (property: string): string => {
    if (!propertyMapping[property]) {
      throw new Error(
        `Invalid property: ${property}. Must be one of: category, subCategory, offer.`
      );
    }
    return propertyMapping[property];
  };

  // GetCheapestSize
  const getCheapestSize = (
    sizes: ProductSize[]
  ): { discountedPrice: number } => {
    const sizesWithDisount = sizes.map((size) => ({
      ...size,
      discountedPrice: size.price * (1 - size.discount / 100),
    }));

    return sizesWithDisount.sort(
      (a, b) => a.discountedPrice - b.discountedPrice
    )[0];
  };

  const formatProductData = (
    products: ProductWithVariants[],
    type: FormatType
  ): SimpleProduct[] | ProductType[] => {
    if (type === "simple") {
      return products.map((product) => {
        const variant = product.variants[0];
        const cheapestSize = getCheapestSize(variant.sizes);
        const image = variant.images[0];
        return {
          name: product.name,
          slug: product.slug,
          variantName: variant.variantName,
          variantSlug: variant.slug,
          price: cheapestSize.discountedPrice,
          image: image.url,
        } as SimpleProduct;
      });
    } else if (type === "full") {
      return products.map((product) => {
        // Transform the filtered variants into the VariantSi,plified structure
        const variants: ProductSimpleVariantType[] = product.variants.map(
          (variant) => ({
            variantId: variant.id,
            variantSlug: variant.slug,
            variantName: variant.variantName,
            images: variant.images,
            variantImage: variant.variantImage,
            sizes: variant.sizes,
          })
        );

        // Extract variant images for the product
        const variantImages: VariantImageType[] = variants.map((variant) => ({
          url: `/product/${product.slug}/${variant.variantSlug}`,
          image: variant.variantImage
            ? variant.variantImage
            : variant.images[0].url,
        }));

        return {
          id: product.id,
          slug: product.slug,
          name: product.name,
          variantImages,
          variants,
        } as ProductType;
      });
    } else {
      throw new Error("Invalid format type. Must be 'simple' or 'full'.");
    }
  };

  const results = await Promise.all(
    params.map(async ({ property, value, type }) => {
      const dbField = mapProperty(property);

      // Construct the 'where' clause based on the dbField
      const whereClause =
        dbField === "category.url"
          ? { category: { url: value } }
          : dbField === "subCategory.url"
          ? { subCategory: { url: value } }
          : {};

      // Query products based on the constructed where clause
      const products = await db.product.findMany({
        where: whereClause,
        select: {
          id: true,
          slug: true,
          name: true,
          variants: {
            select: {
              id: true,
              variantName: true,
              variantImage: true,
              slug: true,
              sizes: true,
              images: true,
            },
          },
        },
      });

      // Format the data based on the input
      const formattedData = formatProductData(products, type);

      // Determine the output key based on the property and value
      const outputKey = `products_${value.replace(/-/g, "_")}`;

      return {
        [outputKey]: formattedData,
      };
    })
  );

  return results.reduce((acc, result) => ({ ...acc, ...result }), {});
};

export const getHomeFeaturedCategories = async () => {
  const featuredCategories = await db.category.findMany({
    where: {
      featured: true,
    },
    select: {
      id: true,
      name: true,
      image: true,
      subCategories: {
        where: {
          featured: true,
        },
        select: {
          id: true,
          name: true,
          image: true,
          _count: {
            select: {
              products: true, //Get the count of products in subcategories
            },
          },
        },
        orderBy: {
          products: {
            _count: "desc", // Order by product count
          },
        },
        take: 3, // Limit subcategories to 3
      },
      _count: {
        select: {
          products: true, //Get the count of products in categories
        },
      },
    },
    orderBy: {
      products: {
        _count: "desc", // Order by product count
      },
    },
    take: 6, // Limit categories to 6
  });

  return featuredCategories.map((category) => ({
    id: category.id,
    name: category.name,
    productCount: category._count.products,
    subCategories: category.subCategories.map((subCategory) => ({
      id: subCategory.id,
      name: subCategory.name,
      image: subCategory.image,
      productCount: subCategory._count.products,
    })),
  }));
};
