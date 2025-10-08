// React Next.js
import { formatPrice } from "@/components/shared/format-price";
import { CartProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FC, useEffect } from "react";

interface SimplifiedSize {
  id: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
}

interface Props {
  sizeId?: string | undefined;
  sizes: SimplifiedSize[];
  isCard?: boolean;
  handleChange: (property: keyof CartProductType, value: any) => void;
}

const ProductPrice: FC<Props> = ({ sizeId, sizes, isCard, handleChange }) => {
  // Check if the sizes array is either undefined or empty
  if (!sizes || sizes.length === 0) {
    // If no sizes are available, simply return from the function, performing
    return;
  }

  // Scenario 1: No sizeId passed, calculate range of prices and total quantity
  if (!sizeId) {
    // Calculate discounted prices for all sizes
    const discountedPrices = sizes.map(
      (size) => size.price * (1 - (size.discount || 0) / 100)
    );

    // calculate totalquantity
    const totalQuantity = sizes.reduce(
      (total, size) => total + size.quantity,
      0
    );

    // Calculate the minimum and maximum prices
    const minPrice = Math.min(...discountedPrices); // toFixed(2) to round to 2 decimal places
    const maxPrice = Math.max(...discountedPrices); // toFixed(2) to round to 2 decimal places

    // If all prices are the same, return a signle price; otherwise, return a range of prices
    const priceDisplay =
      minPrice === maxPrice
        ? `${formatPrice(minPrice)}`
        : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)} `;

    // If a discount exist when minPrice = maxPrice
    let discount = 0;
    if (minPrice === maxPrice) {
      let check_discount = sizes.find((s) => s.discount > 0);
      if (check_discount) {
        discount = check_discount.discount;
      }
    }

    return (
      <div>
        <div className="text-orange-primary inline-block font-bold leading-none mr-2.5 ">
          <span
            className={cn("inline-block text-4xl text-nowrap", {
              "text-lg": isCard,
            })}
          >
            {priceDisplay}
          </span>
        </div>
        {!sizeId && !isCard && (
          <div className="text-orange-background text-xs leading-4 mt-1">
            <span>Note: Select a size to see the exact price.</span>
          </div>
        )}
        {!sizeId && !isCard && totalQuantity > 0 && (
          <p className="mt-2 text-xs text-green-600">In Stock</p>
        )}
      </div>
    );
  }

  // Scenario 2: SizeId passed, find the specific size and return its details
  const selectedSize = sizes.find((size) => size.id === sizeId);

  if (!selectedSize) {
    return <div></div>;
  }

  //Calculate the price after the discount

  const discountedPrice =
    selectedSize.price * (1 - (selectedSize.discount || 0) / 100);

  // const formattedPrice = formatPrice(selectedSize.price);
  // const discountedFormattedPrice = formatPrice(discountedPrice);

  // Update product to be added to cart with price and stock quantity
  useEffect(() => {
    handleChange("price", discountedPrice);
    handleChange("stock", selectedSize.quantity);
  }, [sizeId]);

  return (
    <div>
      <div className="text-orange-primary inline-block font-bold leading-none mr-2.5 ">
        <span className="inline-block text-4xl">
          {formatPrice(discountedPrice)}
          {/* toFixed(2) to round to 2 decimal places */}
        </span>
      </div>
      {selectedSize.price !== discountedPrice && (
        <span className="text-[#999] inline-block text-xl font-normal leading-6 mr-2 line-through">
          {formatPrice(selectedSize.price)}
          {/* toFixed(2) to round to 2 decimal places */}
        </span>
      )}
      {selectedSize.discount > 0 && (
        <span className="inline-block text-orange-seconadry text-xl leading-6 ">
          {selectedSize.discount}% off
        </span>
      )}
      {selectedSize.quantity > 0 && (
        <p className="mt-2 text-xs text-green-600">In Stock</p>
      )}
      {selectedSize.quantity <= 0 && (
        <p className="mt-2 text-xs text-red-600">Out of Stock</p>
      )}
    </div>
  );
};

export default ProductPrice;
