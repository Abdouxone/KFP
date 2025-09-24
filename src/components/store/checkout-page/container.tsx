"use client";
// types

import { CartWithCartItemsType, userShippingAddressType } from "@/lib/types";

// react
import { FC, useState } from "react";
import UserShippingAddresses from "../shared/shipping-addresses/shipping-addresses";
import { ShippingAddress, Willaya } from "@/generated/prisma";
import CheckoutProductCard from "../cards/checkout-product";
import PlaceOrderCard from "../cards/place-order";

interface Props {
  cart: CartWithCartItemsType;
  willayas: Willaya[];
  addresses: userShippingAddressType[];
}

const CheckoutContainer: FC<Props> = ({ cart, willayas, addresses }) => {
  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);
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
            {cart.cartItems.map((product) => (
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
        total={cart.total}
      />
    </div>
  );
};

export default CheckoutContainer;
