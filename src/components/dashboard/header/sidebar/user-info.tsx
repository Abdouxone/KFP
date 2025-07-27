import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
import { Avatar } from "@radix-ui/react-avatar";
import React from "react";

export default function UserInfo({ user }: { user: User | null }) {
  const role = user?.privateMetadata.role?.toString();
  return (
    <div>
      <div>
        <Button
          className="w-full mt-5 mb-4 flex items-center justify-between py-10"
          variant="ghost"
        >
          <div className="flex items-center text-left gap-2 ">
            <Avatar className="w-16 h-16">
              {/* image of profile */}
              <AvatarImage
                className="rounded-full"
                src={user?.imageUrl}
                alt={`${user?.firstName!} ${user?.lastName!}`}
              />
              {/* if avatar didnt show up */}
              <AvatarFallback className="bg-primary text-white">
                {user?.firstName} {user?.lastName}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-y-1">
              {user?.firstName} {user?.lastName}
              <span className="text-muted-foreground">
                {user?.emailAddresses[0]?.emailAddress}
              </span>
              <span className="w-fit">
                <Badge variant="secondary" className="capitalize">
                  {role?.toLocaleLowerCase()} Dashboard
                </Badge>
              </span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
