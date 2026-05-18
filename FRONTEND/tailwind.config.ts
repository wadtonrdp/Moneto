import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Adicionando a fonte customizada
      fontFamily: {
        custom: ["var(--font-custom)"],
      },
      // Adicionando o peso da fonte customizado (opcional)
      fontWeight: {
        heavy: "var(--weight-heavy)",
      },
    },
  },
  plugins: [],
};

export default config;