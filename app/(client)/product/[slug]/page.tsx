import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import ProductPromotions from "@/components/ProductPromotions";
import RelatedProducts from "@/components/RelatedProduct";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getProductBySlug, getRelatedProducts } from "@/sanity/queries";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    console.log("Producto no encontrado, retornando notFound().");
    return notFound();
  }

  // Extraer los IDs de todas las categorías del producto actual
  // USAR cat._ref, que es lo que tu console.log muestra que recibes
  const categoryIds = product.categories?.map((cat) => cat._ref) || [];

  // Obtener productos relacionados si hay IDs de categoría
  let relatedProducts = [];
  if (categoryIds.length > 0) {
    relatedProducts = await getRelatedProducts(
      categoryIds,
      product.slug.current
    );
  } else {
    console.log("No hay categoryIds para buscar productos relacionados.");
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Breadcrumb Section */}
      <div className="bg-white border-b">
        <Container className="">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Inicio
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/shop"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Productos
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="text-gray-900 font-medium line-clamp-1">
                    {product?.name}
                  </span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex"
            >
              <Link href="/shop" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver a productos
              </Link>
            </Button>
          </div>
        </Container>
      </div>

      {/* Contenedor principal de la página del producto */}
      <Container className="flex p-4 flex-col md:flex-row gap-10 py-10">
        {/* Columna Izquierda: Imagen y Descripción */}
        <div className="w-full md:w-3/4 flex flex-col gap-10">
          {product?.images && (
            <ImageView images={product?.images} isStock={product?.stock} />
          )}
        </div>

        {/* Columna Derecha: Detalles del Producto, Precio, CTA, etc. */}
        <div className="w-full md:w-1/2 p-4 flex flex-col gap-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{product?.name}</h2>
          </div>

          <div className="space-y-2 border-t border-b border-gray-200 py-5">
            <PriceView
              price={product?.price}
              discount={product?.discount}
              className="text-4xl leading-3 font-extralight"
            />
            <p
              className={`px-4 py-1.5 mt-4 text-sm text-center inline-block font-semibold rounded-lg ${product?.stock === 0 ? "bg-red-100 text-red-600" : "text-green-600 bg-green-100"}`}
            >
              {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
            </p>
            {product?.price && (
              <ProductPromotions
                basePrice={product.price}
                shippingCost={1234} // Ejemplo: Pasa el costo de envío real si lo tienes
                pickupCost={8953.99} // Ejemplo: Pasa el costo de retiro real
                pickupOriginalCost={9443.99} // Ejemplo: Pasa el costo original de retiro
              />
            )}{" "}
          </div>

          <div className="flex items-center gap-2.5 lg:gap-3">
            <AddToCartButton product={product} />
            <FavoriteButton showProduct={true} product={product} />
          </div>

          <ProductCharacteristics product={product} />
        </div>
      </Container>

      {/* --- Sección de Descripción (ahora dentro de la columna de la imagen) --- */}
      <Container>
        {product?.description && (
          <div className="bg-white  md:w-[60%] p-6 rounded-lg shadow-sm mb-5">
            <h3 className="text-xl font-bold mb-4">Descripción</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}
      </Container>

      <Container className="p-4 ">
        <RelatedProducts products={relatedProducts} />
      </Container>
    </div>
  );
};

export default SingleProductPage;
