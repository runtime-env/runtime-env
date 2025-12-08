import type { Compiler as RspackCompiler } from "@rspack/core";
import type { Compilation } from "webpack";
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

interface RspackAdapterContext {
  options: RuntimeEnvOptions;
  isDev: boolean;
  setIsDev: (value: boolean) => void;
}

export function createRspackAdapter(
  context: RspackAdapterContext,
): (compiler: RspackCompiler) => void {
  return (compiler: RspackCompiler) => {
    context.setIsDev(compiler.options.mode !== "production");

    setDefaultOutputFile(context.options);

    if (context.options.interpolate) {
      setupHtmlInterpolation(compiler, context);
    }
  };
}

/**
 * Sets default output file for Rspack if not provided.
 */
function setDefaultOutputFile(options: RuntimeEnvOptions): void {
  if (options.js && !options.js.outputFile) {
    options.js.outputFile = `${DEFAULT_PUBLIC_DIR}/${DEFAULT_JS_OUTPUT_FILE}`;
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
