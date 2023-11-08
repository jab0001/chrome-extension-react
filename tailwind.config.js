const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['20px', '28px'],
      xl: ['24px', '32px'],
    },
    extend: {
      screens: {
        'max-md': { 'max': '850px' },
      },
      fontFamily: {
        'SFUIText': ['SF UI Text', 'sans-serif'],
        'SFUIDisplay': ['SF UI Display', 'sans-serif'],
        'Ruberoid': ['Ruberoid', 'sans-serif'],
      },
      gridTemplateColumns: {
        auto: ['repeat(auto-fill, minmax(100px, 1fr))']
      }
    }
  },
  plugins: [
    plugin(function ({ matchUtilities }) {
      matchUtilities(
        {
          'grid-cols-auto': (value) => {
            return {
              gridTemplateColumns: `repeat(auto-fill, minmax(${value}, 1fr))`
            }
          },
        }
      );
    })
  ]
};
