"use client";

interface ProductCardsLoadingMinimalProps {
  count?: number;
}

const ProductCardsLoadingMinimal = ({
  count = 8,
}: ProductCardsLoadingMinimalProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg p-3 shadow-sm border animate-pulse"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {/* Imagen */}
          <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3"></div>

          {/* Información */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Tags */}
          <div className="flex gap-1 mt-2">
            <div className="h-3 bg-gray-200 rounded-full w-12"></div>
            <div className="h-3 bg-gray-200 rounded-full w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCardsLoadingMinimal;
