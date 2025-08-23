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
    console.log(
      "currnt date",
      new Date().toLocaleString("en-US", {
        timeZone: "Africa/Algiers",
      })
    );

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

// Function: getAllCategories
// Description: Retrieves all categories from the database.
// Permission Level: Public
// Returns: Array of Categories sorted by updatedAt date in descending order.

export const getAllCategories = async () => {
  // Retrive all categories from database
  const categories = await db.category.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return categories;
};

// Function: getAllSubCategoriesForCategory
// Description: Retrieves all Subcategories for a category from the database.
// Permission Level: Public
// Returns: Array of SubCategories sorted by updatedAt date in descending order.

export const getAllSubCategoriesForCategory = async (categoryId: string) => {
  // Retrive all subCategories from database
  const subCategories = await db.subCategory.findMany({
    where: {
      categoryId: categoryId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subCategories;
};

// Function: getCategory
// Description: Retrieves a specific category from the database.
// Access Level: Public
// Parameters:
//  -categoryId: The ID of the category to be retrieved.
// Returns: Details of the requested category.

export const getCategory = async (categoryId: string) => {
  //Ensure category ID is provided
  if (!categoryId) throw new Error("Please provide category ID.");

  // Retrieve category
  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  return category;
};

// Function: deleteCategory
// Description: Deletes a category from the database.
// Permission Level: Admin only
// Parameters:
//  -categoryId: The ID of the category to be deleted.
// Returns: Response indicating success or failure of the deletion operation.

export const deleteCategory = async (categoryId: string) => {
  //get current user
  const user = await currentUser();

  //Check if user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  //Verify admin permission
  if (user.privateMetadata.role !== "ADMIN") {
    throw new Error(
      "Unauthorized Access: Admin Privileges Required for Entry!"
    );
  }

  //Ensure category ID is provided
  if (!categoryId) throw new Error("Please provide category ID.");

  // Delete category from the database
  const response = await db.category.delete({
    where: {
      id: categoryId,
    },
  });
  return response;
};
