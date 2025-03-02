import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['media', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        gray: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
        },
        indigo: {
          50: 'var(--indigo-50)',
          100: 'var(--indigo-100)',
          200: 'var(--indigo-200)',
          300: 'var(--indigo-300)',
          400: 'var(--indigo-400)',
          500: 'var(--indigo-500)',
          600: 'var(--indigo-600)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
