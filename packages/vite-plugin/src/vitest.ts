import type { Plugin, UserConfig, ConfigEnv, ResolvedConfig } from "vite";
import { resolve } from "path";
import { rmSync } from "fs";
import {
  isTypeScriptProject,
  runRuntimeEnvCommand,
  getTempDir,
  getViteEnvFiles,
  logError,
} from "./utils.js";

export function vitestPlugin(): Plugin {
  return {
    name: "runtime-env-vitest",

    config(config: UserConfig, configEnv: ConfigEnv) {
      if (config.mode === "test" || configEnv.mode === "test") {
        // Generate runtime-env.js for Vitest runtime access
        const vitestOutputDir = getTempDir("vitest");
        const vitestOutputPath = resolve(vitestOutputDir, "runtime-env.js");

        // Automatically inject setupFiles for Vitest
        const vitestConfig = (config as any).test || {};
        const setupFiles = vitestConfig.setupFiles || [];

        if (Array.isArray(setupFiles)) {
          setupFiles.push(vitestOutputPath);
        } else {
          vitestConfig.setupFiles = [setupFiles, vitestOutputPath];
        }

        (config as any).test = {
          ...vitestConfig,
          setupFiles,
        };
      }
    },

    configResolved(config: ResolvedConfig) {
      if (config.mode === "test") {
        const root = config.root || process.cwd();
        // Generate runtime-env.d.ts for Vitest type checking
        if (isTypeScriptProject(root)) {
          const result = runRuntimeEnvCommand("gen-ts", "src/runtime-env.d.ts");
          if (!result.success) {
            logError(
              config.logger,
              "Failed to generate runtime-env.d.ts",
              result.stderr || result.stdout,
            );
            process.exit(1);
          }
        }

        const envDir = config.envDir || root;
        const envFiles = getViteEnvFiles(config.mode, envDir);

        // Generate runtime-env.js for Vitest runtime access
        const vitestOutputDir = getTempDir("vitest");
        const vitestOutputPath = resolve(vitestOutputDir, "runtime-env.js");

        // Ensure directory is clean
        rmSync(vitestOutputDir, { recursive: true, force: true });
        getTempDir("vitest"); // Re-create it clean

        const result = runRuntimeEnvCommand(
          "gen-js",
          vitestOutputPath,
          envFiles,
        );
        if (!result.success) {
          logError(
            config.logger,
            "Failed to generate runtime-env.js",
            result.stderr || result.stdout,
          );
          process.exit(1);
        }
      }
    },
  };
}
