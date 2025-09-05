"use client";

import type { Category, Product } from "@/sanity.types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { client } from "@/sanity/lib/client";
import { Search, SlidersHorizontal } from "lucide-react";

import ProductList from "./ProductList";
import SidebarFilters from "./SidebarFilters";

interface Props {
  categories: Category[];
  slug: string;
}

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";
type ViewMode = "grid" | "list";

const CategoryProducts = ({ categories, slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode] = useState<ViewMode>("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const router = useRouter();

  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    setCurrentPage(1);
    setSearchTerm("");
    router.push(`/category/${newSlug}`, { scroll: false });
  };

  const fetchProducts = async (categorySlug: string) => {
    setLoading(true);
    try {
      const query = `
        *[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc){
          ...,
          "categories": categories[]->title
        }
      `;
      const data = await client.fetch(query, { categorySlug });
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesPrice =
        (product.price || 0) >= priceRange[0] &&
        (product.price || 0) <= priceRange[1];
      return matchesSearch && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        case "newest":
          return (
            new Date(b._createdAt || "").getTime() -
            new Date(a._createdAt || "").getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, sortBy, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentCategory = categories.find(
    (cat) => cat.slug?.current === currentSlug
  );

  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, priceRange]);

  return (
    <div className="space-y-6">
      {/* Mobile Category Selector */}
      <div className="md:hidden">
        <Select value={currentSlug} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category._id}
                value={category.slug?.current || ""}
              >
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <SidebarFilters
          categories={categories}
          currentSlug={currentSlug}
          onCategoryChange={handleCategoryChange}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchChange={setSearchTerm}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          handleCategoryChange={handleCategoryChange}
          setPriceRange={setPriceRange}
        />

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Header with controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-shop_light_green capitalize">
                {currentCategory?.title || "Productos"}
              </h2>
              <p className="text-sm text-gray-600">
                {loading
                  ? "Cargando productos..."
                  : `${filteredAndSortedProducts.length} producto${filteredAndSortedProducts.length !== 1 ? "s" : ""} encontrado${filteredAndSortedProducts.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtros
              </Button>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Nombre A-Z</SelectItem>
                  <SelectItem value="name-desc">Nombre Z-A</SelectItem>
                  <SelectItem value="price-asc">Precio menor</SelectItem>
                  <SelectItem value="price-desc">Precio mayor</SelectItem>
                  <SelectItem value="newest">Más recientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <Card className="md:hidden">
              <CardContent className="p-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Precio min"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Precio max"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Products Grid/List */}
          <div className="min-h-[400px]">
            <ProductList
              products={paginatedProducts}
              currentSlug={currentSlug}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              viewMode={viewMode}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
