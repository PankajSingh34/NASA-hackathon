/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          dark: "#0a0a0a",
          navy: "#1a1a2e",
          blue: "#16213e",
          accent: "#4fc3f7",
          accent2: "#29b6f6",
          accent3: "#0288d1",
          orange: "#ff6b35",
          orange2: "#f7931e",
        },
        nasa: {
          blue: "#0B3D91", // NASA Blue PMS 286 C
          red: "#FC3D21", // NASA Red PMS 185 C
          orange: "#FF4F00", // International Orange
          deep: "#0a192f", // Deep Space background
          light: "#F8F9FA", // Light gray backgrounds
          charcoal: "#212529", // Primary text color in light contexts
        },
      },
      animation: {
        twinkle: "twinkle 3s infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          from: { boxShadow: "0 0 20px rgba(79, 195, 247, 0.5)" },
          to: { boxShadow: "0 0 30px rgba(79, 195, 247, 0.8)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
