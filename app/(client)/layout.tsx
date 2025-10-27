import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import WhatsAppButton from "@/components/WhatsAppButton";
import PromotionalModalManager from "@/components/modals/PromotionalModalManager";

export const metadata: Metadata = {
  title: {
    template: "%s - Regalos del corazón",
    default: "Shopcart online RDC",
  },
  description: "Shopcart online RDC, Your one stop shop for all your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <WhatsAppButton
        phoneNumber="+543718462342"
        message="¡Hola! Estoy interesado en un producto de su tienda."
      />
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">{children}</main>
        <Footer />
        <PromotionalModalManager
          modalType="showcase"
          delay={6000}
          oncePerSession={true}
          oncePerDay={false}
          minScreenWidth={768}
        />
      </div>
    </ClerkProvider>
  );
}
