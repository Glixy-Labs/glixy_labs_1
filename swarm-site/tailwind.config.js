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
        // Match the main static site palette exactly
        bg:    '#fff8f1',
        cream: '#fdf3e7',
        panel: '#ffffff',
        line:  'rgba(26, 20, 16, 0.10)',
        edge:  'rgba(26, 20, 16, 0.18)',
        ink: {
          0:   '#0f0a07',
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
          orange:    '#ff6a1f',
          peach:     '#ff8a3d',
          light:     '#ffb37a',
          deep:      '#e55510',
          cream:     '#ffeede',
        },
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(ellipse 80% 60% at 50% 0%, #ffb37a 0%, #ffc9a0 25%, #ffe0c4 50%, #fff3e2 75%, #fff8f1 100%)',
        'orb-orange':
          'radial-gradient(circle at 50% 50%, rgba(255,138,61,0.35), transparent 60%)',
        'orb-peach':
          'radial-gradient(circle at 50% 50%, rgba(255,179,122,0.40), transparent 60%)',
      },
      animation: {
        'gradient-pan': 'gradient-pan 6s ease infinite',
        'float-slow':   'float 7s ease-in-out infinite',
        'float-med':    'float 5s ease-in-out infinite',
        'pulse-soft':   'pulse-soft 3s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
        'shimmer':      'shimmer 2.2s linear infinite',
        'dash':         'dash 4s linear infinite',
      },
      keyframes: {
        'gradient-pan': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':      { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '0.9' },
        },
        'shimmer': {
          '0%':   { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        'dash': {
          'to': { 'stroke-dashoffset': '-60' },
        },
      },
      boxShadow: {
        'glow-orange': '0 30px 70px -20px rgba(255,106,31,.45)',
        'glow-peach':  '0 30px 70px -20px rgba(255,138,61,.40)',
        'card':        '0 24px 60px -30px rgba(26,20,16,.30), inset 0 1px 0 rgba(255,255,255,.6)',
      },
    },
  },
  plugins: [],
};
