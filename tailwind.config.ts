import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern Utility Theme Colors
        primary: {
          DEFAULT: '#14b8a6',
          dark: '#0d8282',
        },
        'teal-accent': '#0d8282',
        'background-light': '#FAFAFA',
        'background-dark': '#0e1a1a',
        'text-dark': '#111818',
        'text-light': '#ffffff',
        'border-light': '#e5e7eb',
        'neutral-secondary': '#f3f4f6',
      },
      fontFamily: {
        display: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

