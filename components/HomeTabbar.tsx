"use client";
import { productType } from "@/constants/data";
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex flex-col flex-wrap gap-3 max-w-full overflow-x-hidden">
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
    </div>
  );
};

export default HomeTabbar;
