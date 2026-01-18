import { existsSync, mkdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export const schemaFile = ".runtimeenvschema.json";
export const globalVariableName = "runtimeEnv";

declare global {
  var runtimeEnv: Record<string, unknown>;
}

export function isTypeScriptProject(root: string): boolean {
  return existsSync(resolve(root, "tsconfig.json"));
}

export function validateSchema(rootDir: string) {
  const schemaPath = resolve(rootDir, schemaFile);
  if (!existsSync(schemaPath)) return;

  try {
    const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
    if (schema.properties) {
      for (const key of Object.keys(schema.properties)) {
        if (!key.startsWith("NEXT_PUBLIC_")) {
          throw new Error(
            `[@runtime-env/next-plugin] Configuration Error: The key '${key}' does not have the 'NEXT_PUBLIC_' prefix. @runtime-env/next-plugin only supports public environment variables. Please use 'process.env' directly for secret variables.`,
          );
        }
      }
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("Configuration Error")) {
      throw e;
    }
    // Ignore JSON parse errors here, they will be caught by the CLI
  }
}

export function getFilteredEnv(rootDir: string) {
  const schemaPath = resolve(rootDir, schemaFile);
  if (!existsSync(schemaPath)) return {};

  try {
    const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
    const properties = schema.properties || {};
    const filteredEnv: Record<string, string | undefined> = {};

    for (const key of Object.keys(properties)) {
      if (key.startsWith("NEXT_PUBLIC_")) {
        filteredEnv[key] = process.env[key];
      } else if (process.env.NODE_ENV === "development") {
        console.warn(
          `[@runtime-env/next-plugin] Warning: Key '${key}' was found in schema but does not start with 'NEXT_PUBLIC_'. It will be ignored for security reasons.`,
        );
      }
    }

    return filteredEnv;
  } catch (e) {
    return {};
  }
}

export function populateRuntimeEnv() {
  const rootDir = process.cwd();
  const filteredEnv = getFilteredEnv(rootDir);

  if (Object.keys(filteredEnv).length > 0) {
    globalThis.runtimeEnv = filteredEnv;
  }
}

export function validateRuntimeEnv(rootDir: string) {
  const schemaPath = resolve(rootDir, schemaFile);
  if (!existsSync(schemaPath)) return;

  const tempDir = getTempDir("validate");
  const tempFile = resolve(tempDir, "runtime-env.js");

  const result = runRuntimeEnvCommand("gen-js", tempFile);

  if (!result.success) {
    console.error(`[@runtime-env/next-plugin] Runtime Validation Failed:`);
    console.error(result.stderr);
    process.exit(1);
  }
}

export function getNextEnvFiles(
  mode: "development" | "production" | "test",
  rootDir: string,
): string[] {
  const envFiles = [
    ".env",
    ".env.local",
    `.env.${mode}`,
    `.env.${mode}.local`,
  ].reverse();
  // Next.js priority: .env.local (unless test), .env.$(NODE_ENV).local, .env.$(NODE_ENV), .env
  // Actually Next.js order:
  // 1. process.env
  // 2. .env.$(NODE_ENV).local
  // 3. .env.local (not loaded in test)
  // 4. .env.$(NODE_ENV)
  // 5. .env

  const files = [
    `.env.${mode}.local`,
    mode !== "test" ? ".env.local" : null,
    `.env.${mode}`,
    ".env",
  ].filter((f): f is string => f !== null);

  return files
    .map((file) => resolve(rootDir, file))
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
): { success: boolean; stdout: string; stderr: string } {
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
    cliPath = resolve("node_modules", ".bin", "runtime-env");
  }

  const result = spawnSync("node", [cliPath, ...args], { encoding: "utf8" });

  return {
    success: result.status === 0,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

export function getTempDir(subDir: string): string {
  const root = process.cwd();
  const tempDir = resolve(root, "node_modules", ".runtime-env", subDir);
  mkdirSync(tempDir, { recursive: true });
  return tempDir;
}
