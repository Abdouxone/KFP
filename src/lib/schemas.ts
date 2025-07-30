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
