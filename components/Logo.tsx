import Image from "next/image";
import Link from "next/link";
import { logo } from "@/images";

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="hidden md:inline-block ml-5">
        <Image
          src={logo}
          alt="logo"
          className="w-20 hover:scale-110 transition-transform duration-300"
        />
      </div>
    </Link>
  );
};

export default Logo;
