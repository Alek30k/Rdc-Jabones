"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product } from "@/sanity.types";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { searchProducts } from "@/sanity/queriesSearch";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce search para el dropdown
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoading(true);
        try {
          const searchResults = await searchProducts(query);
          setResults(searchResults.slice(0, 5)); // Solo mostrar 5 en el dropdown
          setIsOpen(true);
        } catch (error) {
          console.error("Error searching products:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      // Redirigir a la página de resultados
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar el regalo perfecto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Buscando...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug?.current}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {product.images?.[0] && (
                    <Image
                      src={
                        urlFor(product.images[0]).url() || "/placeholder.svg"
                      }
                      alt={product.name || "Product"}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>
                </Link>
              ))}

              {/* Ver todos los resultados */}
              <div className="border-t border-gray-100 mt-2">
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors text-left"
                >
                  Ver todos los resultados para{" "}
                  <p className="font-bold text-shop_light_green">{query}</p> →
                </button>
              </div>
            </div>
          ) : query.trim().length > 2 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No se encontraron productos</p>
              <button
                onClick={handleSearch}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Buscar en todos los productos →
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
