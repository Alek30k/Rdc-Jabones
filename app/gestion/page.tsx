"use client";
import { useState } from "react";
import SoapBusinessManager from "@/components/SoapBusinessManager";
import Image from "next/image";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { Eye, EyeOff } from "lucide-react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const adminPassword = "rdc123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-8 w-96 text-center space-y-4"
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={140}
            height={40}
            className="mx-auto mb-4"
          />
          <h2 className="text-lg font-semibold text-gray-700">
            Ingresar a Panel de Administración
          </h2>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 text-black rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <ProductsProvider>
      <SoapBusinessManager />
    </ProductsProvider>
  );
}
