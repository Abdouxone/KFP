"use server";
// Prisma Models
import { Store } from "@/generated/prisma";

// Database
import { db } from "@/lib/db";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Function: upsertStore
// Description : Upserts a store details into the database, ensuring uniqueness of name, url,  email, and phone.
// Access Level: Seller Only
// Parameters:
// - store: partial store object containing details of the store to be upserted.
// Returns: Updated or newly created store details.

export const upsertstore = async (store: Partial<Store>) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify Seller Permission
    if (user.privateMetadata.role !== "SELLER") {
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry!"
      );
    }

    // Ensure store data is provided
    if (!store) throw new Error("Please provide store data.");

    // Check if store with same name, email, url, or phone number already exists.
    const existingStore = await db.store.findFirst({
      where: {
        AND: [
          {
            OR: [
              { name: store.name },
              { email: store.email },
              { phone: store.phone },
              { url: store.url },
            ],
          },
          {
            NOT: {
              id: store.id,
            },
          },
        ],
      },
    });

    // If a store with same name, email, url, or phone number already exists, throw an error.
    if (existingStore) {
      let errorMessage = "";
      if (existingStore.name === store.name) {
        errorMessage += "A Store with the same name already exists.";
      } else if (existingStore.email === store.email) {
        errorMessage += "A Store with the same email already exists.";
      } else if (existingStore.phone === store.phone) {
        errorMessage += "A Store with the same phone number already exists.";
      } else if (existingStore.url === store.url) {
        errorMessage += "A Store with the same url already exists.";
      }

      throw new Error(errorMessage);
    }

    // Upsert Store Details into the database
    const storeDetails = await db.store.upsert({
      where: {
        id: store.id,
      },
      update: store,
      create: {
        ...store,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return storeDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/*
 * @name getStoreOrders
 * @description - Retrieves all orders for a specific store.
 *              - Returns order that include items, order details.
 * @access User
 * @param storeUrl - The url of the store whose order groups are being retrieved.
 * @returns {Array} - Array of order groups, including items.
 */

export const getStoreOrders = async (storeUrl: string) => {
  try {
    // Retrieve current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify the seller permission
    if (user.privateMetadata.role !== "SELLER") {
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry!"
      );
    }

    // Get store id using url
    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
      },
    });

    // Ensure store is found
    if (!store) throw new Error("Store not found.");

    // Verify ownerShip
    if (user.id !== store.userId) {
      throw new Error(
        "You dont't have permission to access this store's orders."
      );
    }

    // Retrieve order groups foe the specified store and user
    const orders = await db.orderGroup.findMany({
      where: {
        storeId: store.id,
      },
      include: {
        items: true,
        order: {
          select: {
            payementStatus: true,

            shippingAddress: {
              include: {
                willaya: true,
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
            payementDetails: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return orders;
  } catch (error) {
    throw error;
  }
};
