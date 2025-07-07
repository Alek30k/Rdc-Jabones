import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const WishListPage = async () => {
  const user = await currentUser();
  return (
    <>
      {user ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Inicia sesión para ver los artículos de tu lista de deseos. ¡No te pierdas los productos de tu carrito para realizar el pago!" />
      )}
    </>
  );
};

export default WishListPage;
