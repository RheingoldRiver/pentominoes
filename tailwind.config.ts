/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateAreas: {
        game: [
          "settings settings .",
          "wordmark wordmark wordmark",
          ". header .",
          ". gameToolbar .",
          ". board .",
          "footer footer footer",
        ],
        game2xl: ["wordmark wordmark settings", ". header .", ". gameToolbar .", ". board .", "footer footer footer"],
      },
      gridTemplateColumns: {
        game: "auto max-content auto",
      },
      gridTemplateRows: {
        game: "max-content max-content max-content max-content max-content auto",
        game2xl: "max-content max-content max-content max-content auto",
      },
    },
  },
  plugins: [require("@savvywombat/tailwindcss-grid-areas")],
  darkMode: "class",
};
