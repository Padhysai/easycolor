/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx, js}"],
  theme: {
    extend: {
      colors: {
        primary: "#7F56D9",
        hover900: "#6941C6",
        hover100: "#F9F5FF",
        black900: "#101828",
        black700: "#344054",
        black500: "#475467",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
