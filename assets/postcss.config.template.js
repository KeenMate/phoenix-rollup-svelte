const production = process.env.MIX_ENV == "prod";

module.exports = {
  plugins: [
    require("autoprefixer"),
    require("cssnano")
  ],
};