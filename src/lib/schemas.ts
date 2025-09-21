import { error } from "console";
import { min } from "date-fns";
import { url } from "inspector";
import * as z from "zod";

// Category form schema

export const CategoryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters long." })
    .max(50, { message: "Category name must be at most 50 characters long." })
    .nonempty("Category name is required")
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: "Category name can only contain letters, numbers, and spaces.",
    }),

  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, { message: "Choose a category Image." }),

  url: z
    .string("Category URL must be a string!")
    .min(2, { message: "Category Url must be at least 2 characters long." })
    .max(50, { message: "Category Url must be at most 50 characters long." })
    .nonempty("Category image is required")
    .regex(/^(?!.*(?:[-_]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters,numbers,hyphen,and underscore are allowed in the category url",
    }),
  featured: z.boolean().default(false).optional(),
});

// SubCategory form schema
export const SubCategoryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "SubCategory name must be at least 2 characters long." })
    .max(50, {
      message: "SubCategory name must be at most 50 characters long.",
    })
    .nonempty("SubCategory name is required")
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message:
        "SubCategory name can only contain letters, numbers, and spaces.",
    }),

  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, { message: "Choose a SubCategory Image." }),

  url: z
    .string("SubCategory URL must be a string!")
    .min(2, { message: "SubCategory Url must be at least 2 characters long." })
    .max(50, { message: "SubCategory Url must be at most 50 characters long." })
    .nonempty("SubCategory image is required")
    .regex(/^(?!.*(?:[-_]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters,numbers,hyphen,and underscore are allowed in the SubCategory url",
    }),
  featured: z.boolean().default(false).optional(),
  categoryId: z.uuid(),
});

