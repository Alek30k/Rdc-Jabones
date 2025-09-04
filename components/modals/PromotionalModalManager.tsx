"use client";

import { useState, useEffect } from "react";
import ProductShowcaseModal from "./ProductShowcaseModal";

type ModalType = "welcome" | "showcase" | "seasonal" | "newsletter" | null;

interface PromotionalModalManagerProps {
  // Puedes configurar qué modal mostrar
  modalType?: ModalType;
  // Delay antes de mostrar el modal (en ms)
  delay?: number;
  // Si debe mostrar solo una vez por sesión
  oncePerSession?: boolean;
  // Si debe mostrar solo una vez por día
  oncePerDay?: boolean;
}

const PromotionalModalManager = ({
  modalType = "showcase",
  delay = 2000,
  oncePerSession = true,
  oncePerDay = false,
}: PromotionalModalManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<ModalType>(modalType);

  useEffect(() => {
    // Verificar si ya se mostró en esta sesión
    const hasShownSession =
      oncePerSession && sessionStorage.getItem("promotional-modal-shown");

    // Verificar si ya se mostró hoy
    const today = new Date().toDateString();
    const lastShownDate = localStorage.getItem("promotional-modal-date");
    const hasShownToday = oncePerDay && lastShownDate === today;

    // Solo mostrar si no se ha mostrado según las reglas configuradas
    if (!hasShownSession && !hasShownToday) {
      const timer = setTimeout(() => {
        setIsOpen(true);

        // Marcar como mostrado según la configuración
        if (oncePerSession) {
          sessionStorage.setItem("promotional-modal-shown", "true");
        }
        if (oncePerDay) {
          localStorage.setItem("promotional-modal-date", today);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay, oncePerSession, oncePerDay]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const renderModal = () => {
    switch (currentModal) {
      case "showcase":
        return <ProductShowcaseModal isOpen={isOpen} onClose={handleClose} />;

      default:
        setCurrentModal("showcase");
        return null;
    }
  };

  return <>{renderModal()}</>;
};

export default PromotionalModalManager;
