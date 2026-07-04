/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1E3A8A',
        'brand-blue-light': '#2B4FBE',
        'brand-red': '#991B1B',
        'brand-red-light': '#B91C1C',
        'brand-orange': '#F97316',
        'brand-gray': '#F3F4F6',
      },
    },
  },
  plugins: [],
};
