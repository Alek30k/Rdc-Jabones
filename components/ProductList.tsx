"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import type { Product } from "@/sanity.types";
import { useState } from "react";
import CategoryLoadingLuxury from "./category/CategoryLoadingLuxury";
import CategoryLoadingBubbles from "./category/CategoryLoadingBubbles";
import CategoryLoadingMinimal from "./category/CategoryLoadingMinimal";
import CategoryLoadingSkeleton from "./category/CategoryLoadingSkeleton";

interface Props {
  products: Product[];
  currentSlug: string;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  viewMode: "grid" | "list";
  loading: boolean;
}
type LoadingType = "luxury" | "bubbles" | "minimal" | "skeleton";

const ProductList = ({
  products,
  currentSlug,
  currentPage,
  totalPages,
  setCurrentPage,
  viewMode,
  loading,
}: Props) => {
  if (products.length === 0) {
    return (
      <NoProductAvailable selectedTab={currentSlug} className="mt-0 w-full" />
    );
  }

  const [loadingType] = useState<LoadingType>("skeleton");

  const renderLoadingComponent = () => {
    switch (loadingType) {
      case "luxury":
        return <CategoryLoadingLuxury />;
      case "bubbles":
        return <CategoryLoadingBubbles />;
      case "minimal":
        return <CategoryLoadingMinimal />;
      case "skeleton":
        return <CategoryLoadingSkeleton />;
      default:
        return <CategoryLoadingLuxury />;
    }
  };

  if (loading) {
    return renderLoadingComponent();
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentSlug}-${currentPage}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              : "space-y-4"
          }
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && <span className="text-gray-500">...</span>}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductList;
