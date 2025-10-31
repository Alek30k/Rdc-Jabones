import { Toaster } from "react-hot-toast";
import { ThemeProviderd } from "@/components/ThemeProviderd";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-poppins antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProviderd attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProviderd>

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
      </body>
    </html>
  );
};
export default RootLayout;
