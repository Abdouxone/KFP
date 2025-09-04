// Types
import { ProductVariantImage } from "@/generated/prisma";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// React , next js
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import { useEffect, useRef } from "react";
import { Play } from "next/font/google";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

export default function ProductCardImageSwiper({
  images,
}: {
  images: ProductVariantImage[];
}) {
  const swiperRef = useRef<any>(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  }, [swiperRef]);
  return (
    <div
      className="relative mb-2 w-full bg-white contrast-[90%] rounded-2xl overflow-hidden"
      style={{ height: "200px" }}
      onMouseEnter={() => swiperRef.current.swiper.autoplay.start()}
      onMouseLeave={() => {
        swiperRef.current.swiper.autoplay.stop();
        swiperRef.current.swiper.slideTo(0);
      }}
    >
      <Swiper ref={swiperRef} modules={[Autoplay]} autoplay={{ delay: 500 }}>
        {images.map((img) => (
          <SwiperSlide>
            <Image
              src={img.url}
              alt=""
              width={400}
              height={400}
              className="block object-cover h-[200px] w-48 sm:w-52"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      swiper
    </div>
  );
}
