import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      black: '#000000',
      lightGrey: '#9D9E91',
      grey: '#979A89',
      darkGrey: '#54575C',
      white: '#ffffff',

      border: '#CBD0DC',
      text: {
        light: '#979A89',
        DEFAULT: '#9D9E91',
        dark: '#696C62',
        darker: '#54575C',
      },

      bg: {
        light: '#F2F1EB',
        DEFAULT: '#E8DFC1',
        dark: '#E8E4D6',
        black: '#141721',
      },
      brown: {
        light: '#D0B794',
        DEFAULT: '#BEB79D',
        dark: '#313442',
      },
    },
    extend: {
      backgroundImage: {},
    },
  },
  plugins: [],
};
export default config;
