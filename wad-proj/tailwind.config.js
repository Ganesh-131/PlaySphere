/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      colors: {
        neon: {
          purple: '#b026ff',
          blue: '#00f0ff',
          pink: '#ff007f'
        },
        dark: {
          space: '#0b0c10',
          panel: '#1f2833',
          card: 'rgba(31, 40, 51, 0.7)'
        }
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(176, 38, 255, 0.5)',
        'glow-blue': '0 0 20px rgba(0, 240, 255, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backgroundImage: {
        'dark-fantasy': 'linear-gradient(to bottom right, #0b0c10, #180524, #0b0c10)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
