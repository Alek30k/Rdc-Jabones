"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Grid3X3,
  Package,
  Sparkles,
  Heart,
  Gift,
  Leaf,
  Baby,
} from "lucide-react";
import { getCategories } from "@/sanity/queries";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  description?: string;
  productCount?: number;
  href: string;
}

const categorias = await getCategories();

console.log(categorias);

// Datos de ejemplo - reemplaza con tus categorías reales
const categories: Category[] = [
  {
    id: categorias[0]._id,
    name: "Jabones Artesanales",
    slug: "jabones-artesanales",
    href: `/category/${categorias[0].slug?.current}`,
    icon: <Leaf className="w-4 h-4" />,
    description: "Hechos a mano con ingredientes naturales",
    productCount: categorias[0].productCount || 25,
  },
  {
    id: "2",
    name: "Jabones Premium",
    slug: "jabones-premium",
    href: `/category/premium`,
    icon: <Sparkles className="w-4 h-4" />,
    description: "Fórmulas exclusivas y aceites esenciales",
    productCount: 0,
  },
  {
    id: "3",
    name: "Sets de Regalo",
    slug: "sets-regalo",
    href: `/category/${categorias[5].slug?.current}`,
    icon: <Gift className="w-4 h-4" />,
    description: "Perfectos para regalar",
    productCount: categorias[5].productCount || 10,
  },
  {
    id: "4",
    name: "Cuidado Facial",
    slug: "cuidado-facial",
    href: `/category/${categorias[2].slug?.current}`,
    icon: <Heart className="w-4 h-4" />,
    description: "Especiales para el rostro",
    productCount: categorias[2].productCount || 15,
  },
  {
    id: "5",
    name: "Jabones Corporales",
    slug: "jabones-corporales",
    href: `/category/${categorias[4].slug?.current}`,
    icon: <Package className="w-4 h-4" />,
    description: "Para el cuidado del cuerpo",
    productCount: categorias[4].productCount || 30,
  },
  {
    id: "6",
    name: "Jabones Infantiles",
    slug: "jabones-infantiles",
    href: `/category/${categorias[3].slug?.current}`,
    icon: <Baby className="w-4 h-4" />,
    description: "Suaves y humectantes para los más pequeños",
    productCount: categorias[3].productCount || 20,
  },
];

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
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
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Grid3X3 className="w-4 h-4" />
        Categorías
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              Explorar por categoría
            </h3>
          </div>

          {/* Categories List */}
          <div className="py-2 max-h-96 overflow-y-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 group-hover:text-orange-400 transition-colors duration-200">
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                      {category.name}
                    </h4>
                    {category.productCount && (
                      <span className="text-xs text-gray-500 bg-gray-100 group-hover:text-orange-400 px-2 py-1 rounded-full">
                        {category.productCount}
                      </span>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Ver todas las categorías →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
