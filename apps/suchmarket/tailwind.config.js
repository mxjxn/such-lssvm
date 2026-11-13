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
        ink: '#121212',
        paper: '#F8F8F6',
        mist: '#EFEFED',
        line: '#E2E2DE',
        mute: '#5C5C5C',
        soft: '#8A8A86',
        forest: '#2C5F4F',
        'forest-deep': '#1E4338',
        clay: '#A65D4E',
        warn: '#8B4513',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-sora)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(18,18,18,0.04), 0 8px 24px rgba(18,18,18,0.04)',
      },
    },
  },
  plugins: [],
}
