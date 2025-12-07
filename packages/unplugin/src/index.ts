import * as fs from "fs";
import * as path from "path";
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

/**
 * Creates the runtime-env unplugin for all supported bundlers.
 */
export default createUnplugin<RuntimeEnvOptions>((options, meta) => {
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
      configResolved(config: any) {
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
    webpack(compiler) {
      isDev = compiler.options.mode !== "production";

      // Set default js outputFile for Webpack
      if (options.js && !options.js.outputFile) {
        options.js.outputFile = "public/runtime-env.js";
      }

      if (options.interpolate) {
        // Hook into HtmlWebpackPlugin to handle HTML template
        compiler.hooks.compilation.tap(
          "@runtime-env/unplugin",
          (compilation: any) => {
            // Find HtmlWebpackPlugin
            const HtmlWebpackPlugin = compiler.options.plugins?.find(
              (p: any) => p.constructor.name === "HtmlWebpackPlugin",
            )?.constructor as any;

            if (!HtmlWebpackPlugin) {
              throw new Error(
                "[@runtime-env/unplugin] interpolate option requires html-webpack-plugin. " +
                  "Install html-webpack-plugin or remove the interpolate option.",
              );
            }

            const hooks = HtmlWebpackPlugin.getHooks(compilation);

            if (isDev) {
              // Dev: inject templateParameters with runtime env values
              hooks.beforeTemplateExecution.tapAsync(
                "@runtime-env/unplugin",
                async (data: any, cb: any) => {
                  try {
                    const schemaFile =
                      options.schemaFile || ".runtimeenvschema.json";
                    const globalVariableName =
                      options.globalVariableName || "runtimeEnv";
                    const envValues = await loadEnvValues(
                      schemaFile,
                      globalVariableName,
                      options.interpolate!.envFile,
                    );
                    data.plugin.options.templateParameters = {
                      ...data.plugin.options.templateParameters,
                      [globalVariableName]: envValues,
                    };
                    cb(null, data);
                  } catch (error) {
                    cb(error);
                  }
                },
              );
            }
            // Production: HTML passes through unchanged (no hook needed)
            // Template syntax <%= runtimeEnv.FOO %> is preserved for server-side processing
          },
        );
      }
    },

    // Rspack-specific hooks
    rspack(compiler) {
      isDev = compiler.options.mode !== "production";

      // Set default js outputFile for Rspack
      if (options.js && !options.js.outputFile) {
        options.js.outputFile = "public/runtime-env.js";
      }

      if (options.interpolate) {
        // Hook into html-rspack-plugin to handle HTML template
        compiler.hooks.compilation.tap(
          "@runtime-env/unplugin",
          (compilation: any) => {
            // Find html-rspack-plugin
            const HtmlRspackPlugin = compiler.options.plugins?.find(
              (p: any) => p.constructor.name === "HtmlRspackPlugin",
            )?.constructor as any;

            if (!HtmlRspackPlugin) {
              throw new Error(
                "[@runtime-env/unplugin] interpolate option requires html-rspack-plugin. " +
                  "Install html-rspack-plugin or remove the interpolate option.",
              );
            }

            const hooks = HtmlRspackPlugin.getHooks(compilation);

            if (isDev) {
              // Dev: inject templateParameters with runtime env values
              hooks.beforeTemplateExecution.tapAsync(
                "@runtime-env/unplugin",
                async (data: any, cb: any) => {
                  try {
                    const schemaFile =
                      options.schemaFile || ".runtimeenvschema.json";
                    const globalVariableName =
                      options.globalVariableName || "runtimeEnv";
                    const envValues = await loadEnvValues(
                      schemaFile,
                      globalVariableName,
                      options.interpolate!.envFile,
                    );
                    data.plugin.options.templateParameters = {
                      ...data.plugin.options.templateParameters,
                      [globalVariableName]: envValues,
                    };
                    cb(null, data);
                  } catch (error) {
                    cb(error);
                  }
                },
              );
            }
            // Production: HTML passes through unchanged (no hook needed)
            // Template syntax <%= runtimeEnv.FOO %> is preserved for server-side processing
          },
        );
      }
    },

    // Rollup-specific hooks
    rollup: {
      options(rollupOptions: any) {
        // Detect build mode (assume build unless watch mode)
        isDev = !!rollupOptions.watch;

        // Set default js outputFile based on Rollup's output.dir
        if (options.js && !options.js.outputFile) {
          const outputs = Array.isArray(rollupOptions.output)
            ? rollupOptions.output
            : [rollupOptions.output];
          const output = outputs[0];
          if (output?.dir) {
            options.js.outputFile = path.join(output.dir, "runtime-env.js");
          } else {
            options.js.outputFile = "runtime-env.js";
          }
        }
        return rollupOptions;
      },
    },

    // esbuild-specific hooks
    esbuild: {
      setup(build) {
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

export type { RuntimeEnvOptions, Bundler } from "./types";
