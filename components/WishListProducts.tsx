"use client";

import useStore from "@/store";
import { useState } from "react";
import Container from "./Container";
import { Heart, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();
  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
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

  return (
    <Container>
      {favoriteProduct?.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b">
                <tr className="bg-black/5">
                  <th className="p-2 text-left">Imagen</th>
                  <th className="p-2 text-left hidden md:table-cell">
                    Categoría
                  </th>
                  <th className="p-2 text-left hidden md:table-cell">Tipo</th>
                  <th className="p-2 text-left hidden md:table-cell">Estado</th>
                  <th className="p-2 text-left">Precio</th>
                  <th className="p-2 text-center md:text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProduct
                  ?.slice(0, visibleProducts)
                  ?.map((product: Product) => (
                    <tr key={product?._id} className="border-b">
                      <td className="px-0 md:px-2 py-4 flex items-center gap-2">
                        <X
                          onClick={() => {
                            removeFromFavorite(product?._id);
                            toast.success(
                              "Producto eliminado de la lista de favoritos"
                            );
                          }}
                          size={14}
                          className="hover:text-red-600 hover:cursor-pointer hoverEffect "
                        />
                        {product?.images && (
                          <Link
                            href={`/product/${product?.slug?.current}`}
                            className="border rounded-md group hidden md:inline-flex"
                          >
                            <Image
                              src={urlFor(product?.images[0]).url()}
                              alt={"product image"}
                              width={80}
                              height={80}
                              className="rounded-md group-hover:scale-105 hoverEffect h-20 w-20 object-cover"
                            />
                          </Link>
                        )}
                        <p className="line-clamp-1">{product?.name}</p>
                      </td>
                      <td className="px-0 md:px-2  capitalize hidden md:table-cell">
                        {product?.categories && (
                          <p className="uppercase line-clamp-1 text-xs font-medium">
                            {product.categories.map((cat) => cat).join(", ")}
                          </p>
                        )}
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {product?.variant}
                      </td>
                      <td
                        className={`p-2 w-24 ${
                          (product?.stock as number) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-medium text-sm hidden md:table-cell`}
                      >
                        {(product?.stock as number) > 0
                          ? "Disponible"
                          : "Agotado"}
                      </td>
                      <td className="p-2">
                        <PriceFormatter amount={product?.price} />
                      </td>
                      <td className="px-0 md:px-2 ">
                        <AddToCartButton product={product} className="w-full" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2">
            {visibleProducts < favoriteProduct?.length && (
              <div className="my-5">
                <Button variant="outline" onClick={loadMore}>
                  Cargar más
                </Button>
              </div>
            )}
            {visibleProducts > 10 && (
              <div className="my-5">
                <Button
                  onClick={() => setVisibleProducts(10)}
                  variant="outline"
                >
                  Cargar menos
                </Button>
              </div>
            )}
          </div>
          {favoriteProduct?.length > 0 && (
            <Button
              onClick={handleResetWishlist}
              className="my-5 font-semibold"
              variant="destructive"
              size="lg"
            >
              Restablecer lista de favoritos{" "}
            </Button>
          )}
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20" />
            <Heart
              className="h-12 w-12 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Tu lista de favoritos está vacía
            </h2>
            <p className="text-sm text-muted-foreground">
              Los artículos agregados a su lista de favoritos aparecerán
              aquí{" "}
            </p>
          </div>
          <Button asChild>
            <Link href="/shop">Continuar comprando</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;
