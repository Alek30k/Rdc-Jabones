"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constants/data";
import type { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

// Importar los componentes de loading
import ProductGridLoadingSkeleton from "./product-grid/ProductGridLoadingSkeleton";
import ProductGridLoadingBubbles from "./product-grid/ProductGridLoadingBubbles";
import ProductGridLoadingMinimal from "./product-grid/ProductGridLoadingMinimal";
import ProductGridLoadingLuxury from "./product-grid/ProductGridLoadingLuxury";

type LoadingType = "skeleton" | "bubbles" | "minimal" | "luxury";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
  const [productsToShow, setProductsToShow] = useState(10);

  // Configurar el tipo de loading (puedes cambiar esto)
  const [loadingType] = useState<LoadingType>("skeleton");

  const router = useRouter();

  const query = useMemo(
    () =>
      `*[_type == "product" && variant == $variant] | order(name asc){
      ...,"categories": categories[]->title
    }`,
    []
  );

  const params = useMemo(
    () => ({ variant: selectedTab.toLowerCase() }),
    [selectedTab]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);
        setProducts(response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, params]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setProductsToShow(8);
      } else {
        setProductsToShow(10);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayedProducts = products.slice(0, productsToShow);

  // Renderizar el componente de loading apropiado
  const renderLoadingComponent = () => {
    switch (loadingType) {
      case "skeleton":
        return <ProductGridLoadingSkeleton />;
      case "bubbles":
        return <ProductGridLoadingBubbles />;
      case "minimal":
        return <ProductGridLoadingMinimal />;
      case "luxury":
        return <ProductGridLoadingLuxury />;
      default:
        return <ProductGridLoadingLuxury />;
    }
  };

  // Si está cargando, mostrar el componente de loading
  if (loading) {
    return renderLoadingComponent();
  }

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />

      {displayedProducts?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
          {displayedProducts?.map((product) => (
            <AnimatePresence key={product?._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCard key={product?._id} product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}

      <div className="text-center">
        <Button
          onClick={() => router.push("/shop")}
          size="lg"
          className="bg-gray-100 text-xs sm:px-3 sm:py-1.5 sm:text-sm md:px-6 md:py-2 text-gray-600 cursor-pointer shadow-xl hover:bg-white hover:border-shop_light_green hover:text-shop_light_green hoverEffect border border-shop_light_green/30 px-12 py-4 font-semibold rounded-full mt-5"
        >
          Ver todos los productos
          <ArrowRight className="ml-3 w-6 h-6" />
        </Button>
      </div>
    </Container>
  );
};

export default ProductGrid;
