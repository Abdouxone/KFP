"use server";
// Db
import { db } from "@/lib/db";
//Types
import { CartProductType } from "@/lib/types";

// Next js
import { currentUser } from "@clerk/nextjs/server";

/*
 * Function: saveUserCart
 * Description: Saves the user's cart by validating product data from the database and ensuring no frontend manipulation.
 * Permission Level: User who owns the cart
 * Parameters:
 *   - cartProducts: An array of product objects from the frontend cart.
 * Returns:
 *   - An object containing the updated cart with recalculated total price and validated product data.
 */

export const saveUserCart = async (
  cartProducts: CartProductType[]
): Promise<boolean> => {
  // Get the current USer
  const user = await currentUser();

  // Ensure user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  const userId = user.id;

  // Search for existing cart
  const userCart = await db.cart.findFirst({
    where: {
      userId,
    },
  });

  // Delete any existing user cart
  if (userCart) {
    await db.cart.delete({
      where: {
        userId,
      },
    });
  }

  // Fetch product, variant, and size data from the database for validation
  const validatedCartItems = await Promise.all(
    cartProducts.map(async (cartProduct) => {
      const { productId, variantId, sizeId, quantity } = cartProduct;

      // Fetch the product, variant, and size from the database
      const product = await db.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          store: true,
          variants: {
            where: {
              id: variantId,
            },
            include: {
              sizes: {
                where: {
                  id: sizeId,
                },
              },
              images: true,
            },
          },
        },
      });

      if (
        !product ||
        product.variants.length === 0 ||
        product.variants[0].sizes.length === 0
      ) {
        throw new Error(
          `Invalid product, variant, or size combination for productId ${productId}, variantId ${variantId}, and sizeId ${sizeId}.`
        );
      }

      const variant = product.variants[0];
      const size = variant.sizes[0];

      // Validate stock and price
      const validQuantity = Math.min(quantity, 10001);

      const price = size.discount
        ? size.price - size.price * (size.discount / 100)
        : size.price;

      // Calculate total price
      const totalPrice = validQuantity * price;
      return {
        productId,
        variantId,
        productSlug: product.slug,
        variantSlug: variant.slug,
        sizeId,
        storeId: product.storeId,
        sku: variant.sku,
        name: `${product.name} · ${variant.variantName}`,
        image: variant.images[0].url,
        size: size.size,
        quantity: validQuantity,
        price,
        totalPrice,
      };
    })
  );

  // Recalculate the cart's total price
  const total = validatedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Save the validation items to the cart in the data base
  const cart = await db.cart.create({
    data: {
      cartItems: {
        create: validatedCartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          sku: item.sku,
          productSlug: item.productSlug,
          variantSlug: item.variantSlug,
          name: item.name,
          image: item.image,
          size: item.size,
          storeId: item.storeId,
          totalPrice: item.totalPrice,
          price: item.price,
          quantity: item.quantity,
        })),
      },
      total,
      userId,
    },
  });

  if (cart) return true;

  return false;
};

// Function: getUserShippingAddresses
// Description: Retrieves all shipping addresses for a specific user.
// Permission Level: User who owns the addresses
// Parameters: None
// Returns: List of shipping addresses for the user.

export const getUserShippingAddresses = async () => {
  try {
    // Get current User
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Retrieve all shipping addresses for the specified user
    const shippingAddresses = await db.shippingAddress.findMany({
      where: {
        userId: user.id,
      },
      include: {
        willaya: true,
      },
    });

    return shippingAddresses;
  } catch (error) {
    // Log and re-throw any errors
    console.log(error);
    throw error;
  }
};
