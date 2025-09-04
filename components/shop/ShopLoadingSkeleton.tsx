"use client";

const ShopLoadingSkeleton = () => {
  return (
    <div className="border-t">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header con filtros skeleton */}
        <div className="sticky top-0 z-10 mb-5 bg-white/95 backdrop-blur-sm py-2">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          {/* Sidebar skeleton */}
          <div className="hidden md:block md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50">
            <div className="pt-5 space-y-6">
              {/* Categorías skeleton */}
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-200 rounded animate-pulse"
                      style={{
                        width: `${Math.random() * 40 + 60}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Precios skeleton */}
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-200 rounded w-24 animate-pulse"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid de productos skeleton */}
          <div className="flex-1 pt-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-3 shadow-sm border animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Imagen del producto */}
                  <div className="aspect-square bg-gradient-to-br from-pink-100 to-blue-100 rounded-lg mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent animate-pulse"></div>

                    {/* Burbujas pequeñas */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div
                      className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>

                  {/* Información del producto */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  </div>

                  {/* Tags skeleton */}
                  <div className="flex gap-1 mt-2">
                    <div className="h-3 bg-gray-200 rounded-full w-12"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopLoadingSkeleton;
