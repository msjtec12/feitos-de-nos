import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          wine: {
            DEFAULT: "#713C48",
            dark: "#542C35",
            light: "#8C4D5C",
            subtle: "#F6EFF1",
          },
          terracotta: {
            DEFAULT: "#C96E5A",
            dark: "#A85340",
            light: "#D88B7B",
            subtle: "#FAF0ED",
          },
          cream: {
            DEFAULT: "#FFF8F0",
            dark: "#F4EADC",
            light: "#FFFFFF",
          },
          rose: {
            DEFAULT: "#D9A4A0",
            dark: "#BF8783",
            light: "#EAD0CE",
            subtle: "#FBF5F4",
          },
          graphite: {
            DEFAULT: "#302B2D",
            muted: "#665E62",
            light: "#8E8488",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "DM Serif Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Manrope", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-gentle": "pulseGentle 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGentle: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.02)", opacity: "0.9" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
