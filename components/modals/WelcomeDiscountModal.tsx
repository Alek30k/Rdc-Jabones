"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Sparkles, Gift, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface WelcomeDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeDiscountModal = ({
  isOpen,
  onClose,
}: WelcomeDiscountModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Aquí puedes agregar la lógica para guardar el email
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50 border-0">
        <div className="relative">
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-sm"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Burbujas de fondo */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 30 + 10}px`,
                  height: `${Math.random() * 30 + 10}px`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 p-8 text-center">
            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Logo/Icono principal */}
                <div className="relative mx-auto w-20 h-16 mb-6">
                  <div className="w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-2xl shadow-xl animate-bounce">
                    <div className="absolute inset-2 bg-gradient-to-br from-white/40 to-transparent rounded-xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <Sparkles
                    className="absolute -top-2 -right-2 w-6 h-6 text-pink-400 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                </div>

                {/* Título principal */}
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  ¡Bienvenido a Jabones Artesanales!
                </h2>

                {/* Oferta */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full inline-block mb-4 shadow-lg">
                  <span className="text-lg font-bold">20% OFF</span>
                  <span className="text-sm ml-2">en tu primera compra</span>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Descubre nuestros jabones 100% naturales hechos a mano.
                  Suscríbete y recibe tu código de descuento instantáneo.
                </p>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Tu email aquí..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-2 border-pink-200 focus:border-pink-400 rounded-xl"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Obtener mi descuento
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>

                <p className="text-xs text-gray-500 mt-4">
                  * Válido solo para nuevos clientes. No spam, prometido.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="py-8"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    ✓
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">
                  ¡Perfecto!
                </h3>
                <p className="text-gray-600 mb-4">
                  Tu código de descuento <strong>BIENVENIDO20</strong> ha sido
                  enviado a tu email.
                </p>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <code className="text-lg font-mono font-bold text-pink-600">
                    BIENVENIDO20
                  </code>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDiscountModal;
