import CookieConsentBanner from "@/components/cookie-consent-banner";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { ThemeProviderd } from "@/components/ThemeProviderd";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-poppins antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ThemeProviderd attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProviderd>
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
      </body>
    </html>
  );
};
export default RootLayout;
