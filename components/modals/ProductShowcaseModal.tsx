"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Star, ArrowRight, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProductShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductShowcaseModal = ({
  isOpen,
  onClose,
}: ProductShowcaseModalProps) => {
  const featuredProducts = [
    {
      id: 1,
      name: "JABÓN CON ESPONJA DE ALOE VERA",
      price: 1500,
      originalPrice: 2000,
      image:
        "https://rdc-jabones.vercel.app/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fid5y26id%2Fproduction%2F8c709e862fd5a543190fd2c49606b10ce91b3565-500x500.jpg&w=1920&q=75",
      href: "https://rdc-jabones.vercel.app/product/jabon-con-esponja-de-aloe-vera",
      rating: 5,
      reviews: 127,
    },
    {
      id: 2,
      name: "Jabón Purificante de Carbón Activado y Menta",
      price: 1199,
      originalPrice: 1600,
      image:
        "https://rdc-jabones.vercel.app/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fid5y26id%2Fproduction%2F4c933807bb930f16aaf1c64c5d110e12c332362a-500x500.png&w=1920&q=75",
      href: "https://rdc-jabones.vercel.app/product/jabon-purificante-de-carbon-activado-y-menta",
      rating: 5,
      reviews: 89,
    },
    {
      id: 3,
      name: "JABÓN MASAJEADOR CON ESPONJA DE ALOE VERA",
      price: 1999,
      originalPrice: 2600,
      image:
        "https://rdc-jabones.vercel.app/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fid5y26id%2Fproduction%2F39d8c8c98f444b19b43996c58c492225899b02d6-500x500.jpg&w=1920&q=75",
      href: "https://rdc-jabones.vercel.app/product/jabon-masajeador-con-esponja-de-aloe-vera",
      rating: 4,
      reviews: 156,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-gradient-to-br from-rose-50 via-white to-purple-50 border-0">
        <div className="relative">
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-sm"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative inline-block mb-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                    ✨ Productos Destacados ✨
                  </h2>
                  <Sparkles className="absolute -top-2 -right-8 w-6 h-6 text-pink-400 animate-pulse" />
                </div>
                <p className="text-gray-600 text-lg">
                  Los favoritos de nuestros clientes
                </p>
              </motion.div>

              {/* Oferta especial */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full inline-block shadow-lg mt-4"
              >
                <span className="text-xl font-bold">25% OFF</span>
                <span className="text-sm ml-2">en estos productos hoy</span>
              </motion.div>
            </div>

            {/* Productos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow group"
                >
                  {/* Imagen del producto */}
                  <div className="relative mb-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Heart className="w-5 h-5 text-pink-400 hover:fill-pink-400 cursor-pointer transition-colors" />
                    </div>
                    {/* Badge de descuento */}
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </div>
                  </div>

                  {/* Info del producto */}
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < product.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Precio */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-green-600">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>

                  {/* Botón */}
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg">
                    <Link href={product.href || "#"} onClick={onClose}>
                      Ver producto
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* CTA principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center"
            >
              <button>
                <Link
                  href="https://rdc-jabones.vercel.app/shop"
                  onClick={onClose}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  Ver toda la colección
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Oferta válida por tiempo limitado
              </p>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductShowcaseModal;
