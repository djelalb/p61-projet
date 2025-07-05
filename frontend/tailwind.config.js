/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'ui-sans-serif', 'system-ui'],
      },
      zIndex: {
        999: '999',
        9999: '9999',
      },
    },
  },
  plugins: [],
};
