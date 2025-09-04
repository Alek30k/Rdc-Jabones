"use client";

import { Sparkles, Heart, Star } from "lucide-react";

interface ProductCardsLoadingProps {
  count?: number;
}

const ProductCardsLoading = ({ count = 12 }: ProductCardsLoadingProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg p-3 shadow-sm border hover:shadow-md transition-shadow animate-pulse group"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {/* Imagen del producto con efectos */}
          <div className="aspect-square bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-lg mb-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent animate-pulse"></div>

            {/* Burbujas animadas */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
            <div
              className="absolute top-3 left-3 w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            ></div>
            <div
              className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"
              style={{ animationDelay: "0.6s" }}
            ></div>
            <div
              className="absolute bottom-3 right-3 w-1 h-1 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: "0.9s" }}
            ></div>

            {/* Icono central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-6 bg-gradient-to-br from-pink-200 to-blue-200 rounded animate-pulse shadow-sm"></div>
            </div>

            {/* Corazón en la esquina */}
            <div className="absolute top-2 left-2">
              <Heart className="w-3 h-3 text-pink-300 animate-pulse" />
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-5 bg-gradient-to-r from-green-200 to-green-100 rounded w-1/2 animate-pulse"></div>
          </div>

          {/* Tags con iconos */}
          <div className="flex gap-1 mt-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full animate-pulse">
              <Star className="w-2 h-2 text-gray-300" />
              <div className="h-2 bg-gray-200 rounded w-8"></div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full animate-pulse">
              <Sparkles className="w-2 h-2 text-gray-300" />
              <div className="h-2 bg-gray-200 rounded w-10"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCardsLoading;
s;
