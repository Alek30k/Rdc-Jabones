"use client";

import type { Category, Product } from "@/sanity.types";
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useTransition,
} from "react";
import { client } from "@/sanity/lib/client";
import { Search, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import NoProductAvailable from "./NoProductAvailable";
import ProductsGridLoading from "./category/ProductsGridLoading";
import SidebarFilters from "./SidebarFilters";
import ProductList from "./ProductList";
import Container from "./Container";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";
type ViewMode = "grid" | "list";
type LoadingType = "luxury" | "bubbles" | "minimal" | "skeleton";

interface Props {
  categories: Category[];
}

const ShopProducts = ({ categories }: Props) => {
  // Estados principales
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode] = useState<ViewMode>("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingType] = useState<LoadingType>("skeleton");
  const [isPending, startTransition] = useTransition();
  const [currentSlug, setCurrentSlug] = useState<string | null>(null); // ← estado de categoría
  const itemsPerPage = 12;

  // 🔍 Fetch de productos con filtro opcional de categoría
  const fetchProducts = useCallback(
    async (categorySlug: string | null = null) => {
      setLoading(true);
      try {
        const query = `
        *[_type == "product"
          ${`${
            categorySlug
              ? `&& references(*[_type == "category" && slug.current == $categorySlug]._id)`
              : ""
          }`}
        ] | order(name asc) {
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
    },
    []
  );

  // ⚡ Cargar productos cuando cambie categoría
  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug, fetchProducts]);

  // 🔄 Handlers
  const handleCategoryChange = useCallback(
    (newSlug: string) => {
      startTransition(() => {
        setCurrentSlug(newSlug === currentSlug ? null : newSlug);
        setCurrentPage(1);
        setSearchTerm("");
      });
    },
    [currentSlug]
  );

  const handleSearchChange = useCallback((value: string) => {
    startTransition(() => setSearchTerm(value));
  }, []);

  const handleSortChange = useCallback((value: SortOption) => {
    startTransition(() => setSortBy(value));
  }, []);

  const handlePriceRangeChange = useCallback((index: 0 | 1, value: number) => {
    startTransition(() => {
      setPriceRange((prev) => {
        const newRange: [number, number] = [...prev];
        newRange[index] = value;
        return newRange;
      });
    });
  }, []);

  // 🔎 Filtrado y ordenamiento
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesPrice =
        (product.price || 0) >= priceRange[0] &&
        (product.price || 0) <= priceRange[1];
      return matchesSearch && matchesPrice;
    });

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

  // 🔢 Paginación
  const { totalPages, paginatedProducts } = useMemo(() => {
    const total = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const paginated = filteredAndSortedProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    return { totalPages: total, paginatedProducts: paginated };
  }, [filteredAndSortedProducts, currentPage]);

  return (
    <Container className="bg-shop-light-pink">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="hidden md:block w-64 space-y-6">
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
            />
          </div>

          {/* Main Section */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-shop_light_green">
                  {currentSlug
                    ? categories.find(
                        (cat) => cat.slug?.current === currentSlug
                      )?.title
                    : "Todos los productos"}
                </h2>
                <p className="text-sm text-gray-600">
                  {loading || isPending
                    ? "Cargando productos..."
                    : `${filteredAndSortedProducts.length} producto${filteredAndSortedProducts.length !== 1 ? "s" : ""} encontrado${filteredAndSortedProducts.length !== 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden bg-transparent"
                  onClick={() => setShowFilters(!showFilters)}
                  disabled={loading || isPending}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtros
                </Button>

                <Select
                  value={sortBy}
                  onValueChange={handleSortChange}
                  disabled={loading || isPending}
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
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Precio min"
                      value={priceRange[0]}
                      onChange={(e) =>
                        handlePriceRangeChange(0, Number(e.target.value))
                      }
                      disabled={loading}
                    />
                    <Input
                      type="number"
                      placeholder="Precio max"
                      value={priceRange[1]}
                      onChange={(e) =>
                        handlePriceRangeChange(1, Number(e.target.value))
                      }
                      disabled={loading}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Product Grid */}
            <div className="min-h-[400px]">
              {loading ? (
                <ProductsGridLoading type={loadingType} />
              ) : paginatedProducts.length > 0 ? (
                <ProductList
                  products={paginatedProducts}
                  currentSlug={currentSlug || ""}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  viewMode={viewMode}
                  loading={loading}
                />
              ) : (
                <NoProductAvailable className="mt-0 w-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ShopProducts;
