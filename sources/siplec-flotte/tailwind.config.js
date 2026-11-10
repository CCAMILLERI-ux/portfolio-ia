/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1C2E5D', 900: '#14224A', 50: '#EEF1F8' },
        brand: { DEFAULT: '#0066CC', 700: '#0052A3', 50: '#E8F1FB', 100: '#CCE0F5' },
        accent: { DEFAULT: '#FF6633', 700: '#C2410C', 50: '#FFF1EB', 100: '#FFDCCD' },
        surface: '#F5F7FA',
      },
      fontFamily: {
        title: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,46,93,0.06), 0 1px 3px rgba(28,46,93,0.08)',
        pop: '0 12px 32px rgba(28,46,93,0.18)',
      },
    },
  },
  plugins: [],
};
