import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#142018",
        paper: "#f7f8f4",
        line: "#dce3db",
        accent: "#b9dcf5",
        muted: "#66736a",
      },
      fontFamily: { sans: ["var(--font-geist-sans)", "Arial", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
