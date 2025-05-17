/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textColor: {
        primary: "#303038ff",
        secondary: "#ffffff",
      },
      backgroundColor: {
        primary: "#303038ff",
        secondary: "#ffffff",
      },
    },
  },
  plugins: [],
};
