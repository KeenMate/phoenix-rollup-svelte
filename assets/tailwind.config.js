const production = process.env.MIX_ENV == "prod";

module.exports = {
  purge: {
    enabled: production,
    content: ["./apps/**/*.svelte"]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
