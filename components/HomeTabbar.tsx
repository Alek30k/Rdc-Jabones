"use client";
import { productType } from "@/constants/data";
import Link from "next/link";
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-3 justify-start sm:justify-between max-w-full overflow-x-hidden">
      <div className="flex items-center gap-1.5 md:gap-3 overflow-x-auto whitespace-nowrap">
        {productType?.map((item) => (
          <button
            onClick={() => onTabSelect(item?.title)}
            key={item?.title}
            className={`border border-shop_light_green/30 px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${selectedTab === item?.title ? "bg-shop_light_green text-white border-shop_light_green" : "bg-shop_light_green/10"}`}
          >
            {item?.title}
          </button>
        ))}
      </div>
      <Link
        href={"/shop"}
        className="border border-darkColor px-4 py-1 rounded-full hover:bg-shop_light_green  text-xs hover:text-white hover:border-shop_light_green hoverEffect"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;
