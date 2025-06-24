import Image from "next/image";
import Link from "next/link";
import { rdc } from "@/images";

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="ml-5">
        <Image
          src={rdc}
          alt="logo"
          className="w-15 hover:scale-110 transition-transform duration-300"
        />
      </div>
    </Link>
  );
};

export default Logo;
