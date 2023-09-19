import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
      },
    },
    screens: {
      // xs: "320px",
      sm: "320px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
  },
  plugins: [],
};
export default config;
