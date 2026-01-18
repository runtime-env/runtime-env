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
      "((typeof globalThis !== 'undefined' && globalThis.runtimeEnv) || (typeof window !== 'undefined' ? window.runtimeEnv : (typeof process !== 'undefined' && typeof process.env.runtimeEnv === 'string' ? JSON.parse(process.env.runtimeEnv) : (typeof global !== 'undefined' ? global.runtimeEnv : undefined))))";

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
              search: "(?<!['\"`\\.])\\bruntimeEnv\\b(?!['\"`\\s*:])",
              replace: robustAccessPattern,
              flags: "g",
            },
          },
        ];
      }
    }

    // Turbopack configuration (Next.js 16+ root level)
    if (!(finalConfig as any).turbopack) {
      (finalConfig as any).turbopack = {};
    } else {
      (finalConfig as any).turbopack = { ...(finalConfig as any).turbopack };
    }

    const rootTurboObj = (finalConfig as any).turbopack;
    if (!rootTurboObj.rules) {
      rootTurboObj.rules = {};
    } else {
      rootTurboObj.rules = { ...rootTurboObj.rules };
    }

    const extensions = ["*.js", "*.jsx", "*.ts", "*.tsx"];
    for (const ext of extensions) {
      rootTurboObj.rules[ext] = [
        ...(rootTurboObj.rules[ext] || []),
        {
          loader: "string-replace-loader",
          options: {
            search: "(?<!['\"`\\.])\\bruntimeEnv\\b(?!['\"`\\s*:])",
            replace: robustAccessPattern,
            flags: "g",
          },
        },
      ];
    }

    return finalConfig;
  };
}
