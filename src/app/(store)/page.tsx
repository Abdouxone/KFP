import { useCartStore } from "@/cart-store/useCartStore";
import HomeMainSwiper from "@/components/store/home/main/home-swiper";
import Sideline from "@/components/store/home/sideline/sideline";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Footer from "@/components/store/layout/footer/footer";
import Header from "@/components/store/layout/header/header";
import ProductList from "@/components/store/shared/product-list";
import { getHomeDataDynamic, getHomeFeaturedCategories } from "@/queries/home";
import { getProducts } from "@/queries/product";
import Link from "next/link";
import { property } from "zod";

export default async function HomePage() {
  const productsData = await getProducts();
  const { products } = productsData;

  const { products_pvc } = await getHomeDataDynamic([
    { property: "category", value: "pvc", type: "full" },
  ]);

  const categories = await getHomeFeaturedCategories();

  return (
    <div>
      <Header />
      <CategoriesHeader />
      <div className=" relative w-full">
        <Sideline />
        <div className="relative w-[calc(100%-40px)] h-full bg-[#e3e3e3]">
          <div className="max-w-[1600px] mx-auto min-h-screen p-4">
            {/* Main */}
            <div className="w-full grid gap-2 min-[1170px]:grid-cols-[1fr_350px] min-[1465px]:grid-cols-[200px_1fr_350px]">
              {/* Left */}
              <Link href="">
                <div
                  className="h-[555px] cursor-pointer hidden min-[1465px]:block bg-cover bg-no-repeat rounded-md"
                  style={{
                    backgroundImage:
                      "url(/assets/images/ads/winter-sports-clothing.jpg)",
                  }}
                />
              </Link>
              {/* Middle */}
              <div className="space-y-2 h-fit">
                {/* Main swiper */}
                <HomeMainSwiper />
                {/* Featured card */}
                <div className="h-[200px]"></div>
              </div>
              {/* Right */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// <Footer />
