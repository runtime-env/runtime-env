import { spawn, spawnSync, type ChildProcess } from "child_process";
import * as fs from "fs";
import type { RuntimeEnvOptions } from "./types";
import { ERROR_MESSAGES } from "./constants";
import {
  getSchemaFile,
  getGlobalVariableName,
  normalizeEnvFiles,
  getTempFilePath,
  cleanupTempFiles,
  buildCliArgs,
  escapeRegExp,
} from "./utils";

/**
 * Holds references to running watch processes.
 */
export interface WatchProcesses {
  genTs?: ChildProcess;
  genJs?: ChildProcess;
}

/**
 * Starts CLI watch processes for TypeScript and JavaScript generation.
 * These processes run continuously during development, watching for changes
 * to schema and environment files.
 *
 * @param options - Plugin options
 * @returns Object containing references to spawned processes
 */
export function startWatchProcesses(
  options: RuntimeEnvOptions,
): WatchProcesses {
  const processes: WatchProcesses = {};
  const schemaFile = getSchemaFile(options);
  const globalVariableName = getGlobalVariableName(options);

  // Start gen-ts watch if ts option is provided
  if (options.ts?.outputFile) {
    const args = buildCliArgs("gen-ts", {
      schemaFile,
      globalVariableName,
      outputFile: options.ts.outputFile,
      watch: true,
    });
    processes.genTs = spawn("npx", args, { stdio: "inherit" });
  }

  // Start gen-js watch if js option is provided
  if (options.js?.outputFile) {
    const args = buildCliArgs("gen-js", {
      schemaFile,
      globalVariableName,
      outputFile: options.js.outputFile,
      envFiles: normalizeEnvFiles(options.js.envFile),
      watch: true,
    });
    processes.genJs = spawn("npx", args, { stdio: "inherit" });
  }

  return processes;
}

/**
 * Stops all running watch processes.
 *
 * @param processes - Watch processes to stop
 */
export function stopWatchProcesses(processes: WatchProcesses): void {
  Object.values(processes).forEach((proc) => {
    if (proc && !proc.killed) {
      proc.kill();
    }
  });
}

/**
 * Generates TypeScript declarations once (for build mode, not watch).
 *
 * @param schemaFile - Path to schema file
 * @param output - Output path for TypeScript declarations
 * @param globalVariableName - Global variable name
 * @returns Promise that resolves when generation completes
 */
export async function genTypes(
  schemaFile: string,
  output: string,
  globalVariableName?: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = buildCliArgs("gen-ts", {
      schemaFile,
      globalVariableName,
      outputFile: output,
    });
    const proc = spawn("npx", args, { stdio: "inherit" });
    proc.on("close", (code) => (code === 0 ? resolve() : reject()));
  });
}

/**
 * Interpolates HTML content inline using the CLI.
 * This is used by Vite in development mode to transform HTML with runtime env values.
 *
 * @param html - HTML content to interpolate
 * @param schemaFile - Path to schema file
 * @param globalVariableName - Global variable name
 * @param envFile - Environment file(s) to load
 * @returns Promise resolving to interpolated HTML
 */
export async function interpolateHtml(
  html: string,
  schemaFile: string,
  globalVariableName: string,
  envFile?: string | string[],
): Promise<string> {
  const tempInput = getTempFilePath("-in.html");
  const tempOutput = getTempFilePath("-out.html");
  
  fs.writeFileSync(tempInput, html);

  try {
    const args = buildCliArgs("interpolate", {
      schemaFile,
      globalVariableName,
      inputFile: tempInput,
      outputFile: tempOutput,
      envFiles: normalizeEnvFiles(envFile),
    });

    const result = spawnSync("npx", args, { stdio: "pipe" });
    if (result.status !== 0) {
      throw new Error(
        ERROR_MESSAGES.CLI_COMMAND_FAILED(
          "interpolate",
          result.stderr?.toString() || "Unknown error",
        ),
      );
    }

    const interpolated = fs.readFileSync(tempOutput, "utf-8");
    cleanupTempFiles(tempInput, tempOutput);
    return interpolated;
  } catch (error) {
    cleanupTempFiles(tempInput, tempOutput);
    throw error;
  }
}

/**
 * Loads environment values as an object for use with Webpack/Rspack templateParameters.
 * Generates a temporary JavaScript file and extracts the values.
 *
 * @param schemaFile - Path to schema file
 * @param globalVariableName - Global variable name
 * @param envFile - Environment file(s) to load
 * @returns Promise resolving to object with environment values
 */
export async function loadEnvValues(
  schemaFile: string,
  globalVariableName: string,
  envFile?: string | string[],
): Promise<Record<string, unknown>> {
  const tempOutput = getTempFilePath(".js");

  try {
    const args = buildCliArgs("gen-js", {
      schemaFile,
      globalVariableName,
      outputFile: tempOutput,
      envFiles: normalizeEnvFiles(envFile),
    });

    const result = spawnSync("npx", args, { stdio: "pipe" });
    if (result.status !== 0) {
      throw new Error(
        ERROR_MESSAGES.CLI_COMMAND_FAILED(
          "gen-js",
          result.stderr?.toString() || "Unknown error",
        ),
      );
    }

    const jsContent = fs.readFileSync(tempOutput, "utf-8");
    const envValues = extractEnvValuesFromJs(jsContent, globalVariableName);
    
    cleanupTempFiles(tempOutput);
    return envValues;
  } catch (error) {
    cleanupTempFiles(tempOutput);
    throw error;
  }
}

/**
 * Extracts environment values from generated JavaScript content.
 * @private
 */
function extractEnvValuesFromJs(
  jsContent: string,
  globalVariableName: string,
): Record<string, unknown> {
  const globalVarPattern = escapeRegExp(globalVariableName);
  const regex = new RegExp(
    `(?:window|globalThis)\\[['"]${globalVarPattern}['"]\\]\\s*=\\s*({[\\s\\S]+?});`,
  );
  const matches = jsContent.match(regex);

  if (matches && matches[1]) {
    try {
      return JSON.parse(matches[1]);
    } catch (parseError) {
      console.error("Failed to parse environment values:", parseError);
      return {};
    }
  }

  return {};
}

/**
 * Loads environment variable keys from the schema file.
 * This is useful for production builds where we need to know which variables exist
 * without loading their actual values.
 *
 * @param schemaFile - Path to schema file
 * @returns Promise resolving to array of environment variable keys
 */
export async function loadEnvKeys(schemaFile: string): Promise<string[]> {
  try {
    const schemaContent = fs.readFileSync(schemaFile, "utf-8");
    const schema = JSON.parse(schemaContent);

    // Extract keys from the schema properties
    if (schema && typeof schema === "object" && schema.properties) {
      return Object.keys(schema.properties);
    }

    return [];
  } catch (error) {
    console.error("Failed to load schema file:", error);
    return [];
  }
}
