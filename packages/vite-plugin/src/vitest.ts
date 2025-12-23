import type { Plugin, UserConfig, ConfigEnv } from "vite";
import { resolve } from "path";
import { rmSync, mkdirSync } from "fs";
import { Options } from "./types.js";
import { runRuntimeEnvCommand } from "./utils.js";

export function vitestPlugin(options: Options) {
  return {
    name: "runtime-env-vitest",

    config(config: UserConfig, configEnv: ConfigEnv) {
      if (config.mode === "test") {
        // Generate runtime-env.d.ts for Vitest type checking
        if (options.genTs && options.genTs.outputFile) {
          runRuntimeEnvCommand("gen-ts", options, options.genTs.outputFile);
        }
        // Generate runtime-env.js for Vitest runtime access
        if (options.genJs) {
          const vitestOutputPath = resolve(
            "node_modules",
            ".vitest-runtime-env",
            "runtime-env.js",
          );
          // Ensure directory exists and is clean
          const vitestOutputDir = resolve(
            "node_modules",
            ".vitest-runtime-env",
          );
          rmSync(vitestOutputDir, { recursive: true, force: true });
          mkdirSync(vitestOutputDir, { recursive: true });

          runRuntimeEnvCommand("gen-js", options, vitestOutputPath);
        }
      }
    },
  };
}
