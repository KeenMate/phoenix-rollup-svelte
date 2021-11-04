const production = process.env.MIX_ENV == "prod";

module.exports = {
  purge: {
    enabled: production,
    content: [
      "./apps/**/*.svelte",
      "../lib/rollup_test_web/templates/**/*.html.*eex"
    ]
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
