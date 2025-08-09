import { error } from "console";
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
