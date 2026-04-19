/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["CircularStd", '"Circular Std Book"', '"Circular Std"', "sans-serif"],
        body: ["CircularStd", '"Circular Std Book"', '"Circular Std"', "sans-serif"],
        display: ['"Neue Haas Grotesk Display Pro"', "sans-serif"],
        heading: ['"Neue Haas Grotesk Display Pro"', "sans-serif"],
      },
      fontWeight: {
        medium: 500,
        semibold: 600,
        bold: 1200,
      },
      content: {
        about: 'url("/src/assets/img/outline-text/about.svg")',
      },
      colors: {
        background: "#F7F6F0",
        primary: "#1ed760",
        primary_dark: "#191919",
        primary_mid: "#272727",
        secondary: "#1ed760",
        card: "#FFFFFF",
        card_dark: "#191919",
        card_mid: "#272727",
        hint: "#605E5E",
        darkhint: "#B0B5BE",
        tertiary: "#131419",
        dark: "#000000",
        darker: "#191919",
        darkest: "#272727",
        light: "#FFFFFF",
        xdarkshadow: "#373C45",
        ydarkshadow: "#181920",
        xlightshadow: "#A3B1C6",
        ylightshadow: "#FFFFFF",
        accent: {
          DEFAULT: "#1ed760",
          hover: "#1aa84a",
          dark: "#191919",
          mid: "#272727",
        },
        paragraph: "#ffffff",
        text: {
          primary: "#ffffff",
          secondary: "#cccccc",
          tertiary: "#999999",
        },
      },
    },
  },
  plugins: [],
};
