module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './compositions/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      borderWidth: {
        tiny: '0.5px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
