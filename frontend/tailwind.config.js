/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-hover': 'var(--bg-hover)',
        'accent-green': 'var(--accent-green)',
        'accent-green-dim': 'var(--accent-green-dim)',
        'accent-red': 'var(--accent-red)',
        'accent-amber': 'var(--accent-amber)',
        'accent-blue': 'var(--accent-blue)',
        'accent-purple': 'var(--accent-purple)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'border': 'var(--border)',
        'border-active': 'var(--border-active)',
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
