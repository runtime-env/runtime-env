import * as fs from "fs";
import * as path from "path";
import { createUnplugin } from "unplugin";
import { createViteAdapter } from "./adapters/vite";
import { createWebpackAdapter } from "./adapters/webpack";
import { createRspackAdapter } from "./adapters/rspack";
import { createRollupAdapter } from "./adapters/rollup";
import { createEsbuildAdapter } from "./adapters/esbuild";
import { validateInterpolateSupport } from "./core";
import { getSchemaFile } from "./utils";
import {
  genTypes,
  startWatchProcesses,
  stopWatchProcesses,
  type WatchProcesses,
} from "./generators";
import type { Bundler, RuntimeEnvOptions } from "./types";

/**
 * Handles build mode operations: generating types and cleaning up JS files.
 */
async function handleBuildMode(options: RuntimeEnvOptions): Promise<void> {
  const schemaFile = getSchemaFile(options);

  if (options.ts?.outputFile) {
    await genTypes(schemaFile, options.ts.outputFile, options.globalVariableName);
  }

  if (options.js?.outputFile) {
    cleanupJsFile(options.js.outputFile);
  }
}

/**
 * Cleans up the runtime-env.js file if it exists.
 */
function cleanupJsFile(outputFile: string): void {
  const jsPath = path.resolve(outputFile);
  if (fs.existsSync(jsPath)) {
    fs.unlinkSync(jsPath);
  }
}

/**
 * Creates the runtime-env unplugin for all supported bundlers.
 */
const unplugin = createUnplugin<RuntimeEnvOptions>((options, meta) => {
  let watchProcesses: WatchProcesses | null = null;
  let isDev = false;
  const bundler = meta.framework as Bundler;

  // Validate interpolate support for this bundler (fail fast at plugin init)
  validateInterpolateSupport(bundler, !!options.interpolate);

  // Create adapter context
  const adapterContext = {
    options,
    isDev,
    setIsDev: (value: boolean) => {
      isDev = value;
    },
  };

  return {
    name: "@runtime-env/unplugin",

    // Unified hooks work across all bundlers
    async buildStart() {
      if (isDev) {
        // Development mode: start CLI watch processes
        watchProcesses = startWatchProcesses(options);
      } else {
        // Build mode: generate types once (for type checking)
        await handleBuildMode(options);
      }
    },

    buildEnd() {
      // Cleanup watch processes
      if (watchProcesses) {
        stopWatchProcesses(watchProcesses);
        watchProcesses = null;
      }
    },

    // Bundler-specific hooks using adapters
    vite: createViteAdapter(adapterContext),
    webpack: createWebpackAdapter(adapterContext),
    rspack: createRspackAdapter(adapterContext),
    rollup: createRollupAdapter(adapterContext),
    esbuild: createEsbuildAdapter(adapterContext),
  };
});

// Export the unplugin instance as default
export default unplugin;

// Export bundler-specific plugins for convenience
export const vite = unplugin.vite;
export const webpack = unplugin.webpack;
export const rspack = unplugin.rspack;
export const rollup = unplugin.rollup;
export const esbuild = unplugin.esbuild;

// Export types
export type { RuntimeEnvOptions, Bundler } from "./types";
