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
    context.setIsDev(compiler.options.mode !== "production");

    setDefaultOutputFile(context.options);

    if (context.options.interpolate) {
      setupHtmlInterpolation(compiler, context);
    }
  };
}

/**
 * Sets default output file for Webpack if not provided.
 */
function setDefaultOutputFile(options: RuntimeEnvOptions): void {
  if (options.js && !options.js.outputFile) {
    options.js.outputFile = `${DEFAULT_PUBLIC_DIR}/${DEFAULT_JS_OUTPUT_FILE}`;
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

          data.plugin.options.templateParameters = createTemplateParameters(
            globalVariableName,
            envValues,
            data.plugin.options.templateParameters,
          );

          cb(null, data);
        } catch (error) {
          cb(error as Error);
        }
      },
    );
  });
}
