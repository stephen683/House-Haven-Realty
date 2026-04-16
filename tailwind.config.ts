import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        househaven: {
          navy: '#000000',
          'navy-light': '#1a1a1a',
          accent: '#C6C4C4',
          'accent-dark': '#999999',
          surface: '#F5F5F5',
          text: '#000000',
          'text-muted': '#6b6b6b',
          success: '#2E7D32',
        },
      },
      fontFamily: {
        serif: ['Modulus', 'system-ui', 'sans-serif'],
        sans: ['Modulus', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
