import { PHASE_PRODUCTION_BUILD } from "next/constants.js";
import { resolve } from "path";
import {
  runRuntimeEnvCommand,
  isTypeScriptProject,
  validateSchema,
  populateRuntimeEnvWithPlaceholders,
} from "./utils.js";

export function withRuntimeEnvPhaseProductionBuild(phase: string): void {
  if (phase !== PHASE_PRODUCTION_BUILD) {
    return;
  }

  const rootDir = process.cwd();
  validateSchema(rootDir);

  if (isTypeScriptProject(rootDir)) {
    const result = runRuntimeEnvCommand(
      "gen-ts",
      resolve(rootDir, "runtime-env.d.ts"),
    );
    if (!result.success) {
      throw new Error(
        `[@runtime-env/next-plugin] gen-ts failed during build:\n${result.stderr}`,
      );
    }
  }

  populateRuntimeEnvWithPlaceholders();
}
