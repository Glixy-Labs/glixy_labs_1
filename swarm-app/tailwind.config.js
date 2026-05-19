/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        bg:    '#fff8f1',
        cream: '#fdf3e7',
        panel: '#ffffff',
        ink: {
          100: '#1a1410',
          200: '#2a221c',
          300: '#3a302a',
          400: '#4a3f37',
          500: '#6b5e52',
          600: '#8a7f74',
          700: '#bdac95',
          800: '#e5d9c5',
          900: '#fdf6ec',
        },
        accent: {
          orange: '#ff6a1f',
          peach:  '#ff8a3d',
          light:  '#ffb37a',
          deep:   '#e55510',
        },
      },
      boxShadow: {
        'soft':       'inset 0 0 0 1px rgba(26,20,16,0.06)',
        'glow-orange':'0 30px 70px -20px rgba(255,106,31,.45)',
      },
      animation: {
        'gradient-pan': 'gradient-pan 6s ease infinite',
        'pulse-soft':   'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-pan': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':      { 'background-position': '100% 50%' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
};
