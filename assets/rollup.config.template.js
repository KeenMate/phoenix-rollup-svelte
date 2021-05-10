import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sveltePreprocess from "svelte-preprocess";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import copy from "rollup-plugin-copy";
import includeEnv from "svelte-environment-variables";
import virtual from "@rollup/plugin-virtual"
import filesize from 'rollup-plugin-filesize'
import { visualizer } from 'rollup-plugin-visualizer';

// it's production mode if MIX_ENV is "prod"
const production = process.env.MIX_ENV == "prod";
const ci = process.env.CI == "true";

console.log("Production:", production)

// --------- Define apps here ---------
// LIST OF APP NAMES COMES HERE IN FORMAT "app1", "app2" WHERE THE NAMES ARE FOLDERS IN APPS FOLDER
let apps = []
// ------------------------------------

const appBasePath = (name) => `/apps/${name}`
const appScriptPath = (name) => `${appBasePath(name)}/${name}.js`
const appStylePath = (name) => `${appBasePath(name)}/${name}.css`

const manifestExportPlugin = manifest => ({
  name: 'manifestExport',
  generateBundle(outputOptions, bundle) {
    this.emitFile({
      type: 'asset',
      fileName: 'manifest.json',
      source: JSON.stringify(manifest)
    });
  }
})

const manifestEntry = (name) => ({
  name: name,
  scriptPath: appScriptPath(name),
  stylePath: appStylePath(name)
})

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
      preventAssignment: true
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
      preprocess: sveltePreprocess({
        sourceMap: !production,
        postcss: {
          config: {
            path: "./postcss.config.js",
          },
        },
      }),

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

    copy({
      targets: [{
        src: "node_modules/@fortawesome/fontawesome-free/webfonts",
        dest: "../priv/static"
      },
      {
        src: "static/*",
        dest: "../priv/static"
      },
      {
        src: "images/*",
        dest: "../priv/static/images"
      }]
    }),

    // use commonjs import convention
    commonjs(),

    // for production builds, use minification
    production && terser(),
    production && filesize(),
    !ci && visualizer({
      filename: `stats/main.html`,
      gzipSize: true
    })
  ],

  // don't clear terminal screen after each re-compilation
  watch: {
    clearScreen: false,
  },
};

const svelteAppConfiguration = name => ({
  // main entry point
  input: `.${appBasePath(name)}/js/main.js`,
  
  // OTHER GLOBAL CLASS NAMES DEFINED FEW LINES BELOW, THESE NAMES ARE THEN USED IN APPS AS IMPORTS
  external: ['apps-manager'],

  // define output path & format and request sourcemaps
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: `../priv/static${appScriptPath(name)}`,
    // 'OTHER COMMON CLASS NAME': 'OTHER COMMON CLASS FILE NAME INSIDE js FOLDER'
    globals: {
      'apps-manager': 'AppsManager'      
    }
  },

  // define all the plugins we'd like to use
  plugins: [
    replace({
      ...includeEnv(),
      preventAssignment: true
    }),
    // the postcss plugin is used to preprocess css
    // for more info, see: https://www.npmjs.com/package/rollup-plugin-postcss
    postcss(),

    // the svelte plugin converts .svelte files to .js equivalent
    svelte({
      // the preprocessor plugin allows you to use <style type="scss"> or <script lang="typescript"> inside .svelte files
      // for more info, see: https://www.npmjs.com/package/svelte-preprocess
      preprocess: sveltePreprocess({
        sourceMap: !production,
        postcss: {
          config: {
            path: "./postcss.config.js",
          },
        },
      }),

      // enable run-time checks when not in production
      dev: !production,

      // enable custom elements API
      // TODO: config value
      // customElement: name === "like",

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
    production && filesize(),
    !ci && visualizer({
      filename: `stats/${name}.html`,
      gzipSize: true
    })
  ],

  // don't clear terminal screen after each re-compilation
  watch: {
    clearScreen: false,
  },
});

const manifestConfiguration = manifest => ({
  input: "entry",
  output: {
    dir: "../priv/static/apps"
  },
  plugins: [
    virtual({ entry: "" }),
    manifestExportPlugin(manifest)
  ],
})

let svelteApps = (apps) => {
  return {
    configurations: apps.map(svelteAppConfiguration),
    manifest: apps.reduce((o, key) => ({ ...o, [key]: manifestEntry(key) }), {})
  }
}

let svelteConfiguration = svelteApps(apps)

export default [
  main,
  ...svelteConfiguration.configurations,
  manifestConfiguration(svelteConfiguration.manifest)
]