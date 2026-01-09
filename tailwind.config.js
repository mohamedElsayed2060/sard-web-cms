/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}", // لو لسه محتاج pages/api
  ],
  theme: {
    extend: {
      screens: {
        xs: "320px",
      },
    },
  },
  plugins: [],
};
