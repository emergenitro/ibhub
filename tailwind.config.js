/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: '#0f0fff',
        neonBlueLight: '#3a7eff',
      },
      boxShadow: {
        neon: '0 0 12px #0f0fff, 0 0 24px #3a7eff',
      },
    },
  },
};
