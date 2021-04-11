const production = process.env.MIX_ENV == "prod";

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("cssnano")
  ],
};