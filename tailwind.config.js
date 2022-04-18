module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#EC4899",
          "secondary": "#5985d7",
          "accent": "#670775",
          "neutral": "#191D24",
          "base-100": "#202838",
          "info": "#2c3b49",
          "success": "#4ade80",
          "warning": "#fcd34d",
          "error": "#f87171",
        },
      },
    ],
  },
}
