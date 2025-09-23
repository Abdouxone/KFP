// Prisma
import { Willaya } from "@/generated/prisma";

// Types
import { userShippingAddressType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// React
import { FC, useState } from "react";
import Modal from "../shared/modal";
import AddressDetails from "../shared/shipping-addresses/address-details";

interface Props {
  address: userShippingAddressType;
  isSelected: boolean;
  onSelect: () => void;
  willayas: Willaya[];
}

const ShippingAddressCard: FC<Props> = ({
  address,
  willayas,
  isSelected,
  onSelect,
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="w-full relative flex self-start group">
      {/* Check Box */}
      <label
        htmlFor={address.id}
        className="p-0 text-gray-900 text-sm leading-6 inline-flex items-center mr-3 cursor-pointer"
        onClick={onSelect}
      >
        <span className="leading-8 inline-flex p-0.5 cursor-pointer">
          <span
            className={cn(
              "leading-8 inline-block w-5 h-5 rounded-full bg-white border border-gray-300",
              {
                "bg-orange-background border-none flex items-center justify-center":
                  isSelected,
              }
            )}
          >
            {isSelected && <Check className="stroke-white w-3" />}
          </span>
        </span>
        <input type="checkbox" hidden id={address.id} />
      </label>

      {/* Address */}
      <div className="w-full border-t pt-2">
        {/* Full Name - phone Number */}
        <div className="flex max-w-[328px] overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="mr-4 text-sm text-black font-semibold capitalize">
            {address.firstName} {address.lastName}
          </span>
          <span>{address.phone}</span>
        </div>
        {/* Address1 */}
        <div className="text-sm max-w-[90%] text-gray-600 leading-4 overflow-hidden text-ellipsis whitespace-nowrap">
          {address.address1}
        </div>
        {/* Willaya */}
        <div className="text-sm max-w-[90%] text-gray-600 leading-5 overflow-hidden text-ellipsis whitespace-nowrap">
          {address.willaya.name}
        </div>
        {/* Save as default - Edit */}
        <div className="absolute right-0 top-1/2 flex items-center gap-x-3">
          <div className="cursor-pointer " onClick={() => setShow(true)}>
            <span className="text-xs text-[#27f]">Edit</span>
          </div>
          {isSelected && !address.default && (
            <div className="cursor-pointer">
              <span className="text-xs text-[#27f]">Save as default</span>
            </div>
          )}
        </div>
        {show && (
          <Modal title="Edit Shipping Address" show={show} setShow={setShow}>
            <AddressDetails
              data={address}
              willayas={willayas}
              setShow={setShow}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ShippingAddressCard;
