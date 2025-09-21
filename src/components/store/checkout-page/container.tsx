"use client";
// types

import {
  CartWithCartItemsType,
  userShippingAddressType,
  WillayaWithCommunesType,
} from "@/lib/types";

// react
import { FC, useState } from "react";
import UserShippingAddresses from "../shared/shipping-addresses/shipping-addresses";
import { Commune, ShippingAddress, Willaya } from "@/generated/prisma";

interface Props {
  cart: CartWithCartItemsType;
  willayas: WillayaWithCommunesType[];
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
              <div>{product.name}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart side */}
      {/* PlaceOrderCard */}
    </div>
  );
};

export default CheckoutContainer;
