import { OrderGroupWithItemsType } from "@/lib/types";
import OrderGroupTable from "./group-table";

export default function OrderGroupsContainer({
  groups,
}: {
  groups: OrderGroupWithItemsType[];
}) {
  return (
    <div>
      <section className="p-2 relative">
        <div className="w-full space-y-4">
          {groups.map((group, index) => {
            return <OrderGroupTable key={group.id} group={group} />;
          })}
        </div>
      </section>
    </div>
  );
}
