"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Clock, Gift, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SeasonalOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SeasonalOfferModal = ({ isOpen, onClose }: SeasonalOfferModalProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  // Simulador de countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-0">
        <div className="relative">
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-sm"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Efectos de fondo */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-r from-orange-200/30 to-pink-200/30 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 40 + 20}px`,
                  height: `${Math.random() * 40 + 20}px`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 p-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge de oferta especial */}
              <div className="relative inline-block mb-6">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  🔥 OFERTA ESPECIAL 🔥
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-orange-400 animate-spin" />
              </div>

              {/* Título principal */}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                ¡Venta Flash de Primavera!
              </h2>

              {/* Descuento principal */}
              <div className="relative mb-6">
                <div className="text-6xl font-black text-transparent bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text">
                  40%
                </div>
                <div className="text-2xl font-bold text-gray-700 -mt-2">
                  DE DESCUENTO
                </div>
                <div className="text-lg text-gray-600">
                  en toda la colección
                </div>
              </div>

              {/* Countdown timer */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    Termina en:
                  </span>
                </div>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg px-3 py-2 font-bold text-xl">
                      {timeLeft.hours.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Horas</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg px-3 py-2 font-bold text-xl">
                      {timeLeft.minutes.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Min</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg px-3 py-2 font-bold text-xl">
                      {timeLeft.seconds.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Seg</div>
                  </div>
                </div>
              </div>

              {/* Beneficios */}
              <div className="bg-white/60 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-green-500" />
                    <span>Envío gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>Regalo sorpresa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Entrega rápida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">❤️</span>
                    <span>100% natural</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={onClose}
                className="w-full h-14 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                ¡Aprovechar oferta ahora!
                <ArrowRight className="w-5 h-5" />
              </Button>

              <p className="text-xs text-gray-500 mt-3">
                * Oferta válida hasta agotar stock. Código: PRIMAVERA40
              </p>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeasonalOfferModal;
