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
        {/* Desktop Sidebar Skeleton */}
        <div className="hidden md:block w-64 space-y-6">
          {/* Categories Card */}
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-gray-300 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-gray-300 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-4">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-6 bg-gradient-to-r from-green-200 to-green-100 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse md:hidden"></div>
              <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-gray-200 animate-pulse"></div>

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
