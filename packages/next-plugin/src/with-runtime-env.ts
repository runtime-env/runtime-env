import type { NextConfig } from "next";
import { withRuntimeEnvPhaseDevelopmentServer } from "./with-runtime-env-phase-development-server.js";
import { withRuntimeEnvPhaseProductionBuild } from "./with-runtime-env-phase-production-build.js";
import { withRuntimeEnvPhaseProductionServer } from "./with-runtime-env-phase-production-server.js";
import { withRuntimeEnvWebpack } from "./with-runtime-env-webpack.js";
import { withRuntimeEnvExperimentalTurbo } from "./with-runtime-env-experimental-turbo.js";
import { withRuntimeEnvTurbopack } from "./with-runtime-env-turbopack.js";

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

    const finalConfig = { ...resolvedConfig };
    withRuntimeEnvWebpack(finalConfig);
    withRuntimeEnvExperimentalTurbo(finalConfig);
    withRuntimeEnvTurbopack(finalConfig);
    return finalConfig;
  };
}
