import type { Plugin, UserConfig, ConfigEnv } from "vite";
import { resolve } from "path";
import { rmSync } from "fs";
import { Options } from "./types.js";
import {
  isTypeScriptProject,
  runRuntimeEnvCommand,
  getTempDir,
} from "./utils.js";

export function vitestPlugin(options: Options): Plugin {
  return {
    name: "runtime-env-vitest",

    config(config: UserConfig, configEnv: ConfigEnv) {
      if (config.mode === "test") {
        // Generate runtime-env.d.ts for Vitest type checking
        if (isTypeScriptProject(config.root || process.cwd())) {
          runRuntimeEnvCommand("gen-ts", options, "src/runtime-env.d.ts");
        }
        // Generate runtime-env.js for Vitest runtime access
        if (options.genJs) {
          const vitestOutputDir = getTempDir("vitest");
          const vitestOutputPath = resolve(vitestOutputDir, "runtime-env.js");

          // Ensure directory is clean
          rmSync(vitestOutputDir, { recursive: true, force: true });
          getTempDir("vitest"); // Re-create it clean

          runRuntimeEnvCommand("gen-js", options, vitestOutputPath);
        }
      }
    },
  };
}
