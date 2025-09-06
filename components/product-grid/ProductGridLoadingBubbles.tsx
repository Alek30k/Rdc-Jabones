"use client";

import { Sparkles, Droplets, Heart, Package } from "lucide-react";
import Container from "../Container";

const ProductGridLoadingBubbles = () => {
  return (
    <Container className="flex flex-col lg:px-0 my-10 relative overflow-hidden">
      {/* Burbujas de fondo flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-pink-200/30 to-blue-200/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 3}s`,
            }}
          />
        ))}
      </div>

      {/* Tab bar loading */}
      <div className="flex justify-center mb-6 relative z-10">
        <div className="flex space-x-1 bg-gradient-to-r from-pink-100 to-blue-100 p-1 rounded-full">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 bg-gradient-to-r from-pink-200 to-blue-200 rounded-full animate-pulse flex items-center justify-center"
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
              <div
                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contenido principal de carga */}
      <div className="text-center space-y-6 py-20 relative z-10">
        {/* Jabón animado central */}
        <div className="relative mx-auto w-24 h-20">
          <div className="w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-2xl shadow-xl animate-bounce">
            <div className="absolute inset-2 bg-gradient-to-br from-white/40 to-transparent rounded-xl"></div>
          </div>

          {/* Burbujas alrededor */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-white/80 rounded-full animate-ping"></div>
          <div
            className="absolute -bottom-1 -left-2 w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>

          {/* Iconos flotantes */}
          <Sparkles
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-5 h-5 text-pink-400 animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <Droplets className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 text-blue-400 animate-bounce" />
        </div>

        {/* Texto de carga */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Preparando tus productos
          </h3>
          <p className="text-gray-600 animate-fade-in-out">
            Seleccionando los mejores jabones artesanales...
          </p>
        </div>

        {/* Barra de progreso con burbujas */}
        <div className="w-80 mx-auto">
          <div className="relative h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full animate-loading-bar"></div>
            <div className="absolute inset-0 flex items-center justify-center space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="flex justify-center space-x-6 mt-8">
          {[
            { icon: Sparkles, label: "Natural", color: "green" },
            { icon: Droplets, label: "Hidratante", color: "blue" },
            { icon: Heart, label: "Suave", color: "pink" },
            { icon: Package, label: "Artesanal", color: "purple" },
          ].map(({ icon: Icon, label, color }, i) => (
            <div
              key={label}
              className="flex flex-col items-center space-y-2 animate-fade-in-out"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <div
                className={`w-10 h-10 bg-gradient-to-br from-${color}-200 to-${color}-300 rounded-full flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
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
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }

        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out infinite;
        }
      `}</style>
    </Container>
  );
};

export default ProductGridLoadingBubbles;
