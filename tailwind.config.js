/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],

  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "#0B1020",
        surface: "#141A2E",
        text: "#FFFFFF",
        subText: "#9CA3AF",
        primary: "#8B9CFF",
        border: "rgba(255,255,255,0.12)",
      },
    },
  },
  plugins: [],
};
