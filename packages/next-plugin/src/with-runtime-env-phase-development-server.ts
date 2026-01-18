import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import { resolve } from "path";
import { watch, type FSWatcher } from "chokidar";
import {
  runRuntimeEnvCommand,
  getNextEnvFiles,
  schemaFile,
  isTypeScriptProject,
  populateRuntimeEnv,
  setRuntimeEnvError,
  clearSchemaCache,
} from "./utils.js";

let watcher: FSWatcher | null = null;

function startDevWatcher(rootDir: string) {
  if (watcher) return;

  const runGenTs = () => {
    if (isTypeScriptProject(rootDir)) {
      const result = runRuntimeEnvCommand(
        "gen-ts",
        resolve(rootDir, "runtime-env.d.ts"),
      );
      if (!result.success) {
        console.error(
          `[@runtime-env/next-plugin] gen-ts failed:\n${result.stderr}`,
        );
        setRuntimeEnvError(result.stderr);
      } else {
        setRuntimeEnvError(null);
      }
    }
  };

  // Initial run
  runGenTs();

  const envFiles = getNextEnvFiles("development", rootDir);
  const filesToWatch = [schemaFile, ...envFiles];

  watcher = watch(filesToWatch, {
    ignoreInitial: true,
    cwd: rootDir,
  });

  watcher.on("all", () => {
    clearSchemaCache();
    runGenTs();
    populateRuntimeEnv();
  });

  process.on("exit", () => {
    watcher?.close();
  });

  process.on("SIGINT", () => {
    watcher?.close();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    watcher?.close();
    process.exit(0);
  });
}

export function withRuntimeEnvPhaseDevelopmentServer(phase: string): void {
  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    return;
  }

  const rootDir = process.cwd();
  startDevWatcher(rootDir);
  populateRuntimeEnv();
}
