/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Page backgrounds
        canvas: {
          50:  "#FAFAFA",
          100: "#F1F5F9",
          200: "#E2E8F0",
        },
        // Sidebar / shell
        shell: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
        },
        // Primary accent — indigo (distinct from Friend 1's teal)
        indigo: {
          light: "#A5B4FC",
          DEFAULT: "#6366F1",
          dark: "#4F46E5",
        },
        // Status colors
        emerald: {
          light: "#6EE7B7",
          DEFAULT: "#10B981",
          dark: "#059669",
        },
        amber: {
          light: "#FDE68A",
          DEFAULT: "#F59E0B",
          dark: "#D97706",
        },
        rose: {
          light: "#FCA5A5",
          DEFAULT: "#F43F5E",
          dark: "#E11D48",
        },
        // Text
        ink: {
          900: "#0F172A",
          700: "#334155",
          500: "#64748B",
          300: "#CBD5E1",
        },
      },
      fontFamily: {
        display: ["'DM Sans'", "sans-serif"],
        body:    ["'Inter'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card:  "0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
        float: "0 8px 30px rgba(15,23,42,0.12)",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: 1 },
          "50%":       { opacity: 0.3 },
        },
        "slide-up": {
          from: { opacity: 0, transform: "translateY(6px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "slide-up":  "slide-up 0.2s ease-out",
        "fade-in":   "fade-in 0.15s ease-out",
      },
    },
  },
  plugins: [],
}
