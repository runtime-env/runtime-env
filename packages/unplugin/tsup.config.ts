import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    vite: "src/vite.ts",
    webpack: "src/webpack.ts",
    rspack: "src/rspack.ts",
    rollup: "src/rollup.ts",
    esbuild: "src/esbuild.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["unplugin"],
});
