"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie } from "lucide-react";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Comprueba si el usuario ya aceptó las cookies
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Guarda el consentimiento en localStorage
    localStorage.setItem("cookie_consent", "accepted");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="bg-white shadow-lg rounded-lg border border-gray-200 max-w-3xl mx-auto">
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-4">
          <div className="flex items-center gap-3">
            <Cookie className="h-6 w-6 text-shop_orange" />
            <p className="text-sm text-gray-700 leading-relaxed">
              Usamos cookies para mejorar tu experiencia de compra y
              personalizar contenido. Al continuar, aceptas nuestras{" "}
              <Link
                href="/politica-de-privacidad"
                className="text-shop_orange hover:underline font-medium"
              >
                políticas de privacidad
              </Link>
              .
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/privacy">Saber más</Link>
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-shop_orange hover:bg-shop_orange/90 text-white px-6 py-2 rounded-md whitespace-nowrap"
          >
            Aceptar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
