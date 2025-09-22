import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

const NoAccess = ({
  details = "Inicia sesión para ver los artículos de tu carrito y finalizar la compra. ¡No te pierdas tus productos favoritos!",
}: {
  details?: string;
}) => {
  return (
    <div className="flex items-center justify-center py-12 md:py-32 bg-gray-100 p-4">
      <Card className="w-full max-w-md p-5">
        <CardHeader className="flex items-center flex-col">
          <Link href={"/"}>
            <div className="hidden md:inline-block relative group">
              <Image
                src="/logo.png"
                alt="logo"
                width={80}
                height={40}
                className="hover:scale-110 transition-transform duration-300"
              />
            </div>
          </Link>
          <CardTitle className="text-2xl font-bold text-center">
            ¡Bienvenido de nuevo!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center font-medium text-darkColor/80">{details}</p>
          <SignInButton mode="modal">
            <Button className="w-full" size="lg">
              Iniciar sesión
            </Button>
          </SignInButton>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            ¿No tienes una cuenta?
          </div>
          <SignUpButton mode="modal">
            <Button variant="outline" className="w-full" size="lg">
              Crear una cuenta
            </Button>
          </SignUpButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;
