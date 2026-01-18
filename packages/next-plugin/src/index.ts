import type { NextConfig } from "next";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} from "next/constants.js";
import {
  getFilteredEnv,
  populateRuntimeEnv,
  validateSchema,
  validateRuntimeEnv,
  globalVariableName,
} from "./utils.js";

// Populate runtimeEnv as soon as the module is loaded.
// This ensures availability in build workers and other processes that import this module.
populateRuntimeEnv();

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
    const rootDir = process.cwd();

    // Early validation of schema to ensure NEXT_PUBLIC_ prefix enforcement
    validateSchema(rootDir);

    if (phase === PHASE_PRODUCTION_SERVER) {
      validateRuntimeEnv(rootDir);
    }

    let resolvedConfig: NextConfig;
    if (typeof nextConfig === "function") {
      resolvedConfig = await nextConfig(phase, context);
    } else {
      resolvedConfig = nextConfig;
    }

    if (phase === PHASE_DEVELOPMENT_SERVER) {
      const { startDevWatcher } = await import("./dev.js");
      startDevWatcher(rootDir);
    } else if (phase === PHASE_PRODUCTION_BUILD) {
      const { runBuildLogic } = await import("./build.js");
      runBuildLogic(rootDir);
    }

    // This proxy approach ensures that runtimeEnv is available in all processes (including build workers)
    // by delegating to process.env on the server, while falling back to globalThis.runtimeEnv on the client.
    const runtimeEnvDefine = `((typeof process !== 'undefined' && process.env) ? new Proxy(process.env, { get: (t, p) => typeof p === 'string' && p.startsWith('NEXT_PUBLIC_') ? t[p] : undefined }) : (globalThis.${globalVariableName} || {}))`;

    const filteredEnv = getFilteredEnv(rootDir);

    const finalConfig: NextConfig = {
      ...resolvedConfig,
      // Pass filtered env to all processes via process.env
      env: {
        ...resolvedConfig.env,
        ...filteredEnv,
      },
      webpack: (config, options) => {
        const { webpack } = options;
        config.plugins.push(
          new webpack.DefinePlugin({
            [globalVariableName]: runtimeEnvDefine,
          }),
        );

        if (typeof resolvedConfig.webpack === "function") {
          return resolvedConfig.webpack(config, options);
        }
        return config;
      },
    };

    // Next.js 15+ Turbopack configuration
    // Try both experimental.turbo and root turbo
    const turboDefine = {
      [globalVariableName]: runtimeEnvDefine,
    };

    if (!finalConfig.experimental) {
      finalConfig.experimental = {};
    }

    const exp = finalConfig.experimental as NonNullable<
      NextConfig["experimental"]
    > & { turbo?: { defines?: Record<string, string> } };
    if (exp.turbo) {
      exp.turbo.defines = { ...exp.turbo.defines, ...turboDefine };
    }

    const rootTurbo = (
      finalConfig as NextConfig & {
        turbo?: { defines?: Record<string, string> };
      }
    ).turbo;
    if (rootTurbo) {
      rootTurbo.defines = {
        ...rootTurbo.defines,
        ...turboDefine,
      };
    }

    return finalConfig;
  };
}

export * from "./components.js";
