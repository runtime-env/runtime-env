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
      const isDev = isDevMode(rollupOptions);
      context.setIsDev(isDev);
      ensureDefaultOutputFile(context.options);
      return rollupOptions;
    },
    outputOptions(outputOptions: OutputOptions) {
      updateOutputFileWithDir(context.options, outputOptions);
      return outputOptions;
    },
  };
}

/**
 * Detects if development mode is enabled from rollup options.
 * Pure function that doesn't mutate the input.
 */
function isDevMode(rollupOptions: InputOptions): boolean {
  return !!(rollupOptions as InputOptions & { watch?: boolean }).watch;
}

/**
 * Gets the output file path, using default if not provided.
 * Pure function that doesn't mutate the input.
 */
function getOutputFile(options: RuntimeEnvOptions): string | undefined {
  if (options.js) {
    return options.js.outputFile || DEFAULT_JS_OUTPUT_FILE;
  }
  return undefined;
}

/**
 * Ensures options have the default output file set.
 * This mutation is necessary as the options object is shared across the plugin lifecycle.
 */
function ensureDefaultOutputFile(options: RuntimeEnvOptions): void {
  const outputFile = getOutputFile(options);
  if (options.js && outputFile) {
    options.js.outputFile = outputFile;
  }
}

/**
 * Gets the output file path with directory from output options if available.
 * Pure function that doesn't mutate the input.
 */
function getOutputFileWithDir(
  options: RuntimeEnvOptions,
  outputOptions: OutputOptions,
): string | undefined {
  if (options.js) {
    const currentFile = options.js.outputFile;
    if (currentFile === DEFAULT_JS_OUTPUT_FILE && outputOptions.dir) {
      return path.join(outputOptions.dir, DEFAULT_JS_OUTPUT_FILE);
    }
    return currentFile;
  }
  return undefined;
}

/**
 * Updates output file with directory from output options if available.
 * This mutation is necessary as the options object is shared across the plugin lifecycle.
 */
function updateOutputFileWithDir(
  options: RuntimeEnvOptions,
  outputOptions: OutputOptions,
): void {
  const outputFile = getOutputFileWithDir(options, outputOptions);
  if (options.js && outputFile) {
    options.js.outputFile = outputFile;
  }
}
