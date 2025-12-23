import type { Plugin } from "vite";
import { devPlugin } from "./dev.js";
import { buildPlugin } from "./build.js";
import { previewPlugin } from "./preview.js";
import { vitestPlugin } from "./vitest.js";
import { Options } from "./types.js";

export default function runtimeEnv(options: Options): Plugin[] {
  return [
    devPlugin(options),
    buildPlugin(options),
    previewPlugin(options),
    vitestPlugin(options),
  ];
}
