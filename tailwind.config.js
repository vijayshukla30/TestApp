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
        primary: "#6366F1", // indigo-500 – looks good in light
        border: "#E5E7EB",
        "surface-secondary": "rgba(243, 244, 246, 0.6)",

        // ── Dark theme variants (used with dark:) ──
        "dark-background": "#0B1020",
        "dark-surface": "#141A2E",
        "dark-text": "#FFFFFF",
        "dark-subtext": "#9CA3AF",
        "dark-primary": "#8B9CFF",
        "dark-border": "rgba(255,255,255,0.12)",
        "dark-surface-secondary": "rgba(31, 41, 55, 0.4)",
      },
    },
  },

  plugins: [],
};
