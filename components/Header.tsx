import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { logo } from "@/images";
import Link from "next/link";
import CategoryDropdown from "./CategoryDropdown";
import { ThemeToggle } from "./ThemeToggle";

const Header = async () => {
  const clerkUser = await currentUser();

  const serializedUser = clerkUser
    ? {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        emailAddress: clerkUser.emailAddresses[0]?.emailAddress || null,
      }
    : null;

  return (
    <header className="sticky top-0 z-50 py-2 md:py-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md transition-colors duration-300">
      <Container className="flex items-center justify-between text-gray-900 dark:text-gray-100">
        {/* Left side */}
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu user={serializedUser} />
          <Logo />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          <CategoryDropdown />
          <HeaderMenu />
        </div>

        {/* Mobile logo */}
        <Link href={"/"}>
          <div className="md:hidden">
            <Image src={logo} alt="logo" className="w-12" />
          </div>
        </Link>

        {/* Right side */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <div className="hidden md:flex">
            <SearchBar />
          </div>
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>

          <CartIcon />
          <FavoriteButton />

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

      {/* Mobile search */}
      <div className="md:hidden px-2">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
