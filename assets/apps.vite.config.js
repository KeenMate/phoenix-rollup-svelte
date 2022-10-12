import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

const appName = process.env.SVELTE_APP;

console.debug(`[BUILDING] ${process.env.SVELTE_APP}`);
export default defineConfig(({ mode }) => {
  const production = mode === "prod";
  // ...
  return {
    build: {
      minify: "terser",

      emptyOutDir: true,

      sourcemap: true,
      lib: {
        entry: `apps/${appName}/js/main.js`,
        name: "app",
        fileName: `main`,
      },
      outDir: `../priv/static/apps/${appName}/`,
      // rollupOptions: {
      //   external: ["apps-manager", "notification-manager"],
      //   output: {
      //     globals: {
      //       "apps-manager": "AppsManager",
      //       "notification-manager": "NotificationManager",
      //     },
      //   },
      // },
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
    ],
  };
});
