"use client";

import Container from "@/components/Container";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import {
  CheckCircle,
  Package,
  Clock,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderData {
  items: Array<{
    product: any;
  }>;
  address: any;
  customer: {
    name: string;
    email: string;
    id: string;
  };
  totals: {
    subtotal: number;
    discount: number;
    total: number;
  };
  orderNumber: string;
  orderDate: string;
  status: string;
}

const OrderConfirmationPage = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const { resetCart } = useStore();
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("orderData");
    if (!data) {
      router.push("/");
      return;
    }

    const parsedData = JSON.parse(data);
    setOrderData(parsedData);

    // Clear cart after successful order
    resetCart();
  }, [router, resetCart]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando confirmación del pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Hemos recibido tu pedido y te enviaremos una confirmación por email
            una vez que procesemos tu pago.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Detalles del Pedido
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Pendiente de pago
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Número de pedido</p>
                    <p className="font-semibold">{orderData.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha del pedido</p>
                    <p className="font-semibold">
                      {formatDate(orderData.orderDate)}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Estado del pedido
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">
                      Esperando confirmación de pago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Productos Pedidos ({orderData.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map(({ product }) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      {product.images && (
                        <Image
                          src={
                            urlFor(product.images[0]).url() ||
                            "/placeholder.svg"
                          }
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {product.variant}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {(product.stock as number) > 0
                            ? "En stock"
                            : "Agotado"}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <PriceFormatter
                          amount={product.price}
                          className="font-semibold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Dirección de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-semibold">{orderData.address.name}</p>
                  <p className="text-gray-600">
                    {orderData.address.address}, {orderData.address.city}
                  </p>
                  <p className="text-gray-600">
                    {orderData.address.state} {orderData.address.zip}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Actions */}
          <div className="space-y-6">
            {/* Order Total */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <PriceFormatter amount={orderData.totals.subtotal} />
                </div>
                <div className="flex justify-between">
                  <span>Descuento</span>
                  <PriceFormatter amount={orderData.totals.discount} />
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-green-600 font-semibold">Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Pagado</span>
                  <PriceFormatter amount={orderData.totals.total} />
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Pasos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600">
                        1
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        Verificación de pago
                      </p>
                      <p className="text-xs text-gray-600">
                        Procesaremos tu transferencia en 24-48 horas hábiles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-gray-600">
                        2
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        Preparación del pedido
                      </p>
                      <p className="text-xs text-gray-600">
                        Empaquetaremos tus productos con cuidado
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-gray-600">
                        3
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Envío</p>
                      <p className="text-xs text-gray-600">
                        Te notificaremos cuando tu pedido esté en camino
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>¿Necesitas ayuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>soporte@tienda.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>+54 11 1234-5678</span>
                </div>
                <p className="text-xs text-gray-600">
                  Horario de atención: Lun-Vie 9:00-18:00
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/shop" className="flex items-center gap-2">
                  Seguir comprando
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderConfirmationPage;
