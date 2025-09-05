"use client";

import { Package, Search } from "lucide-react";

const CategoryLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Mobile Category Selector Skeleton */}
      <div className="md:hidden">
        <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md animate-pulse"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-4">
          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-3 shadow-sm border animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Product Image */}
                <div className="aspect-square bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-lg mb-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent animate-pulse"></div>

                  {/* Soap bubbles */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div
                    className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-5 bg-green-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryLoadingSkeleton;
