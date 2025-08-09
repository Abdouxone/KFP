// React, Nextjs
import { FC } from "react";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Custom ui components
import Logo from "@/components/shared/Logo";
import UserInfo from "./user-info";
import SidebarNavAdmin from "./nav-admin";
import SidebarNavSeller from "./nav-seller";

// Menu Links
import {
  adminDashboardSidebarOptions,
  SellerDashboardSidebarOptions,
} from "@/constants/data";

// prisma models
import { Store } from "@/generated/prisma";

interface SidebarProps {
  isAdmin?: boolean;
  stores?: Store[];
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin }) => {
  const user = await currentUser();

  return (
    <div className="w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
      <Logo width="100%" height="220px" />
      {/* margin betwen logo and card */}
      <span className="mt-4" />
      {user && <UserInfo user={user} />}
      {isAdmin ? (
        <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />
      ) : (
        <SidebarNavSeller menuLinks={SellerDashboardSidebarOptions} />
      )}
    </div>
  );
};

export default Sidebar;
