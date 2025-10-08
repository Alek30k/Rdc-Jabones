"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Search } from "lucide-react";
import { normalizeText } from "@/lib/utils/normalize-text";

const PRODUCT_NAMES = [
  "Aloe Vera",
  "Arroz",
  "Avena",
  "Calendula",
  "Carbón Activado",
  "Coco",
  "Cúrcuma",
  "Espirulina",
  "Miel",
  "Romero",
  "Tutti Frutti",
  "Zanahoria",
];

const ProductsDropdownByName = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar nombres por búsqueda (sin tildes)
  const filteredNames = PRODUCT_NAMES.filter((name) => {
    const normalizedName = normalizeText(name);
    const normalizedSearch = normalizeText(searchTerm);
    return normalizedName.includes(normalizedSearch);
  });

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
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
        setSearchTerm("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleNameClick = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative hidden lg:block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 dark:text-gray-100 px-4 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200 rounded-lg"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="font-medium">Jabones</span>
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
          <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            {/* Header con búsqueda */}
            <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Nuestros Jabones
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar jabón..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Lista de nombres en 2 columnas */}
            <div className="max-h-96 overflow-y-auto py-2">
              {filteredNames.length > 0 ? (
                <div className="grid grid-cols-2 gap-1 px-2">
                  {filteredNames.map((name) => (
                    <Link
                      key={name}
                      href={`/shop?search=${encodeURIComponent(name)}`}
                      onClick={handleNameClick}
                      className="flex items-center gap-2 px-3 py-2.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-150 group"
                    >
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-600 group-hover:scale-125 transition-transform" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400 font-medium truncate">
                        {name}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No se encontraron productos
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
              <Link
                href="/shop"
                onClick={handleNameClick}
                className="flex items-center justify-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
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

export default ProductsDropdownByName;
