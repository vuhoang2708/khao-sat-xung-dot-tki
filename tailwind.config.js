/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        competing: {
          light: '#FEE2E2',
          DEFAULT: '#EF4444',
          dark: '#B91C1C',
        },
        collaborating: {
          light: '#D1FAE5',
          DEFAULT: '#10B981',
          dark: '#047857',
        },
        compromising: {
          light: '#FEF3C7',
          DEFAULT: '#F59E0B',
          dark: '#B45309',
        },
        avoiding: {
          light: '#F1F5F9',
          DEFAULT: '#64748B',
          dark: '#334155',
        },
        accommodating: {
          light: '#E0E7FF',
          DEFAULT: '#6366F1',
          dark: '#4338CA',
        },
        brand: {
          dark: '#090D16',
          primary: '#0F172A',
          secondary: '#1E293B',
          accent: '#4F46E5',
          surface: '#F8FAFC',
          border: '#334155',
        }
      }
    },
  },
  plugins: [],
}
