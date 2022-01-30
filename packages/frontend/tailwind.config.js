const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      width: {
        168: '42rem',
        200: '50rem',
      },
      colors: {
        'dark-pink': {
          100: '#FD0069',
        },
      },
    },
  },
  plugins: [],
}
