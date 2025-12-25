import type { Plugin } from "vite";
import { devPlugin } from "./dev.js";
import { buildPlugin } from "./build.js";
import { previewPlugin } from "./preview.js";
import { vitestPlugin } from "./vitest.js";

export default function runtimeEnv(): Plugin[] {
  return [devPlugin(), buildPlugin(), previewPlugin(), vitestPlugin()];
}
