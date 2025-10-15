import { currentUser } from "@clerk/nextjs/server";
import { Eye, WalletCards } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { OrderIcon } from "../icons";

export default async function ProfileOverview() {
  const user = await currentUser();
  if (!user) return;
  return (
    <div className="w-full bg-red-500">
      <div className="bg-white p-4 border shadow-sm">
        <div className="flex items-center">
          <Image
            src={user.imageUrl}
            alt={user.fullName!}
            width={200}
            height={200}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="flex ml-4 text-main-primary text-xl font-bold capitalize">
            {user.fullName?.toLowerCase()}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap py-4">
          {menu.map((item) => (
            <Link
              href={item.link}
              key={item.link}
              className="w-36 relative flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="text-3xl">
                <span>{item.icon}</span>
              </div>
              <div className="mt-2">{item.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const menu = [
  {
    title: "Viewed",
    icon: <Eye />,
    link: "/profile/history/1",
  },

  {
    title: "Shopping credit",
    icon: <WalletCards />,
    link: "/profile/credit",
  },
  {
    title: "Orders",
    icon: <OrderIcon />,
    link: "/profile/orders",
  },
];
