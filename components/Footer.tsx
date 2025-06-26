import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { productType, quickLinksData } from "@/constants/data";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import FooterTop from "./FooterTop";
import { SubText, SubTitle } from "./ui/Text";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <SubText>
              Descubre colecciones de jabones artesanales cuidadosamente
              elaborados en Regalos del Corazón, que nutren tu piel y deleitan
              tus sentidos. Explora la variedad de jabones únicos que combinan
              ingredientes naturales y aromas cautivadores diseñados para mimar
              tu piel y transformar tu rutina de cuidado personal.
            </SubText>
            <SocialMedia
              className="text-darkColor/60"
              iconClassName="border-darkColor/60 hover:border-shop_light_green hover:text-shop_light_green"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>
          <div>
            <SubTitle>Enlaces rápidos</SubTitle>
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
          <div className="space-y-4">
            <SubTitle>Hoja informativa</SubTitle>
            <SubText>
              Suscríbete a nuestro boletín para recibir actualizaciones y
              ofertas exclusivas.
            </SubText>
            <form className="space-y-3">
              <Input
                placeholder="Introduce tu correo electrónico"
                type="email"
                required
              />
              <Button className="w-full">Suscríbete</Button>
            </form>
          </div>
        </div>
        <div className="py-6 border-t text-center text-sm text-gray-600">
          <div>
            © {new Date().getFullYear()} <Logo className="text-sm" />. All
            rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
