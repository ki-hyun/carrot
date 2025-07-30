/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: "var(--roboto-text)",
        rubick: "var(--rubick-text)",
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      margin: {
        tomato: "20px",
      },
      borderRadius: {
        "sexy-name": "11.11px",
      },
    },
  },
  plugins: [],
} 

// theme: {
//   extend: {
//     colors: {
//       background: 'var(--background)',
//       foreground: 'var(--foreground)',
//     },
//   },
// },