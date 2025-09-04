"use client";

import { Sparkles, Droplets, Flower, Heart } from "lucide-react";

const SoapLoadingLuxury = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* Patrón de fondo elegante */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-10 left-10 w-32 h-32 border border-pink-300 rounded-full animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 border border-purple-300 rounded-full animate-spin"
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 border border-rose-300 rounded-full animate-spin"
          style={{ animationDuration: "10s" }}
        ></div>
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo/Jabón de lujo */}
        <div className="relative mx-auto w-40 h-32">
          {/* Jabón principal con efectos de lujo */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-300 via-pink-300 to-purple-300 rounded-3xl shadow-2xl animate-float">
            <div className="absolute inset-3 bg-gradient-to-br from-white/50 via-white/30 to-transparent rounded-2xl"></div>
            <div className="absolute inset-6 bg-gradient-to-br from-white/30 to-transparent rounded-xl"></div>
          </div>

          {/* Efectos de brillo */}
          <div className="absolute top-2 left-4 w-8 h-2 bg-white/60 rounded-full blur-sm animate-pulse"></div>
          <div
            className="absolute top-6 right-6 w-4 h-4 bg-white/40 rounded-full blur-sm animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>

          {/* Iconos flotantes de lujo */}
          <Sparkles
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 text-rose-400 animate-spin"
            style={{ animationDuration: "4s" }}
          />
          <Flower className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-pink-400 animate-bounce" />
          <Droplets
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-6 text-purple-400 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
          <Heart className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-rose-400 animate-pulse" />
        </div>

        {/* Texto de lujo */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Jabones Artesanales
          </h1>
          <h2 className="text-2xl font-light text-gray-700 animate-fade-in-out">
            Preparando tu experiencia de lujo
          </h2>
          <p
            className="text-gray-600 leading-relaxed animate-fade-in-out"
            style={{ animationDelay: "0.5s" }}
          >
            Cada jabón es una obra de arte creada con ingredientes naturales
            premium
          </p>
        </div>

        {/* Barra de progreso elegante */}
        <div className="space-y-3">
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 rounded-full animate-loading-elegant"></div>
          </div>
          <p className="text-sm text-gray-500 animate-pulse">
            Seleccionando los mejores ingredientes...
          </p>
        </div>

        {/* Características premium */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div
            className="text-center space-y-2 animate-fade-in-out"
            style={{ animationDelay: "1s" }}
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">100% Natural</p>
          </div>

          <div
            className="text-center space-y-2 animate-fade-in-out"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
              <Droplets className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Hidratante</p>
          </div>

          <div
            className="text-center space-y-2 animate-fade-in-out"
            style={{ animationDelay: "2s" }}
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Piel Suave</p>
          </div>

          <div
            className="text-center space-y-2 animate-fade-in-out"
            style={{ animationDelay: "2.5s" }}
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-lg">
              <Flower className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Aromático</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }

        @keyframes loading-elegant {
          0% {
            width: 0%;
            transform: translateX(-100%);
          }
          50% {
            width: 100%;
            transform: translateX(0%);
          }
          100% {
            width: 100%;
            transform: translateX(100%);
          }
        }

        @keyframes fade-in-out {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-loading-elegant {
          animation: loading-elegant 3s ease-in-out infinite;
        }

        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SoapLoadingLuxury;
