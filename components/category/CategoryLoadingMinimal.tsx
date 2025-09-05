"use client";

import { Package, Sparkles } from "lucide-react";

const CategoryLoadingMinimal = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      {/* Icono principal */}
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-blue-300 rounded-xl shadow-lg animate-pulse flex items-center justify-center">
          <Package className="w-8 h-8 text-white" />
        </div>
        <Sparkles
          className="absolute -top-2 -right-2 w-5 h-5 text-pink-400 animate-spin"
          style={{ animationDuration: "2s" }}
        />
      </div>

      {/* Texto */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-700">
          Cargando productos
        </h3>
        <p className="text-gray-500">Explorando la categoría seleccionada...</p>
        <div className="flex justify-center space-x-1 mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryLoadingMinimal;
