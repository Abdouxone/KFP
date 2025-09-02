"use client";

import SocialLogo from "social-logos";
import { Headset } from "lucide-react";

export default function Contact() {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-x-6 ">
          <Headset className="scale-[190%] stroke-slate-400" />
          <div className="flex flex-col">
            <span className="text-[#59645f] text-sm">
              Got questions? Call us 24/7!
            </span>
            <span className="text-xl">0654894151, 027561709</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <b>Contact Info</b>
        <span className="text-sm text-[#59645f]">
          Rue 1 Novembre, Khemis Miliana, Aïn Defla
        </span>
        <div className="flex flex-wap gap-2 mt-4">
          <SocialLogo
            icon="facebook"
            size={28}
            fill="#7C7C7C"
            className="cursor-pointer hover:fill-blue-400"
          />
          <SocialLogo
            icon="instagram"
            size={28}
            fill="#7C7C7C"
            className="cursor-pointer hover:fill-orange-600"
          />
          <SocialLogo
            icon="tiktok"
            size={28}
            fill="#7C7C7C"
            className="cursor-pointer hover:fill-red-900"
          />
          <SocialLogo
            icon="whatsapp"
            size={28}
            fill="#7C7C7C"
            className="cursor-pointer hover:fill-green-500"
          />
        </div>
      </div>
    </div>
  );
}
