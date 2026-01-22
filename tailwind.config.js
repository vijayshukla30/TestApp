/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ← this enables dark: prefix
  presets: [require("nativewind/preset")],

  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // ── Light theme (default / no dark class) ──
        background: "#F8FAFC",
        surface: "#FFFFFF",
        text: "#111827",
        subText: "#6B7280",
        primary: "#8B9CFF", // indigo-500 – looks good in light
        border: "#E5E7EB",
        "surface-secondary": "#F3F4F6",

        // ── Dark theme variants (used with dark:) ──
        "dark-background": "#0B1020",
        "dark-surface": "#141A2E",
        "dark-text": "#FFFFFF",
        "dark-subtext": "#9CA3AF",
        "dark-primary": "#8B9CFF",
        "dark-border": "rgba(255,255,255,0.12)",
        "dark-surface-secondary": "#1F2937",
      },
      dropShadow: {
        sm: "0 1px 2px rgb(0 0 0 / 0.1)",
        "dark-sm": "0 1px 3px rgb(0 0 0 / 0.35)",
      },
    },
  },

  plugins: [],
};
