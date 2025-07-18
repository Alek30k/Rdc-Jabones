"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { ArrowRight, Loader2 } from "lucide-react";
import Container from "./Container";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constants/data";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");

  // Nuevo estado para controlar el número de productos a mostrar
  const [productsToShow, setProductsToShow] = useState(10);

  const router = useRouter();

  // La consulta de Sanity ahora trae todos los productos relevantes (sin límite)
  const query = `*[_type == "product" && variant == $variant] | order(name asc){
  ...,"categories": categories[]->title
}`;

  const params = { variant: selectedTab.toLowerCase() };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);
        setProducts(await response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);

  // Nuevo useEffect para detectar el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      // Define el breakpoint para dispositivos móviles (ej. 768px para tabletas/móviles)
      if (window.innerWidth < 768) {
        setProductsToShow(6); // 6 productos para móviles
      } else {
        setProductsToShow(10); // 8 productos para escritorio
      }
    };

    // Llama a handleResize al montar el componente y al redimensionar la ventana
    handleResize(); // Establece el valor inicial
    window.addEventListener("resize", handleResize);

    // Limpia el event listener al desmontar el componente
    return () => window.removeEventListener("resize", handleResize);
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar

  // Filtra los productos antes de renderizarlos
  const displayedProducts = products.slice(0, productsToShow);

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>El producto se está cargando...</span>
          </motion.div>
        </div>
      ) : displayedProducts?.length ? ( // Usa displayedProducts aquí
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
          <>
            {displayedProducts?.map(
              (
                product // Itera sobre displayedProducts
              ) => (
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
              )
            )}
          </>
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
      <div className="text-center">
        <Button
          onClick={() => router.push("/shop")}
          size="lg"
          className="bg-gray-100 text-xs sm:px-3 sm:py-1.5 sm:text-sm md:px-6 md:py-2 text-gray-600 cursor-pointer  shadow-xl  hover:bg-white hover:border-shop_light_green hover:text-shop_light_green hoverEffect border border-shop_light_green/30 px-12 py-4 font-semibold rounded-full mt-5"
        >
          Ver todos los productos
          <ArrowRight className="ml-3 w-6 h-6" />
        </Button>
      </div>
    </Container>
  );
};

export default ProductGrid;
