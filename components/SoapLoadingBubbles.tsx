"use client";

import { Sparkles, Droplets, Heart } from "lucide-react";

const SoapLoadingBubbles = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
      {/* Burbujas de fondo flotantes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center space-y-8">
        {/* Jabón animado */}
        <div className="relative mx-auto w-32 h-24">
          {/* Jabón base */}
          <div className="w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-2xl shadow-2xl animate-bounce">
            <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-xl"></div>
          </div>

          {/* Burbujas alrededor del jabón */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-white/80 rounded-full animate-ping"></div>
          <div
            className="absolute -top-1 left-2 w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute -bottom-1 -left-2 w-3 h-3 bg-white/70 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1 -right-1 w-2 h-2 bg-white/50 rounded-full animate-ping"
            style={{ animationDelay: "1.5s" }}
          ></div>

          {/* Iconos flotantes */}
          <Sparkles
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 text-pink-400 animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <Droplets className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-5 h-5 text-blue-400 animate-bounce" />
        </div>

        {/* Texto de carga */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
            Preparando tu jabón...
          </h2>
          <p className="text-gray-600 text-lg animate-fade-in-out">
            Mezclando los mejores ingredientes naturales...
          </p>
        </div>

        {/* Barra de progreso con burbujas */}
        <div className="w-80 mx-auto">
          <div className="relative h-3 bg-white/30 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full animate-loading-bar"></div>
            <div className="absolute inset-0 flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
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
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <span className="text-sm text-gray-600">Suave</span>
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

export default SoapLoadingBubbles;
