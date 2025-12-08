import * as path from "path";
import type { PluginBuild, Plugin } from "esbuild";
import type { RuntimeEnvOptions } from "../types";
import { DEFAULT_JS_OUTPUT_FILE } from "../constants";

interface EsbuildAdapterContext {
  options: RuntimeEnvOptions;
  setIsDev: (value: boolean) => void;
}

export function createEsbuildAdapter(
  context: EsbuildAdapterContext,
): Partial<Plugin> {
  return {
    setup(build: PluginBuild) {
      // esbuild doesn't have a clear dev/build distinction, assume build mode
      const isDev = false;
      context.setIsDev(isDev);
      ensureDefaultOutputFile(context.options, build);
    },
  };
}

/**
 * Gets the output file path for esbuild, using default if not provided.
 * Pure function that doesn't mutate the input.
 */
function getOutputFile(
  options: RuntimeEnvOptions,
  build: PluginBuild,
): string | undefined {
  if (options.js) {
    if (options.js.outputFile) {
      return options.js.outputFile;
    }

    const { outdir, outfile } = build.initialOptions;

    if (outdir) {
      return path.join(outdir, DEFAULT_JS_OUTPUT_FILE);
    } else if (outfile) {
      // If using outfile, put runtime-env.js in the same directory
      return path.join(path.dirname(outfile), DEFAULT_JS_OUTPUT_FILE);
    } else {
      return DEFAULT_JS_OUTPUT_FILE;
    }
  }
  return undefined;
}

/**
 * Ensures options have the default output file set.
 * This mutation is necessary as the options object is shared across the plugin lifecycle.
 */
function ensureDefaultOutputFile(
  options: RuntimeEnvOptions,
  build: PluginBuild,
): void {
  const outputFile = getOutputFile(options, build);
  if (options.js && outputFile) {
    options.js.outputFile = outputFile;
  }
}
