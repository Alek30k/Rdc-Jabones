import Link from "next/link";
import { Title } from "./ui/Text";
import Image from "next/image";
import { banner_2 } from "@/images";

const HomeBanner = () => {
  return (
    <div className="py-16 md:py-0 bg-shop_light_pink rounded-lg px-10 lg:px-24 flex items-center justify-between">
      <div className="space-y-5">
        <Title>
          Consigue hasta un 50 % de descuento en <br />
          sección de regalos
        </Title>
        <Link
          href={"/shop"}
          className="bg-shop_dark_green/90 text-white/90 px-5 py-2 text-sm rounded-md font-semibold hover:text-white hover:bg-shop_dark_green hoverEffect "
        >
          Comprar ahora
        </Link>
      </div>
      <div className="">
        <Image
          src={banner_2}
          alt="banner"
          className="hidden md:inline-flex w-96"
        />
      </div>
    </div>
  );
};

export default HomeBanner;
