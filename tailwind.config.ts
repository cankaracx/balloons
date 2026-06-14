import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette — refined navy + scarlet + white (not generic primary blue/red)
        navy: {
          DEFAULT: "#0B1F3A", // deep ink navy — primary dark surface
          700: "#13294B",
          600: "#1B3A66",
          400: "#41618F",
        },
        scarlet: {
          DEFAULT: "#E5283C", // signature pufferfish red
          600: "#C81F30",
          400: "#F25563",
        },
        paper: "#F7F8FA", // cool near-white section background
        ink: "#16203A", // body text on light
      },
      fontFamily: {
  display: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
  sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
},
      maxWidth: {
        content: "1120px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,31,58,0.04), 0 12px 32px -12px rgba(11,31,58,0.16)",
        lift: "0 2px 4px rgba(11,31,58,0.06), 0 24px 48px -16px rgba(11,31,58,0.24)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1) translateY(0)" },
          "50%": { transform: "scale(1.045) translateY(-6px)" },
        },
        floatUp: {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "10%": { opacity: "0.5" },
          "100%": { transform: "translateY(-120px)", opacity: "0" },
        },
      },
      animation: {
        breathe: "breathe 6s ease-in-out infinite",
        floatUp: "floatUp 14s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
