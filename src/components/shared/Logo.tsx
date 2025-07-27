//React, Next.js

import { FC } from "react";
import LogoImg from "../../../public/assets/icons/LOGO-1.png"; // Adjust the path as necessary
import Image from "next/image";

interface LogoProps {
  width: string;
  height: string;
}

const Logo: FC<LogoProps> = ({ width, height }) => {
  return (
    <div className="z-50" style={{ width: width, height: height }}>
      <Image
        src={LogoImg}
        alt="KFP_LOGO"
        className="w-full h-full object-cover overflow-visible"
      />
    </div>
  );
};

export default Logo;
