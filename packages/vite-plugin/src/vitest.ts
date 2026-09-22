import type { Plugin, UserConfig, ResolvedConfig } from "vite";
import { resolve } from "path";
import {
  isTypeScriptProject,
  runRuntimeEnvCommand,
  createTempDir,
  getViteEnvFiles,
  validateSchema,
  logError,
} from "./utils.js";

interface VitestConfig {
  setupFiles?: string | string[];
}

export function vitestPlugin(): Plugin {
  let vitestOutputPath: string | undefined;

  return {
    name: "runtime-env-vitest",

    apply(_config, { mode }) {
      return mode === "test";
    },

    config(config: UserConfig) {
      // Generate runtime-env.js for Vitest runtime access
      vitestOutputPath = resolve(createTempDir().dir, "runtime-env.js");

      // Automatically inject setupFiles for Vitest
      const vitestConfig = (config as { test?: VitestConfig }).test || {};
      const setupFiles = vitestConfig.setupFiles || [];

      if (Array.isArray(setupFiles)) {
        if (!setupFiles.includes(vitestOutputPath)) {
          setupFiles.push(vitestOutputPath);
        }
      } else {
        vitestConfig.setupFiles = [setupFiles, vitestOutputPath];
      }

      (config as { test?: VitestConfig }).test = {
        ...vitestConfig,
        setupFiles,
      };
    },

    configResolved(config: ResolvedConfig) {
      const root = config.root || process.cwd();

      const validation = validateSchema(root, config.envPrefix);
      if (!validation.success) {
        logError(config.logger, "Schema validation failed", validation.message);
        process.exit(1);
      }

      // Generate runtime-env.d.ts for Vitest type checking
      if (isTypeScriptProject(root)) {
        const result = runRuntimeEnvCommand("gen-ts", "runtime-env.d.ts");
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

      if (!vitestOutputPath) {
        return;
      }

      // Generate runtime-env.js for Vitest runtime access
      const result = runRuntimeEnvCommand("gen-js", vitestOutputPath, envFiles);
      if (!result.success) {
        logError(
          config.logger,
          "Failed to generate runtime-env.js",
          result.stderr || result.stdout,
        );
        process.exit(1);
      }
    },
  };
}
