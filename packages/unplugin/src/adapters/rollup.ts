import * as path from "path";
import type { OutputOptions, InputOptions, Plugin } from "rollup";
import type { RuntimeEnvOptions } from "../types";
import { DEFAULT_JS_OUTPUT_FILE } from "../constants";

interface RollupAdapterContext {
  options: RuntimeEnvOptions;
  setIsDev: (value: boolean) => void;
}

export function createRollupAdapter(
  context: RollupAdapterContext,
): Partial<Plugin> {
  return {
    options(rollupOptions: InputOptions) {
      detectDevMode(rollupOptions, context);
      setDefaultOutputFile(context.options);
      return rollupOptions;
    },
    outputOptions(outputOptions: OutputOptions) {
      updateOutputFileWithDir(context.options, outputOptions);
      return outputOptions;
    },
  };
}

/**
 * Detects development mode from rollup options.
 */
function detectDevMode(
  rollupOptions: InputOptions,
  context: RollupAdapterContext,
): void {
  const hasWatch = !!(rollupOptions as InputOptions & { watch?: boolean }).watch;
  context.setIsDev(hasWatch);
}

/**
 * Sets default output file for Rollup if not provided.
 */
function setDefaultOutputFile(options: RuntimeEnvOptions): void {
  if (options.js && !options.js.outputFile) {
    options.js.outputFile = DEFAULT_JS_OUTPUT_FILE;
  }
}

/**
 * Updates output file with directory from output options if available.
 */
function updateOutputFileWithDir(
  options: RuntimeEnvOptions,
  outputOptions: OutputOptions,
): void {
  if (
    options.js &&
    options.js.outputFile === DEFAULT_JS_OUTPUT_FILE &&
    outputOptions.dir
  ) {
    options.js.outputFile = path.join(outputOptions.dir, DEFAULT_JS_OUTPUT_FILE);
  }
}
