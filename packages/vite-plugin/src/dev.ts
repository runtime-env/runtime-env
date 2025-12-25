import type { Plugin, ViteDevServer } from "vite";
import { resolve } from "path";
import { writeFileSync, readFileSync, rmSync, existsSync } from "fs";
import {
  isTypeScriptProject,
  runRuntimeEnvCommand,
  getTempDir,
  getViteEnvFiles,
} from "./utils.js";

const schemaFile = ".runtimeenvschema.json";

export function devPlugin(): Plugin {
  return {
    name: "runtime-env-dev",

    configureServer(server: ViteDevServer) {
      if (server.config.mode === "test") return;

      const envDir = server.config.envDir || server.config.root;
      const envFiles = getViteEnvFiles(server.config.mode, envDir);
      const watchFiles = [schemaFile, ...envFiles];

      function run() {
        const devOutputDir = getTempDir("dev");
        const devOutputPath = resolve(devOutputDir, "runtime-env.js");
        runRuntimeEnvCommand("gen-js", devOutputPath, envFiles);

        if (isTypeScriptProject(server.config.root)) {
          runRuntimeEnvCommand("gen-ts", "src/runtime-env.d.ts");
        }
      }

      run();

      server.middlewares.use((req, res, next) => {
        const base = server.config.base || "/";
        const path = req.url?.split("?")[0];
        const targetPath = (base + "/runtime-env.js").replace(/\/+/g, "/");

        if (path === targetPath) {
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
        const envDir = ctx.server.config.envDir || ctx.server.config.root;
        const envFiles = getViteEnvFiles(ctx.server.config.mode, envDir);

        const tmpDir = getTempDir("dev-interpolate");
        try {
          const htmlFile = resolve(tmpDir, "index.html");
          writeFileSync(htmlFile, html, "utf8");
          runRuntimeEnvCommand("interpolate", htmlFile, envFiles, htmlFile);
          html = readFileSync(htmlFile, "utf8");
          return html;
        } finally {
          rmSync(tmpDir, { recursive: true, force: true });
        }
      }
    },
  };
}
