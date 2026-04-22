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
        black: "#0F0F0F",
        orange: "#E8501A",
        "orange-dark": "#C43E10",
        cream: "#F5F1EB",
        warm: "#FDFCFA",
        mid: "#6B6560",
        soft: "#B8B0A8",
        green: "#2D7A4F",
        ink: "#1a1a1a",
        "ink-2": "#4a4a4a",
        "ink-3": "#6b6b6b",
        rust: "#c23b22",
        paper: "#efede4",
        "paper-card": "#f5f3eb",
        "paper-line": "#d8d4c3",
      },
      fontFamily: {
        heading: ["var(--font-barlow)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
        display: ["var(--font-archivo-black)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        signature: ["var(--font-caveat)", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
