import * as path from "path";
import type { ResolvedConfig, Plugin } from "vite";
import { interpolateHtml } from "../generators";
import type { RuntimeEnvOptions } from "../types";
import { getSchemaFile, getGlobalVariableName } from "../utils";
import { DEFAULT_PUBLIC_DIR, DEFAULT_JS_OUTPUT_FILE } from "../constants";

interface ViteAdapterContext {
  options: RuntimeEnvOptions;
  isDev: boolean;
  setIsDev: (value: boolean) => void;
}

export function createViteAdapter(context: ViteAdapterContext): Partial<Plugin> {
  return {
    configResolved(config: ResolvedConfig) {
      context.setIsDev(config.command === "serve");
      setDefaultOutputFile(context.options, config);
    },

    transformIndexHtml: {
      order: "pre",
      async handler(html: string) {
        if (!context.options.interpolate) return html;

        if (context.isDev) {
          return await transformHtmlForDev(html, context.options);
        } else {
          // Build: keep template syntax as-is (<%= runtimeEnv.FOO %> stays unchanged)
          // Server-side runtime-env CLI will process this at container startup
          return html;
        }
      },
    },
  };
}

/**
 * Sets default output file for Vite if not provided.
 */
function setDefaultOutputFile(
  options: RuntimeEnvOptions,
  config: ResolvedConfig,
): void {
  if (options.js && !options.js.outputFile) {
    const publicDir = config.publicDir || DEFAULT_PUBLIC_DIR;
    options.js.outputFile = path.join(publicDir, DEFAULT_JS_OUTPUT_FILE);
  }
}

/**
 * Transforms HTML for development mode with inline runtime env values.
 */
async function transformHtmlForDev(
  html: string,
  options: RuntimeEnvOptions,
): Promise<string> {
  const schemaFile = getSchemaFile(options);
  const globalVariableName = getGlobalVariableName(options);

  return await interpolateHtml(
    html,
    schemaFile,
    globalVariableName,
    options.interpolate!.envFile,
  );
}
