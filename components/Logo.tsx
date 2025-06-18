import { cn } from "@/lib/utils";
import Link from "next/link";

const Logo = ({
  className,
  spanDesign,
}: {
  className?: string;
  spanDesign?: string;
}) => {
  return (
    <Link href={"/"}>
      <h2
        className={cn(
          "text-2xl text-shop_orange font-black tracking-wider uppercase hover:text-shop_light_green hoverEffect group font-sans",
          className
        )}
      >
        RD
        <span
          className={cn(
            "text-shop_light_green group-hover:text-shop_orange hoverEffect",
            spanDesign
          )}
        >
          C
        </span>
      </h2>
    </Link>
  );
};

export default Logo;
