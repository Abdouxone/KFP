"use client";
import { formatPrice } from "@/components/shared/format-price";
import OrderStatusTag from "@/components/shared/order-status";
import PaymentStatusTag from "@/components/shared/payement-status";
import { OrderStatus, PaymentStatus, UserOrderType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "../../shared/pagination";
import { getUserOrders } from "@/queries/profile";

export default function OrdersTable({
  orders,
  totalPages,
}: {
  orders: UserOrderType[];
  totalPages: number;
}) {
  const [data, setData] = useState<UserOrderType[]>(orders);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalDataPages, setTotalDataPages] = useState<number>(totalPages);

  useEffect(() => {
    const getData = async () => {
      const res = await getUserOrders("", "", "", page);
      if (res) {
        setData(res.orders);
        setTotalDataPages(res.totalPages);
      }
    };
    getData();
  }, [page]);
  return (
    <div className="space-y-4">
      {/* Header */}
      {/* Table */}
      <div className="overflow-hidden ">
        <div className="bg-white p-6">
          {/* Scrollable Table Container */}
          <div className="max-h-[700px] overflow-auto scrollbar border rounded-md">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="cursor-pointer text-sm border-y p-4">Order</th>
                  <th className="cursor-pointer text-sm border-y p-4">
                    Product
                  </th>
                  <th className="cursor-pointer text-sm border-y p-4">Item</th>
                  <th className="cursor-pointer text-sm border-y p-4">
                    Payment
                  </th>
                  <th className="cursor-pointer text-sm border-y p-4">
                    Delivery
                  </th>
                  <th className="cursor-pointer text-sm border-y p-4">Total</th>
                  <th className="cursor-pointer text-sm border-y p-4"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((order) => {
                  const totalItemsCount = order.groups.reduce(
                    (total, group) => total + group._count.items,
                    0
                  );
                  const images = Array.from(
                    order.groups.flatMap((g) => g.items.map((p) => p.image))
                  );
                  return (
                    <tr key={order.id} className="border-b ">
                      <td className="p-4 ">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col ">
                            <p className="block antialiased font-sans text-sm leading-normal font-normal">
                              #{order.id}
                            </p>
                            <p className="block antialiased font-sans text-sm leading-normal font-normal">
                              Placed on: {order.createdAt.toDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex">
                          {images.slice(0, 5).map((img, i) => (
                            <Image
                              src={img}
                              alt=""
                              width={50}
                              key={i}
                              height={50}
                              className="w-7 h-7 object-cover rounded-full shadow-sm"
                              style={{ transform: `translateX(-${i * 5}px)` }}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-4">{totalItemsCount} items</td>
                      <td className="p-4 text-center">
                        <PaymentStatusTag
                          status={order.payementStatus as PaymentStatus}
                          isTable
                        />
                      </td>
                      <td className="p-4 ">
                        <OrderStatusTag
                          status={order.orderStatus as OrderStatus}
                        />
                      </td>
                      <td className="p-4">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <Link href={`/order/${order.id}`}>
                          <span className="text-xs text-blue-primary cursor-pointer hover:underline">
                            View
                          </span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}
