import type {
  Plugin,
  UserConfig,
  ConfigEnv,
  ViteDevServer,
  ResolvedConfig,
} from "vite";
import { resolve } from "path";
import { Options } from "./types.js";
import {
  schemaFile,
  globalVariableName,
  runRuntimeEnvCommand,
} from "./utils.js";

export function devPlugin(options: Options) {
  return {
    name: "runtime-env-dev",

    configResolved(config: ResolvedConfig) {
      if (config.command === "serve" && !(config as any).isPreview) {
        if (options.genJs) {
          const publicDir =
            typeof config.publicDir === "string" ? config.publicDir : "";
          runRuntimeEnvCommand(
            "gen-js",
            options,
            resolve(publicDir, "runtime-env.js"),
          );
        }
      }
    },

    configureServer(server: ViteDevServer) {
      // The isTest logic has been moved to vitest.ts
      if (server.config.mode === "test") return;

      const watchFiles = [schemaFile];
      if (options.genJs && options.genJs.envFile) {
        watchFiles.push(...options.genJs.envFile);
      }

      function run() {
        const publicDir =
          typeof (server.config as ResolvedConfig).publicDir === "string"
            ? (server.config as ResolvedConfig).publicDir
            : "";
        if (options.genJs) {
          runRuntimeEnvCommand(
            "gen-js",
            options,
            resolve(publicDir, "runtime-env.js"),
          );
        }
        if (options.genTs && options.genTs.outputFile) {
          runRuntimeEnvCommand("gen-ts", options, options.genTs.outputFile);
        }
      }

      run();
      server.watcher.add(watchFiles);
      server.watcher.on("change", (file) => {
        if (watchFiles.includes(file)) {
          run();
        }
      });
    },
  };
}
