import CookieConsentBanner from "@/components/cookie-consent-banner";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "@/components/WhatsAppButton";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#f98e34",
            },
          }}
        />
        <CookieConsentBanner />
        <WhatsAppButton
          phoneNumber="+543718462342"
          message="¡Hola! Estoy interesado en un producto de su tienda."
        />
      </body>
    </html>
  );
};
export default RootLayout;
