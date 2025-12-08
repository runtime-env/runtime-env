import type { Compiler as WebpackCompiler, Compilation } from "webpack";
import { loadEnvValues } from "../generators";
import type { RuntimeEnvOptions } from "../types";
import { getSchemaFile, getGlobalVariableName } from "../utils";
import { DEFAULT_PUBLIC_DIR, DEFAULT_JS_OUTPUT_FILE, PLUGIN_NAME } from "../constants";
import {
  findHtmlPlugin,
  validateHtmlPlugin,
  createTemplateParameters,
  type HtmlPluginData,
} from "./html-plugin-utils";

interface WebpackAdapterContext {
  options: RuntimeEnvOptions;
  isDev: boolean;
  setIsDev: (value: boolean) => void;
}

export function createWebpackAdapter(
  context: WebpackAdapterContext,
): (compiler: WebpackCompiler) => void {
  return (compiler: WebpackCompiler) => {
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
 * Sets up HTML interpolation by hooking into HtmlWebpackPlugin.
 */
function setupHtmlInterpolation(
  compiler: WebpackCompiler,
  context: WebpackAdapterContext,
): void {
  compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
    const HtmlWebpackPlugin = findHtmlPlugin(compiler.options.plugins);
    validateHtmlPlugin(HtmlWebpackPlugin, "html-webpack-plugin");

    const hooks = HtmlWebpackPlugin.getHooks(compilation);

    hooks.beforeAssetTagGeneration.tapAsync(
      PLUGIN_NAME,
      async (
        data: HtmlPluginData,
        cb: (error: Error | null, data?: HtmlPluginData) => void,
      ) => {
        try {
          const schemaFile = getSchemaFile(context.options);
          const globalVariableName = getGlobalVariableName(context.options);

          const envValues = context.isDev
            ? await loadEnvValues(
                schemaFile,
                globalVariableName,
                context.options.interpolate!.envFile,
              )
            : null;

          const updatedTemplateParameters = createTemplateParameters(
            globalVariableName,
            envValues,
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
