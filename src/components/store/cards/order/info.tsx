import { PayementDetails } from "@/generated/prisma";

export default function OrderInfoCard({
  totalItemsCount,
  deliveredItemsCount,
  payementDetails,
}: {
  totalItemsCount: number;
  deliveredItemsCount: number;
  payementDetails: PayementDetails | null;
}) {
  return (
    <div>
      <div className="p-4 shadow-sm w-full">
        <div className="flex justify-between">
          <div className="space-y-4">
            <p className="text-main-secondary text-sm">Total Items</p>
            <p className="text-main-secondary text-sm">Delivered</p>
            <p className="text-main-secondary text-sm">Payment Status</p>
            <p className="text-main-secondary text-sm">Payment Method</p>
            <p className="text-main-secondary text-sm">Payment Refrence</p>
            <p className="text-main-secondary text-sm">Paid at</p>
          </div>
          <div className="text-right space-y-4">
            <p className="mt-0.5 text-neutral-500 text-sm">{totalItemsCount}</p>
            <p className="mt-0.5 text-neutral-500 text-sm">
              {deliveredItemsCount}
            </p>
            <p className="mt-0.5 text-neutral-500 text-sm">
              {payementDetails ? payementDetails.status : "Unpaid"}
            </p>
            <p className="mt-0.5 text-neutral-500 text-sm">
              {payementDetails ? payementDetails.payementMethod : "-"}
            </p>
            <p className="mt-0.5 text-neutral-500 text-sm">
              {payementDetails ? payementDetails.payementInentId : "-"}
            </p>
            <p className="mt-0.5 text-neutral-500 text-sm">
              {payementDetails &&
              (payementDetails.status === "COMPLETED" ||
                payementDetails?.status === "SUCCEEDED")
                ? payementDetails.updatedAt.toDateString()
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
