"use client";

import Container from "@/components/Container";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { urlFor } from "@/sanity/lib/image";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  CreditCard,
  MapPin,
  User,
  Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CheckoutData {
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
}

const CheckoutPage = () => {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (!data) {
      router.push("/cart");
      return;
    }

    const parsedData = JSON.parse(data);
    setCheckoutData(parsedData);
    setOrderNumber(`ORD-${Date.now()}`);
  }, [router]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const handlePaymentConfirmation = () => {
    if (!checkoutData) return;

    // Store order data for confirmation page
    const orderData = {
      ...checkoutData,
      orderNumber,
      orderDate: new Date().toISOString(),
      status: "pending_confirmation",
    };

    localStorage.setItem("orderData", JSON.stringify(orderData));
    localStorage.removeItem("checkoutData");
    router.push("/order-confirmation");
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cart" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al carrito
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Finalizar Compra
            </h1>
            <p className="text-gray-600">Pedido #{orderNumber}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">{checkoutData.customer.name}</p>
                  <p className="text-gray-600">{checkoutData.customer.email}</p>
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
                  <p className="font-semibold">{checkoutData.address.name}</p>
                  <p className="text-gray-600">
                    {checkoutData.address.address}, {checkoutData.address.city}
                  </p>
                  <p className="text-gray-600">
                    {checkoutData.address.state} {checkoutData.address.zip}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Productos ({checkoutData.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checkoutData.items.map(({ product }) => (
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
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            {/* Order Total */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <PriceFormatter amount={checkoutData.totals.subtotal} />
                </div>
                <div className="flex justify-between">
                  <span>Descuento</span>
                  <PriceFormatter amount={checkoutData.totals.discount} />
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-green-600 font-semibold">Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total a Pagar</span>
                  <PriceFormatter amount={checkoutData.totals.total} />
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Instrucciones de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Transferencia Bancaria
                  </h3>
                  <p className="text-sm text-blue-800">
                    Realiza la transferencia por el monto total y confirma tu
                    pago
                  </p>
                </div>

                <div className="space-y-4">
                  {/* CBU */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      CBU
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                      <code className="flex-1 text-sm font-mono">
                        0000003100010000000001
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard("0000003100010000000001", "CBU")
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Alias */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Alias
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                      <code className="flex-1 text-sm font-mono">
                        TIENDA.ONLINE.MP
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard("TIENDA.ONLINE.MP", "Alias")
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Titular de la cuenta
                    </label>
                    <p className="p-3 bg-gray-50 rounded-lg border text-sm">
                      Tu Tienda Online S.A.
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Monto a transferir
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <PriceFormatter
                        amount={checkoutData.totals.total}
                        className="flex-1 text-lg font-bold text-green-800"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            checkoutData.totals.total.toString(),
                            "Monto"
                          )
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> Incluye el número de pedido #
                    {orderNumber} en el concepto de la transferencia para
                    identificar tu pago.
                  </p>
                </div>

                <Button
                  onClick={handlePaymentConfirmation}
                  className="w-full"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ya realicé la transferencia
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Al confirmar, recibirás un email con los detalles de tu
                  pedido. Procesaremos tu pago en 24-48 horas hábiles.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;
