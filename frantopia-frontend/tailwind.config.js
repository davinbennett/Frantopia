/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App.jsx",
    "./src/presentation/screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [ require( "nativewind/preset" ) ],
  theme: {
    extend: {
      colors: {
        blue: '#2D70F3',
        blueDark: '#062DF6',
        grayLight: '#D9D9D9',
        gray: '#D0D0D0',
        grayDark: '#BFBFBF',
        background: '#F3F4FE',
        yellow: '#f3b02d'
      },
    },
  },
  plugins: [],
};