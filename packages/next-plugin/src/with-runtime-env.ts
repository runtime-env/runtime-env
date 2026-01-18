import type { NextConfig } from "next";
import { withRuntimeEnvPhaseDevelopmentServer } from "./with-runtime-env-phase-development-server.js";
import { withRuntimeEnvPhaseProductionBuild } from "./with-runtime-env-phase-production-build.js";
import { withRuntimeEnvPhaseProductionServer } from "./with-runtime-env-phase-production-server.js";

export function withRuntimeEnv(
  nextConfig:
    | NextConfig
    | ((
        phase: string,
        { defaultNextConfig }: { defaultNextConfig: NextConfig },
      ) => NextConfig | Promise<NextConfig>) = {},
) {
  return async (
    phase: string,
    context: { defaultNextConfig: NextConfig },
  ): Promise<NextConfig> => {
    withRuntimeEnvPhaseProductionServer(phase);
    withRuntimeEnvPhaseProductionBuild(phase);
    withRuntimeEnvPhaseDevelopmentServer(phase);

    const resolvedConfig =
      nextConfig instanceof Function
        ? await nextConfig(phase, context)
        : nextConfig;

    // Clone the config to avoid read-only property errors
    const finalConfig = { ...resolvedConfig };

    const robustAccessPattern =
      "(typeof window !== 'undefined' ? window.runtimeEnv : (globalThis.runtimeEnv || (globalThis.runtimeEnv = (typeof process !== 'undefined' && typeof process.env.runtimeEnv === 'string' ? JSON.parse(process.env.runtimeEnv) : (typeof process !== 'undefined' ? process.env.runtimeEnv : undefined)))))";

    // Webpack configuration
    const originalWebpack = finalConfig.webpack;
    finalConfig.webpack = (config: any, options: any) => {
      const { webpack } = options;
      config.plugins.push(
        new webpack.DefinePlugin({
          runtimeEnv: robustAccessPattern,
        }),
      );

      if (typeof originalWebpack === "function") {
        return originalWebpack(config, options);
      }
      return config;
    };

    // Turbopack configuration (Next.js 15+)
    // We use multiple patterns for compatibility across Next.js versions.
    if (!finalConfig.experimental) {
      finalConfig.experimental = {};
    } else {
      finalConfig.experimental = { ...finalConfig.experimental };
    }

    const turboKeys = ["turbo", "turbopack"];
    for (const key of turboKeys) {
      if (!(finalConfig.experimental as any)[key]) {
        (finalConfig.experimental as any)[key] = {};
      } else {
        (finalConfig.experimental as any)[key] = {
          ...(finalConfig.experimental as any)[key],
        };
      }

      const turboObj = (finalConfig.experimental as any)[key];

      // 1. Try defines
      turboObj.defines = {
        ...(turboObj.defines || {}),
        runtimeEnv: robustAccessPattern,
      };

      // 2. Try rules with string-replace-loader
      if (!turboObj.rules) {
        turboObj.rules = {};
      } else {
        turboObj.rules = { ...turboObj.rules };
      }

      const extensions = ["*.js", "*.jsx", "*.ts", "*.tsx"];
      for (const ext of extensions) {
        turboObj.rules[ext] = [
          ...(turboObj.rules[ext] || []),
          {
            loader: "string-replace-loader",
            options: {
              search: "\\bruntimeEnv\\b",
              replace: robustAccessPattern,
              flags: "g",
            },
          },
        ];
      }
    }

    return finalConfig;
  };
}
