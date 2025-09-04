"use client";

import { Sparkles, Droplets, Heart, Star } from "lucide-react";

const ShopLoadingGrid = () => {
  return (
    <div className="border-t bg-gradient-to-br from-pink-50/30 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header skeleton mejorado */}
        <div className="sticky top-0 z-10 mb-5 bg-white/95 backdrop-blur-sm py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-pink-300 to-blue-300 rounded animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
            </div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          {/* Sidebar mejorado */}
          <div className="hidden md:block md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50">
            <div className="pt-5 space-y-6">
              {/* Categorías con iconos */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles
                    className="w-4 h-4 text-pink-400 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                  <div className="h-5 bg-gradient-to-r from-pink-200 to-transparent rounded w-20 animate-pulse"></div>
                </div>
                <div className="space-y-2 pl-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-4 bg-gradient-to-r from-gray-200 to-transparent rounded animate-pulse"
                      style={{
                        width: `${Math.random() * 40 + 60}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Precios con icono */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400 animate-bounce" />
                  <div className="h-5 bg-gradient-to-r from-blue-200 to-transparent rounded w-16 animate-pulse"></div>
                </div>
                <div className="space-y-2 pl-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-4 bg-gradient-to-r from-gray-200 to-transparent rounded w-24 animate-pulse"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid de productos mejorado */}
          <div className="flex-1 pt-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {[...Array(12)].map((_, i) => (
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

            {/* Mensaje de carga en la parte inferior */}
            <div className="text-center mt-8 py-4">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <div className="flex space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <span className="text-sm animate-pulse">
                  Cargando más productos...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopLoadingGrid;
