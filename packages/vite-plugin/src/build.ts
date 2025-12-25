import type { Plugin, UserConfig, ConfigEnv } from "vite";
import { isTypeScriptProject, runRuntimeEnvCommand } from "./utils.js";

export function buildPlugin(): Plugin {
  return {
    name: "runtime-env-build",

    config(config: UserConfig, configEnv: ConfigEnv) {
      if (configEnv.command === "build") {
        if (isTypeScriptProject(config.root || process.cwd())) {
          runRuntimeEnvCommand("gen-ts", "src/runtime-env.d.ts");
        }
      }
    },
  };
}
