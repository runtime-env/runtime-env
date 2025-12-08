import type { Compiler as RspackCompiler } from "@rspack/core";
import type { Compilation } from "webpack";
import { loadEnvValues, loadEnvKeys } from "../generators";
import type { RuntimeEnvOptions } from "../types";
import { getSchemaFile, getGlobalVariableName } from "../utils";
import { DEFAULT_PUBLIC_DIR, DEFAULT_JS_OUTPUT_FILE, PLUGIN_NAME } from "../constants";
import {
  findHtmlPlugin,
  validateHtmlPlugin,
  createTemplateParameters,
  type HtmlPluginData,
} from "./html-plugin-utils";

interface RspackAdapterContext {
  options: RuntimeEnvOptions;
  isDev: boolean;
  setIsDev: (value: boolean) => void;
}

export function createRspackAdapter(
  context: RspackAdapterContext,
): (compiler: RspackCompiler) => void {
  return (compiler: RspackCompiler) => {
    const isDev = compiler.options.mode !== "production";
    context.setIsDev(isDev);

    ensureDefaultOutputFile(context.options);

    if (context.options.interpolate) {
      setupHtmlInterpolation(compiler, context);
    }
  };
}

/**
 * Gets the output file path, using default if not provided.
 * Pure function that doesn't mutate the input.
 */
function getOutputFile(options: RuntimeEnvOptions): string | undefined {
  if (options.js) {
    return options.js.outputFile || `${DEFAULT_PUBLIC_DIR}/${DEFAULT_JS_OUTPUT_FILE}`;
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
 * Sets up HTML interpolation by hooking into html-rspack-plugin.
 */
function setupHtmlInterpolation(
  compiler: RspackCompiler,
  context: RspackAdapterContext,
): void {
  // Using unknown type for compilation since Rspack's Compilation type differs from Webpack's
  compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: unknown) => {
    const HtmlRspackPlugin = findHtmlPlugin(compiler.options.plugins);
    validateHtmlPlugin(HtmlRspackPlugin, "html-rspack-plugin");

    const hooks = HtmlRspackPlugin.getHooks(compilation as unknown as Compilation);

    hooks.beforeAssetTagGeneration.tapAsync(
      PLUGIN_NAME,
      async (
        data: HtmlPluginData,
        cb: (error: Error | null, data?: HtmlPluginData) => void,
      ) => {
        try {
          const schemaFile = getSchemaFile(context.options);
          const globalVariableName = getGlobalVariableName(context.options);

          let envValues: Record<string, unknown> | null = null;
          let envKeys: string[] | null = null;

          if (context.isDev) {
            // Dev mode: load actual env values
            envValues = await loadEnvValues(
              schemaFile,
              globalVariableName,
              context.options.interpolate!.envFile,
            );
          } else {
            // Production mode: load env keys from schema
            envKeys = await loadEnvKeys(schemaFile);
          }

          const updatedTemplateParameters = createTemplateParameters(
            globalVariableName,
            envValues,
            envKeys,
            data.plugin.options.templateParameters,
          );

          // Create a new data object with updated template parameters
          const updatedData: HtmlPluginData = {
            ...data,
            plugin: {
              ...data.plugin,
              options: {
                ...data.plugin.options,
                templateParameters: updatedTemplateParameters,
              },
            },
          };

          cb(null, updatedData);
        } catch (error) {
          cb(error as Error);
        }
      },
    );
  });
}
