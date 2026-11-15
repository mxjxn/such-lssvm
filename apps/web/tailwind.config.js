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
        ink: '#0f172a',
        paper: '#f8fafc',
        mist: '#e2e8f0',
        line: '#cbd5e1',
        mute: '#64748b',
        soft: '#94a3b8',
        accent: {
          DEFAULT: '#334155',
          deep: '#1e293b',
        },
        highlight: {
          DEFAULT: '#2563eb',
          deep: '#1d4ed8',
        },
        clay: '#b91c1c',
        warn: '#b45309',
        'orange-deep': '#1e293b',
        'sky-deep': '#1d4ed8',
        forest: '#334155',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}