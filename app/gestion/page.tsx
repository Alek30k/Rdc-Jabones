"use client";
import { useState } from "react";
import SoapBusinessManager from "@/components/SoapBusinessManager";
import Image from "next/image";

export default function Home() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // const adminPassword = process.env.NEXT_PRIVATE_ADMIN_PASSWORD;

  const adminPassword = "rdc123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setAuthenticated(true);
      localStorage.setItem("authenticatedOwner", "true"); // Guarda la sesión local
    } else {
      alert("Contraseña incorrecta");
    }
  };

  // Mantener sesión activa si ya inició antes
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("authenticatedOwner");
    if (session && !authenticated) setAuthenticated(true);
  }

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
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
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

  return <SoapBusinessManager />;
}
