/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#080B0F',
        'bg-secondary': '#0D1117',
        'bg-tertiary': '#161B22',
        'bg-hover': '#1C2128',
        'accent-green': '#00FF94',
        'accent-green-dim': '#00CC77',
        'accent-red': '#FF3B3B',
        'accent-amber': '#FFB800',
        'accent-blue': '#4D9EFF',
        'accent-purple': '#BF5FFF',
        'text-primary': '#E6EDF3',
        'text-secondary': '#8B949E',
        'text-tertiary': '#484F58',
        'border': '#30363D',
        'border-active': '#00FF94',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        'tight-custom': '-0.02em',
        'wide-custom': '0.08em',
        'wider-custom': '0.1em',
      },
    },
  },
  plugins: [],
}
