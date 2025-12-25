import type { Plugin, ViteDevServer, ResolvedConfig } from "vite";
import { resolve } from "path";
import { writeFileSync, readFileSync, rmSync } from "fs";
import { Options, optionSchema } from "./types.js";
import {
  isTypeScriptProject,
  runRuntimeEnvCommand,
  getTempDir,
} from "./utils.js";

const schemaFile = ".runtimeenvschema.json";

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

        const tmpDir = getTempDir("dev");
        try {
          const htmlFile = resolve(tmpDir, "index.html");
          writeFileSync(htmlFile, html, "utf8");
          runRuntimeEnvCommand("interpolate", options, htmlFile, htmlFile);
          html = readFileSync(htmlFile, "utf8");
          return html;
        } finally {
          rmSync(tmpDir, { recursive: true, force: true });
        }
      }
    },
  };
}
