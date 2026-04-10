import { fileURLToPath } from 'url'
import { dirname } from 'path'
const _dir = dirname(fileURLToPath(import.meta.url)).replace(/\\/g, '/')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    `${_dir}/index.html`,
    `${_dir}/src/**/*.js`,
    `${_dir}/src/**/*.jsx`,
  ],
  theme: {
    extend: {
      colors: {
        terminal: '#00d084',
        brand: '#7c3aed',
        surface: '#111118',
        card: '#1a1a2e',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'type': 'typing 0.05s steps(1) forwards',
        'blink': 'blink 1s step-end infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glow: { '0%,100%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(124,58,237,0.6)' } },
      },
    },
  },
  plugins: [],
}
