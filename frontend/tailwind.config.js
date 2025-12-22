/** @type {import('tailwindcss').Config} */
export default {
  // Enable dark mode with class strategy
  darkMode: 'class',
  
  // Configure which files to scan for class names
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        // Custom colors if needed
      },
      animation: {
        blob: 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
    },
  },
  
  plugins: [],
}

