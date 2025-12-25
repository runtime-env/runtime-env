import type { Plugin, PreviewServer } from "vite";
import { resolve } from "path";
import { copyFileSync, existsSync } from "fs";
import { Options, optionSchema } from "./types.js";
import { runRuntimeEnvCommand } from "./utils.js";

export function previewPlugin(options: Options): Plugin {
  return {
    name: "runtime-env-preview",

    configurePreviewServer(server: PreviewServer) {
      const { genJs, interpolateIndexHtml } = optionSchema.parse(options);

      if (genJs) {
        runRuntimeEnvCommand(
          "gen-js",
          options,
          resolve("dist", "runtime-env.js"),
        );
      }
      if (interpolateIndexHtml) {
        if (existsSync("dist/index.html.backup") === false) {
          copyFileSync("dist/index.html", "dist/index.html.backup");
        }
        runRuntimeEnvCommand(
          "interpolate",
          options,
          resolve("dist", "index.html"),
          resolve("dist", "index.html.backup"),
        );
      }
    },
  };
}
