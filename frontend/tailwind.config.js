/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DumbDee Brand Colors (simplified)
        'dumbdee-navy': {
          DEFAULT: '#000000',
          50: 'rgba(0, 0, 0, 0.05)',
          100: 'rgba(0, 0, 0, 0.1)',
          200: 'rgba(0, 0, 0, 0.2)',
          300: 'rgba(0, 0, 0, 0.3)',
          400: 'rgba(0, 0, 0, 0.4)',
          500: '#000000',
          600: 'rgba(0, 0, 0, 0.7)',
          700: 'rgba(0, 0, 0, 0.8)',
          800: 'rgba(0, 0, 0, 0.9)',
          900: '#000000',
          light: '#1a1a1a',
          dark: '#000000',
        },
        'dumbdee-golden': {
          DEFAULT: '#C0842B',
          50: 'rgba(192, 132, 43, 0.05)',
          100: 'rgba(192, 132, 43, 0.1)',
          200: 'rgba(192, 132, 43, 0.2)',
          300: 'rgba(192, 132, 43, 0.3)',
          400: 'rgba(192, 132, 43, 0.4)',
          500: '#C0842B',
          600: 'rgba(192, 132, 43, 0.7)',
          700: 'rgba(192, 132, 43, 0.8)',
          800: 'rgba(192, 132, 43, 0.9)',
          900: '#A66B1F',
          light: '#D4A555',
          dark: '#A66B1F',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #C0842B 0%, #D4A555 100%)',
        'gradient-golden': 'linear-gradient(135deg, #C0842B 0%, #D4A555 100%)',
        'gradient-golden-reverse': 'linear-gradient(135deg, #D4A555 0%, #C0842B 100%)',
        'gradient-navy-golden': 'linear-gradient(135deg, #000000 0%, #C0842B 100%)',
        'gradient-golden-navy': 'linear-gradient(135deg, #C0842B 0%, #000000 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-in-out',
        'fade-in-down': 'fadeInDown 0.5s ease-in-out',
        'slide-in-left': 'slideInLeft 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.5s ease-in-out',
        'bounce-in': 'bounceIn 0.6s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'golden': '0 4px 14px 0 rgba(192, 132, 43, 0.25)',
        'golden-lg': '0 10px 25px 0 rgba(192, 132, 43, 0.25)',
        'navy': '0 4px 14px 0 rgba(38, 39, 95, 0.25)',
        'navy-lg': '0 10px 25px 0 rgba(38, 39, 95, 0.25)',
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 32px 0 rgba(0, 0, 0, 0.16)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
            maxWidth: 'none',
            a: {
              color: '#C0842B',
              '&:hover': {
                color: '#A66B1F',
              },
            },
            h1: { color: '#000000' },
            h2: { color: '#000000' },
            h3: { color: '#000000' },
            h4: { color: '#000000' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

