import { formatPrice } from "@/components/shared/format-price";
import { PayementDetails } from "@/generated/prisma";

export default function OrderTotalDetailsCard({
  details,
}: {
  details: {
    total: number;
  };
}) {
  const { total } = details;
  return (
    <div>
      <div className="p-4 shadow-sm w-full">
        <div className="flex justify-between">
          <div className="space-y-4">
            <p className="text-main-secondary font-semibold text-lg">Total </p>
          </div>
          <div className="text-right space-y-4">
            <p className="text-white px-3 text-sm py-1.5 bg-blue-primary rounded-lg font-semibold">
              {formatPrice(total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