// Store Schema
export const StoreFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Store name must be at least 2 characters long." })
    .nonempty("Store name is required")
    .max(50, { message: "Store name cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_& ]){2,})[a-zA-Z0-9_ &-]+$/, {
      message:
        "Only letters, numbers, space, hyphen, and underscore are allowed in the store name, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
  description: z
    .string()
    .nonempty("Store description is required")
    .min(30, {
      message: "Store description must be at least 30 characters long.",
    })
    .max(500, { message: "Store description cannot exceed 500 characters." }),
  email: z
    .string()
    .nonempty("Store email is required")
    .email({ message: "Invalid email format." }),
  phone: z
    .string()
    .nonempty("Store phone number is required")
    .regex(/^\+?\d+$/, { message: "Invalid phone number format." }),
  logo: z.object({ url: z.string() }).array().length(1, "Choose a logo image."),
  cover: z
    .object({ url: z.string() })
    .array()
    .length(1, "Choose a cover image."),
  url: z
    .string()
    .nonempty("Store url is required")
    .min(2, { message: "Store url must be at least 2 characters long." })
    .max(50, { message: "Store url cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the store url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
  featured: z.boolean().default(false).optional(),
  status: z.string().default("PENDING").optional(),
});

// Product Schema
export const ProductFormSchema = z.object({
  name: z
    .string("Product name must be a valid string.")
    .min(2, { message: "Product name should be at least 2 characters long." })
    .max(200, { message: "Product name cannot exceed 200 characters." })
    .nonempty("Product name is required")
    .regex(/^(?!.*(?:[-_ &' ]){2,})[a-zA-Z0-9_ '&-]+$/, {
      message:
        "Product name may only contain letters, numbers, spaces, hyphens, underscores, ampersands, and apostrophes, without consecutive special characters.",
    }),
  description: z
    .string("Product description must be a valid string.")
    .min(2, {
      message: "Product description should be at least 2 characters long.",
    })
    .nonempty("Product description is required."),

  variantName: z
    .string("Product variant name must be a valid string.")
    .min(2, {
      message: "Product variant name should be at least 2 characters long.",
    })
    .max(100, { message: "Product variant name cannot exceed 100 characters." })
    .nonempty("Product variant name is required.")
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      message:
        "Product variant name may only contain letters, numbers, spaces, hyphens, and underscores, without consecutive special characters.",
    }),

  variantDescription: z
    .string("Product variant description must be a valid string.")
    .optional(),

  images: z
    .object({ url: z.string() })
    .array()
    .min(3, { message: "Please upload at least 3 images for the product." })
    .max(6, { message: "You can upload up to 6 images for the product." }),

  variantImage: z
    .object({ url: z.string() })
    .array()
    .length(1, "Choose a product variant image."),

  categoryId: z
    .string("Product category ID must be a valid string.")
    .nonempty("Product category ID is required.")
    .uuid(),

  subCategoryId: z
    .string("Product sub-category ID must be a valid string.")
    .nonempty("Product sub-category ID is required.")
    .uuid(),

  // offerTagId: z
  //   .string("Product offer tag ID must be a valid string.")
  //   .nonempty("Product offer tag ID is required.")
  //   .uuid()
  //   .optional(),

  brand: z
    .string("Product brand must be a valid string.")
    .nonempty("Product brand is required.")
    .min(2, { message: "Product brand should be at least 2 characters." })
    .max(50, { message: "Product brand cannot exceed 50 characters." }),

  sku: z
    .string("Product SKU must be valid string.")
    .nonempty("Product SKU is required.")
    .min(6, { message: "Product SKU should be at least 6 characters." })
    .max(50, { message: "Product SKU cannot exceed 50 characters." }),

  // weight: z
  //   .number()
  //   .min(0.01, "Please Provide a valid product weight.")
  //   .optional(),

  keywords: z
    .string("Product keywords must be a valid string.")
    .nonempty("Product keywords are required.")
    .array()
    .min(1, { message: "Please provide at least 5 keywords." })
    .max(10, { message: "You can provide up to 10 keywords." }),

  colors: z
    .object({ color: z.string() })
    .array()
    .min(1, "Please provide at least 1 color.")
    .refine((colors) => colors.every((c) => c.color.length > 0), {
      message: "All color inputs must be filled.",
    }),

  sizes: z
    .object({
      size: z.string(),
      quantity: z
        .number()
        .min(1, { message: "Quantity must be greater than 0." }),

      price: z.number().min(10, { message: "Price must be greater than 10." }),
      discount: z.number().min(0).default(0).optional(),
    })
    .array()
    .min(1, "Please provide at least one size.")
    .refine(
      (sizes) =>
        sizes.every((s) => s.size.length > 0 && s.price > 0 && s.quantity > 0),
      { message: "All size inputs must be filled correctly." }
    ),
  product_specs: z
    .object({
      name: z.string(),
      value: z.string(),
    })
    .array()
    .min(1, "Please provide at least one product spec.")
    .refine(
      (product_specs) =>
        product_specs.every((s) => s.name.length > 0 && s.value.length > 0),
      { message: "All product specs must be filled correctly." }
    ),

  variant_specs: z
    .object({
      name: z.string(),
      value: z.string(),
    })
    .array()
    .min(1, "Please provide at least one product variant spec.")
    .refine(
      (variant_specs) =>
        variant_specs.every((s) => s.name.length > 0 && s.value.length > 0),
      { message: "All product variant specs must be filled correctly." }
    ),
  questions: z
    .object({
      question: z.string(),
      answer: z.string(),
    })
    .array()
    .optional(),
  isSale: z.boolean().default(false).optional(),
  saleEndDate: z.string().optional(),
});

export const ShippingAddressSchema = z.object({
  willayaId: z.string().nonempty("Willaya is required.").uuid(),
  firstName: z
    .string()
    .min(2, { message: "First name should be at least 2 characters long." })
    .max(50, { message: "First name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z]+$/, {
      message: "No special characters are allowed in name.",
    }),

  lastName: z
    .string()
    .min(2, { message: "Last name should be at least 2 characters long." })
    .max(50, { message: "Last name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z]+$/, {
      message: "No special characters are allowed in name.",
    }),
  phone: z
    .string()
    .regex(/^\+?\d+$/, { message: "Invalid phone number format." }),

  address1: z
    .string()
    .min(5, { message: "Address line 1 should be at least 5 characters long." })
    .max(100, { message: "Address line 1 cannot exceed 100 characters." }),

  commune: z.string(),

  default: z.boolean().default(false).nonoptional(),
});
