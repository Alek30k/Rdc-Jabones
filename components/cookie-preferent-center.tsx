"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Cookie } from "lucide-react";

// Define la interfaz para las preferencias de cookies
export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

interface CookiePreferenceCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
}

export default function CookiePreferenceCenter({
  isOpen,
  onClose,
  onSave,
}: CookiePreferenceCenterProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Siempre activas
    analytics: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    if (isOpen) {
      // Cargar preferencias guardadas al abrir el modal
      const savedPreferences = localStorage.getItem("cookie_preferences");
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, [isOpen]);

  const handleToggle = (
    category: keyof Omit<CookiePreferences, "necessary">,
    checked: boolean
  ) => {
    setPreferences((prev) => ({ ...prev, [category]: checked }));
  };

  const handleAllowAll = () => {
    setPreferences({
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    });
    toast.success("Todas las cookies han sido activadas.", {
      position: "bottom-center",
    });
  };

  const handleConfirmPreferences = () => {
    onSave(preferences);
    onClose();
    toast.success("Tus preferencias de cookies han sido guardadas.", {
      position: "bottom-center",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6 flex flex-col  overflow-y-auto">
        <DialogHeader className="flex-shrink-0">
          {" "}
          {/* Asegura que el header no se encoja */}
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Cookie className="h-6 w-6 text-shop_orange" />
            Centro de preferencia de la privacidad
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6 flex-grow overflow-y-auto pr-2">
          {" "}
          {/* flex-grow para que ocupe espacio, overflow-y-auto para scroll, pr-2 para espacio del scrollbar */}
          <p className="text-sm text-gray-700">
            Ahora mismo las cookies están desactivadas. Puedes activarlas todas
            eligiendo “permitir todas”, o puedes analizar bloque a bloque para
            activar sólo aquellas que consideres oportuno. Si decides no activar
            todas, te invitamos a que leas brevemente cada categoría para saber
            exactamente a que renuncias en cada caso. Al pulsar “confirmar mis
            preferencias” sólo aplicarán las cookies que hayas activado.{" "}
            <a
              href="/politica-de-privacidad"
              className="text-shop_orange hover:underline"
            >
              Más información
            </a>
          </p>
          <h3 className="text-lg font-semibold text-gray-800">
            Gestionar las preferencias de consentimiento
          </h3>
          {/* Cookies estrictamente necesarias */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
            <div>
              <Label
                htmlFor="necessary-cookies"
                className="text-base font-medium text-gray-900"
              >
                Cookies estrictamente necesarias
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Activas siempre. Estas cookies son imprescindibles para que el
                sitio web funcione y no se pueden desactivar en nuestros
                sistemas. Estas cookies no guardan ninguna información personal
                identificable.
              </p>
            </div>
            <Switch
              id="necessary-cookies"
              checked={true}
              disabled
              className="data-[state=checked]:bg-shop_dark_green"
            />
          </div>
          {/* Cookies de estadística */}
          <div className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200">
            <div>
              <Label
                htmlFor="analytics-cookies"
                className="text-base font-medium text-gray-900"
              >
                Cookies de estadística
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Nos Permiten cuantificar el número de entradas a la web para
                medir y analizar de forma estadísticas el uso que hacen los
                lectores de los contenidos publicados, y mejorar así la
                información que ofrecemos en nuestro site. Toda la información
                que recogen estas cookies es agregada y, por lo tanto, anónima.
              </p>
            </div>
            <Switch
              id="analytics-cookies"
              checked={preferences.analytics}
              onCheckedChange={(checked) => handleToggle("analytics", checked)}
              className="data-[state=checked]:bg-shop_dark_green"
            />
          </div>
          {/* Cookies de funcionalidad */}
          <div className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200">
            <div>
              <Label
                htmlFor="functional-cookies"
                className="text-base font-medium text-gray-900"
              >
                Cookies de funcionalidad
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Estas cookies te permiten utilizar diferentes opciones o
                servicios que se ofrecen en la web como por ejemplo añadir un
                comentario a un artículo, compartirlo en RRSS... Si no activas
                estas cookies, algunos de estos servicios no funcionarán
                correctamente.
              </p>
            </div>
            <Switch
              id="functional-cookies"
              checked={preferences.functional}
              onCheckedChange={(checked) => handleToggle("functional", checked)}
              className="data-[state=checked]:bg-shop_dark_green"
            />
          </div>
          {/* Cookies de marketing */}
          <div className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200">
            <div>
              <Label
                htmlFor="marketing-cookies"
                className="text-base font-medium text-gray-900"
              >
                Cookies de marketing
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                En Consumer.es no hacemos publicidad de ningún tipo. No
                obstante, algún servicio de terceros agregado en nuestra web
                puede contener este tipo de cookies que se utiliza por ejemplo
                para mostrarte anuncios según tus intereses.
              </p>
            </div>
            <Switch
              id="marketing-cookies"
              checked={preferences.marketing}
              onCheckedChange={(checked) => handleToggle("marketing", checked)}
              className="data-[state=checked]:bg-shop_dark_green"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 flex-shrink-0">
          {" "}
          {/* Asegura que el footer no se encoja */}
          <Button
            variant="outline"
            onClick={handleAllowAll}
            className="border-shop_orange text-shop_orange hover:bg-shop_orange/10 bg-transparent"
          >
            Permitir todas
          </Button>
          <Button
            onClick={handleConfirmPreferences}
            className="bg-shop_orange hover:bg-shop_orange/90 text-white"
          >
            Confirmar mis preferencias
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
