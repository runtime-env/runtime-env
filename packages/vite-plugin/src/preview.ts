import type { Plugin, UserConfig, ConfigEnv, PreviewServer } from "vite";
import { resolve } from "path";
import { copyFileSync, existsSync } from "fs";
import { Options, optionSchema } from "./types.js";
import {
  runRuntimeEnvCommand,
  schemaFile,
  globalVariableName,
} from "./utils.js";

export function previewPlugin(options: Options) {
  const { genJs, interpolateIndexHtml } = optionSchema.parse(options);

  return {
    name: "runtime-env-preview",

    configurePreviewServer(server: PreviewServer) {
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

    config(config: UserConfig, configEnv: ConfigEnv) {
      // config hook left empty as logic moved to configurePreviewServer
    },
  };
}
