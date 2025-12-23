import type { Plugin, UserConfig, ConfigEnv, ResolvedConfig } from "vite";
import { resolve } from "path";
import { rmSync } from "fs";
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

export function buildPlugin(options: Options): Plugin {
  return {
    name: "runtime-env-build",

    config(config: UserConfig, configEnv: ConfigEnv) {
      if (configEnv.command === "build") {
        if (options.genTs && options.genTs.outputFile) {
          runRuntimeEnvCommand("gen-ts", options, options.genTs.outputFile);
        }
      }
    },

    configResolved(config: ResolvedConfig) {
      if (config.command === "build") {
        if (options.genJs) {
          const publicDir =
            typeof config.publicDir === "string" ? config.publicDir : "";
          rmSync(resolve(publicDir, "runtime-env.js"), { force: true });
        }
      }
    },

    transformIndexHtml(html, ctx) {
      if (!ctx.server) {
        // isBuild
        html = html.replace(
          `</head>`,
          `<script src="/runtime-env.js"></script></head>`,
        );
        return html;
      }
    },
  };
}
