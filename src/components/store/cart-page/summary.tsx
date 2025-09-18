// Types
import { CartProductType } from "@/lib/types";
import { FC } from "react";
import { Button } from "../ui/button";

interface Props {
  cartItems: CartProductType[];
}

const CartSummary: FC<Props> = ({ cartItems }) => {
  // Calculate subtotal from cartItems
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div className="realtive py-4 px-6 bg-white">
      <h1 className="text-gray-900 text-3xl font-bold mb-4">Summary</h1>
      <div className="mt-4 font-bold flex items-center text-[#222] text-sm">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Total
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-2xl text-black">
            <div className="text-black text-xl inline-block break-all">
              {subtotal} Da
            </div>
          </span>
        </h3>
      </div>
      <div className="my-2 5">
        <Button>
          <span>Checkout ({cartItems.length})</span>
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
