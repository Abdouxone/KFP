// Types
import { Commune, ShippingAddress, Willaya } from "@/generated/prisma";
import { userShippingAddressType, WillayaWithCommunesType } from "@/lib/types";
import { Plus } from "lucide-react";

import { Dispatch, FC, SetStateAction, useState } from "react";
import Modal from "../modal";
import AddressDetails from "./address-details";

interface Props {
  willayas: WillayaWithCommunesType[];
  addresses: userShippingAddressType[];
  selectedAddress: ShippingAddress | null;

  setSelectedAddress: Dispatch<SetStateAction<ShippingAddress | null>>;
}

const UserShippingAddresses: FC<Props> = ({
  addresses,
  willayas,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [show, setShow] = useState<boolean>(true);
  return (
    <div className="w-full py-4 px-6 bg-white">
      <div className="relative flex flex-col text-sm ">
        <h1 className="text-lg mb-3 font-bold">Shipping Addresses</h1>
        {addresses && addresses.length > 0 && (
          /* Addresses List */
          <div></div>
        )}
        <div
          className="mt-4 ml-8 text-orange-background cursor-pointer"
          onClick={() => setShow(true)}
        >
          <Plus className="inline-block mr-1 w-3" />
          <span className="text-sm">Add New Address</span>
        </div>
        {/* Modal */}
        <Modal title="Add new Address" show={show} setShow={setShow}>
          {/* AddressDetail */}
          <AddressDetails willayas={willayas} />
        </Modal>
      </div>
    </div>
  );
};

export default UserShippingAddresses;
