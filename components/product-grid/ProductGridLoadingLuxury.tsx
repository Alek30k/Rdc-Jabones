"use client";

import { Sparkles, Droplets, Heart, Package, Star } from "lucide-react";
import Container from "../Container";

const ProductGridLoadingLuxury = () => {
  return (
    <Container className="flex flex-col lg:px-0 my-10 relative overflow-hidden">
      {/* Patrón de fondo elegante */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-10 left-10 w-32 h-32 border border-rose-300 rounded-full animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 border border-purple-300 rounded-full animate-spin"
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 border border-pink-300 rounded-full animate-spin"
          style={{ animationDuration: "10s" }}
        ></div>
      </div>

      {/* Tab bar de lujo */}
      <div className="flex justify-center mb-6 relative z-10">
        <div className="flex space-x-1 bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 p-1 rounded-full shadow-lg border border-white/20">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 bg-gradient-to-r from-rose-200 via-pink-200 to-purple-200 rounded-full animate-pulse flex items-center justify-center shadow-sm"
              style={{
                width:
                  i === 1
                    ? "80px"
                    : i === 2
                      ? "100px"
                      : i === 3
                        ? "90px"
                        : "85px",
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <Star
                className="w-3 h-3 text-white/60 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contenido principal de lujo */}
      <div className="text-center space-y-8 py-16 relative z-10">
        {/* Logo/Jabón de lujo */}
        <div className="relative mx-auto w-32 h-24">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-300 via-pink-300 to-purple-300 rounded-3xl shadow-2xl animate-float">
            <div className="absolute inset-3 bg-gradient-to-br from-white/50 via-white/30 to-transparent rounded-2xl"></div>
            <div className="absolute inset-6 bg-gradient-to-br from-white/30 to-transparent rounded-xl"></div>
          </div>

          {/* Efectos de brillo */}
          <div className="absolute top-2 left-4 w-6 h-1.5 bg-white/60 rounded-full blur-sm animate-pulse"></div>
          <div
            className="absolute top-4 right-4 w-3 h-3 bg-white/40 rounded-full blur-sm animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>

          {/* Iconos flotantes de lujo */}
          <Sparkles
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 text-rose-400 animate-spin"
            style={{ animationDuration: "4s" }}
          />
          <Heart className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400 animate-bounce" />
          <Droplets
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-5 h-5 text-purple-400 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
          <Package className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-rose-400 animate-pulse" />
        </div>

        {/* Texto de lujo */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Jabones Artesanales Premium
          </h1>
          <h2 className="text-xl font-light text-gray-700 animate-fade-in-out">
            Curando tu colección exclusiva
          </h2>
          <p
            className="text-gray-600 max-w-md mx-auto leading-relaxed animate-fade-in-out"
            style={{ animationDelay: "0.5s" }}
          >
            Cada producto es seleccionado cuidadosamente para ofrecerte la mejor
            experiencia de lujo
          </p>
        </div>

        {/* Barra de progreso elegante */}
        <div className="space-y-3 max-w-sm mx-auto">
          <div className="w-full h-1 bg-gradient-to-r from-rose-100 to-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 rounded-full animate-loading-elegant"></div>
          </div>
          <p className="text-sm text-gray-500 animate-pulse">
            Preparando experiencia premium...
          </p>
        </div>

        {/* Características premium en grid */}
        <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto mt-8">
          {[
            { icon: Sparkles, label: "100% Natural", color: "emerald" },
            { icon: Droplets, label: "Hidratación Profunda", color: "blue" },
            { icon: Heart, label: "Piel Sedosa", color: "pink" },
            { icon: Package, label: "Hecho a Mano", color: "purple" },
          ].map(({ icon: Icon, label, color }, i) => (
            <div
              key={label}
              className="text-center space-y-2 animate-fade-in-out"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <div
                className={`w-12 h-12 mx-auto bg-gradient-to-br from-${color}-100 to-${color}-200 rounded-full flex items-center justify-center shadow-lg`}
              >
                <Icon className={`w-6 h-6 text-${color}-600`} />
              </div>
              <p className="text-xs font-medium text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Button de lujo */}
      <div className="text-center relative z-10">
        <div className="h-12 bg-gradient-to-r from-rose-200 to-purple-200 rounded-full animate-pulse w-64 mx-auto shadow-lg"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
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
    </Container>
  );
};

export default ProductGridLoadingLuxury;
