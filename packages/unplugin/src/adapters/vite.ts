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
      const isDev = config.command === "serve";
      context.setIsDev(isDev);
      ensureDefaultOutputFile(context.options, config);
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
 * Gets the output file path for Vite, using default if not provided.
 * Pure function that doesn't mutate the input.
 */
function getOutputFile(
  options: RuntimeEnvOptions,
  config: ResolvedConfig,
): string | undefined {
  if (options.js) {
    if (options.js.outputFile) {
      return options.js.outputFile;
    }
    const publicDir = config.publicDir || DEFAULT_PUBLIC_DIR;
    return path.join(publicDir, DEFAULT_JS_OUTPUT_FILE);
  }
  return undefined;
}

/**
 * Ensures options have the default output file set.
 * This mutation is necessary as the options object is shared across the plugin lifecycle.
 */
function ensureDefaultOutputFile(
  options: RuntimeEnvOptions,
  config: ResolvedConfig,
): void {
  const outputFile = getOutputFile(options, config);
  if (options.js && outputFile) {
    options.js.outputFile = outputFile;
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
