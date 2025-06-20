import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LogInIcon as Logs } from "lucide-react";
import { getMyOrders } from "@/sanity/queries";

const Header = async () => {
  const clerkUser = await currentUser(); // Cambiar nombre para evitar confusión
  const { userId } = await auth();
  let orders = [];

  // Serializar el usuario para pasarlo al Client Component
  const serializedUser = clerkUser
    ? {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        emailAddress: clerkUser.emailAddresses[0]?.emailAddress || null,
      }
    : null;

  if (userId) {
    orders = await getMyOrders(userId);
  }

  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          {/* Pasar el usuario serializado en lugar del objeto completo */}
          <MobileMenu user={serializedUser} />
          <Logo />
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <div className="hidden md:flex">
            <SearchBar />
          </div>
          <CartIcon />
          <FavoriteButton />

          {/* Usar clerkUser para las verificaciones */}
          {clerkUser && (
            <Link
              href={"/orders"}
              className="group relative hover:text-shop_light_green hoverEffect"
            >
              <Logs />
              <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {orders?.length ? orders?.length : 0}
              </span>
            </Link>
          )}

          <ClerkLoaded>
            <SignedIn>
              <div className="hidden md:inline-block">
                <UserButton />
              </div>
            </SignedIn>
            {!clerkUser && <SignIn />}
          </ClerkLoaded>
        </div>
      </Container>
      <div className="md:hidden p-2">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
