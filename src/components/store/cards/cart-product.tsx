// Types
import { useCartStore } from "@/cart-store/useCartStore";
import { CartProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  MinusIcon,
  Plus,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// react
import { Dispatch, FC, SetStateAction, useState } from "react";

interface Props {
  product: CartProductType;
  selectedItems: CartProductType[];
  setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
}

const CartProduct: FC<Props> = ({
  product,
  selectedItems,
  setSelectedItems,
}) => {
  const {
    image,
    name,
    price,
    productId,
    productSlug,
    quantity,
    size,
    sizeId,
    stock,
    variantId,
    variantImage,
    variantName,
    variantSlug,
  } = product;

  // Generate unique id
  const unique_id = `${productId}-${variantId}-${sizeId}`;
  //   const [shippingInfo, setShippingInfo] = useState({});

  const selected = selectedItems.find(
    (p) => unique_id === `${p.productId}-${p.variantId}-${p.sizeId}`
  );

  const { updateProductQuantity, removeFromCart } = useCartStore(
    (state) => state
  );

  const handleSelectProduct = () => {
    setSelectedItems((prev) => {
      const exists = prev.some(
        (item) =>
          item.productId === product.productId &&
          item.variantId === product.variantId &&
          item.sizeId === product.sizeId
      );
      return exists
        ? prev.filter((item) => item !== product) // Remove if exists
        : [...prev, product]; // Add if no exists
    });
  };

  const updateProductQuantityHandler = (type: "add" | "remove") => {
    if (type === "add" && quantity < 10000) {
      // Increase the quantity by 1 but ensure it doesn't exceed stock
      updateProductQuantity(product, quantity + 1);
    } else if (type === "remove" && quantity > 1) {
      // Decrease the quantity by 1 but ensure it doesn't go below 1
      updateProductQuantity(product, quantity - 1);
    }
  };

  return (
    <div className="bg-white px-6 border-t border-t-[#ebebeb] select-none">
      <div className="py-4">
        <div className="relative flex self-start">
          {/* Image */}
          <div className="flex items-center">
            {stock > 0 && (
              <label
                htmlFor={unique_id}
                className="p-0 text-gray-900 text-sm leading-6 inline-flex items-center mr-2 cursor-pointer align-middle"
              >
                <span className="leading-8 inline-flex p-0.5 cursor-pointer ">
                  <span
                    className={cn(
                      "leading-8 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:border-orange-background",
                      {
                        "border-orange-background": selected,
                      }
                    )}
                  >
                    {selected && (
                      <span className="bg-orange-background  w-5 h-5 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 text-white mt-0.5" />
                      </span>
                    )}
                  </span>
                </span>
                <input
                  type="checkbox"
                  id={unique_id}
                  hidden
                  onChange={() => handleSelectProduct()}
                />
              </label>
            )}
            <Link
              href={`/product/${productSlug}/${variantSlug}?size=${sizeId}`}
            >
              <div className="m-0 mr-4 ml-2 w-28 h-28 bg-gray-200 relative rounded-lg">
                <Image
                  src={image}
                  alt={name}
                  height={200}
                  width={200}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </Link>
          </div>
          {/* Info */}
          <div className="w-0 min-w-0 flex-1 ">
            {/* Title - actions */}
            <div className="w-[calc(100%-48px)] flex items-start overflow-hidden whitespace-nowrap">
              <Link
                href={`/product/${productSlug}/${variantSlug}?size=${sizeId}`}
                className="inline-block overflow-hidden text-sm whitespace-nowrap overflow-ellipsis"
              >
                {name} · {variantName}
              </Link>
              <div className="absolute top-0 right-0">
                <span className="mr-2.5 cursor-pointer inline-block">
                  <Heart className="w-4 hover:stroke-orange-seconadry" />
                </span>
                <span
                  className="cursor-pointer inline-block"
                  onClick={() => removeFromCart(product)}
                >
                  <Trash className="w-4 hover:stroke-orange-seconadry" />
                </span>
              </div>
            </div>
            {/* Style - size */}
            <div className="my-1">
              <button className="text-main-primary relative h-[24px] bg-gray-100 whitespace-normal px-2.5 py-0 max-w-full text-xs leading-4 rounded-xl font-bold cursor-pointer  outline-0">
                <span className="flex items-center justify-between flex-wrap">
                  <div className="text-left inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-[95%]">
                    {size}
                  </div>
                  <span className="ml-0.5">
                    <ChevronRight className="w-3" />
                  </span>
                </span>
              </button>
            </div>
            {/* Price - Delivery */}
            <div className="flex items-center justify-between mt-2 relative">
              <div>
                <span className="inline-block break-all">
                  {price} Da x {quantity} = {price * quantity} Da
                </span>
              </div>
              {/* Quantity changer */}
              <div className="text-xs">
                <div className="text-gray-900 text-sm leading-6 list-none inline-flex items-center">
                  <div
                    className="w-6 h-6 text-xs bg-gray-100 hover:bg-gray-200 leading-6 grid place-items-center rounded-full cursor-pointer"
                    onClick={() => updateProductQuantityHandler("remove")}
                  >
                    <Minus className="w-3 stroke-[#555]" />
                  </div>
                  <input
                    type="text"
                    value={quantity}
                    max={10000}
                    min={1}
                    className="m-1 h-6 w-[40px] bg-transparent border-none leading-6 tracking-normal text-center outline-none text-gray-900 font-bold"
                  />
                  <div
                    className="w-6 h-6 text-xs bg-gray-100 hover:bg-gray-200 leading-6 grid place-items-center rounded-full cursor-pointer"
                    onClick={() => updateProductQuantityHandler("add")}
                  >
                    <Plus className="w-3 stroke-[#555]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
