"use client";

import type { Category } from "@/sanity.types";
import { Button } from "@/components/ui/button";

import { Filter, X } from "lucide-react";

import { useState } from "react";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface Props {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedPrice: string | null;
  setSelectedPrice: (price: string | null) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const FilterSheet = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedPrice,
  setSelectedPrice,
  hasActiveFilters,
  onResetFilters,
}: Props) => {
  const [open, setOpen] = useState(false);

  const handleResetAndClose = () => {
    onResetFilters();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 relative border-shop_dark_green text-shop_dark_green hover:bg-shop_dark_green hover:text-white"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Filtros
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetAndClose}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Filtra los productos por categoría y precio
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <PriceList
            setSelectedPrice={setSelectedPrice}
            selectedPrice={selectedPrice}
          />
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={() => setOpen(false)}
            className="w-full bg-shop_dark_green hover:bg-shop_dark_green/90"
          >
            Aplicar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
