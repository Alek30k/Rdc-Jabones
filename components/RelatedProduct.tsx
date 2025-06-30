import { cn } from "@/lib/utils";
import ProductCard from "./ProductCard";
import Title from "./Title";

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
      {/* <h2 className="text-3xl font-bold text-center mb-8">
        También te podrían interesar
      </h2> */}
      <div className="text-center mb-8 ">
        <Title className=" border-b border-shop_light_green/20 pb-4 mb-6  flex flex-col">
          <span className="bg-gradient-to-r from-shop_orange to-shop_dark_green bg-clip-text text-transparent">
            También te podrían interesar
          </span>
        </Title>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product?._id} product={product} />
        ))}
      </div>
    </div>
  );
}
