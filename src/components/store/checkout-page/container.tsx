"use client";
// types

import { CartWithCartItemsType, userShippingAddressType } from "@/lib/types";

// react
import { FC, useEffect, useState } from "react";
import UserShippingAddresses from "../shared/shipping-addresses/shipping-addresses";
import { ShippingAddress, Willaya } from "@/generated/prisma";
import CheckoutProductCard from "../cards/checkout-product";
import PlaceOrderCard from "../cards/place-order";
import { updateCheckoutProductsWithLatest } from "@/queries/user";
import { set } from "date-fns";

interface Props {
  cart: CartWithCartItemsType;
  willayas: Willaya[];
  addresses: userShippingAddressType[];
}

const CheckoutContainer: FC<Props> = ({ cart, willayas, addresses }) => {
  const [cartData, setCartData] = useState<CartWithCartItemsType>(cart);

  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);

  const { cartItems } = cart;

  useEffect(() => {
    const hydrateCheckoutCart = async () => {
      const updatedCart = await updateCheckoutProductsWithLatest(cartItems);
      setCartData(updatedCart);
    };

    if (cartItems.length > 0) {
      hydrateCheckoutCart();
    }
  }, []);
  return (
    <div className="flex">
      <div className="flex-1 my-3 ">
        {/* UserShippingAddresses */}
        <UserShippingAddresses
          addresses={addresses}
          willayas={willayas}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <div className="w-full py-4 px-4 bg-white my-3">
          <div className="relative">
            {cartData.cartItems.map((product) => (
              // CheckoutProductCard
              <CheckoutProductCard key={product.variantId} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Cart side */}
      {/* PlaceOrderCard */}
      <PlaceOrderCard
        cartId={cart.id}
        shippingAddress={selectedAddress}
        total={cartData.total}
      />
    </div>
  );
};

export default CheckoutContainer;
