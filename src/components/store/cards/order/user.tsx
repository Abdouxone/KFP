import { userShippingAddressType } from "@/lib/types";
import Image from "next/image";

export default function OrderUserDetailsCard({
  details,
}: {
  details: userShippingAddressType;
}) {
  const { user, userId, firstName, lastName, address1, willaya, phone } =
    details;
  const { picture, email } = user;
  return (
    <div>
      <section className="p-2 shadow-sm w-full">
        <div className="w-fit mx-auto">
          <Image
            src={picture}
            alt="profile pic"
            width={100}
            height={100}
            className="rounded-full w-28 h-28 object-cover"
          />
        </div>
        <div className="text-main-primary mt-2 space-y-2">
          <h2 className="text-center font-bold text-2xl tracking-wide capitalize">
            {firstName} {lastName}
          </h2>
          <h6 className="text-center py-2 border-t border-neutral-400 border-dashed">
            {email}
          </h6>
          <h6 className="text-center">+213 ({phone})</h6>
          <p className="text-2xl  py-2 border-t border-neutral-400 border-dashed font-medium">
            {address1}, {willaya?.name}
          </p>
        </div>
      </section>
    </div>
  );
}
