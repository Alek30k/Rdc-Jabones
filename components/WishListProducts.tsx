"use client";

import useStore from "@/store";
import { useState } from "react";
import Container from "./Container";
import { Heart, X, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import type { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(8);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 8, favoriteProduct.length));
  };

  const handleResetWishlist = () => {
    const confirmReset = window.confirm(
      "¿Estás segura de que quieres restablecer tu lista de favoritos?"
    );
    if (confirmReset) {
      resetFavorite();
      toast.success("La lista de favoritos se restableció correctamente");
    }
  };

  const handleRemoveItem = (product: Product) => {
    removeFromFavorite(product?._id);
    toast.success(`${product?.name} eliminado de favoritos`);
  };

  if (favoriteProduct?.length === 0) {
    return (
      <Container>
        <div className="flex min-h-[500px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-red-500/30" />
            <div className="rounded-full bg-red-50 p-6">
              <Heart className="h-16 w-16 text-red-400" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Tu lista de favoritos está vacía
            </h2>
            <p className="text-lg text-gray-600 max-w-md">
              Descubre productos increíbles y guárdalos aquí para comprarlos más
              tarde
            </p>
          </div>
          <Button asChild size="lg" className="mt-6">
            <Link href="/shop" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Explorar productos
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Favoritos</h1>
            <p className="text-gray-600 mt-1">
              {favoriteProduct.length} producto
              {favoriteProduct.length !== 1 ? "s" : ""} guardado
              {favoriteProduct.length !== 1 ? "s" : ""}
            </p>
          </div>

          {favoriteProduct.length > 0 && (
            <Button
              onClick={handleResetWishlist}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar lista
            </Button>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {favoriteProduct
                  .slice(0, visibleProducts)
                  .map((product: Product) => (
                    <tr
                      key={product?._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {product?.images && (
                              <Link href={`/product/${product?.slug?.current}`}>
                                <Image
                                  src={
                                    urlFor(product?.images[0]).url() ||
                                    "/placeholder.svg"
                                  }
                                  alt={product?.name || "Product"}
                                  width={64}
                                  height={64}
                                  className="rounded-lg object-cover hover:scale-105 transition-transform"
                                />
                              </Link>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/product/${product?.slug?.current}`}
                              className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {product?.name}
                            </Link>
                            {product?.variant && (
                              <p className="text-sm text-gray-500 mt-1 capitalize">
                                {product.variant}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product?.categories && (
                          <div className="flex flex-wrap gap-1">
                            {product.categories
                              .slice(0, 2)
                              .map((cat, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {cat.name}
                                </Badge>
                              ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            (product?.stock as number) > 0
                              ? "default"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {(product?.stock as number) > 0
                            ? "Disponible"
                            : "Agotado"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <PriceFormatter
                          amount={product?.price}
                          className="font-semibold"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(product)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <AddToCartButton
                            product={product}
                            className="h-8 px-3 text-xs"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
          {favoriteProduct.slice(0, visibleProducts).map((product: Product) => (
            <Card
              key={product?._id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    {product?.images && (
                      <Link href={`/product/${product?.slug?.current}`}>
                        <Image
                          src={
                            urlFor(product?.images[0]).url() ||
                            "/placeholder.svg"
                          }
                          alt={product?.name || "Product"}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover hover:scale-105 transition-transform"
                        />
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(product)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-md text-red-600 hover:text-red-700 hover:bg-red-50 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${product?.slug?.current}`}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {product?.name}
                    </Link>

                    {product?.categories && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.categories.slice(0, 1).map((cat, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <PriceFormatter
                        amount={product?.price}
                        className="font-semibold text-lg"
                      />
                      <Badge
                        variant={
                          (product?.stock as number) > 0
                            ? "default"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {(product?.stock as number) > 0
                          ? "Disponible"
                          : "Agotado"}
                      </Badge>
                    </div>

                    <div className="mt-3">
                      <AddToCartButton
                        product={product}
                        className="w-full h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More/Less Controls */}
        {favoriteProduct.length > 8 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            {visibleProducts < favoriteProduct.length && (
              <Button variant="outline" onClick={loadMore}>
                Cargar más productos
              </Button>
            )}
            {visibleProducts > 8 && (
              <Button onClick={() => setVisibleProducts(8)} variant="outline">
                Mostrar menos
              </Button>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default WishListProducts;
