/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'Tahoma', 'sans-serif']
      },
      colors: {
        // هوية ALKAABI TECH: خلفية دافئة، ورشة/تقني بدل ألوان SaaS الجاهزة
        paper: '#F6F4EF',
        ink: '#1C2321',
        graphite: '#2E3532',
        copper: {
          DEFAULT: '#B5652D',
          light: '#D98B4F',
          dark: '#8C4A1F'
        },
        status: {
          new: '#5B6B78',
          inspecting: '#C99A3B',
          progress: '#B5652D',
          needsInfo: '#B5482E',
          completed: '#3E7C5A',
          delivered: '#2C5F45',
          cancelled: '#7A6F68'
        }
      },
      boxShadow: {
        ticket: '0 1px 0 rgba(28,35,33,0.06), 0 2px 8px rgba(28,35,33,0.06)'
      }
    }
  },
  plugins: []
}
