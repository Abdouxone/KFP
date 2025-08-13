import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SellerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.error("No user ID found — user not authenticated.");
      redirect("/");
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.privateMetadata?.role !== "SELLER") {
      console.error(`User ${userId} is not a seller.`);
      redirect("/");
    }

    return <div>{children}</div>;
  } catch (err) {
    console.error("Error loading SellerDashboardLayout:", err);
    throw err; // let Next.js actually display something in dev
  }
}
