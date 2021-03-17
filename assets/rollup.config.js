import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import autoPreprocess from "svelte-preprocess";
import postcss from "rollup-plugin-postcss";
import {
  terser
} from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import copy from "rollup-plugin-copy";
import includeEnv from "svelte-environment-variables";

// it's production mode if MIX_ENV is "prod"
const production = process.env.MIX_ENV == "prod";

const main = {
  // main entry point
  input: "js/main.js",

  // define output path & format and request sourcemaps
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "../priv/static/js/main.js",
  },

  // define all the plugins we'd like to use
  plugins: [
    replace({
      ...includeEnv(),
    }),
    // the postcss plugin is used to preprocess css
    // for more info, see: https://www.npmjs.com/package/rollup-plugin-postcss
    postcss({
      config: {
        path: "./postcss.config.js",
      },
    }),

    // the svelte plugin converts .svelte files to .js equivalent
    svelte({
      // the preprocessor plugin allows you to use <style type="scss"> or <script lang="typescript"> inside .svelte files
      // for more info, see: https://www.npmjs.com/package/svelte-preprocess
      preprocess: autoPreprocess(),

      // enable run-time checks when not in production
      dev: !production,

      // take css output and write it to priv/static
      css: (css) => {
        css.write("main.css");
      },
    }),

    // the resolve plugin resolves modules located in node_modules folder
    resolve({
      // resolve modules that are designed to run in browser
      browser: true,

      // a dependency in node_modules may have svelte inside it's node_modules folder
      // dedupe option prevents bundling those duplicates
      dedupe: ["svelte"],
    }),
    // {
    //   "node_modules/@fortawesome/fontawesome-free/webfonts": "../priv/static",
    //   verbose: true,
    // }
    copy({
      targets: [{
        src: "node_modules/@fortawesome/fontawesome-free/webfonts",
        dest: "../priv/static"
      }]
    }),

    // use commonjs import convention
    commonjs(),

    // for production builds, use minification
    production && terser(),
  ],

  // don't clear terminal screen after each re-compilation
  watch: {
    clearScreen: false,
  },
};

const svelteApp = name => ({
  // main entry point
  input: `components/${name}/js/main.js`,

  // define output path & format and request sourcemaps
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: `../priv/static/components/${name}/${name}.js`,
  },

  // define all the plugins we'd like to use
  plugins: [
    replace({
      ...includeEnv(),
    }),
    // the postcss plugin is used to preprocess css
    // for more info, see: https://www.npmjs.com/package/rollup-plugin-postcss
    postcss(),

    // the svelte plugin converts .svelte files to .js equivalent
    svelte({
      // the preprocessor plugin allows you to use <style type="scss"> or <script lang="typescript"> inside .svelte files
      // for more info, see: https://www.npmjs.com/package/svelte-preprocess
      preprocess: autoPreprocess(),

      // enable run-time checks when not in production
      dev: !production,

      // take css output and write it to priv/static
      css: (css) => {
        css.write(`${name}.css`);
      },
    }),

    // the resolve plugin resolves modules located in node_modules folder
    resolve({
      // resolve modules that are designed to run in browser
      browser: true,

      // a dependency in node_modules may have svelte inside it's node_modules folder
      // dedupe option prevents bundling those duplicates
      dedupe: ["svelte"],
    }),

    // use commonjs import convention
    commonjs(),

    // for production builds, use minification
    production && terser(),
  ],

  // don't clear terminal screen after each re-compilation
  watch: {
    clearScreen: false,
  },
});

export default [
  main,
  svelteApp("numbers"),
  svelteApp("connect")
]