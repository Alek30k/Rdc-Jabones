"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import RelatedProducts from "@/components/RelatedProduct";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/sanity.types";
import { getProductBySlug, getRelatedProducts } from "@/sanity/queries";
import Link from "next/link";
import BreadcrumbComponent from "@/components/Breadcrumb";
import {
  artificialSoapColors,
  naturalSoapColors,
  soapTypes,
} from "@/constants/data";
import DescriptionPerfect from "@/components/DescriptionPerfect";
import SoapLoadingBubbles from "@/components/SoapLoadingBubbles";

const SingleProductPage = ({ params }: { params: { slug: string } }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para la personalización
  const [isCustomizationEnabled, setIsCustomizationEnabled] = useState(false);
  const [isCustomizationEnabledColor, setIsCustomizationEnabledColor] =
    useState(false);
  const [isColorCustomizationEnabled, setIsColorCustomizationEnabled] =
    useState(false);
  const [selectedSoapType, setSelectedSoapType] = useState<string | undefined>(
    undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );
  const [customizationNotes, setCustomizationNotes] = useState<string>("");

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      const fetchedProduct = await getProductBySlug(params.slug);
      if (!fetchedProduct) {
        console.log("Producto no encontrado, retornando notFound().");
        setProduct(null);
        setLoading(false);
        return;
      }
      setProduct(fetchedProduct);

      const categoryIds =
        fetchedProduct.categories?.map((cat) => cat._ref) || [];
      let fetchedRelatedProducts: Product[] = [];
      if (categoryIds.length > 0) {
        fetchedRelatedProducts = await getRelatedProducts(
          categoryIds,
          fetchedProduct.slug.current
        );
      } else {
        console.log("No hay categoryIds para buscar productos relacionados.");
      }
      setRelatedProducts(fetchedRelatedProducts);
      setLoading(false);
    };
    fetchProductData();
  }, [params.slug]);

  // Efecto para resetear la personalización de color si la personalización general se deshabilita
  useEffect(() => {
    if (!isCustomizationEnabled) {
      setIsColorCustomizationEnabled(false);
      setSelectedSoapType(undefined);
      setSelectedColor(undefined);
      setCustomizationNotes("");
    }
  }, [isCustomizationEnabled]);

  // Efecto para resetear el color seleccionado si la personalización de color se deshabilita
  useEffect(() => {
    if (!isColorCustomizationEnabled) {
      setSelectedColor(undefined);
    }
  }, [isColorCustomizationEnabled]);

  // Mostrar loading creativo
  if (loading) {
    return <SoapLoadingBubbles />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
        <p className="text-gray-600 mb-6">
          Lo sentimos, el producto que buscas no existe o ha sido eliminado.
        </p>
        <Link href="/shop">
          <Button className="bg-shop_orange hover:bg-shop_orange/90 text-white">
            Volver a la tienda
          </Button>
        </Link>
      </div>
    );
  }

  // Construye el objeto de personalización para pasar al AddToCartButton
  const productWithCustomization = {
    ...product,
    customization:
      isCustomizationEnabled || isCustomizationEnabledColor
        ? {
            soapType: isCustomizationEnabled ? selectedSoapType : undefined,
            color: isCustomizationEnabledColor ? selectedColor : undefined,
            notes:
              isCustomizationEnabled || isCustomizationEnabledColor
                ? customizationNotes
                : "",
          }
        : undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Breadcrumb Section */}
      <BreadcrumbComponent product={product} />

      {/* Contenedor principal de la página del producto */}
      <Container className="flex p-4 flex-col md:flex-row gap-10 py-10">
        {/* Columna Izquierda: Imagen */}
        <div className="w-full md:w-3/4 flex flex-col gap-10">
          {product?.images && (
            <ImageView images={product?.images} isStock={product?.stock} />
          )}
        </div>

        {/* Columna Derecha: Detalles del Producto, Precio, CTA, etc. */}
        <div className="w-full md:w-1/2 p-4 flex flex-col gap-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{product?.name}</h2>
          </div>
          <div className="space-y-2 border-t border-b border-gray-200 py-5">
            <PriceView
              price={product?.price}
              discount={product?.discount}
              className="text-4xl leading-3 font-extralight"
            />
            <p
              className={`px-4 py-1.5 mt-4 text-sm text-center inline-block font-semibold rounded-lg ${
                product?.stock === 0
                  ? "bg-red-100 text-red-600"
                  : "text-green-600 bg-green-100"
              }`}
            >
              {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
            </p>

            {/* Sección de Personalización de Jabón */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <Label
                  htmlFor="personalizar-jabon"
                  className={
                    !isCustomizationEnabled
                      ? "text-base font-semibold text-gray-500"
                      : "text-base font-semibold "
                  }
                >
                  Personalizar Jabón
                </Label>
                <Switch
                  id="personalizar-jabon"
                  checked={isCustomizationEnabled}
                  onCheckedChange={setIsCustomizationEnabled}
                  className="data-[state=checked]:bg-shop_orange"
                />
              </div>

              {/* Contenedor para las opciones de personalización */}
              {isCustomizationEnabled && (
                <>
                  <div className="space-y-4 mt-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-base font-medium">
                          Elige tu tipo de jabón
                        </AccordionTrigger>
                        <AccordionContent>
                          <RadioGroup
                            value={selectedSoapType || ""}
                            onValueChange={setSelectedSoapType}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
                          >
                            {soapTypes.map((soap) => (
                              <div
                                key={soap.id}
                                className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer 
                              ${
                                selectedSoapType === soap.id
                                  ? "border-shop_orange ring-2 ring-shop_orange/50"
                                  : "border-gray-200"
                              }
                              hover:bg-gray-50`}
                                onClick={() => setSelectedSoapType(soap.id)}
                              >
                                <RadioGroupItem
                                  value={soap.id}
                                  id={`soap-${soap.id}`}
                                />
                                <Label
                                  htmlFor={`soap-${soap.id}`}
                                  className="flex flex-col cursor-pointer"
                                >
                                  <span className="font-medium">
                                    {soap.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {soap.description}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <div className="mt-6">
                    <Label
                      htmlFor="notas-personalizacion"
                      className="mb-2 block text-sm font-medium"
                    >
                      Notas adicionales para la personalización (opcional)
                    </Label>
                    <Textarea
                      id="notas-personalizacion"
                      placeholder="Ej: 'Con menos aroma', 'Para piel sensible', etc."
                      value={customizationNotes}
                      onChange={(e) => setCustomizationNotes(e.target.value)}
                      disabled={!isCustomizationEnabled}
                      className="min-h-[80px]"
                    />
                  </div>
                </>
              )}

              {/* Switch para habilitar la personalización de color */}
              <div className="flex items-center justify-between mt-6 border-t">
                <Label
                  htmlFor="personalizar-color"
                  className={
                    !isCustomizationEnabledColor
                      ? "text-base font-semibold text-gray-500 mt-6"
                      : "text-base font-semibold mt-6"
                  }
                >
                  Personaliza con tu color favorito
                </Label>
                <Switch
                  id="personalizar-color"
                  checked={isCustomizationEnabledColor}
                  onCheckedChange={setIsCustomizationEnabledColor}
                  className="data-[state=checked]:bg-shop_orange"
                />
              </div>

              {/* Acordeones de color */}
              {isCustomizationEnabledColor && (
                <>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-base font-medium">
                        Elige tu color natural
                      </AccordionTrigger>
                      <AccordionContent>
                        <RadioGroup
                          value={selectedColor || ""}
                          onValueChange={setSelectedColor}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
                          disabled={!isCustomizationEnabledColor}
                        >
                          {naturalSoapColors.map((color) => (
                            <div
                              key={color.id}
                              className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer 
                              ${
                                selectedColor === color.id
                                  ? "border-shop_orange ring-2 ring-shop_orange/50"
                                  : "border-gray-200"
                              }
                              ${
                                !isCustomizationEnabledColor
                                  ? "opacity-50 cursor-not-allowed bg-gray-100"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() =>
                                isCustomizationEnabledColor &&
                                setSelectedColor(color.id)
                              }
                            >
                              <RadioGroupItem
                                value={color.id}
                                id={`color-${color.id}`}
                              />
                              <Label
                                htmlFor={`color-${color.id}`}
                                className="flex flex-col cursor-pointer"
                              >
                                <span className="font-medium flex items-center gap-2">
                                  {color.name}
                                  <span
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: color.hex }}
                                  ></span>
                                </span>
                                <span className="text-xs text-gray-500">
                                  {color.description}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-base font-medium">
                        Elige tu color artificial
                      </AccordionTrigger>
                      <AccordionContent>
                        <RadioGroup
                          value={selectedColor || ""}
                          onValueChange={setSelectedColor}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
                          disabled={!isCustomizationEnabledColor}
                        >
                          {artificialSoapColors.map((color) => (
                            <div
                              key={color.id}
                              className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer 
                              ${
                                selectedColor === color.id
                                  ? "border-shop_orange ring-2 ring-shop_orange/50"
                                  : "border-gray-200"
                              }
                              ${
                                !isCustomizationEnabledColor
                                  ? "opacity-50 cursor-not-allowed bg-gray-100"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() =>
                                isCustomizationEnabledColor &&
                                setSelectedColor(color.id)
                              }
                            >
                              <RadioGroupItem
                                value={color.id}
                                id={`color-${color.id}`}
                              />
                              <Label
                                htmlFor={`color-${color.id}`}
                                className="flex flex-col cursor-pointer"
                              >
                                <span className="font-medium flex items-center gap-2">
                                  {color.name}
                                  <span
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: color.hex }}
                                  ></span>
                                </span>
                                <span className="text-xs text-gray-500">
                                  {color.description}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="mt-6">
                    <Label
                      htmlFor="notas-personalizacion-color"
                      className="mb-2 block text-sm font-medium"
                    >
                      Notas adicionales para la personalización (opcional)
                    </Label>
                    <Textarea
                      id="notas-personalizacion-color"
                      placeholder="Ej: 'Con menos aroma', 'Para piel sensible', etc."
                      value={customizationNotes}
                      onChange={(e) => setCustomizationNotes(e.target.value)}
                      disabled={!isCustomizationEnabledColor}
                      className="min-h-[80px]"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2.5 lg:gap-3">
            <AddToCartButton product={productWithCustomization} />
            <FavoriteButton showProduct={true} product={product} />
          </div>
          <ProductCharacteristics product={product} />
        </div>
      </Container>

      {/* Sección de Descripción con efecto MercadoLibre */}
      <Container>
        {product?.description && (
          <DescriptionPerfect
            description={product.description}
            maxLines={6}
            className="md:w-[60%]"
          />
        )}
      </Container>

      <Container className="p-4">
        <RelatedProducts products={relatedProducts} />
      </Container>
    </div>
  );
};

export default SingleProductPage;
