"use client";

import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import type { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  ShoppingBag,
  Trash,
  ArrowRight,
  CreditCard,
  MapPin,
  Package2,
  Info,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddAddressModal from "@/components/AddAddressModal";

const CartPage = () => {
  const { deleteCartProduct, getTotalPrice, getSubTotalPrice, resetCart } =
    useStore();
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [needsDelivery, setNeedsDelivery] = useState(false);
  const router = useRouter();

  const fetchAddresses = async () => {
    setAddressLoading(true);
    try {
      const query = `*[_type=="address" && user._ref == "${user?.id}"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.log("Addresses fetching error:", error);
      toast.error("Error al cargar las direcciones");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleAddressAdded = (newAddress: Address) => {
    setAddresses((prev) => {
      const updated = prev ? [newAddress, ...prev] : [newAddress];
      return updated;
    });
    if (newAddress.default || !selectedAddress) {
      setSelectedAddress(newAddress);
    }
  };

  useEffect(() => {
    if (isSignedIn && needsDelivery) {
      fetchAddresses();
    }
  }, [isSignedIn, needsDelivery, user?.id]);

  const handleResetCart = () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres vaciar tu carrito?"
    );
    if (confirmed) {
      resetCart();
      toast.success("Carrito vaciado exitosamente!");
    }
  };

  const handleProceedToCheckout = async () => {
    if (groupedItems.length === 0) {
      toast.error("Tu carrito está vacío.");
      return;
    }
    if (needsDelivery && !selectedAddress) {
      toast.error("Por favor selecciona una dirección de entrega");
      return;
    }
    if (!user) {
      toast.error("Debes estar logueado para continuar");
      return;
    }
    setLoading(true);
    try {
      const checkoutData = {
        items: groupedItems,
        address: needsDelivery ? selectedAddress : null,
        needsDelivery,
        customer: {
          name: user?.fullName ?? "Unknown",
          email: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
          id: user?.id,
        },
        totals: {
          subtotal: getSubTotalPrice(),
          discount: getSubTotalPrice() - getTotalPrice(),
          total: getTotalPrice(),
        },
        orderNumber: `ORD-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      router.push("/checkout");
    } catch (error) {
      console.error("Error preparing checkout:", error);
      toast.error("Error al procesar el pedido. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleDeliveryChange = (checked: boolean) => {
    setNeedsDelivery(checked);
    if (!checked) {
      setSelectedAddress(null);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="bg-gray-50 dark:bg-gray-950 pb-52 md:pb-10">
        <NoAccess />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 pb-52 md:pb-10">
      <Container>
        {groupedItems?.length ? (
          <>
            <div className="flex items-center gap-2 py-5">
              <ShoppingBag className="text-darkColor dark:text-gray-100" />
              <Title className="dark:text-gray-100">Carrito de Compras</Title>
            </div>
            <div className="grid lg:grid-cols-3 md:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 rounded-lg">
                <div className="border bg-white dark:bg-gray-900 rounded-md dark:border-gray-700">
                  {groupedItems?.map((item) => {
                    const product = item.product;
                    const itemCount = item.quantity;

                    return (
                      <div
                        key={`${product?._id}-${JSON.stringify(
                          product.customization || {}
                        )}`}
                        className="border-b dark:border-gray-700 p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                      >
                        <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                          {product?.images && (
                            <Link
                              href={`/product/${product?.slug?.current}`}
                              className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group dark:border-gray-700"
                            >
                              <Image
                                src={
                                  urlFor(product?.images[0]).url() ||
                                  "/placeholder.svg"
                                }
                                alt="productImage"
                                width={500}
                                height={500}
                                loading="lazy"
                                className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                              />
                            </Link>
                          )}

                          <div className="h-full flex flex-1 flex-col justify-between py-1">
                            <div className="flex flex-col gap-0.5 md:gap-1.5">
                              <h2 className="text-base font-semibold line-clamp-1 text-gray-900 dark:text-gray-100">
                                {product?.name}
                              </h2>
                              {product.customization &&
                                (product.customization.soapType ||
                                  product.customization.color) && (
                                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <Info className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">
                                      Personalizado:
                                    </span>
                                    {product.customization.soapType && (
                                      <span className="text-blue-700 dark:text-blue-400">
                                        Jabón de{" "}
                                        {product.customization.soapType}
                                      </span>
                                    )}
                                    {product.customization.color && (
                                      <span className="text-purple-700 dark:text-purple-400 ml-1">
                                        Color: {product.customization.color}
                                      </span>
                                    )}
                                    {product.customization.notes && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span className="ml-1 text-gray-500 dark:text-gray-400 cursor-help">
                                              (Notas)
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent className="max-w-xs p-2 text-sm">
                                            <p>{product.customization.notes}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </div>
                                )}

                              <p className="text-sm capitalize text-gray-700 dark:text-gray-300">
                                Variante:{" "}
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  {product?.variant}
                                </span>
                              </p>
                              <p className="text-sm capitalize text-gray-700 dark:text-gray-300">
                                Estado:{" "}
                                <span
                                  className={`font-semibold ${
                                    (product?.stock as number) > 0
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {(product?.stock as number) > 0
                                    ? "En Stock"
                                    : "Agotado"}
                                </span>
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <ProductSideMenu
                                      product={product}
                                      className="relative top-0 right-0"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent className="font-bold">
                                    Agregar a favoritos
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Trash
                                      onClick={() => {
                                        deleteCartProduct(
                                          product?._id,
                                          product.customization
                                        );
                                        toast.success(
                                          "Producto eliminado exitosamente!"
                                        );
                                      }}
                                      className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 dark:text-gray-400 hover:text-red-600 hoverEffect cursor-pointer"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent className="font-bold bg-red-600 text-white">
                                    Eliminar producto
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                          <PriceFormatter
                            amount={(product?.price as number) * itemCount}
                            className="font-bold text-lg text-gray-900 dark:text-gray-100"
                          />
                          <QuantityButtons product={product} />
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    onClick={handleResetCart}
                    className="m-5 font-semibold"
                    variant="destructive"
                  >
                    Vaciar Carrito
                  </Button>
                </div>
              </div>

              {/* Order Summary & Delivery Options */}
              <div>
                <div className="lg:col-span-1">
                  {/* Desktop Order Summary */}
                  <div className="hidden md:inline-block w-full bg-white dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                      Resumen del Pedido
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span>Subtotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span>Descuento</span>
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span>Envío</span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          {needsDelivery ? "Gratis" : "No aplica"}
                        </span>
                      </div>
                      <Separator className="dark:bg-gray-700" />
                      <div className="flex items-center justify-between font-semibold text-lg text-gray-900 dark:text-gray-100">
                        <span>Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg font-bold"
                        />
                      </div>
                      <Button
                        className="w-full rounded-full font-semibold tracking-wide hoverEffect flex items-center gap-2"
                        size="lg"
                        disabled={
                          loading || (needsDelivery && !selectedAddress)
                        }
                        onClick={handleProceedToCheckout}
                      >
                        {loading ? (
                          "Procesando..."
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            Continuar con el Pago
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                      {needsDelivery && !selectedAddress && (
                        <p className="text-sm text-red-600 text-center">
                          Selecciona una dirección para continuar
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="bg-white dark:bg-gray-900 rounded-md mt-5 border dark:border-gray-700">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Package2 className="w-5 h-5" />
                          Opciones de Entrega
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="needsDelivery"
                            checked={needsDelivery}
                            onCheckedChange={handleDeliveryChange}
                          />
                          <Label
                            htmlFor="needsDelivery"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100"
                          >
                            Necesito envío a domicilio
                          </Label>
                        </div>
                        {!needsDelivery && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-700">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                              <strong>Retiro en tienda:</strong> Podrás retirar
                              tu pedido en nuestro local una vez confirmado el
                              pago.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Delivery Address */}
                  {needsDelivery && (
                    <>
                      {addressLoading ? (
                        <div className="bg-white dark:bg-gray-900 rounded-md mt-5 p-6">
                          <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="space-y-3">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            </div>
                          </div>
                        </div>
                      ) : addresses && addresses.length > 0 ? (
                        <div className="bg-white dark:bg-gray-900 rounded-md mt-5 border dark:border-gray-700">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <MapPin className="w-5 h-5" />
                                Dirección de Entrega
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <RadioGroup
                                value={selectedAddress?._id.toString()}
                                onValueChange={(value) => {
                                  const address = addresses.find(
                                    (addr) => addr._id.toString() === value
                                  );
                                  if (address) handleAddressSelect(address);
                                }}
                              >
                                {addresses?.map((address) => (
                                  <div
                                    key={address?._id}
                                    className={`flex items-center space-x-2 mb-4 cursor-pointer p-3 rounded-lg border transition-colors ${
                                      selectedAddress?._id === address?._id
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                    }`}
                                    onClick={() => handleAddressSelect(address)}
                                  >
                                    <RadioGroupItem
                                      value={address?._id.toString()}
                                    />
                                    <Label
                                      htmlFor={`address-${address?._id}`}
                                      className="grid gap-1.5 flex-1 cursor-pointer text-gray-900 dark:text-gray-100"
                                    >
                                      <span className="font-semibold">
                                        {address?.name}
                                      </span>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {address.address}, {address.city},{" "}
                                        {address.state} {address.zip}
                                      </span>
                                      {address.default && (
                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                          Dirección predeterminada
                                        </span>
                                      )}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                              <AddAddressModal
                                onAddressAdded={handleAddressAdded}
                                className="w-full mt-4"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-md mt-5 border dark:border-gray-700">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <MapPin className="w-5 h-5" />
                                Dirección de Entrega
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center py-8">
                              <p className="text-gray-600 dark:text-gray-400 mb-4">
                                No tienes direcciones guardadas
                              </p>
                              <AddAddressModal
                                onAddressAdded={handleAddressAdded}
                                className="w-full"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Order Summary */}
              <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 pt-2 border-t dark:border-gray-700 shadow-lg">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg mx-4 border dark:border-gray-700">
                  <h2 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    Resumen del Pedido
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span>Subtotal</span>
                      <PriceFormatter amount={getSubTotalPrice()} />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span>Descuento</span>
                      <PriceFormatter
                        amount={getSubTotalPrice() - getTotalPrice()}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span>Envío</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {needsDelivery ? "Gratis" : "No aplica"}
                      </span>
                    </div>
                    <Separator className="dark:bg-gray-700" />
                    <div className="flex items-center justify-between font-semibold text-gray-900 dark:text-gray-100">
                      <span>Total</span>
                      <PriceFormatter
                        amount={getTotalPrice()}
                        className="font-bold"
                      />
                    </div>
                    <Button
                      className="w-full rounded-full font-semibold tracking-wide hoverEffect flex items-center gap-2"
                      size="lg"
                      disabled={loading || (needsDelivery && !selectedAddress)}
                      onClick={handleProceedToCheckout}
                    >
                      {loading ? (
                        "Procesando..."
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Continuar con el Pago
                        </>
                      )}
                    </Button>
                    {needsDelivery && !selectedAddress && (
                      <p className="text-xs text-red-600 text-center">
                        Selecciona una dirección para continuar
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyCart />
        )}
      </Container>
    </div>
  );
};

export default CartPage;
