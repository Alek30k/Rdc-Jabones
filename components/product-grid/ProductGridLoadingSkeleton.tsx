"use client";

import { motion } from "motion/react";
import Container from "../Container";

const ProductGridLoadingSkeleton = () => {
  return (
    <Container className="flex flex-col lg:px-0 my-10">
      {/* Tab bar skeleton */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-full">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded-full animate-pulse"
              style={{
                width:
                  i === 1
                    ? "80px"
                    : i === 2
                      ? "100px"
                      : i === 3
                        ? "90px"
                        : "85px",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Image skeleton */}
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse relative">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>

            {/* Content skeleton */}
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Button skeleton */}
      <div className="text-center mt-5">
        <div className="h-12 bg-gray-200 rounded-full animate-pulse w-64 mx-auto"></div>
      </div>
    </Container>
  );
};

export default ProductGridLoadingSkeleton;
