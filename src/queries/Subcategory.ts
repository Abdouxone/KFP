"use server";
// prisma import
import { SubCategory } from "@/generated/prisma/client";

// Database import
import { db } from "@/lib/db";

//clerk import
import { currentUser } from "@clerk/nextjs/server";

// Function: upsertSubCategory
// Description: Upserts a Subcategory into the database, updating if it exists or creating a new one if not.
// Permission Level: Admin only
// Parameters:
//   - Subcategory: SubCategory object containing details of the Subcategory to be upserted.
// Returns: Updated or newly created Subcategory details.

export const upsertSubCategory = async (subCategory: SubCategory) => {
  try {
    //get current user
    const user = await currentUser();

    console.log("Upserting SubCategory with data:", subCategory);
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

    //Ensure SubCategory data is required
    if (!subCategory) throw new Error("Please provide subCategory data.");

    //Throw Error if SubCategory with same name or URL already exists
    const existingSubCategory = await db.subCategory.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: subCategory.name }, { url: subCategory.url }],
          },
          {
            NOT: {
              id: subCategory.id,
            },
          },
        ],
      },
    });

    //Throw Error if Category with same name or URL already exists
    if (existingSubCategory) {
      let errorMessage = "";
      if (existingSubCategory.name === subCategory.name) {
        errorMessage += "A SubCategory with same name already exists.";
      } else if (existingSubCategory.url === subCategory.url) {
        errorMessage += "A SubCategory with same URL already exists.";
      }
      throw new Error(errorMessage);
    }

    // Upsert SubCategory into database
    const subCategoryDetails = await db.subCategory.upsert({
      where: {
        id: subCategory.id,
      },
      update: subCategory,
      create: subCategory,
    });
    return subCategoryDetails;
  } catch (error) {
    //log and re-throw any errors
    console.log(error);
    throw error;
  }
};

// Function: getAllSubCategories
// Description: Retrieves all Subcategories from the database.
// Permission Level: Public
// Returns: Array of SubCategories sorted by updatedAt date in descending order.

export const getAllSubCategories = async () => {
  // Retrive all Subcategories from database
  const subcategories = await db.subCategory.findMany({
    include: {
      category: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subcategories;
};

// Function: getSubCategory
// Description: Retrieves a specific Subcategory from the database.
// Access Level: Public
// Parameters:
//  -categoryId: The ID of the Subcategory to be retrieved.
// Returns: Details of the requested Subcategory.

export const getSubCategory = async (subCategoryId: string) => {
  //Ensure subCategory ID is provided
  if (!subCategoryId) throw new Error("Please provide subCategory ID.");

  // Retrieve subCategory
  const subCategory = await db.subCategory.findUnique({
    where: {
      id: subCategoryId,
    },
  });
  return subCategory;
};

// Function: deleteSubCategory
// Description: Deletes a Subcategory from the database.
// Permission Level: Admin only
// Parameters:
//  -SubcategoryId: The ID of the category to be deleted.
// Returns: Response indicating success or failure of the deletion operation.

export const deleteSubCategory = async (subCategoryId: string) => {
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

  //Ensure subCategory ID is provided
  if (!subCategoryId) throw new Error("Please provide subCategory ID.");

  // Delete subCategory from the database
  const response = await db.subCategory.delete({
    where: {
      id: subCategoryId,
    },
  });
  return response;
};

// Function: getSubCategories
// Description: Retrieves Subcategories from the database, with options for limiting results and random selection.
// Parameters:
// --limit: Number indicating the maximum number of subcategories to retrieve.
// --random: Boolean indicating whether to return random subcategories.
// Returns: List of subcategories based on the provided parameters.

export const getSubCategories = async (
  limit: number | null,
  random: boolean = false
): Promise<SubCategory[]> => {
  // Define SortOrder enum
  enum SortOrder {
    asc = "asc",
    desc = "desc",
  }
  try {
    // Define the query options
    const queryOptions = {
      take: limit || undefined, // Use the provided limit or undefined for no limit
      orderBy: random ? { createdAt: SortOrder.desc } : undefined, // Use SortOrder for orderings
    };

    // If random selection is required, use a raw query to randomize
    if (random) {
      const subCategories = await db.$queryRaw<SubCategory[]>`
      SELECT * FROM SubCategory
      ORDER BY RAND()
      LIMIT ${limit || 10}`;
      return subCategories;
    } else {
      // Otherwise, fetch subCategoeries based on the defined query options
      const subCategories = await db.subCategory.findMany(queryOptions);
      return subCategories;
    }
  } catch (error) {
    // Log and re-throw wny errors
    console.error("Error fetching subCategories:", error);
    throw error;
  }
};
