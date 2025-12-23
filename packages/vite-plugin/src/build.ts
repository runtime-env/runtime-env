import type { Plugin, UserConfig, ConfigEnv, ResolvedConfig } from "vite";
import { resolve } from "path";
import { rmSync } from "fs";
import { Options } from "./types.js";
import { runRuntimeEnvCommand } from "./utils.js";

export function buildPlugin(options: Options) {
  return {
    name: "runtime-env-build",

    config(config: UserConfig, configEnv: ConfigEnv) {
      if (configEnv.command === "build") {
        if (options.genTs && options.genTs.outputFile) {
          runRuntimeEnvCommand("gen-ts", options, options.genTs.outputFile);
        }
      }
    },

    configResolved(config: ResolvedConfig) {
      // In build mode, we remove the generated runtime-env.js from publicDir
      // as it's typically bundled or interpolated directly into index.html.
      if (config.command === "build") {
        if (options.genJs) {
          const publicDir =
            typeof config.publicDir === "string" ? config.publicDir : "";
          rmSync(resolve(publicDir, "runtime-env.js"), { force: true });
        }
      }
    },
  };
}
