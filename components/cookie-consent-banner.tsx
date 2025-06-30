"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie } from "lucide-react";
import toast from "react-hot-toast";
import CookiePreferenceCenter, {
  CookiePreferences,
} from "./cookie-preferent-center";
import Link from "next/link";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferenceCenterOpen, setIsPreferenceCenterOpen] = useState(false);

  useEffect(() => {
    // Comprueba si el usuario ya aceptó o rechazó las cookies o si ya configuró sus preferencias
    const consent = localStorage.getItem("cookie_consent");
    const preferences = localStorage.getItem("cookie_preferences");

    if (!consent && !preferences) {
      setIsVisible(true);
    }
  }, []);

  const handleSavePreferences = (preferences: CookiePreferences) => {
    localStorage.setItem("cookie_preferences", JSON.stringify(preferences));
    localStorage.setItem("cookie_consent", "configured"); // Marca como configurado
    setIsVisible(false); // Oculta el banner principal
    // Aquí podrías añadir lógica para aplicar las preferencias de cookies
    console.log("Preferencias guardadas:", preferences);
  };

  const handleAccept = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    handleSavePreferences(allAccepted);
    toast.success("Cookies aceptadas. ¡Gracias por tu confianza!", {
      position: "bottom-center",
    });
  };

  const handleReject = () => {
    const allRejected: CookiePreferences = {
      necessary: true, // Necesarias siempre activas
      analytics: false,
      functional: false,
      marketing: false,
    };
    handleSavePreferences(allRejected);
    toast.error(
      "Cookies rechazadas. Algunas funcionalidades podrían estar limitadas.",
      {
        position: "bottom-center",
      }
    );
  };

  const handleConfigure = () => {
    setIsPreferenceCenterOpen(true); // Abre el modal del centro de preferencias
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
        <Card className="bg-white shadow-lg rounded-lg border border-gray-200 max-w-4xl mx-auto">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-4">
            <div className="flex items-center gap-3 flex-grow">
              <Cookie className="h-6 w-6 text-shop_orange flex-shrink-0" />
              <p className=" text-sm text-gray-700 leading-relaxed">
                En <span className=" text-shop_orange font-bold">RDC</span>,
                utilizamos cookies propias y de terceros para asegurarnos que la
                web funciona de manera correcta y ofrecerte una mejor
                experiencia de navegación. Puedes aceptar todas las cookies
                pulsando el botón “aceptar”, rechazarlas o configurarlas para
                elegir libremente las que mejor se adaptan a tus necesidades.{" "}
                <Link className="text-shop_orange" href="/privacy">
                  Saber más...
                </Link>
              </p>
              {/* <Button variant="outline" size="sm" asChild> */}
              {/* </Button> */}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                onClick={handleAccept}
                className="bg-shop_orange hover:bg-shop_orange/90 text-white px-6 py-2 rounded-md whitespace-nowrap"
              >
                Aceptar
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                className="border-shop_orange text-shop_orange hover:bg-shop_orange/10 px-6 py-2 rounded-md whitespace-nowrap bg-transparent"
              >
                Rechazar
              </Button>
              <Button
                onClick={handleConfigure}
                variant="ghost"
                className="text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-md whitespace-nowrap"
              >
                Configurar cookies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal del Centro de Preferencias */}
      <CookiePreferenceCenter
        isOpen={isPreferenceCenterOpen}
        onClose={() => setIsPreferenceCenterOpen(false)}
        onSave={handleSavePreferences}
      />
    </>
  );
}
