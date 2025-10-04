"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Search } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  discount?: number;
  images?: Array<{ asset: { _ref: string } }>;
  status?: string;
}

interface ProductsDropdownProps {
  products: Product[];
}

const ProductsDropdown = ({ products }: ProductsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar dropdown con Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calcular precio con descuento
  const calculateFinalPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  return (
    <div className="relative hidden lg:block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-green-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="font-medium">Nuestros Jabones</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer click */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden max-h-[600px] flex flex-col">
            {/* Header con búsqueda */}
            <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <h3 className="font-semibold text-green-900 mb-2">
                Nuestros Jabones
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar jabón..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Products list con scroll */}
            <div className="overflow-y-auto flex-1 py-2">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const finalPrice = calculateFinalPrice(
                    product.price,
                    product.discount
                  );
                  const hasDiscount = product.discount && product.discount > 0;
                  const imageUrl = product.images?.[0]
                    ? urlFor(product.images[0]).width(80).height(80).url()
                    : "/placeholder.svg?height=80&width=80";

                  return (
                    <Link
                      key={product._id}
                      href={`/product/${product.slug.current}`}
                      onClick={() => {
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 group"
                    >
                      {/* Imagen del producto */}
                      <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.status && (
                          <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white rounded">
                            {product.status.toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Info del producto */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-green-600">
                            ${finalPrice.toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <>
                              <span className="text-xs text-gray-400 line-through">
                                ${product.price.toFixed(2)}
                              </span>
                              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                -{product.discount}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Arrow icon */}
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0" />
                    </Link>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p className="text-sm">No se encontraron jabones</p>
                  <p className="text-xs mt-1">
                    Intenta con otro término de búsqueda
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <Link
                href="/shop"
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                className="flex items-center justify-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                Ver todos los productos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsDropdown;
