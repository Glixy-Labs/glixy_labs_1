/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        // Glixy brand palette — matches main static site
        bg:    '#fff8f1',
        cream: '#fdf3e7',
        ink: {
          50:  '#fdf6ec',
          100: '#f3ebde',
          200: '#e5d9c5',
          300: '#bdac95',
          400: '#8a7f74',
          500: '#4a3f37',
          600: '#3a302a',
          700: '#2a221c',
          800: '#1a1410',
          900: '#0f0a07',
        },
        orange: {
          50:  '#fff3e7',
          100: '#ffe0c4',
          200: '#ffd7b0',
          300: '#ffb37a',
          400: '#ff8a3d',
          500: '#ff6a1f',
          600: '#e55510',
          700: '#bc450c',
        },
        // Companion accent palette (themes: Peach / Midnight / Cloud / Moss)
        theme: {
          peach:    '#ff8a3d',
          midnight: '#1a1410',
          cloud:    '#9ec1ff',
          moss:     '#7bb27a',
        },
      },
      backgroundImage: {
        'soft-grid':
          'linear-gradient(rgba(26,20,16,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,20,16,.04) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(ellipse 80% 60% at 50% 0%, #ffb37a 0%, #ffc9a0 25%, #ffe0c4 50%, #fff3e2 75%, #fff8f1 100%)',
      },
      animation: {
        'gradient-pan': 'gradient-pan 6s ease infinite',
        'float-slow':   'float 7s ease-in-out infinite',
        'float-med':    'float 5s ease-in-out infinite',
        'float-fast':   'float 4s ease-in-out infinite',
        'walk':         'walk 16s linear infinite',
        'blink':        'blink 4.5s ease-in-out infinite',
        'pulse-soft':   'pulse-soft 3s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
      },
      keyframes: {
        'gradient-pan': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':      { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'walk': {
          '0%':   { transform: 'translateX(-80px) scaleX(1)' },
          '48%':  { transform: 'translateX(calc(100% + 20px)) scaleX(1)' },
          '49%':  { transform: 'translateX(calc(100% + 20px)) scaleX(-1)' },
          '97%':  { transform: 'translateX(-80px) scaleX(-1)' },
          '98%':  { transform: 'translateX(-80px) scaleX(1)' },
          '100%': { transform: 'translateX(-80px) scaleX(1)' },
        },
        'blink': {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '94%, 96%':      { transform: 'scaleY(0.1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '0.85' },
        },
      },
      boxShadow: {
        'glow-orange': '0 30px 70px -20px rgba(255,106,31,.45)',
        'glow-peach':  '0 30px 70px -20px rgba(255,138,61,.4)',
        'glass':       '0 24px 60px -20px rgba(26,20,16,.25), inset 0 1px 0 rgba(255,255,255,.7)',
      },
      backdropBlur: { 'xs': '2px' },
    },
  },
  plugins: [],
};
