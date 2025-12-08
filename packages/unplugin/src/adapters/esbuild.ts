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
      context.setIsDev(false);
      setDefaultOutputFile(context.options, build);
    },
  };
}

/**
 * Sets default output file for esbuild if not provided.
 */
function setDefaultOutputFile(
  options: RuntimeEnvOptions,
  build: PluginBuild,
): void {
  if (options.js && !options.js.outputFile) {
    const { outdir, outfile } = build.initialOptions;

    if (outdir) {
      options.js.outputFile = path.join(outdir, DEFAULT_JS_OUTPUT_FILE);
    } else if (outfile) {
      // If using outfile, put runtime-env.js in the same directory
      options.js.outputFile = path.join(
        path.dirname(outfile),
        DEFAULT_JS_OUTPUT_FILE,
      );
    } else {
      options.js.outputFile = DEFAULT_JS_OUTPUT_FILE;
    }
  }
}
