/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateAreas: {
        game: [
          "settings settings .",
          "wordmark wordmark wordmark",
          "header header header",
          ". gameToolbar .",
          ". board .",
          ". botToolbar .",
          "footer footer footer",
        ],
        gamexl: [
          "settings settings .",
          "wordmark wordmark wordmark",
          ". header .",
          ". gameToolbar .",
          ". board .",
          ". botToolbar .",
          "footer footer footer",
        ],
        game2xl: [
          "wordmark wordmark settings",
          ". header .",
          ". gameToolbar .",
          ". board .",
          ". botToolbar .",
          "footer footer footer",
        ],
      },
      gridTemplateColumns: {
        game: "auto max-content auto",
      },
      gridTemplateRows: {
        game: "max-content max-content max-content max-content max-content max-content auto",
        game2xl: "max-content max-content max-content max-content max-content auto",
      },
      dropShadow: {
        smIcon: "0 0 1px rgba(214, 211, 209)",
        mdIcon: ["0 0 2px rgb(214, 211, 209)", "0 0 1px rgb(214, 211, 209)"],
        lgIcon: ["0 0 4px rgb(214, 211, 209)", "0 0 2px rgb(214, 211, 209)"],
      },
    },
  },
  plugins: [require("@savvywombat/tailwindcss-grid-areas")],
  darkMode: "class",
};
