// next js
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Db
import { db } from "@/lib/db";
import CheckoutContainer from "@/components/store/checkout-page/container";
import { getUserShippingAddresses } from "@/queries/user";

export default async function CheckoutPage() {
  const user = await currentUser();
  if (!user) redirect("/cart");

  // Get user Cart
  const cart = await db.cart.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      cartItems: true,
    },
  });

  if (!cart) redirect("/cart");

  // Get user Shipping Addresses
  const addresses = await getUserShippingAddresses();
  // Get list of willays

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="max-w-container mx-auto py-5 px-2">
        <CheckoutContainer cart={cart} countries={[]} addresses={addresses} />
      </div>
    </div>
  );
}
