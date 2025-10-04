// Types
import OrderStatusTag from "@/components/shared/order-status";
import { OrderGroupWithItemsType, OrderStatus } from "@/lib/types";
import Image from "next/image";

export default function OrderGroupTable({
  group,
}: {
  group: OrderGroupWithItemsType;
}) {
  return (
    <div className="border border-gray-200 rounded-xl pt-6 max-w-xl lg:mx-auto lg:max-w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
        <div>
          <p className="feont-semibold text-base leading-7 text-black">
            Order Id:
            <span className="text-blue-primary font-medium ms-2">
              #{group.id}
            </span>
          </p>
          <div className="flex items-center gap-x-2 mt-4">
            <Image
              src={group.store.logo}
              alt={group.store.name}
              width={100}
              height={100}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-main-secondary font-medium">
              {group.store.name}
            </span>
            <div className="w-[1px] h-5 bg-border mx-2" />
          </div>
        </div>
        <OrderStatusTag status={group.status as OrderStatus} />
      </div>
      <div
        className="w-full px-3 min-[400px]:px-6 grid"
        style={{ gridTemplateColumns: "4fr 1fr" }}
      >
        {/* <div>
          {group.items.map((product, index) => (
            <div></div>
          ))}
        </div> */}
      </div>
      {/* Group info */}
      <div className="w-full border-t borfer-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center max-lg:border-b border-gray-200">
          <button className="flex outline-0 py-6 sm:pr-6 sm:border-r border-gray-200 whitespace-nowrap gap-2 items-center justify-center font-semibold group text-lg text-black bg-white transition-all duration-500 hover:text-blue-primary">
            <svg
              className="stroke-black transition-all duration-500 group-hover:stroke-blue-primary"
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M5.5 5.5L16.5 16.5M16.5 5.5L5.5 16.5"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            Cancel Order
          </button>
          <p className="font-medium text-lg text-gray-900 px-6 py-3 max-lg:text-center">
            Shipping Fees:
            <span className="text-gray-500 ms-1">according to the order</span>
          </p>
        </div>
        <p className="font-semibold text-xl text-black py-2 ">
          Total price:
          <span className="text-blue-primary ms-1">{group.total} Da</span>
        </p>
      </div>
    </div>
  );
}
