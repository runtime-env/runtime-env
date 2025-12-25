import type { Plugin, ViteDevServer, ResolvedConfig } from "vite";
import { resolve } from "path";
import { spawnSync } from "child_process";
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "fs";
import { Options, optionSchema } from "./types.js";
import { isTypeScriptProject } from "./utils.js";

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

export function devPlugin(options: Options): Plugin {
  return {
    name: "runtime-env-dev",

    configResolved(config: ResolvedConfig) {
      if (config.command === "serve" && !(config as any).isPreview) {
        if (options.genJs) {
          const publicDir =
            typeof config.publicDir === "string" ? config.publicDir : "";
          runRuntimeEnvCommand(
            "gen-js",
            options,
            resolve(publicDir, "runtime-env.js"),
          );
        }
      }
    },

    configureServer(server: ViteDevServer) {
      if (server.config.mode === "test") return;

      const watchFiles = [schemaFile];
      if (options.genJs && options.genJs.envFile) {
        watchFiles.push(...options.genJs.envFile);
      }

      function run() {
        const publicDir =
          typeof (server.config as ResolvedConfig).publicDir === "string"
            ? (server.config as ResolvedConfig).publicDir
            : "";
        if (options.genJs) {
          runRuntimeEnvCommand(
            "gen-js",
            options,
            resolve(publicDir, "runtime-env.js"),
          );
        }
        if (isTypeScriptProject(server.config.root)) {
          runRuntimeEnvCommand("gen-ts", options, "src/runtime-env.d.ts");
        }
      }

      run();
      server.watcher.add(watchFiles);
      server.watcher.on("change", (file) => {
        if (watchFiles.includes(file)) {
          run();
        }
      });
    },

    transformIndexHtml(html, ctx) {
      if (ctx.server && ctx.server.config.command === "serve") {
        const { interpolateIndexHtml } = optionSchema.parse(options);

        if (!interpolateIndexHtml) {
          return html;
        }

        const tmpDir = resolve(
          process.env.GEMINI_TEMP_DIR || "./.vite-runtime-env",
          "runtime-env-vite-plugin-dev",
        );
        mkdirSync(tmpDir, { recursive: true });
        const htmlFile = resolve(tmpDir, "index.html");
        writeFileSync(htmlFile, html, "utf8");
        runRuntimeEnvCommand("interpolate", options, htmlFile, htmlFile);
        html = readFileSync(htmlFile, "utf8");
        rmSync(tmpDir, { recursive: true });
        return html;
      }
    },
  };
}
