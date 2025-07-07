"use client";

import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { whatsapp } from "@/images";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "¡Hola! Estoy interesado en un producto de su tienda.",
  className,
}) => {
  const encodedMessage = encodeURIComponent(message);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-transform duration-300 hover:scale-110",
        className
      )}
      aria-label="Contactar por WhatsApp"
    >
      <Button
        variant="default"
        size="icon"
        className="w-14 h-14 rounded-full shadow-lg bg-green-500 text-white hover:bg-green-600 focus:ring-4 focus:ring-green-300"
      >
        <Image src={whatsapp} alt="logo" className="w-8 h-8" />
      </Button>
    </a>
  );
};

export default WhatsAppButton;
