import type { Plugin, UserConfig, ConfigEnv, ResolvedConfig } from "vite";
import { resolve } from "path";
import { rmSync } from "fs";
import { Options } from "./types.js";
import { isTypeScriptProject, runRuntimeEnvCommand } from "./utils.js";

export function buildPlugin(options: Options): Plugin {
  return {
    name: "runtime-env-build",

    config(config: UserConfig, configEnv: ConfigEnv) {
      if (configEnv.command === "build") {
        if (isTypeScriptProject(config.root || process.cwd())) {
          runRuntimeEnvCommand("gen-ts", options, "src/runtime-env.d.ts");
        }
      }
    },

    configResolved(config: ResolvedConfig) {
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
