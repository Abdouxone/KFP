"use client";
import { ShippingAddress, Willaya } from "@/generated/prisma";
import { userShippingAddressType } from "@/lib/types";
import { FC, useState } from "react";
import UserShippingAddresses from "../../shared/shipping-addresses/shipping-addresses";

interface Props {
  addresses: userShippingAddressType[];
  willayas: Willaya[];
}

const AddressContainer: FC<Props> = ({ addresses, willayas }) => {
  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);
  return (
    <div className="w-full ">
      <UserShippingAddresses
        addresses={addresses}
        willayas={willayas}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
    </div>
  );
};

export default AddressContainer;
