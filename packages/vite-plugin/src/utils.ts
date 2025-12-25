import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const schemaFile = ".runtimeenvschema.json";
const globalVariableName = "runtimeEnv";

export function isTypeScriptProject(root: string): boolean {
  return existsSync(resolve(root, "tsconfig.json"));
}

export function getViteEnvFiles(mode: string, envDir: string): string[] {
  const envFiles = [".env", ".env.local", `.env.${mode}`, `.env.${mode}.local`];

  return envFiles
    .map((file) => resolve(envDir, file))
    .filter((file) => existsSync(file));
}

export function getRuntimeEnvCommandLineArgs(
  command: string,
  outputFile: string,
  envFiles: string[] = [],
  inputFile?: string,
): string[] {
  let args: string[] = [
    "--schema-file",
    schemaFile,
    "--global-variable-name",
    globalVariableName,
    command,
  ];

  if (command === "gen-ts") {
    args.push("--output-file", outputFile);
  } else if (command === "gen-js") {
    args.push(...envFiles.map((file) => ["--env-file", file]).flat());
    args.push("--output-file", outputFile);
  } else if (command === "interpolate" && inputFile) {
    args.push(...envFiles.map((file) => ["--env-file", file]).flat());
    args.push("--input-file", inputFile, "--output-file", outputFile);
  }

  return args;
}

export function runRuntimeEnvCommand(
  command: string,
  outputFile: string,
  envFiles: string[] = [],
  inputFile?: string,
) {
  const args = getRuntimeEnvCommandLineArgs(
    command,
    outputFile,
    envFiles,
    inputFile,
  );

  let cliPath: string;
  try {
    cliPath = require.resolve("@runtime-env/cli/bin/runtime-env.js");
  } catch (e) {
    // Fallback to local node_modules/.bin if require.resolve fails (e.g. during development or in some monorepo setups)
    cliPath = resolve("node_modules", ".bin", "runtime-env");
  }

  spawnSync("node", [cliPath, ...args]);
}

export function getTempDir(subDir: string): string {
  const root = process.cwd();
  const tempDir = resolve(root, "node_modules", ".runtime-env", subDir);
  mkdirSync(tempDir, { recursive: true });
  return tempDir;
}
