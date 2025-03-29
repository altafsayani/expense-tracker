/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eef3fb',
          100: '#d9e4f7',
          200: '#bccef0',
          300: '#92b0e7',
          400: '#6490dd',
          500: '#4272d4',
          600: '#3059c4',
          700: '#2849a0',
          800: '#24418c', // Our primary blue shade
          900: '#213c7a',
          950: '#172552',
        },
      },
    },
  },
  plugins: [],
}; 