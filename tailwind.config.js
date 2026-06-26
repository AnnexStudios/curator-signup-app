/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark:       '#1C1A17',
        yellow:     '#FBD00E',
        teal:       '#53C3BF',
        'off-white':'#FAF8F3',
        'mid-grey': '#6B6863',
        magenta:    '#ED1A75',
        border:     '#E0DDD7',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        body:    ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
