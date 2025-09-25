"use client";
// cart

import { useCartStore } from "@/cart-store/useCartStore";
import useFromStore from "@/hooks/useFromStore";
import CartHeader from "./cart-header";
import CartProduct from "../cards/cart-product";
import CartSummary from "./summary";

// Types
import { CartProductType } from "@/lib/types";

// react
import { useEffect, useState } from "react";

// privacy
import { SecurityPrivacyCard } from "../product-page/returns-security-privacy-card";
import EmptyCart from "./empty-cart";
import { updateCartWithLatest } from "@/queries/user";

export default function CartContainer() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartLoaded, setCartLoaded] = useState<boolean>(false);
  const cartItems = useFromStore(useCartStore, (state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const [selectedItems, setSelectedItems] = useState<CartProductType[]>([]);

  useEffect(() => {
    if (cartItems !== undefined) {
      setCartLoaded(true); // Flag indicating cartItems has finished loading
    }
  }, [cartItems]);

  useEffect(() => {
    const loadAndSyncCart = async () => {
      if (cartItems && cartItems.length > 0) {
        try {
          const updatedCart = await updateCartWithLatest(cartItems);
          console.log("updatedCart ==== > ", updatedCart);
          setCart(updatedCart);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Failed to load and sync cart:", error);
        }
      }
    };

    loadAndSyncCart();
  }, [isCartLoaded]);
  return (
    <div>
      {cartItems && cartItems.length > 0 ? (
        <>
          {loading ? (
            <div>loading</div>
          ) : (
            <div className="bg-[#f5f5f5] min-h-[calc(100vh-65px)]">
              <div className="max-w-[1200px] mx-auto py-6 flex">
                <div className="min-w-0 flex-1">
                  {/* Cart header */}
                  <CartHeader
                    cartItems={cartItems}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                  <div className="h-auto overflow-x-hidden overflow-auto mt-2">
                    {/* Cart Items */}
                    {cartItems.map((product) => (
                      <CartProduct
                        key={product.variantId}
                        product={product}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                      />
                    ))}
                  </div>
                </div>
                {/* Cart Side */}
                <div className=" top-full ml-5 w-[380px] max-h-max">
                  {/* Cart Summary */}
                  <CartSummary cartItems={cartItems} />
                  <div className="mt-2 p-4 bg-white px-6 ">
                    <SecurityPrivacyCard />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}
