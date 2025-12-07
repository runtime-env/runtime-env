import * as path from "path";
import type { PluginBuild, Plugin } from "esbuild";
import type { RuntimeEnvOptions } from "../types";

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

      // Set default js outputFile based on esbuild's outdir
      if (context.options.js && !context.options.js.outputFile) {
        if (build.initialOptions.outdir) {
          context.options.js.outputFile = path.join(
            build.initialOptions.outdir,
            "runtime-env.js",
          );
        } else if (build.initialOptions.outfile) {
          // If using outfile, put runtime-env.js in the same directory
          context.options.js.outputFile = path.join(
            path.dirname(build.initialOptions.outfile),
            "runtime-env.js",
          );
        } else {
          context.options.js.outputFile = "runtime-env.js";
        }
      }
    },
  };
}
