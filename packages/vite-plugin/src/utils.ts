import { existsSync, mkdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";
import { createRequire } from "module";
import type { Logger, ViteDevServer } from "vite";

const require = createRequire(import.meta.url);

const schemaFile = ".runtimeenvschema.json";
const globalVariableName = "runtimeEnv";

let lastErrorMessage: string | null = null;

/**
 * Clears the last error message to allow it to be logged again.
 * This should be called when the plugin recovers from an error state.
 */
export function clearLastError() {
  lastErrorMessage = null;
}

export function logError(
  logger: Logger | undefined,
  message: string,
  error?: any,
  server?: ViteDevServer,
) {
  const prefix = "[@runtime-env/vite-plugin]";
  const fullMessage = `${prefix} ${message}`;

  const errorDetails = error
    ? typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : JSON.stringify(error)
    : "";

  const completeErrorMessage = errorDetails
    ? `${fullMessage}\n${errorDetails}`
    : fullMessage;

  if (completeErrorMessage !== lastErrorMessage) {
    if (!logger) {
      console.error(fullMessage);
      if (error) console.error(errorDetails);
    } else {
      logger.error(fullMessage, { timestamp: true });
      if (error) {
        logger.error(errorDetails, { timestamp: true });
      }
    }
    lastErrorMessage = completeErrorMessage;
  }

  if (server) {
    server.ws.send({
      type: "error",
      err: {
        message: completeErrorMessage,
        stack: "",
      },
    });
  }
}

export function validateSchema(
  root: string,
  envPrefix: string | string[] = "VITE_",
): { success: boolean; message?: string } {
  const schemaPath = resolve(root, schemaFile);
  if (!existsSync(schemaPath)) {
    return { success: true };
  }

  try {
    const schemaContent = readFileSync(schemaPath, "utf-8");
    const schema = JSON.parse(schemaContent);

    if (schema.type !== "object" || !schema.properties) {
      return { success: true }; // Let the CLI handle invalid schema format
    }

    const keys = Object.keys(schema.properties);
    const prefixes = Array.isArray(envPrefix) ? envPrefix : [envPrefix];

    const invalidKeys = keys.filter(
      (key) => !prefixes.some((prefix) => key.startsWith(prefix)),
    );

    if (invalidKeys.length > 0) {
      return {
        success: false,
        message: `The following keys in ${schemaFile} do not match any of the allowed env prefixes (${prefixes.join(
          ", ",
        )}): ${invalidKeys.join(", ")}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to parse ${schemaFile}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  return { success: true };
}

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
    // Fallback to local node_modules/.bin if require.resolve fails (e.g. during development or in some monorepo setups)
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

export function hasRuntimeEnvScript(html: string, base: string): boolean {
  // Normalize base: ensure it starts with / and doesn't end with / (unless it's just /)
  const normalizedBase = base.startsWith("/") ? base : `/${base}`;
  const finalBase =
    normalizedBase.endsWith("/") && normalizedBase.length > 1
      ? normalizedBase.slice(0, -1)
      : normalizedBase;

  const expectedSrc = `${finalBase === "/" ? "" : finalBase}/runtime-env.js`;

  // Regex to find script tag with src matching runtime-env.js
  // It accounts for varying whitespace, attribute order, and quote types.
  const scriptRegex =
    /<script\b[^>]*?\bsrc\s*=\s*(['"])([^'"]*\/runtime-env\.js)\1[^>]*?>\s*<\/script>/gi;

  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    const src = match[2];
    if (src === expectedSrc || src === "/runtime-env.js") {
      return true;
    }
  }

  return false;
}
