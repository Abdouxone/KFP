import { ShippingAddress } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { Button } from "../ui/button";
import { SecurityPrivacyCard } from "../product-page/returns-security-privacy-card";
import toast from "react-hot-toast";
import { emptyUserCart, placeOrder } from "@/queries/user";
import { redirect, useRouter } from "next/navigation";
import { useCartStore } from "@/cart-store/useCartStore";

interface Props {
  total: number;
  shippingAddress: ShippingAddress | null;
  cartId: string;
}

const PlaceOrderCard: FC<Props> = ({ cartId, shippingAddress, total }) => {
  const emptyCart = useCartStore((state) => state.emptyCart);
  const { push } = useRouter();
  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error("Please select a shipping address first !");
    } else {
      const order = await placeOrder(shippingAddress, cartId);
      if (order) {
        toast.success("Order placed successfully.");
        await emptyUserCart();
        emptyCart();
        push(`/order/${order.orderId}`);
      }
    }
  };
  return (
    <div className="sticky top-4 mt-3 ml-5 w-[380px] max-h-max">
      <div className="relative py-4 px-6 bg-white">
        <h1 className="text-gray-900 text-2xl font-bold mb-4">Summary</h1>
        <Info title="Total" text={`${total} Da`} isBold noBorder />
        <div className="mt-2 p-2 bg-white">
          <Button
            onClick={() => {
              handlePlaceOrder();
            }}
          >
            <span>Place Order</span>
          </Button>
        </div>
      </div>

      <div className="mt-2 p-4 bg-white px-6">
        <SecurityPrivacyCard />
      </div>
    </div>
  );
};

export default PlaceOrderCard;

const Info = ({
  title,
  text,
  isBold,
  noBorder,
}: {
  title: string;
  text: string;
  isBold?: boolean;
  noBorder?: boolean;
}) => {
  return (
    <div
      className={cn(
        "mt-2 font-medium flex items-center text-[#222] text-sm pb-1 border-b",
        {
          "font-bold": isBold,
          "border-b-0": noBorder,
        }
      )}
    >
      <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
        {title}
      </h2>
      <h3 className="flex-1 w-0 min-w-0 text-right">
        <div className="px-0.5 text-black">
          <span className="text-black text-lg inline-block break-all">
            {text}
          </span>
        </div>
      </h3>
    </div>
  );
};
