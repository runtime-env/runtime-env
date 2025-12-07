import type { Compiler as RspackCompiler } from "@rspack/core";
import type { Compilation } from "webpack";
import { loadEnvValues } from "../generators";
import type { RuntimeEnvOptions } from "../types";

// Types for html-rspack-plugin hooks (compatible with html-webpack-plugin)
interface HtmlPluginData {
  plugin: {
    options: {
      templateParameters?: Record<string, unknown>;
    };
  };
}

interface HtmlPluginHooks {
  beforeAssetTagGeneration: {
    tapAsync: (
      name: string,
      callback: (
        data: HtmlPluginData,
        cb: (error: Error | null, data?: HtmlPluginData) => void,
      ) => void,
    ) => void;
  };
}

interface HtmlPluginConstructor {
  getHooks: (compilation: Compilation) => HtmlPluginHooks;
}

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

    // Set default js outputFile for Rspack
    if (context.options.js && !context.options.js.outputFile) {
      context.options.js.outputFile = "public/runtime-env.js";
    }

    if (context.options.interpolate) {
      // Hook into html-rspack-plugin to handle HTML template
      // Using unknown type for compilation since Rspack's Compilation type differs from Webpack's
      compiler.hooks.compilation.tap(
        "@runtime-env/unplugin",
        (compilation: unknown) => {
          // Find html-rspack-plugin - look for plugin with getHooks static method
          let HtmlRspackPlugin: HtmlPluginConstructor | null = null;
          for (const plugin of compiler.options.plugins || []) {
            if (
              plugin &&
              plugin.constructor &&
              typeof (plugin.constructor as unknown as HtmlPluginConstructor)
                .getHooks === "function"
            ) {
              HtmlRspackPlugin =
                plugin.constructor as unknown as HtmlPluginConstructor;
              break;
            }
          }

          if (!HtmlRspackPlugin) {
            throw new Error(
              "[@runtime-env/unplugin] interpolate option requires html-rspack-plugin. " +
                "Install html-rspack-plugin or remove the interpolate option.",
            );
          }

          const hooks = HtmlRspackPlugin.getHooks(
            compilation as unknown as Compilation,
          );

          // In both dev and production, we need to inject templateParameters
          // so that lodash template processing doesn't fail
          hooks.beforeAssetTagGeneration.tapAsync(
            "@runtime-env/unplugin",
            async (
              data: HtmlPluginData,
              cb: (error: Error | null, data?: HtmlPluginData) => void,
            ) => {
              try {
                const schemaFile =
                  context.options.schemaFile || ".runtimeenvschema.json";
                const globalVariableName =
                  context.options.globalVariableName || "runtimeEnv";

                if (context.isDev) {
                  // Dev: inject actual runtime env values
                  const envValues = await loadEnvValues(
                    schemaFile,
                    globalVariableName,
                    context.options.interpolate!.envFile,
                  );
                  data.plugin.options.templateParameters = {
                    ...data.plugin.options.templateParameters,
                    [globalVariableName]: envValues,
                  };
                } else {
                  // Production: inject Proxy that returns escaped template strings
                  // This allows the template to process without errors
                  // but outputs <%= syntax %> that will be evaluated at runtime
                  const escapeProxy = new Proxy(
                    {},
                    {
                      get(_, prop) {
                        // Return a string that, when processed by lodash, will output <%= runtimeEnv.PROP %>
                        return `<%= ${globalVariableName}.${String(prop)} %>`;
                      },
                    },
                  );
                  data.plugin.options.templateParameters = {
                    ...data.plugin.options.templateParameters,
                    [globalVariableName]: escapeProxy,
                  };
                }
                cb(null, data);
              } catch (error) {
                cb(error as Error);
              }
            },
          );
        },
      );
    }
  };
}
