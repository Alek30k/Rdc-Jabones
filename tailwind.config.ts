import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 👉 Activamos dark mode por clase
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        greenLight: "#E6F4EA",
        greenMid: "#34D399",
        greenDark: "#047857",
      },
      textShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.1)",
        DEFAULT: "0 2px 4px rgba(0,0,0,0.1)",
        lg: "0 4px 8px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
