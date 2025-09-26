"use client";

import type { Product } from "@/sanity.types"; // Tu tipo base de Sanity
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react"; // Importamos Loader2
import useStore from "@/store"; // Tu store de Zustand
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

// Define la interfaz para la personalización
export interface ProductCustomization {
  soapType?: string; // Ahora es string | undefined
  color?: string; // Ahora es string | undefined
  notes?: string; // Ahora es string | undefined
}

// Extiende el tipo Product para incluir la personalización
export interface ProductWithCustomization extends Product {
  customization?: ProductCustomization;
}

interface Props {
  product: ProductWithCustomization; // Usamos el tipo extendido aquí
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();

  const itemCount = getItemCount(product?._id, product.customization);
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = () => {
    // Validación para personalización:
    // Si la personalización está habilitada (product.customization existe)
    // y NO se ha seleccionado ni tipo de jabón NI color, entonces mostrar error.
    if (
      product.customization &&
      !product.customization.soapType &&
      !product.customization.color
    ) {
      toast.error(
        "Por favor, selecciona al menos una opción de personalización (tipo de jabón o color)."
      );
      return;
    }

    if ((product?.stock as number) > itemCount) {
      // Pasamos el producto COMPLETO, incluyendo la propiedad `customization` si existe
      addItem(product);
      let customizationText = "";
      if (product.customization) {
        if (product.customization.soapType && product.customization.color) {
          customizationText = `(${product.customization.soapType}, ${product.customization.color})`;
        } else if (product.customization.soapType) {
          customizationText = `(${product.customization.soapType})`;
        } else if (product.customization.color) {
          customizationText = `(${product.customization.color})`;
        }
      }
      toast.success(
        `${product?.name?.substring(0, 12)}... ${customizationText} añadido con éxito!`
      );
    } else {
      toast.error("No se puede añadir más de la cantidad disponible en stock.");
    }
  };

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/80">Cantidad</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full bg-white text-lightBg shadow-none border border-shop_light_green font-semibold tracking-wide text-shop_dark_green hover:bg-shop_light_green hover:text-white hoverEffect",
            className
          )}
        >
          <ShoppingBag /> {isOutOfStock ? "Agotado" : "AGREGAR AL CARRITO"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
