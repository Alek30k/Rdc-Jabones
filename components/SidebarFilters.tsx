"use client";

import { Input } from "./ui/input";
import { Package, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Category } from "@/sanity.types";
import { Card, CardContent } from "./ui/card";

interface SidebarProps {
  categories: Category[];
  currentSlug: string;
  onCategoryChange: (slug: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  handleCategoryChange: (newSlug: string) => void;
  setSearchTerm: (term: string) => void;
  setPriceRange: (range: [number, number]) => void;
}

const SidebarFilters = ({
  categories,
  currentSlug,
  searchTerm,
  setSearchTerm,
  priceRange,
  handleCategoryChange,
  setPriceRange,
}: SidebarProps) => {
  return (
    <div className="hidden md:block w-64 space-y-6">
      {/* Categorías */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Categorías
          </h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category._id}
                variant={
                  currentSlug === category.slug?.current
                    ? "destructive"
                    : "ghost"
                }
                className="w-full justify-start text-left h-auto py-2 px-3"
                onClick={() =>
                  handleCategoryChange(category.slug?.current || "")
                }
              >
                <span className="capitalize truncate">{category.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </h3>
          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Buscar producto
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Rango de precio
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ✅ Evita renders innecesarios
export default SidebarFilters;
