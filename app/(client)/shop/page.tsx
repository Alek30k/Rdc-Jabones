import Shop from "@/components/Shop";
import { getCategories } from "@/sanity/queries";
import React from "react";

const ShopPage = async () => {
  const categories = await getCategories();

  return (
    <div className="bg-white mb-4   text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 ">
      <Shop categories={categories} />
    </div>
  );
};

export default ShopPage;
