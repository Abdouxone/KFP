import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Fetches the current user and redirects based on their role
  const user = await currentUser();
  if (!user?.privateMetadata?.role || user?.privateMetadata.role === "USER") {
    redirect("/");
  }
  if (user?.privateMetadata.role === "ADMIN") {
    redirect("/dashboard/admin");
  }
}
