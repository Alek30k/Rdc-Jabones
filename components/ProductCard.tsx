"use client"; // ¡Importante! Este componente debe ser un Client Component

import { useState } from "react";
import type { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Flame, Eye } from "lucide-react"; // Importamos el icono Eye
import ProductSideMenu from "./ProductSideMenu";
import Title from "./Title";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";
import QuickViewModal from "./quick-view-modal";

const ProductCard = ({ product }: { product: Product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <div className="text-sm border border-darkBlue/20 rounded-md group bg-white overflow-hidden relative">
      {/* Contenedor de la imagen y efectos de hover */}
      <div className="relative group overflow-hidden bg-shop_light_bg">
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).url() || "/placeholder.svg"}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-48 sm:h-56 md:h-64 object-cover overflow-hidden transition-transform bg-shop_light_bg duration-500 
              ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
            />
          </Link>
        )}

        {/* Botón de Vista Rápida */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-black/70 text-white py-2 text-center 
          transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out
          flex items-center justify-center gap-2 cursor-pointer`}
          onClick={() => setIsQuickViewOpen(true)}
        >
          <Eye className="h-4 w-4" />
          <span>Vista Rápida</span>
        </div>

        <ProductSideMenu product={product} />

        {product?.status === "sale" ? (
          <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 py-1 rounded-full group-hover:border-lightGreen hover:text-shop_dark_green hoverEffect bg-white/90">
            Sale!
          </p>
        ) : (
          <Link
            href={"/deal"}
            className="absolute top-2 left-2 z-10 border border-shop_orange/50 p-1 rounded-full group-hover:border-shop_orange hover:text-shop_dark_green hoverEffect bg-white/90"
          >
            <Flame
              size={16}
              fill="#fb6c08"
              className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
            />
          </Link>
        )}
      </div>

      {/* Contenido de la tarjeta (nombre, precio, botón añadir al carrito) */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 ">
        <Title className="text-sm sm:text-base line-clamp-1 leading-tight ">
          {product?.name}
        </Title>
        <div className="flex flex-col gap-2 sm:gap-3">
          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-base sm:text-lg"
          />
          <AddToCartButton
            product={product}
            className="w-full sm:w-auto sm:max-w-[144px] rounded-full text-sm py-2 px-4"
          />
        </div>
      </div>

      {/* Modal de Vista Rápida */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
};

export default ProductCard;
