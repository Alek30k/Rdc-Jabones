import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}

const PriceView = ({ price, discount, className }: Props) => {
  return (
    <div className="flex items-center  justify-between gap-5">
      <div className="flex items-center gap-2">
        <div className="">
          {price && discount !== undefined && (
            <>
              {discount > 0 && (
                <PriceFormatter
                  amount={price + (discount * price) / 100}
                  className={twMerge(
                    "line-through text-xs font-normal text-zinc-500",
                    className
                  )}
                />
              )}
              {discount === 0 && (
                <span
                  className={twMerge(
                    "text-xs font-normal text-zinc-500 ",
                    className
                  )}
                ></span>
              )}
            </>
          )}
        </div>
        <PriceFormatter
          amount={price}
          className={cn("text-shop_dark_green", className)}
        />
      </div>
    </div>
  );
};

export default PriceView;
