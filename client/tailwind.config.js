/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  safelist: ['bg-dark', 'text-dark-accent', 'hover:text-dark', 'hover:bg-dark-accent',
    'bg-light', 'text-light-accent', 'hover:text-light', 'hover:bg-light-accent'],

  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'light-primary': '#FFFFFF',
        'dark-primary': '#222222',
        'light-secondary': '#EEEEEE',
        'dark-secondary': '#111111',
        'light-accent': '#005BFF',
        'dark-accent': '#ef8010',
      },
    },
  },
  variants: {
    extend: {
      scale: ['hover', 'focus'],
      transform: ['hover', 'focus'],
    },
  },
  plugins: [],
};
