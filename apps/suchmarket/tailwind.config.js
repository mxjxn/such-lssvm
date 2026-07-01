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
        obsidian: '#07040f',
        velvet: '#12081f',
        imperial: '#2a1545',
        burgundy: '#5c1838',
        crimson: '#8b2252',
        gold: '#c9a227',
        'gold-light': '#e8d48b',
        champagne: '#f4e4bc',
        rose: '#e8b4b8',
        parchment: '#faf3e8',
        jade: '#1a4d3e',
        'jade-light': '#2d7a62',
      },
      fontFamily: {
        display: ['var(--font-cinzel)', 'serif'],
        serif: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-playfair)', 'serif'],
        accent: ['var(--font-italiana)', 'serif'],
      },
      backgroundImage: {
        damask:
          'radial-gradient(ellipse at 20% 30%, rgba(201,162,39,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(139,34,82,0.12) 0%, transparent 50%)',
        'velvet-gradient': 'linear-gradient(180deg, #12081f 0%, #07040f 40%, #1a0a2e 100%)',
      },
      boxShadow: {
        gilded: '0 0 0 1px rgba(201,162,39,0.4), 0 4px 24px rgba(201,162,39,0.15)',
        baroque: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,162,39,0.25)',
      },
    },
  },
  plugins: [],
}
