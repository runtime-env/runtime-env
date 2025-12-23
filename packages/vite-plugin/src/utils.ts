import type { Plugin, UserConfig, ConfigEnv, ViteDevServer } from "vite";
import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  existsSync,
  rmSync,
  mkdirSync,
} from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";

import { Options, optionSchema } from "./types.js";

export const schemaFile = ".runtimeenvschema.json";
export const globalVariableName = "runtimeEnv";

export function getRuntimeEnvCommandLineArgs(
  command: string,
  options: Options,
  outputFile: string,
  inputFile?: string,
): string[] {
  const { genTs, genJs, interpolateIndexHtml } = optionSchema.parse(options);
  let args: string[] = [
    "--schema-file",
    schemaFile,
    "--global-variable-name",
    globalVariableName,
    command,
  ];

  if (command === "gen-ts" && genTs) {
    args.push("--output-file", outputFile);
  } else if (command === "gen-js" && genJs) {
    args.push(...genJs.envFile.map((file) => ["--env-file", file]).flat());
    args.push("--output-file", outputFile);
  } else if (command === "interpolate" && interpolateIndexHtml && inputFile) {
    args.push(
      ...interpolateIndexHtml.envFile
        .map((file) => ["--env-file", file])
        .flat(),
    );
    args.push("--input-file", inputFile, "--output-file", outputFile);
  }

  return args;
}

export function runRuntimeEnvCommand(
  command: string,
  options: Options,
  outputFile: string,
  inputFile?: string,
) {
  const args = getRuntimeEnvCommandLineArgs(
    command,
    options,
    outputFile,
    inputFile,
  );
  spawnSync("node", [resolve("node_modules", ".bin", "runtime-env"), ...args]);
}

export function transformHtml(
  html: string,
  options: Options,
  isBuild: boolean,
  isPreview: boolean,
): string {
  const { interpolateIndexHtml } = optionSchema.parse(options);

  html = html.replace(
    `</head>`,
    `<script src="/runtime-env.js"></script></head>`,
  );

  if (isBuild) {
    return html;
  }
  if (!interpolateIndexHtml) {
    return html;
  }

  const tmpDir = resolve(
    process.env.GEMINI_TEMP_DIR || "./.vite-runtime-env",
    "runtime-env-vite-plugin",
  );
  mkdirSync(tmpDir, { recursive: true });
  const htmlFile = resolve(tmpDir, "index.html");
  writeFileSync(htmlFile, html, "utf8");
  runRuntimeEnvCommand("interpolate", options, htmlFile, htmlFile);
  html = readFileSync(htmlFile, "utf8");
  rmSync(tmpDir, { recursive: true });
  return html;
}
