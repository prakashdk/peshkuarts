/** @type {import('tailwindcss').Config} */

const colors = {
  primary: "#303038ff",
  secondary: "#ffffff",
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textColor: {
        primary: colors.primary,
        secondary: colors.secondary,
      },
      backgroundColor: {
        primary: colors.primary,
        secondary: colors.secondary,
      },
      borderColor: {
        primary: colors.primary,
        secondary: colors.secondary,
      },
    },
  },
  plugins: [],
};
