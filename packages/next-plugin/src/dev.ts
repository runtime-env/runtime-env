import { resolve } from "path";
import { watch, type FSWatcher } from "chokidar";
import {
  runRuntimeEnvCommand,
  getNextEnvFiles,
  schemaFile,
  isTypeScriptProject,
} from "./utils.js";

let watcher: FSWatcher | null = null;

declare global {
  var __RUNTIME_ENV_ERROR__: string | null | undefined;
}

export function startDevWatcher(rootDir: string) {
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
        globalThis.__RUNTIME_ENV_ERROR__ = result.stderr;
      } else {
        globalThis.__RUNTIME_ENV_ERROR__ = null;
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
    runGenTs();
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
