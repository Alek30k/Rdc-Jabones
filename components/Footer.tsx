import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { productType, quickLinksData } from "@/constants/data";
import Link from "next/link";
import { SubText, SubTitle } from "./ui/Text";
import { Mail, MapPin, Phone } from "lucide-react";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const Footer = () => {
  const data: ContactItemData[] = [
    {
      title: "Visítanos",
      subtitle: "General Manuel Belgrano, FORMOSA",
      icon: (
        <MapPin className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      ),
    },
    {
      title: "Llámanos",
      subtitle: "+54 3704 678598",
      icon: (
        <Phone className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      ),
    },

    {
      title: "Envíenos un email",
      subtitle: "rdc@gmail.com",
      icon: (
        <Mail className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      ),
    },
  ];

  return (
    <footer className="bg-shop_bgcardorange  border-t">
      <Container>
        {/* <FooterTop /> */}
        <div className="p-12 px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <SubText>
              Descubre colecciones de jabones artesanales cuidadosamente
              elaborados en Regalos del Corazón, que nutren tu piel y deleitan
              tus sentidos. Explora la variedad de jabones únicos que combinan
              ingredientes naturales y aromas cautivadores diseñados para mimar
              tu piel y transformar tu rutina de cuidado personal.
            </SubText>
          </div>
          <div>
            <SubTitle>Información</SubTitle>
            <ul className="space-y-3 mt-4">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="hover:text-shop_light_green hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubTitle>Categorías</SubTitle>
            <ul className="space-y-3 mt-4">
              {productType?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category/${item?.href}`}
                    className="hover:text-shop_light_green hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubTitle>Contácto</SubTitle>
            <ul className="space-y-3 mt-4">
              {data?.map((item) => (
                <li key={item?.title}>
                  <div className="flex gap-3 hover:text-shop_light_green hoverEffect font-medium">
                    <p>{item?.icon}</p>
                    {item?.subtitle}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <SocialMedia
          className="text-darkColor/60 justify-center mb-5"
          iconClassName="border-darkColor/60 hover:border-shop_light_green hover:text-shop_light_green"
          tooltipClassName="bg-darkColor text-white"
        />

        <div className="py-6 border-t text-center text-sm text-gray-600">
          <div>
            © {new Date().getFullYear()} <Logo className="text-sm" />. Todos
            los derechos reservados
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
