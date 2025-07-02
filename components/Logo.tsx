import Image from "next/image";
import Link from "next/link";
import { logo } from "@/images";

const Logo = () => {
  const text = "Regalos Del Corazón";

  return (
    <Link href={"/"}>
      <div className="hidden md:inline-block ml-5 relative group">
        <Image
          src={logo}
          alt="logo"
          className="w-20 hover:scale-110 transition-transform duration-300"
        />
        <span
          className="
            hidden md:flex absolute top-full left-1/2 -translate-x-1/2 mt-2
            whitespace-nowrap text-shop_orange
            overflow-hidden /* Oculta el texto mientras se anima */
          "
        >
          {text.split("").map((char, index) => (
            <span
              key={index}
              className="
                inline-block /* Para que cada letra pueda ser animada individualmente */
                translate-y-full /* Empieza fuera de la vista hacia abajo */
                group-hover:translate-y-0 /* Sube a su posición final al hacer hover */
                transition-transform duration-500 ease-out /* Suaviza la animación */
              "
              style={{
                transitionDelay: `${index * 50}ms`,
              }} /* Retraso para cada letra */
            >
              {char === " " ? "\u00A0" : char}{" "}
              {/* Renderiza espacios como espacios no rompibles */}
            </span>
          ))}
        </span>
      </div>
    </Link>
  );
};

export default Logo;
