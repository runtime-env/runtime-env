import type { Plugin, UserConfig, ConfigEnv } from "vite";
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
  };
}
