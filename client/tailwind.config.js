/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tb: {
          'sidebar-light':       '#E6F1FB',
          'sidebar-border':      '#B5D4F4',
          'main-light':          '#F0F7FF',
          'stat-light':          '#DAEEFF',
          'nav-active':          '#B5D4F4',
          'text-dark':           '#0C447C',
          'text-mid':            '#185FA5',
          'text-blue':           '#378ADD',
          'text-light':          '#85B7EB',
          'sidebar-dark':        '#0F2447',
          'sidebar-dark-border': '#1A3A6B',
          'main-dark':           '#0D1B2E',
          'header-dark':         '#122040',
          'stat-dark':           '#122040',
          'nav-active-dark':     '#1A3A6B',
          'border-dark':         '#1E3A5F',
          'text-white':          '#E8F1FF',
          'text-mid-dark':       '#7BA3D4',
          'text-dim':            '#4A6FA5',
          'accent':              '#3B82F6',
        },
      },
    },
  },
  plugins: [],
}
