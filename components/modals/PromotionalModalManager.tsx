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
  // Tamaño mínimo de pantalla para mostrar el modal (en px)
  minScreenWidth?: number;
}

const PromotionalModalManager = ({
  modalType = "showcase",
  delay = 2000,
  oncePerSession = true,
  oncePerDay = false,
  minScreenWidth = 768, // Por defecto, solo mostrar en tablets y desktop (768px+)
}: PromotionalModalManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<ModalType>(modalType);
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [shouldShowModal, setShouldShowModal] = useState(false); // Estado para controlar si se debe mostrar el modal

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 640); // sm breakpoint
      setShouldShowModal(width >= minScreenWidth); // Solo mostrar si la pantalla es suficientemente grande
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [minScreenWidth]);

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
  }, [delay, oncePerSession, oncePerDay, shouldShowModal]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const renderModal = () => {
    // No renderizar nada si la pantalla es muy pequeña
    if (!shouldShowModal) {
      return null;
    }
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
