"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <div className="max-w-2xl px-4 py-36 mx-auto sm:px-6 lg:px-8 text-center">
      <div className="mb-8">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          ¡Pedido confirmado!
        </h1>
        <p className="text-muted-foreground">
          Hemos recibido la confirmación de tu transferencia
        </p>
      </div>

      <Card className="mb-8 p-4">
        <CardHeader>
          <CardTitle>¿Qué sigue ahora?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">1</span>
            </div>
            <div>
              <h4 className="font-medium">Verificación del pago</h4>
              <p className="text-sm text-muted-foreground">
                Verificaremos tu transferencia en las próximas 24-48 horas
                hábiles
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">2</span>
            </div>
            <div>
              <h4 className="font-medium">Preparación del pedido</h4>
              <p className="text-sm text-muted-foreground">
                Una vez confirmado el pago, prepararemos tu pedido para el envío
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">3</span>
            </div>
            <div>
              <h4 className="font-medium">Envío y entrega</h4>
              <p className="text-sm text-muted-foreground">
                Te contactaremos con los detalles de envío y seguimiento
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button asChild className="w-full" size="lg">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>

        <Button variant="outline" asChild className="w-full">
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contactar por WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
