/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        brand: ["Lexend", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          primary: "#570DF8",
          secondary: "#F000B8",
          accent: "#37CDBE",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
          "--animation-btn": "0s", // duration of animation when you click on button
          "--btn-text-case": "normal-case", // set default text transform for buttons
          "--btn-focus-scale": "1", // scale transform of button when you focus on it
        },
        dark: {
          primary: "#570DF8",
          secondary: "#F000B8",
          accent: "#37CDBE",
          neutral: "#3D4451",
          "base-100": "#2a303c",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
          "--animation-btn": "0s", // duration of animation when you click on button
          "--btn-text-case": "normal-case", // set default text transform for buttons
          "--btn-focus-scale": "1", // scale transform of button when you focus on it
        },
        darker: {
          primary: "#570DF8",
          secondary: "#F000B8",
          accent: "#37CDBE",
          neutral: "#1e2228",
          "base-100": "#15181e",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
          "--animation-btn": "0s", // duration of animation when you click on button
          "--btn-text-case": "normal-case", // set default text transform for buttons
          "--btn-focus-scale": "1", // scale transform of button when you focus on it
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
