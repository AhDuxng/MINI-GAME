// Cấu hình Tailwind: ánh xạ token màu bề mặt, dải màu ramp, font tiêu đề/nội dung và hiệu ứng sang class tiện ích
import type { Config } from 'tailwindcss';

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;
const RAMP_STOPS = Array.from({ length: 9 }, (_, index) => index);

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    borderRadius: {
      none: '0',
      sm: '6px',
      DEFAULT: '8px',
      md: '10px',
      lg: '12px',
      xl: '14px',
      '2xl': '18px',
      '3xl': '24px',
      full: '9999px',
    },
    extend: {
      colors: {
        canvas: token('canvas'),
        elevated: token('elevated'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        accent: token('accent'),
        edge: 'var(--edge)',
        syn: {
          comment: token('syn-comment'),
          string: token('syn-string'),
          keyword: token('syn-keyword'),
          function: token('syn-function'),
          type: token('syn-type'),
          number: token('syn-number'),
        },
        ramp: Object.fromEntries(RAMP_STOPS.map((stop) => [stop, `var(--ramp-${stop})`])),
        'ramp-text': Object.fromEntries(RAMP_STOPS.map((stop) => [stop, `var(--ramp-text-${stop})`])),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'ui-sans-serif', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(1.9rem, 6.2vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        section: ['clamp(1.75rem, 4.6vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        title: ['clamp(1.35rem, 3.2vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        card: '0 1px 2px rgb(0 0 0 / 0.04), 0 6px 18px -10px rgb(0 0 0 / 0.14)',
        lift: '0 2px 4px rgb(0 0 0 / 0.05), 0 18px 36px -16px rgb(0 0 0 / 0.28)',
        stage: '0 14px 34px -18px rgb(0 0 0 / 0.45)',
      },
      transitionTimingFunction: {
        house: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      spacing: {
        header: 'var(--header-height)',
        tabbar: 'var(--tabbar-height)',
      },
      keyframes: {
        waddle: {
          '0%, 100%': { transform: 'translateY(0) rotate(-5deg)' },
          '50%': { transform: 'translateY(-3px) rotate(5deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'slide-left': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'slide-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'cube-orbit': {
          from: { transform: 'rotateX(-28deg) rotateY(0deg)' },
          to: { transform: 'rotateX(-28deg) rotateY(360deg)' },
        },
        'tile-drop': {
          from: { transform: 'translateY(-40px) rotateX(-90deg)' },
          to: { transform: 'none' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotateX(var(--tilt-x, 0deg))' },
          '50%': { transform: 'translateY(-6px) rotateX(var(--tilt-x, 0deg))' },
        },
        drift: {
          from: { transform: 'translateX(-25%)' },
          to: { transform: 'translateX(110%)' },
        },
        flap: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(-0.6)' },
        },
      },
      animation: {
        waddle: 'waddle 0.35s ease-in-out infinite',
        shake: 'shake 0.3s ease-in-out',
        rise: 'rise 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'slide-left': 'slide-left 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'slide-right': 'slide-right 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'cube-orbit': 'cube-orbit 18s linear infinite',
        'tile-drop': 'tile-drop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        float: 'float 4s ease-in-out infinite',
        drift: 'drift 100s linear infinite',
        flap: 'flap 0.9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
