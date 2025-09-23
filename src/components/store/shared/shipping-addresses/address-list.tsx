// Prisma
import { ShippingAddress, Willaya } from "@/generated/prisma";
// Types
import { userShippingAddressType } from "@/lib/types";
// React
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import ShippingAddressCard from "../../cards/address-card";

interface Props {
  addresses: userShippingAddressType[];
  willayas: Willaya[];
  selectedAddress: ShippingAddress | null;
  setSelectedAddress: Dispatch<SetStateAction<ShippingAddress | null>>;
}

const AddressList: FC<Props> = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
  willayas,
}) => {
  useEffect(() => {
    // Find the default address if it exists and set it as seleted
    const defaultAddress = addresses.find((address) => address.default);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [addresses]);

  const handleAddressSelect = (address: ShippingAddress) => {
    setSelectedAddress(address);
  };
  return (
    <div className="space-y-5 max-h-80 overflow-y-auto">
      {addresses.map((address) => (
        <ShippingAddressCard
          key={address.id}
          address={address}
          willayas={willayas}
          isSelected={selectedAddress?.id === address.id}
          onSelect={() => handleAddressSelect(address)}
        />
      ))}
    </div>
  );
};
export default AddressList;
