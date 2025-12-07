import * as path from "path";
import type { OutputOptions, InputOptions, Plugin } from "rollup";
import type { RuntimeEnvOptions } from "../types";

interface RollupAdapterContext {
  options: RuntimeEnvOptions;
  setIsDev: (value: boolean) => void;
}

export function createRollupAdapter(
  context: RollupAdapterContext,
): Partial<Plugin> {
  return {
    options(rollupOptions: InputOptions) {
      // Detect build mode (assume build unless watch mode)
      context.setIsDev(
        !!(rollupOptions as InputOptions & { watch?: boolean }).watch,
      );

      // Set default js outputFile based on Rollup's output.dir
      // Note: InputOptions.output is not directly available, we handle it in outputOptions hook instead
      if (context.options.js && !context.options.js.outputFile) {
        // Default fallback for Rollup
        context.options.js.outputFile = "runtime-env.js";
      }
      return rollupOptions;
    },
    outputOptions(outputOptions: OutputOptions) {
      // Set default based on output.dir if available
      if (
        context.options.js &&
        context.options.js.outputFile === "runtime-env.js"
      ) {
        if (outputOptions.dir) {
          context.options.js.outputFile = path.join(
            outputOptions.dir,
            "runtime-env.js",
          );
        }
      }
      return outputOptions;
    },
  };
}
