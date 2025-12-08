import * as crypto from "crypto";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { RuntimeEnvOptions } from "./types";
import {
  DEFAULT_SCHEMA_FILE,
  DEFAULT_GLOBAL_VARIABLE_NAME,
  CLI_BIN_NAME,
} from "./constants";

/**
 * Gets the schema file path from options or default.
 */
export function getSchemaFile(options: RuntimeEnvOptions): string {
  return options.schemaFile || DEFAULT_SCHEMA_FILE;
}

/**
 * Gets the global variable name from options or default.
 */
export function getGlobalVariableName(options: RuntimeEnvOptions): string {
  return options.globalVariableName || DEFAULT_GLOBAL_VARIABLE_NAME;
}

/**
 * Normalizes env file(s) to an array.
 */
export function normalizeEnvFiles(
  envFile?: string | string[],
): string[] {
  return Array.isArray(envFile) ? envFile : envFile ? [envFile] : [];
}

/**
 * Generates a unique temporary file path.
 */
export function getTempFilePath(suffix: string): string {
  const uniqueId = crypto.randomBytes(8).toString("hex");
  return path.join(os.tmpdir(), `runtime-env-${uniqueId}${suffix}`);
}

/**
 * Safely cleans up temporary files.
 */
export function cleanupTempFiles(...filePaths: string[]): void {
  filePaths.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        // Silently ignore cleanup errors
        console.warn(`Failed to cleanup temp file: ${filePath}`, error);
      }
    }
  });
}

/**
 * Builds CLI command arguments for common operations.
 */
export function buildCliArgs(
  command: string,
  options: {
    schemaFile: string;
    globalVariableName?: string;
    outputFile?: string;
    inputFile?: string;
    envFiles?: string[];
    watch?: boolean;
  },
): string[] {
  const args: string[] = [CLI_BIN_NAME];

  if (options.watch) {
    args.push("--watch");
  }

  args.push("--schema-file", options.schemaFile);

  if (options.globalVariableName) {
    args.push("--global-variable-name", options.globalVariableName);
  }

  args.push(command);

  if (options.outputFile) {
    args.push("--output-file", options.outputFile);
  }

  if (options.inputFile) {
    args.push("--input-file", options.inputFile);
  }

  if (options.envFiles) {
    options.envFiles.forEach((file) => args.push("--env-file", file));
  }

  return args;
}

/**
 * Escapes special characters in a string for use in a regular expression.
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
