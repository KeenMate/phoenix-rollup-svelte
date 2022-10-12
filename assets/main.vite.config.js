import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import copy from "rollup-plugin-copy";

export default defineConfig(({ mode }) => {
  const production = mode === "prod";

  // ...
  return {
    
    build: {
      
      minify: false,
      target: "es2016",
      lib: {
        entry: "js/main.js",
        format: "iife",
        name: "app",
        fileName: "main",
      },
      outDir: "../priv/static/js",
    },
    resolve: {
      dedupe: ["svelte"],
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess({
          sourceMap: !production,
          postcss: true,
        }),
        dev: !production,
      }),

      copy({
        copyOnce: true,
        targets: [
          {
            src: "node_modules/@fortawesome/fontawesome-free/webfonts",
            dest: "../priv/static",
          },
          {
            src: "static/*",
            dest: "../priv/static",
          },
          {
            src: "images/*",
            dest: "../priv/static/images",
          },
        ],
      }),
    ],
  };
});
