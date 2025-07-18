"use client";
import type { Category, Product } from "@/sanity.types";
import { useEffect, useState } from "react";
import Container from "./Container";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import FilterSheet from "./FilterSheet";
import { useMobile } from "@/hooks/use-mobile";

interface Props {
  categories: Category[];
}

const Shop = ({ categories }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const isMobile = useMobile();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedBrand !== null ||
    selectedPrice !== null;

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPrice(null);
  };

  const fetchProducts = async () => {
    setLoading(true);
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
      setProducts(data);
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, selectedPrice]);

  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5 bg-white/95 backdrop-blur-sm py-2">
          <div className="flex items-center justify-between">
            {/* Mobile Filter Button */}
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
                  className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-darkRed hoverEffect"
                >
                  Restablecer filtros
                </button>
              )
            )}

            {/* Results count */}
            <div className="text-sm text-gray-600">
              {loading
                ? "Cargando..."
                : `${products.length} producto${products.length !== 1 ? "s" : ""} encontrado${products.length !== 1 ? "s" : ""}`}
            </div>
          </div>

          {/* Active filters indicator for mobile */}
          {isMobile && hasActiveFilters && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCategory && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-shop_dark_green/10 text-shop_dark_green">
                  Categoría: {selectedCategory}
                </span>
              )}
              {selectedPrice && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-shop_dark_green/10 text-shop_dark_green">
                  Precio: ${selectedPrice.replace("-", " - $")}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
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
          )}

          {/* Products Grid */}
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                  <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    El producto se está cargando . . .
                  </p>
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
