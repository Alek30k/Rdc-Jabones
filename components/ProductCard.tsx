import type { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";
import ProductSideMenu from "./ProductSideMenu";
import Title from "./Title";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="text-sm border border-darkBlue/20 rounded-md group bg-white overflow-hidden">
      <div className="relative group overflow-hidden bg-shop_light_bg">
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).url() || "/placeholder.svg"}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-48 sm:h-56 md:h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg duration-500 
              ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
            />
          </Link>
        )}
        <ProductSideMenu product={product} />
        {product?.status === "sale" ? (
          <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 py-1 rounded-full group-hover:border-lightGreen hover:text-shop_dark_green hoverEffect bg-white/90">
            Sale!
          </p>
        ) : (
          <Link
            href={"/deal"}
            className="absolute top-2 left-2 z-10 border border-shop_orange/50 p-1 rounded-full group-hover:border-shop_orange hover:text-shop_dark_green hoverEffect bg-white/90"
          >
            <Flame
              size={16}
              fill="#fb6c08"
              className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
            />
          </Link>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-lightText">
            {product.categories.map((cat) => cat).join(", ")}
          </p>
        )}

        <Title className="text-sm sm:text-base line-clamp-2 leading-tight">
          {product?.name}
        </Title>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <p className="font-medium">In Stock</p>
          <p
            className={`${product?.stock === 0 ? "text-red-600" : "text-shop_dark_green/80 font-semibold"}`}
          >
            {(product?.stock as number) > 0 ? product?.stock : "unavailable"}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-base sm:text-lg"
          />

          <AddToCartButton
            product={product}
            className="w-full sm:w-auto sm:max-w-[144px] rounded-full text-sm py-2 px-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
