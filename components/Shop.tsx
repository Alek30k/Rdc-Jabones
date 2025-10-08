"use client";

import type { Category, Product } from "@/sanity.types";
import { useEffect, useState } from "react";
import Container from "./Container";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import FilterSheet from "./FilterSheet";
import { useMobile } from "@/hooks/use-mobile";
import ProductCardsLoading from "./shop/ProductCardsLoading";
import ShopLoadingSkeleton from "./shop/ShopLoadingSkeleton";
import ProductCardsLoadingMinimal from "./shop/ProductCardsLoadingMinimal";
import { normalizeText } from "@/lib/utils/normalize-text";
import { X } from "lucide-react";

interface Props {
  categories: Category[];
}

const Shop = ({ categories }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const searchQuery = searchParams?.get("search");
  const isMobile = useMobile();

  const [products, setProducts] = useState<Product[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedBrand !== null ||
    selectedPrice !== null ||
    searchQuery !== null;

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPrice(null);

    // Limpiar search query de la URL
    if (searchQuery) {
      const url = new URL(window.location.href);
      url.searchParams.delete("search");
      window.history.pushState({}, "", url.toString());
    }
  };

  const handleRemoveSearch = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    window.history.pushState({}, "", url.toString());
  };

  const fetchProducts = async (isInitial = false) => {
    if (isInitial) setInitialLoading(true);
    else setFilterLoading(true);

    try {
      let minPrice = 0;
      let maxPrice = 10000;

      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }

      const query = `
      *[_type == 'product' 
        && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
        && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
        && price >= $minPrice && price <= $maxPrice
      ] 
      | order(name asc) {
        ...,"categories": categories[]->title
      }
    `;

      const data = await client.fetch(
        query,
        { selectedCategory, selectedBrand, minPrice, maxPrice },
        { next: { revalidate: 0 } }
      );

      // Aplicar filtro de búsqueda por nombre si existe
      if (searchQuery) {
        const normalizedSearch = normalizeText(searchQuery);
        const filteredData = data.filter((product: Product) => {
          const normalizedProductName = normalizeText(product.name || "");
          return normalizedProductName.includes(normalizedSearch);
        });
        setProducts(filteredData);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      if (isInitial) {
        setInitialLoading(false);
        setIsFirstLoad(false);
      } else {
        setFilterLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isFirstLoad) fetchProducts(true);
  }, []);

  useEffect(() => {
    if (!isFirstLoad) fetchProducts(false);
  }, [selectedCategory, selectedBrand, selectedPrice, searchQuery]);

  if (initialLoading) return <ShopLoadingSkeleton />;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      <Container>
        <div className="sticky top-0 z-10 mb-5 bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm py-2 transition-colors duration-300">
          <div className="flex items-center justify-between">
            {isMobile ? (
              <FilterSheet
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedPrice={selectedPrice}
                setSelectedPrice={setSelectedPrice}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={handleResetFilters}
              />
            ) : (
              hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-darkRed hoverEffect dark:text-green-300 dark:hover:text-red-400"
                  disabled={filterLoading}
                >
                  Restablecer filtros
                </button>
              )
            )}

            <div className="text-sm text-gray-600 dark:text-gray-300">
              {filterLoading
                ? "Filtrando..."
                : `${products.length} producto${products.length !== 1 ? "s" : ""} encontrado${
                    products.length !== 1 ? "s" : ""
                  }`}
            </div>
          </div>

          {/* Mostrar búsqueda activa */}
          {searchQuery && (
            <div className="mt-3 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  Buscando: <span className="font-bold">{searchQuery}</span>
                </span>
                <button
                  onClick={handleRemoveSearch}
                  className="p-0.5 hover:bg-green-100 dark:hover:bg-green-800/30 rounded transition-colors"
                  title="Quitar búsqueda"
                >
                  <X className="w-4 h-4 text-green-700 dark:text-green-400" />
                </button>
              </div>
            </div>
          )}

          {isMobile && hasActiveFilters && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCategory && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-shop_dark_green/10 dark:bg-green-700/20 text-shop_dark_green dark:text-green-300">
                  Categoría: {selectedCategory}
                </span>
              )}
              {selectedPrice && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-shop_dark_green/10 dark:bg-green-700/20 text-shop_dark_green dark:text-green-300">
                  Precio: ${selectedPrice.replace("-", " - $")}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50 dark:border-t-gray-700">
          {!isMobile && (
            <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 dark:border-r-gray-700 scrollbar-hide">
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                disabled={filterLoading}
                darkMode
              />

              <PriceList
                setSelectedPrice={setSelectedPrice}
                selectedPrice={selectedPrice}
                disabled={filterLoading}
                darkMode
              />
            </div>
          )}

          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide relative">
              {filterLoading && <ProductCardsLoadingMinimal darkMode />}

              {filterLoading ? (
                <ProductCardsLoading count={12} darkMode />
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white dark:bg-gray-900 mt-0" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
