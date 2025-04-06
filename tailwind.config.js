/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF7F50", // Coral - warm and visually appealing
          100: "#FF9001",
          200: "#FF8E01",
          300: "#FFB347", // Lighter shade
          400: "#FFD580", // Softer pastel shade
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
          200: "#E5E5E5", // Light gray for contrast
        },
        accent: {
          100: "#FF6F61", // Coral for a pop of color
          200: "#FFD700", // Gold for a luxurious touch
          300: "#FF4500", // Orange-red for vibrancy
        },
      },
      fontFamily: {
        mPregular: ["MavenPro-Regular", "sans-serif"],
        mPmedium: ["MavenPro-Medium", "sans-serif"],
        mPsemibold: ["MavenPro-SemiBold", "sans-serif"],
        mPbold: ["MavenPro-Bold", "sans-serif"],
        mPextrabold: ["MavenPro-ExtraBold", "sans-serif"],
        mPblack: ["MavenPro-Black", "sans-serif"],
        jSregular: ["JosefinSans-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
