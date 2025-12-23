import type { Plugin, PreviewServer } from "vite";
import { resolve } from "path";
import { copyFileSync, existsSync } from "fs";
import { spawnSync } from "child_process";
import { Options, optionSchema } from "./types.js";

const schemaFile = ".runtimeenvschema.json";
const globalVariableName = "runtimeEnv";

function getRuntimeEnvCommandLineArgs(
  command: string,
  options: Options,
  outputFile: string,
  inputFile?: string,
): string[] {
  const { genJs, interpolateIndexHtml } = optionSchema.parse(options);
  let args: string[] = [
    "--schema-file",
    schemaFile,
    "--global-variable-name",
    globalVariableName,
    command,
  ];

  if (command === "gen-ts") {
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

function runRuntimeEnvCommand(
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

export function previewPlugin(options: Options): Plugin {
  return {
    name: "runtime-env-preview",

    configurePreviewServer(server: PreviewServer) {
      const { genJs, interpolateIndexHtml } = optionSchema.parse(options);

      if (genJs) {
        runRuntimeEnvCommand(
          "gen-js",
          options,
          resolve("dist", "runtime-env.js"),
        );
      }
      if (interpolateIndexHtml) {
        if (existsSync("dist/index.html.backup") === false) {
          copyFileSync("dist/index.html", "dist/index.html.backup");
        }
        runRuntimeEnvCommand(
          "interpolate",
          options,
          resolve("dist", "index.html"),
          resolve("dist", "index.html.backup"),
        );
      }
    },
  };
}
