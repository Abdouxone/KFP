"use server";
// DB
import { db } from "@/lib/db";
// Types
import {
  ProductPageType,
  ProductWithVariantType,
  VariantImageType,
  VariantSimplified,
} from "@/lib/types";
import { generateUniqueSlug } from "@/lib/utils";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Slugify
import slugify from "slugify";

// Function: upsertProduct
// Description: Upserts a product and its variant into the database, ensuring proper association
// Access Level: Seller Only
// Parameters:
// - Product: ProductWithVariant object containing details of the product and its variant.
// - storeUrl: The Url of the store to which the product belongs
// Returns: Newly created or updated product With variant details.

export const upsertProduct = async (
  product: ProductWithVariantType,
  storeUrl: string
) => {
  try {
    // Retrieve current user
    const user = await currentUser();

    // Check if user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Ensure user has seller privileges
    if (user.privateMetadata.role !== "SELLER") {
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry."
      );
    }

    // Ensure product data is provided
    if (!product) throw new Error("Please provide product data.");

    // Check if the product already exists
    const existingProduct = await db.product.findUnique({
      where: { id: product.productId },
    });

    // Find the store by URL
    const store = await db.store.findUnique({
      where: { url: storeUrl },
    });

    // If store is not found, throw an error
    if (!store) throw new Error("Store not found awdii.");

    // Generate Unique slugs for product and variant.
    // Product
    console.log("product name", product.name);
    console.log("variant name", product.variantName);

    const productSlug = await generateUniqueSlug(
      slugify(product.name, {
        replacement: "-",
        lower: true,
        trim: true,
      }),
      "product"
    );
    // Variant
    const variantSlug = await generateUniqueSlug(
      slugify(product.variantName, {
        replacement: "-",
        lower: true,
        trim: true,
      }),
      "productVariant"
    );

    // Common data for product and variant
    // Product
    const commonProductData = {
      name: product.name,
      description: product.description,
      slug: productSlug,
      brand: product.brand,
      questions: {
        create: product.questions.map((q) => ({
          question: q.question,
          answer: q.answer,
        })),
      },
      specs: {
        create: product.product_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },

      store: { connect: { id: store.id } },
      category: { connect: { id: product.categoryId } },
      subCategory: { connect: { id: product.subCategoryId } },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
    // Variant
    const commonVariantData = {
      variantName: product.variantName,
      variantDescription: product.variantDescription,
      slug: variantSlug,
      specs: {
        create: product.variant_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },
      saleEndDate: product.isSale ? product.saleEndDate : "",
      isSale: product.isSale,
      sku: product.sku,
      keywords: product.keywords.join(","),
      images: {
        create: product.images.map((image) => ({
          url: image.url,
          alt: image.url.split("/").pop() || "",
        })),
      },
      variantImage: product.variantImage,
      colors: {
        create: product.colors.map((color) => ({
          name: color.color,
        })),
      },
      sizes: {
        create: product.sizes.map((size) => ({
          size: size.size,
          quantity: size.quantity,
          price: size.price,
          discount: size.discount,
        })),
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    // If product exists, create a variant
    if (existingProduct) {
      const variantData = {
        ...commonVariantData,
        product: { connect: { id: product.productId } },
      };
      return await db.productVariant.create({ data: variantData });
    } else {
      // Otherwise, create a new product with Variants
      const productData = {
        ...commonProductData,
        id: product.productId,
        variants: {
          create: [
            {
              id: product.variantId,
              ...commonVariantData,
            },
          ],
        },
      };
      return await db.product.create({ data: productData });
    }

    //end
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getProductMainInfo
// Description: Retrieves the main information of a specefic product from the database.
// Access Level: Public
// Parameters:
//  - productId: The ID of the product to be retrieved
// Returns: An object containing the main information of the product or null if the product is not found

export const getProductMainInfo = async (productId: string) => {
  // Retrieve the product from the database
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) return null;

  // Return the main information of the product
  return {
    productId: product.id,
    name: product.name,
    description: product.description,
    brand: product.brand,
    categoryId: product.categoryId,
    subCategoryId: product.subCategoryId,
    storeUrl: product.storeId,
  };
};

// Function: getAllStoreProducts
// Description: Retrieves all products from a specific store based on the store Url.
// Access Level: Public
// Parameters:
// - storeUrl: The URL of the store whose products are to be retrieved.
// - Returns: An array of products from the specific store, including category, subcategory, and variant details.

export const getAllStoreProducts = async (storeUrl: string) => {
  // Retrieve store details from the database using the storeURL
  const store = await db.store.findUnique({
    where: {
      url: storeUrl,
    },
  });

  // If no store found throw an error
  if (!store) throw new Error("Please provide a valid Store URL.");

  // Retrieve all products associated with the store
  const products = await db.product.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      category: true,
      subCategory: true,
      variants: {
        include: {
          colors: true,
          sizes: true,
          images: true,
        },
      },
      store: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });
  return products;
};

// Function: deleteProduct
// Description: Deletes a product from the databsae
// Permission Level: Seller
// Parameters:
//  - productI: The ID of the product to be deleted
// Returns: Response indicating success or failure of the deletion operation.

export const deleteProduct = async (productId: string) => {
  // Get current user
  const user = await currentUser();

  // check if yser is authenticated
  if (!user) throw new Error("Unauthenticated.");

  // Ensure user has seller privileges
  if (user.privateMetadata.role !== "SELLER") {
    throw new Error(
      "Unauthorized Access: Seller Privileges Required for Entry!"
    );
  }

  // Ensure product data is provided
  if (!productId) throw new Error("Please provide product ID.");

  // // Delete product variants first
  // await db.productVariant.deleteMany({
  //   where: { productId },
  // });
  // Delete all children first
  const variants = await db.productVariant.findMany({
    where: { productId },
    select: { id: true },
  });

  for (const variant of variants) {
    await db.color.deleteMany({ where: { productVariantId: variant.id } });
    await db.size.deleteMany({ where: { productVariantId: variant.id } });
    await db.productVariantImage.deleteMany({
      where: { productVariantId: variant.id },
    });

    await db.productVariant.delete({ where: { id: variant.id } });
  }

  // Delete product from the database
  const response = await db.product.delete({
    where: {
      id: productId,
    },
  });
  return response;
};

// Function: getProducts
// Description: Retrieves products based on various filters and returns only variants that match the filters. Supports pagination.
// Access Level: Public
// Parameters:
// -filters: An object containing filter options (category, subCategory, size, onSale, onDiscount, brand, color)
// -sortBy: Sort the filtered results (Most popular, New Arivals, Top Rated...).
// -page: The current page number for pagination (default = 1).
// -PageSize: The number of products per page (default = 10).
// Returns: An object conatining paginated products, filtered variants, and pagination metadata (totalPages, currentPage, pageSize, totalCount).

export const getProducts = async (
  filters: any = {},
  sortBy = "",
  page: number = 1,
  pageSize: number = 10
) => {
  // Default values for page and pageSize
  const currentPage = page;
  const limit = pageSize;
  const skip = (currentPage - 1) * limit;

  // Construct the base query object
  const wherClause: any = {
    AND: [],
  };

  // Apply category filter (using category URL)
  if (filters.category) {
    const category = await db.category.findUnique({
      where: {
        url: filters.category,
      },
      select: { id: true },
    });
    if (category) {
      wherClause.AND.push({ categoryId: category.id });
    }
  }

  // Apply store filter (using store URL)
  if (filters.store) {
    const store = await db.store.findUnique({
      where: {
        url: filters.store,
      },
      select: { id: true },
    });
    if (store) {
      wherClause.AND.push({ storeId: store.id });
    }
  }

  // Apply subCategory filter (using subCategory URL)
  if (filters.subCategory) {
    const subCategory = await db.subCategory.findUnique({
      where: {
        url: filters.subCategory,
      },
      select: { id: true },
    });
    if (subCategory) {
      wherClause.AND.push({ subCategoryId: subCategory.id });
    }
  }

  // Get all filtered, sorted products
  const products = await db.product.findMany({
    where: wherClause,
    take: limit, // Limit ti page size
    skip: skip, // Skip the products of previous pages
    include: {
      variants: {
        include: {
          sizes: true,
          images: true,
          colors: true,
        },
      },
    },
  });

  // Transform the products with filtered variants into ProductCardType structure
  const productsWithFilteredVariants = products.map((product) => {
    // Filter the variatns based on the provided filters
    const filteredVariants = product.variants;

    // Transform the filtered variants into the VariantSimplified structure
    const variants: VariantSimplified[] = filteredVariants.map((variant) => ({
      variantId: variant.id,
      variantSlug: variant.slug,
      variantName: variant.variantName,
      images: variant.images,
      sizes: variant.sizes,
    }));

    // Extract variant images for the product
    const variantImages: VariantImageType[] = filteredVariants.map(
      (variant) => ({
        url: `/product/${product.slug}/${variant.slug}`,
        image: variant.variantImage
          ? variant.variantImage
          : variant.images[0]?.url || "",
      })
    );

    // Return the product in the ProductCardType structure
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      rating: product.rating,
      variants,
      variantImages,
    };
  });

  // Retrieve products matching the filters
  /*   const totalCount = await db.product.count({
    where: wherClause,
  }); */
  const totalCount = products.length;

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  // Return the paginated data along with metadata
  return {
    products: productsWithFilteredVariants,
    totalPages,
    currentPage,
    pageSize,
    totalCount,
  };
};

