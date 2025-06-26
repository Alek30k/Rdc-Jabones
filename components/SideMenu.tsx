import { FC } from "react";
import { X } from "lucide-react";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import SignIn from "./SignIn";
import { User } from "@clerk/nextjs/server";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  className?: string;
  spanDesign?: string;
}

const SideMenu: FC<SidebarProps> = ({
  isOpen,
  onClose,
  user,
  className,
  spanDesign,
}) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);

  return (
    <div
      className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 text-white/70 shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } hoverEffect`}
    >
      <div
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-black h-screen p-10 border-r border-r-shop_light_green flex flex-col gap-6 justify-between"
      >
        <button
          className="hover:text-shop_light_green flex justify-end hoverEffect"
          onClick={onClose}
        >
          <X />
        </button>
        <div className="flex items-center ">
          <Link href={"/"}>
            <h2
              className={cn(
                "text-lg text-shop_orange font-black tracking-widest hover:text-shop_light_green hoverEffect group font-sans",
                className
              )}
            >
              🎁 Regalos del{" "}
              <span
                className={cn(
                  "text-shop_light_green group-hover:text-shop_orange hoverEffect",
                  spanDesign
                )}
              >
                Corazón ❤️
              </span>
            </h2>
          </Link>{" "}
        </div>
        <div className="">
          <ClerkLoaded>
            <div className="flex items-center gap-3">
              <SignedIn>
                <UserButton />
              </SignedIn>
              {!user && <SignIn />}
              <h2 className="text-white">{user?.firstName}</h2>
            </div>
          </ClerkLoaded>
        </div>
        <div className=" flex flex-col mb-30 space-y-3.5 tracking-wide capitalize font-semibold my-10">
          {headerData?.map((item) => (
            <Link
              href={item?.href}
              key={item?.title}
              onClick={onClose}
              className={`hover:text-shop_light_green mb-5 hoverEffect ${
                pathname === item?.href && "text-shop_light_green"
              }`}
            >
              {item?.title}
            </Link>
          ))}
        </div>

        <SocialMedia />
      </div>
    </div>
  );
};

export default SideMenu;
