// Types
import { CartProductType } from "@/lib/types";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveUserCart } from "@/queries/user";
import { PulseLoader } from "react-spinners";

interface Props {
  cartItems: CartProductType[];
}

const CartSummary: FC<Props> = ({ cartItems }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // Calculate subtotal from cartItems
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleSaveCart = async () => {
    try {
      setLoading(true);
      const res = await saveUserCart(cartItems);
      if (res) router.push("/checkout");
      setLoading(false);
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  return (
    <div className="realtive py-4 px-6 bg-white">
      <h1 className="text-gray-900 text-3xl font-bold mb-4">Summary</h1>
      <div className="mt-4 font-bold flex items-center text-[#222] text-sm pb-2">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Total
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5  text-black">
            <div className="text-black text-lg inline-block break-all">
              {subtotal} Da
            </div>
          </span>
        </h3>
      </div>
      <div className="my-2 5">
        <Button onClick={() => handleSaveCart()}>
          {loading ? (
            <PulseLoader size={5} color="#fff" />
          ) : (
            <span>Checkout ({cartItems.length})</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
