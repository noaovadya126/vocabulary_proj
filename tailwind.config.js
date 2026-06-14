/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f9',
          100: '#ffe8f1',
          200: '#ffd1e3',
          300: '#ffb3cf',
          400: '#f78fb3',
          500: '#e8759a',
          600: '#c95a7e',
          700: '#a84866',
          800: '#863a52',
        },
        pastel: {
          pink: '#ffe0ef',
          'pink-light': '#fff5fa',
          green: '#d4f5e2',
          'green-light': '#f0fbf5',
          mint: '#c8edd8',
          sage: '#b8dcc8',
          lavender: '#e8dff5',
          peach: '#ffe8dc',
          sky: '#dceef8',
          rose: '#fce8ef',
          cream: '#fffbfc',
        },
        primary: {
          50: '#fff5f9',
          100: '#ffe8f1',
          200: '#ffd1e3',
          500: '#e8759a',
          600: '#c95a7e',
          700: '#a84866',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#b8e0c8',
          500: '#6db89a',
          600: '#4f9a7d',
        },
        muted: {
          50: '#fffbfc',
          100: '#fff5f9',
          200: '#f0ebe8',
          300: '#d4cfc8',
          400: '#a8a29c',
          500: '#78716c',
          600: '#5c5650',
          700: '#44403c',
          800: '#292524',
        },
        background: '#fffbfc',
      },
      fontFamily: {
        'noto-kr': ['Noto Sans KR', 'sans-serif'],
        heebo: ['Heebo', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'mascot-float': 'mascotFloat 3.5s ease-in-out infinite',
        'mascot-bounce': 'mascotBounce 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        mascotFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        mascotBounce: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-6px) scale(1.02)' },
        },
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 2px 20px -3px rgba(232, 117, 154, 0.12), 0 8px 16px -4px rgba(109, 184, 154, 0.08)',
        medium: '0 4px 28px -5px rgba(232, 117, 154, 0.15), 0 12px 20px -6px rgba(109, 184, 154, 0.1)',
        cute: '0 8px 32px -8px rgba(255, 182, 213, 0.35), 0 4px 12px -4px rgba(184, 224, 200, 0.25)',
      },
      backgroundImage: {
        'pastel-gradient': 'linear-gradient(135deg, #fff0f6 0%, #e8f8ef 50%, #fffbfc 100%)',
        'hub-hero': 'linear-gradient(120deg, rgba(255,214,232,0.6) 0%, rgba(200,237,216,0.5) 55%, rgba(255,251,252,0.9) 100%)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
