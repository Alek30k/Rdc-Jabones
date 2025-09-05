"use client";

import { Sparkles, Droplets, Package, Search, Filter } from "lucide-react";

const CategoryLoadingBubbles = () => {
  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden rounded-lg">
      {/* Burbujas de fondo flotantes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 40 + 10}px`,
              height: `${Math.random() * 40 + 10}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 p-8">
        {/* Icono principal animado */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-2xl shadow-2xl animate-bounce flex items-center justify-center">
            <Package className="w-12 h-12 text-white" />
          </div>

          {/* Iconos flotantes alrededor */}
          <Sparkles
            className="absolute -top-4 -right-4 w-6 h-6 text-pink-400 animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <Droplets
            className="absolute -bottom-4 -left-4 w-5 h-5 text-blue-400 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
          <Filter
            className="absolute -top-4 -left-4 w-5 h-5 text-purple-400 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <Search
            className="absolute -bottom-4 -right-4 w-5 h-5 text-green-400 animate-bounce"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        {/* Texto principal */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
            Explorando productos
          </h2>
          <p className="text-gray-600 text-lg animate-fade-in-out">
            Descubriendo los mejores jabones artesanales para ti...
          </p>
        </div>

        {/* Barra de progreso con burbujas */}
        <div className="w-80 mx-auto">
          <div className="relative h-3 bg-white/30 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full animate-loading-bar"></div>
            <div className="absolute inset-0 flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Iconos de características */}
        <div className="flex justify-center space-x-8 mt-8">
          <div
            className="flex flex-col items-center space-y-2 animate-fade-in-out"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Natural</span>
          </div>

          <div
            className="flex flex-col items-center space-y-2 animate-fade-in-out"
            style={{ animationDelay: "1s" }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Hidratante</span>
          </div>

          <div
            className="flex flex-col items-center space-y-2 animate-fade-in-out"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-pink-600" />
            </div>
            <span className="text-sm text-gray-600">Artesanal</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes loading-bar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes fade-in-out {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-loading-bar {
          animation: loading-bar 3s ease-in-out infinite;
        }

        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CategoryLoadingBubbles;
