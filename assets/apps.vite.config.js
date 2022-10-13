import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import { visualizer } from "rollup-plugin-visualizer";

const appName = process.env.SVELTE_APP;

console.debug(`[BUILDING] ${process.env.SVELTE_APP}`);
export default defineConfig(({ mode }) => {
  const production = mode === "prod";
  const ci = process.env.CI == "true";

  // ...
  return {
    build: {
      emptyOutDir: true,
      minify: production ? "esbuild" : false,
      sourcemap: !production,
      lib: {
        entry: `apps/${appName}/js/main.js`,
        name: "app",
        fileName: `main`,
      },
      outDir: `../priv/static/apps/${appName}/`,
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
      ci && visualizer({ filename: `stats/${appName}.html` }),
    ],
  };
});
