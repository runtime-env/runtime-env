import { defineConfig } from "vitest/config";
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig({
  plugins: [
    runtimeEnv({
      genTs: {},
      genJs: {
        envFile: [".env"],
      },
      interpolateIndexHtml: {
        envFile: [".env"],
      },
    }),
  ],
  test: {
    setupFiles: ["./public/runtime-env.js"],
  },
});
