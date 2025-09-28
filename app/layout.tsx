import CookieConsentBanner from "@/components/cookie-consent-banner";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "@/components/WhatsAppButton";
import PromotionalModalManager from "@/components/modals/PromotionalModalManager";
import { ThemeProvider } from "next-themes";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-poppins antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>

        {/* Notificaciones */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#f98e34",
            },
          }}
        />

        {/* Extras */}
        <CookieConsentBanner />
        <WhatsAppButton
          phoneNumber="+543718462342"
          message="¡Hola! Estoy interesado en un producto de su tienda."
        />
        <PromotionalModalManager
          modalType="showcase"
          delay={6000}
          oncePerSession={true}
          oncePerDay={false}
          minScreenWidth={768}
        />
      </body>
    </html>
  );
};
export default RootLayout;
