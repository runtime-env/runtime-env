import { spawn, type ChildProcess } from "child_process";
import { execSync } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { RuntimeEnvOptions } from "./types";

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
  const schemaFile = options.schemaFile || ".runtimeenvschema.json";
  const globalVarName = options.globalVariableName || "runtimeEnv";

  // Start gen-ts watch if ts option is provided
  if (options.ts?.outputFile) {
    const args = [
      "@runtime-env/cli",
      "--watch",
      "--schema-file",
      schemaFile,
      "--global-variable-name",
      globalVarName,
      "gen-ts",
      "--output-file",
      options.ts.outputFile,
    ];
    processes.genTs = spawn("npx", args, { stdio: "inherit" });
  }

  // Start gen-js watch if js option is provided
  if (options.js?.outputFile) {
    const envFiles = Array.isArray(options.js.envFile)
      ? options.js.envFile
      : options.js.envFile
        ? [options.js.envFile]
        : [];

    const args = [
      "@runtime-env/cli",
      "--watch",
      "--schema-file",
      schemaFile,
      "--global-variable-name",
      globalVarName,
      "gen-js",
      "--output-file",
      options.js.outputFile,
    ];
    envFiles.forEach((f) => args.push("--env-file", f));
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
    const args = [
      "@runtime-env/cli",
      "--schema-file",
      schemaFile,
      "gen-ts",
      "--output-file",
      output,
    ];
    if (globalVariableName) {
      args.splice(2, 0, "--global-variable-name", globalVariableName);
    }
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
  const envFiles = Array.isArray(envFile) ? envFile : envFile ? [envFile] : [];

  // Write HTML to temp file
  const tempInput = path.join(os.tmpdir(), `runtime-env-${Date.now()}.html`);
  const tempOutput = path.join(
    os.tmpdir(),
    `runtime-env-${Date.now()}-out.html`,
  );
  fs.writeFileSync(tempInput, html);

  const args = [
    "npx",
    "@runtime-env/cli",
    "--schema-file",
    schemaFile,
    "--global-variable-name",
    globalVariableName,
    "interpolate",
    "--input-file",
    tempInput,
    "--output-file",
    tempOutput,
  ];
  envFiles.forEach((f) => args.push("--env-file", f));

  try {
    execSync(args.join(" "), { stdio: "pipe" });
    const result = fs.readFileSync(tempOutput, "utf-8");

    // Cleanup
    fs.unlinkSync(tempInput);
    fs.unlinkSync(tempOutput);

    return result;
  } catch (error) {
    // Cleanup on error
    if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
    if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
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
): Promise<Record<string, any>> {
  const envFiles = Array.isArray(envFile) ? envFile : envFile ? [envFile] : [];

  // Use CLI to generate JS temporarily and parse it to extract values
  const tempOutput = path.join(os.tmpdir(), `runtime-env-${Date.now()}.js`);

  const args = [
    "npx",
    "@runtime-env/cli",
    "--schema-file",
    schemaFile,
    "--global-variable-name",
    globalVariableName,
    "gen-js",
    "--output-file",
    tempOutput,
  ];
  envFiles.forEach((f) => args.push("--env-file", f));

  try {
    execSync(args.join(" "), { stdio: "pipe" });
    const jsContent = fs.readFileSync(tempOutput, "utf-8");

    // Parse the generated JS to extract values
    // The JS file assigns to window[globalVariableName], extract that object
    const globalVarPattern = globalVariableName.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    const matches = jsContent.match(
      new RegExp(
        `(?:window|globalThis)\\[['"]${globalVarPattern}['"]\\]\\s*=\\s*({[^;]+});`,
      ),
    );

    if (matches && matches[1]) {
      const envValues = JSON.parse(matches[1]);
      fs.unlinkSync(tempOutput);
      return envValues;
    }

    fs.unlinkSync(tempOutput);
    return {};
  } catch (error) {
    // Cleanup on error
    if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
    throw error;
  }
}
