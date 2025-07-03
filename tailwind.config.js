/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // TikTok brand colors
        tiktok: {
          black: '#000000',
          pink: '#FF0050',
        },
        // Reddit brand colors
        reddit: {
          orange: '#FF4500',
        },
        // Pinterest brand colors
        pinterest: {
          red: '#E60023',
        },
        // Snapchat brand colors
        snapchat: {
          yellow: '#FFFC00',
        },
      },
    },
  },
  plugins: [],
};