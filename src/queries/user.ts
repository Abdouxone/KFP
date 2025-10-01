"use server";
import { CartItem, ShippingAddress } from "@/generated/prisma";
// Db
import { db } from "@/lib/db";
//Types
import { CartProductType, CartWithCartItemsType } from "@/lib/types";

// Next js
import { currentUser } from "@clerk/nextjs/server";
import { use } from "react";
import { fa } from "zod/v4/locales";

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

// Function getWillayaWithCommunes

export const getWillayaWithCommunes = async () => {
  try {
    const willayas = await db.willaya.findMany({
      // include: {
      //   communes: true,
      // },
    });
    return willayas;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getAllCommuneForWillaya

// export const getAllCommuneForWillaya = async (willayaId: string) => {
//   // Retrive all Communes from database
//   const communes = await db.commune.findMany({
//     where: {
//       willayaId: willayaId,
//     },
//     // orderBy: {
//     //   updatedAt: "desc",
//     // },
//   });
//   return communes;
// };

// Function: upsertShippingAddress
// Description: push shipping address for user to the db
// Permission Level: User who created the address
// Parameters: ShippingAddress
// Returns: none

export const upsertShippingAddress = async (address: ShippingAddress) => {
  try {
    // Get current User
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Ensure address data is provided
    if (!address) throw new Error("Please provide address data.");

    // Handle making the rest of addresses default flase when we are adding a new default address
    if (address.default) {
      const addressDb = await db.shippingAddress.findUnique({
        where: {
          id: address.id,
        },
      });
      if (addressDb) {
        try {
          await db.shippingAddress.updateMany({
            where: {
              userId: user.id,
              default: true,
            },
            data: {
              default: false,
            },
          });
        } catch (error) {
          console.error("Error resetting default shupping addresses:", error);
          throw new Error("Could not reset default shipping addresses");
        }
      }
    }

    // Upsert shipping address into the database
    const upsertedAddress = await db.shippingAddress.upsert({
      where: {
        id: address.id,
      },
      update: {
        firstName: address.firstName,
        lastName: address.lastName,
        address1: address.address1,
        phone: address.phone,
        willayaId: address.willayaId,
        default: address.default,
        userId: user.id,
      },
      create: {
        id: address.id,
        firstName: address.firstName,
        lastName: address.lastName,
        address1: address.address1,
        phone: address.phone,
        willayaId: address.willayaId,
        default: address.default,
        userId: user.id,
      },
    });
    return upsertedAddress;
  } catch (error) {
    // Log and re-throw any errors
    console.error("Error upserting shipping address:", error);
    throw error;
  }
};

// Function: placeOrder
// Description: place order for user
// Permission Level: User who created the order
// Parameters: Order
// Returns: none

export const placeOrder = async (
  shippingAddress: ShippingAddress,
  cartId: string
): Promise<{ orderId: string }> => {
  // Ensure the user is authenticated
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated.");

  const userId = user.id;

  // Fetch user's cart with all items
  const cart = await db.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      cartItems: true,
    },
  });

  if (!cart) throw new Error("Cart not found");

  const cartItems = cart.cartItems;

  // Fetch product, variant, and size data from the database for validation
  const validatedCartItems = await Promise.all(
    cartItems.map(async (cartProduct) => {
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

  // Define the type for grouped items by store
  type GroupedItems = { [storeId: string]: typeof validatedCartItems };

  // Group validated items by store
  const groupedItems = validatedCartItems.reduce<GroupedItems>((acc, item) => {
    if (!acc[item.storeId]) acc[item.storeId] = [];
    acc[item.storeId].push(item);
    return acc;
  }, {} as GroupedItems);

  // Create the order
  const order = await db.order.create({
    data: {
      total: cart.total,
      userId: userId,
      shippingAddressId: shippingAddress.id,
      orderStatus: "Pending",
      payementStatus: "Pending",
    },
  });

  // Iterate over each store's items and create OrderGroup and OrderItems
  let orderTotalPrice = 0;
  // let orderShippingFee = 0;

  for (const [storeId, items] of Object.entries(groupedItems)) {
    // Calculate store-specific totals
    const groupedTotalPrice = items.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    const total = groupedTotalPrice;

    // Create an OrderGroup for this store
    const orderGroup = await db.orderGroup.create({
      data: {
        orderId: order.id,
        storeId: storeId,
        status: "Pending",
        total: total,
        shippingService: "International Delivery",
      },
    });

    // Update order totals
    orderTotalPrice += total;

    // Create OrderItems for this OrderGroup
    for (const item of items) {
      await db.orderItem.create({
        data: {
          orderGroupId: orderGroup.id,
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          productSlug: item.productSlug,
          variantSlug: item.variantSlug,
          sku: item.sku,
          name: item.name,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
        },
      });
    }
  }

  // Update the main order with the final totals
  await db.order.update({
    where: {
      id: order.id,
    },
    data: {
      total: orderTotalPrice,
    },
  });

  return {
    orderId: order.id,
  };
};

// Function: emptyUserCart
// Description: empty user cart
// Permission Level: User who created the cart
// Parameters: none
// Returns: none
export const emptyUserCart = async () => {
  try {
    // Ensure the user is authenticated
    const user = await currentUser();
    if (!user) throw new Error("Unauthenticated.");

    const userId = user.id;
    const res = await db.cart.delete({
      where: {
        userId,
      },
    });
    if (res) return res;
  } catch (error) {
    throw error;
  }
};

/*
 * Function: updateCartWithLatest
 * Description: Keeps the cart updated with latest info (price,qty...).
 * Permission Level: Public
 * Parameters:
 *   - cartProducts: An array of product objects from the frontend cart.
 * Returns:
 *   - An object containing the updated cart with recalculated total price and validated product data.
 */

export const updateCartWithLatest = async (
  cartProduct: CartProductType[]
): Promise<CartProductType[]> => {
  // Fetch product, variant, and size data from the database for validation
  const validatedCartItems = await Promise.all(
    cartProduct.map(async (cartProduct) => {
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
        // return cartProduct;
        throw new Error(
          `Invalid product, variant, or size combination for productId ${productId}, variantId ${variantId}, and sizeId ${sizeId}.`
        );
      }

      const variant = product.variants[0];
      const size = variant.sizes[0];
      const price = size.discount
        ? size.price - size.price * (size.discount / 100)
        : size.price;

      const validated_qty = Math.min(quantity, 10001);

      const validatedPrice = price * validated_qty;
      return {
        productId,
        variantId,
        productSlug: product.slug,
        variantSlug: variant.slug,
        sizeId,
        sku: variant.sku,
        name: product.name,
        variantName: variant.variantName,
        image: variant.images[0].url,
        variantImage: variant.variantImage,
        stock: size.quantity,
        size: size.size,
        quantity: validated_qty,
        price,
      };
    })
  );

  return validatedCartItems;
};

/*
 * Function: updateCheckoutProductsWithLatest
 * Description: Keeps the checkout products updated with latest info (price,qty...).
 * Permission Level: Public
 * Parameters:
 *   - cartProducts: An array of product objects from the frontend cart.
 * Returns:
 *   - An object containing the updated cart with recalculated total price and validated product data.
 */

export const updateCheckoutProductsWithLatest = async (
  cartProduct: CartItem[]
): Promise<CartWithCartItemsType> => {
  // Fetch product, variant, and size data from the database for validation
  const validatedCartItems = await Promise.all(
    cartProduct.map(async (cartProduct) => {
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
        // return cartProduct;
        throw new Error(
          `Invalid product, variant, or size combination for productId ${productId}, variantId ${variantId}, and sizeId ${sizeId}.`
        );
      }

      const variant = product.variants[0];
      const size = variant.sizes[0];

      const price = size.discount
        ? size.price - size.price * (size.discount / 100)
        : size.price;

      const validated_qty = Math.min(quantity, 10001);

      const totalPrice = price * validated_qty;

      try {
        const newCartItem = await db.cartItem.update({
          where: {
            id: cartProduct.id,
          },
          data: {
            name: `${product.name} · ${variant.variantName}`,
            image: variant.images[0].url,
            price,
            quantity: validated_qty,
            totalPrice,
          },
        });
        return newCartItem;
      } catch (error) {
        return cartProduct;
      }
    })
  );

  // Recalculate the cart's total price
  const total = validatedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const cart = await db.cart.update({
    where: {
      id: cartProduct[0].cartId,
    },
    data: {
      total,
    },
    include: {
      cartItems: true,
    },
  });

  if (!cart) throw new Error("Something Went Wrong!");
  return cart;
};
