import Logo from "@/components/shared/Logo";
import { currentUser } from "@clerk/nextjs/server";
import { FC } from "react";
import UserInfo from "./user-info";
import { adminDashboardSidebarOptions } from "@/constants/data";
import SidebarNavAdmin from "./nav-admin";
interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: FC<SidebarProps> = async (isAdmin) => {
  const user = await currentUser();

  return (
    <div className="w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
      <Logo width="100%" height="220px" />
      {/* margin betwen logo and card */}
      <span className="mt-4" />
      {user && <UserInfo user={user} />}
      {isAdmin && <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />}
    </div>
  );
};

export default Sidebar;
