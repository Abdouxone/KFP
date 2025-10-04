// queries
import OrderInfoCard from "@/components/store/cards/order/info";
import OrderTotalDetailsCard from "@/components/store/cards/order/total";
import OrderUserDetailsCard from "@/components/store/cards/order/user";
import Header from "@/components/store/layout/header/header";
import OrderGroupsContainer from "@/components/store/order-page/groups-container";
import OrderHeader from "@/components/store/order-page/header";
import { getOrder } from "@/queries/order";
import { redirect } from "next/navigation";

export default async function OrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await getOrder(params.orderId);
  if (!order) return redirect("/");

  // Get the total count of items across all groups
  const totalItemsCount = order?.groups.reduce(
    (total, group) => total + group._count.items,
    0
  );

  // Calculate the total number of delivered items
  const deliveredItemsCount = order?.groups.reduce((total, group) => {
    if (group.status === "Delivered") {
      return total + group.items.length;
    }
    return total;
  }, 0);
  return (
    <div>
      <Header />
      <div className="p2">
        <OrderHeader order={order} />
        <div
          className="w-full grid"
          style={{
            gridTemplateColumns:
              order.payementStatus === "Pending" ||
              order.payementStatus === "Failed"
                ? "400px 3fr 1fr"
                : "1fr 4fr",
          }}
        >
          {/* Col 1 => User, Order details */}
          <div className="h-[calc(100vh-137px)] overflow-auto flex flex-col gap-y-5 scrollbar">
            {/* User card */}
            <OrderUserDetailsCard details={order.shippingAddress} />
            {/* Order general info */}
            <OrderInfoCard
              totalItemsCount={totalItemsCount}
              deliveredItemsCount={deliveredItemsCount}
              payementDetails={order.payementDetails}
            />
            {order.payementStatus != "Pending" &&
              order.payementStatus != "Failed" && (
                <div>
                  {/* Order total details  */}
                  <OrderTotalDetailsCard details={{ total: order.total }} />
                </div>
              )}
          </div>
          {/* Col 2 => Order groups */}
          <div className="h-[calc(100vh-137px)] overflow-auto scrollbar">
            {/* Order group details */}
            <OrderGroupsContainer groups={order.groups} />
          </div>
          {/* Col 3 => Payement Gateways */}
          {(order.payementStatus === "Pending" ||
            order.payementStatus === "Failed") && (
            <div className="h-[calc(100vh-137px)] overflow-auto scrollbar border-l px-2 py-4 space-y-5">
              {/* Order total details */}
              <OrderTotalDetailsCard details={{ total: order.total }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