// function: getProductPageData
// Description: Retrieves details of a specific product variant from the database.
// Access Level: Public
// Parameters:
// - productSlug: The slug of the product to which the variant belongs.
// - variantSlug: The slug of the variant to be retrieved.
// returns: Details of the requested product variant.

export const getProductPageData = async (
  productSlug: string,
  variantSlug: string
) => {
  // Retrieve the product vatiant details from the database
  const product = await retrieveProductDetails(productSlug, variantSlug);

  if (!product) return null;

  return formatProductResponse(product);
};

// Helper functions
export const retrieveProductDetails = async (
  productSlug: string,
  variantSlug: string
) => {
  const product = await db.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: {
      category: true,
      subCategory: true,
      store: true,
      specs: true,
      questions: true,
      variants: {
        where: {
          slug: variantSlug,
        },
        include: {
          images: true,
          colors: true,
          sizes: true,
          specs: true,
        },
      },
    },
  });

  // Get variant Image
  if (!product) return null;
  const variantImages = await db.productVariant.findMany({
    where: {
      productId: product.id,
    },
    select: {
      slug: true,
      variantImage: true,
    },
  });

  return {
    ...product,
    variantImages: variantImages.map((v) => ({
      url: `/product/${product.slug}/${v.slug}`,
      img: v.variantImage,
      slug: v.slug,
    })),
  };
};

const formatProductResponse = (product: ProductPageType) => {
  if (!product) return;
  const variant = product?.variants[0];
  const { store, category, subCategory, questions } = product;
  const { colors, sizes } = variant;

  return {
    productId: product.id,
    variantId: variant.id,
    productSlug: product.slug,
    variantSlug: variant.slug,
    name: product.name,
    description: product.description,
    variantName: variant.variantName,
    variantDescription: variant.variantDescription,
    images: variant.images,
    category,
    subCategory,
    isSale: variant.isSale,
    saleEndDate: variant.saleEndDate,
    brand: product.brand,
    sku: variant.sku,
    variantImage: variant.variantImage,
    store: {
      id: store.id,
      url: store.url,
      name: store.name,
      logo: store.logo,
      followersCount: 10,
      isUserFollowingStore: true,
    },
    colors,
    sizes,
    specs: {
      product: product.specs,
      variant: variant.specs,
    },
    questions,
    rating: product.rating,
    reviews: [],
    numReviews: 122,
    reviewsStatistics: {
      ratingStatistics: [],
      reviewsWithImagesCount: 5,
    },
    shipingDetails: {},
    relatedProduct: [],
    variantImages: product.variantImages,
  };
};
