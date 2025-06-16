"use client";

import { AlignLeft } from "lucide-react";
import SideMenu from "./SideMenu";
import { useState } from "react";
// import type { SerializedUser } from "@/types/user" // Importar el tipo

export interface SerializedUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  emailAddress: string | null;
}

interface MobileMenuProps {
  user: SerializedUser | null;
}

const MobileMenu = ({ user }: MobileMenuProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <AlignLeft className="hover:text-darkcolor hoverEffect md:hidden hover:cursor-pointer " />
      </button>
      <div className="md:hidden">
        <SideMenu
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          user={user}
        />
      </div>
    </>
  );
};

export default MobileMenu;
