"use client";
import { useCartStore } from "@/cart-store/useCartStore";
import CartProduct from "@/components/store/cards/cart-product";
import CartHeader from "@/components/store/cart-page/cart-header";
import CartSummary from "@/components/store/cart-page/summary";

// Components
import { SecurityPrivacyCard } from "@/components/store/product-page/returns-security-privacy-card";
import useFromStore from "@/hooks/useFromStore";

// Types
import { CartProductType } from "@/lib/types";

// react
import { useState } from "react";

export default function CartPage() {
  const cartItems = useFromStore(useCartStore, (state) => state.cart);

  const [selectedItems, setSelectedItems] = useState<CartProductType[]>([]);
  return (
    <div>
      {cartItems && cartItems.length > 0 ? (
        <div className="bg-[#f5f5f5]">
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
      ) : (
        <div>No products here</div>
      )}
    </div>
  );
}
