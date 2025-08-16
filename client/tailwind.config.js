/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
 fontFamily: {
  commissioner: ['Commissioner', 'sans-serif'],
  dancing: ['Dancing Script', 'cursive'],
  mulish: ['Mulish', 'sans-serif'],
  opensans: ['Open Sans', 'sans-serif'],
  outfit: ['Outfit', 'sans-serif'],
  quicksand: ['Quicksand', 'sans-serif'],
  sans: ['Mulish', 'sans-serif'], // set a default
},

  colors: {
    "primary-200": "#ffbf00",
    "primary-100": "#ffc929",
    "secondary-200": "#00b050",
    "secondary-100": "#0b1a78",
  },
}

  },  
  plugins: [
  ],
}

