import type { Product } from "@/sanity.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Weight,
  Package,
  Leaf,
  Droplets,
  Heart,
  Sparkles,
  Clock,
  Shield,
  Info,
  LeafIcon,
  CheckCircle,
} from "lucide-react";

const ProductCharacteristics = ({
  product,
}: {
  product: Product | null | undefined;
}) => {
  if (!product) return null;

  // Función para obtener el icono según el tipo de característica
  const getCharacteristicIcon = (type: string) => {
    switch (type) {
      case "weight":
        return <Weight className="w-4 h-4 text-blue-600" />;
      case "quantity":
        return <Package className="w-4 h-4 text-green-600" />;
      case "category":
        return <Leaf className="w-4 h-4 text-emerald-600" />;
      case "fragrance":
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case "skin":
        return <Heart className="w-4 h-4 text-pink-600" />;
      case "ph":
        return <Droplets className="w-4 h-4 text-cyan-600" />;
      case "curing":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "benefits":
        return <LeafIcon className="w-4 h-4 text-red-600" />;
      case "certification":
        return <Shield className="w-4 h-4 text-indigo-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  // Nueva función para formatear el texto del ingrediente
  const formatIngredientText = (text: string) => {
    const parts = text.split(":");
    if (parts.length > 1) {
      const boldPart = parts[0];
      const rest = parts.slice(1).join(":"); // Une el resto por si hay más de un ':'
      return (
        <>
          <span className="font-bold">{boldPart}:</span>
          {rest}
        </>
      );
    }
    return text; // Si no hay ':', devuelve el texto original
  };

  // Características del producto con valores por defecto para jabones
  const characteristics = [
    {
      type: "weight",
      label: "Peso",
      value: product.weight ? `${product.weight} g` : "100 g",
      description: "Peso neto del jabón",
    },
    {
      type: "quantity",
      label: "Cantidad",
      value: product.quantity || "1 unidad",
      description: "Unidades incluidas",
    },
    {
      type: "category",
      label: "Categoría",
      value:
        product.categories?.[0]?.title || product.variant || "Jabón Artesanal",
      description: "Tipo de jabón",
    },
    {
      type: "fragrance",
      label: "Fragancia",
      value: product.fragrance || "Natural",
      description: "Aroma característico",
    },
    {
      type: "skin",
      label: "Tipo de Piel",
      value: product.skinType || "Todo tipo de piel",
      description: "Piel recomendada",
    },
    {
      type: "benefits",
      label: "Beneficios",
      value: product.benefits || "N/A",
      description: "Beneficios del producto",
    },
  ];

  // Ingredientes principales
  const mainIngredients = product.ingredients || [
    "Aceite de Oliva: Nutritivo e hidratante",
    "Aceite de Coco: Limpiador y espumoso",
    "Manteca de Karité: Suavizante y protectora",
    "Hidróxido de Sodio: Agente saponificador",
  ];

  // Función para renderizar valores que pueden ser arrays o strings
  const renderCharacteristicValue = (value: unknown) => {
    if (!value) return "N/A";

    // Si es un array (como benefits)
    if (Array.isArray(value)) {
      if (value.length === 0) return "N/A";

      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-800">{item}</span>
            </div>
          ))}
        </div>
      );
    }

    // Si es un string normal
    return <p className="font-medium text-gray-800">{value}</p>;
  };

  return (
    <div className="space-y-4 ">
      <Accordion type="single" collapsible className="w-full ">
        {/* Características Principales */}
        <AccordionItem
          value="characteristics"
          className="border rounded-lg px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">
                Características del Producto
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characteristics.map((char, index) => (
                <div
                  key={index}
                  className="flex  items-center p-3 bg-green-50 rounded-lg border border-green-200 transition-colors gap-5 "
                >
                  {getCharacteristicIcon(char.type)}
                  <div className="flex items-center justify-center ">
                    <div className="flex flex-col items-center ">
                      <p className="font-medium text-gray-900">{char.label}</p>
                      <p className="text-xs text-gray-500">
                        {char.description}
                      </p>
                      <div className="max-w-xs">
                        {renderCharacteristicValue(char.value)}
                      </div>{" "}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            {/* Estado del Stock */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Disponibilidad</p>
                  <p className="text-xs text-green-700">
                    Estado actual del inventario
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  (product.stock as number) > 0 ? "default" : "destructive"
                }
                className="px-3 py-1"
              >
                {(product.stock as number) > 0
                  ? `${product.stock} disponibles`
                  : "Agotado"}
              </Badge>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Ingredientes */}
        <AccordionItem
          value="ingredients"
          className="border rounded-lg px-4 mt-2 mb-2"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Ingredientes Principales</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">
                Nuestros jabones están elaborados con ingredientes naturales:
              </p>
              {product.ingredients ? (
                <>
                  {product.ingredients.map((ingrediente, index) => (
                    <div className="flex gap-4" key={index}>
                      <span>✨</span>
                      <p className="text-gray-700 tracking-tight text-lg leading-relaxed whitespace-pre-line">
                        {formatIngredientText(ingrediente)}
                      </p>{" "}
                    </div>
                  ))}
                </>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {mainIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-green-50 rounded-md"
                    >
                      <Droplets className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800 font-medium">
                        {formatIngredientText(ingredient)}{" "}
                        {/* Y aquí también */}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <span></span>
      </Accordion>
    </div>
  );
};

export default ProductCharacteristics;
