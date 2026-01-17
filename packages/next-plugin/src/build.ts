import { resolve } from "path";
import {
  runRuntimeEnvCommand,
  isTypeScriptProject,
  populateRuntimeEnv,
  validateSchema,
} from "./utils.js";

export function runBuildLogic(rootDir: string) {
  validateSchema(rootDir);
  populateRuntimeEnv();

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
}
