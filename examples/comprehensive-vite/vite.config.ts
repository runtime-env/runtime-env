import { defineConfig } from "vitest/config";
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig({
  plugins: [runtimeEnv()],
});
