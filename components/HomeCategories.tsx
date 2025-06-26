"use client";

import { useState } from "react";
import Title from "./Title";
import type { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Heart } from "lucide-react";

interface HomeCategoriesProps {
  categories: Category[];
  loading?: boolean;
}

const HomeCategories = ({
  categories,
  loading = false,
}: HomeCategoriesProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  console.log(categories);

  const CategorySkeleton = () => (
    <Card className="group overflow-hidden border-0 shadow-lg">
      <CardContent className="p-0">
        <div className="relative h-72 w-full">
          <Skeleton className="w-full h-full rounded-t-lg" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Skeleton className="h-6 w-3/4 bg-white/20" />
            <Skeleton className="h-4 w-1/2 bg-white/20 mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="bg-white border border-shop_light_green/20 my-10 md:my-20 p-6 lg:p-8 rounded-xl shadow-sm">
      <div className="text-center mb-8">
        <Title className="border-b pb-4 mb-6  ">
          <span className="bg-gradient-to-r from-shop_orange to-shop_dark_green bg-clip-text text-transparent">
            Nuestras Lineas de Productos
          </span>
          {/* <p className="text-sm text-gray-400"> */}
          <p className=" line-clamp-1 text-sm font-medium text-lightText">
            Explora nuestros productos destacados y las mejores ofertas
          </p>
        </Title>
      </div>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        {loading
          ? [...Array(6)].map((_, index: number) => (
              <CategorySkeleton key={index} />
            ))
          : categories && Array.isArray(categories) && categories.length > 0
            ? categories?.map((category: Category, index: number) => {
                const imageUrl = category?.image
                  ? urlFor(category.image).width(400).height(288).url()
                  : "";

                return (
                  <Link
                    key={category?._id}
                    href={`/category/${category?.slug?.current}`}
                    className="group block"
                    onMouseEnter={() =>
                      setHoveredCategory(category?._id || null)
                    }
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0 relative ">
                        <div className="relative h-72 w-full rounded-md overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={category?.title || "Category"}
                            width={400}
                            height={288}
                            className="object-cover transition-transform duration-700 group-hover:scale-105 w-full h-full"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading={index >= 3 ? "lazy" : undefined}
                            priority={index < 3}
                            onError={(e) => {
                              e.currentTarget.src = "";
                            }}
                          />

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                          {/* Hover overlay */}
                          <div
                            className={`absolute inset-0 bg-shop_orange/20 transition-opacity duration-300 ${
                              hoveredCategory === category?._id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />

                          {/* Bottom content */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-shop_orange/90 transition-colors">
                              {category?.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="text-white/90 text-sm">
                                {category?.productCount || 0} productos
                                disponibles
                              </span>
                              <div
                                className={`flex items-center justify-center w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300 ${
                                  hoveredCategory === category?._id
                                    ? "bg-shop_orange scale-110"
                                    : "group-hover:bg-white/30"
                                }`}
                              >
                                <ArrowRight className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            : null}
      </div>

      {/* Empty state */}
      {!loading &&
        (!categories ||
          !Array.isArray(categories) ||
          categories.length === 0) && (
          <div className="text-center py-12 min-h-[200px]">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay categorías disponibles
            </h3>
            <p className="text-gray-600 mb-6">
              Estamos trabajando para agregar nuevas categorías de productos.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 bg-shop_orange text-white rounded-lg hover:bg-shop_orange/90 transition-colors"
            >
              Contacta con nosotros
            </Link>
          </div>
        )}
    </section>
  );
};

export default HomeCategories;
