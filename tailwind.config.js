/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',  // Include the app directory
    './pages/**/*.{js,ts,jsx,tsx}', // If using pages too
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}', // Include layouts directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
