import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',  // Lightest slate
          100: '#f1f5f9', // Light slate background
          400: '#60a5fa', // Accent Blue
          500: '#3b82f6', // Deep Blue (Main Accents/Buttons)
          600: '#2563eb', // Hover Blue
          800: '#1e293b', // Deep Slate (Sidebar)
          900: '#0f172a', // Darkest Slate
        },
        background: '#f1f5f9',
      }
    },
  },
  plugins: [],
};
export default config;