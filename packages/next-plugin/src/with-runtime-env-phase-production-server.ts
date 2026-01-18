import { PHASE_PRODUCTION_SERVER } from "next/constants.js";
import { populateRuntimeEnv, validateRuntimeEnv } from "./utils.js";

export function withRuntimeEnvPhaseProductionServer(phase: string): void {
  if (phase !== PHASE_PRODUCTION_SERVER) {
    return;
  }

  const rootDir = process.cwd();
  validateRuntimeEnv(rootDir);
  populateRuntimeEnv();
}
