import * as path from "path";
import type { ResolvedConfig, Plugin } from "vite";
import { interpolateHtml } from "../generators";
import type { RuntimeEnvOptions } from "../types";

interface ViteAdapterContext {
  options: RuntimeEnvOptions;
  isDev: boolean;
  setIsDev: (value: boolean) => void;
}

export function createViteAdapter(context: ViteAdapterContext): Partial<Plugin> {
  return {
    configResolved(config: ResolvedConfig) {
      context.setIsDev(config.command === "serve");

      // Set default js outputFile based on Vite's publicDir
      if (context.options.js && !context.options.js.outputFile) {
        const publicDir = config.publicDir || "public";
        context.options.js.outputFile = path.join(publicDir, "runtime-env.js");
      }
    },

    transformIndexHtml: {
      order: "pre",
      async handler(html: string) {
        if (!context.options.interpolate) return html;

        if (context.isDev) {
          // Dev: inline interpolate HTML with runtime env values
          const schemaFile =
            context.options.schemaFile || ".runtimeenvschema.json";
          const globalVariableName =
            context.options.globalVariableName || "runtimeEnv";
          const interpolated = await interpolateHtml(
            html,
            schemaFile,
            globalVariableName,
            context.options.interpolate.envFile,
          );
          return interpolated;
        } else {
          // Build: keep template syntax as-is (<%= runtimeEnv.FOO %> stays unchanged)
          // Server-side runtime-env CLI will process this at container startup
          return html;
        }
      },
    },
  };
}
