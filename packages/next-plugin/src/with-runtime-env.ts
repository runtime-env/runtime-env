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

    return nextConfig instanceof Function
      ? await nextConfig(phase, context)
      : nextConfig;
  };
}
