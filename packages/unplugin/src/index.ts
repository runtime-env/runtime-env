import * as fs from "fs";
import * as path from "path";
import type { Compiler as WebpackCompiler, Compilation } from "webpack";
import type { Compiler as RspackCompiler } from "@rspack/core";
import type { ResolvedConfig } from "vite";
import type { OutputOptions, InputOptions } from "rollup";
import type { PluginBuild, BuildOptions } from "esbuild";
import { createUnplugin } from "unplugin";
import { validateInterpolateSupport } from "./core";
import {
  genTypes,
  interpolateHtml,
  loadEnvValues,
  startWatchProcesses,
  stopWatchProcesses,
  type WatchProcesses,
} from "./generators";
import type { Bundler, RuntimeEnvOptions } from "./types";

// Types for html-webpack-plugin and html-rspack-plugin hooks
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

/**
 * Creates the runtime-env unplugin for all supported bundlers.
 */
const unplugin = createUnplugin<RuntimeEnvOptions>((options, meta) => {
  let watchProcesses: WatchProcesses | null = null;
  let isDev = false;
  const bundler = meta.framework as Bundler;

  // Validate interpolate support for this bundler (fail fast at plugin init)
  validateInterpolateSupport(bundler, !!options.interpolate);

  return {
    name: "@runtime-env/unplugin",

    // Unified hooks work across all bundlers
    async buildStart() {
      const schemaFile = options.schemaFile || ".runtimeenvschema.json";

      if (isDev) {
        // Development mode: start CLI watch processes
        watchProcesses = startWatchProcesses(options);
      } else {
        // Build mode: generate types once (for type checking)
        if (options.ts?.outputFile) {
          await genTypes(
            schemaFile,
            options.ts.outputFile,
            options.globalVariableName,
          );
        }

        // Clean runtime-env.js if it exists
        if (options.js?.outputFile) {
          const jsPath = path.resolve(options.js.outputFile);
          if (fs.existsSync(jsPath)) {
            fs.unlinkSync(jsPath);
          }
        }
      }
    },

    buildEnd() {
      // Cleanup watch processes
      if (watchProcesses) {
        stopWatchProcesses(watchProcesses);
        watchProcesses = null;
      }
    },

    // Vite-specific hooks
    vite: {
      configResolved(config: ResolvedConfig) {
        isDev = config.command === "serve";

        // Set default js outputFile based on Vite's publicDir
        if (options.js && !options.js.outputFile) {
          const publicDir = config.publicDir || "public";
          options.js.outputFile = path.join(publicDir, "runtime-env.js");
        }
      },

      transformIndexHtml: {
        order: "pre",
        async handler(html: string) {
          if (!options.interpolate) return html;

          if (isDev) {
            // Dev: inline interpolate HTML with runtime env values
            const schemaFile = options.schemaFile || ".runtimeenvschema.json";
            const globalVariableName =
              options.globalVariableName || "runtimeEnv";
            const interpolated = await interpolateHtml(
              html,
              schemaFile,
              globalVariableName,
              options.interpolate.envFile,
            );
            return interpolated;
          } else {
            // Build: keep template syntax as-is (<%= runtimeEnv.FOO %> stays unchanged)
            // Server-side runtime-env CLI will process this at container startup
            return html;
          }
        },
      },
    },

    // Webpack-specific hooks
    webpack(compiler: WebpackCompiler) {
      isDev = compiler.options.mode !== "production";

      // Set default js outputFile for Webpack
      if (options.js && !options.js.outputFile) {
        options.js.outputFile = "public/runtime-env.js";
      }

      if (options.interpolate) {
        // Hook into HtmlWebpackPlugin to handle HTML template
        compiler.hooks.compilation.tap(
          "@runtime-env/unplugin",
          (compilation: Compilation) => {
            // Find HtmlWebpackPlugin - look for plugin with getHooks static method
            let HtmlWebpackPlugin: HtmlPluginConstructor | null = null;
            for (const plugin of compiler.options.plugins || []) {
              if (
                plugin &&
                plugin.constructor &&
                typeof (plugin.constructor as unknown as HtmlPluginConstructor)
                  .getHooks === "function"
              ) {
                HtmlWebpackPlugin =
                  plugin.constructor as unknown as HtmlPluginConstructor;
                break;
              }
            }

            if (!HtmlWebpackPlugin) {
              throw new Error(
                "[@runtime-env/unplugin] interpolate option requires html-webpack-plugin. " +
                  "Install html-webpack-plugin or remove the interpolate option.",
              );
            }

            const hooks = HtmlWebpackPlugin.getHooks(compilation);

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
                    options.schemaFile || ".runtimeenvschema.json";
                  const globalVariableName =
                    options.globalVariableName || "runtimeEnv";

                  if (isDev) {
                    // Dev: inject actual runtime env values
                    const envValues = await loadEnvValues(
                      schemaFile,
                      globalVariableName,
                      options.interpolate!.envFile,
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
    },

    // Rspack-specific hooks
    rspack(compiler: RspackCompiler) {
      isDev = compiler.options.mode !== "production";

      // Set default js outputFile for Rspack
      if (options.js && !options.js.outputFile) {
        options.js.outputFile = "public/runtime-env.js";
      }

      if (options.interpolate) {
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
                    options.schemaFile || ".runtimeenvschema.json";
                  const globalVariableName =
                    options.globalVariableName || "runtimeEnv";

                  if (isDev) {
                    // Dev: inject actual runtime env values
                    const envValues = await loadEnvValues(
                      schemaFile,
                      globalVariableName,
                      options.interpolate!.envFile,
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
    },

    // Rollup-specific hooks
    rollup: {
      options(rollupOptions: InputOptions) {
        // Detect build mode (assume build unless watch mode)
        isDev = !!(rollupOptions as InputOptions & { watch?: boolean }).watch;

        // Set default js outputFile based on Rollup's output.dir
        // Note: InputOptions.output is not directly available, we handle it in outputOptions hook instead
        if (options.js && !options.js.outputFile) {
          // Default fallback for Rollup
          options.js.outputFile = "runtime-env.js";
        }
        return rollupOptions;
      },
      outputOptions(outputOptions: OutputOptions) {
        // Set default based on output.dir if available
        if (options.js && options.js.outputFile === "runtime-env.js") {
          if (outputOptions.dir) {
            options.js.outputFile = path.join(
              outputOptions.dir,
              "runtime-env.js",
            );
          }
        }
        return outputOptions;
      },
    },

    // esbuild-specific hooks
    esbuild: {
      setup(build: PluginBuild) {
        // esbuild doesn't have a clear dev/build distinction, assume build mode
        isDev = false;

        // Set default js outputFile based on esbuild's outdir
        if (options.js && !options.js.outputFile) {
          if (build.initialOptions.outdir) {
            options.js.outputFile = path.join(
              build.initialOptions.outdir,
              "runtime-env.js",
            );
          } else if (build.initialOptions.outfile) {
            // If using outfile, put runtime-env.js in the same directory
            options.js.outputFile = path.join(
              path.dirname(build.initialOptions.outfile),
              "runtime-env.js",
            );
          } else {
            options.js.outputFile = "runtime-env.js";
          }
        }
      },
    },
  };
});

// Export the unplugin instance as default
export default unplugin;

// Export bundler-specific plugins for convenience
export const vite = unplugin.vite;
export const webpack = unplugin.webpack;
export const rspack = unplugin.rspack;
export const rollup = unplugin.rollup;
export const esbuild = unplugin.esbuild;

// Export types
export type { RuntimeEnvOptions, Bundler } from "./types";
