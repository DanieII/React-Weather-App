/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "black-bg": "#080a11",
      },
      transitionProperty: {
        height: "height",
      },
    },
  },
  plugins: [],
};
