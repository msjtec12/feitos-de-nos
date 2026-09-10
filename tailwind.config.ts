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
            DEFAULT: "rgb(var(--theme-primary-rgb, 113 60 72) / <alpha-value>)",
            dark: "var(--theme-primary-dark, #542C35)",
            light: "var(--theme-primary-light, #8C4D5C)",
            subtle: "var(--theme-primary-subtle, #F6EFF1)",
          },
          terracotta: {
            DEFAULT: "rgb(var(--theme-accent-rgb, 201 110 90) / <alpha-value>)",
            dark: "var(--theme-accent-dark, #A85340)",
            light: "var(--theme-accent-light, #D88B7B)",
            subtle: "var(--theme-accent-subtle, #FAF0ED)",
          },
          cream: {
            DEFAULT: "rgb(var(--theme-bg-rgb, 255 248 240) / <alpha-value>)",
            dark: "var(--theme-bg-dark, #F4EADC)",
            light: "#FFFFFF",
          },
          rose: {
            DEFAULT: "rgb(var(--theme-rose-rgb, 217 164 160) / <alpha-value>)",
            dark: "#BF8783",
            light: "#EAD0CE",
            subtle: "var(--theme-rose-subtle, #FBF5F4)",
          },
          graphite: {
            DEFAULT: "rgb(var(--theme-text-rgb, 48 43 45) / <alpha-value>)",
            muted: "var(--theme-text-muted, #665E62)",
            light: "var(--theme-text-light, #8E8488)",
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
