// types
import OrderStatusTag from "@/components/shared/order-status";
import PaymentStatusTag from "@/components/shared/payement-status";
import { Button } from "@/components/ui/button";
import { OrderFullType, OrderStatus, PaymentStatus } from "@/lib/types";
import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";

export default function OrderHeader({ order }: { order: OrderFullType }) {
  if (!order) return;
  return (
    <div>
      <div className="w-full  border-b flex items-center justify-between p-2">
        <div className="flex items-center gap-x-3">
          <div className="border-r pr-4">
            <button className="w-10 h-10 border rounded-full grid place-items-center">
              <ChevronLeft className="stroke-main-secondary" />
            </button>
          </div>
          <h1 className="text-main-secondary">Order Details</h1>
          <ChevronRight className="stroke-main-secondary w-4" />
          <h2>Order #{order.id}</h2>
          <OrderStatusTag status={order.orderStatus as OrderStatus} />
          <PaymentStatusTag status={order.payementStatus as PaymentStatus} />
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant="outline">
            <Download className="me-2 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="me-2 w-4" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}
