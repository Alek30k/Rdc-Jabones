"use client";

import { motion } from "framer-motion";
import { Package, Sparkles, Droplets, Heart } from "lucide-react";

interface ProductsGridLoadingProps {
  type?: "luxury" | "bubbles" | "minimal" | "skeleton";
}

const ProductsGridLoading = ({ type = "luxury" }: ProductsGridLoadingProps) => {
  if (type === "skeleton") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-xl aspect-square mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "minimal") {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (type === "bubbles") {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Burbujas flotantes */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
            animate={{
              y: [-20, -100],
              x: [0, Math.random() * 40 - 20],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: -20,
            }}
          />
        ))}

        <div className="text-center z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
          >
            <Droplets className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Cargando productos
          </h3>
          <p className="text-gray-600">
            Preparando los mejores jabones para ti...
          </p>
        </div>
      </div>
    );
  }

  // Luxury loading (default)
  return (
    <div className="relative min-h-[400px] flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Patrón de fondo animado */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-amber-300 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 10 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 max-w-md mx-auto px-6">
        {/* Icono principal animado */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Package className="w-10 h-10 text-white" />
        </motion.div>

        {/* Título y descripción */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-3"
        >
          Cargando productos
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-6"
        >
          Seleccionando los mejores jabones artesanales para ti
        </motion.p>

        {/* Barra de progreso elegante */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Características destacadas */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Sparkles, label: "Natural" },
            { icon: Droplets, label: "Hidratante" },
            { icon: Heart, label: "Artesanal" },
          ].map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <Icon className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-sm text-gray-600 font-medium">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsGridLoading;
