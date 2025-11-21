/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx,vue}"
    ],
    theme: {
      extend: {
        colors: {
          primary: '#2AC951',
          secondary: '#EFF6F1',
          accent: '#6FD3F5',
          dark: '#0A0C0C',
        },
      },
    },
    plugins: [],
  };
  