import { cn } from "@/lib/utils";
import ProductCard from "./ProductCard";

export type RelatedProduct = {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  discount?: number;
  images?: { asset: { url: string } }[];
  stock?: number;
};

interface RelatedProductsProps {
  products: RelatedProduct[];
  className?: string;
}

export default function RelatedProducts({
  products,
  className,
}: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null; // No renderizar si no hay productos relacionados
  }

  return (
    <div className={cn("py-10", className)}>
      <h2 className="text-3xl font-bold text-center mb-8">
        También te podrían interesar
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product?._id} product={product} />
        ))}
      </div>
    </div>
  );
}
