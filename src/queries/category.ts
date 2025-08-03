"use server";
// prisma import
import { Category } from "@/generated/prisma/client";

// Database import
import { db } from "@/lib/db";

//clerk import
import { currentUser } from "@clerk/nextjs/server";

// Function: upsertCategory
// Description: Upserts a category into the database, updating if it exists or creating a new one if not.
// Permission Level: Admin only
// Parameters:
//   - category: Category object containing details of the category to be upserted.
// Returns: Updated or newly created category details.

export const upsertCategory = async (category: Category) => {
  try {
    //get current user
    const user = await currentUser();

    console.log("Upserting category with data:", category);

    //Ensure user  is authenticated
    if (!user) throw new Error("Unauthenticated.");

    //Verify admin permission
    if (user.privateMetadata.role !== "ADMIN")
      throw new Error(
        "Uauthenticated Access: Admin Privileges Required for Entry."
      );

    //Ensure category data is required
    if (!category) throw new Error("Please provide category data.");

    //Throw Error if Category with same name or URL already exists
    const existingCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          {
            NOT: {
              id: category.id,
            },
          },
        ],
      },
    });

    //Throw Error if Category with same name or URL already exists
    if (existingCategory) {
      let errorMessage = "";
      if (existingCategory.name === category.name) {
        errorMessage += "Category with same name already exists.";
      } else if (existingCategory.url === category.url) {
        errorMessage += "Category with same URL already exists.";
      }
      throw new Error(errorMessage);
    }

    // Upsert Category into database
    const CategoryDetails = await db.category.upsert({
      where: {
        id: category.id,
      },
      update: {
        name: category.name ?? "",
        image: category.image ?? "",
        url: category.url ?? "",
        featured: category.featured ?? false,
        updatedAt: category.updatedAt ?? new Date(),
      },
      create: {
        id: category.id,
        name: category.name ?? "",
        image: category.image ?? "",
        url: category.url ?? "",
        featured: category.featured ?? false,
        createdAt: category.createdAt ?? new Date(),
        updatedAt: category.updatedAt ?? new Date(),
      },
    });
    return CategoryDetails;
  } catch (error) {
    //log and re-throw any errors
    // console.log(error);
    throw error;
  }
};
