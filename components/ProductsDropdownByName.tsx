"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Search } from "lucide-react";

const PRODUCT_NAMES = [
  "Aloe Vera",
  "Arroz",
  "Avena",
  "Calendula",
  "Carbon Activado",
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

  // Filtrar nombres por búsqueda
  const filteredNames = PRODUCT_NAMES.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-green-50"
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
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden">
            {/* Header con búsqueda */}
            <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Nuestros Jabones
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar jabón..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      href={`/search?q=${encodeURIComponent(name)}`}
                      onClick={handleNameClick}
                      className="flex items-center gap-2 px-3 py-2.5 hover:bg-green-50 rounded-lg transition-all duration-150 group"
                    >
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-600 group-hover:scale-125 transition-transform" />
                      <span className="text-sm text-gray-700 group-hover:text-green-700 font-medium truncate">
                        {name}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-gray-500 text-sm">
                    No se encontraron productos
                  </p>
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <Link
                href="/shop"
                onClick={handleNameClick}
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

export default ProductsDropdownByName;
