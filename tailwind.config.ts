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
          navy: '#1a1a2e',
          'navy-light': '#2d2d4e',
          accent: '#c9a96e',
          'accent-dark': '#a07c45',
          surface: '#F8F9FA',
          text: '#1a1a1a',
          'text-muted': '#6b7280',
          success: '#2E7D32',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
