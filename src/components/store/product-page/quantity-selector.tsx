//Types
import { useCartStore } from "@/cart-store/useCartStore";
import { Size } from "@/generated/prisma";
import useFromStore from "@/hooks/useFromStore";
import { CartProductType } from "@/lib/types";
import { Dice1, Minus, Plus } from "lucide-react";
import { FC, useEffect, useMemo } from "react";

interface QuantitySelectorProps {
  productId: string;
  variantId: string;
  sizeId: string | undefined;
  quantity: number;
  stock: number;
  handleChange: (property: keyof CartProductType, value: any) => void;
  sizes: Size[];
}

const QuantitySelector: FC<QuantitySelectorProps> = ({
  handleChange,
  productId,
  variantId,
  sizeId,
  quantity,
  stock,
}) => {
  //If no sizeId is provided, return null to prevent rendering the component
  if (!sizeId) {
    return null;
  }

  // Get cart product if it exist in cart, the get added quantity
  const cart = useFromStore(useCartStore, (state) => state.cart);

  // UseEffect hook to handle changes when sizeId updates
  useEffect(() => {
    handleChange("quantity", 1);
  }, [sizeId]);

  const maxQty = useMemo(() => {
    const search_product = cart?.find(
      (p) =>
        p.productId === productId &&
        p.variantId === variantId &&
        p.sizeId === sizeId
    );
    return search_product ? 10000 - search_product.quantity : 10000;
  }, [cart, productId, variantId, sizeId, stock]);

  // Function to handle incresing the quantity of the product
  const handleIncrease = () => {
    if (quantity < maxQty) {
      handleChange("quantity", quantity + 1);
    }
  };

  // Function to handle decrease the quantity of the product
  const handleDecrease = () => {
    if (quantity > 1) {
      handleChange("quantity", quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);

    if (isNaN(value)) value = 1;
    if (value < 1) value = 1;
    if (value > maxQty) value = maxQty;

    handleChange("quantity", value);
  };

  return (
    <>
      {stock > 0 && (
        <div className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg">
          <div className="w-full flex justify-between items-center gap-x-5">
            <div className="grow">
              <span className="block text-xs text-gray-500">
                Select quantity
              </span>
              <span className="block text-xs text-gray-500">
                {maxQty !== 10000 &&
                  `(You already have ${
                    10000 - maxQty
                  } pieces of this product in cart)`}
              </span>
              <input
                type="number"
                className="w-full p-0 bg-transparent border-0 focus:outline-0 text-gray-800 no-arrows"
                min={1}
                value={maxQty <= 0 ? 0 : quantity}
                max={maxQty}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end items-center gap-x-1.5">
              <button
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                onClick={handleDecrease}
                disabled={quantity === 1}
              >
                <Minus className="w-3" />
              </button>
              <button
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                onClick={handleIncrease}
                disabled={quantity === maxQty}
              >
                <Plus className="w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuantitySelector;
