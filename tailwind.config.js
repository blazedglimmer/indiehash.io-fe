/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB800',
        'primary-dark': '#FFA000',
        'primary-light': '#FFD54F',
        'primary-gradient': {
          from: '#FFB800',
          to: '#FFD54F',
        },
      },
    },
  },
  plugins: [],
} 