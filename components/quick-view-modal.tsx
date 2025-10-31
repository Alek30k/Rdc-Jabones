"use client";

import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  if (!product) return null;

  const imageUrl =
    product.images && product.images.length > 0
      ? urlFor(product.images[0]).url()
      : "/placeholder.svg";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 max-h-[90vh]  overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 rounded-full bg-white hover:bg-white border border-shop_light_green"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-orange-400" />
          <span className="sr-only">Cerrar</span>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Columna de la imagen */}
          <div className="relative h-64 md:h-auto min-h-[250px] bg-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }} // Cambiado a 'contain' para que la imagen se vea completa
              className="p-4" // Añade padding para que la imagen no toque los bordes
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority // Carga la imagen con prioridad
            />
          </div>

          {/* Columna de detalles del producto */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold  mb-2">
                {product.name}
              </DialogTitle>
              {product?.description && (
                <p className="text-sm  line-clamp-4">{product?.description}</p>
              )}
            </DialogHeader>

            <div className="space-y-4">
              <PriceView
                price={product.price}
                discount={product.discount}
                className="text-2xl font-bold text-gray-900"
              />
              {product.stock === 0 && (
                <p className="text-red-500 text-sm font-semibold">Agotado</p>
              )}
              <AddToCartButton
                product={product}
                className="w-full rounded-full text-base py-3"
              />
              <Link
                href={`/product/${product.slug?.current}`}
                className="block text-center text-sm text-shop_orange hover:underline mt-2"
              >
                Ver detalles completos del producto
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
