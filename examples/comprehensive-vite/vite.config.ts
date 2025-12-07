import runtimeEnv from "@runtime-env/unplugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    runtimeEnv({
      ts: { outputFile: "src/runtime-env.d.ts" },
      js: { envFile: [".env"] },
      interpolate: { envFile: [".env"] },
    }),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      filename: "sw.js",
      manifest: false,
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        additionalManifestEntries: [
          {
            url: "runtime-env.js",
            revision: "placeholder",
          },
        ],
      },
    }),
  ],
  test: {
    setupFiles: ["./public/runtime-env.js"],
  },
});
