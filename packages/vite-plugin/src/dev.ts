import type { Plugin, ViteDevServer, ResolvedConfig } from "vite";
import { resolve } from "path";
import { writeFileSync, readFileSync, rmSync, existsSync } from "fs";
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

    configureServer(server: ViteDevServer) {
      if (server.config.mode === "test") return;

      const watchFiles = [schemaFile];
      if (options.genJs && options.genJs.envFile) {
        watchFiles.push(...options.genJs.envFile);
      }

      function run() {
        if (options.genJs) {
          const devOutputDir = getTempDir("dev");
          const devOutputPath = resolve(devOutputDir, "runtime-env.js");
          runRuntimeEnvCommand("gen-js", options, devOutputPath);
        }
        if (isTypeScriptProject(server.config.root)) {
          runRuntimeEnvCommand("gen-ts", options, "src/runtime-env.d.ts");
        }
      }

      run();

      server.middlewares.use((req, res, next) => {
        const base = server.config.base || "/";
        const path = req.url?.split("?")[0];
        const targetPath = (base + "/runtime-env.js").replace(/\/+/g, "/");

        if (path === targetPath && options.genJs) {
          const devOutputDir = getTempDir("dev");
          const devOutputPath = resolve(devOutputDir, "runtime-env.js");
          if (existsSync(devOutputPath)) {
            res.setHeader("Content-Type", "application/javascript");
            res.end(readFileSync(devOutputPath, "utf8"));
            return;
          }
        }
        next();
      });

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

        const tmpDir = getTempDir("dev-interpolate");
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
