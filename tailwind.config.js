/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        secondary: '#FB923C',
        accent: '#FDBA74',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(249, 115, 22, 0.15)',
        'glass-sm': '0 4px 16px 0 rgba(249, 115, 22, 0.1)',
        'glass-lg': '0 12px 48px 0 rgba(249, 115, 22, 0.2)',
        'glow': '0 0 20px rgba(249, 115, 22, 0.4)',
        'glow-orange': '0 0 25px rgba(249, 115, 22, 0.5)',
        'glow-light': '0 0 20px rgba(251, 146, 60, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-game': 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
        'gradient-button': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
      },
    },
  },
  plugins: [],
}
