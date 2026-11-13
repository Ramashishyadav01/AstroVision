/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          dark: '#0d0618',
          purple: '#1a0533',
          navy: '#0d1b4b',
          mid: '#160428',
        },
        gold: {
          DEFAULT: '#f5c518',
          dark: '#d4a500',
          light: '#ffd700',
          pale: '#fef3c7',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #0d0618 0%, #1a0533 50%, #0d1b4b 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f5c518, #d4a500)',
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(245,197,24,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(245,197,24,0.8)' },
        },
      },
    },
  },
  plugins: [],
}
