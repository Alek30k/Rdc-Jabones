"use client";

import type { Category, Product } from "@/sanity.types";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useTransition,
} from "react";
import { client } from "@/sanity/lib/client";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, Package } from "lucide-react";
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
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import ProductsGridLoading from "./category/ProductsGridLoading";
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
type LoadingType = "luxury" | "bubbles" | "minimal" | "skeleton";

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
  const [loadingType] = useState<LoadingType>("skeleton");
  const [isPending, startTransition] = useTransition();
  const itemsPerPage = 12;

  const router = useRouter();

  // Optimized category change handler - batches all state updates
  const handleCategoryChange = useCallback(
    (newSlug: string) => {
      if (newSlug === currentSlug) return;

      // Batch all state updates in a single transition
      startTransition(() => {
        setCurrentSlug(newSlug);
        setCurrentPage(1);
        setSearchTerm("");
      });

      // Navigate without causing additional re-renders
      router.push(`/category/${newSlug}`, { scroll: false });
    },
    [currentSlug, router]
  );

  const fetchProducts = useCallback(async (categorySlug: string) => {
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
  }, []);

  // Filter and sort products - memoized to prevent unnecessary recalculations
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

  // Pagination - memoized
  const { totalPages, paginatedProducts } = useMemo(() => {
    const total = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const paginated = filteredAndSortedProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    return { totalPages: total, paginatedProducts: paginated };
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  const currentCategory = useMemo(
    () => categories.find((cat) => cat.slug?.current === currentSlug),
    [categories, currentSlug]
  );

  // Only fetch products when currentSlug changes
  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug, fetchProducts]);

  // Reset page only when filters change (not when category changes)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, sortBy, priceRange]); // Removed currentPage from dependency

  // Optimized handlers
  const handleSearchChange = useCallback((value: string) => {
    startTransition(() => {
      setSearchTerm(value);
    });
  }, []);

  const handleSortChange = useCallback((value: SortOption) => {
    startTransition(() => {
      setSortBy(value);
    });
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

  // Stable key for AnimatePresence to prevent unnecessary animations
  const animationKey = `${currentSlug}-${currentPage}`;

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
        <div className="hidden md:block w-64 space-y-6">
          {/* Categories */}
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
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Header with controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-shop_light_green capitalize">
                {currentCategory?.title || "Productos"}
              </h2>
              <p className="text-sm text-gray-600">
                {loading || isPending
                  ? "Cargando productos..."
                  : `${filteredAndSortedProducts.length} producto${filteredAndSortedProducts.length !== 1 ? "s" : ""} encontrado${filteredAndSortedProducts.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filters Toggle */}
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

              {/* Sort */}
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

          {/* Products Grid/List */}
          <div className="min-h-[400px]">
            {loading ? (
              <ProductsGridLoading type={loadingType} />
            ) : paginatedProducts.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={animationKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                        : "space-y-4"
                    }
                  >
                    {paginatedProducts.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1 || loading || isPending}
                    >
                      Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                              disabled={loading || isPending}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                      {totalPages > 5 && (
                        <span className="text-gray-500">...</span>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={
                        currentPage === totalPages || loading || isPending
                      }
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <NoProductAvailable
                selectedTab={currentSlug}
                className="mt-0 w-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
