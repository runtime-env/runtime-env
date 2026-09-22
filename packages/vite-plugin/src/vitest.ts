import type { Plugin, UserConfig, ResolvedConfig } from "vite";
import {
  isTypeScriptProject,
  runRuntimeEnvCommand,
  getViteEnvFiles,
  validateSchema,
  logError,
} from "./utils.js";

interface VitestConfig {
  setupFiles?: string | string[];
}

const runtimeEnvModuleId = "virtual:runtime-env.js";

export function vitestPlugin(): Plugin {
  let runtimeEnvJs = "";

  return {
    name: "runtime-env-vitest",

    apply(_config, { mode }) {
      return mode === "test";
    },

    config(config: UserConfig) {
      // Automatically inject setupFiles for Vitest
      const vitestConfig = (config as { test?: VitestConfig }).test || {};
      const setupFiles = vitestConfig.setupFiles || [];

      if (Array.isArray(setupFiles)) {
        if (!setupFiles.includes(runtimeEnvModuleId)) {
          setupFiles.push(runtimeEnvModuleId);
        }
      } else {
        vitestConfig.setupFiles = [setupFiles, runtimeEnvModuleId];
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
        const result = runRuntimeEnvCommand("gen-ts");
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
      const result = runRuntimeEnvCommand("gen-js", envFiles);
      if (!result.success) {
        logError(
          config.logger,
          "Failed to generate runtime-env.js",
          result.stderr || result.stdout,
        );
        process.exit(1);
      }
      runtimeEnvJs = result.stdout;
    },

    resolveId(id) {
      if (id.endsWith(runtimeEnvModuleId)) {
        return "\0" + runtimeEnvModuleId;
      }
    },

    load(id) {
      if (id === "\0" + runtimeEnvModuleId) {
        return runtimeEnvJs;
      }
    },
  };
}
