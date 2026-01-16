import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cores customizadas do ShopSense (roxo)
        shopSense: {
          50: "hsl(271, 95%, 98%)",
          100: "hsl(271, 90%, 95%)",
          200: "hsl(271, 85%, 90%)",
          300: "hsl(271, 80%, 85%)",
          400: "hsl(271, 75%, 75%)",
          500: "hsl(271, 81%, 56%)", // #9333EA - Primary
          600: "hsl(271, 70%, 50%)", // #7C3AED - Primary Dark
          700: "hsl(271, 65%, 45%)",
          800: "hsl(271, 60%, 40%)",
          900: "hsl(271, 55%, 35%)",
          primary: "hsl(271, 81%, 56%)", // #9333EA
          "primary-dark": "hsl(271, 70%, 50%)", // #7C3AED
          "primary-light": "hsl(271, 85%, 65%)", // #A855F7
          "primary-lighter": "hsl(271, 90%, 75%)",
          "primary-darkest": "hsl(271, 60%, 45%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
